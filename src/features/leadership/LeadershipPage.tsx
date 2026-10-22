import React from 'react';
import { Award } from 'lucide-react';

export const LeadershipPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-600" />
          Direction Générale
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Communications officielles, notes de service et orientations stratégiques.
        </p>
      </div>

      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-600">Module Direction Générale prêt.</p>
      </div>
    </div>
  );
};
