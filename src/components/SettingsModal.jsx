import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, AlertCircle, RefreshCw, Cpu, ExternalLink, HelpCircle } from 'lucide-react';
import { checkHealth } from '../services/api';

export default function SettingsModal({ isOpen, onClose, colabUrl, onSaveUrl, isConnected, setIsConnected }) {
  const [urlInput, setUrlInput] = useState(colabUrl || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

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
      setTestResult({
        success: true,
        msg: `✅ সংযোগ সফল! ${data.gpu_name || 'GPU প্রস্তুত'}`,
      });
      onSaveUrl(urlInput);
    } catch (err) {
      setIsConnected(false);
      setTestResult({
        success: false,
        msg: err.message || '❌ Colab সার্ভার connected নেই — notebook চালিয়ে নতুন URL সেটিংসে বসান',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveUrl(urlInput);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#131b2e] border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Colab সংযোগ সেটিংস</h3>
              <p className="text-xs text-slate-400">Google Colab Cloudflare Tunnel URL সেটআপ করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* URL Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Cloudflare Public URL (যেমন: https://xxx.trycloudflare.com)
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://random-name.trycloudflare.com"
              className="w-full bg-[#0b0f19] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Connection Test Result Feedback */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{testResult.msg}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              {testing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              ) : (
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              )}
              <span>{testing ? 'চেক হচ্ছে...' : 'সংযোগ পরীক্ষা করুন'}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>URL সেভ করুন</span>
            </button>
          </div>
        </div>

        {/* Colab Instructions Guide */}
        <div className="p-4 bg-[#0b0f19] rounded-xl border border-slate-800 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>কীভাবে Colab URL পাবেন?</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-300">
            <li>
              Google Colab-এ <a href="https://colab.research.google.com/#create=true" target="_blank" rel="noreferrer" className="text-indigo-400 font-semibold underline inline-flex items-center gap-1">নতুন নোটবুক পেজ খুলুন <ExternalLink className="w-3 h-3" /></a> এবং GPU (T4) এনাবল করুন।
            </li>
            <li>অ্যাপের <b>"কোলাব কোড"</b> ট্যাব থেকে সম্পূর্ণ Python কোডটি কপি করুন।</li>
            <li>Colab-এর এক সেল-এ পেস্ট করে <b>Run (Shift+Enter)</b> চাপুন।</li>
            <li>টার্মিনালে প্রিন্ট হওয়া <code className="text-emerald-400">https://xxx.trycloudflare.com</code> লিংকটি কপি করে উপরে পেস্ট করুন।</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
