import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Rocket, Phone, MapPin, Film, Mic, Eye as EyeIcon, Clock, RefreshCw, Cpu } from 'lucide-react';
import { getStoredColabUrl } from '../services/storage';
import { generateScriptApi } from '../services/api';

// ── Fallback script generator ────────────────────────────────────────────────
function buildFallbackScript(payload) {
  const { fromCity = '', destination = '', ticketRate = '', baggage = '', phone = '', location = '', vibe = '' } = payload || {};
  const price = ticketRate || 'বিশেষ মূল্যে';
  const bag   = baggage    || '২০ কেজি';
  const tel   = phone      || 'যোগাযোগ করুন';
  const addr  = location   || '';

  return `
╔══════════════════════════════════════════════╗
   ✈️  ফ্লাইট প্রমো ভিডিও — সম্পূর্ণ স্ক্রিপ্ট
   ${fromCity} ➜ ${destination}
╚══════════════════════════════════════════════╝

📋 ভিডিও ইনফো
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
রুট      : ${fromCity} → ${destination}
মূল্য    : ${price}
ব্যাগেজ  : ${bag}
ফোন      : ${tel}
লোকেশন  : ${addr || "—"}
ভাইব     : ${vibe}
মোট সময় : ৩০ - ৪৫ সেকেন্ড


🎬 সিন-১ (০ - ৬ সেকেন্ড) — ওপেনিং শট
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 ভিজ্যুয়াল: ${fromCity}-এর আকাশসীমা — ${vibe} আলোয় বিমান উড়ছে।
🎥 ক্যামেরা: Slow drone pull-back shot
🎙️ ভয়েস: "স্বপ্নের যাত্রা শুরু হোক..."
🎵 মিউজিক: Soft emotional cinematic — ধীরে শুরু


🎬 সিন-২ (৬ - ১৫ সেকেন্ড) — অফার রিভিল
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 ভিজ্যুয়াল: ${destination}-এর বিখ্যাত দৃশ্য। সোনালি আলোয় শহর ঝলমলে।
   ✈️ "${fromCity} → ${destination}"
🎥 ক্যামেরা: Aerial flyover — শহরের উপর দিয়ে
🎙️ ভয়েস: "${fromCity} থেকে ${destination}! এখন মাত্র ${price}!"
🎵 মিউজিক: আনন্দদায়ক বিট — excitement build


🎬 সিন-৩ (১৫ - ২৫ সেকেন্ড) — সুবিধা দেখানো
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 ভিজ্যুয়াল: বিমানের ভেতরে আরামদায়ক সিট।
   🧳 "ব্যাগেজ: ${bag}" | ✈️ "সীমিত আসন!"
🎥 ক্যামেরা: Close-up থেকে wide — smooth pan
🎙️ ভয়েস: "${bag} ব্যাগেজ সহ সস্তা ডিলে ভ্রমণ করুন!"
🎵 মিউজিক: পিক ট্রানজিশন


🎬 সিন-৪ (২৫ - ৩৫ সেকেন্ড) — Call to Action
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 ভিজ্যুয়াল: গাঢ় ব্যাকগ্রাউন্ডে: 📞 ${tel} ${addr ? '| ' + addr : ''}
🎥 ক্যামেরা: Static — সব মনোযোগ টেক্সটে
🎙️ ভয়েস: "সীমিত আসন! এখনই বুক করুন — ${tel}"
🎵 মিউজিক: জোরালো beat


🎬 সিন-৫ (৩৫ - ৪৫ সেকেন্ড) — End Card
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 ভিজ্যুয়াল: লোগো ও বিমান আকাশে মিলিয়ে যাচ্ছে।
🎥 ক্যামেরা: Slow zoom-out
🎙️ ভয়েস: "আপনার নিরাপদ যাত্রায় আমরা আপনার পাশে..."
🎵 মিউজিক: Fade out


📺 VIDEO OVERLAY BANNER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✈️  ${fromCity} → ${destination}
💰  মাত্র ${price}!
🧳  ব্যাগেজ: ${bag}
📞  ${tel}${addr ? ' | 📍 ' + addr : ''}
`.trim();
}

