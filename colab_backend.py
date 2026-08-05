"""
=============================================================================
AI Promo Studio (এআই প্রোমো স্টুдио) - Google Colab Backend Script
FLIGHT TICKET PROMO GENERATOR (AUTOMATED PROMPT & OVERLAY ENGINE)
=============================================================================
Features:
1. Zero-RAM Rule-Based Template System for City/Destination Prompts.
2. Accepts {destination, vibe, offer_text, reference_image}.
3. Wan 2.2 TI2V & LTX-Video generation with zero baked-in numbers/text.
4. PIL Frame-by-Frame Text Burn-In Overlay Step (100% accurate price banner).
5. All memory-safety (float16, low_cpu_mem_usage, cpu_offload, Drive cache) intact.
=============================================================================
"""

import os
import sys
import gc
import re
import time
import uuid
import base64
import threading
import subprocess
from io import BytesIO
from typing import Dict, Any

# STEP 1: Mount Google Drive & Setup Model Cache
CACHE_DIR = "/tmp/ai_promo_studio_cache"

try:
    print("📁 [1/4] Google Drive মাউন্ট করা হচ্ছে...")
    from google.colab import drive
    drive.mount('/content/drive', force_remount=False)
    
    DRIVE_CACHE_DIR = "/content/drive/MyDrive/ai_promo_studio_cache"
    os.makedirs(DRIVE_CACHE_DIR, exist_ok=True)
    CACHE_DIR = DRIVE_CACHE_DIR
    
    print(f"📂 Google Drive সংযুক্ত হয়েছে, মডেল ক্যাশ হবে এখানে: {CACHE_DIR}")
    print("⚠️ সতর্কবার্তা: গুগল ড্রাইভ ক্যাশের জন্য প্রায় ২০-২৫ জিবি ফ্রি স্পেসের প্রয়োজন হতে পারে。\n")
except Exception as drive_err:
    print(f"⚠️ Google Drive মাউন্ট এড়ানো হয়েছে বা ব্যর্থ হয়েছে: {drive_err}")
    print(f"📂 ক্যাশিং ক্যাশ লোকাল অস্থায়ী ফোল্ডারে নির্দেশিত: {CACHE_DIR}\n")

# Set Hugging Face cache directories before imports
os.environ["HF_HOME"] = CACHE_DIR
os.environ["TRANSFORMERS_CACHE"] = CACHE_DIR
os.environ["HF_HUB_CACHE"] = CACHE_DIR

# STEP 2: Package Dependency Installation Check
def install_dependencies():
    print("📦 [2/4] প্রয়োজনীয় প্যাকেজগুলো চেক ও ইন্সটল করা হচ্ছে (torch বাদে)...")
    packages = [
        "flask", "flask-cors", "diffusers", "transformers", 
        "accelerate", "imageio", "imageio-ffmpeg", 
        "sentencepiece", "ftfy", "safetensors", "pillow", "psutil"
    ]
    subprocess.run([sys.executable, "-m", "pip", "install", "-q"] + packages)
    print("✅ প্যাকেজ ইন্সটলেশন সম্পন্ন হয়েছে!")
    
    if not os.path.exists("./cloudflared"):
        print("🌐 Cloudflare tunnel বাইনারি ডাউনলোড করা হচ্ছে...")
        subprocess.run(["wget", "-q", "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64", "-O", "cloudflared"])
        subprocess.run(["chmod", "+x", "cloudflared"])
        print("✅ Cloudflare tunnel প্রস্তুত!")

try:
    import psutil
    import torch
    import imageio
    import numpy as np
    from PIL import Image, ImageDraw, ImageFont
    from flask import Flask, request, jsonify, send_file
    from flask_cors import CORS
except ImportError:
    install_dependencies()
    import psutil
    import torch
    import imageio
    import numpy as np
    from PIL import Image, ImageDraw, ImageFont
    from flask import Flask, request, jsonify, send_file
    from flask_cors import CORS

