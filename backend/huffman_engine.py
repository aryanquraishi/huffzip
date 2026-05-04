"""
HuffZip — Huffman Coding Engine
7-Stage Greedy Algorithm Implementation
ADA Unit 4 — Greedy Method

Time Complexity: O(n log n)
Space Complexity: O(n)
"""

import heapq
import json
import struct
import os
from collections import Counter
from typing import Dict, List, Tuple, Optional, Callable


# ━━━ Huffman Tree Node ━━━
class HuffmanNode:
    """Node in the Huffman tree."""
    
    def __init__(self, byte_value: Optional[int], frequency: int):
        self.byte_value = byte_value  # None for internal nodes
        self.frequency = frequency
        self.left: Optional['HuffmanNode'] = None
        self.right: Optional['HuffmanNode'] = None
    
    def __lt__(self, other):
        """For heap comparison — lower frequency = higher priority."""
        return self.frequency < other.frequency
    
    def is_leaf(self) -> bool:
        return self.byte_value is not None


# ━━━ Magic Bytes for .huff format ━━━
HUFF_MAGIC = b'HUFF'


# ━━━ Main Compression Function ━━━
async def compress_file(
    file_bytes: bytes,
    filename: str,
    event_callback: Optional[Callable] = None
) -> Tuple[bytes, dict]:
    """
    Compress file using Huffman Coding (Greedy Algorithm).
    
    Returns:
        Tuple of (compressed_bytes, stats_dict)
    
    The 7 stages:
        1. File Read
        2. Frequency Table
        3. Min-Heap Build
        4. Huffman Tree (Greedy Core)
        5. Code Table
        6. Encoding
        7. Packaging
    """
    
    import time
    start_time = time.time()
    
    async def emit(event_type: str, data: dict):
        """Emit event to WebSocket if callback exists."""
        if event_callback:
            await event_callback(event_type, data)
    
    # ━━━ STAGE 1: FILE READ ━━━
    raw_bytes = bytearray(file_bytes)
    original_size = len(raw_bytes)
    
    await emit("FILE_LOADED", {
        "msg": f"{filename} loaded — {format_size(original_size)}",
        "size": original_size,
        "filename": filename
    })
    
    await emit("BYTES_READ", {
        "msg": f"{original_size:,} raw bytes read",
        "total_bytes": original_size
    })
    
    # Handle edge case: empty file
    if original_size == 0:
        await emit("COMPLETE", {
            "msg": "Empty file — nothing to compress",
            "original_size": 0,
            "compressed_size": 0,
            "ratio": 0,
            "time_ms": 0
        })
        return _package_empty(filename), {
            "original_size": 0,
            "compressed_size": 0,
            "ratio": 0,
            "time_ms": 0
        }
    
    # Handle edge case: single byte file
    if original_size == 1:
        compressed = _package_single_byte(raw_bytes, filename)
        elapsed = int((time.time() - start_time) * 1000)
        stats = {
            "original_size": original_size,
            "compressed_size": len(compressed),
            "ratio": 0,
            "time_ms": elapsed
        }
        await emit("COMPLETE", {
            "msg": f"Single byte file compressed in {elapsed}ms",
            **stats
        })
        return compressed, stats
    
    # ━━━ STAGE 2: FREQUENCY TABLE ━━━
    await emit("FREQ_START", {
        "msg": "Calculating byte frequencies..."
    })
    
    freq_counter = Counter(raw_bytes)  # O(n)
    unique_count = len(freq_counter)
    most_common_byte, most_common_count = freq_counter.most_common(1)[0]
    
    # Build frequency table for events
    freq_table = [
        {"byte": byte_val, "frequency": count, "char": chr(byte_val) if 32 <= byte_val < 127 else f"0x{byte_val:02X}"}
        for byte_val, count in freq_counter.most_common()
    ]
    
    await emit("FREQ_DONE", {
        "msg": f"{unique_count} unique bytes found. Most frequent: 0x{most_common_byte:02X} × {most_common_count:,}",
        "unique_count": unique_count,
        "most_common": f"0x{most_common_byte:02X}",
        "most_common_count": most_common_count,
        "freq_table": freq_table[:20]  # Top 20 for display
    })
    
    # ━━━ STAGE 3: MIN-HEAP BUILD ━━━
    heap: List[HuffmanNode] = []
    for byte_val, count in freq_counter.items():
        node = HuffmanNode(byte_value=byte_val, frequency=count)
        heap.append(node)
    
    heapq.heapify(heap)  # O(k) where k = unique_count
    
    await emit("HEAP_BUILD", {
        "msg": f"Min-heap ready — {unique_count} leaf nodes created",
        "node_count": unique_count
    })
    
    # ━━━ STAGE 4: HUFFMAN TREE — GREEDY CORE ━━━
    total_merges = unique_count - 1  # Dynamic, not hardcoded 255!
    
    await emit("MERGE_START", {
        "msg": f"Building Huffman tree — {total_merges} merges needed",
        "total_merges": total_merges
    })
    
    # Store tree structure for visualization
    tree_nodes = []
    node_id_counter = 0
    
    # Assign IDs to leaf nodes
    node_ids = {}
    for node in heap:
        node_ids[id(node)] = node_id_counter
        tree_nodes.append({
            "id": node_id_counter,
            "byte": node.byte_value,
            "freq": node.frequency,
            "char": chr(node.byte_value) if 32 <= node.byte_value < 127 else f"0x{node.byte_value:02X}",
            "is_leaf": True,
            "left": None,
            "right": None
        })
        node_id_counter += 1
    
    # Greedy merge loop — THIS IS THE CORE GREEDY ALGORITHM
    merge_count = 0
    while len(heap) > 1:
        # Greedy Choice: Always pick two minimum frequency nodes
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        
        # Create parent with combined frequency
        parent = HuffmanNode(byte_value=None, frequency=left.frequency + right.frequency)
        parent.left = left
        parent.right = right
        
        # Push parent back to heap
        heapq.heappush(heap, parent)
        
        merge_count += 1
        
        # Assign ID to parent
        parent_id = node_id_counter
        node_ids[id(parent)] = parent_id
        node_id_counter += 1
        
        left_id = node_ids.get(id(left), -1)
        right_id = node_ids.get(id(right), -1)
        
        tree_nodes.append({
            "id": parent_id,
            "byte": None,
            "freq": parent.frequency,
            "is_leaf": False,
            "left": left_id,
            "right": right_id
        })
        
        # Emit merge event (throttled — every merge for small trees, every 5% for large)
        should_emit = (
            total_merges <= 50 or
            merge_count % max(1, total_merges // 20) == 0 or
            merge_count == total_merges
        )
        
        if should_emit:
            left_label = chr(left.byte_value) if left.byte_value is not None and 32 <= left.byte_value < 127 else f"node({left.frequency})"
            right_label = chr(right.byte_value) if right.byte_value is not None and 32 <= right.byte_value < 127 else f"node({right.frequency})"
            
            await emit("MERGE", {
                "msg": f"Merge {merge_count}/{total_merges}: {left_label} + {right_label} → parent({parent.frequency})",
                "count": merge_count,
                "total": total_merges,
                "remaining": total_merges - merge_count,
                "node_data": {
                    "parent_id": parent_id,
                    "left_id": left_id,
                    "right_id": right_id,
                    "parent_freq": parent.frequency,
                    "left_freq": left.frequency,
                    "right_freq": right.frequency
                }
            })
    
    # Root of the Huffman tree
    root = heap[0]
    
    # Calculate tree depth
    tree_depth = _get_tree_depth(root)
    
    await emit("TREE_COMPLETE", {
        "msg": f"Huffman tree complete — depth: {tree_depth} levels",
        "depth": tree_depth,
        "total_nodes": node_id_counter,
        "tree_data": tree_nodes  # Full tree for D3.js visualization
    })
    
    # ━━━ STAGE 5: CODE TABLE ━━━
    await emit("CODES_START", {
        "msg": "Generating binary codes from tree..."
    })
    
    codes: Dict[int, str] = {}
    _generate_codes(root, "", codes)
    
    # Handle single unique byte edge case
    if len(codes) == 1:
        byte_val = list(codes.keys())[0]
        codes[byte_val] = "0"
    
    # Calculate average bits per byte
    total_bits = sum(len(codes[b]) * freq_counter[b] for b in codes)
    avg_bits = total_bits / original_size if original_size > 0 else 0
    
    # Build code table for display
    code_table = [
        {
            "byte": byte_val,
            "char": chr(byte_val) if 32 <= byte_val < 127 else f"0x{byte_val:02X}",
            "code": code,
            "length": len(code),
            "frequency": freq_counter[byte_val]
        }
        for byte_val, code in sorted(codes.items(), key=lambda x: len(x[1]))
    ]
    
    await emit("CODES_DONE", {
        "msg": f"Codes ready — avg {avg_bits:.1f} bits/byte (original: 8 bits/byte)",
        "avg_bits": round(avg_bits, 2),
        "code_count": len(codes),
        "shortest_code": min(len(c) for c in codes.values()),
        "longest_code": max(len(c) for c in codes.values()),
        "code_table": code_table[:30]  # Top 30 for display
    })
    
    # ━━━ STAGE 6: ENCODING ━━━
    await emit("ENCODE_START", {
        "msg": "Encoding file bytes with Huffman codes..."
    })
    
    # Build the encoded bit string
    encoded_bits = []
    progress_step = max(1, original_size // 4)
    
    for i, byte_val in enumerate(raw_bytes):
        encoded_bits.append(codes[byte_val])
        
        # Progress events at 25%, 50%, 75%
        if (i + 1) % progress_step == 0 and (i + 1) < original_size:
            progress = min(75, ((i + 1) * 100) // original_size)
            await emit("ENCODE_PROGRESS", {
                "msg": f"Encoding: {progress}% done",
                "progress": progress
            })
    
    # Join all bits
    bit_string = "".join(encoded_bits)
    
    # Pack bits into bytes
    packed_bytes, padding_bits = _pack_bits(bit_string)
    
    await emit("ENCODE_DONE", {
        "msg": "Encoding: 100% complete",
        "progress": 100,
        "total_bits": len(bit_string),
        "padding_bits": padding_bits
    })
    
    # ━━━ STAGE 7: PACKAGING ━━━
    await emit("PACKAGING", {
        "msg": "Packaging — adding Huffman table to header..."
    })
    
    # Build .huff file
    compressed_data = _build_huff_file(
        original_size=original_size,
        filename=filename,
        padding_bits=padding_bits,
        codes=codes,
        packed_bytes=packed_bytes
    )
    
    compressed_size = len(compressed_data)
    elapsed_ms = int((time.time() - start_time) * 1000)
    
    # Calculate compression ratio
    if original_size > 0:
        ratio = round((1 - compressed_size / original_size) * 100, 1)
    else:
        ratio = 0
    
    expanded = compressed_size >= original_size
    
    stats = {
        "original_size": original_size,
        "compressed_size": compressed_size,
        "ratio": ratio,  # Show real ratio (can be negative for already-compressed files)
        "expanded": expanded,
        "time_ms": elapsed_ms,
        "unique_bytes": unique_count,
        "tree_depth": tree_depth,
        "avg_bits_per_byte": round(avg_bits, 2),
        "total_merges": total_merges
    }
    
    if expanded:
        saved_str = f"No savings — file is already compressed (overhead: +{format_size(compressed_size - original_size)})"
    else:
        saved_str = f"{ratio}% saved"
    
    await emit("COMPLETE", {
        "msg": f"Done! {format_size(original_size)} → {format_size(compressed_size)} — {saved_str} in {elapsed_ms / 1000:.1f}s",
        **stats
    })
    
    return compressed_data, stats


# ━━━ Helper Functions ━━━

def _generate_codes(node: Optional[HuffmanNode], current_code: str, codes: Dict[int, str]):
    """DFS traversal to generate Huffman codes. Left=0, Right=1."""
    if node is None:
        return
    
    if node.is_leaf():
        codes[node.byte_value] = current_code if current_code else "0"
        return
    
    _generate_codes(node.left, current_code + "0", codes)
    _generate_codes(node.right, current_code + "1", codes)


def _get_tree_depth(node: Optional[HuffmanNode]) -> int:
    """Calculate the depth of the Huffman tree."""
    if node is None:
        return 0
    if node.is_leaf():
        return 0
    return 1 + max(_get_tree_depth(node.left), _get_tree_depth(node.right))


def _pack_bits(bit_string: str) -> Tuple[bytes, int]:
    """Pack a string of '0' and '1' into bytes. Returns (packed_bytes, padding_bits)."""
    # Add padding to make length multiple of 8
    padding = (8 - len(bit_string) % 8) % 8
    bit_string += "0" * padding
    
    packed = bytearray()
    for i in range(0, len(bit_string), 8):
        byte_str = bit_string[i:i + 8]
        packed.append(int(byte_str, 2))
    
    return bytes(packed), padding


def _build_huff_file(
    original_size: int,
    filename: str,
    padding_bits: int,
    codes: Dict[int, str],
    packed_bytes: bytes
) -> bytes:
    """
    Build the .huff file format:
    
    HEADER:
        - Magic: b'HUFF' (4 bytes)
        - Original size: uint64 (8 bytes)
        - Filename length: uint16 (2 bytes)
        - Filename: variable bytes
        - Padding bits: uint8 (1 byte)
        - Code table length: uint32 (4 bytes)
        - Code table: JSON bytes
    BODY:
        - Compressed data
    """
    # Serialize code table as JSON
    # Convert int keys to strings for JSON
    code_table_json = json.dumps({str(k): v for k, v in codes.items()}).encode('utf-8')
    
    filename_bytes = filename.encode('utf-8')
    
    header = bytearray()
    
    # Magic bytes
    header.extend(HUFF_MAGIC)
    
    # Original file size (uint64, big-endian)
    header.extend(struct.pack('>Q', original_size))
    
    # Filename length + filename
    header.extend(struct.pack('>H', len(filename_bytes)))
    header.extend(filename_bytes)
    
    # Padding bits (uint8)
    header.extend(struct.pack('B', padding_bits))
    
    # Code table length + code table
    header.extend(struct.pack('>I', len(code_table_json)))
    header.extend(code_table_json)
    
    # Combine header + compressed body
    return bytes(header) + packed_bytes


def _package_empty(filename: str) -> bytes:
    """Package an empty file."""
    return _build_huff_file(
        original_size=0,
        filename=filename,
        padding_bits=0,
        codes={},
        packed_bytes=b''
    )


def _package_single_byte(raw_bytes: bytearray, filename: str) -> bytes:
    """Package a single-byte file."""
    codes = {raw_bytes[0]: "0"}
    return _build_huff_file(
        original_size=1,
        filename=filename,
        padding_bits=7,  # 1 bit data + 7 padding
        codes=codes,
        packed_bytes=bytes([0])  # "0" padded to 00000000
    )


def format_size(size_bytes: int) -> str:
    """Format bytes to human-readable string."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    elif size_bytes < 1024 * 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.2f} MB"
    else:
        return f"{size_bytes / (1024 * 1024 * 1024):.2f} GB"
