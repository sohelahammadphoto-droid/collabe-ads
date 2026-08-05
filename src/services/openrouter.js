/**
 * AI Promo Studio - OpenRouter API Service (Task-Specific Smart AI Selection Engine)
 */

export const STATIC_FREE_OPENROUTER_MODELS = [
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Google Gemini 2.0 Flash',
    badge: '🔥 বিজ্ঞাপন ও বাংলা সেরা',
    desc: 'গুগলের সবচেয়ে প্রফেশনাল ও সাবলীল বাংলা ভিডিও বিজ্ঞাপনী মডেল',
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 Reasoning',
    badge: '🧠 ক্রিয়েটিভ কনসেপ্ট ও রিজননিং',
    desc: 'গভীর ভাবনার এড হুক ও সেরা কনভার্টিং স্টোরি বানাতে ওস্তাদ',
  },
  {
    id: 'qwen/qwen-2.5-72b-instruct:free',
    name: 'Qwen 2.5 72B Instruct',
    badge: '🇧🇩 বাংলা কপিরাইটিং কিং',
    desc: 'স্বাভাবিক ও আকর্ষণীয় বাংলা বিজ্ঞাপনী শব্দ চয়নে পারফেক্ট',
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct:free',
    name: 'Meta Llama 3.1 70B',
    badge: '🎬 কমার্শিয়াল ডিরেক্টর',
    desc: 'মেটার ওয়ার্ল্ড-ক্লাস কমার্শিয়াল স্ক্রিপ্ট ও ভিজ্যুয়াল সিনের নির্দেশনা',
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B Instruct',
    badge: '⚡ ফাস্ট পাঞ্চলাইন',
    desc: 'সংক্ষিপ্ত চটজলদি বিজ্ঞাপন ও অফার কার্ড লেখার জন্য তৈরি',
  },
];

export let FREE_OPENROUTER_MODELS = [...STATIC_FREE_OPENROUTER_MODELS];

let cachedLiveModels = null;
let lastFetchTime = 0;

const OPENROUTER_MODELS_API = 'https://openrouter.ai/api/v1/models';
const OPENROUTER_API_URL    = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * 🎯 SMART TASK-BASED MODEL FILTER & DISCOVERY
 * র্যান্ডম মডেল ফিল্টার করে শুধুমাত্র বিজ্ঞাপন, বাংলা কপিরাইটিং ও প্রমো সিনের উপযোগী সেরা ফ্রি মডেল ফিল্টার করে।
 */
