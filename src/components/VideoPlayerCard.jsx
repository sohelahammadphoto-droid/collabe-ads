import React, { useState } from 'react';
import { Download, Copy, Check, Sparkles, RefreshCw, Film } from 'lucide-react';

export default function VideoPlayerCard({ videoUrl, promptText, modelUsed, onReset }) {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#131b2e] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl shadow-emerald-950/20 space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">✅ ভিডিও প্রস্তুত!</h3>
            <p className="text-xs text-slate-400">মডেল: {modelUsed}</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>আরেকটি ভিডিও তৈরি করুন</span>
        </button>
      </div>

      {/* Video Player Box */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video group shadow-inner">
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full h-full object-contain"
        >
          আপনার ব্রাউজার ভিডিও প্লেব্যাক সমর্থন করে না।
        </video>
      </div>

      {/* Actions & Prompt */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-[#0b0f19] rounded-xl border border-slate-800">
        <div className="flex-1 text-xs text-slate-300">
          <span className="text-slate-500 block mb-0.5">মূল প্রম্পট:</span>
          <p className="font-mono text-slate-200 line-clamp-2">"{promptText}"</p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleCopyPrompt}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'কপি হয়েছে' : 'প্রম্পট কপি'}</span>
          </button>

          <a
            href={videoUrl}
            download={`ai_promo_${Date.now()}.mp4`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ডাউনলোড MP4</span>
          </a>
        </div>
      </div>

    </div>
  );
}
