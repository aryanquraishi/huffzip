"""Full Supabase integration test"""
import requests, time, sys, os
sys.path.insert(0, r"e:\CD-CLG\huffzip\backend")
from dotenv import load_dotenv
load_dotenv(r"e:\CD-CLG\huffzip\backend\.env")

BASE = "http://localhost:8000"

# 1. Upload file
print("=== UPLOAD ===")
with open(r"e:\CD-CLG\huffzip\test_sample.txt", "rb") as f:
    r = requests.post(f"{BASE}/upload", files={"file": ("test.txt", f)})
d = r.json()
jid = d["job_id"]
print(f"  Job: {jid}")
print(f"  Status: {d['status']}")

time.sleep(3)

# 2. Check status
print("\n=== STATUS ===")
s = requests.get(f"{BASE}/status/{jid}").json()
print(f"  Status: {s['status']}")
print(f"  Ratio: {s.get('ratio')}%")

# 3. Check Supabase for the job
print("\n=== SUPABASE DB CHECK ===")
from supabase import create_client
client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))
result = client.table("compression_jobs").select("*").execute()
print(f"  Jobs in DB: {len(result.data)}")
if result.data:
    job = result.data[-1]
    print(f"  Latest: name={job['original_name']}, status={job['status']}")
    print(f"  Expires: {job['expires_at']}")

# 4. Check global stats
print("\n=== GLOBAL STATS ===")
stats = client.table("global_stats").select("*").execute()
if stats.data:
    print(f"  Files: {stats.data[0]['total_files']}")
    print(f"  Bytes saved: {stats.data[0]['total_bytes_saved']}")

print("\nDone!")
