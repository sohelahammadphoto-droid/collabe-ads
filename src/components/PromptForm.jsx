import React, { useState } from 'react';
import { Play, Sparkles, Cpu, AlertCircle, Plane, Sunset, DollarSign, Image as ImageIcon, X } from 'lucide-react';

const POPULAR_CITIES = [
  'Dubai (দুবাই)',
  'Riyadh (রিয়াদ)',
  'Jeddah (জেদ্দা)',
  'Kuala Lumpur (কুয়ালালামপুর)',
  'Bangkok (ব্যাংকক)',
  'Cox\'s Bazar (কক্সবাজার)',
  'London (লন্ডন)',
  'Singapore (সিঙ্গাপুর)',
];

const VIBE_OPTIONS = [
  { id: 'cinematic sunset', label: '🌅 সূর্যাস্তের সিনেমাটিক আলো (Cinematic Sunset)' },
  { id: 'bright daytime', label: '☀️ উজ্জ্বল দিনের আলো (Bright Daytime)' },
  { id: 'night city lights', label: '🌃 রাতের জমকালো শহরের আলো (Night City Lights)' },
  { id: 'energetic fast-paced', label: '⚡ গতিময় ও এনার্জেটিক ভাইব (Energetic/Fast-paced)' },
];

export default function PromptForm({ onSubmit, isGenerating, isConnected, onOpenSettings }) {
  const [destination, setDestination] = useState('Dubai');
  const [customCity, setCustomCity] = useState('');
  const [vibe, setVibe] = useState('cinematic sunset');
  const [offerText, setOfferText] = useState('ঢাকা ➔ দুবাই মাত্র ৳৩৫,০০০!');
  const [model, setModel] = useState('Wan 2.2 TI2V 5B');
  const [refImageBase64, setRefImageBase64] = useState('');
  const [refImageName, setRefImageName] = useState('');

  const finalCity = customCity.trim() || destination.split(' ')[0];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setRefImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setRefImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setRefImageBase64('');
    setRefImageName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!finalCity || isGenerating) return;

    onSubmit({
      destination: finalCity,
      vibe,
      offer_text: offerText.trim(),
      reference_image: refImageBase64,
      video_model: model,
      prompt: `${finalCity} (${vibe}) - ${offerText}`,
    });
  };

  return (
    <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl">
      
      {/* Title Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Plane className="w-5 h-5 text-indigo-400" />
            ফ্লাইট টিকিট প্রমোশন ভিডিও জেনারেটর
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            গন্তব্য ও অফারের মূল্য ইনপুট দিন — স্বয়ংক্রিয়ভাবে নিখুঁত ভিডিও প্রমো তৈরি হয়ে যাবে!
          </p>
        </div>
      </div>

      {/* Disconnected Warning Banner */}
      {!isConnected && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start justify-between gap-3 text-sm">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">❌ Colab সার্ভার connected নেই</p>
              <p className="text-xs text-rose-300/90 mt-0.5">
                ভিডিও তৈরি করতে Google Colab notebook চালিয়ে নতুন Cloudflare URL সেটিংস-এ যুক্ত করুন।
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
          >
            সেটিংসে যান
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Destination City Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              ✈️ গন্তব্য শহর (Destination City)
            </label>
            <select
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setCustomCity('');
              }}
              className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              {POPULAR_CITIES.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              অন্যান্য শহর লিখুন (Custom City)
            </label>
            <input
              type="text"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              placeholder="যেমন: Istanbul, Tokyo..."
              className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Vibe / Atmosphere Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            🌅 ভিডিওর আবহ/আলোকসজ্জা (Vibe & Lighting)
          </label>
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          >
            {VIBE_OPTIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Offer & Price Text Banner Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>অফার ও টিকেটের মূল্য টেক্সট (ভিডিওর নিচে ওভারলে হবে)</span>
          </label>
          <input
            type="text"
            value={offerText}
            onChange={(e) => setOfferText(e.target.value)}
            placeholder="যেমন: ঢাকা টু দুবাই — মাত্র ৳৩৫,০০০ থেকে শুরু!"
            className="w-full bg-[#0b0f19] border border-amber-500/40 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 font-medium"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            * এটি এআই প্রম্পটে পাঠানো হবে না; ভিডিওর নিচে ব্যানার হিসেবে ১০০% নির্ভুল ফন্টে বসানো হবে।
          </p>
        </div>

        {/* Reference Image Upload (Optional Image-to-Video) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            <span>রেফারেন্স ছবি আপলোড করুন (ঐচ্ছিক - Image-to-Video Mode)</span>
          </label>
          
          {!refImageBase64 ? (
            <label className="flex items-center justify-center w-full p-3 bg-[#0b0f19] border border-dashed border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer transition-colors text-xs text-slate-400 gap-2">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <span>শহরের আকাশরেখা বা ল্যান্ডমার্কের ছবি নির্বাচন করুন</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center justify-between p-3 bg-slate-900/80 border border-indigo-500/40 rounded-xl text-xs text-indigo-300">
              <div className="flex items-center space-x-3 overflow-hidden">
                <img
                  src={refImageBase64}
                  alt="Ref"
                  className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                />
                <span className="truncate">{refImageName || 'রেফারেন্স ছবি যুক্ত হয়েছে'}</span>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Model Selector & Submit */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">ভিডিও মডেল:</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-[#0b0f19] border border-slate-700 text-slate-200 text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="Wan 2.2 TI2V 5B">Wan 2.2 TI2V-5B (Primary)</option>
              <option value="LTX-Video">LTX-Video (Fast Fallback)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!finalCity || isGenerating}
            className={`px-7 py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all ${
              !finalCity || isGenerating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isGenerating ? 'প্রসেসিং হচ্ছে...' : 'প্রমো ভিডিও তৈরি করুন'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
