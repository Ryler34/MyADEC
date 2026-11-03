import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { AdecLogo } from '@/components/brand/AdecLogo';
import { AdecInlineLoader } from '@/components/brand/AdecLoader';
import { InstallPwaButton } from '@/features/pwa/InstallPwaButton';
import { useAuth } from './AuthContext';
import { brandConfig } from '@/config/brand';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, resetPassword } = useAuth();

  // États du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // États d'interaction
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Modal Mot de passe oublié
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Soumission de connexion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    // Validations locales
    if (!email.trim()) {
      setErrorMessage('Veuillez renseigner votre adresse e-mail professionnelle.');
      return;
    }

    if (!password) {
      setErrorMessage('Veuillez renseigner votre mot de passe.');
      return;
    }

    setIsLoading(true);

    try {
      await login({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demande de réinitialisation de mot de passe
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (!resetEmail.trim()) {
      setResetError('Veuillez renseigner votre adresse e-mail professionnelle.');
      return;
    }

    setIsResetting(true);
    try {
      await resetPassword(resetEmail.trim());
      setResetSuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setResetSuccess(false);
        setInfoMessage('Un lien de réinitialisation a été envoyé si le compte existe.');
      }, 2500);
    } catch (err: any) {
      setResetError(err.message || 'Impossible d’envoyer le lien de réinitialisation.');
    } finally {
      setIsResetting(false);
    }
  };

  // Remplissage rapide démo pour test immédiat
  const handleQuickFill = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('adec2024*');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#F4F7FB] px-4 py-6 sm:py-10 select-none">
      {/* Arrière-plan décoratif subtil */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl" />
      </div>

      <div className="w-full max-w-[420px] mx-auto flex-1 flex flex-col justify-center relative z-10">
        {/* CARTE DE CONNEXION PRINCIPALE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[2rem] shadow-adec-card border border-slate-100 overflow-hidden"
        >
          {/* BANNIÈRE SUPÉRIEURE BLEUE ADEC */}
          <div className="bg-[#139BD7] px-6 pt-8 pb-7 text-center text-white relative">
            {/* Halo de lumière interne */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

            {/* Pastille Blanche du Logo bien visible et mise en valeur */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-block"
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl px-7 py-4 sm:px-9 sm:py-5 shadow-md inline-flex items-center justify-center min-w-[205px] sm:min-w-[230px] min-h-[82px] sm:min-h-[96px]">
                <AdecLogo size="lg" imgClassName="h-16 sm:h-20 max-w-[280px]" />
              </div>
            </motion.div>

            {/* Titre et Sous-titre officiels */}
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {brandConfig.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-medium text-white/95">
              {brandConfig.subtitle}
            </p>
          </div>

          {/* CORPS DU FORMULAIRE */}
          <div className="p-6 sm:p-8">
            {/* Bannière d'erreur */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
                    <p className="leading-relaxed font-medium">{errorMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bannière d'information */}
            <AnimatePresence>
              {infoMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-600" />
                    <p className="leading-relaxed font-medium">{infoMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Champ Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
                >
                  E-mail professionnel
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="prenom.nom@adec-ci.com"
                    disabled={isLoading}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#139BD7] focus:border-transparent transition-all"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full h-12 px-4 pr-11 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#139BD7] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Se souvenir de moi */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#139BD7] focus:ring-[#139BD7] border-slate-300 accent-[#139BD7]"
                  />
                  <span className="text-xs sm:text-sm text-slate-600 font-medium">
                    Se souvenir de moi
                  </span>
                </label>
              </div>

              {/* Bouton de Connexion Orange ADEC */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#EA580C] hover:bg-[#D95304] active:scale-[0.99] text-white font-semibold text-base rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <AdecInlineLoader message="Connexion…" className="text-white" />
                  ) : (
                    <span>Se connecter</span>
                  )}
                </button>
              </div>

              {/* Lien Mot de passe oublié */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-xs sm:text-sm font-semibold text-[#139BD7] hover:underline focus:outline-none"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </form>

            {/* Test rapide Collaborateur / Démo */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Accès rapide démo / test :
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('jean.kouassi@adec-ci.com')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-medium transition-colors"
                >
                  Jean Kouassi (DG)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('marie.traore@adec-ci.com')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-medium transition-colors"
                >
                  Marie Traoré (RH)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('stephane.amon@adec-ci.com')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition-colors"
                >
                  Stéphane K. Amon (DG · administrateur)
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="flex justify-center">
          <InstallPwaButton />
        </div>
      </div>

      {/* PIED DE PAGE : ACCÈS RÉSERVÉ */}
      <footer className="w-full text-center py-4 relative z-10">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>{brandConfig.restrictedAccessText}</span>
        </div>
      </footer>

      {/* MODAL : MOT DE PASSE OUBLIÉ */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isResetting && setShowForgotModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-7 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">
                  Réinitialiser votre mot de passe
                </h3>
                <button
                  onClick={() => setShowForgotModal(false)}
                  disabled={isResetting}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {resetSuccess ? (
                <div className="py-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm">E-mail envoyé avec succès</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Consultez votre boîte de réception pour réinitialiser votre accès.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="mt-4 space-y-4">
                  <p className="text-xs text-slate-600">
                    Saisissez votre adresse e-mail professionnelle ADEC. Nous vous enverrons un lien
                    sécurisé pour créer un nouveau mot de passe.
                  </p>

                  {resetError && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  <div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="prenom.nom@adec-ci.com"
                      required
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#139BD7]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      disabled={isResetting}
                      className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isResetting}
                      className="flex-1 h-11 rounded-xl bg-[#139BD7] text-white text-xs sm:text-sm font-semibold hover:bg-[#0B72A2] flex items-center justify-center gap-2"
                    >
                      {isResetting ? <AdecInlineLoader message="Envoi…" /> : 'Envoyer le lien'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
