import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Share2, Check } from 'lucide-react';
import type { NewsItem } from '@/data/homeData';

interface ArticleDetailModalProps {
  article: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          {/* Fond sombre translucide */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Carte Modale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Bannière de couverture colorée */}
            <div className={`p-6 bg-gradient-to-r ${article.coverGradient} text-white relative`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3">
                {article.category}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold leading-snug drop-shadow-xs">
                {article.title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/90 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.publishedAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime} de lecture
                </span>
              </div>
            </div>

            {/* Corps de l'article */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              {/* Carte Auteur */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#139BD7] text-white flex items-center justify-center font-bold text-xs">
                    {article.author.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                      {article.author.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {article.author.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all"
                  title="Copier le lien"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Partager</span>
                    </>
                  )}
                </button>
              </div>

              {/* Résumé mis en exergue */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border-l-4 border-[#139BD7] text-slate-700 text-sm italic font-medium leading-relaxed">
                « {article.summary} »
              </div>

              {/* Texte intégral */}
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-normal">
                {article.content}
              </div>
            </div>

            {/* Pied de page */}
            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                Actualité interne — MyADEC Pro
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#139BD7] hover:bg-[#0B72A2] text-white text-xs font-bold transition-colors"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
