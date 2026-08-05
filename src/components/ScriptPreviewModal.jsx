import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle2, Rocket, Phone, MapPin, Film, Mic, Eye as EyeIcon,
  Clock, RefreshCw, Cpu, Sparkles, Zap, Bot, AlertTriangle
} from 'lucide-react';
import { getStoredColabUrl, getStoredOpenRouterKey, getStoredOpenRouterModel } from '../services/storage';
import { generateScriptApi } from '../services/api';
import { generateOpenRouterScript, generateMultiAgentScript } from '../services/openrouter';

// ── Fallback script generator ────────────────────────────────────────────────
function buildFallbackScript(payload) {
  const { fromCity = '', destination = '', ticketRate = '', baggage = '', phone = '', location = '', vibe = '', duration = '30s' } = payload || {};
  const price = ticketRate || 'বিশেষ মূল্যে';
  const bag   = baggage    || '২০ কেজি';
  const tel   = phone      || 'যোগাযোগ করুন';
  const addr  = location   || '';
  const durStr = duration === '15s' ? '15 Seconds (Reels/Shorts)' : duration === '60s' ? '1 Minute (Full Ad)' : duration === '120s' ? '2 Minutes (Feature Commercial)' : '30 Seconds Commercial';

  return `
╔══════════════════════════════════════════════════════════╗
   ✈️ HIGH-IMPACT AIRLINE COMMERCIAL PROMO SCRIPT
   📌 ROUTE: ${fromCity} ➜ ${destination}
   ⏱️ DURATION: ${durStr}
╚══════════════════════════════════════════════════════════╝

📊 AD SPECIFICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Target Audience : প্রবাসী ও ভ্রমণকারী (High-Converting Hook)
• Visual Vibe    : ${vibe} Ultra-HD 4K Commercial Grade
• Total Duration : ${durStr}


🎬 SCENE 1: THE ATTENTION HOOK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : মেঘ ভেদ করে একটি আল্ট্রা-প্রিমিয়াম কমার্শিয়াল এয়ারলাইনার বিমানের শট। ${fromCity}-এর আকাশমণ্ডল।
🎥 Camera  : High-speed FPV Drone Flyby — Fast Push-in to Aircraft Window.
🎙️ Voice   : (উজ্জ্বল ও আকর্ষক এক্সসাইটেড ভয়েস)
             "আজই স্বদেশে ফেরার প্ল্যান করছেন? ${fromCity} থেকে সরাসরি ${destination}!"
🎵 Music   : Deep bass drop + cinematic synth crescendo rise.


🎬 SCENE 2: THE DESTINATION & UNBEATABLE PRICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : ঝকঝকে রোদে ${destination}-এর স্কাইলাইন ও এয়ারপোর্ট রানওয়ের দৃশ্য। স্ক্রিনে ৩D গোল্ডেন বোল্ড গ্লোয়িং টেক্সট পপ-আপ:
             🔥 [${fromCity} ✈️ ${destination}]
             💥 [মূল্য: মাত্র ${price}]
🎥 Camera  : Dynamic Whip-Pan Shot — শট খুব দ্রুত এবং মসৃণভাবে চেঞ্জ হয়।
🎙️ Voice   : "একদম বাজেট ফ্রেন্ডলি সেরা রেটে টিকিট নিন! ${fromCity} থেকে ${destination} এখন মাত্র ${price}!"
🎵 Music   : Upbeat energizing commercial dance track beat build-up.


🎬 SCENE 3: LUXURY & BAGGAGE ALLOWANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : বিমানের ফার্স্ট ক্লাস লাক্সারি সিটিং ও লাগেজ বেল্টে লাগেজ চেকিংয়ের দ্রুত শট।
             স্ক্রিনে আইকন সহ পপ-আপ টেক্সট: 🧳 ${bag} ব্যাগেজ এলাউন্স!
🎥 Camera  : Smooth Gimbal Tracking Shot — সিটের আরাম ও স্বাচ্ছন্দ্য ফোকাস।
🎙️ Voice   : "বাড়তি লাগেজ নিয়ে নো চিন্তা! পাচ্ছেন পুরো ${bag} ফ্রি ব্যাগেজ এলাউন্স এবং চমৎকার সিটিং এক্সপেরিয়েন্স!"
🎵 Music   : High energy rhythm drops to focus on features.


🎬 SCENE 4: URGENCY & CALL TO ACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : স্ক্রিনের কেন্দ্রে উজ্জ্বল নিয়ন বর্ডার লাইনের টিকেট বুথ কার্ড:
             📞 যোগাযোগ: ${tel}
             ⚡ আসন সংখ্যা সীমিত! দ্রুত বুক করুন!
🎥 Camera  : Snap Zoom to Action Card.
🎙️ Voice   : "অফারটি সীমিত সময়ের জন্য! টিকিট কনফার্ম করতে এখনই কল করুন ${tel} নম্বরে!"
🎵 Music   : Fast rhythmic percussion countdown pulse.


🎬 SCENE 5: BRANDING & OUTRO CARD
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

export default function ScriptPreviewModal({ isOpen, jobPayload, onApprove, onClose, onOpenSettings }) {
  const [editedScript, setEditedScript] = useState('');
  const [hasEdited, setHasEdited]       = useState(false);
  const [loading, setLoading]           = useState(false);

  // Agent Mode vs Single Mode
  const [useAgentMode, setUseAgentMode] = useState(true);
  const [agentStatusMsg, setAgentStatusMsg] = useState('');

  // AI Generation Meta Info
  const [aiMeta, setAiMeta]             = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchScript = async (forceMode = null) => {
    if (!jobPayload) return;
    setLoading(true);
    setErrorMessage(null);
    setAiMeta(null);

    const isAgent = forceMode !== null ? forceMode : useAgentMode;
    const openRouterKey   = getStoredOpenRouterKey();
    const openRouterModel = getStoredOpenRouterModel();
    const colabUrl         = getStoredColabUrl();

    // 1. Try OpenRouter (Multi-Agent or Single AI)
    try {
      if (isAgent) {
        setAgentStatusMsg('🤖 Multi-AI Agent টিম সংযোগ করা হচ্ছে...');
        const result = await generateMultiAgentScript(jobPayload, openRouterKey, (msg) => {
          setAgentStatusMsg(msg);
        });

        if (result && result.script) {
          setEditedScript(result.script);
          setAiMeta(result);
          setLoading(false);
          return;
        }
      } else {
        setAgentStatusMsg(`⚡ ${openRouterModel.split('/')[1]?.split(':')[0] || 'OpenRouter AI'} দিয়ে স্ক্রিপ্ট লেখা হচ্ছে...`);
        const result = await generateOpenRouterScript(jobPayload, openRouterKey, openRouterModel);

        if (result && result.script) {
          setEditedScript(result.script);
          setAiMeta(result);
          setLoading(false);
          return;
        }
      }
    } catch (orErr) {
      console.warn('OpenRouter script generation fell back:', orErr);
      setErrorMessage(orErr.message || 'OpenRouter AI সংযোগে সমস্যা হয়েছে');
    }

    // 2. Second try Colab Backend script generator
    if (colabUrl) {
      try {
        setAgentStatusMsg('⚡ Colab AI Engine দিয়ে চেষ্টা করা হচ্ছে...');
        const remoteScript = await generateScriptApi(colabUrl, jobPayload);
        if (remoteScript) {
          setEditedScript(remoteScript);
          setAiMeta({ modelName: 'Colab AI Engine', elapsedTime: '1.0s', isLive: true });
          setLoading(false);
          return;
        }
      } catch (colabErr) {
        console.warn('Colab script generation fell back:', colabErr);
      }
    }

    // 3. Fallback to Local Ad Template Builder
    setEditedScript(buildFallbackScript(jobPayload));
    setAiMeta({ modelName: 'App Local Template', elapsedTime: '0.1s', isLive: false });
    setLoading(false);
  };

  useEffect(() => {
    if (!isOpen || !jobPayload) return;
    setHasEdited(false);
    fetchScript();
  }, [isOpen, jobPayload]);

  if (!isOpen) return null;

  const handleApprove = () => onApprove({ ...jobPayload, prompt: editedScript });

  const getDurText = (dur) => {
    if (dur === '15s') return '১৫ সেকেন্ড';
    if (dur === '60s') return '১ মিনিট';
    if (dur === '120s') return '২ মিনিট';
    return '৩০ সেকেন্ড';
  };

  const handleToggleAgentMode = (mode) => {
    setUseAgentMode(mode);
    fetchScript(mode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#131b2e] border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              {loading ? (
                <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
              ) : useAgentMode ? (
                <Bot className="w-6 h-6 text-purple-400" />
              ) : (
                <Sparkles className="w-5 h-5 text-purple-400" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                ভিডিও স্ক্রিপ্ট স্টোরিবোর্ড
                {aiMeta && (
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border flex items-center gap-1 font-medium ${
                    aiMeta.isLive
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}>
                    {aiMeta.isLive ? <Zap className="w-2.5 h-2.5 text-emerald-400" /> : <Clock className="w-2.5 h-2.5 text-amber-400" />}
                    {aiMeta.modelName} ({aiMeta.elapsedTime})
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {loading ? agentStatusMsg || 'AI দিয়ে স্ক্রিপ্ট লেখা হচ্ছে...' : 'সম্পাদনা করুন → Approve দিয়ে ভিডিও তৈরি শুরু করুন'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Agent Mode vs Single AI Toggle Bar */}
        <div className="px-6 py-2.5 bg-[#0b0f19] border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => handleToggleAgentMode(true)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                useAgentMode
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>🤖 Agent Mode (Multi-AI Team)</span>
            </button>
            <button
              onClick={() => handleToggleAgentMode(false)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                !useAgentMode
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ Single AI Engine</span>
            </button>
          </div>

          <button
            onClick={() => fetchScript()}
            disabled={loading}
            className="text-xs px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 rounded-xl flex items-center gap-1.5 transition-all"
            title="নতুন স্ক্রিপ্ট রি-জেনারেট করুন"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রি-জেনারেট</span>
          </button>
        </div>

        {/* Error Warning Banner if AI Failed */}
        {errorMessage && !loading && (
          <div className="px-6 py-2.5 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span><b>AI নোটিশ:</b> {errorMessage} (ডিফল্ট টেমপ্লেট দেখানো হচ্ছে)</span>
            </div>
            {onOpenSettings && (
              <button onClick={onOpenSettings} className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 rounded-lg text-rose-200 font-semibold whitespace-nowrap">
                ফ্রি API Key দিন
              </button>
            )}
          </div>
        )}

        {/* Info Pills */}
        <div className="px-6 py-2 bg-[#0d1526] border-b border-slate-800 flex flex-wrap gap-2 items-center">
          <span className="px-3 py-1 rounded-full text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
            ✈️ {jobPayload?.fromCity} → {jobPayload?.destination}
          </span>
          {jobPayload?.duration   && <span className="px-3 py-1 rounded-full text-xs bg-purple-500/15 text-purple-300 border border-purple-500/25 flex items-center gap-1"><Clock className="w-3 h-3 text-purple-400"/>⏱️ {getDurText(jobPayload.duration)}</span>}
          {jobPayload?.ticketRate && <span className="px-3 py-1 rounded-full text-xs bg-amber-500/15 text-amber-300 border border-amber-500/25">💰 {jobPayload.ticketRate}</span>}
          {jobPayload?.baggage    && <span className="px-3 py-1 rounded-full text-xs bg-slate-700/60 text-slate-300 border border-slate-600/40">🧳 {jobPayload.baggage}</span>}
          {jobPayload?.phone      && <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1"><Phone className="w-3 h-3"/>{jobPayload.phone}</span>}
          {jobPayload?.location   && <span className="px-3 py-1 rounded-full text-xs bg-sky-500/15 text-sky-300 border border-sky-500/25 flex items-center gap-1"><MapPin className="w-3 h-3"/>{jobPayload.location}</span>}
        </div>

        {/* Legend */}
        <div className="px-6 py-1.5 bg-indigo-500/5 border-b border-slate-800 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><EyeIcon className="w-3 h-3 text-blue-400"/>📷 ভিজ্যুয়াল</span>
          <span className="flex items-center gap-1"><Mic className="w-3 h-3 text-green-400"/>🎙️ ভয়েস</span>
          <span className="flex items-center gap-1"><Film className="w-3 h-3 text-purple-400"/>🎥 ক্যামেরা</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400"/>⏱️ সময়</span>
          {hasEdited && <span className="ml-auto text-emerald-400 font-semibold">✏️ এডিট করা হয়েছে</span>}
        </div>

        {/* Script Editor */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-52 gap-4 text-center">
              <div className="relative">
                <RefreshCw className="w-12 h-12 text-purple-400 animate-spin" />
                <Bot className="w-6 h-6 text-purple-300 absolute inset-0 m-auto" />
              </div>
              <div>
                <p className="text-sm font-bold text-purple-300 mb-1">{agentStatusMsg}</p>
                <p className="text-xs text-slate-400">OpenRouter Free AI এজেন্ট টিম লাইভ স্ক্রিপ্ট জেনারেট করছে...</p>
              </div>
            </div>
          ) : (
            <textarea
              value={editedScript}
              onChange={(e) => { setEditedScript(e.target.value); setHasEdited(true); }}
              rows={20}
              className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 text-xs font-mono leading-relaxed resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
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
