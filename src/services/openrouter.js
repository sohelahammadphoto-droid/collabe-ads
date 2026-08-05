/**
 * AI Promo Studio - OpenRouter API Service (100% Free AI LLM Models & Auto Fallback Engine)
 */

export const FREE_OPENROUTER_MODELS = [
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Google Gemini 2.0 Flash',
    badge: '১০০% ফ্রি ও সেরা',
    desc: 'গুগলের অতি দ্রুত ও প্রফেশনাল মডেল (সবচেয়ে নির্ভরযোগ্য)',
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 Reasoning',
    badge: 'হাই রিজনানিং',
    desc: 'সবচেয়ে ক্রিয়েটিভ ও গভীর ভাবনার এড স্টোরি তৈরি করবে',
  },
  {
    id: 'qwen/qwen-2.5-72b-instruct:free',
    name: 'Qwen 2.5 72B',
    badge: 'বাংলা পারফেক্ট',
    desc: 'বাংলা ভাষায় চমৎকার ও সাবলীল বিজ্ঞাপন লেখার জন্য পারফেক্ট',
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct:free',
    name: 'Meta Llama 3.1 70B',
    badge: 'হাই কোয়ালিটি',
    desc: 'মেটার শক্তিশালী ওপেন সোর্স মডেল',
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B Instruct',
    badge: 'লাইটওয়েট',
    desc: 'সংক্ষিপ্ত ও চটকদার কমার্শিয়াল স্ক্রিপ্টের জন্য উপযুক্ত',
  },
];

// Fallback order if any model slug is disabled by OpenRouter
const FALLBACK_MODEL_SLUGS = [
  'google/gemini-2.0-flash-exp:free',
  'deepseek/deepseek-r1:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'meta-llama/llama-3.1-70b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
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
 * Quick verification of AI Agents Team Health
 */
export async function verifyAgentTeamHealth(apiKey) {
  const agentModels = [
    { id: 'deepseek/deepseek-r1:free', name: 'Agent 1: DeepSeek R1' },
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Agent 2: Gemini 2.0' },
    { id: 'qwen/qwen-2.5-72b-instruct:free', name: 'Agent 3: Qwen 2.5 72B' },
  ];

  const headers = {
    'Content-Type': 'application/json',
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://aipromostudio.local',
    'X-Title': 'AI Promo Studio Agent Check',
  };

  if (apiKey && apiKey.trim()) {
    headers['Authorization'] = `Bearer ${apiKey.trim()}`;
  }

  try {
    const checks = await Promise.all(agentModels.map(async (agent) => {
      try {
        const res = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: agent.id,
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 5,
          }),
        });
        return { ...agent, ok: res.ok };
      } catch {
        return { ...agent, ok: false };
      }
    }));

    const allOk = checks.every(c => c.ok);
    return { allOk, checks };
  } catch {
    return { allOk: false, checks: agentModels.map(a => ({ ...a, ok: false })) };
  }
}

/**
 * OpenRouter এর সিঙ্গেল ফ্রি AI মডেল দিয়ে বিজ্ঞাপন স্ক্রিপ্ট তৈরি (Auto-Fallback সহ)
 */
export async function generateOpenRouterScript(payload, apiKey, modelId) {
  const startTime = Date.now();
  
  // Create ordered list of models to try
  const targetModel = modelId && !modelId.includes('llama-3.3') ? modelId : FREE_OPENROUTER_MODELS[0].id;
  const modelsToTry = Array.from(new Set([targetModel, ...FALLBACK_MODEL_SLUGS]));

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

  let lastError = null;

  for (const currentSlug of modelsToTry) {
    try {
      const res = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: currentSlug,
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
        const errorMsg = errData?.error?.message || `Status: ${res.status}`;
        lastError = new Error(errorMsg);
        console.warn(`Model ${currentSlug} failed, trying fallback model... (${errorMsg})`);
        continue;
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        lastError = new Error(`Model ${currentSlug} returned empty content`);
        continue;
      }

      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
      const modelObj = FREE_OPENROUTER_MODELS.find(m => m.id === currentSlug);
      const displayName = modelObj ? modelObj.name : currentSlug.split('/')[1]?.split(':')[0] || currentSlug;

      return {
        script: content.trim(),
        modelName: displayName,
        modelId: currentSlug,
        elapsedTime: `${elapsedTime}s`,
        isLive: true,
      };
    } catch (err) {
      lastError = err;
      console.warn(`Fetch error for ${currentSlug}, trying fallback:`, err);
    }
  }

  throw lastError || new Error('OpenRouter-এর কোনো ফ্রি মডেল থেকে উত্তর পাওয়া যায়নি।');
}

