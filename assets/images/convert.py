from PIL import Image
import os

def convert_to_webp(input_path, output_path=None, quality=100):
    """
    Mengonversi gambar ke format WebP dengan kualitas tinggi.

    Args:
        input_path (str): Path gambar yang ingin dikonversi.
        output_path (str, optional): Path untuk menyimpan gambar WebP. Default: None (sama dengan input).
        quality (int): Kualitas gambar WebP (0-100). Default: 100 (tanpa kehilangan kualitas).
    """
    if not output_path:
        output_path = os.path.splitext(input_path)[0] + ".webp"

    with Image.open(input_path) as img:
        img.save(output_path, "WEBP", quality=quality, optimize=True)
        print(f"✔️ {input_path} berhasil dikonversi ke {output_path}")

def batch_convert(folder_path, quality=100):
    """
    Mengonversi semua gambar dalam folder ke WebP.

    Args:
        folder_path (str): Path folder yang berisi gambar.
        quality (int): Kualitas gambar WebP (0-100).
    """
    if not os.path.exists(folder_path):
        print("❌ Folder tidak ditemukan!")
        return

    for file_name in os.listdir(folder_path):
        input_file = os.path.join(folder_path, file_name)
        if os.path.isfile(input_file) and file_name.lower().endswith(("jpg", "jpeg", "png")):
            convert_to_webp(input_file, quality=quality)

# Contoh penggunaan:
# 1. Konversi satu gambar
# convert_to_webp("gambar.jpg")

# 2. Konversi semua gambar di folder
batch_convert("/mnt/c/Users/ThinkPad/Documents/underline/assets/images")

