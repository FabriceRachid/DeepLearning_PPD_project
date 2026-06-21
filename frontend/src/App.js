import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ImageUploader from './components/ImageUploader';
import Results from './components/Results';
import './App.css';

/* ===== Inline SVG Icon Components ===== */
const Icon = ({ children, size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" {...props}>{children}</svg>
);

const StethoscopeIcon = (p) => <Icon {...p}><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></Icon>;
const UploadIcon = (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></Icon>;
const EyeIcon = (p) => <Icon {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></Icon>;
const ScanLineIcon = (p) => <Icon {...p}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/></Icon>;
const CheckCircleIcon = (p) => <Icon {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></Icon>;
const XCircleIcon = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></Icon>;
const ActivityIcon = (p) => <Icon {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Icon>;
const AlertTriangleIcon = (p) => <Icon {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></Icon>;
const RefreshIcon = (p) => <Icon {...p}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></Icon>;
const FileSearchIcon = (p) => <Icon {...p}><path d="M20 10V7.5L14.5 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h4.5"/><polyline points="14 2 14 8 20 8"/><path d="M16 22a2 2 0 0 1-2-2"/><path d="M20 22a2 2 0 0 0 2-2"/><path d="M20 14a2 2 0 0 1 2 2"/><path d="M16 14a2 2 0 0 0-2 2"/><line x1="14" y1="18" x2="22" y2="18"/><line x1="18" y1="14" x2="18" y2="22"/></Icon>;
const ImageIcon = (p) => <Icon {...p}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></Icon>;
const ShieldAlertIcon = (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></Icon>;
const WindIcon = (p) => <Icon {...p}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></Icon>;
const BugIcon = (p) => <Icon {...p}><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></Icon>;
const HeartIcon = (p) => <Icon {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></Icon>;
const CpuIcon = (p) => <Icon {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></Icon>;
const ZapIcon = (p) => <Icon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
const DatabaseIcon = (p) => <Icon {...p}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></Icon>;
const ClockIcon = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>;
const XIcon = (p) => <Icon {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Icon>;
const TrashIcon = (p) => <Icon {...p}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></Icon>;

const HISTORY_CLASS_COLORS = {
  'COVID-19': '#ef4444',
  'PNEUMONIA': '#f97316',
  'TUBERCULOSIS': '#a855f7',
  'NORMAL': '#22c55e',
};

function HistoryPanel({ isOpen, onClose, onSelectEntry }) {
  const [history, setHistory] = useState([]);
  const [hLoading, setHLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setHLoading(true);
    try {
      const res = await axios.get(`${API_URL}/history`);
      setHistory(res.data.history || []);
    } catch (err) { console.error(err); }
    finally { setHLoading(false); }
  }, []);

  useEffect(() => { if (isOpen) fetchHistory(); }, [isOpen, fetchHistory]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_URL}/history/${id}`);
      setHistory((prev) => prev.filter((h) => h.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleClearAll = async () => {
    try { await axios.delete(`${API_URL}/history`); setHistory([]); }
    catch (err) { console.error(err); }
  };

  const fmtTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' \u00b7 ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className={`history-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`history-panel ${isOpen ? 'open' : ''}`}>
        <div className="history-header">
          <div className="history-header-left"><ClockIcon size={18} /><h2>History</h2></div>
          <button className="close-btn" onClick={onClose}><XIcon size={18} /></button>
        </div>
        {history.length > 0 && (
          <div className="history-actions">
            <button className="clear-btn" onClick={handleClearAll}><TrashIcon size={13} />Clear All</button>
            <span className="history-count">{history.length} {history.length === 1 ? 'entry' : 'entries'}</span>
          </div>
        )}
        <div className="history-list">
          {hLoading && <p className="history-empty">Loading...</p>}
          {!hLoading && history.length === 0 && (
            <div className="history-empty"><ClockIcon size={32} /><p>No analyses yet</p><span>Upload an X-ray to start</span></div>
          )}
          {!hLoading && history.map((entry) => {
            const color = HISTORY_CLASS_COLORS[entry.predicted_class] || '#64748b';
            return (
              <div key={entry.id} className="history-card" onClick={() => onSelectEntry(entry)}>
                <div className="history-thumb"><img src={`data:image/jpeg;base64,${entry.image_b64}`} alt="" /></div>
                <div className="history-info">
                  <div className="history-class-row">
                    <span className="history-class-badge" style={{ background: `${color}22`, color }}>{entry.predicted_class}</span>
                    <span className="history-confidence">{(entry.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <p className="history-filename">{entry.filename}</p>
                  <p className="history-time">{fmtTime(entry.timestamp)}</p>
                </div>
                <button className="history-delete-btn" onClick={(e) => handleDelete(e, entry.id)}><TrashIcon size={14} /></button>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}

const API_URL = 'http://localhost:5000/api';

const DISEASE_INFO = [
  {
    name: 'COVID-19',
    icon: ShieldAlertIcon,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    desc: 'SARS-CoV-2 viral infection causing respiratory distress and systemic inflammation.',
    risk: 'High',
    riskBg: 'rgba(239, 68, 68, 0.15)',
  },
  {
    name: 'Pneumonia',
    icon: WindIcon,
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.12)',
    desc: 'Inflammatory condition of the lungs primarily affecting the alveolar sacs.',
    risk: 'Moderate',
    riskBg: 'rgba(249, 115, 22, 0.15)',
  },
  {
    name: 'Tuberculosis',
    icon: BugIcon,
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    desc: 'Mycobacterium tuberculosis infection causing chronic pulmonary disease.',
    risk: 'High',
    riskBg: 'rgba(168, 85, 247, 0.15)',
  },
  {
    name: 'Normal',
    icon: HeartIcon,
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.12)',
    desc: 'Healthy pulmonary structure with no detectable abnormalities on the X-ray.',
    risk: 'Low',
    riskBg: 'rgba(34, 197, 94, 0.15)',
  },
];

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleImageUpload = async (file) => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target.result);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPrediction(response.data);
    } catch (err) {
      const data = err.response?.data;
      setError({
        type: data?.validation_error ? 'validation' : 'server',
        message: data?.message || data?.error || 'Analysis failed. Please try again.',
        details: data?.details || null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setUploadedImage(null);
    setError(null);
  };

  const handleSelectHistory = (entry) => {
    setUploadedImage(`data:image/jpeg;base64,${entry.image_b64}`);
    setPrediction({
      predicted_class: entry.predicted_class,
      confidence: entry.confidence,
      probabilities: entry.probabilities,
      success: true,
      xray_validated: true,
    });
    setError(null);
    setHistoryOpen(false);
  };

  const getStepStatus = () => {
    if (prediction) return 3;
    if (error?.type === 'validation') return 2;
    if (loading) return 1;
    return 0;
  };

  const currentStep = getStepStatus();

  const stepClass = (n) => {
    if (currentStep === 2 && n === 2) return 'step error';
    if (n < currentStep) return 'step completed';
    if (n === currentStep) return 'step active';
    return 'step';
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <StethoscopeIcon size={22} />
          </div>
          <div className="brand-text">
            <h1>PulmoScan AI</h1>
            <span>Pulmonary Disease Classification</span>
          </div>
        </div>
        <div className="header-right">
          <button className="history-btn" onClick={() => setHistoryOpen(true)}>
            <ClockIcon size={16} />
            History
          </button>
          <div className="header-badge">
            <div className="status-dot" />
            AI Model Active
          </div>
        </div>
      </header>

      {/* WORKFLOW STEPPER */}
      <section className="workflow-section">
        <div className="stepper">
          <div className={stepClass(0)}>
            <div className="step-circle"><UploadIcon size={16} /></div>
            <span className="step-label">Upload</span>
          </div>
          <div className={`step-connector ${currentStep > 0 ? 'completed' : ''}`} />
          <div className={stepClass(1)}>
            <div className="step-circle"><EyeIcon size={16} /></div>
            <span className="step-label">Validate</span>
          </div>
          <div className={`step-connector ${currentStep > 1 ? 'completed' : ''}`} />
          <div className={stepClass(2)}>
            <div className="step-circle">
              {currentStep === 2 && error?.type === 'validation' ? (
                <XCircleIcon size={16} />
              ) : (
                <ScanLineIcon size={16} />
              )}
            </div>
            <span className="step-label">Analyze</span>
          </div>
          <div className={`step-connector ${currentStep > 2 ? 'completed' : ''}`} />
          <div className={stepClass(3)}>
            <div className="step-circle"><CheckCircleIcon size={16} /></div>
            <span className="step-label">Results</span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="content-grid">
          {/* LEFT PANEL - Upload */}
          <div className="panel upload-panel">
            <div className="panel-header">
              <UploadIcon size={18} />
              Image Input
            </div>
            <div className="panel-body">
              <ImageUploader onImageUpload={handleImageUpload} loading={loading} />
              {uploadedImage && (
                <div className="image-preview-card">
                  <div className="preview-label">
                    <ImageIcon size={13} />
                    Uploaded Image
                  </div>
                  <img src={uploadedImage} alt="Uploaded X-ray" className="preview-image" />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL - Results */}
          <div className="panel results-panel">
            <div className="panel-header">
              <ActivityIcon size={18} />
              Analysis Results
            </div>
            <div className="panel-body">
              {/* Validation Error */}
              {error?.type === 'validation' && (
                <div className="validation-error">
                  <div className="validation-icon">
                    <AlertTriangleIcon size={24} />
                  </div>
                  <div className="validation-content">
                    <h3>Invalid Image Type</h3>
                    <p>{error.message}</p>
                    {error.details && <p className="validation-details">{error.details}</p>}
                  </div>
                </div>
              )}

              {/* Server Error */}
              {error?.type === 'server' && (
                <div className="validation-error">
                  <div className="validation-icon">
                    <XCircleIcon size={24} />
                  </div>
                  <div className="validation-content">
                    <h3>Analysis Error</h3>
                    <p>{error.message}</p>
                  </div>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="analysis-loading">
                  <div className="scan-animation">
                    <div className="scan-ring" />
                    <div className="scan-ring-inner" />
                    <div className="scan-icon">
                      <ScanLineIcon size={28} />
                    </div>
                  </div>
                  <div className="loading-text">
                    <h3>Analyzing Image...</h3>
                    <p>Validating X-ray structure & running classification</p>
                  </div>
                </div>
              )}

              {/* Results */}
              {prediction && !loading && (
                <>
                  <Results prediction={prediction} />
                  <button className="reset-btn" onClick={handleReset}>
                    <RefreshIcon size={16} />
                    Classify Another Image
                  </button>
                </>
              )}

              {/* Welcome State */}
              {!prediction && !loading && !error && (
                <div className="welcome-state">
                  <div className="welcome-icon">
                    <FileSearchIcon size={28} />
                  </div>
                  <h3>Ready to Analyze</h3>
                  <p>Upload a chest X-ray image to classify pulmonary anomalies using our VGG16 deep learning model.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DISEASE INFO CARDS */}
        <section className="info-section">
          <h2>Classification Categories</h2>
          <div className="info-grid">
            {DISEASE_INFO.map((d) => {
              const IconComp = d.icon;
              return (
                <div key={d.name} className="info-card">
                  <div className="card-icon" style={{ background: d.bg }}>
                    <IconComp size={20} style={{ color: d.color }} />
                  </div>
                  <h3>{d.name}</h3>
                  <p>{d.desc}</p>
                  <span
                    className="card-risk"
                    style={{ background: d.riskBg, color: d.color }}
                  >
                    {d.risk} Risk
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <div className="footer-content">
          <span><CpuIcon size={13} /> VGG16 Transfer Learning</span>
          <span className="footer-dot" />
          <span><ZapIcon size={13} /> ~86% Test Accuracy</span>
          <span className="footer-dot" />
          <span><DatabaseIcon size={13} /> 4 Pulmonary Classes</span>
        </div>
      </footer>

      {/* HISTORY PANEL */}
      <HistoryPanel
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectEntry={handleSelectHistory}
      />
    </div>
  );
}

export default App;
