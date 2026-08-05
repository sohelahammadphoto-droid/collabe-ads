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
╔══════════════════════════════════════════════════════════╗
   ✈️ HIGH-IMPACT AIRLINE COMMERCIAL PROMO SCRIPT
   📌 ROUTE: ${fromCity} ➜ ${destination}
╚══════════════════════════════════════════════════════════╝

📊 AD SPECIFICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Target Audience : প্রবাসী ও ভ্রমণকারী (High-Converting Hook)
• Visual Vibe    : ${vibe} Ultra-HD 4K Commercial Grade
• Total Duration : 30 Seconds Dynamic Beat Pacing


🎬 SCENE 1: THE ATTENTION HOOK (00:00 - 00:05)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : মেঘ ভেদ করে একটি আল্ট্রা-প্রিমিয়াম কমার্শিয়াল এয়ারলাইনার বিমানের শট। ${fromCity}-এর আকাশমণ্ডল।
🎥 Camera  : High-speed FPV Drone Flyby — Fast Push-in to Aircraft Window.
🎙️ Voice   : (উজ্জ্বল ও আকর্ষক এক্সসাইটেড ভয়েস)
             "আজই স্বদেশে ফেরার প্ল্যান করছেন? ${fromCity} থেকে সরাসরি ${destination}!"
🎵 Music   : Deep bass drop + cinematic synth crescendo rise.


🎬 SCENE 2: THE DESTINATION & UNBEATABLE PRICE (00:05 - 00:13)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : ঝকঝকে রোদে ${destination}-এর স্কাইলাইন ও এয়ারপোর্ট রানওয়ের দৃশ্য। স্ক্রিনে ৩D গোল্ডেন বোল্ড গ্লোয়িং টেক্সট পপ-আপ:
             🔥 [${fromCity} ✈️ ${destination}]
             💥 [মূল্য: মাত্র ${price}]
🎥 Camera  : Dynamic Whip-Pan Shot — শট খুব দ্রুত এবং মসৃণভাবে চেঞ্জ হয়।
🎙️ Voice   : "একদম বাজেট ফ্রেন্ডলি সেরা রেটে টিকিট নিন! ${fromCity} থেকে ${destination} এখন মাত্র ${price}!"
🎵 Music   : Upbeat energizing commercial dance track beat build-up.


🎬 SCENE 3: LUXURY & BAGGAGE ALLOWANCE (00:13 - 00:20)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : বিমানের ফার্স্ট ক্লাস লাক্সারি সিটিং ও লাগেজ বেল্টে লাগেজ চেকিংয়ের দ্রুত শট।
             স্ক্রিনে আইকন সহ পপ-আপ টেক্সট: 🧳 ${bag} ব্যাগেজ এলাউন্স!
🎥 Camera  : Smooth Gimbal Tracking Shot — সিটের আরাম ও স্বাচ্ছন্দ্য ফোকাস।
🎙️ Voice   : "বাড়তি লাগেজ নিয়ে নো চিন্তা! পাচ্ছেন পুরো ${bag} ফ্রি ব্যাগেজ এলাউন্স এবং চমৎকার সিটিং এক্সপেরিয়েন্স!"
🎵 Music   : High energy rhythm drops to focus on features.


🎬 SCENE 4: URGENCY & CALL TO ACTION (00:20 - 00:26)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : স্ক্রিনের কেন্দ্রে উজ্জ্বল নিয়ন বর্ডার লাইনের টিকেট বুথ কার্ড:
             📞 যোগাযোগ: ${tel}
             ⚡ আসন সংখ্যা সীমিত! দ্রুত বুক করুন!
🎥 Camera  : Snap Zoom to Action Card.
🎙️ Voice   : "অফারটি সীমিত সময়ের জন্য! টিকিট কনফার্ম করতে এখনই কল করুন ${tel} নম্বরে!"
🎵 Music   : Fast rhythmic percussion countdown pulse.


🎬 SCENE 5: BRANDING & OUTRO CARD (00:26 - 00:30)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : ব্র্যান্ডের লোগো, হেল্পলাইন নম্বর (${tel})${addr ? ' | 📍 ' + addr : ''} সহ বিমান উড়ে যাওয়ার প্রিমিয়াম এন্ডিং।
🎥 Camera  : Slow Motion Cinematic Crane Out Shot.
🎙️ Voice   : "আপনার প্রতিটি নিরাপদ ও আরামদায়ক সফরের সেরা সঙ্গী। আজই বুকিং নিশ্চিত করুন!"
🎵 Music   : Elegant sound logo resolving fade-out.


📺 OVERLAY BANNER FOR VIDEO FOOTAGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✈️ ${fromCity} ➜ ${destination}
🔥 মাত্র ${price}  |  🧳 ${bag}
📞 ${tel}${addr ? ' | 📍 ' + addr : ''}
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
