import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Award, Calendar, CheckCircle2, Volume2, Sparkles } from 'lucide-react';
import type { DGMessage } from '@/data/homeData';

interface DGMessageModalProps {
  message: DGMessage;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'read' | 'video';
}

export const DGMessageModal: React.FC<DGMessageModalProps> = ({
  message,
  isOpen,
  onClose,
  initialMode = 'read',
}) => {
  const [activeTab, setActiveTab] = useState<'read' | 'video'>(initialMode);
  const [isPlaying, setIsPlaying] = useState(false);

  // Synchroniser le tab si la prop change
  React.useEffect(() => {
    setActiveTab(initialMode);
    setIsPlaying(false);
  }, [initialMode, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          {/* Overlay avec effet de flou */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Fenêtre modale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Barre supérieure avec onglets de lecture */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('read');
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'read'
                      ? 'bg-[#139BD7] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  Lire le message
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'video'
                      ? 'bg-[#EA580C] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Allocution vidéo ({message.videoDuration})
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corps du message */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7">
              {activeTab === 'read' ? (
                <div className="space-y-5">
                  {/* Fiche Auteur DG */}
                  <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                    <img
                      src={message.author.avatarUrl}
                      alt={message.author.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-sky-100 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {message.author.name}
                        </h4>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          DG ADEC
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Publié le {message.date}
                      </p>
                    </div>
                  </div>

                  {/* Titre principal */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">
                    {message.title}
                  </h3>

                  {/* Points clés mis en avant */}
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
                    <h5 className="text-xs font-bold text-[#139BD7] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Points essentiels de l'allocution
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {message.highlights.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contenu complet */}
                  <div className="prose prose-sm text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {message.fullMessage}
                  </div>
                </div>
              ) : (
                /* Vue Lecteur Vidéo simulé */
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video shadow-lg flex items-center justify-center group">
                    <img
                      src={message.videoThumbnail}
                      alt="Miniature vidéo DG"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />

                    {/* Bouton de lecture centré */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="relative z-10 w-16 h-16 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="w-7 h-7 fill-current" />
                      ) : (
                        <Play className="w-7 h-7 fill-current ml-1" />
                      )}
                    </button>

                    {/* Barre de contrôle inférieure */}
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="hover:text-amber-400"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current" />
                          )}
                        </button>
                        <span>{isPlaying ? '01:12' : '00:00'} / {message.videoDuration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">HD</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-base">
                      {message.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Enregistré à la Direction Générale — {message.date} ({message.videoDuration})
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pied de modale */}
            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                Communication interne ADEC — Réservé aux collaborateurs
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
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