export async function fetchLiveFreeModels(forceRefresh = false) {
  const now = Date.now();
  if (cachedLiveModels && !forceRefresh && (now - lastFetchTime < 10 * 60 * 1000)) {
    return cachedLiveModels;
  }

  try {
    const res = await fetch(OPENROUTER_MODELS_API);
    if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
    const data = await res.json();
    const rawList = data.data || [];

    // Filter 100% free models
    const freeList = rawList.filter(m => {
      const isFreeSlug = m.id && m.id.endsWith(':free');
      const isFreePricing = m.pricing && parseFloat(m.pricing.prompt) === 0 && parseFloat(m.pricing.completion) === 0;
      return isFreeSlug || isFreePricing;
    });

    // 🚫 EXCLUDE UNRELATED NON-AD MODELS (Coding, Math, Guard, Vision-only, Embeddings)
    const nonAdKeywords = ['coder', 'math', 'base', 'embed', 'guard', 'eval', 'stepfun', 'whisper'];
    const adSuitableList = freeList.filter(m => {
      const lowerId = m.id.toLowerCase();
      return !nonAdKeywords.some(kw => lowerId.includes(kw));
    });

    if (adSuitableList.length > 0) {
      const formatted = adSuitableList.map(m => {
        let cleanName = m.name || m.id;
        cleanName = cleanName.replace(':free', '').replace(' (free)', '');

        // Task-specific smart labeling based on model family
        let badge = '১০০% ফ্রি লাইভ';
        let desc = 'ভিডিও বিজ্ঞাপন ও কমার্শিয়াল স্ক্রিপ্ট লেখার উপযোগী সচল মডেল';

        const idLower = m.id.toLowerCase();
        if (idLower.includes('gemini')) {
          badge = '🔥 বিজ্ঞাপন ও বাংলা সেরা';
          desc = 'গুগলের অতি দ্রুত ও প্রফেশনাল বিজ্ঞাপনী মডেল (সবচেয়ে নির্ভরযোগ্য)';
        } else if (idLower.includes('deepseek')) {
          badge = '🧠 ক্রিয়েটিভ কনসেপ্ট ও রিজননিং';
          desc = 'গভীর ভাবনার বিজ্ঞাপনী হুক ও আকর্ষণীয় সেলস স্টোরি তৈরি করবে';
        } else if (idLower.includes('qwen')) {
          badge = '🇧🇩 বাংলা কপিরাইটিং কিং';
          desc = 'বাংলা ভাষায় সাবলীল বিজ্ঞাপনী ভয়েসওভার লেখার জন্য সেরা';
        } else if (idLower.includes('llama')) {
          badge = '🎬 কমার্শিয়াল ডিরেক্টর';
          desc = 'মেটার প্রফেশনাল ভিডিও স্ক্রিপ্ট ও ভিজ্যুয়াল সিন নির্দেশক';
        } else if (idLower.includes('mistral')) {
          badge = '⚡ ফাস্ট পাঞ্চলাইন';
          desc = 'সংক্ষিপ্ত চটজলদি বিজ্ঞাপন ও অফার টেক্সটের জন্য উপযুক্ত';
        }

        return {
          id: m.id,
          name: cleanName,
          badge,
          desc,
        };
      });

      // Sort by Ad-Writing suitability (Gemini -> DeepSeek -> Qwen -> Llama -> Mistral -> Others)
      formatted.sort((a, b) => {
        const priority = ['gemini', 'deepseek', 'qwen', 'llama', 'mistral'];
        const aIndex = priority.findIndex(p => a.id.toLowerCase().includes(p));
        const bIndex = priority.findIndex(p => b.id.toLowerCase().includes(p));
        const aP = aIndex === -1 ? 99 : aIndex;
        const bP = bIndex === -1 ? 99 : bIndex;
        return aP - bP;
      });

      cachedLiveModels = formatted;
      FREE_OPENROUTER_MODELS = formatted;
      lastFetchTime = now;
      console.log(`🎯 আপনার প্রমো ও বিজ্ঞাপন কাজের উপযোগী ${formatted.length}টি লাইভ এআই ফিল্টার করা হয়েছে:`, formatted);
      return formatted;
    }
  } catch (err) {
    console.warn('⚠️ OpenRouter লাইভ মডেল লোড হতে সমস্যা, লোকাল প্রমো ব্যাকআপ মডেল ব্যবহৃত হচ্ছে:', err);
  }

  cachedLiveModels = STATIC_FREE_OPENROUTER_MODELS;
  FREE_OPENROUTER_MODELS = STATIC_FREE_OPENROUTER_MODELS;
  return STATIC_FREE_OPENROUTER_MODELS;
}

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
 * AI Agents Team Health Verification (Assigned specifically to Ad Tasks)
 */
