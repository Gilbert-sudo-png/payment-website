import os
from rembg import remove
from PIL import Image

input_folder = r"c:\Users\Gilbert\Documents\code files\payment website\paystack-frontend\assests\exectives"
output_folder = r"c:\Users\Gilbert\Documents\code files\payment website\paystack-frontend\public\assets\executives"

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

for filename in os.listdir(input_folder):
    if filename.lower().endswith('.png') or filename.lower().endswith('.jpg') or filename.lower().endswith('.jpeg'):
        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, os.path.splitext(filename)[0] + '.png')
        
        try:
            print(f"Processing {filename}...")
            input_image = Image.open(input_path)
            output_image = remove(input_image)
            output_image.save(output_path, "PNG")
            print(f"Saved {output_path}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
