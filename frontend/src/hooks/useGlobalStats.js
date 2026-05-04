import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants/fileTypes';

/**
 * Fetch and cache global stats from backend
 */
export function useGlobalStats() {
  const [stats, setStats] = useState({
    total_files: 0,
    total_bytes_saved: 0,
    total_compressions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/stats`);
        setStats(res.data);
      } catch {
        // Use defaults if backend is down
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading };
}
