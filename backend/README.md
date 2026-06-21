# Backend API Server Setup Guide

## Overview
This Flask server provides a REST API for classifying chest X-ray images using a pre-trained VGG16 deep learning model.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Verify Model Location
The model should be at:
```
../Pulmonary_Disease_Detection/notebooks/models/best_vgg16_model.h5
```

If your model is elsewhere, update the `MODEL_PATH` variable in `app.py`.

### 3. Run the Server
```bash
python app.py
```

You'll see:
```
* Running on http://0.0.0.0:5000
* Press CTRL+C to quit
```

## API Endpoints

### 1. Health Check
**GET** `/api/health`

Check if the model is loaded and get available classes.

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "classes": ["COVID-19", "NORMAL", "PNEUMONIA", "TUBERCULOSIS"]
}
```

### 2. Make Prediction
**POST** `/api/predict`

Upload an image and get disease prediction.

```bash
curl -X POST -F "image=@path/to/xray.jpg" http://localhost:5000/api/predict
```

Response:
```json
{
  "predicted_class": "PNEUMONIA",
  "confidence": 0.92,
  "probabilities": {
    "COVID-19": 0.05,
    "NORMAL": 0.02,
    "PNEUMONIA": 0.92,
    "TUBERCULOSIS": 0.01
  },
  "success": true
}
```

### 3. Get Available Classes
**GET** `/api/classes`

Get list of all disease classes the model can predict.

```bash
curl http://localhost:5000/api/classes
```

Response:
```json
{
  "classes": ["COVID-19", "NORMAL", "PNEUMONIA", "TUBERCULOSIS"]
}
```

## Configuration

### Model Path
Edit the `MODEL_PATH` in `app.py`:
```python
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'your_path', 'best_vgg16_model.h5')
```

### Server Port
Default: 5000. Change by editing the last line:
```python
app.run(debug=True, host='0.0.0.0', port=8000)  # Change 5000 to desired port
```

### Image Size
VGG16 expects 224×224 images. The preprocessing automatically handles resizing. To change target size, edit:
```python
def preprocess_image(img_array, target_size=(224, 224)):
```

## Image Preprocessing

The API automatically:
1. Loads the uploaded image
2. Converts to RGB if needed (handles grayscale)
3. Resizes to 224×224 pixels
4. Normalizes pixel values to [0, 1]
5. Adds batch dimension for model input

## Error Handling

The API returns meaningful error messages:

- **400 Bad Request**: No image file provided
- **404 Not Found**: Image field not in request
- **500 Internal Server Error**: Model not loaded or prediction failed

Example error response:
```json
{
  "error": "Model not loaded"
}
```

## Testing the API

### Using cURL
```bash
# Test health
curl http://localhost:5000/api/health

# Make prediction
curl -X POST -F "image=@xray.jpg" http://localhost:5000/api/predict

# Get classes
curl http://localhost:5000/api/classes
```

### Using Python
```python
import requests

url = 'http://localhost:5000/api/predict'
with open('xray.jpg', 'rb') as f:
    files = {'image': f}
    response = requests.post(url, files=files)
    print(response.json())
```

### Using JavaScript/Fetch
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:5000/api/predict', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

## Performance Notes

- **Inference time**: ~1-2 seconds per image (depending on hardware)
- **GPU support**: If TensorFlow is GPU-enabled, model will use it automatically
- **Concurrency**: Flask development server is single-threaded. Use Gunicorn for production.

## Production Deployment

### With Gunicorn
```bash
pip install gunicorn
gunicorn --workers 4 --threads 2 --worker-class gthread --bind 0.0.0.0:5000 app:app
```

### Environment Variables
```bash
export FLASK_ENV=production
export FLASK_DEBUG=0
python app.py
```

## Troubleshooting

### ModuleNotFoundError
```
Ensure all dependencies are installed:
pip install -r requirements.txt
```

### Model not loading
```
1. Verify model file exists
2. Check file path in app.py
3. Ensure TensorFlow version compatibility
```

### CORS errors
```
Flask-CORS is already configured.
If issues persist, ensure frontend is accessing correct URL.
```

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## Dependencies

- **Flask 2.3.0**: Web framework
- **Flask-CORS 4.0.0**: Cross-origin resource sharing
- **TensorFlow >= 2.10**: Deep learning framework
- **NumPy**: Numerical computing
- **Pillow**: Image processing

See `requirements.txt` for exact versions.

---

**Created**: April 2026
**Model**: VGG16 (ImageNet weights)
**Framework**: TensorFlow 2.10+
