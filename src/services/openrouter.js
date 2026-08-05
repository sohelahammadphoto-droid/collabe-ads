/**
 * AI Promo Studio - OpenRouter API Service (Hard-Selling Ticket Promo Commercial Engine)
 */

export const STATIC_FREE_OPENROUTER_MODELS = [
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Google Gemini 2.0 Flash',
    badge: '🔥 সেলস এড ও বাংলা সেরা',
    desc: 'গুগলের অতি দ্রুত ও প্রফেশনাল বিজ্ঞাপনী মডেল (সবচেয়ে নির্ভরযোগ্য)',
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 Reasoning',
    badge: '🧠 সেলস হুক ও রিজননিং',
    desc: 'গভীর ভাবনার উচ্চ কনভার্টিং টিকিট সেলস এড তৈরি করবে',
  },
  {
    id: 'qwen/qwen-2.5-72b-instruct:free',
    name: 'Qwen 2.5 72B Instruct',
    badge: '🇧🇩 বাংলা কমার্শিয়াল কিং',
    desc: 'স্বাভাবিক ও আকর্ষক কমার্শিয়াল বাংলা ভয়েসওভার চয়নে পারফেক্ট',
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
    desc: 'সংক্ষিপ্ত চটজলদি বিজ্ঞাপন ও অফার টেক্সটের জন্য উপযুক্ত',
  },
];

export let FREE_OPENROUTER_MODELS = [...STATIC_FREE_OPENROUTER_MODELS];

let cachedLiveModels = null;
let lastFetchTime = 0;

const OPENROUTER_MODELS_API = 'https://openrouter.ai/api/v1/models';
const OPENROUTER_API_URL    = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * 🎯 SMART TASK-BASED MODEL FILTER & DISCOVERY
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

    // Exclude non-ad models
    const nonAdKeywords = ['coder', 'math', 'base', 'embed', 'guard', 'eval', 'stepfun', 'whisper'];
    const adSuitableList = freeList.filter(m => {
      const lowerId = m.id.toLowerCase();
      return !nonAdKeywords.some(kw => lowerId.includes(kw));
    });

    if (adSuitableList.length > 0) {
      const formatted = adSuitableList.map(m => {
        let cleanName = m.name || m.id;
        cleanName = cleanName.replace(':free', '').replace(' (free)', '');

        let badge = '১০০% ফ্রি লাইভ';
        let desc = 'টিকিট বিক্রির কমার্শিয়াল স্ক্রিপ্ট লেখার উপযোগী সচল মডেল';

        const idLower = m.id.toLowerCase();
        if (idLower.includes('gemini')) {
          badge = '🔥 সেলস এড ও বাংলা সেরা';
          desc = 'গুগলের অতি দ্রুত ও প্রফেশনাল বিজ্ঞাপনী মডেল (সবচেয়ে নির্ভরযোগ্য)';
        } else if (idLower.includes('deepseek')) {
          badge = '🧠 সেলস হুক ও রিজননিং';
          desc = 'গভীর ভাবনার উচ্চ কনভার্টিং টিকিট সেলস এড তৈরি করবে';
        } else if (idLower.includes('qwen')) {
          badge = '🇧🇩 বাংলা কমার্শিয়াল কিং';
          desc = 'স্বাভাবিক ও আকর্ষক কমার্শিয়াল বাংলা ভয়েসওভার চয়নে পারফেক্ট';
        } else if (idLower.includes('llama')) {
          badge = '🎬 কমার্শিয়াল ডিরেক্টর';
          desc = 'মেটার প্রফেশনাল ভিডিও স্ক্রিপ্ট ও ভিজ্যুয়াল সিন নির্দেশক';
        } else if (idLower.includes('mistral')) {
          badge = '⚡ ফাস্ট পাঞ্চলাইন';
          desc = 'সংক্ষিপ্ত চটজলদি বিজ্ঞাপন ও অফার টেক্সটের জন্য উপযুক্ত';
        }

        return { id: m.id, name: cleanName, badge, desc };
      });

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
      return formatted;
    }
  } catch (err) {
    console.warn('⚠️ OpenRouter লাইভ মডেল লোড হতে সমস্যা, লোকাল প্রমো ব্যাকআপ মডেল ব্যবহৃত হচ্ছে:', err);
  }

  cachedLiveModels = STATIC_FREE_OPENROUTER_MODELS;
  FREE_OPENROUTER_MODELS = STATIC_FREE_OPENROUTER_MODELS;
  return STATIC_FREE_OPENROUTER_MODELS;
}

