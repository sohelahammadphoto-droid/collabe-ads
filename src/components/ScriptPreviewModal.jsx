import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Rocket, Phone, MapPin, Film, Mic, Eye as EyeIcon, Clock } from 'lucide-react';

/**
 * Build a full story-book style video script from the job payload
 * Scene-by-scene: Visual, Camera, Voice, Duration
 */
function buildStoryScript(payload) {
  if (!payload) return '';

  const {
    fromCity    = 'Riyadh',
    destination = 'Dhaka',
    ticketRate  = '',
    baggage     = '',
    phone       = '',
    location    = '',
    vibe        = 'cinematic sunset',
  } = payload;

  // Detect direction: Saudi → BD or BD → Saudi
  const isSaudiTooBD = ['Riyadh','Jeddah','Dammam','Medina','Abha','Tabuk','Taif','Yanbu','Hail','Jizan','Najran'].some(c => fromCity.includes(c));
  
  const origin      = fromCity;
  const dest        = destination;
  const price       = ticketRate || 'বিশেষ মূল্যে';
  const bag         = baggage    || '২০ কেজি';
  const tel         = phone      || 'যোগাযোগ করুন';
  const addr        = location   || '';

  return `
╔══════════════════════════════════════════════╗
   ✈️  ফ্লাইট প্রমো ভিডিও — সম্পূর্ণ স্ক্রিপ্ট
   ${origin} ➜ ${dest}
╚══════════════════════════════════════════════╝

📋 ভিডিও ইনফো
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
রুট      : ${origin} → ${dest}
মূল্য    : ${price}
ব্যাগেজ  : ${bag}
ফোন      : ${tel}
লোকেশন  : ${addr}
ভাইব     : ${vibe}
মোট সময় : ৩০ - ৪৫ সেকেন্ড


🎬 সিন-১ (০ - ৫ সেকেন্ড) — ওপেনিং শট
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 ভিজ্যুয়াল:
   ${origin}-এর আকাশসীমা। ভোরের আলো বা সূর্যাস্তের
   রঙিন আকাশে একটি বিমান উড়ে যাচ্ছে।
   ক্যামেরা ধীরে ধীরে zoom-in করছে।

🎥 ক্যামেরা মুভমেন্ট:
   Slow drone pull-back shot — উপর থেকে নিচে।

🎙️ ভয়েস/নারেশন:
   "স্বপ্নের যাত্রা শুরু হোক..."
   (নরম, আবেগময় কণ্ঠ — বাংলায়)

🎵 মিউজিক: Soft cinematic ব্যাকগ্রাউন্ড — আস্তে শুরু


🎬 সিন-২ (৫ - ১৫ সেকেন্ড) — অফার রিভিল
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 ভিজ্যুয়াল:
   ${dest}-এর বিখ্যাত স্থান বা নদীর দৃশ্য।
   সোনালি আলোয় শহর জ্বলছে।
   স্ক্রিনের মাঝখানে text animation আসছে:
   ✈️ "${origin} → ${dest}"

🎥 ক্যামেরা মুভমেন্ট:
   Aerial flyover — শহরের উপর দিয়ে।

🎙️ ভয়েস/নারেশন:
   "${origin} থেকে ${dest}!"
   "এখন মাত্র ${price}!"

🎵 মিউজিক: একটু জোরালো হয় — excitement build


🎬 সিন-৩ (১৫ - ২৫ সেকেন্ড) — সুবিধাসমূহ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 ভিজ্যুয়াল:
   বিমানের ভেতরে আরামদায়ক সিট।
   যাত্রী হাসিখুশি মুখে বসে আছেন।
   নিচে text box:
   🧳 "ব্যাগেজ: ${bag}" এবং "সীমিত আসন!"

🎥 ক্যামেরা মুভমেন্ট:
   Close-up থেকে wide shot — smooth pan।

🎙️ ভয়েস/নারেশন:
   "${bag} ব্যাগেজ সহ!"
   "সীমিত আসন — এখনই বুক করুন!"

🎵 মিউজিক: উত্তেজনাপূর্ণ — peak moment


🎬 সিন-৪ (২৫ - ৩৫ সেকেন্ড) — Call to Action
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 ভিজ্যুয়াল:
   সম্পূর্ণ স্ক্রিনে গাঢ় রঙের সুন্দর ব্যাকগ্রাউন্ড।
   বড় হরফে ফোন নম্বর ও অফার দেখাচ্ছে।
   ✈️ আইকন উড়ে যাচ্ছে।

🎥 ক্যামেরা:
   Static — সব মনোযোগ টেক্সটে।

🎙️ ভয়েস/নারেশন:
   "এখনই কল করুন: ${tel}"
   "${addr ? addr + ' — আমাদের অফিসে আসুন।' : ''}"
   "আজই বুক করুন!"

🎵 মিউজিক: জোরালো — সাহসী beat


🎬 সিন-৫ (৩৫ - ৪৫ সেকেন্ড) — এন্ড কার্ড / লোগো
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 ভিজ্যুয়াল:
   কোম্পানির লোগো ও নাম।
   নিচে ছোট করে: ফোন, লোকেশন, ওয়েবসাইট।
   বিমান আকাশে মিলিয়ে যাচ্ছে — fade out।

🎥 ক্যামেরা:
   Slow zoom-out — cinematic ending।

🎙️ ভয়েস/নারেশন:
   "আপনার স্বপ্নের গন্তব্যে পৌঁছে দিচ্ছি আমরা..."
   "ধন্যবাদ।"

🎵 মিউজিক: ধীরে ধীরে fade out।


📺 সম্পূর্ণ টেক্সট ওভারলে (ভিডিওতে দেখাবে)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✈️  ${origin} → ${dest}
💰  মাত্র ${price}!
🧳  ব্যাগেজ: ${bag}
📞  ${tel}
${addr ? `📍  ${addr}` : ''}

══════════════════════════════════════════════
`.trim();
}