export default function ScriptPreviewModal({ isOpen, jobPayload, onApprove, onClose }) {
  const [editedScript, setEditedScript] = useState('');
  const [hasEdited, setHasEdited]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [scriptSource, setScriptSource] = useState('Colab Backend');

  useEffect(() => {
    if (!isOpen || !jobPayload) return;
    setHasEdited(false);

    const colabUrl = getStoredColabUrl();

    if (colabUrl) {
      setLoading(true);
      generateScriptApi(colabUrl, jobPayload)
        .then((remoteScript) => {
          if (remoteScript) {
            setEditedScript(remoteScript);
            setScriptSource('Colab AI Engine');
          } else {
            setEditedScript(buildFallbackScript(jobPayload));
            setScriptSource('App Template');
          }
        })
        .catch(() => {
          setEditedScript(buildFallbackScript(jobPayload));
          setScriptSource('App Template');
        })
        .finally(() => setLoading(false));
    } else {
      setEditedScript(buildFallbackScript(jobPayload));
      setScriptSource('App Template');
    }
  }, [isOpen, jobPayload]);

  if (!isOpen) return null;

  const handleApprove = () => onApprove({ ...jobPayload, prompt: editedScript });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#131b2e] border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              {loading ? <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" /> : <Film className="w-5 h-5 text-indigo-400" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                ভিডিও স্ক্রিপ্ট স্টোরিবোর্ড
                <span className="text-[10px] px-2 py-0.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5" /> {scriptSource}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {loading ? 'Colab সার্ভার থেকে স্ক্রিপ্ট লোড হচ্ছে...' : 'সম্পাদনা করুন → Approve দিন'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Pills */}
        <div className="px-6 py-2.5 bg-[#0d1526] border-b border-slate-800 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
            ✈️ {jobPayload?.fromCity} → {jobPayload?.destination}
          </span>
          {jobPayload?.ticketRate && <span className="px-3 py-1 rounded-full text-xs bg-amber-500/15 text-amber-300 border border-amber-500/25">💰 {jobPayload.ticketRate}</span>}
          {jobPayload?.baggage    && <span className="px-3 py-1 rounded-full text-xs bg-slate-700/60 text-slate-300 border border-slate-600/40">🧳 {jobPayload.baggage}</span>}
          {jobPayload?.phone      && <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1"><Phone className="w-3 h-3"/>{jobPayload.phone}</span>}
          {jobPayload?.location   && <span className="px-3 py-1 rounded-full text-xs bg-sky-500/15 text-sky-300 border border-sky-500/25 flex items-center gap-1"><MapPin className="w-3 h-3"/>{jobPayload.location}</span>}
        </div>

        {/* Legend */}
        <div className="px-6 py-2 bg-indigo-500/5 border-b border-slate-800 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><EyeIcon className="w-3 h-3 text-blue-400"/>📷 ভিজ্যুয়াল</span>
          <span className="flex items-center gap-1"><Mic className="w-3 h-3 text-green-400"/>🎙️ ভয়েস</span>
          <span className="flex items-center gap-1"><Film className="w-3 h-3 text-purple-400"/>🎥 ক্যামেরা</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400"/>⏱️ সময়</span>
          {hasEdited && <span className="ml-auto text-emerald-400">✏️ এডিট করা হয়েছে</span>}
        </div>

        {/* Script Editor */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin" />
              <p className="text-sm text-slate-300 font-medium">Colab থেকে স্ক্রিপ্ট তৈরি হচ্ছে...</p>
            </div>
          ) : (
            <textarea
              value={editedScript}
              onChange={(e) => { setEditedScript(e.target.value); setHasEdited(true); }}
              rows={20}
              className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 text-xs font-mono leading-relaxed resize-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              spellCheck={false}
            />
          )}
          {!loading && (
            <p className="text-[11px] text-slate-500 mt-2">
              💡 স্ক্রিপ্টের যেকোনো অংশ এডিট করতে পারেন — তারপর Approve দিন।
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-all">
            ← ফিরে যান
          </button>
          <button onClick={handleApprove} disabled={loading}
            className="px-7 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
            <CheckCircle2 className="w-4 h-4" />
            <span>✅ Approve — ভিডিও তৈরি শুরু</span>
            <Rocket className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