export function getDurationLabel(dur) {
  switch (dur) {
    case '15s':  return '১৫-সেকেন্ড (Shorts/Reels/TikTok)';
    case '30s':  return '৩০-সেকেন্ড (Standard Promo)';
    case '60s':  return '১-মিনিট (Detailed Commercial)';
    case '120s': return '২-মিনিট (Full Feature Commercial)';
    default:     return `${dur || '30s'} প্রমো`;
  }
}

export async function verifyAgentTeamHealth(apiKey) {
  const liveModels = await fetchLiveFreeModels();
  
  const agent1 = liveModels.find(m => m.id.includes('deepseek') || m.id.includes('r1')) 
              || liveModels.find(m => m.id.includes('llama')) || liveModels[0];
  const agent2 = liveModels.find(m => m.id.includes('gemini')) 
              || liveModels.find(m => m.id.includes('qwen')) || liveModels[0];
  const agent3 = liveModels.find(m => m.id.includes('qwen')) 
              || liveModels.find(m => m.id.includes('gemini')) || liveModels[0];

  const agentModels = [
    { id: agent1.id, name: `Agent 1: ${agent1.name} (সেলস হুক)` },
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

    return { allOk: checks.every(c => c.ok), checks };
  } catch {
    return { allOk: false, checks: agentModels.map(a => ({ ...a, ok: false })) };
  }
}

/**
 * 📢 HARD-SELLING TICKET COMMERCIAL GENERATOR (SINGLE MODEL)
 */
export async function generateOpenRouterScript(payload, apiKey, modelId) {
  const startTime = Date.now();
  const liveModels = await fetchLiveFreeModels();
  const fallbackSlugs = liveModels.map(m => m.id);

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

  const systemPrompt = `You are a High-Converting Hard-Selling Airline Ticket Sales Commercial Copywriter and Creative Director.
Your ONLY goal is to write an urgent, high-converting COMMERCIAL SALES AD SCRIPT in fluent Bengali to SELL FLIGHT TICKETS.

CRITICAL INSTRUCTIONS:
- DO NOT write poetic, slow movie narratives or abstract storytelling essays.
- Focus 100% on HARD TICKET SALES: Destination (${fromCity} ➜ ${destination}), Unbeatable Ticket Price (${ticketRate}), Free Baggage Allowance (${baggage}), Agency Phone Number (${phone}), and Office Location (${location}).
- The voiceover must be excited, energetic, clear, and punchy commercial sales pitch in Bengali.
- Scene 1 MUST be an urgent attention hook for air travelers.
- Scene 2 MUST showcase the ticket price ${ticketRate} and route ${fromCity} to ${destination}.
- Scene 3 MUST showcase the ${baggage} free baggage allowance.
- Scene 4 MUST be an urgent Call to Action with Phone (${phone}) & Address (${location}).
- Scene 5 MUST be final brand outro and contact card.

Output format:
1. Header Box with Route & Active AI Model Name
2. Ad Specs Table (Target Audience, Route, Ticket Price: ${ticketRate}, Baggage: ${baggage}, Contact: ${phone}, Duration: ${durationText})
3. 5 Commercial Scenes with 📷 Visual, 🎥 Camera, 🎙️ Voice (Bengali Sales Voiceover), 🎵 Music.
4. 📺 OVERLAY BANNER FOR VIDEO FOOTAGE: Burn-in text summary.`;

  const userPrompt = `তৈরি করুন একটি প্রফেশনাল ${durationText} দৈর্ঘ্যের এয়ারলাইন টিকিট সেলস প্রমোশনাল ভিডিও স্ক্রিপ্ট।

ফ্লাইট অফার ও টিকিটের অফার তথ্য:
• রুট: ${fromCity} থেকে ${destination}
• কমার্শিয়াল টিকেট মূল্য: ${ticketRate}
• ফ্রি ব্যাগেজ এলাউন্স: ${baggage}
• বুকিং হটলাইন / ফোন: ${phone || 'যোগাযোগ করুন'}
• এজেন্সির লোকেশন / ঠিকানা: ${location || 'প্রযোজ্য নয়'}
• ভিডিও মেজাজ / Vibe: ${vibe}
• সময়সীমা: ${durationText}

দয়া করে কোনো অতিরিক্ত কাব্যিক গল্প না লিখে, সরাসরি কাস্টমারের কাছে টিকেট বিক্রির উদ্দেশ্য নিয়ে হাই-এনার্জি কমার্শিয়াল বাংলা ভয়েসওভার ও ভিডিও স্ক্রিপ্ট তৈরি করুন।`;

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
    }
  }

  throw lastError || new Error('OpenRouter-এর কোনো ফ্রি মডেল থেকে উত্তর পাওয়া যায়নি।');
}

