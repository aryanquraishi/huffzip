"""
HuffZip — Stats Module
Global statistics tracker.
"""

from typing import Dict

_fallback_stats = {
    "total_files": 0,
    "total_bytes_saved": 0,
    "total_compressions": 0
}


def get_stats() -> Dict:
    """Get global stats — tries Supabase first, falls back to in-memory."""
    try:
        from supabase_client import get_global_stats
        return get_global_stats()
    except Exception:
        return _fallback_stats.copy()


def update_stats(bytes_saved: int):
    """Update stats after successful compression."""
    _fallback_stats["total_files"] += 1
    _fallback_stats["total_bytes_saved"] += max(0, bytes_saved)
    _fallback_stats["total_compressions"] += 1
    try:
        from supabase_client import increment_global_stats
        increment_global_stats(bytes_saved)
    except Exception:
        pass