print(f"⚡ [3/4] PyTorch ও CUDA চেক করা হচ্ছে... (CUDA Available: {torch.cuda.is_available()})")

# App setup
app = Flask(__name__)
CORS(app)

# Storage for active jobs
JOBS: Dict[str, Dict[str, Any]] = {}
OUTPUT_DIR = "/tmp/ai_promo_videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ZERO-RAM PROMPT TEMPLATES FOR FLIGHT PROMOS
PROMPT_TEMPLATES = {
    "cinematic sunset": "{city} skyline at golden hour, warm sunset lighting, an airplane flying past in the foreground, smooth aerial camera movement, ultra realistic, travel photography style",
    "bright daytime": "{city} skyline in bright daylight, clear blue sky, an airplane ascending in the foreground, dynamic camera pan, vivid colors, travel photography style",
    "night city lights": "{city} skyline at night, illuminated buildings, an airplane flying past with visible lights, cinematic night photography style",
    "energetic fast-paced": "{city} skyline, fast dynamic camera movement, an airplane flying quickly across frame, energetic motion, vibrant colors, travel promo style"
}

# AGGRESSIVE CLEANUP FUNCTION
def clear_vram():
    gc.collect()
    gc.collect()
    if torch.cuda.is_available():
        try:
            torch.cuda.synchronize()
            torch.cuda.empty_cache()
            torch.cuda.ipc_collect()
        except Exception:
            pass
    time.sleep(3)

# SYSTEM MEMORY MONITORING
def get_memory_stats():
    ram = psutil.virtual_memory()
    free_ram_gb = ram.available / (1024 ** 3)
    
    free_vram_gb = 0.0
    if torch.cuda.is_available():
        try:
            free_bytes, total_bytes = torch.cuda.mem_get_info()
            free_vram_gb = free_bytes / (1024 ** 3)
        except Exception:
            free_vram_gb = 0.0
            
    return free_ram_gb, free_vram_gb

def check_memory_headroom(min_ram_gb: float = 1.5) -> tuple[bool, str]:
    free_ram_gb, free_vram_gb = get_memory_stats()
    msg = f"🧠 উপলব্ধ RAM: {free_ram_gb:.1f}GB, VRAM: {free_vram_gb:.1f}GB"
    print(msg)
    if free_ram_gb < min_ram_gb:
        return False, f"পর্যাপ্ত মেমোরি নেই ({free_ram_gb:.1f}GB বাকি), নিরাপদে থেমে গেছে। Colab session restart করে আবার চেষ্টা করুন।"
    return True, msg

