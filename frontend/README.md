# Chest X-Ray Disease Classification Interface

A modern, full-stack web application for classifying chest X-ray images into four disease categories using a pre-trained VGG16 deep learning model.

## 🎯 Features

- **Image Upload**: Drag-and-drop or click to upload chest X-ray images
- **Real-time Prediction**: Instant AI-powered disease classification
- **Confidence Scores**: View confidence percentages for all four disease classes
- **Visual Analytics**: Interactive bar chart showing probability distribution
- **Detailed Results**: Comprehensive breakdown of prediction scores
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful gradient interface with smooth animations

## 📊 Disease Classes

The model classifies X-rays into four categories:
- **COVID-19** 🦠
- **PNEUMONIA** 🫁
- **TUBERCULOSIS** ⚠️
- **NORMAL** ✅

## 🏗️ Architecture

### Backend (Python Flask)
- RESTful API endpoints for image prediction
- TensorFlow/Keras model inference
- CORS support for frontend communication
- Image preprocessing and normalization

### Frontend (React)
- Modern React 18 components
- Axios for API communication
- Recharts for data visualization
- Responsive CSS with gradient design
- Real-time loading states and error handling

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 14+** and npm
- **Pre-trained model**: `best_vgg16_model.h5` (required in `Pulmonary_Disease_Detection/notebooks/models/`)

## 🚀 Installation & Setup

### Step 1: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Verify the model path:
   - Ensure `Pulmonary_Disease_Detection/notebooks/models/best_vgg16_model.h5` exists
   - If path is different, update the `MODEL_PATH` in `app.py`

4. Start the Flask server:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Step 2: Frontend Setup

1. In a new terminal, navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will automatically open at `http://localhost:3000`

## 🎮 Usage

1. **Upload an Image**:
   - Drag and drop a chest X-ray image onto the upload area
   - Or click to select an image from your file system
   - Supported formats: JPG, PNG, GIF, WEBP

2. **View Results**:
   - See the predicted disease class with emoji indicator
   - View confidence percentage for the prediction
   - Check the interactive bar chart for all class probabilities
   - Review detailed scores for each disease category

3. **Classify Another Image**:
   - Click "Classify Another Image" to upload and analyze a new X-ray

## 📡 API Endpoints

### Backend API (`http://localhost:5000`)

#### Health Check
```http
GET /api/health
```
Returns model status and available classes

#### Make Prediction
```http
POST /api/predict
Content-Type: multipart/form-data

image: <binary image file>
```

**Response (Success)**:
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

#### Get Classes
```http
GET /api/classes
```
Returns list of all disease classes

## 🛠️ Project Structure

```
DeepLearning_PPD_project/
├── backend/
│   ├── app.py                 # Flask API server
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML entry point
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── App.css            # Main styles
│   │   ├── index.js           # React DOM render
│   │   ├── index.css          # Global styles
│   │   └── components/
│   │       ├── ImageUploader.js
│   │       ├── ImageUploader.css
│   │       ├── Results.js
│   │       └── Results.css
│   ├── package.json           # npm dependencies
│   └── README.md              # This file
└── README.md
```

## 🎨 Customization

### Changing API URL
If your backend is on a different host/port, update the `API_URL` in `frontend/src/App.js`:

```javascript
const API_URL = 'http://your-host:your-port/api';
```

### Modifying Model Path
If your model is in a different location, update the `MODEL_PATH` in `backend/app.py`:

```python
MODEL_PATH = '/path/to/your/best_vgg16_model.h5'
```

### Adjusting Colors
Edit the `colorMap` in `frontend/src/components/Results.js` to change visualization colors:

```javascript
const colorMap = {
  'COVID-19': '#ff6b6b',      // Red
  'PNEUMONIA': '#ffa500',      // Orange
  'TUBERCULOSIS': '#e74c3c',   // Dark Red
  'NORMAL': '#27ae60',         // Green
};
```

## 📈 Model Performance

- **Architecture**: VGG16 (Transfer Learning)
- **Test Accuracy**: ~86%
- **Training Data**: Chest X-rays (COVID-19, Pneumonia, Tuberculosis, Normal)
- **Image Size**: 224×224 pixels
- **Preprocessing**: Normalization to [0, 1]

## 🔧 Troubleshooting

### Model not loading
- Verify the model file exists at the correct path
- Check file permissions
- Ensure TensorFlow version compatibility

### CORS errors
- Make sure Flask backend is running on port 5000
- Check that `flask-cors` is installed

### React connection errors
- Verify backend is running: `http://localhost:5000/api/health`
- Check network tab in browser DevTools
- Ensure ports 3000 and 5000 are not in use

### Image upload fails
- Confirm image format is supported (JPG, PNG, GIF, WEBP)
- Check file size (should be reasonable)
- Verify image is a valid image file

## 🚀 Production Deployment

### Backend (Flask)
```bash
pip install gunicorn
gunicorn --workers 4 --bind 0.0.0.0:5000 app:app
```

### Frontend (React)
```bash
npm run build
# Serve the build directory with your web server
```

## 📝 License

This project is part of the DeepLearning_PPD_project.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console logs in browser DevTools
3. Check Flask server logs in terminal
4. Verify all dependencies are installed correctly

---

**Last Updated**: April 2026
**Model**: VGG16 | **Framework**: TensorFlow 2.10+
