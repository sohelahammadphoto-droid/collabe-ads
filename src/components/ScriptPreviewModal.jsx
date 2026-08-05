import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Edit3, Rocket } from 'lucide-react';

/**
 * ScriptPreviewModal
 * - Shows the AI prompt/script before sending to Colab
 * - Allows user to edit the prompt
 * - Approve → triggers actual video generation
 */
export default function ScriptPreviewModal({ isOpen, jobPayload, onApprove, onClose }) {
  const [editedPrompt, setEditedPrompt] = useState('');
  const [hasEdited, setHasEdited] = useState(false);

  // Build the full AI prompt from jobPayload
  const buildPrompt = (payload) => {
    if (!payload) return '';
    const { destination, vibe, offer_text, reference_image } = payload;
    const mode = reference_image ? 'Image-to-Video' : 'Text-to-Video';
    return `A stunning ${vibe} promotional travel video for a flight ticket offer to ${destination}. 
The scene should showcase the beauty of ${destination} — iconic landmarks, skyline, and atmosphere. 
The video should feel cinematic, emotional, and aspirational — like a premium airline advertisement.
Lighting: ${vibe}. Camera: smooth drone-like movement, slow zoom, bokeh transitions.
Mode: ${mode}.
Offer Text (shown as overlay, NOT spoken): ${offer_text || 'Special Flight Offer'}`.trim();
  };

  // When modal opens, generate fresh prompt
  React.useEffect(() => {
    if (isOpen && jobPayload) {
      const p = buildPrompt(jobPayload);
      setEditedPrompt(p);
      setHasEdited(false);
    }
  }, [isOpen, jobPayload]);

  if (!isOpen) return null;

  const handleApprove = () => {
    // Pass back the (possibly edited) prompt with the original payload
    onApprove({
      ...jobPayload,
      prompt: editedPrompt,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#131b2e] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/40 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">AI ভিডিও স্ক্রিপ্ট প্রিভিউ</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Colab-এ পাঠানোর আগে স্ক্রিপ্ট দেখুন ও প্রয়োজনে পরিবর্তন করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Row */}
        <div className="px-6 py-3 bg-indigo-500/5 border-b border-slate-800 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
          <span>✈️ গন্তব্য: <span className="text-indigo-300 font-semibold">{jobPayload?.destination}</span></span>
          <span>🌅 ভাইব: <span className="text-indigo-300 font-semibold">{jobPayload?.vibe}</span></span>
          <span>🤖 মডেল: <span className="text-indigo-300 font-semibold">{jobPayload?.video_model}</span></span>
          {jobPayload?.reference_image && (
            <span>🖼️ মোড: <span className="text-amber-300 font-semibold">Image-to-Video</span></span>
          )}
        </div>

        {/* Script Editor */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              AI Prompt / স্ক্রিপ্ট — সরাসরি সম্পাদনা করুন
            </span>
            {hasEdited && (
              <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                সম্পাদিত ✏️
              </span>
            )}
          </div>
          <textarea
            value={editedPrompt}
            onChange={(e) => {
              setEditedPrompt(e.target.value);
              setHasEdited(true);
            }}
            rows={10}
            className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 text-sm font-mono leading-relaxed resize-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            placeholder="AI Prompt লোড হচ্ছে..."
          />
          <p className="text-[11px] text-slate-500 mt-2">
            💡 এই প্রম্পটটি Colab AI মডেলকে পাঠানো হবে। চাইলে যেকোনো কিছু পরিবর্তন করতে পারেন।
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-all"
          >
            ← ফিরে যান
          </button>

          <button
            onClick={handleApprove}
            className="px-7 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-700/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve করুন → ভিডিও তৈরি শুরু</span>
            <Rocket className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
