import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import type { RiskAssessment } from '../lib/supabase';

interface WeakSignalDashboardProps {
  riskAssessment: RiskAssessment | null;
}

export function WeakSignalDashboard({ riskAssessment }: WeakSignalDashboardProps) {
  if (!riskAssessment) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Weak Signal Dashboard</h2>
            <p className="text-sm text-gray-500">Awaiting symptom analysis</p>
          </div>
        </div>
        <div className="text-center py-12 text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Submit your symptoms to see biometric correlations and risk predictions</p>
        </div>
      </div>
    );
  }

  const getRiskLevel = (score: number): { label: string; color: string; bgColor: string } => {
    if (score >= 70) return { label: 'High Risk', color: 'text-red-700', bgColor: 'bg-red-100' };
    if (score >= 40) return { label: 'Moderate Risk', color: 'text-amber-700', bgColor: 'bg-amber-100' };
    return { label: 'Low Risk', color: 'text-emerald-700', bgColor: 'bg-emerald-100' };
  };

  const risks = [
    {
      name: 'Chronic Stress',
      score: riskAssessment.chronic_stress_risk,
      icon: '🧠',
      description: 'Mental health impact from environmental stressors'
    },
    {
      name: 'Respiratory Issues',
      score: riskAssessment.respiratory_risk,
      icon: '🫁',
      description: 'Lung function affected by air quality'
    },
    {
      name: 'Sleep Disorders',
      score: riskAssessment.sleep_disorder_risk,
      icon: '😴',
      description: 'Sleep quality impacted by noise and light pollution'
    }
  ];

  const maxRisk = Math.max(
    riskAssessment.chronic_stress_risk,
    riskAssessment.respiratory_risk,
    riskAssessment.sleep_disorder_risk
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Weak Signal Dashboard</h2>
          <p className="text-sm text-gray-500">Biometric correlation & predictive analysis</p>
        </div>
      </div>

      <div className="mb-6 p-5 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border-2 border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-800">Environmental Stress Index</h3>
          </div>
          <span className="text-3xl font-bold text-indigo-600">
            {riskAssessment.environmental_stress_index}%
          </span>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500 transition-all duration-1000"
            style={{ width: `${riskAssessment.environmental_stress_index}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Combined environmental factors affecting your location
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Predictive Risk Scores
        </h3>
        <div className="space-y-3">
          {risks.map((risk) => {
            const riskInfo = getRiskLevel(risk.score);
            return (
              <div key={risk.name} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{risk.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{risk.name}</p>
                      <p className="text-xs text-gray-500">{risk.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{risk.score}%</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${riskInfo.bgColor} ${riskInfo.color}`}>
                      {riskInfo.label}
                    </span>
                  </div>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className={`absolute h-full transition-all duration-500 ${
                      risk.score >= 70
                        ? 'bg-red-500'
                        : risk.score >= 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${risk.score}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Biometric Correlation</h4>
        <p className="text-sm text-blue-700">
          {maxRisk >= 70
            ? 'Strong correlation detected between your symptoms and environmental factors. Immediate action recommended.'
            : maxRisk >= 40
            ? 'Moderate correlation observed. Your symptoms may be influenced by local environmental conditions.'
            : 'Mild environmental influence detected. Continue monitoring for pattern changes.'}
        </p>
      </div>
    </div>
  );
}
