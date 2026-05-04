import requests, time
BASE = "http://localhost:8000"

# Create a large test (simulating ~500KB file with random-ish data)
import os
large_data = os.urandom(500 * 1024)  # 500KB random bytes

print("=== COMPARE with 500KB file ===")
start = time.time()
r = requests.post(f"{BASE}/compare", files={"file": ("large_test.bin", large_data)}, timeout=30)
elapsed = time.time() - start
print(f"  Response: {r.status_code} in {elapsed:.1f}s")

if r.status_code == 200:
    c = r.json()
    print(f"  Best: {c['best_algorithm']}")
    for k, v in c["algorithms"].items():
        print(f"  {v['name']}: ratio={v['ratio']}% time={v['time_ms']}ms size={v['compressed_size']}")
    print(f"  Conclusion: {c['conclusion'][:80]}...")
else:
    print(f"  Error: {r.text[:200]}")

# Also test compress page flow
print("\n=== COMPRESS text file ===")
with open(r"e:\CD-CLG\huffzip\test_sample.txt", "rb") as f:
    r = requests.post(f"{BASE}/upload", files={"file": ("test.txt", f)})
jid = r.json()["job_id"]
time.sleep(1)
s = requests.get(f"{BASE}/status/{jid}").json()
print(f"  Status: {s['status']}, Ratio: {s.get('ratio')}%, Expanded: {s.get('expanded')}")

print("\nAll done!")