export async function verifyAgentTeamHealth(apiKey) {
  const liveModels = await fetchLiveFreeModels();
  
  // Smart Task Allocation for the 3 Agents:
  // Agent 1: Concept & Strategy (DeepSeek R1 / Llama 70B)
  const agent1 = liveModels.find(m => m.id.includes('deepseek') || m.id.includes('r1')) 
              || liveModels.find(m => m.id.includes('llama')) || liveModels[0];
  
  // Agent 2: Bengali Copywriting (Gemini 2.0 / Qwen 2.5)
  const agent2 = liveModels.find(m => m.id.includes('gemini')) 
              || liveModels.find(m => m.id.includes('qwen')) || liveModels[0];

  // Agent 3: Master Director Synthesis (Qwen 2.5 / Gemini)
  const agent3 = liveModels.find(m => m.id.includes('qwen')) 
              || liveModels.find(m => m.id.includes('gemini')) || liveModels[0];

  const agentModels = [
    { id: agent1.id, name: `Agent 1: ${agent1.name} (এড কনসেপ্ট)` },
    { id: agent2.id, name: `Agent 2: ${agent2.name} (বাংলা ভয়েসওভার)` },
    { id: agent3.id, name: `Agent 3: ${agent3.name} (মাস্টার স্টোরিবোর্ড)` },
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
 * OpenRouter এর সিঙ্গেল ফ্রি AI মডেল দিয়ে বিজ্ঞাপন স্ক্রিপ্ট তৈরি (Dynamic Auto-Fallback সহ)
 */
export async function generateOpenRouterScript(payload, apiKey, modelId) {
  const startTime = Date.now();
  const liveModels = await fetchLiveFreeModels();
  const fallbackSlugs = liveModels.map(m => m.id);

  // Create ordered list of models to try
  const targetModel = modelId && !modelId.includes('llama-3.3') ? modelId : fallbackSlugs[0];
  const modelsToTry = Array.from(new Set([targetModel, ...fallbackSlugs]));

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
      const modelObj = liveModels.find(m => m.id === currentSlug);
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
 * 🤖 SMART TASK-BASED AGENT MODE (Specialized Assignment per Task Step)
 */
export async function generateMultiAgentScript(payload, apiKey, onProgress) {
  const startTime = Date.now();
  const liveModels = await fetchLiveFreeModels();

  // Task-optimized Agent Assignment:
  // Agent 1: DeepSeek R1 (Creative Strategy & High-converting Hook)
  const m1 = liveModels.find(m => m.id.includes('deepseek') || m.id.includes('r1')) 
          || liveModels.find(m => m.id.includes('llama')) || liveModels[0];

  // Agent 2: Google Gemini 2.0 / Qwen 2.5 (Bengali Commercial Copywriting)
  const m2 = liveModels.find(m => m.id.includes('gemini')) 
          || liveModels.find(m => m.id.includes('qwen')) || liveModels[0];

  // Agent 3: Qwen 2.5 72B / Gemini (Master Director Synthesis)
  const m3 = liveModels.find(m => m.id.includes('qwen')) 
          || liveModels.find(m => m.id.includes('gemini')) || liveModels[0];

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

  // STEP 1: Creative Concept Agent
  if (onProgress) onProgress(`⏳ Agent 1: ${m1.name} — বিজ্ঞাপনী কনসেপ্ট ও হুক শট তৈরি করছে...`, completedAgents);

  let concept = '';
  const agent1Slugs = [m1.id, m2.id, m3.id];
  let agent1Used = m1.name;

  for (const mSlug of agent1Slugs) {
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
          const mObj = liveModels.find(m => m.id === mSlug);
          if (mObj) agent1Used = mObj.name;
          break;
        }
      }
    } catch (e) {
      console.warn('Agent 1 fallback:', e);
    }
  }

  completedAgents.push(`✅ ${agent1Used} (এড কনসেপ্ট) — সম্পন্ন`);

  // STEP 2: Bengali Copywriting Agent
  if (onProgress) onProgress(`⏳ Agent 2: ${m2.name} — কমার্শিয়াল বাংলা ভয়েসওভার প্রস্তুত করছে...`, completedAgents);

  let copy = '';
  const agent2Slugs = [m2.id, m3.id, m1.id];
  let agent2Used = m2.name;

  for (const mSlug of agent2Slugs) {
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
          const mObj = liveModels.find(m => m.id === mSlug);
          if (mObj) agent2Used = mObj.name;
          break;
        }
      }
    } catch (e) {
      console.warn('Agent 2 fallback:', e);
    }
  }

  completedAgents.push(`✅ ${agent2Used} (বাংলা ভয়েসওভার) — সম্পন্ন`);

  // STEP 3: Master Director Agent
  if (onProgress) onProgress(`⏳ Agent 3: ${m3.name} — মাস্টার ভিডিও স্টোরিবোর্ড ফাইনাল করছে...`, completedAgents);

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

  const agent3Slugs = [m3.id, m2.id, m1.id];
  let agent3Used = m3.name;

  for (const mSlug of agent3Slugs) {
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
          const mObj = liveModels.find(m => m.id === mSlug);
          if (mObj) agent3Used = mObj.name;
          completedAgents.push(`✅ ${agent3Used} (মাস্টার স্টোরিবোর্ড) — সম্পন্ন`);
          
          if (onProgress) onProgress('🎉 সব প্রফেশনাল এআই এজেন্ট সফলভাবে কমার্শিয়াল স্ক্রিপ্ট প্রস্তুত করেছে!', completedAgents);

          const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
          return {
            script: finalScript.trim(),
            modelName: `Multi-AI Team (${agent1Used} + ${agent2Used} + ${agent3Used})`,
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
  return await generateOpenRouterScript(payload, apiKey, m2.id);
}

/**
 * OpenRouter সংযোগ এবং API Key পরীক্ষার ফাংশন
 */
export async function testOpenRouterConnection(apiKey, modelId) {
  const liveModels = await fetchLiveFreeModels();
  const targetModel = modelId || liveModels[0].id;
  const modelsToTry = Array.from(new Set([targetModel, ...liveModels.map(m => m.id)]));

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
        const modelObj = liveModels.find(m => m.id === mSlug);
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