/**
 * 🤖 HARD-SELLING MULTI-AGENT COMMERCIAL ENGINE
 */
export async function generateMultiAgentScript(payload, apiKey, onProgress) {
  const startTime = Date.now();
  const liveModels = await fetchLiveFreeModels();

  const m1 = liveModels.find(m => m.id.includes('deepseek') || m.id.includes('r1')) 
          || liveModels.find(m => m.id.includes('llama')) || liveModels[0];

  const m2 = liveModels.find(m => m.id.includes('gemini')) 
          || liveModels.find(m => m.id.includes('qwen')) || liveModels[0];

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

  // STEP 1: Sales Hook Strategy Agent
  if (onProgress) onProgress(`⏳ Agent 1: ${m1.name} — কমার্শিয়াল সেলস হুক ও ড্রোন শট তৈরি করছে...`, completedAgents);

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
            { role: 'system', content: 'You are an Elite Travel Agency Sales Ad Director. Create 5 visual commercial scenes focusing heavily on ticket sales, flight offer, price, and baggage.' },
            { role: 'user', content: `Flight Route: ${fromCity} to ${destination}, Special Ticket Price: ${ticketRate}, Free Baggage: ${baggage}, Hotline: ${phone}, Address: ${location}.` },
          ],
          temperature: 0.7,
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

  completedAgents.push(`✅ ${agent1Used} (সেলস হুক) — সম্পন্ন`);

  // STEP 2: Bengali Hard-Selling Voiceover Copywriter
  if (onProgress) onProgress(`⏳ Agent 2: ${m2.name} — হাই-এনার্জি বাংলা সেলস ভয়েসওভার প্রস্তুত করছে...`, completedAgents);

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
            { role: 'system', content: 'You are a Master Bengali Hard-Selling Ad Copywriter. Write urgent, excited, high-converting Bengali sales voiceovers to sell tickets immediately. Mention exact price, baggage, and phone number.' },
            { role: 'user', content: `Write high-impact Bengali sales copy for flight from ${fromCity} to ${destination}. Price: ${ticketRate}, Baggage: ${baggage}, Phone: ${phone}, Location: ${location}.` },
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

  // STEP 3: Master Commercial Director Synthesis
  if (onProgress) onProgress(`⏳ Agent 3: ${m3.name} — কমার্শিয়াল টিভি বিজ্ঞাপন স্টোরিবোর্ড প্রস্তুত করছে...`, completedAgents);

  const masterPrompt = `You are the Lead Commercial Ad Director Agent synthesizing creative work into a master 5-scene HIGH-CONVERTING TICKET SALES COMMERCIAL SCRIPT in fluent Bengali.

DO NOT write slow poetic movie stories. Focus 100% on SELLING AIRLINE TICKETS!

Ad Details:
• Route: ${fromCity} ➜ ${destination}
• Ticket Price: ${ticketRate}
• Free Baggage: ${baggage}
• Contact Hotline: ${phone || 'যোগাযোগ করুন'}
• Office Location: ${location || ''}
• Duration: ${durationText}
• Vibe: ${vibe}

Concept Notes: ${concept.slice(0, 400)}
Voiceover Notes: ${copy.slice(0, 400)}

Format clearly with Header box, Ad Specs Table, 5 Commercial Scenes (📷 Visual, 🎥 Camera, 🎙️ Voice in excited Bengali, 🎵 Music), and 📺 OVERLAY BANNER FOR VIDEO FOOTAGE summary.`;

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
            { role: 'system', content: 'You are the Lead Commercial Sales Director Agent.' },
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
          completedAgents.push(`✅ ${agent3Used} (কমার্শিয়াল স্টোরিবোর্ড) — সম্পন্ন`);
          
          if (onProgress) onProgress('🎉 সব এআই এজেন্ট সফলভাবে কমার্শিয়াল টিকেট সেলস এড স্ক্রিপ্ট প্রস্তুত করেছে!', completedAgents);

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

  return await generateOpenRouterScript(payload, apiKey, m2.id);
}

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
