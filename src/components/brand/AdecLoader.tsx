import React from 'react';
import { motion } from 'framer-motion';
import { AdecLogo } from './AdecLogo';
import { brandConfig } from '@/config/brand';

interface AdecLoaderProps {
  message?: string;
}

export const AdecLoader: React.FC<AdecLoaderProps> = ({ message = 'Chargement de votre espace…' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    className="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#139BD7] via-[#108ec7] to-[#0B72A2] px-6 text-white"
    role="status"
    aria-live="polite"
    aria-label={message}
  >
    <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
    <div className="relative flex flex-col items-center text-center">
      <motion.div
        animate={{ y: [0, -5, 0], scale: [1, 1.025, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <AdecLogo size="xl" variant="card" className="rounded-3xl border-white/90 px-9 py-5 shadow-2xl" imgClassName="h-20 sm:h-24" />
      </motion.div>
      <h1 className="mt-6 text-xl font-extrabold tracking-tight text-white sm:text-2xl">{brandConfig.name}</h1>
      <p className="mt-1 text-xs font-medium text-white/75 sm:text-sm">{brandConfig.subtitle}</p>
      <p className="mt-5 text-sm font-semibold tracking-wide text-white/95">{message}</p>
      <div className="mt-4 h-1 w-36 overflow-hidden rounded-full bg-white/25">
        <motion.div
          className="h-full w-1/2 rounded-full bg-white shadow-sm"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  </motion.div>
);

interface AdecInlineLoaderProps {
  message: string;
  className?: string;
}

export const AdecInlineLoader: React.FC<AdecInlineLoaderProps> = ({ message, className = '' }) => (
  <span className={`inline-flex items-center justify-center gap-2 ${className}`} role="status" aria-live="polite">
    <motion.span
      className="inline-flex items-center justify-center"
      animate={{ scale: [1, 0.92, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
    >
      <AdecLogo size="sm" className="rounded bg-white px-1" imgClassName="h-6 max-w-[72px]" />
    </motion.span>
    <span>{message}</span>
  </span>
);
