"""
HuffZip — Decompressor
Decodes .huff files back to original format.
"""

import json
import struct
import zlib
from typing import Tuple, Optional, Callable

from huffman_engine import HUFF_MAGIC, format_size


async def decompress_file(
    huff_bytes: bytes,
    event_callback: Optional[Callable] = None
) -> Tuple[bytes, str, dict]:
    """
    Decompress a .huff file back to the original file.
    
    Returns:
        Tuple of (original_bytes, original_filename, stats_dict)
    """
    import time
    start_time = time.time()
    
    async def emit(event_type: str, data: dict):
        if event_callback:
            await event_callback(event_type, data)
    
    # ━━━ Handle HUFZ (zlib-compressed) format ━━━
    if huff_bytes[:4] == b'HUFZ':
        original_len = struct.unpack('>I', huff_bytes[4:8])[0]
        huff_bytes = zlib.decompress(huff_bytes[8:])
    
    # ━━━ Parse Header ━━━
    pos = 0
    
    # Magic bytes check
    magic = huff_bytes[pos:pos + 4]
    pos += 4
    if magic != HUFF_MAGIC:
        raise ValueError("Invalid .huff file — magic bytes mismatch")
    
    # Original size
    original_size = struct.unpack('>Q', huff_bytes[pos:pos + 8])[0]
    pos += 8
    
    # Filename
    filename_len = struct.unpack('>H', huff_bytes[pos:pos + 2])[0]
    pos += 2
    original_filename = huff_bytes[pos:pos + filename_len].decode('utf-8')
    pos += filename_len
    
    # Padding bits
    padding_bits = struct.unpack('B', huff_bytes[pos:pos + 1])[0]
    pos += 1
    
    # Code table
    code_table_len = struct.unpack('>I', huff_bytes[pos:pos + 4])[0]
    pos += 4
    code_table_json = huff_bytes[pos:pos + code_table_len].decode('utf-8')
    pos += code_table_len
    
    # Compressed data
    compressed_data = huff_bytes[pos:]
    
    await emit("DECOMPRESS_START", {
        "msg": f"Decompressing {original_filename} — original size: {format_size(original_size)}",
        "original_filename": original_filename,
        "original_size": original_size
    })
    
    # Handle empty file
    if original_size == 0:
        elapsed = int((time.time() - start_time) * 1000)
        stats = {"original_size": 0, "compressed_size": len(huff_bytes), "time_ms": elapsed}
        await emit("DECOMPRESS_COMPLETE", {"msg": "Empty file restored", **stats})
        return b'', original_filename, stats
    
    # ━━━ Rebuild reverse lookup: code_string → byte_value ━━━
    codes = json.loads(code_table_json)
    reverse_codes = {code: int(byte_val) for byte_val, code in codes.items()}
    
    await emit("DECOMPRESS_TABLE", {
        "msg": f"Code table loaded — {len(reverse_codes)} entries",
        "entries": len(reverse_codes)
    })
    
    # ━━━ Convert compressed bytes to bit string ━━━
    bit_string = ""
    for byte_val in compressed_data:
        bit_string += format(byte_val, '08b')
    
    # Remove padding bits
    if padding_bits > 0:
        bit_string = bit_string[:-padding_bits]
    
    # ━━━ Decode bit string ━━━
    await emit("DECOMPRESS_DECODING", {
        "msg": "Decoding bit stream to original bytes..."
    })
    
    decoded = bytearray()
    current_code = ""
    
    for bit in bit_string:
        current_code += bit
        if current_code in reverse_codes:
            decoded.append(reverse_codes[current_code])
            current_code = ""
        
        # Safety check
        if len(decoded) >= original_size:
            break
    
    # Verify size
    if len(decoded) != original_size:
        raise ValueError(
            f"Decompression size mismatch: expected {original_size}, got {len(decoded)}"
        )
    
    elapsed_ms = int((time.time() - start_time) * 1000)
    
    stats = {
        "original_size": original_size,
        "compressed_size": len(huff_bytes),
        "time_ms": elapsed_ms,
        "original_filename": original_filename
    }
    
    await emit("DECOMPRESS_COMPLETE", {
        "msg": f"Decompression complete! {format_size(len(huff_bytes))} → {format_size(original_size)} in {elapsed_ms}ms",
        **stats
    })
    
    return bytes(decoded), original_filename, stats
