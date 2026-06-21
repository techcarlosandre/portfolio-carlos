import os
import subprocess

ffmpeg_path = r"C:\Users\Carlos\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"
public_dir = r"c:\Users\Carlos\Desktop\Projetos\portfolio-carlos-main\public"

videos = [
    r"barber\barber-app.mp4",
    r"barber\barber.mp4",
    r"fitgym\fitgym-app.mp4",
    r"fitgym\fitgym.mp4",
    r"horizonte\horizonte-app.mp4",
    r"horizonte\horizonte.mp4",
    r"sushi\sushi-app.mp4",
    r"sushi\sushi.mp4",
    r"vitamed\vitamed-app.mp4",
    r"vitamed\vitamed.mp4",
    r"projetos\automacao-ig.mp4",
    r"projetos\automacao-wpp.mp4"
]

print("Starting safe video optimization...")

for v in videos:
    input_path = os.path.join(public_dir, v)
    if not os.path.exists(input_path):
        # Maybe it's already optimized or input file differs
        print(f"File not found: {input_path}")
        continue
        
    base, ext = os.path.splitext(input_path)
    output_webm = base + ".webm"
    output_opt_mp4 = base + "_opt.mp4"
    
    print(f"\nOptimizing: {v}")
    
    # 1. Convert to WebM (VP9, no audio)
    if not os.path.exists(output_webm):
        print(f"-> Generating WebM: {os.path.basename(output_webm)}")
        webm_cmd = [
            ffmpeg_path, "-y", "-i", input_path,
            "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "0",
            "-an", "-deadline", "realtime", "-cpu-used", "8", "-row-mt", "1",
            output_webm
        ]
        subprocess.run(webm_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    else:
        print(f"-> WebM already exists: {os.path.basename(output_webm)}")

    # 2. Convert to optimized MP4 (H.264, no audio)
    if not os.path.exists(output_opt_mp4):
        print(f"-> Compressing MP4: {os.path.basename(output_opt_mp4)}")
        mp4_cmd = [
            ffmpeg_path, "-y", "-i", input_path,
            "-c:v", "libx264", "-crf", "30", "-preset", "faster",
            "-an", output_opt_mp4
        ]
        subprocess.run(mp4_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    else:
        print(f"-> Optimized MP4 already exists: {os.path.basename(output_opt_mp4)}")
        
    orig_size = os.path.getsize(input_path) / (1024 * 1024)
    webm_size = os.path.getsize(output_webm) / (1024 * 1024)
    opt_mp4_size = os.path.getsize(output_opt_mp4) / (1024 * 1024)
    print(f"Done: Original ({orig_size:.2f} MB) | Optimized MP4 ({opt_mp4_size:.2f} MB) | WebM ({webm_size:.2f} MB)")

print("\nAll videos optimized safely!")
