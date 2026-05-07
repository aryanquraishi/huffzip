import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../constants/fileTypes';

/**
 * Compression state management hook
 */
export function useCompression() {
  const [status, setStatus] = useState('idle'); // idle | uploading | processing | complete | error
  const [jobId, setJobId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [warning, setWarning] = useState(null);

  const upload = useCallback(async (file) => {
    const MAX_RETRIES = 3;
    const TIMEOUT_MS = 120000; // 120 seconds

    setStatus('uploading');
    setError(null);
    setResult(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: TIMEOUT_MS,
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / (e.total || 1));
            setUploadProgress(pct);
          },
        });

        const data = response.data;
        setJobId(data.job_id);
        setFileInfo(data.file_info);
        setWarning(data.warning || null);
        setStatus('processing');
        return data.job_id;
      } catch (err) {
        const isNetworkError = !err.response && (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED' || err.message === 'Network Error');

        if (isNetworkError && attempt < MAX_RETRIES) {
          // Wait before retry: 2s, 4s
          const delay = attempt * 2000;
          setUploadProgress(0);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }

        // Final failure
        let msg;
        if (isNetworkError) {
          msg = 'Network error — please check your internet connection and try again.';
        } else if (err.code === 'ECONNABORTED') {
          msg = 'Upload timed out — file may be too large or connection too slow.';
        } else {
          msg = err.response?.data?.detail || err.message || 'Upload failed';
        }
        setError(msg);
        setStatus('error');
        return null;
      }
    }
  }, []);

  const checkStatus = useCallback(async (id) => {
    try {
      const res = await axios.get(`${API_URL}/status/${id || jobId}`);
      const job = res.data;

      if (job.status === 'complete') {
        setResult(job.stats || job);
        setStatus('complete');
      } else if (job.status === 'failed') {
        setError(job.error || 'Compression failed');
        setStatus('error');
      }
      return job;
    } catch (err) {
      return null;
    }
  }, [jobId]);

  const reset = useCallback(() => {
    setStatus('idle');
    setJobId(null);
    setUploadProgress(0);
    setResult(null);
    setError(null);
    setFileInfo(null);
    setWarning(null);
  }, []);

  const getDownloadUrl = useCallback(() => {
    if (!jobId) return null;
    return `${API_URL}/download/${jobId}`;
  }, [jobId]);

  return {
    status, jobId, uploadProgress, result, error, fileInfo, warning,
    upload, checkStatus, reset, getDownloadUrl,
  };
}
