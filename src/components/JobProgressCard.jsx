import React, { useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, XCircle, Terminal, RefreshCw, StopCircle } from 'lucide-react';

export default function JobProgressCard({ jobStatus, logs, promptText, modelUsed, onReset, onStop }) {
  const logEndRef = useRef(null);

  // Auto-scroll log feed to bottom when new messages arrive
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const progress = jobStatus?.progress || 5;
  const status = jobStatus?.status || 'Processing';
  const currentMsg = jobStatus?.message || '⏳ ভিডিও জেনারেশন শুরু হচ্ছে...';

  return (
    <div className="bg-[#131b2e] border border-indigo-500/30 rounded-2xl p-6 shadow-2xl shadow-indigo-950/30 space-y-6">
      
      {/* Header info & Stop Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          {status === 'Processing' && (
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            </div>
          )}
          {status === 'Completed' && (
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          )}
          {status === 'Failed' && (
            <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/30">
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-slate-100">
              {status === 'Processing' && 'লাইভ ভিডিও জেনারেশন প্রসেস...'}
              {status === 'Completed' && '✅ ভিডিও প্রস্তুত!'}
              {status === 'Failed' && '❌ প্রসেস থমকে গেছে বা বাতিল হয়েছে'}
            </h3>
            <p className="text-xs text-slate-400">মডেল: {modelUsed}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {status === 'Processing' && (
            <button
              onClick={onStop}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-600/30 border border-rose-500/40 transition-all flex items-center space-x-1.5"
            >
              <StopCircle className="w-4 h-4" />
              <span>ভিডিও জেনারেশন থামান</span>
            </button>
          )}

          {status !== 'Processing' && (
            <button
              onClick={onReset}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>নতুন ভিডিও</span>
            </button>
          )}
        </div>
      </div>

      {/* Raw Prompt display */}
      <div className="p-3.5 bg-[#0b0f19] rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
        <span className="text-slate-500 font-sans block mb-1">আপনার প্রম্পট:</span>
        "{promptText}"
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-300">
          <span>{currentMsg}</span>
          <span className="text-indigo-400 font-mono">{progress}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Chat-Style Bangla Live Log Terminal */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>লাইভ কোলাব ইভেন্ট লগ (Bangla):</span>
        </div>

        <div className="bg-[#090d16] border border-slate-800/80 rounded-xl p-4 max-h-52 overflow-y-auto space-y-2 text-xs font-mono">
          {logs.map((log, index) => (
            <div
              key={index}
              className="flex items-start space-x-2 animate-fadeIn"
            >
              <span className="text-slate-600 font-sans shrink-0">[{log.time}]</span>
              <span className="text-indigo-300 font-sans">{log.msg}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

    </div>
  );
}
