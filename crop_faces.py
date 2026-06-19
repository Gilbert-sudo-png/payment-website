import cv2
import os

input_folder = r"c:\Users\Gilbert\Documents\code files\payment website\paystack-frontend\public\candidates"
output_folder = r"c:\Users\Gilbert\Documents\code files\payment website\paystack-frontend\public\candidates"

# Load OpenCV's built-in face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

files = [f for f in os.listdir(input_folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

for filename in files:
    path = os.path.join(input_folder, filename)
    img = cv2.imread(path)
    if img is None:
        print(f"  SKIP (could not read): {filename}")
        continue

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h, w = img.shape[:2]

    # Try different scale factors if no face found at first
    faces = []
    for scale in [1.05, 1.1, 1.2, 1.3]:
        faces = face_cascade.detectMultiScale(gray, scaleFactor=scale, minNeighbors=4, minSize=(40, 40))
        if len(faces) > 0:
            break

    if len(faces) == 0:
        # Fallback: crop top-center (upper 45% of image, centered)
        print(f"  No face found, using top-center crop: {filename}")
        crop_h = int(h * 0.45)
        margin_x = int(w * 0.1)
        cropped = img[0:crop_h, margin_x:w - margin_x]
    else:
        # Pick the largest face
        x, y, fw, fh = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
        
        # Add generous padding around the face
        pad_x = int(fw * 0.6)
        pad_top = int(fh * 0.8)   # more space above for forehead/hair
        pad_bottom = int(fh * 0.4)

        x1 = max(0, x - pad_x)
        y1 = max(0, y - pad_top)
        x2 = min(w, x + fw + pad_x)
        y2 = min(h, y + fh + pad_bottom)

        cropped = img[y1:y2, x1:x2]
        print(f"  Face found and cropped: {filename}")

    # Save to same filename (overwrite)
    out_path = os.path.join(output_folder, filename)
    cv2.imwrite(out_path, cropped)

print("\nDone! All images processed.")
