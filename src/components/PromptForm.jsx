import React, { useState } from 'react';
import {
  Eye, Cpu, AlertCircle, Plane, DollarSign, Clock, Bot, Sparkles, Zap,
  Image as ImageIcon, X, MapPin, Phone, ArrowLeftRight, ArrowRight
} from 'lucide-react';
import ScriptPreviewModal from './ScriptPreviewModal';

// ✅ বাংলাদেশের সকল বিমানবন্দর শহর (শুধু শহরের নাম)
const BD_CITIES = [
  'ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'কক্সবাজার',
  'যশোর', 'রাজশাহী', 'বরিশাল', 'সৈয়দপুর',
];

// ✅ সৌদি আরবের সকল বিমানবন্দর শহর (শুধু শহরের নাম)
const SA_CITIES = [
  'Riyadh (রিয়াদ)', 'Jeddah (জেদ্দা)', 'Dammam (দাম্মাম)',
  'Medina (মদিনা)', 'Abha (আভা)', 'Tabuk (তাবুক)',
  'Taif (তায়েফ)', 'Yanbu (ইয়ানবু)', 'Al-Qassim (আল-কাসিম)',
  'Hail (হাইল)', 'Jizan (জিজান)', 'Najran (নাজরান)',
  'Al-Baha (আল-বাহা)', 'Al-Jouf (আল-জুফ)',
  'Sharurah (শারুরাহ)', 'Wadi ad-Dawasir (ওয়াদি আদ-দাওয়াসির)',
];

const VIBE_OPTIONS = [
  { id: 'cinematic sunset', label: '🌅 সিনেমাটিক সানসেট' },
  { id: 'bright daytime', label: '☀️ উজ্জ্বল দিনের আলো' },
  { id: 'night city lights', label: '🌃 রাতের শহরের আলো' },
  { id: 'energetic fast-paced', label: '⚡ এনার্জেটিক ও গতিময়' },
];

const DURATION_OPTIONS = [
  { id: '15s', label: '⏱️ ১৫ সেকেন্ড (Shorts / Reels / TikTok)' },
  { id: '30s', label: '⏱️ ৩০ সেকেন্ড (স্ট্যান্ডার্ড প্রমো - Recommended)' },
  { id: '60s', label: '⏱️ ১ মিনিট (বিস্তারিত কমার্শিয়াল)' },
  { id: '120s', label: '⏱️ ২ মিনিট (ফুল ফিচার ভিডিও প্রমো)' },
];

