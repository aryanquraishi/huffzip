"""
HuffZip — Supabase Client
Database operations + file storage management.
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
BUCKET_NAME = "huffzip-files"
FILE_EXPIRY_MINUTES = int(os.getenv("FILE_EXPIRY_MINUTES", "5"))

# Initialize client
supabase: Optional[Client] = None

def get_client() -> Client:
    """Get or create Supabase client."""
    global supabase
    if supabase is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise RuntimeError("Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY.")
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase


# ━━━ Compression Jobs ━━━

def create_job(original_name: str, original_size: int, file_type: str) -> str:
    """Create a new compression job. Returns job_id."""
    client = get_client()
    
    expires_at = (datetime.now(timezone.utc) + timedelta(minutes=FILE_EXPIRY_MINUTES)).isoformat()
    
    result = client.table("compression_jobs").insert({
        "original_name": original_name,
        "original_size": original_size,
        "file_type": file_type,
        "status": "processing",
        "expires_at": expires_at
    }).execute()
    
    return result.data[0]["id"]


def update_job_complete(
    job_id: str,
    compressed_size: int,
    compression_ratio: float,
    download_url: str
):
    """Mark job as complete with results."""
    client = get_client()
    
    client.table("compression_jobs").update({
        "compressed_size": compressed_size,
        "compression_ratio": compression_ratio,
        "status": "complete",
        "download_url": download_url
    }).eq("id", job_id).execute()


def update_job_failed(job_id: str, error: str = ""):
    """Mark job as failed."""
    client = get_client()
    
    client.table("compression_jobs").update({
        "status": "failed"
    }).eq("id", job_id).execute()


def get_job(job_id: str) -> Optional[dict]:
    """Get job details by ID."""
    client = get_client()
    
    result = client.table("compression_jobs").select("*").eq("id", job_id).execute()
    
    if result.data:
        return result.data[0]
    return None


# ━━━ File Storage ━━━

def upload_compressed_file(job_id: str, file_data: bytes, filename: str) -> str:
    """Upload compressed file to Supabase Storage. Returns signed URL."""
    client = get_client()
    
    storage_path = f"{job_id}/compressed/{filename}.huff"
    
    client.storage.from_(BUCKET_NAME).upload(
        path=storage_path,
        file=file_data,
        file_options={"content-type": "application/octet-stream"}
    )
    
    # Generate signed URL (valid for expiry duration)
    signed_url = client.storage.from_(BUCKET_NAME).create_signed_url(
        path=storage_path,
        expires_in=FILE_EXPIRY_MINUTES * 60
    )
    
    return signed_url.get("signedURL", "")


def download_file(job_id: str, filename: str) -> bytes:
    """Download a file from Supabase Storage."""
    client = get_client()
    
    storage_path = f"{job_id}/compressed/{filename}.huff"
    
    data = client.storage.from_(BUCKET_NAME).download(storage_path)
    return data


def delete_job_files(job_id: str):
    """Delete all files for a job from storage."""
    client = get_client()
    
    try:
        # List files in job directory
        files = client.storage.from_(BUCKET_NAME).list(job_id)
        
        if files:
            paths = [f"{job_id}/{f['name']}" for f in files]
            client.storage.from_(BUCKET_NAME).remove(paths)
    except Exception:
        pass  # Silently handle cleanup errors


# ━━━ Global Stats ━━━

def get_global_stats() -> dict:
    """Get global compression statistics."""
    client = get_client()
    
    result = client.table("global_stats").select("*").eq("id", 1).execute()
    
    if result.data:
        return result.data[0]
    
    return {
        "total_files": 0,
        "total_bytes_saved": 0,
        "total_compressions": 0
    }


def increment_global_stats(bytes_saved: int):
    """Increment global stats after successful compression."""
    client = get_client()
    
    # Get current stats
    current = get_global_stats()
    
    client.table("global_stats").upsert({
        "id": 1,
        "total_files": current.get("total_files", 0) + 1,
        "total_bytes_saved": current.get("total_bytes_saved", 0) + max(0, bytes_saved),
        "total_compressions": current.get("total_compressions", 0) + 1,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).execute()