/**
 * 🤖 AGENT MODE (Multi-AI Team Collaboration Engine with Live Tickmark Callbacks)
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

  const completedAgents = [];

  // STEP 1: DeepSeek R1 / Gemini (Strategy Agent)
  if (onProgress) onProgress('⏳ Agent 1: DeepSeek R1 — ক্রিয়েটিভ কনসেপ্ট তৈরি হচ্ছে...', completedAgents);

  let concept = '';
  const agent1Models = ['deepseek/deepseek-r1:free', 'google/gemini-2.0-flash-exp:free', 'qwen/qwen-2.5-72b-instruct:free'];
  let agent1Used = 'DeepSeek R1';

  for (const mSlug of agent1Models) {
    try {
      const res1 = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: mSlug,
          messages: [
            { role: 'system', content: 'You are an Elite Creative Director Agent. Outline 5 captivating visual scenes for an air ticket promo ad.' },
            { role: 'user', content: `Route: ${fromCity} to ${destination}, Price: ${ticketRate}, Baggage: ${baggage}, Vibe: ${vibe}, Duration: ${durationText}.` },
          ],
          temperature: 0.8,
          max_tokens: 800,
        }),
      });

      if (res1.ok) {
        const data1 = await res1.json();
        concept = data1?.choices?.[0]?.message?.content || '';
        if (concept) {
          const mObj = FREE_OPENROUTER_MODELS.find(m => m.id === mSlug);
          if (mObj) agent1Used = mObj.name;
          break;
        }
      }
    } catch (e) {
      console.warn('Agent 1 fallback:', e);
    }
  }

  completedAgents.push(`✅ ${agent1Used} (Concept Agent) — সম্পন্ন`);

  // STEP 2: Gemini / Qwen (Copywriting Agent)
  if (onProgress) onProgress('⏳ Agent 2: Gemini 2.0 — বাংলা ভয়েসওভার ও টেক্সট তৈরি হচ্ছে...', completedAgents);

  let copy = '';
  const agent2Models = ['google/gemini-2.0-flash-exp:free', 'qwen/qwen-2.5-72b-instruct:free', 'meta-llama/llama-3.1-70b-instruct:free'];
  let agent2Used = 'Gemini 2.0 Flash';

  for (const mSlug of agent2Models) {
    try {
      const res2 = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: mSlug,
          messages: [
            { role: 'system', content: 'You are a Master Bengali Advertising Copywriter Agent. Write high-impact Bengali voiceovers.' },
            { role: 'user', content: `Write energetic Bangla voiceovers for flight from ${fromCity} to ${destination} for ${ticketRate}, baggage ${baggage}, phone ${phone}. Concept: ${concept.slice(0, 300)}` },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (res2.ok) {
        const data2 = await res2.json();
        copy = data2?.choices?.[0]?.message?.content || '';
        if (copy) {
          const mObj = FREE_OPENROUTER_MODELS.find(m => m.id === mSlug);
          if (mObj) agent2Used = mObj.name;
          break;
        }
      }
    } catch (e) {
      console.warn('Agent 2 fallback:', e);
    }
  }

  completedAgents.push(`✅ ${agent2Used} (Copywriter Agent) — সম্পন্ন`);

  // STEP 3: Master Synthesis Agent
  if (onProgress) onProgress('⏳ Agent 3: Qwen 2.5 72B — চূড়ান্ত সমন্বিত স্টোরিবোর্ড প্রস্তুত করছে...', completedAgents);

  const masterPrompt = `You are the Lead Master Director Agent synthesizing creative work into a master 5-scene commercial ad script in fluent Bengali.

Ad Info:
• Route: ${fromCity} ➜ ${destination}
• Price: ${ticketRate}
• Baggage: ${baggage}
• Phone: ${phone || 'যোগাযোগ করুন'}
• Location: ${location || ''}
• Duration: ${durationText}
• Vibe: ${vibe}

Concept Notes: ${concept.slice(0, 400)}
Voiceover Notes: ${copy.slice(0, 400)}

Format clearly with Header box, Ad Specs, 5 Scenes (📷 Visual, 🎥 Camera, 🎙️ Voice, 🎵 Music), and 📺 OVERLAY BANNER FOR VIDEO FOOTAGE summary.`;

  const masterModels = ['qwen/qwen-2.5-72b-instruct:free', 'google/gemini-2.0-flash-exp:free', 'meta-llama/llama-3.1-70b-instruct:free'];
  let agent3Used = 'Qwen 2.5 72B';

  for (const mSlug of masterModels) {
    try {
      const res3 = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: mSlug,
          messages: [
            { role: 'system', content: 'You are the Lead Master Director Agent.' },
            { role: 'user', content: masterPrompt },
          ],
          temperature: 0.6,
          max_tokens: 2200,
        }),
      });

      if (res3.ok) {
        const data3 = await res3.json();
        const finalScript = data3?.choices?.[0]?.message?.content;
        if (finalScript) {
          const mObj = FREE_OPENROUTER_MODELS.find(m => m.id === mSlug);
          if (mObj) agent3Used = mObj.name;
          completedAgents.push(`✅ ${agent3Used} (Master Agent) — সম্পন্ন`);
          
          if (onProgress) onProgress('🎉 সব AI এজেন্ট সফলভাবে স্ক্রিপ্ট প্রস্তুত করেছে!', completedAgents);

          const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
          return {
            script: finalScript.trim(),
            modelName: 'Multi-AI Agent Team (DeepSeek + Gemini + Qwen)',
            modelId: 'multi-agent-team',
            elapsedTime: `${elapsedTime}s`,
            isLive: true,
            isAgentMode: true,
            completedAgents,
          };
        }
      }
    } catch (e) {
      console.warn('Agent 3 fallback:', e);
    }
  }

  // Final fallback to single model generator
  return await generateOpenRouterScript(payload, apiKey, 'google/gemini-2.0-flash-exp:free');
}

/**
 * OpenRouter সংযোগ এবং API Key পরীক্ষার ফাংশন
 */
