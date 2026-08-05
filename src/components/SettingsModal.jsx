import React, { useState } from 'react';
import {
  Settings, Save, CheckCircle2, AlertCircle, RefreshCw,
  Cpu, ExternalLink, HelpCircle, Key, Eye, EyeOff, Sparkles, Zap
} from 'lucide-react';
import { checkHealth } from '../services/api';
import {
  getStoredGeminiKey, saveGeminiKey,
  getStoredOpenRouterKey, saveOpenRouterKey,
  getStoredOpenRouterModel, saveOpenRouterModel
} from '../services/storage';
import { FREE_OPENROUTER_MODELS, testOpenRouterConnection } from '../services/openrouter';

export default function SettingsModal({ isOpen, onClose, colabUrl, onSaveUrl, isConnected, setIsConnected }) {
  const [urlInput, setUrlInput]             = useState(colabUrl || '');
  const [testing, setTesting]               = useState(false);
  const [testResult, setTestResult]         = useState(null);

  // Gemini API Key
  const [geminiKey, setGeminiKey]           = useState(getStoredGeminiKey());
  const [showGeminiKey, setShowGeminiKey]   = useState(false);
  const [geminiSaved, setGeminiSaved]       = useState(false);

  // OpenRouter Config
  const [openRouterKey, setOpenRouterKey]     = useState(getStoredOpenRouterKey());
  const [selectedModel, setSelectedModel]     = useState(getStoredOpenRouterModel());
  const [showORKey, setShowORKey]             = useState(false);
  const [orSaved, setOrSaved]                 = useState(false);
  const [orTesting, setOrTesting]             = useState(false);
  const [orTestResult, setOrTestResult]       = useState(null);

  if (!isOpen) return null;

  // Test Colab backend connection
  const handleTestConnection = async () => {
    if (!urlInput.trim()) {
      setTestResult({ success: false, msg: 'URL ইনপুট ঘর খালি রাখা যাবে না' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const data = await checkHealth(urlInput);
      setIsConnected(true);
      setTestResult({ success: true, msg: `✅ সংযোগ সফল! ${data.gpu_name || 'GPU প্রস্তুত'}` });
      onSaveUrl(urlInput);
    } catch (err) {
      setIsConnected(false);
      setTestResult({ success: false, msg: err.message || '❌ Colab সার্ভার connected নেই' });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveColabUrl = () => {
    onSaveUrl(urlInput);
    onClose();
  };

  const handleSaveGeminiKey = () => {
    saveGeminiKey(geminiKey);
    setGeminiSaved(true);
    setTimeout(() => setGeminiSaved(false), 2500);
  };

  const handleSaveOpenRouter = () => {
    saveOpenRouterKey(openRouterKey);
    saveOpenRouterModel(selectedModel);
    setOrSaved(true);
    setTimeout(() => setOrSaved(false), 2500);
  };

  const handleTestOpenRouter = async () => {
    setOrTesting(true);
    setOrTestResult(null);
    const res = await testOpenRouterConnection(openRouterKey, selectedModel);
    setOrTesting(false);
    if (res.success) {
      setOrTestResult({ success: true, msg: `✅ OpenRouter যুক্ত হয়েছে! AI উত্তর: "${res.text}"` });
      saveOpenRouterKey(openRouterKey);
      saveOpenRouterModel(selectedModel);
    } else {
      setOrTestResult({ success: false, msg: `❌ সংযোগ ব্যর্থ: ${res.error}` });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#131b2e] border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">সেটিংস</h3>
              <p className="text-xs text-slate-400">OpenRouter (100% Free AI), Gemini ও Colab কনফিগার করুন</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">✕</button>
        </div>

        {/* ── Section 1: OpenRouter AI (100% FREE LLM) ── */}
        <div className="space-y-4 p-4 bg-purple-950/20 border border-purple-500/30 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>OpenRouter AI — ১০০% ফ্রি স্ক্রিপ্ট ইঞ্জিন</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full">
              ফ্রি LLM সাপোর্ট
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            OpenRouter ব্যবহার করে DeepSeek R1, Meta Llama 3.3 70B বা Gemini-র মতো ১০০% ফ্রি AI মডেল দিয়ে অতি আকর্ষণীয় বাণিজ্যিক স্ক্রিপ্ট তৈরি করতে পারবেন।
          </p>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              ফ্রি AI মডেল নির্বাচন করুন:
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-[#0b0f19] border border-purple-500/40 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-400"
            >
              {FREE_OPENROUTER_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} [{m.badge}] — {m.desc}
                </option>
              ))}
            </select>
          </div>

          {/* API Key input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                OpenRouter API Key (ঐচ্ছিক / ফ্রি):
              </label>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-purple-400 hover:text-purple-300 underline flex items-center gap-1"
              >
                <span>ফ্রি API Key পান</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showORKey ? 'text' : 'password'}
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                placeholder="sk-or-v1-... (ফ্রি এপিআই কী দিতে পারেন)"
                className="w-full bg-[#0b0f19] border border-purple-500/40 rounded-xl px-4 py-2.5 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowORKey(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showORKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {orTestResult && (
            <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              orTestResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {orTestResult.success
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{orTestResult.msg}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestOpenRouter}
              disabled={orTesting}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
            >
              {orTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" /> : <Zap className="w-3.5 h-3.5 text-purple-400" />}
              <span>{orTesting ? 'টেস্ট হচ্ছে...' : 'AI টেস্ট করুন'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveOpenRouter}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
            >
              {orSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{orSaved ? 'সেভ হয়েছে ✅' : 'OpenRouter সেভ করুন'}</span>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800" />

        {/* ── Section 2: Gemini API Key ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <Key className="w-4 h-4" />
            <span>Google Gemini AI Key (বিকল্প)</span>
            {getStoredGeminiKey() && (
              <span className="ml-auto text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full">
                ✅ সেট আছে
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type={showGeminiKey ? 'text' : 'password'}
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Gemini API Key (AIza...)"
              className="w-full bg-[#0b0f19] border border-emerald-500/40 rounded-xl px-4 py-2.5 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowGeminiKey(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showGeminiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveGeminiKey}
              disabled={!geminiKey.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
            >
              {geminiSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{geminiSaved ? 'সেভ হয়েছে ✅' : 'Gemini Key সেভ করুন'}</span>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800" />

        {/* ── Section 3: Colab URL ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
            <Cpu className="w-4 h-4" />
            <span>Google Colab — ভিডিও সার্ভার</span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Cloudflare Public URL
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://random-name.trycloudflare.com"
              className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {testResult.success
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{testResult.msg}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" /> : <Cpu className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{testing ? 'চেক হচ্ছে...' : 'Colab সংযোগ পরীক্ষা'}</span>
            </button>
            <button
              onClick={handleSaveColabUrl}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>URL সেভ করুন</span>
            </button>
          </div>
        </div>

        {/* Colab Guide */}
        <div className="p-4 bg-[#0b0f19] rounded-xl border border-slate-800 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>কীভাবে Colab URL পাবেন?</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-300">
            <li>Google Colab-এ <a href="https://colab.research.google.com/#create=true" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-1">নতুন নোটবুক <ExternalLink className="w-3 h-3" /></a> খুলুন ও GPU (T4) চালু করুন।</li>
            <li>অ্যাপের <b>"কোলাব কোড"</b> ট্যাব থেকে Python কোড কপি করুন।</li>
            <li>Colab-এ পেস্ট করে <b>Run (Shift+Enter)</b> চাপুন।</li>
            <li><code className="text-emerald-400">https://xxx.trycloudflare.com</code> লিংক কপি করে উপরে দিন।</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
