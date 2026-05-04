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
    try {
      setStatus('uploading');
      setError(null);
      setResult(null);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
      const msg = err.response?.data?.detail || err.message || 'Upload failed';
      setError(msg);
      setStatus('error');
      return null;
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
