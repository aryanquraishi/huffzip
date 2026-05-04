"""
HuffZip — Cleanup Module
Deletes expired compression jobs and files from Supabase.
"""

import os
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()


def cleanup_expired():
    """Delete expired jobs and their files from Supabase. Returns count of cleaned jobs."""
    try:
        from supabase_client import get_client, delete_job_files, BUCKET_NAME

        client = get_client()
        now = datetime.now(timezone.utc).isoformat()

        result = client.table("compression_jobs").select("id").lt("expires_at", now).execute()

        if not result.data:
            print("No expired jobs found.")
            return {"cleaned": 0, "errors": 0}

        count = 0
        errors = 0
        for job in result.data:
            job_id = job["id"]
            try:
                delete_job_files(job_id)
                client.table("compression_jobs").delete().eq("id", job_id).execute()
                count += 1
            except Exception as e:
                errors += 1
                print(f"Error cleaning job {job_id}: {e}")

        print(f"Cleaned up {count} expired jobs ({errors} errors).")
        return {"cleaned": count, "errors": errors}

    except Exception as e:
        print(f"Cleanup failed: {e}")
        return {"cleaned": 0, "errors": 1, "message": str(e)}


if __name__ == "__main__":
    cleanup_expired()
