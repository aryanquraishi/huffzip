"""
HuffZip — Event Streamer
WebSocket event manager for live compression updates.
"""

import json
import asyncio
from typing import Dict, Set
from fastapi import WebSocket


class EventStreamer:
    """Manages WebSocket connections and event broadcasting per job."""
    
    def __init__(self):
        # job_id → set of connected WebSocket clients
        self._connections: Dict[str, Set[WebSocket]] = {}
        self._event_logs: Dict[str, list] = {}
    
    async def connect(self, job_id: str, websocket: WebSocket):
        """Accept and register a WebSocket connection for a job."""
        await websocket.accept()
        
        if job_id not in self._connections:
            self._connections[job_id] = set()
        # Don't wipe event_logs if they already exist — compression
        # may have already emitted events before the WebSocket connects
        if job_id not in self._event_logs:
            self._event_logs[job_id] = []
        
        self._connections[job_id].add(websocket)
        
        # Send any existing events (replay for late joiners)
        for event in self._event_logs.get(job_id, []):
            try:
                await websocket.send_text(json.dumps(event))
            except Exception:
                break
    
    def disconnect(self, job_id: str, websocket: WebSocket):
        """Remove a WebSocket connection."""
        if job_id in self._connections:
            self._connections[job_id].discard(websocket)
            if not self._connections[job_id]:
                del self._connections[job_id]
    
    async def emit(self, job_id: str, event_type: str, data: dict):
        """Broadcast an event to all connected clients for a job."""
        import time
        
        event = {
            "type": event_type,
            "timestamp": time.time(),
            **data
        }
        
        # Store event in log
        if job_id not in self._event_logs:
            self._event_logs[job_id] = []
        self._event_logs[job_id].append(event)
        
        # Broadcast to all connected clients
        if job_id in self._connections:
            dead_connections = set()
            
            for ws in self._connections[job_id]:
                try:
                    await ws.send_text(json.dumps(event))
                except Exception:
                    dead_connections.add(ws)
            
            # Cleanup dead connections
            for ws in dead_connections:
                self._connections[job_id].discard(ws)
    
    def get_event_callback(self, job_id: str):
        """Returns an async callback function for the compression engine."""
        async def callback(event_type: str, data: dict):
            await self.emit(job_id, event_type, data)
        return callback
    
    def cleanup_job(self, job_id: str):
        """Remove all data for a completed job."""
        self._connections.pop(job_id, None)
        self._event_logs.pop(job_id, None)
    
    def get_events(self, job_id: str) -> list:
        """Get stored events for a job (for HTTP polling fallback)."""
        return self._event_logs.get(job_id, [])


# Global singleton
streamer = EventStreamer()
