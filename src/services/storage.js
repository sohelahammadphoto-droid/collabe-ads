/**
 * AI Promo Studio - Local Storage Service
 */

const STORAGE_KEYS = {
  COLAB_URL:   'ai_promo_colab_url',
  HISTORY:     'ai_promo_history',
  GEMINI_KEY:  'ai_promo_gemini_key',
};

// Gemini API Key (stored locally in browser only — never sent to GitHub)
export const getStoredGeminiKey = () => {
  return localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '';
};

export const saveGeminiKey = (key) => {
  localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key.trim());
};

// Default fallback demo URL or empty
export const getStoredColabUrl = () => {
  return localStorage.getItem(STORAGE_KEYS.COLAB_URL) || '';
};

export const saveColabUrl = (url) => {
  localStorage.setItem(STORAGE_KEYS.COLAB_URL, url.trim());
};

// Generation History Management
export const getStoredHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse history:', err);
    return [];
  }
};

export const saveHistoryItem = (item) => {
  try {
    const history = getStoredHistory();
    // Add new item at top
    const updated = [item, ...history];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save history item:', err);
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
};

export const deleteHistoryItem = (id) => {
  const history = getStoredHistory();
  const updated = history.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  return updated;
};
