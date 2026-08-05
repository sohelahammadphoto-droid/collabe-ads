/**
 * AI Promo Studio - Colab API Service
 */

// Helper to format backend base URL
export const sanitizeUrl = (url) => {
  if (!url) return '';
  let clean = url.trim();
  if (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean;
};

// Check backend health
export const checkHealth = async (baseUrl) => {
  const cleanUrl = sanitizeUrl(baseUrl);
  if (!cleanUrl) {
    throw new Error('কানেকশন URL দেওয়া হয়নি');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${cleanUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`সার্ভার সাড়া দেয়নি (Status: ${res.status})`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('❌ Colab সার্ভার connected নেই — notebook চালিয়ে নতুন URL সেটিংসে বসান');
    }
    throw new Error('❌ Colab সার্ভার connected নেই — notebook চালিয়ে নতুন URL সেটিংসে বসান');
  }
};

// Generate custom Bangla script from Colab backend
export const generateScriptApi = async (baseUrl, payload) => {
  const cleanUrl = sanitizeUrl(baseUrl);
  if (!cleanUrl) return null;

  try {
    const res = await fetch(`${cleanUrl}/generate-script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.script || null;
  } catch (err) {
    console.error('Failed to generate script from Colab backend:', err);
    return null;
  }
};

// Submit new video generation job
export const submitJob = async (baseUrl, { video_model, prompt }) => {
  const cleanUrl = sanitizeUrl(baseUrl);
  if (!cleanUrl) {
    throw new Error('❌ Colab সার্ভার connected নেই — notebook চালিয়ে নতুন URL সেটিংসে বসান');
  }

  try {
    const res = await fetch(`${cleanUrl}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_model, prompt }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'ভিডিও সাবমিট করতে ব্যর্থ হয়েছে');
    }

    const data = await res.json();
    return data.job_id;
  } catch (err) {
    if (err.message.includes('Colab')) throw err;
    throw new Error('❌ Colab সার্ভার connected নেই — notebook চালিয়ে নতুন URL সেটিংসে বসান');
  }
};

// Cancel active video generation job
export const cancelJob = async (baseUrl, jobId) => {
  const cleanUrl = sanitizeUrl(baseUrl);
  if (!cleanUrl || !jobId) return;

  try {
    await fetch(`${cleanUrl}/jobs/${jobId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.warn('Cancel job notice:', err);
  }
};

// Poll job status
export const fetchJobStatus = async (baseUrl, jobId) => {
  const cleanUrl = sanitizeUrl(baseUrl);
  if (!cleanUrl) {
    throw new Error('❌ Colab সার্ভার connected নেই — notebook চালিয়ে নতুন URL সেটিংসে বসান');
  }

  try {
    const res = await fetch(`${cleanUrl}/jobs/${jobId}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error('জব স্ট্যাটাস রিড করা যায়নি');
    }

    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error('❌ Colab সার্ভার connected নেই — notebook চালিয়ে নতুন URL সেটিংসে বসান');
  }
};

// Get streaming video URL
export const getJobVideoUrl = (baseUrl, jobId) => {
  const cleanUrl = sanitizeUrl(baseUrl);
  return `${cleanUrl}/jobs/${jobId}/video`;
};
