"""
HuffZip — Main FastAPI Application
All routes + WebSocket endpoint for live compression events.
"""

import os
import uuid
import asyncio
from typing import Optional

from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from dotenv import load_dotenv

load_dotenv()

from huffman_engine import compress_file, format_size
from decompressor import decompress_file
from event_streamer import streamer
from file_handler import validate_file, detect_file_type, get_compression_warning
from stats import get_stats, update_stats

# ━━━ App Setup ━━━
app = FastAPI(
    title="HuffZip API",
    description="Huffman Coding File Compression — ADA Unit 4 Greedy Algorithm",
    version="1.0.0"
)

# CORS — supports comma-separated list (e.g. "https://huffzip.pages.dev,http://localhost:5173")
CORS_ORIGIN = os.getenv("CORS_ORIGIN", "http://localhost:5173")
_origins = [o.strip() for o in CORS_ORIGIN.split(",") if o.strip()]
_origins.extend(["http://localhost:5173", "http://localhost:3000"])
_origins = list(dict.fromkeys(_origins))  # dedupe, preserve order

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_origin_regex=r"https://.*\.pages\.dev",  # allow all Cloudflare Pages preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "X-Original-Size", "X-Compressed-Size", "X-Time-Ms", "X-Original-Filename"],
)

# In-memory job storage (Supabase is optional)
jobs = {}
compressed_files = {}


# ━━━ Root ━━━
@app.get("/")
async def root():
    return {
        "name": "HuffZip API",
        "version": "1.0.0",
        "description": "Huffman Coding File Compression — ADA Unit 4 Greedy Algorithm",
        "docs": "/docs",
        "health": "/health"
    }


# ━━━ Health Check ━━━
@app.get("/health")
async def health():
    return {"status": "ok", "service": "huffzip-api"}


