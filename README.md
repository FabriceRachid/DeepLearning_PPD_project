# DeepLearning_PPD_project
#  Chest X-Ray Disease Classification using VGG16

##  Overview

This project focuses on the automatic classification of chest X-ray images using a deep learning model based on **VGG16**. The system classifies images into four medical categories:

* **COVID-19**
* **Pneumonia**
* **Tuberculosis**
* **Normal**

The goal is to assist medical diagnosis by providing a reliable and automated image classification approach.

---

##  Model Architecture

* Pretrained **VGG16** model (ImageNet weights)
* Transfer Learning & Fine-tuning
* Custom fully connected layers
* Softmax output for multi-class classification

---

## Technologies Used

* Python 3
* TensorFlow / Keras
* NumPy
* Matplotlib
* Scikit-learn
* Jupyter Notebook

---

## Dataset

* Chest X-ray images organized by class directories
* Four classes: COVID-19, Pneumonia, Tuberculosis, Normal
* Data split into **training**, **validation**, and **test** sets

>  Due to size and privacy reasons, the dataset is not included in this repository.

---

##  Training Process

* Image preprocessing and augmentation
* Transfer learning with frozen base layers
* Fine-tuning with a reduced learning rate
* Callbacks used:

  * ModelCheckpoint
  * EarlyStopping
  * ReduceLROnPlateau

---

## Evaluation Metrics

* Training & Validation Accuracy
* Training & Validation Loss
* Confusion Matrix
* Classification Report (Precision, Recall, F1-score)

The final model achieved a **test accuracy of ~86%**, showing strong performance especially on Pneumonia and Normal classes.

---

##  Results Visualization

* Accuracy & Loss curves
* Confusion matrix heatmap
* Sample predictions with true vs predicted labels

---

## ▶️ How to Run

1. Clone the repository

```bash
git clone https://github.com/your-username/DeepLearning_PPD_project.git
cd DeepLearning_PPD_project
```

2. Install dependencies

```bash
pip install -r requirements.txt
```

3. Run the notebook

```bash
jupyter notebook
```

---

##  Project Structure

```
├── data/
│   ├── train/
│   ├── val/
│   └── test/
├
├── notebooks/
│    └── models/
│   │      └── best_vgg16_model.h5
│   └── vgg16_pulmonary_4classes.ipynb
├── README.md
└── requirements.txt
```

---

##  Limitations

* Class imbalance affects minority classes (COVID-19, Tuberculosis)
* Performance may vary on external datasets

---

##  Future Improvements

* Apply class weighting or focal loss
* Increase dataset size
* Test other architectures (ResNet, EfficientNet)
* Deploy as a web or mobile application

---

##  Author

**Fabrice RAMDE**
Computer Science Student | Machine Learning Enthusiast

---


