import React from 'react';
import { Newspaper } from 'lucide-react';

export const NewsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-[#139BD7]" />
          Actualités internes
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Toutes les publications, informations et projets de la vie d'ADEC.
        </p>
      </div>

      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-600">Module Actualités prêt pour les articles complets.</p>
      </div>
    </div>
  );
};
