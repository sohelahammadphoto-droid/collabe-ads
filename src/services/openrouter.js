/**
 * AI Promo Studio - OpenRouter API Service (100% Free AI LLM Models & Multi-AI Agent Mode)
 */

export const FREE_OPENROUTER_MODELS = [
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Meta Llama 3.3 70B',
    badge: 'সেরা কোয়ালিটি',
    desc: 'দ্রুত এবং উচ্চমানের প্রমোশনাল স্ক্রিপ্ট লেখার জন্য সেরা',
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 Reasoning',
    badge: 'হাই রিজনানিং',
    desc: 'সবচেয়ে ক্রিয়েটিভ ও গভীর ভাবনার এড স্টোরি তৈরি করবে',
  },
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Google Gemini 2.0 Flash',
    badge: 'আল্ট্রা ফাস্ট',
    desc: 'গুগলের অতি দ্রুত ও নিখুঁত উত্তর প্রদানকারী মডেল',
  },
  {
    id: 'qwen/qwen-2.5-72b-instruct:free',
    name: 'Qwen 2.5 72B',
    badge: 'বাংলা পারফেক্ট',
    desc: 'বাংলা ভাষায় চমৎকার ও সাবলীল বিজ্ঞাপন লেখার জন্য পারফেক্ট',
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B Instruct',
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
 * OpenRouter এর সিঙ্গেল ফ্রি AI মডেল দিয়ে বিজ্ঞাপন স্ক্রিপ্ট তৈরি
 */
export async function generateOpenRouterScript(payload, apiKey, modelId) {
  const startTime = Date.now();
  const selectedModelObj = FREE_OPENROUTER_MODELS.find(m => m.id === modelId) || FREE_OPENROUTER_MODELS[0];
  const selectedModel = selectedModelObj.id;

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
1. Header box with Route & Active AI Model Name
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
      const errorMsg = errData?.error?.message || `Status Code: ${res.status}`;
      throw new Error(`OpenRouter API Error (${errorMsg})`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenRouter থেকে কোনো উত্তর পাওয়া যায়নি।');
    }

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);

    return {
      script: content.trim(),
      modelName: selectedModelObj.name,
      modelId: selectedModel,
      elapsedTime: `${elapsedTime}s`,
      isLive: true,
    };
  } catch (err) {
    console.error('OpenRouter generation error:', err);
    throw err;
  }
}

/**
 * 🤖 AGENT MODE (Multi-AI Team Collaboration Engine)
 * ৩টি আলাদা AI এডিটর মিলে কাজ করবে:
 * 1. DeepSeek R1 (Creative Strategy Agent) -> ক্রিয়েটিভ কনসেপ্ট তৈরি করবে
 * 2. Meta Llama 3.3 70B (Copywriting Agent) -> কমার্শিয়াল ভয়েসওভার ও টেক্সট লিখবে
 * 3. Qwen 2.5 72B (Final Polish Agent) -> সমন্বিত ও ফাইনাল স্টোরিবোর্ড তৈরি করবে
 */
export async function generateMultiAgentScript(payload, apiKey, onProgress) {
  const startTime = Date.now();
  const headers = {
    'Content-Type': 'application/json',
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://aipromostudio.local',
    'X-Title': 'AI Promo Studio Agent Mode',
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

  // STEP 1: DeepSeek R1 (Strategy Agent)
  if (onProgress) onProgress('🤖 Agent 1: DeepSeek R1 — ক্রিয়েটিভ এড কনসেপ্ট ও ভিউয়াল হুক রিজননিং করছে...');

  let concept = '';
  try {
    const res1 = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'system',
            content: 'You are an Elite Creative Strategist Agent. Create a unique, high-converting commercial concept & scene visual angles for an airline promo video.',
          },
          {
            role: 'user',
            content: `Route: ${fromCity} to ${destination}, Price: ${ticketRate}, Baggage: ${baggage}, Vibe: ${vibe}, Duration: ${durationText}. Outline 5 captivating visual scenes.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    if (res1.ok) {
      const data1 = await res1.json();
      concept = data1?.choices?.[0]?.message?.content || '';
    }
  } catch (e) {
    console.warn('Agent 1 warning:', e);
  }

  // STEP 2: Meta Llama 3.3 70B (Copywriting Agent)
  if (onProgress) onProgress('🤖 Agent 2: Meta Llama 3.3 70B — প্রফেশনাল বাংলা ভয়েসওভার ও অফার টেক্সট তৈরি করছে...');

  let copy = '';
  try {
    const res2 = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are a Top Commercial Copywriter Agent. Write persuasive, high-impact Bengali voiceovers and urgency Call to Actions.',
          },
          {
            role: 'user',
            content: `Write energetic Bangla voiceovers for an ad promo from ${fromCity} to ${destination} for ${ticketRate}, baggage ${baggage}, phone ${phone}. Concept ideas: ${concept.slice(0, 400)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (res2.ok) {
      const data2 = await res2.json();
      copy = data2?.choices?.[0]?.message?.content || '';
    }
  } catch (e) {
    console.warn('Agent 2 warning:', e);
  }

  // STEP 3: Qwen 2.5 72B / Gemini (Master Polisher Agent)
  if (onProgress) onProgress('🤖 Agent 3: Qwen 2.5 72B — সব এআই এজেন্টের উত্তর দিয়ে চূড়ান্ত স্টোরিবোর্ড তৈরি করছে...');

  const masterPrompt = `You are the Lead Master AI Agent synthesizing work from Agent 1 (Creative Concept) and Agent 2 (Bengali Voiceover Copywriter).
Assemble a master 5-scene commercial storyboard script in clean Bengali.

Ad Details:
• Route: ${fromCity} ➜ ${destination}
• Price: ${ticketRate}
• Baggage: ${baggage}
• Phone: ${phone || 'যোগাযোগ করুন'}
• Location: ${location || ''}
• Duration: ${durationText}
• Vibe: ${vibe}

Agent 1 Concept: ${concept.slice(0, 500)}
Agent 2 Copy: ${copy.slice(0, 500)}

Format clearly with Header box, Ad Specs, 5 Scenes (📷 Visual, 🎥 Camera, 🎙️ Voice, 🎵 Music), and 📺 OVERLAY BANNER FOR VIDEO FOOTAGE summary.`;

  const res3 = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'qwen/qwen-2.5-72b-instruct:free',
      messages: [
        { role: 'system', content: 'You are the Lead Master Director Agent.' },
        { role: 'user', content: masterPrompt },
      ],
      temperature: 0.6,
      max_tokens: 2200,
    }),
  });

  if (!res3.ok) {
    // If agent 3 fails, fallback to standard Llama call
    return await generateOpenRouterScript(payload, apiKey, 'meta-llama/llama-3.3-70b-instruct:free');
  }

  const data3 = await res3.json();
  const finalScript = data3?.choices?.[0]?.message?.content;
  if (!finalScript) {
    return await generateOpenRouterScript(payload, apiKey, 'meta-llama/llama-3.3-70b-instruct:free');
  }

  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);

  return {
    script: finalScript.trim(),
    modelName: 'Multi-AI Agent Team (DeepSeek R1 + Llama 3.3 + Qwen 2.5)',
    modelId: 'multi-agent-team',
    elapsedTime: `${elapsedTime}s`,
    isLive: true,
    isAgentMode: true,
  };
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
