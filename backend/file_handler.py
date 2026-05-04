"""
HuffZip — File Handler
Upload validation and file type detection using stdlib mimetypes.
"""

import mimetypes
import os
from typing import Tuple

# Initialize mimetypes
mimetypes.init()

# Maximum file size: 20MB
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE_MB", "20")) * 1024 * 1024

# Supported file categories
FILE_CATEGORIES = {
    "image": {
        "extensions": [".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif", ".tiff"],
        "mimes": ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/gif", "image/tiff"],
        "icon": "🖼️",
        "label": "Image"
    },
    "text": {
        "extensions": [".txt", ".csv", ".json", ".xml", ".html", ".css", ".js", ".py", ".md", ".log"],
        "mimes": ["text/plain", "text/csv", "application/json", "text/xml", "text/html"],
        "icon": "📄",
        "label": "Text"
    },
    "document": {
        "extensions": [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"],
        "mimes": ["application/pdf", "application/msword"],
        "icon": "📋",
        "label": "Document"
    },
    "audio": {
        "extensions": [".mp3", ".wav", ".ogg", ".flac", ".aac", ".m4a"],
        "mimes": ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"],
        "icon": "🎵",
        "label": "Audio"
    },
    "archive": {
        "extensions": [".zip", ".rar", ".7z", ".tar", ".gz"],
        "mimes": ["application/zip", "application/x-rar-compressed"],
        "icon": "📦",
        "label": "Archive"
    }
}

# Already-compressed formats (will show warning)
ALREADY_COMPRESSED = {".jpg", ".jpeg", ".png", ".webp", ".mp3", ".zip", ".rar", ".7z", ".gz"}


def validate_file(filename: str, file_size: int) -> Tuple[bool, str]:
    """
    Validate uploaded file.
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not filename:
        return False, "No filename provided"
    
    if file_size == 0:
        return False, "File is empty"
    
    if file_size > MAX_FILE_SIZE:
        max_mb = MAX_FILE_SIZE / (1024 * 1024)
        file_mb = file_size / (1024 * 1024)
        return False, f"File too large: {file_mb:.1f}MB (max: {max_mb:.0f}MB)"
    
    return True, ""


def detect_file_type(filename: str) -> dict:
    """
    Detect file type and category from filename.
    
    Returns:
        Dict with mime_type, category, icon, label, extension, is_compressed
    """
    ext = os.path.splitext(filename)[1].lower()
    mime_type, _ = mimetypes.guess_type(filename)
    
    if mime_type is None:
        mime_type = "application/octet-stream"
    
    # Find category
    category = "other"
    icon = "📁"
    label = "File"
    
    for cat_name, cat_info in FILE_CATEGORIES.items():
        if ext in cat_info["extensions"] or mime_type in cat_info["mimes"]:
            category = cat_name
            icon = cat_info["icon"]
            label = cat_info["label"]
            break
    
    return {
        "mime_type": mime_type,
        "category": category,
        "icon": icon,
        "label": label,
        "extension": ext,
        "is_compressed": ext in ALREADY_COMPRESSED
    }


def get_compression_warning(file_info: dict) -> str:
    """Return warning message if file is already compressed."""
    if file_info["is_compressed"]:
        return (
            f"⚠️ {file_info['extension'].upper()} files are already compressed. "
            f"Huffman coding may provide minimal savings (0-5%)."
        )
    return ""
