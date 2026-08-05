/**
 * AI Promo Studio - OpenRouter API Service (100% Free AI LLM Models)
 */

export const FREE_OPENROUTER_MODELS = [
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Meta Llama 3.3 70B (Free)',
    badge: 'সেরা কোয়ালিটি',
    desc: 'দ্রুত এবং উচ্চমানের প্রমোশনাল স্ক্রিপ্ট লেখার জন্য সেরা',
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 (Free)',
    badge: 'হাই রিজনানিং',
    desc: 'সবচেয়ে ক্রিয়েটিভ ও গভীর ভাবনার এড স্টোরি তৈরি করবে',
  },
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Google Gemini 2.0 Flash (Free)',
    badge: 'আল্ট্রা ফাস্ট',
    desc: 'গুগলের অতি দ্রুত ও নিখুঁত উত্তর প্রদানকারী মডেল',
  },
  {
    id: 'qwen/qwen-2.5-72b-instruct:free',
    name: 'Qwen 2.5 72B (Free)',
    badge: 'বাংলা পারফেক্ট',
    desc: 'বাংলা ভাষায় চমৎকার ও সাবলীল বিজ্ঞাপন লেখার জন্য পারফেক্ট',
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B (Free)',
    badge: 'লাইটওয়েট',
    desc: 'সংক্ষিপ্ত ও চটকদার কমার্শিয়াল স্ক্রিপ্টের জন্য উপযুক্ত',
  },
];

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Duration options label helper
 */
export function getDurationLabel(dur) {
  switch (dur) {
    case '15s':  return '১৫-সেকেন্ড (Shorts/Reels/TikTok)';
    case '30s':  return '৩০-সেকেন্ড (Standard Promo)';
    case '60s':  return '১-মিনিট (Detailed Commercial)';
    case '120s': return '২-মিনিট (Full Feature Commercial)';
    default:     return `${dur || '30s'} প্রমো`;
  }
}

/**
 * OpenRouter এর ফ্রি মডেল দিয়ে বিজ্ঞাপন স্ক্রিপ্ট তৈরি করার ফাংশন
 */
export async function generateOpenRouterScript(payload, apiKey, modelId) {
  const selectedModel = modelId || FREE_OPENROUTER_MODELS[0].id;
  const headers = {
    'Content-Type': 'application/json',
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://aipromostudio.local',
    'X-Title': 'AI Promo Studio',
  };

  if (apiKey && apiKey.trim()) {
    headers['Authorization'] = `Bearer ${apiKey.trim()}`;
  }

  const {
    fromCity = '',
    destination = '',
    ticketRate = '',
    baggage = '',
    phone = '',
    location = '',
    vibe = 'cinematic sunset',
    duration = '30s',
  } = payload || {};

  const durationText = getDurationLabel(duration);

  const systemPrompt = `You are a world-class advertising creative director and copywriter specializing in high-converting video ad commercials for air travel agencies.
You must output a highly compelling, professional ${durationText} commercial promo script in fluent Bengali with precise formatting tailored to this exact video duration.

Format the script with clear sections:
1. Header box with Route
2. Ad Specs (Target Audience, Visual Vibe, Duration: ${durationText})
3. Distinct Scenes structured for a ${durationText} video.
Each scene MUST include:
   - 📷 Visual: Detailed cinematic description
   - 🎥 Camera: Dynamic camera angle/movement
   - 🎙️ Voice: High-converting excited voiceover text in Bengali
   - 🎵 Music: Sound & beat direction
4. 📺 OVERLAY BANNER FOR VIDEO FOOTAGE: Text layout summary for PIL overlay burn-in.

Keep numbers, route details (${fromCity} ➜ ${destination}), ticket price (${ticketRate}), baggage (${baggage}), and phone (${phone}) exactly accurate as provided.`;

  const userPrompt = `তৈরি করুন একটি প্রিমিয়াম ${durationText} দৈর্ঘ্যের এয়ারলাইন টিকিট প্রমোশনাল ভিডিও স্ক্রিপ্ট।

তথ্যসমূহ:
• ভিডিওর সময়সীমা (Duration): ${durationText}
• রুট: ${fromCity} থেকে ${destination}
• টিকিটের মূল্য: ${ticketRate}
• ব্যাগেজ এলাউন্স: ${baggage}
• যোগাযোগের ফোন নম্বর: ${phone || 'যোগাযোগ করুন'}
• এজেন্সির লোকেশন/ঠিকানা: ${location || 'প্রযোজ্য নয়'}
• ভিজ্যুয়াল স্টাইল/Vibe: ${vibe}

দয়া করে আকর্ষণীয় ও প্রফেশনাল বিজ্ঞাপনী ভাষায় এই ঠিক সময়সীমার উপযোগী স্ক্রিপ্টটি উপস্থাপন করুন।`;

  try {
    const res = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2200,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errorMsg = errData?.error?.message || `OpenRouter API সাড়া দেয়নি (Status: ${res.status})`;
      throw new Error(errorMsg);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenRouter থেকে কোনো উত্তর পাওয়া যায়নি।');
    }

    return content.trim();
  } catch (err) {
    console.error('OpenRouter generation error:', err);
    throw err;
  }
}

/**
 * OpenRouter সংযোগ এবং API Key পরীক্ষার ফাংশন
 */
export async function testOpenRouterConnection(apiKey, modelId) {
  const selectedModel = modelId || FREE_OPENROUTER_MODELS[0].id;
  const headers = {
    'Content-Type': 'application/json',
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://aipromostudio.local',
    'X-Title': 'AI Promo Studio',
  };

  if (apiKey && apiKey.trim()) {
    headers['Authorization'] = `Bearer ${apiKey.trim()}`;
  }

  try {
    const res = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'user', content: 'Say "OpenRouter Connected Successfully!" in 5 words.' },
        ],
        max_tokens: 20,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Status Code: ${res.status}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || 'সফলভবে যুক্ত হয়েছে!';
    return { success: true, text: text.trim() };
  } catch (err) {
    return { success: false, error: err.message || 'সংযোগ ব্যর্থ হয়েছে' };
  }
}
