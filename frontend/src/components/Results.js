import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import './Results.css';

/* ===== Inline SVG Icons ===== */
const Icon = ({ children, size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" {...props}>{children}</svg>
);

const ShieldAlertIcon = (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></Icon>;
const WindIcon = (p) => <Icon {...p}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></Icon>;
const BugIcon = (p) => <Icon {...p}><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></Icon>;
const CheckCircleIcon = (p) => <Icon {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></Icon>;
const ActivityIcon = (p) => <Icon {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Icon>;
const AlertTriangleIcon = (p) => <Icon {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></Icon>;
const TrendingUpIcon = (p) => <Icon {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></Icon>;
const HeartIcon = (p) => <Icon {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></Icon>;

const CLASS_CONFIG = {
  'COVID-19': {
    color: '#ef4444',
    icon: ShieldAlertIcon,
    description: 'SARS-CoV-2 infection detected. Immediate medical consultation recommended.',
  },
  'PNEUMONIA': {
    color: '#f97316',
    icon: WindIcon,
    description: 'Pulmonary inflammation detected. Consult a healthcare professional.',
  },
  'TUBERCULOSIS': {
    color: '#a855f7',
    icon: BugIcon,
    description: 'Mycobacterium tuberculosis indicators found. Urgent medical attention needed.',
  },
  'NORMAL': {
    color: '#22c55e',
    icon: CheckCircleIcon,
    description: 'No significant pulmonary abnormalities detected. Lungs appear healthy.',
  },
};

function Results({ prediction }) {
  if (!prediction || !prediction.success) return null;

  const { predicted_class, confidence, probabilities } = prediction;
  const config = CLASS_CONFIG[predicted_class] || CLASS_CONFIG['NORMAL'];
  const StatusIcon = config.icon;
  const isNormal = predicted_class === 'NORMAL';

  const chartData = Object.entries(probabilities)
    .map(([name, value]) => ({
      name,
      value,
      pct: (value * 100).toFixed(1),
      color: CLASS_CONFIG[name]?.color || '#64748b',
    }))
    .sort((a, b) => b.value - a.value);

  const getConfidenceClass = (c) => {
    if (c >= 0.7) return 'high';
    if (c >= 0.4) return 'medium';
    return 'low';
  };

  return (
    <div className="results-container">
      {/* Status Banner */}
      <div className={`result-banner ${isNormal ? 'success' : 'danger'}`}>
        <div className="banner-icon">
          <StatusIcon size={28} />
        </div>
        <div className="banner-text">
          <h2>{predicted_class}</h2>
          <p>{config.description}</p>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="confidence-card">
        <div className="confidence-header">
          <span>Confidence Score</span>
          <span className="confidence-value">{(confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="confidence-track">
          <div
            className={`confidence-fill ${getConfidenceClass(confidence)}`}
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>

      {/* Probability Breakdown */}
      <div className="prob-breakdown">
        <h3 className="breakdown-title">
          <ActivityIcon size={16} />
          Classification Breakdown
        </h3>

        {chartData.map((item) => {
          const IconComp = CLASS_CONFIG[item.name]?.icon || CheckCircleIcon;
          return (
            <div key={item.name} className="prob-item">
              <div className="prob-row">
                <div className="prob-label">
                  <span className="prob-dot" style={{ background: item.color }} />
                  <IconComp size={14} style={{ color: item.color }} />
                  <span className="prob-name">{item.name}</span>
                </div>
                <span className="prob-pct">{item.pct}%</span>
              </div>
              <div className="prob-track">
                <div
                  className="prob-fill"
                  style={{ width: `${item.value * 100}%`, background: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      <div className="chart-card">
        <h3 className="chart-title">
          <TrendingUpIcon size={16} />
          Probability Distribution
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <Tooltip
              formatter={(v) => `${(v * 100).toFixed(1)}%`}
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.85rem',
              }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Disclaimer */}
      <div className="result-disclaimer">
        <AlertTriangleIcon size={15} />
        <span>
          This AI analysis is for informational purposes only and does not constitute medical advice.
          Always consult a qualified healthcare professional for diagnosis and treatment.
        </span>
      </div>
    </div>
  );
}

export default Results;
