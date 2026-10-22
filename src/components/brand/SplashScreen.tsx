import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdecLogo } from './AdecLogo';
import { brandConfig } from '@/config/brand';

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number; // en ms (défaut: 1200ms)
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDuration = 1300,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) {
        // Petit délai pour laisser l'animation de sortie se terminer
        setTimeout(onFinish, 300);
      }
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="adec-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#139BD7] via-[#108ec7] to-[#0B72A2] text-white select-none px-6"
          role="status"
          aria-live="polite"
          aria-label="Chargement de l'application MyADEC Pro"
        >
          {/* Halo lumineux subtil d'arrière-plan */}
          <div className="absolute w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none -top-12 animate-pulse" />

          <motion.div
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative flex flex-col items-center"
          >
            {/* Carte Logo Blanche centrée avec ombre douce */}
            <motion.div
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <AdecLogo size="lg" variant="card" className="rounded-2xl shadow-xl px-6 py-3.5" />
            </motion.div>

            {/* Titre et Sous-titre avec apparition progressive */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
              className="mt-6 text-center"
            >
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                {brandConfig.name}
              </h1>
              <p className="mt-1 text-sm font-medium text-white/90">
                {brandConfig.subtitle}
              </p>
            </motion.div>

            {/* Barre de progression élégante */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 140, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.7, ease: 'easeInOut' }}
              className="h-1 bg-white/30 rounded-full mt-7 overflow-hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.1,
                  ease: 'easeInOut',
                }}
                className="w-1/2 h-full bg-white rounded-full shadow-sm"
              />
            </motion.div>
          </motion.div>

          {/* Mention de bas d'écran */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="absolute bottom-8 text-xs font-medium text-white/80 tracking-wide"
          >
            {brandConfig.restrictedAccessText}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
