"""
HuffZip — Compare Module
Implements RLE and basic LZ77 for algorithm comparison.
"""

import time
import asyncio
from typing import Dict, Tuple
from functools import partial


async def run_all_comparisons(file_bytes: bytes) -> Dict:
    """
    Compress with Huffman, RLE, and LZ77.
    Returns comparison data for charts.
    """
    from huffman_engine import compress_file
    
    results = {}
    original_size = len(file_bytes)
    
    # For large files, use a sample to keep LZ77 fast
    MAX_LZ77_SIZE = 100 * 1024  # 100KB limit for LZ77
    lz77_sampled = original_size > MAX_LZ77_SIZE
    lz77_input = file_bytes[:MAX_LZ77_SIZE] if lz77_sampled else file_bytes
    
    # 1. Huffman (using our engine, but without events)
    start = time.time()
    huffman_data, huffman_stats = await compress_file(
        file_bytes, "compare_file", event_callback=None
    )
    huffman_time = int((time.time() - start) * 1000)
    
    results["huffman"] = {
        "name": "Huffman Coding",
        "type": "Greedy (Optimal Prefix Code)",
        "original_size": original_size,
        "compressed_size": huffman_stats["compressed_size"],
        "ratio": huffman_stats["ratio"],
        "time_ms": huffman_time,
        "complexity_time": "O(n log n)",
        "complexity_space": "O(n)",
        "description": "Builds optimal prefix-free codes using a greedy min-heap approach. Each character gets a variable-length code based on frequency."
    }
    
    # 2. Run-Length Encoding (run in thread to not block event loop)
    start = time.time()
    rle_compressed = await asyncio.to_thread(rle_compress, file_bytes)
    rle_time = int((time.time() - start) * 1000)
    rle_ratio = round((1 - len(rle_compressed) / original_size) * 100, 1) if original_size > 0 else 0
    
    results["rle"] = {
        "name": "Run-Length Encoding",
        "type": "Simple Substitution",
        "original_size": original_size,
        "compressed_size": len(rle_compressed),
        "ratio": max(0, rle_ratio),
        "time_ms": rle_time,
        "complexity_time": "O(n)",
        "complexity_space": "O(n)",
        "description": "Replaces consecutive repeated bytes with a count + value pair. Good for images with solid colors, poor for varied data."
    }
    
    # 3. Basic LZ77 (run in thread + sample large files)
    start = time.time()
    lz77_compressed = await asyncio.to_thread(lz77_compress, lz77_input)
    lz77_time = int((time.time() - start) * 1000)
    
    # If sampled, extrapolate the ratio from the sample
    if lz77_sampled:
        sample_ratio = round((1 - len(lz77_compressed) / len(lz77_input)) * 100, 1) if len(lz77_input) > 0 else 0
        estimated_compressed = int(original_size * (1 - sample_ratio / 100))
        lz77_ratio = sample_ratio
        lz77_size = estimated_compressed
    else:
        lz77_ratio = round((1 - len(lz77_compressed) / original_size) * 100, 1) if original_size > 0 else 0
        lz77_size = len(lz77_compressed)
    
    results["lz77"] = {
        "name": "LZ77 (Basic)" + (" (sampled)" if lz77_sampled else ""),
        "type": "Dictionary-based Sliding Window",
        "original_size": original_size,
        "compressed_size": lz77_size,
        "ratio": max(0, lz77_ratio),
        "time_ms": lz77_time,
        "complexity_time": "O(n × w)",
        "complexity_space": "O(w)",
        "description": "Uses a sliding window to find repeated patterns. Replaces repetitions with (offset, length) pairs." + (" (Result estimated from first 100KB sample)" if lz77_sampled else "")
    }
    
    # Summary
    best = min(results.items(), key=lambda x: x[1]["compressed_size"])
    
    return {
        "algorithms": results,
        "original_size": original_size,
        "best_algorithm": best[0],
        "conclusion": _generate_conclusion(results)
    }


def rle_compress(data: bytes) -> bytes:
    """
    Run-Length Encoding compression.
    Format: [count][byte] pairs. Count is 1-255.
    """
    if not data:
        return b''
    
    result = bytearray()
    i = 0
    
    while i < len(data):
        current = data[i]
        count = 1
        
        while i + count < len(data) and data[i + count] == current and count < 255:
            count += 1
        
        result.append(count)
        result.append(current)
        i += count
    
    return bytes(result)


def lz77_compress(data: bytes, window_size: int = 256, lookahead_size: int = 32) -> bytes:
    """
    Basic LZ77 compression.
    Uses a small window for speed. Output: sequence of (offset, length, next_byte) triples.
    """
    if not data:
        return b''
    
    result = bytearray()
    i = 0
    
    while i < len(data):
        best_offset = 0
        best_length = 0
        
        # Search window
        start = max(0, i - window_size)
        
        for j in range(start, i):
            length = 0
            while (length < lookahead_size and
                   i + length < len(data) and
                   data[j + length] == data[i + length]):
                length += 1
                # Prevent reading past current position in simple implementation
                if j + length >= i:
                    break
            
            if length > best_length:
                best_length = length
                best_offset = i - j
        
        if best_length >= 3:  # Only encode if match is worth it
            # Flag byte: 1 = match found
            result.append(1)
            result.append(best_offset & 0xFF)
            result.append(best_length & 0xFF)
            i += best_length
        else:
            # Flag byte: 0 = literal
            result.append(0)
            result.append(data[i])
            i += 1
    
    return bytes(result)


def _generate_conclusion(results: Dict) -> str:
    """Generate a human-readable conclusion."""
    huffman = results["huffman"]
    rle = results["rle"]
    lz77 = results["lz77"]
    
    best = min(results.items(), key=lambda x: x[1]["compressed_size"])
    best_name = best[1]["name"]
    best_ratio = best[1]["ratio"]
    
    conclusion = f"For this file, {best_name} achieved the best compression ratio of {best_ratio}%. "
    
    if best[0] == "huffman":
        conclusion += (
            "Huffman Coding excels because it assigns optimal variable-length codes "
            "based on byte frequency — a key property of the Greedy algorithm approach. "
            "It guarantees optimal prefix-free codes with O(n log n) time complexity."
        )
    elif best[0] == "rle":
        conclusion += (
            "RLE performed best because this file has many consecutive repeated bytes. "
            "However, Huffman Coding is more versatile for general-purpose compression "
            "and provides optimal entropy coding."
        )
    else:
        conclusion += (
            "LZ77 performed best due to repeated patterns in this file. "
            "However, Huffman Coding provides guaranteed optimal prefix codes "
            "and is the foundation of many real-world compression standards (JPEG, MP3, ZIP)."
        )
    
    return conclusion
