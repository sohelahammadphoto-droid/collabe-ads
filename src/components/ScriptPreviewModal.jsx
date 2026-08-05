import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Edit3, Rocket, Phone, MapPin } from 'lucide-react';

/**
 * Build a full Bangla promotional video script from the job payload
 */
function buildFullScript(payload) {
  if (!payload) return '';
  const {
    fromCity    = 'ঢাকা',
    destination = 'Dubai',
    ticketRate  = '',
    baggage     = '',
    phone       = '',
    location    = '',
    vibe        = 'cinematic sunset',
    reference_image,
  } = payload;

  const mode = reference_image ? 'Image-to-Video (রেফারেন্স ছবি সহ)' : 'Text-to-Video';

  return `
════════════════════════════════════════
✈️  ফ্লাইট টিকেট প্রমো ভিডিও — AI স্ক্রিপ্ট
════════════════════════════════════════

📍 রুট     : ${fromCity} ➜ ${destination}
💰 রেট     : ${ticketRate || '(দাম উল্লেখ নেই)'}
🧳 ব্যাগেজ : ${baggage || '(উল্লেখ নেই)'}
📞 নম্বর   : ${phone || '(উল্লেখ নেই)'}
🗺️ লোকেশন : ${location || '(উল্লেখ নেই)'}
🎥 ভাইব    : ${vibe}
🤖 মোড     : ${mode}

────────────────────────────────────────
🎬  VIDEO GENERATION PROMPT (AI-এ পাঠানো হবে)
────────────────────────────────────────

A stunning ${vibe} cinematic promotional travel video advertising a 
discounted flight ticket offer from ${fromCity} to ${destination}.

Scene: Show breathtaking aerial views of ${destination} — iconic skyline,
famous landmarks, vibrant atmosphere. Camera movement should feel like 
a luxury airline advertisement — smooth drone shots, slow motion bokeh 
transitions, golden hour light effects.

Mood: Aspirational, emotional, premium travel. Make viewers feel they 
MUST book this flight immediately.

Duration: ~6-8 seconds of high-quality motion footage.
Style: Cinematic ${vibe} lighting, film grain, ultra-realistic 4K quality.
Mode: ${mode}.

────────────────────────────────────────
📺  VIDEO OVERLAY / BANNER (ভিডিওর নিচে দেখাবে)
────────────────────────────────────────

✈️  ${fromCity} → ${destination}
💥  মাত্র ${ticketRate || 'বিশেষ মূল্যে'}!
🧳  ব্যাগেজ: ${baggage || 'সুবিধাজনক'}
📞  ${phone || 'যোগাযোগ করুন'}
📍  ${location || ''}

════════════════════════════════════════
`.trim();
}

export default function ScriptPreviewModal({ isOpen, jobPayload, onApprove, onClose }) {
  const [editedScript, setEditedScript] = useState('');
  const [hasEdited, setHasEdited] = useState(false);

  React.useEffect(() => {
    if (isOpen && jobPayload) {
      setEditedScript(buildFullScript(jobPayload));
      setHasEdited(false);
    }
  }, [isOpen, jobPayload]);

  if (!isOpen) return null;

  const handleApprove = () => {
    onApprove({
      ...jobPayload,
      prompt: editedScript,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#131b2e] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/50 flex flex-col max-h-[92vh] overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">AI ভিডিও স্ক্রিপ্ট প্রিভিউ</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                নিচের স্ক্রিপ্ট দেখুন — চাইলে এডিট করুন — তারপর Approve দিন
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Info Pills ── */}
        <div className="px-6 py-3 bg-[#0d1526] border-b border-slate-800 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
            ✈️ {jobPayload?.fromCity} → {jobPayload?.destination}
          </span>
          {jobPayload?.ticketRate && (
            <span className="px-3 py-1 rounded-full text-xs bg-amber-500/15 text-amber-300 border border-amber-500/25">
              💰 {jobPayload.ticketRate}
            </span>
          )}
          {jobPayload?.baggage && (
            <span className="px-3 py-1 rounded-full text-xs bg-slate-700/60 text-slate-300 border border-slate-600/40">
              🧳 {jobPayload.baggage}
            </span>
          )}
          {jobPayload?.phone && (
            <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
              <Phone className="w-3 h-3" /> {jobPayload.phone}
            </span>
          )}
          {jobPayload?.location && (
            <span className="px-3 py-1 rounded-full text-xs bg-sky-500/15 text-sky-300 border border-sky-500/25 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {jobPayload.location}
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs bg-purple-500/15 text-purple-300 border border-purple-500/25">
            🎥 {jobPayload?.vibe}
          </span>
        </div>

        {/* ── Script Textarea ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              সম্পূর্ণ স্ক্রিপ্ট — প্রয়োজনে পরিবর্তন করুন
            </span>
            {hasEdited && (
              <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                এডিট করা হয়েছে ✏️
              </span>
            )}
          </div>

          <textarea
            value={editedScript}
            onChange={(e) => { setEditedScript(e.target.value); setHasEdited(true); }}
            rows={16}
            className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 text-xs font-mono leading-relaxed resize-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            spellCheck={false}
          />
          <p className="text-[11px] text-slate-500 mt-2">
            💡 উপরের স্ক্রিপ্ট Colab AI-তে পাঠানো হবে। যেকোনো লাইন পরিবর্তন করতে পারেন।
          </p>
        </div>

        {/* ── Footer Buttons ── */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-all">
            ← ফিরে যান
          </button>

          <button onClick={handleApprove}
            className="px-7 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
            <CheckCircle2 className="w-4 h-4" />
            <span>✅ Approve — ভিডিও তৈরি শুরু করুন</span>
            <Rocket className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
