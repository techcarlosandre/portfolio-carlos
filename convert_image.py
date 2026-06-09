#!/usr/bin/env python3
from PIL import Image
import os

# Caminho da imagem
public_dir = r'c:\Users\Carlos\Desktop\Projetos\portfolio-carlos-main\public'
png_path = os.path.join(public_dir, 'eu.png')
webp_path = os.path.join(public_dir, 'eu.webp')

# Converter PNG para WEBP
img = Image.open(png_path)
img.save(webp_path, 'WEBP', quality=90)

# Estatísticas
png_size = os.path.getsize(png_path)
webp_size = os.path.getsize(webp_path)
reduction = ((png_size - webp_size) / png_size * 100)

print("✓ Conversão bem-sucedida!")
print(f"PNG:  {png_size:,} bytes")
print(f"WEBP: {webp_size:,} bytes")
print(f"Redução: {reduction:.1f}%")