export default function PromptForm({ onSubmit, isGenerating, isConnected, onOpenSettings }) {
  // ─── Form Fields ───
  const [fromCity, setFromCity]       = useState('ঢাকা');
  const [customFrom, setCustomFrom]   = useState('');
  const [toCity, setToCity]           = useState('Riyadh (রিয়াদ)');
  const [customTo, setCustomTo]       = useState('');
  const [ticketRate, setTicketRate]   = useState('SAR 350');
  const [baggage, setBaggage]         = useState('২০ কেজি');
  const [phone, setPhone]             = useState('');
  const [location, setLocation]       = useState('');
  const [vibe, setVibe]               = useState('cinematic sunset');
  const [duration, setDuration]       = useState('30s');
  const [aiMode, setAiMode]           = useState('agent'); // 'agent' vs 'single'
  const [model, setModel]             = useState('Wan 2.2 TI2V 5B');
  const [refImageBase64, setRefImageBase64] = useState('');
  const [refImageName, setRefImageName]     = useState('');
  const [swapped, setSwapped]         = useState(false);

  // ─── Modal State ───
  const [showPreview, setShowPreview] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  const finalFrom = customFrom.trim() || fromCity;
  const finalTo   = customTo.trim()   || toCity;

  // ─── Swap Origin ↔ Destination ───
  const handleSwap = () => {
    setFromCity(toCity);
    setToCity(fromCity);
    setCustomFrom(customTo);
    setCustomTo(customFrom);
    setSwapped(s => !s);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setRefImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setRefImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => { setRefImageBase64(''); setRefImageName(''); };

  // Step 1: Open preview modal with all filled info
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!finalFrom || !finalTo || isGenerating) return;

    const payload = {
      fromCity:    finalFrom,
      destination: finalTo,
      ticketRate,
      baggage,
      phone,
      location,
      vibe,
      duration,
      aiMode,
      offer_text:       `${finalFrom} ✈️ ${finalTo} — মাত্র ${ticketRate}`,
      reference_image:  refImageBase64,
      video_model:      model,
    };

    setPendingPayload(payload);
    setShowPreview(true);
  };

  // Step 2: Approved → send to Colab
  const handleApproveScript = (approvedPayload) => {
    setShowPreview(false);
    setPendingPayload(null);
    onSubmit(approvedPayload);
  };

  return (
    <>
      <ScriptPreviewModal
        isOpen={showPreview}
        jobPayload={pendingPayload}
        onApprove={handleApproveScript}
        onClose={() => setShowPreview(false)}
        onOpenSettings={() => { setShowPreview(false); onOpenSettings(); }}
      />

      <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Plane className="w-5 h-5 text-indigo-400" />
            ফ্লাইট টিকিট প্রমো ভিডিও জেনারেটর
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            সব তথ্য দিন — AI স্বয়ংক্রিয়ভাবে পেশাদার প্রমো ভিডিও স্ক্রিপ্ট তৈরি করবে।
          </p>
        </div>

        {/* Disconnected Banner */}
        {!isConnected && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start justify-between gap-3 text-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">❌ Colab সার্ভার connected নেই</p>
                <p className="text-xs text-rose-300/90 mt-0.5">Google Colab notebook চালিয়ে Cloudflare URL সেটিংস-এ দিন।</p>
              </div>
            </div>
            <button onClick={onOpenSettings}
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 rounded-lg text-xs font-medium whitespace-nowrap">
              সেটিংসে যান
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ─── Row 1: From ⇄ To with Swap Button ─── */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">

            {/* FROM */}
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                🛫 কোথা থেকে (Origin)
              </label>
              <select value={fromCity} onChange={(e) => { setFromCity(e.target.value); setCustomFrom(''); }}
                className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 mb-2">
                {BD_CITIES.map((c, i) => <option key={i} value={c}>{c}</option>)}
                {SA_CITIES.map((c, i) => <option key={'sa-'+i} value={c}>{c}</option>)}
              </select>
              <input type="text" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
                placeholder="অথবা নিজে লিখুন…"
                className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500" />
            </div>

            {/* SWAP BUTTON */}
            <div className="flex items-center justify-center pt-0 sm:pt-5">
              <button
                type="button"
                onClick={handleSwap}
                title="Origin ও Destination বদলান"
                className={`w-11 h-11 rounded-full flex items-center justify-center border-2 border-indigo-500/50 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 hover:text-indigo-200 transition-all duration-300 hover:scale-110 active:scale-95 ${
                  swapped ? 'rotate-180' : 'rotate-0'
                } transition-transform`}
              >
                <ArrowLeftRight className="w-5 h-5" />
              </button>
            </div>

            {/* TO */}
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                🛬 কোথায় (Destination)
              </label>
              <select value={toCity} onChange={(e) => { setToCity(e.target.value); setCustomTo(''); }}
                className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 mb-2">
                {SA_CITIES.map((c, i) => <option key={i} value={c}>{c}</option>)}
                {BD_CITIES.map((c, i) => <option key={'bd-'+i} value={c}>{c}</option>)}
              </select>
              <input type="text" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
                placeholder="অথবা নিজে লিখুন…"
                className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          {/* Route Preview Badge */}
          {(finalFrom && finalTo) && (
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-sm">
              <span className="text-indigo-300 font-bold">{finalFrom}</span>
              <ArrowRight className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-300 font-bold">{finalTo}</span>
              <span className="ml-auto text-xs text-slate-500">রুট নিশ্চিত ✅</span>
            </div>
          )}

          {/* ─── Row 2: Rate & Baggage ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> টিকেটের রেট / মূল্য (SAR রিয়াল)
              </label>
              <input type="text" value={ticketRate} onChange={(e) => setTicketRate(e.target.value)}
                placeholder="যেমন: SAR 350, SAR 1200"
                className="w-full bg-[#0b0f19] border border-amber-500/40 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 font-bold text-amber-200" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                🧳 ব্যাগেজ অনুমতি
              </label>
              <input type="text" value={baggage} onChange={(e) => setBaggage(e.target.value)}
                placeholder="যেমন: ২০ কেজি, ৩০ কেজি"
                className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          {/* ─── Row 3: Phone & Location ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                <Phone className="w-4 h-4" /> যোগাযোগ নম্বর
              </label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="যেমন: 01700-000000"
                className="w-full bg-[#0b0f19] border border-emerald-500/40 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> অফিস লোকেশন / ঠিকানা
              </label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="যেমন: মতিঝিল, ঢাকা"
                className="w-full bg-[#0b0f19] border border-sky-500/40 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500" />
            </div>
          </div>

          {/* ─── Row 4: AI Engine Mode Selector (NEW) ─── */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-purple-400" /> AI স্ক্রিপ্ট ইঞ্জিন মোড (Engine Mode)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAiMode('agent')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  aiMode === 'agent'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-md shadow-purple-950/40'
                    : 'bg-[#0b0f19] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Bot className={`w-5 h-5 shrink-0 mt-0.5 ${aiMode === 'agent' ? 'text-purple-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>🤖 Agent Mode (Multi-AI Team)</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-purple-500/30 text-purple-300 rounded font-semibold">সেরা কমার্শিয়াল</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    DeepSeek R1 + Gemini + Qwen একত্রে কাজ করে আল্ট্রা-হাই কনভার্টিং স্ক্রিপ্ট বানাবে।
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAiMode('single')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  aiMode === 'single'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-950/40'
                    : 'bg-[#0b0f19] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Zap className={`w-5 h-5 shrink-0 mt-0.5 ${aiMode === 'single' ? 'text-indigo-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>⚡ Single AI Engine</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-indigo-500/30 text-indigo-300 rounded font-semibold">আল্ট্রা ফাস্ট</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Google Gemini 2.0 Flash / নির্বাচিত একক মডেল দিয়ে দ্রুততম সময়ে উত্তর দেবে।
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* ─── Row 5: Duration & Vibe ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" /> ভিডিওর সময়সীমা (Duration)
              </label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#0b0f19] border border-purple-500/40 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-purple-500 font-semibold text-purple-200">
                {DURATION_OPTIONS.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Vibe Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                🌅 ভিডিওর আবহ (Vibe & Lighting)
              </label>
              <select value={vibe} onChange={(e) => setVibe(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
                {VIBE_OPTIONS.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ─── Reference Image ─── */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              রেফারেন্স ছবি (ঐচ্ছিক — Image-to-Video Mode)
            </label>
            {!refImageBase64 ? (
              <label className="flex items-center justify-center w-full p-3 bg-[#0b0f19] border border-dashed border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer transition-colors text-xs text-slate-400 gap-2">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <span>শহরের ছবি বা অফিসের ছবি নির্বাচন করুন</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 bg-slate-900/80 border border-indigo-500/40 rounded-xl text-xs text-indigo-300">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <img src={refImageBase64} alt="Ref" className="w-10 h-10 object-cover rounded-lg border border-slate-700" />
                  <span className="truncate">{refImageName || 'ছবি যুক্ত হয়েছে'}</span>
                </div>
                <button type="button" onClick={removeImage} className="p-1 text-slate-400 hover:text-rose-400 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ─── Model & Submit ─── */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">মডেল:</span>
              <select value={model} onChange={(e) => setModel(e.target.value)}
                className="bg-[#0b0f19] border border-slate-700 text-slate-200 text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500">
                <option value="Wan 2.2 TI2V 5B">Wan 2.2 TI2V-5B (Primary)</option>
                <option value="LTX-Video">LTX-Video (Fast Fallback)</option>
              </select>
            </div>

            <button type="submit" disabled={!finalFrom || !finalTo || isGenerating}
              className={`px-7 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                !finalFrom || !finalTo || isGenerating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}>
              <Eye className="w-4 h-4" />
              <span>{isGenerating ? 'প্রসেসিং হচ্ছে...' : '📄 স্ক্রিপ্ট দেখুন ও Approve করুন'}</span>
            </button>
          </div>

        </form>
      </div>
    </>
  );
}