export default function ScriptPreviewModal({ isOpen, jobPayload, onApprove, onClose }) {
  const [editedScript, setEditedScript] = useState('');
  const [hasEdited, setHasEdited] = useState(false);
  const [activeTab, setActiveTab] = useState('script'); // 'script' | 'summary'

  React.useEffect(() => {
    if (isOpen && jobPayload) {
      setEditedScript(buildStoryScript(jobPayload));
      setHasEdited(false);
      setActiveTab('script');
    }
  }, [isOpen, jobPayload]);

  if (!isOpen) return null;

  const handleApprove = () => {
    onApprove({ ...jobPayload, prompt: editedScript });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#131b2e] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/50 flex flex-col max-h-[92vh] overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Film className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">ভিডিও স্ক্রিপ্ট স্টোরিবোর্ড</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Scene-by-Scene | Voice | Visual | Music — সব পরিবর্তন করা যাবে
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Info Pills ── */}
        <div className="px-6 py-2.5 bg-[#0d1526] border-b border-slate-800 flex flex-wrap gap-2">
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
        </div>

        {/* ── Legend ── */}
        <div className="px-6 py-2 bg-indigo-500/5 border-b border-slate-800 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><EyeIcon className="w-3 h-3 text-blue-400"/>📷 ভিজ্যুয়াল</span>
          <span className="flex items-center gap-1"><Mic className="w-3 h-3 text-green-400"/>🎙️ ভয়েস</span>
          <span className="flex items-center gap-1"><Film className="w-3 h-3 text-purple-400"/>🎥 ক্যামেরা</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400"/>⏱️ সময়</span>
          {hasEdited && <span className="ml-auto text-emerald-400">✏️ এডিট করা হয়েছে</span>}
        </div>

        {/* ── Script Textarea ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <textarea
            value={editedScript}
            onChange={(e) => { setEditedScript(e.target.value); setHasEdited(true); }}
            rows={22}
            className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 text-xs font-mono leading-relaxed resize-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            spellCheck={false}
          />
          <p className="text-[11px] text-slate-500 mt-2">
            💡 যেকোনো সিন, ভয়েস, বা টেক্সট এডিট করে নিজের মতো করে নিন। তারপর Approve দিন।
          </p>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-all">
            ← ফিরে যান
          </button>

          <button onClick={handleApprove}
            className="px-7 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
            <CheckCircle2 className="w-4 h-4" />
            <span>✅ Approve — ভিডিও তৈরি শুরু</span>
            <Rocket className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
