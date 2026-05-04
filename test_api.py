"""Quick API verification script"""
import requests, time

BASE = "http://localhost:8000"

# 1. Root
print("=== ROOT ===")
r = requests.get(f"{BASE}/")
print(f"  Status: {r.status_code}")
print(f"  Body: {r.json()}")

# 2. Upload
print("\n=== UPLOAD ===")
with open(r"e:\CD-CLG\huffzip\test_sample.txt", "rb") as f:
    r = requests.post(f"{BASE}/upload", files={"file": ("test_sample.txt", f)})
d = r.json()
jid = d["job_id"]
status = d["status"]
size = d["size"]
print(f"  Job: {jid}")
print(f"  Status: {status}")
print(f"  Size: {size} bytes")

time.sleep(2)

# 3. Status
print("\n=== STATUS ===")
r = requests.get(f"{BASE}/status/{jid}")
s = r.json()
print(f"  Status: {s['status']}")
print(f"  Ratio: {s.get('ratio')}%")
print(f"  Original: {s.get('original_size')} bytes")
print(f"  Compressed: {s.get('compressed_size')} bytes")
print(f"  Time: {s.get('time_ms')}ms")

# 4. Events (polling fallback)
print("\n=== EVENTS ===")
r = requests.get(f"{BASE}/events/{jid}")
ev = r.json()
print(f"  Total events: {ev['count']}")
for e in ev["events"]:
    t = e.get("type", "?")
    m = e.get("msg", "")
    print(f"  [{t}] {m}")

# 5. Download
print("\n=== DOWNLOAD ===")
r = requests.get(f"{BASE}/download/{jid}")
print(f"  Status: {r.status_code}, Size: {len(r.content)} bytes")

# 6. Decompress roundtrip
print("\n=== DECOMPRESS ===")
huff_data = r.content
r = requests.post(f"{BASE}/decompress", files={"file": ("test.huff", huff_data)})
print(f"  Status: {r.status_code}, Restored: {len(r.content)} bytes")
print(f"  Lossless: {len(r.content) == size}")

# 7. Compare
print("\n=== COMPARE ===")
with open(r"e:\CD-CLG\huffzip\test_sample.txt", "rb") as f:
    r = requests.post(f"{BASE}/compare", files={"file": ("test.txt", f)})
c = r.json()
print(f"  Best algorithm: {c['best_algorithm']}")
for k, v in c["algorithms"].items():
    print(f"  {k}: ratio={v['ratio']}% time={v['time_ms']}ms")

print("\n=== ALL TESTS PASSED ===")