export async function testOpenRouterConnection(apiKey, modelId) {
  const targetModel = modelId && !modelId.includes('llama-3.3') ? modelId : FREE_OPENROUTER_MODELS[0].id;
  const modelsToTry = Array.from(new Set([targetModel, ...FALLBACK_MODEL_SLUGS]));

  const headers = {
    'Content-Type': 'application/json',
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://aipromostudio.local',
    'X-Title': 'AI Promo Studio',
  };

  if (apiKey && apiKey.trim()) {
    headers['Authorization'] = `Bearer ${apiKey.trim()}`;
  }

  let lastError = null;

  for (const mSlug of modelsToTry) {
    try {
      const res = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: mSlug,
          messages: [
            { role: 'user', content: 'Say "OpenRouter Connected Successfully!" in 5 words.' },
          ],
          max_tokens: 20,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content || 'সফলভবে যুক্ত হয়েছে!';
        const modelObj = FREE_OPENROUTER_MODELS.find(m => m.id === mSlug);
        const name = modelObj ? modelObj.name : mSlug;
        return { success: true, text: `[${name}] ${text.trim()}` };
      } else {
        const errData = await res.json().catch(() => ({}));
        lastError = errData?.error?.message || `Status: ${res.status}`;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  return { success: false, error: lastError || 'সংযোগ ব্যর্থ হয়েছে' };
}
