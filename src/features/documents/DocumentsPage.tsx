import React, { useMemo, useState } from 'react';
import { ArrowDownToLine, Clock3, FileText, FolderOpen, Search, UserRound } from 'lucide-react';
import type { InternalDocument } from '@/types';
import { documentCategories } from '@/data/documentsData';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { useWorkspace } from '@/hooks/useWorkspace';
import { getDocumentFile } from '@/services/documentFileService';

const fileTypeStyles: Record<InternalDocument['fileType'], string> = {
  pdf: 'bg-rose-50 text-rose-600',
  docx: 'bg-sky-50 text-sky-700',
  xlsx: 'bg-emerald-50 text-emerald-700',
  pptx: 'bg-orange-50 text-orange-700',
};

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');

export const DocumentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [previewDocument, setPreviewDocument] = useState<InternalDocument | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const workspace = useWorkspace();

  const filteredDocuments = useMemo(() => {
    const query = normalize(searchQuery.trim());
    return workspace.documents.filter((document) => {
      const searchableText = normalize([
        document.title,
        document.category,
        document.description ?? '',
        document.issuer,
        document.fileType,
      ].join(' '));
      return (!query || searchableText.includes(query)) &&
        (selectedCategory === 'Tous' || document.category === selectedCategory);
    });
  }, [searchQuery, selectedCategory, workspace.documents]);

  const handleDownload = async (document: InternalDocument) => {
    try {
      if (document.downloadUrl.startsWith('workspace-file://')) {
        const fileId = document.downloadUrl.slice('workspace-file://'.length);
        const blob = await getDocumentFile(fileId);
        if (!blob) throw new Error('Le fichier associé est introuvable sur cet appareil.');
        const objectUrl = URL.createObjectURL(blob);
        const anchor = window.document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = `${document.title}.${document.fileType}`;
        anchor.click();
        URL.revokeObjectURL(objectUrl);
        setDownloadNotice(`« ${document.title} » a été téléchargé.`);
      } else if (document.downloadUrl !== '#') {
        window.open(document.downloadUrl, '_blank', 'noopener,noreferrer');
        setDownloadNotice(`Ouverture du fichier « ${document.title} ».`);
      } else {
        setDownloadNotice(`Téléchargement de démonstration : « ${document.title} » (${document.fileSize}).`);
      }
    } catch (caught) {
      setDownloadNotice(caught instanceof Error ? caught.message : 'Impossible de récupérer ce fichier.');
    }
    window.setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      <header>
        <div className="flex items-center gap-2 text-indigo-600">
          <FolderOpen className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-[0.16em]">Ressources internes</span>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">Espace Documents</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">Formulaires RH, chartes internes, modèles et procédures utiles à votre quotidien.</p>
      </header>

      {downloadNotice && (
        <div role="status" className="flex items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <span className="flex items-center gap-2"><ArrowDownToLine className="h-4 w-4 shrink-0" />{downloadNotice}</span>
          <button type="button" onClick={() => setDownloadNotice(null)} className="rounded-lg p-1 hover:bg-emerald-100" aria-label="Fermer la notification">×</button>
        </div>
      )}

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Recherche et filtres des documents">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Rechercher un document, une catégorie, une description…"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            aria-label="Rechercher un document"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Tous', ...documentCategories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${selectedCategory === category ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'}`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span><strong className="text-slate-800">{filteredDocuments.length}</strong> document{filteredDocuments.length === 1 ? '' : 's'}</span>
          {(searchQuery || selectedCategory !== 'Tous') && <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('Tous'); }} className="font-semibold text-indigo-700 hover:underline">Effacer les filtres</button>}
        </div>
      </section>

      {filteredDocuments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <Search className="mx-auto h-8 w-8 text-slate-300" />
          <h2 className="mt-3 font-bold text-slate-800">Aucun document trouvé</h2>
          <p className="mt-1 text-sm text-slate-500">Essayez un autre terme ou une autre catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocuments.map((document) => (
            <article key={document.id} className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${fileTypeStyles[document.fileType]}`}><FileText className="h-6 w-6" /></span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-600">{document.fileType}</span>
                </div>
                <span className="mt-4 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">{document.category}</span>
                <h2 className="mt-2 text-base font-extrabold leading-snug text-slate-800">{document.title}</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{document.description}</p>
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  <p className="flex items-start gap-1.5"><UserRound className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{document.issuer}</span></p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-500">{document.fileSize}</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />Mis à jour le {document.updatedAt}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                <button type="button" onClick={() => setPreviewDocument(document)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-200">
                  <Search className="h-3.5 w-3.5" /> Consulter
                </button>
                <button type="button" onClick={() => handleDownload(document)} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700">
                  <ArrowDownToLine className="h-3.5 w-3.5" /> Télécharger
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <DocumentPreviewModal document={previewDocument} onClose={() => setPreviewDocument(null)} />
    </div>
  );
};