# ━━━ Cleanup Trigger (for UptimeRobot / external cron) ━━━
@app.get("/cleanup")
async def trigger_cleanup(token: str = ""):
    """Delete expired files. Hit this every 5 min via UptimeRobot."""
    expected = os.getenv("CLEANUP_SECRET", "")
    if not expected or token != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        from cleanup import cleanup_expired
        result = await asyncio.to_thread(cleanup_expired)
        return {"status": "ok", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")


# ━━━ Global Stats ━━━
@app.get("/stats")
async def global_stats():
    return get_stats()


# ━━━ Upload & Compress ━━━
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file and start Huffman compression."""
    
    # Read file
    file_bytes = await file.read()
    filename = file.filename or "unknown"
    file_size = len(file_bytes)
    
    # Validate
    is_valid, error_msg = validate_file(filename, file_size)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Detect file type
    file_info = detect_file_type(filename)
    warning = get_compression_warning(file_info)
    
    # Create job
    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "id": job_id,
        "original_name": filename,
        "original_size": file_size,
        "file_type": file_info["mime_type"],
        "category": file_info["category"],
        "icon": file_info["icon"],
        "status": "processing",
        "warning": warning
    }
    
    # Try to create in Supabase
    try:
        from supabase_client import create_job
        create_job(filename, file_size, file_info["mime_type"])
    except Exception:
        pass
    
    # Start compression in background
    asyncio.create_task(_run_compression(job_id, file_bytes, filename))
    
    return {
        "job_id": job_id,
        "filename": filename,
        "size": file_size,
        "size_formatted": format_size(file_size),
        "file_info": file_info,
        "warning": warning,
        "status": "processing"
    }


async def _run_compression(job_id: str, file_bytes: bytes, filename: str):
    """Background compression task."""
    try:
        event_callback = streamer.get_event_callback(job_id)
        
        compressed_data, stats = await compress_file(
            file_bytes, filename, event_callback
        )
        
        # Store compressed file in memory
        compressed_files[job_id] = {
            "data": compressed_data,
            "filename": f"{filename}.huff"
        }
        
        # Update job
        jobs[job_id]["status"] = "complete"
        jobs[job_id]["compressed_size"] = stats["compressed_size"]
        jobs[job_id]["ratio"] = stats["ratio"]
        jobs[job_id]["time_ms"] = stats["time_ms"]
        jobs[job_id]["stats"] = stats
        
        # Try to upload to Supabase
        try:
            from supabase_client import upload_compressed_file, update_job_complete
            download_url = upload_compressed_file(job_id, compressed_data, filename)
            update_job_complete(job_id, stats["compressed_size"], stats["ratio"], download_url)
            jobs[job_id]["download_url"] = download_url
        except Exception:
            pass
        
        # Update global stats
        bytes_saved = len(file_bytes) - stats["compressed_size"]
        update_stats(bytes_saved)
        
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)
        await streamer.emit(job_id, "ERROR", {"msg": f"Compression failed: {str(e)}"})
        
        try:
            from supabase_client import update_job_failed
            update_job_failed(job_id, str(e))
        except Exception:
            pass


# ━━━ Job Status ━━━
@app.get("/status/{job_id}")
async def job_status(job_id: str):
    """Check compression job status."""
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


# ━━━ Download Compressed File ━━━
@app.get("/download/{job_id}")
async def download_compressed(job_id: str):
    """Download the compressed .huff file."""
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job["status"] != "complete":
        raise HTTPException(status_code=400, detail="Compression not complete yet")
    
    file_data = compressed_files.get(job_id)
    if not file_data:
        raise HTTPException(status_code=404, detail="Compressed file not found")
    
    return Response(
        content=file_data["data"],
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f'attachment; filename="{file_data["filename"]}"'
        }
    )


# ━━━ Decompress ━━━
@app.post("/decompress")
async def decompress(file: UploadFile = File(...)):
    """Decompress a .huff file back to original."""
    file_bytes = await file.read()
    filename = file.filename or "unknown.huff"
    
    if not filename.endswith(".huff"):
        raise HTTPException(status_code=400, detail="Only .huff files can be decompressed")
    
    try:
        original_bytes, original_filename, stats = await decompress_file(file_bytes)
        
        return Response(
            content=original_bytes,
            media_type="application/octet-stream",
            headers={
                "Content-Disposition": f'attachment; filename="{original_filename}"',
                "X-Original-Filename": original_filename,
                "X-Original-Size": str(stats["original_size"]),
                "X-Compressed-Size": str(stats["compressed_size"]),
                "X-Time-Ms": str(stats["time_ms"])
            }
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decompression failed: {str(e)}")


# ━━━ Compare Algorithms ━━━
@app.post("/compare")
async def compare_algorithms(file: UploadFile = File(...)):
    """Compare Huffman vs RLE vs LZ77."""
    file_bytes = await file.read()
    
    is_valid, error_msg = validate_file(file.filename or "file", len(file_bytes))
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    try:
        from compare import run_all_comparisons
        results = await run_all_comparisons(file_bytes)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ━━━ WebSocket — Live Events ━━━
@app.websocket("/ws/{job_id}")
async def websocket_endpoint(websocket: WebSocket, job_id: str):
    """WebSocket endpoint for live compression events."""
    await streamer.connect(job_id, websocket)
    
    try:
        while True:
            # Keep connection alive, listen for client messages
            data = await websocket.receive_text()
            # Client can send "ping" to keep alive
            if data == "ping":
                await websocket.send_text('{"type":"pong"}')
    except WebSocketDisconnect:
        streamer.disconnect(job_id, websocket)
    except Exception:
        streamer.disconnect(job_id, websocket)


# ━━━ Events Polling Fallback ━━━
@app.get("/events/{job_id}")
async def get_events(job_id: str):
    """HTTP polling fallback for environments where WebSocket fails."""
    events = streamer.get_events(job_id)
    return {"events": events, "count": len(events)}