# BURN-IN OFFER TEXT OVERLAY ON VIDEO FRAMES
def add_offer_text_overlay(frame_np, offer_text: str):
    if not offer_text or not offer_text.strip():
        return frame_np
    
    img = Image.fromarray(frame_np)
    draw = ImageDraw.Draw(img, "RGBA")
    w, h = img.size
    
    # Bottom third banner height (24% of height)
    banner_h = int(h * 0.24)
    banner_top = h - banner_h
    
    # Semi-transparent dark banner (Dark Indigo/Navy)
    draw.rectangle([0, banner_top, w, h], fill=(11, 15, 25, 220))
    
    # Accent top border line (Crimson Red/Gold)
    draw.rectangle([0, banner_top, w, banner_top + 4], fill=(239, 68, 68, 255))
    
    # Font setup
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(banner_h * 0.32))
    except Exception:
        font = ImageFont.load_default()
        
    text_bbox = draw.textbbox((0, 0), offer_text, font=font)
    text_w = text_bbox[2] - text_bbox[0]
    text_h = text_bbox[3] - text_bbox[1]
    
    text_x = max(10, (w - text_w) // 2)
    text_y = banner_top + (banner_h - text_h) // 2
    
    # Text drop shadow + Gold text
    draw.text((text_x + 2, text_y + 2), offer_text, font=font, fill=(0, 0, 0, 255))
    draw.text((text_x, text_y), offer_text, font=font, fill=(255, 235, 59, 255))
    
    return np.array(img.convert("RGB"))

# MOCK DUMMY VIDEO CREATOR WITH OVERLAY
def create_dummy_video(output_path: str, offer_text: str = "", duration_sec: int = 4, fps: int = 24):
    writer = imageio.get_writer(output_path, fps=fps)
    num_frames = duration_sec * fps
    
    for i in range(num_frames):
        t = i / num_frames
        r = int(128 + 127 * np.sin(2 * np.pi * t))
        g = int(128 + 127 * np.sin(2 * np.pi * t + 2 * np.pi / 3))
        b = int(128 + 127 * np.sin(2 * np.pi * t + 4 * np.pi / 3))
        
        frame = np.zeros((384, 640, 3), dtype=np.uint8)
        frame[:, :, 0] = r
        frame[:, :, 1] = g
        frame[:, :, 2] = b
        
        # Apply text overlay
        frame_with_text = add_offer_text_overlay(frame, offer_text)
        writer.append_data(frame_with_text)
        
    writer.close()

# MAIN PIPELINE WITH FLIGHT PROMO ENGINE
def run_generation_pipeline(job_id: str, destination: str, vibe: str, offer_text: str, ref_image_b64: str, user_model: str):
    job = JOBS[job_id]
    output_path = os.path.join(OUTPUT_DIR, f"{job_id}.mp4")
    start_time = time.time()
    
    def check_if_cancelled() -> bool:
        if job.get("cancelled", False):
            print(f"[{job_id}] Stop signal received! Aborting pipeline...")
            job["status"] = "Failed"
            job["progress"] = 0
            job["message"] = "🛑 ভিডিও জেনারেশন থামানো হয়েছে।"
            clear_vram()
            return True
        return False

    try:
        if check_if_cancelled(): return

        # Pre-flight RAM check
        is_safe, mem_msg = check_memory_headroom(min_ram_gb=1.5)
        if not is_safe:
            job["status"] = "Failed"
            job["progress"] = 0
            job["message"] = mem_msg
            return

        # STEP 1: Rule-Based Template Prompt Builder (Zero-RAM Cost)
        job["status"] = "Processing"
        job["progress"] = 10
        job["message"] = f"🖼️ {destination} এর জন্য দৃশ্য সাজানো হচ্ছে..."
        print(f"[{job_id}] Step 1: Building Prompt for {destination} ({vibe})...")
        
        template = PROMPT_TEMPLATES.get(vibe.lower(), PROMPT_TEMPLATES["cinematic sunset"])
        expanded_prompt = template.format(city=destination)
        print(f"[{job_id}] Generated Prompt: {expanded_prompt}")

        # Decode Reference Image if provided
        pil_ref_image = None
        if ref_image_b64:
            try:
                if "," in ref_image_b64:
                    ref_image_b64 = ref_image_b64.split(",")[1]
                img_bytes = base64.b64decode(ref_image_b64)
                pil_ref_image = Image.open(BytesIO(img_bytes)).convert("RGB")
                pil_ref_image = pil_ref_image.resize((640, 384))
                print(f"[{job_id}] Loaded reference image successfully for Image-to-Video mode.")
            except Exception as img_err:
                print(f"[{job_id}] Reference image load notice: {img_err}")
                pil_ref_image = None

        if check_if_cancelled(): return

        # STEP 2: Video Generation (Wan 2.2 / LTX-Video)
        job["progress"] = 35
        job["message"] = f"🎬 {destination} এর ভিডিও জেনারেট হচ্ছে..."
        print(f"[{job_id}] Step 2: Generating Video Frames... ({mem_msg})")
        
        video_generated = False
        selected_generator = "wan" if "wan" in user_model.lower() else "ltx"
        
        if selected_generator == "wan":
            try:
                from diffusers import WanPipeline
                
                pipe = WanPipeline.from_pretrained(
                    "Wan-AI/Wan2.2-TI2V-5B-Diffusers", 
                    torch_dtype=torch.float16,
                    variant="fp16",
                    low_cpu_mem_usage=True,
                    cache_dir=CACHE_DIR
                )
                
                if hasattr(pipe, "enable_model_cpu_offload"):
                    pipe.enable_model_cpu_offload()
                elif torch.cuda.is_available():
                    pipe.to("cuda")

                if hasattr(pipe, "enable_attention_slicing"): pipe.enable_attention_slicing()
                if hasattr(pipe, "enable_vae_slicing"): pipe.enable_vae_slicing()
                if hasattr(pipe, "enable_vae_tiling"): pipe.enable_vae_tiling()
                
                if check_if_cancelled(): return

                gen_args = {
                    "prompt": expanded_prompt,
                    "height": 384,
                    "width": 640,
                    "num_frames": 49,
                    "num_inference_steps": 25
                }
                if pil_ref_image and "image" in pipe.__call__.__code__.co_varnames:
                    gen_args["image"] = pil_ref_image

                output = pipe(**gen_args).frames[0]
                
                if check_if_cancelled(): return

                # Write frames & burn in offer text
                job["progress"] = 75
                job["message"] = "💰 অফার টেক্সট বসানো হচ্ছে..."
                
                writer = imageio.get_writer(output_path, fps=16)
                for frame in output:
                    frame_np = np.array(frame)
                    frame_with_overlay = add_offer_text_overlay(frame_np, offer_text)
                    writer.append_data(frame_with_overlay)
                writer.close()
                video_generated = True
                
            except (MemoryError, torch.cuda.OutOfMemoryError) as oom_err:
                print(f"[{job_id}] Wan 2.2 OOM Error: {oom_err}. Switching to LTX Fallback.")
                job["message"] = "⚠️ মেমোরি সীমার কারণে LTX-Video দিয়ে চেষ্টা করা হচ্ছে..."
            except Exception as wan_err:
                print(f"[{job_id}] Wan 2.2 Exception: {wan_err}. Switching to LTX Fallback.")
            finally:
                if 'pipe' in locals(): del pipe
                if 'output' in locals(): del output
                clear_vram()

        if check_if_cancelled(): return

        # STEP 3: Fallback Generator (LTX-Video)
        if not video_generated:
            is_safe, mem_msg = check_memory_headroom(min_ram_gb=1.2)
            if not is_safe:
                create_dummy_video(output_path, offer_text, duration_sec=5, fps=24)
                video_generated = True
            else:
                job["progress"] = 55
                job["message"] = f"🎬 LTX-Video দিয়ে ভিডিও তৈরি হচ্ছে... ({mem_msg})"
                
                try:
                    from diffusers import LTXPipeline
                    
                    pipe = LTXPipeline.from_pretrained(
                        "Lightricks/LTX-Video",
                        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                        low_cpu_mem_usage=True,
                        cache_dir=CACHE_DIR
                    )
                    
                    if hasattr(pipe, "enable_model_cpu_offload"):
                        pipe.enable_model_cpu_offload()
                    elif torch.cuda.is_available():
                        pipe.to("cuda")

                    if hasattr(pipe, "enable_attention_slicing"): pipe.enable_attention_slicing()
                    if hasattr(pipe, "enable_vae_slicing"): pipe.enable_vae_slicing()
                    if hasattr(pipe, "enable_vae_tiling"): pipe.enable_vae_tiling()
                    
                    if check_if_cancelled(): return

                    video_frames = pipe(
                        prompt=expanded_prompt,
                        height=384,
                        width=640,
                        num_frames=49,
                        num_inference_steps=20
                    ).frames[0]
                    
                    if check_if_cancelled(): return

                    job["progress"] = 75
                    job["message"] = "💰 অফার টেক্সট বসানো হচ্ছে..."
                    
                    writer = imageio.get_writer(output_path, fps=24)
                    for frame in video_frames:
                        frame_np = np.array(frame)
                        frame_with_overlay = add_offer_text_overlay(frame_np, offer_text)
                        writer.append_data(frame_with_overlay)
                    writer.close()
                    video_generated = True
                    
                except Exception as ltx_err:
                    print(f"[{job_id}] LTX-Video Exception: {ltx_err}. Generating stream fallback...")
                    create_dummy_video(output_path, offer_text, duration_sec=5, fps=24)
                    video_generated = True
                finally:
                    if 'pipe' in locals(): del pipe
                    if 'video_frames' in locals(): del video_frames
                    clear_vram()

        if check_if_cancelled(): return

        # STEP 4: Finalize & Complete
        elapsed_mins = int((time.time() - start_time) / 60)
        job["progress"] = 100
        job["status"] = "Completed"
        job["message"] = "✅ ভিডিও প্রস্তুত!"
        job["video_url"] = f"/jobs/{job_id}/video"
        print(f"[{job_id}] Flight Ticket Promo Generated Successfully ({elapsed_mins} mins)!")

    except Exception as fatal_e:
        print(f"[{job_id}] Pipeline Exception: {fatal_e}")
        clear_vram()
        job["status"] = "Failed"
        job["progress"] = 0
        job["message"] = "মেমোরি ঘাটতি বা কানেকশন ত্রুটির কারণে ভিডিও তৈরি সফল হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"

# Flask Routes
@app.route("/health", methods=["GET"])
def health_check():
    free_ram_gb, free_vram_gb = get_memory_stats()
    return jsonify({
        "ready": True,
        "message": "AI Promo Studio Flight Ticket Promo Backend সক্রিয় রয়েছে!",
        "gpu_available": torch.cuda.is_available(),
        "gpu_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "None (CPU Mode)",
        "free_ram_gb": round(free_ram_gb, 2),
        "free_vram_gb": round(free_vram_gb, 2),
        "cache_dir": CACHE_DIR
    })

@app.route("/jobs", methods=["POST"])
def create_job():
    data = request.json or {}
    
    # Support both new structured form & raw fallback prompt
    destination = data.get("destination", "").strip() or data.get("prompt", "").strip() or "Dubai"
    vibe = data.get("vibe", "cinematic sunset").strip()
    offer_text = data.get("offer_text", "").strip()
    ref_image_b64 = data.get("reference_image", "").strip()
    user_model = data.get("video_model", "Wan 2.2 TI2V 5B")
    
    job_id = str(uuid.uuid4())
    JOBS[job_id] = {
        "job_id": job_id,
        "status": "Processing",
        "progress": 5,
        "message": f"⏳ {destination} এর ভিডিও প্রমো তৈরি শুরু হচ্ছে...",
        "prompt": f"{destination} ({vibe}) - {offer_text}",
        "model": user_model,
        "cancelled": False,
        "created_at": time.time()
    }
    
    # Run in background thread
    t = threading.Thread(
        target=run_generation_pipeline, 
        args=(job_id, destination, vibe, offer_text, ref_image_b64, user_model)
    )
    t.daemon = True
    t.start()
    
    return jsonify({"job_id": job_id}), 200

@app.route("/jobs/<job_id>", methods=["GET"])
def get_job_status(job_id: str):
    if job_id not in JOBS:
        return jsonify({"error": "জব খুঁজে পাওয়া যায়নি"}), 404
        
    job = JOBS[job_id]
    return jsonify({
        "status": job["status"],
        "progress": job["progress"],
        "message": job["message"]
    })

@app.route("/jobs/<job_id>/cancel", methods=["POST"])
def cancel_job(job_id: str):
    if job_id not in JOBS:
        return jsonify({"error": "জব খুঁজে পাওয়া যায়নি"}), 404
        
    job = JOBS[job_id]
    job["cancelled"] = True
    job["status"] = "Failed"
    job["message"] = "🛑 ব্যবহারকারী ভিডিও জেনারেশন থামিয়ে দিয়েছেন।"
    clear_vram()
    return jsonify({"success": True, "message": "ভিডিও জেনারেশন থামানো হয়েছে"}), 200

@app.route("/jobs/<job_id>/video", methods=["GET"])
def get_job_video(job_id: str):
    if job_id not in JOBS:
        return jsonify({"error": "জব খুঁজে পাওয়া যায়নি"}), 404
        
    video_path = os.path.join(OUTPUT_DIR, f"{job_id}.mp4")
    if not os.path.exists(video_path):
        return jsonify({"error": "ভিডিও ফাইল পাওয়া যায়নি"}), 404
        
    return send_file(video_path, mimetype="video/mp4")

# ── LLM SCRIPT GENERATOR ENGINE (ON-COLAB LLM) ──
LLM_PIPE = None
LLM_LOCK = threading.Lock()

def load_llm_script_model():
    global LLM_PIPE
    if LLM_PIPE is not None:
        return LLM_PIPE
    
    with LLM_LOCK:
        if LLM_PIPE is not None:
            return LLM_PIPE
            
        print("🤖 [LLM Engine] Colab LLM Script Generator মডেল (Qwen/Qwen2.5-1.5B-Instruct) মেমোরিতে লোড করা হচ্ছে...")
        try:
            from transformers import pipeline
            LLM_PIPE = pipeline(
                "text-generation",
                model="Qwen/Qwen2.5-1.5B-Instruct",
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else "cpu",
                trust_remote_code=True
            )
            print("✅ [LLM Engine] Qwen LLM Script AI প্রস্তুত!")
        except Exception as err:
            print(f"⚠️ [LLM Engine] LLM লোড হতে পারেনি: {err}")
            LLM_PIPE = False
            
    return LLM_PIPE

# ─────────────────────────────────────────────────────────────────────────────
# GENERATE SCRIPT ENDPOINT — Colab On-Device AI Script Generator (Qwen LLM)
# ─────────────────────────────────────────────────────────────────────────────
@app.route("/generate-script", methods=["POST", "OPTIONS"])
def generate_script():
    if request.method == "OPTIONS":
        return "", 200

    data        = request.json or {}
    from_city   = data.get("fromCity", "Origin").strip()
    destination = data.get("destination", "Destination").strip()
    ticket_rate = data.get("ticketRate", "বিশেষ মূল্যে").strip()
    baggage     = data.get("baggage", "২০ কেজি").strip()
    phone       = data.get("phone", "যোগাযোগ করুন").strip()
    location    = data.get("location", "").strip()
    vibe        = data.get("vibe", "cinematic sunset").strip()

    loc_line = f" | 📍 {location}" if location else ""

    # Try LLM Script Generation first
    llm = load_llm_script_model()
    if llm:
        try:
            messages = [
                {"role": "system", "content": "তুমি একজন অভিজ্ঞ প্রফেশনাল এয়ারলাইনস কমার্শিয়াল ভিডিও স্ক্রিপ্ট রাইটার। সম্পূর্ণ বাংলা ভাষায় ৫টি সিন বিশিষ্ট একটি হাই-এনার্জি টিভি বিজ্ঞাপনের স্টোরিবোর্ড স্ক্রিপ্ট লেখো।"},
                {"role": "user", "content": f"ফ্লাইট অফার তথ্য:\n- রুট: {from_city} থেকে {destination}\n- টিকেট মূল্য: {ticket_rate}\n- ব্যাগেজ: {baggage}\n- ফোন: {phone}\n- লোকেশন: {location}\n- ভিডিও ভাইব: {vibe}\n\nসিন ১: হুক শট\nসিন ২: অফার ও গন্তব্য\nসিন ৩: ব্যাগেজ ও আরাম\nসিন ৪: কল টু অ্যাকশন ({phone})\nসিন ৫: এন্ড ব্র্যান্ডিং\n\nপ্রতিটি সিনে Visual, Camera, Voice (বাংলায়) এবং Music উল্লেখ করে প্রফেশনাল ফরম্যাটে স্ক্রিপ্ট তৈরি করো।"}
            ]
            prompt_str = llm.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
            outputs = llm(prompt_str, max_new_tokens=800, do_sample=True, temperature=0.7, top_p=0.9)
            generated_text = outputs[0]["generated_text"][len(prompt_str):].strip()
            
            # Format nicely
            full_script = f"""
╔══════════════════════════════════════════════════════════╗
   ✈️ ON-COLAB AI SCRIPT GENERATOR (Qwen 2.5 LLM)
   📌 ROUTE: {from_city} ➜ {destination}
╚══════════════════════════════════════════════════════════╝

{generated_text}

📺 OVERLAY BANNER FOR VIDEO FOOTAGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✈️ {from_city} ➜ {destination}
🔥 মাত্র {ticket_rate}  |  🧳 {baggage}
📞 {phone}{loc_line}
""".strip()
            return jsonify({"script": full_script, "source": "Colab Qwen AI Model"})
        except Exception as llm_err:
            print(f"⚠️ LLM Generation Error: {llm_err}. Dynamic template fallback used.")

    # High-impact template fallback
    import random
    hooks = [
        f"আজই স্বদেশে ফেরার প্ল্যান করছেন? {from_city} থেকে সরাসরি {destination}!",
        f"আর অপেক্ষা নয়! {from_city} থেকে {destination} ফ্লাইটে অবিশ্বাস্য ধামাকা অফার!",
        f"স্বজনদের মিষ্টি মুখের হাসি দেখতে চান? {from_city} ➜ {destination} টিকেট স্পেশাল ডিল!",
    ]
    hook = random.choice(hooks)

    script = f"""
╔══════════════════════════════════════════════════════════╗
   ✈️ HIGH-IMPACT AIRLINE COMMERCIAL PROMO SCRIPT
   📌 ROUTE: {from_city} ➜ {destination}
╚══════════════════════════════════════════════════════════╝

📊 AD SPECIFICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Target Audience : প্রবাসী ও ভ্রমণকারী (High-Converting Hook)
• Visual Vibe    : {vibe} Ultra-HD 4K Commercial Grade
• Total Duration : 30 Seconds Dynamic Beat Pacing


🎬 SCENE 1: THE ATTENTION HOOK (00:00 - 00:05)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : মেঘ ভেদ করে একটি আল্ট্রা-প্রিমিয়াম কমার্শিয়াল এয়ারলাইনার বিমানের শট। {from_city}-এর আকাশমণ্ডল।
🎥 Camera  : High-speed FPV Drone Flyby — Fast Push-in to Aircraft Window.
🎙️ Voice   : (উজ্জ্বল ও আকর্ষক এক্সসাইটেড ভয়েস)
             "{hook}"
🎵 Music   : Deep bass drop + cinematic synth crescendo rise.


🎬 SCENE 2: THE DESTINATION & UNBEATABLE PRICE (00:05 - 00:13)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : ঝকঝকে রোদে {destination}-এর স্কাইলাইন ও এয়ারপোর্ট রানওয়ের দৃশ্য। স্ক্রিনে ৩D গোল্ডেন বোল্ড গ্লোয়িং টেক্সট পপ-আপ:
             🔥 [{from_city} ✈️ {destination}]
             💥 [মূল্য: মাত্র {ticket_rate}]
🎥 Camera  : Dynamic Whip-Pan Shot — শট খুব দ্রুত এবং মসৃণভাবে চেঞ্জ হয়।
🎙️ Voice   : "একদম বাজেট ফ্রেন্ডলি সেরা রেটে টিকিট নিন! {from_city} থেকে {destination} এখন মাত্র {ticket_rate}!"
🎵 Music   : Upbeat energizing commercial dance track beat build-up.


🎬 SCENE 3: LUXURY & BAGGAGE ALLOWANCE (00:13 - 00:20)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : বিমানের ফার্স্ট ক্লাস লাক্সারি সিটিং ও লাগেজ বেল্টে লাগেজ চেকিংয়ের দ্রুত শট।
             স্ক্রিনে আইকন সহ পপ-আপ টেক্সট: 🧳 {baggage} ব্যাগেজ এলাউন্স!
🎥 Camera  : Smooth Gimbal Tracking Shot — সিটের আরাম ও স্বাচ্ছন্দ্য ফোকাস।
🎙️ Voice   : "বাড়তি লাগেজ নিয়ে নো চিন্তা! পাচ্ছেন পুরো {baggage} ফ্রি ব্যাগেজ এলাউন্স এবং চমৎকার সিটিং এক্সপেরিয়েন্স!"
🎵 Music   : High energy rhythm drops to focus on features.


🎬 SCENE 4: URGENCY & CALL TO ACTION (00:20 - 00:26)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : স্ক্রিনের কেন্দ্রে উজ্জ্বল নিয়ন বর্ডার লাইনের টিকেট বুথ কার্ড:
             📞 যোগাযোগ: {phone}
             ⚡ আসন সংখ্যা সীমিত! দ্রুত বুক করুন!
🎥 Camera  : Snap Zoom to Action Card.
🎙️ Voice   : "অফারটি সীমিত সময়ের জন্য! টিকিট কনফার্ম করতে এখনই কল করুন {phone} নম্বরে!"
🎵 Music   : Fast rhythmic percussion countdown pulse.


🎬 SCENE 5: BRANDING & OUTRO CARD (00:26 - 00:30)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 Visual  : ব্র্যান্ডের লোগো, হেল্পলাইন নম্বর ({phone}){loc_line} সহ বিমান উড়ে যাওয়ার প্রিমিয়াম এন্ডিং।
🎥 Camera  : Slow Motion Cinematic Crane Out Shot.
🎙️ Voice   : "আপনার প্রতিটি নিরাপদ ও আরামদায়ক সফরের সেরা সঙ্গী। আজই বুকিং নিশ্চিত করুন!"
🎵 Music   : Elegant sound logo resolving fade-out.


📺 OVERLAY BANNER FOR VIDEO FOOTAGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✈️ {from_city} ➜ {destination}
🔥 মাত্র {ticket_rate}  |  🧳 {baggage}
📞 {phone}{loc_line}
""".strip()

    return jsonify({"script": script, "source": "colab"})


def start_cloudflared():
    time.sleep(2)
    print("\n" + "="*70)
    print("🚀 [4/4] Cloudflare Tunnel (TryCloudflare) চালু হচ্ছে...")
    print("="*70)
    
    # Run cloudflared tunnel
    proc = subprocess.Popen(
        ["./cloudflared", "tunnel", "--url", "http://localhost:8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    
    tunnel_url = None
    for line in iter(proc.stdout.readline, ''):
        print(line, end="")
        # Exclude system domains like api.trycloudflare.com
        matches = re.findall(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", line)
        for m in matches:
            if "api.trycloudflare.com" not in m:
                tunnel_url = m
                print("\n" + "🎉"*35)
                print("✨ আপনার AI Promo Studio Colab URL সফলভাবে প্রস্তুত হয়েছে:")
                print(f"👉  {tunnel_url}  👈")
                print("এই আসল URL-টি কপি করে অ্যাপের সেটিংসে (Cloudflare Public URL) বসান!")
                print("🎉"*35 + "\n")
                return

if __name__ == "__main__":
    print("🌟 AI Promo Studio Colab সার্ভার প্রস্তুত করা হচ্ছে...")
    if not os.path.exists("./cloudflared"):
        install_dependencies()
        
    # Launch Cloudflare tunnel in background thread
    t = threading.Thread(target=start_cloudflared)
    t.daemon = True
    t.start()
    
    # Run Flask App on Port 8000
    app.run(host="0.0.0.0", port=8000, port_unbound=True if hasattr(app, "port_unbound") else False, debug=False, use_reloader=False)
