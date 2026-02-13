import { Shield, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import type { RiskAssessment } from '../lib/supabase';

interface ProactiveRecommendationsProps {
  riskAssessment: RiskAssessment | null;
}

export function ProactiveRecommendations({ riskAssessment }: ProactiveRecommendationsProps) {
  if (!riskAssessment || riskAssessment.recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Proactive Recommendations</h2>
            <p className="text-sm text-gray-500">AI-powered health guidance</p>
          </div>
        </div>
        <div className="text-center py-12 text-gray-400">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Personalized recommendations will appear after symptom analysis</p>
        </div>
      </div>
    );
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-amber-200 bg-amber-50';
      default:
        return 'border-emerald-200 bg-emerald-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-emerald-100 text-emerald-700';
    }
  };

  const sortedRecommendations = [...riskAssessment.recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Proactive Recommendations</h2>
          <p className="text-sm text-gray-500">AI-powered health guidance based on your data</p>
        </div>
      </div>

      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Personalized Insights</h3>
            <p className="text-sm text-blue-700">
              These recommendations are generated based on the correlation between your reported symptoms
              and real-time environmental conditions at your location.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sortedRecommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border-2 ${getPriorityColor(rec.priority)} transition-all hover:shadow-md`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getPriorityIcon(rec.priority)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {rec.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-800 leading-relaxed">{rec.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Action Steps
        </h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
            <span>Follow high-priority recommendations immediately for best results</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
            <span>Monitor your symptoms daily to track improvement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
            <span>Consult healthcare professionals for persistent symptoms</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
