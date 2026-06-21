from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import os
import json
import uuid
import base64
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'Pulmonary_Disease_Detection', 'notebooks', 'models', 'best_vgg16_model.h5')
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Class labels
CLASS_NAMES = ['COVID-19', 'NORMAL', 'PNEUMONIA', 'TUBERCULOSIS']

# History storage
HISTORY_FILE = os.path.join(os.path.dirname(__file__), '..', 'history.json')
MAX_HISTORY = 30

def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, 'r') as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_history(history):
    with open(HISTORY_FILE, 'w') as f:
        json.dump(history, f)

def preprocess_image(img_array, target_size=(224, 224)):
    """Preprocess image for VGG16 model"""
    # Resize
    img = image.smart_resize(img_array, target_size)
    # Normalize to [0, 1]
    img = img / 255.0
    # Add batch dimension
    img = np.expand_dims(img, axis=0)
    return img

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'classes': CLASS_NAMES
    })

def validate_is_xray(image_bytes):
    """Validate if the uploaded image is likely a chest X-ray using PIL + numpy only"""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        w, h = img.size

        if h < 100 or w < 100:
            return False, "Image too small for analysis."

        # Convert to RGB
        if img.mode != 'RGB':
            img_rgb = img.convert('RGB')
        else:
            img_rgb = img

        arr = np.array(img_rgb, dtype=np.float32)
        r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]

        # Color variance: how different are the channels from each other
        # X-rays are grayscale => R ≈ G ≈ B
        diff_rg = np.abs(r - g)
        diff_rb = np.abs(r - b)
        diff_gb = np.abs(g - b)
        color_var = float(np.mean((diff_rg + diff_rb + diff_gb) / 3.0))

        # Grayscale conversion
        gray = 0.299 * r + 0.587 * g + 0.114 * b
        mean_intensity = float(np.mean(gray))
        std_intensity = float(np.std(gray))

        # Edge density via simple gradient approximation
        gy = np.abs(np.diff(gray, axis=0))
        gx = np.abs(np.diff(gray, axis=1))
        edge_strength = float((np.mean(gy) + np.mean(gx)) / 2.0)

        aspect_ratio = w / h
        is_grayscale = color_var < 10

        # Scoring system
        score = 0.0
        if color_var < 8:
            score += 0.45
        elif color_var < 15:
            score += 0.15

        if is_grayscale:
            score += 0.15

        if 20 < mean_intensity < 200:
            score += 0.15

        if std_intensity > 20:
            score += 0.1

        if edge_strength > 3:
            score += 0.1

        if 0.5 < aspect_ratio < 1.8:
            score += 0.15

        is_valid = score >= 0.55
        if not is_valid:
            if color_var >= 15:
                reason = "This image appears to be a color photograph, not a medical X-ray."
            else:
                reason = "Image characteristics do not match expected X-ray patterns."
        else:
            reason = "Valid chest X-ray image."

        return is_valid, reason
    except Exception as e:
        return False, f"Validation error: {str(e)}"


@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict disease class from uploaded image"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        image_bytes = file.read()

        # Step 1: Validate image is a chest X-ray
        is_valid, validation_msg = validate_is_xray(image_bytes)
        if not is_valid:
            return jsonify({
                'error': 'Invalid image',
                'validation_error': True,
                'message': validation_msg,
                'details': 'Please upload a valid chest X-ray image. The AI model is trained exclusively on pulmonary X-ray images.'
            }), 400

        # Step 2: Process with PIL
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode != 'RGB':
            img = img.convert('RGB')

        img_array = np.array(img)
        processed_img = preprocess_image(img_array)

        # Step 3: Predict
        predictions = model.predict(processed_img, verbose=0)
        pred_probabilities = predictions[0]

        pred_class_idx = np.argmax(pred_probabilities)
        pred_class_name = CLASS_NAMES[pred_class_idx]
        pred_confidence = float(pred_probabilities[pred_class_idx])

        response = {
            'predicted_class': pred_class_name,
            'confidence': pred_confidence,
            'probabilities': {
                class_name: float(prob)
                for class_name, prob in zip(CLASS_NAMES, pred_probabilities)
            },
            'success': True,
            'xray_validated': True
        }

        # Save to history
        try:
            img_b64 = base64.b64encode(image_bytes).decode('utf-8')
            entry = {
                'id': str(uuid.uuid4()),
                'timestamp': datetime.now().isoformat(),
                'filename': file.filename,
                'image_b64': img_b64,
                'predicted_class': pred_class_name,
                'confidence': pred_confidence,
                'probabilities': {
                    cn: float(p) for cn, p in zip(CLASS_NAMES, pred_probabilities)
                }
            }
            history = load_history()
            history.insert(0, entry)
            history = history[:MAX_HISTORY]
            save_history(history)
        except Exception:
            pass

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/api/classes', methods=['GET'])
def get_classes():
    """Get available disease classes"""
    return jsonify({'classes': CLASS_NAMES})

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get analysis history"""
    history = load_history()
    return jsonify({'history': history, 'count': len(history)})

@app.route('/api/history/<entry_id>', methods=['DELETE'])
def delete_history_entry(entry_id):
    """Delete a history entry"""
    history = load_history()
    history = [e for e in history if e['id'] != entry_id]
    save_history(history)
    return jsonify({'success': True, 'count': len(history)})

@app.route('/api/history', methods=['DELETE'])
def clear_history():
    """Clear all history"""
    save_history([])
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
