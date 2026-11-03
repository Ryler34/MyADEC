import React from 'react';
import { Download } from 'lucide-react';
import { usePwa } from './PwaProvider';

export const InstallPwaButton: React.FC = () => {
  const { installed, installing, installApp } = usePwa();
  if (installed) return null;

  return <button
    type="button"
    disabled={installing}
    onClick={() => { void installApp(); }}
    className="mx-auto mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white/90 px-4 py-2 text-xs font-bold text-sky-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-sky-100"
    aria-label={installing ? 'Installation en cours' : 'Installer ADEC Ensemble sur cet appareil'}
  >
    {installing ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-200 border-t-sky-700" /> : <Download className="h-4 w-4" />}
    {installing ? 'Installation en cours…' : 'Installer l’application ADEC'}
  </button>;
};
