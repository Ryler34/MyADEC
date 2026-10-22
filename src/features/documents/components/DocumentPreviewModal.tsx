import React, { useEffect, useState } from 'react';
import { FileText, X } from 'lucide-react';
import type { InternalDocument } from '@/types';
import { getDocumentFile } from '@/services/documentFileService';

interface DocumentPreviewModalProps {
  document: InternalDocument | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ document, onClose }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!document) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [document, onClose]);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    setFileUrl(null);
    if (document?.downloadUrl.startsWith('workspace-file://')) {
      const id = document.downloadUrl.slice('workspace-file://'.length);
      void getDocumentFile(id).then((blob) => {
        if (!active || !blob) return;
        objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      });
    }
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [document]);

  if (!document) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="document-preview-title" className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-slate-100 shadow-2xl sm:rounded-3xl">
        <header className="flex items-start justify-between gap-4 bg-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><FileText className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">Aperçu du document · {document.fileType.toUpperCase()}</p>
              <h2 id="document-preview-title" className="mt-1 line-clamp-2 font-extrabold leading-snug text-slate-800">{document.title}</h2>
              <p className="mt-1 text-xs text-slate-500">{document.category} · {document.fileSize}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Fermer l’aperçu"><X className="h-5 w-5" /></button>
        </header>

        <div className="overflow-y-auto p-4 sm:p-7">
          {fileUrl && document.fileType === 'pdf' ? (
            <iframe src={fileUrl} title={`Aperçu de ${document.title}`} className="mx-auto h-[65vh] min-h-[380px] w-full max-w-xl border-0 bg-white shadow-sm" />
          ) : (
          <div className="mx-auto min-h-[360px] max-w-xl border border-slate-200 bg-white p-6 shadow-sm sm:min-h-[440px] sm:p-10">
            <div className="flex items-center justify-between border-b-2 border-[#139BD7] pb-4">
              <div className="flex items-center gap-2 text-[#139BD7]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-100 text-sm font-black">A</span>
                <span className="text-sm font-extrabold tracking-tight text-slate-800">ADEC <span className="font-medium text-slate-400">| Document interne</span></span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{document.category}</span>
            </div>

            <div className="mt-9">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#139BD7]">Espace collaborateurs</p>
              <h3 className="mt-2 text-2xl font-extrabold leading-tight text-slate-800">{document.title}</h3>
              <p className="mt-2 text-xs text-slate-400">Émis par {document.issuer} · Mise à jour : {document.updatedAt}</p>
              <div className="mt-7 h-1 w-16 rounded-full bg-[#EA580C]" />
              <p className="mt-6 text-sm leading-7 text-slate-600">{document.description}</p>

              <div className="mt-7 rounded-xl border border-sky-100 bg-sky-50/70 p-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-700">À propos de ce document</h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">Cette fiche de prévisualisation présente la référence et les informations principales du fichier dans l’espace ADEC. Le document complet est indiqué au format {document.fileType.toUpperCase()}.</p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="h-2 w-full rounded-full bg-slate-100" />
                <div className="h-2 w-11/12 rounded-full bg-slate-100" />
                <div className="h-2 w-4/5 rounded-full bg-slate-100" />
                <div className="h-2 w-full rounded-full bg-slate-100" />
                <div className="h-2 w-3/4 rounded-full bg-slate-100" />
              </div>
            </div>

            <footer className="mt-12 flex items-end justify-between border-t border-slate-100 pt-3 text-[9px] text-slate-400">
              <span>ADEC · Support interne</span>
              <span>Référence : {document.id.toUpperCase()}</span>
            </footer>
          </div>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3 sm:px-6">
          <span className="text-xs text-slate-400">Aperçu de démonstration</span>
          <button type="button" onClick={onClose} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200"><X className="h-3.5 w-3.5" />Fermer l’aperçu</button>
        </footer>
      </section>
    </div>
  );
};
