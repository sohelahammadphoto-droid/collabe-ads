import React from 'react';
import { History, Trash2, Calendar, Play, Download, Sparkles, Video } from 'lucide-react';

export default function HistoryView({ historyList, onSelectHistory, onDeleteHistory, onClearAll }) {
  if (!historyList || historyList.length === 0) {
    return (
      <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-12 text-center max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
          <History className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-200">কোন আগের ভিডিও পাওয়া যায়নি</h3>
        <p className="text-xs text-slate-400 max-out-md">
          আপনি এখনও কোনো ভিডিও জেনারেট করেননি। আপনার জেনারেট করা সমস্ত ভিডিও লোকাল ব্রাউজারে এখানে জমা থাকবে।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            আগের জেনারেট করা ভিডিওসমূহ ({historyList.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            আপনার লোকাল ডিভাইসে সংরক্ষিত সমস্ত ভিডিও গ্যালারি
          </p>
        </div>

        <button
          onClick={onClearAll}
          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>হিস্ট্রি মুছে ফেলুন</span>
        </button>
      </div>

      {/* Grid of Past Generations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {historyList.map((item) => (
          <div
            key={item.id}
            className="bg-[#131b2e] border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
          >
            {/* Video Preview Player */}
            <div className="relative bg-black aspect-video overflow-hidden">
              <video
                src={item.videoUrl}
                controls
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md font-semibold">
                    {item.model}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleString('bn-BD')}
                  </span>
                </div>

                <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed font-medium">
                  "{item.prompt}"
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectHistory(item)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>পুনরায় চালান</span>
                </button>

                <div className="flex items-center space-x-2">
                  <a
                    href={item.videoUrl}
                    download={`ai_promo_${item.id}.mp4`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="ডাউনলোড"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => onDeleteHistory(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
