import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Bell, CheckCircle2, Download, RefreshCw, Share, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const INSTALLED_KEY = 'myadec_pwa_installed';
const NOTIFICATION_CHOICE_KEY = 'myadec_pwa_notification_choice';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PwaContextValue {
  installed: boolean;
  installApp: () => Promise<void>;
}

const PwaContext = createContext<PwaContextValue | undefined>(undefined);

const isRunningStandalone = () => {
  if (typeof window === 'undefined') return false;
  const iosNavigator = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || iosNavigator.standalone === true;
};

const readStoredFlag = (key: string) => {
  try { return localStorage.getItem(key) === 'true'; } catch { return false; }
};

const readStorageValue = (key: string) => {
  try { return localStorage.getItem(key); } catch { return null; }
};

const saveStorageValue = (key: string, value: string) => {
  try { localStorage.setItem(key, value); } catch { /* Le navigateur peut bloquer le stockage local. */ }
};

export const PwaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deferredPrompt = useRef<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => isRunningStandalone() || readStoredFlag(INSTALLED_KEY));
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const markInstalled = () => {
      setInstalled(true);
      saveStorageValue(INSTALLED_KEY, 'true');
      deferredPrompt.current = null;
    };
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt.current = event as InstallPromptEvent;
      setInstalled(false);
      saveStorageValue(INSTALLED_KEY, 'false');
    };
    const handleAppInstalled = () => markInstalled();
    const displayMode = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => { if (isRunningStandalone()) markInstalled(); };

    if (isRunningStandalone()) markInstalled();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);
    displayMode.addEventListener('change', handleDisplayModeChange);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
      displayMode.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  useEffect(() => {
    if (!installed || typeof Notification === 'undefined') return;
    if (Notification.permission !== 'default' || readStorageValue(NOTIFICATION_CHOICE_KEY)) return;
    const timer = window.setTimeout(() => setShowNotificationPrompt(true), 2200);
    return () => window.clearTimeout(timer);
  }, [installed]);

  const installApp = useCallback(async () => {
    const promptEvent = deferredPrompt.current;
    if (!promptEvent) {
      setShowInstallHelp(true);
      return;
    }
    deferredPrompt.current = null;
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
        saveStorageValue(INSTALLED_KEY, 'true');
      }
    } catch {
      setShowInstallHelp(true);
    }
  }, []);

  const requestNotifications = async () => {
    if (typeof Notification === 'undefined') {
      setNotificationMessage('Les notifications ne sont pas prises en charge par ce navigateur.');
      saveStorageValue(NOTIFICATION_CHOICE_KEY, 'unsupported');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        saveStorageValue(NOTIFICATION_CHOICE_KEY, 'granted');
        setNotificationMessage('Les notifications sont autorisées sur cet appareil.');
        try {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification('ADEC Ensemble', {
            body: 'Les notifications sont activées sur cet appareil.',
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
          });
        } catch {
          // L’autorisation reste enregistrée même si le service worker n’est pas disponible.
        }
      } else {
        saveStorageValue(NOTIFICATION_CHOICE_KEY, permission);
        setNotificationMessage(permission === 'denied'
          ? 'Les notifications sont bloquées dans les réglages du navigateur.'
          : 'Tu pourras activer les notifications plus tard.');
      }
    } catch {
      setNotificationMessage('Impossible d’activer les notifications sur cet appareil.');
    }
  };

  return (
    <PwaContext.Provider value={{ installed, installApp }}>
      {children}
      {showInstallHelp && <InstallHelpDialog onClose={() => setShowInstallHelp(false)} />}
      {showNotificationPrompt && <NotificationDialog
        message={notificationMessage}
        onEnable={() => { void requestNotifications().then(() => setShowNotificationPrompt(false)); }}
        onLater={() => { saveStorageValue(NOTIFICATION_CHOICE_KEY, 'later'); setShowNotificationPrompt(false); }}
      />}
      <PwaUpdateNotice />
    </PwaContext.Provider>
  );
};

export const usePwa = () => {
  const context = useContext(PwaContext);
  if (!context) throw new Error('usePwa must be used inside PwaProvider');
  return context;
};

const InstallHelpDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMacSafari = /Macintosh/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Edg/.test(navigator.userAgent);
  return <Dialog onClose={onClose}>
    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-[#139BD7]"><Download className="h-6 w-6" /></span>
    <h2 className="mt-4 text-center text-lg font-extrabold text-slate-800">Installer ADEC Ensemble</h2>
    {isIos ? <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600"><p>Dans Safari, touche <strong>Partager</strong> <Share className="inline h-4 w-4 align-[-3px]" />, puis <strong>Sur l’écran d’accueil</strong> et <strong>Ajouter</strong>.</p><p className="mt-2 text-xs text-slate-500">Si tu ne vois pas cette option, ouvre d’abord cette page dans Safari.</p></div> : isMacSafari ? <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600"><p>Dans Safari sur Mac, ouvre le menu <strong>Fichier</strong>, puis choisis <strong>Ajouter au Dock</strong>.</p></div> : <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600"><p>Ouvre le menu de ton navigateur et choisis <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.</p><p className="mt-2 text-xs text-slate-500">Sur ordinateur, l’option peut aussi apparaître dans la barre d’adresse.</p></div>}
    <button type="button" onClick={onClose} className="mt-4 h-11 w-full rounded-xl bg-[#139BD7] text-sm font-bold text-white hover:bg-sky-700">Compris</button>
  </Dialog>;
};

const NotificationDialog: React.FC<{ message: string; onEnable: () => void; onLater: () => void }> = ({ message, onEnable, onLater }) => (
  <Dialog onClose={onLater}>
    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-[#139BD7]"><Bell className="h-6 w-6" /></span>
    <h2 className="mt-4 text-center text-lg font-extrabold text-slate-800">Activer les notifications ?</h2>
    <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">Autorise ADEC Ensemble à t’alerter lorsqu’une notification est disponible.</p>
    {message && <p role="status" className="mt-3 text-center text-xs font-semibold text-sky-700">{message}</p>}
    <div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={onLater} className="h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">Plus tard</button><button type="button" onClick={onEnable} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#139BD7] text-sm font-bold text-white hover:bg-sky-700"><Bell className="h-4 w-4" />Activer</button></div>
  </Dialog>
);

const Dialog: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => (
  <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
      <button type="button" onClick={onClose} aria-label="Fermer" className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
      {children}
    </section>
  </div>
);

const PwaUpdateNotice: React.FC = () => {
  const { needRefresh: [needRefresh, setNeedRefresh], offlineReady: [offlineReady, setOfflineReady], updateServiceWorker } = useRegisterSW();
  if (!needRefresh && !offlineReady) return null;
  const close = () => { setNeedRefresh(false); setOfflineReady(false); };
  return <div className="fixed bottom-4 left-4 right-4 z-[110] mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-sky-100 bg-white p-3 shadow-xl sm:bottom-6 sm:left-auto sm:right-6">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#139BD7]">{needRefresh ? <RefreshCw className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}</span>
    <p className="min-w-0 flex-1 text-xs font-semibold leading-relaxed text-slate-700">{needRefresh ? 'Une nouvelle version d’ADEC Ensemble est disponible.' : 'ADEC Ensemble est prête à fonctionner hors connexion.'}</p>
    {needRefresh ? <button type="button" onClick={() => void updateServiceWorker(true)} className="shrink-0 rounded-xl bg-[#139BD7] px-3 py-2 text-xs font-bold text-white">Mettre à jour</button> : <button type="button" onClick={close} className="shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100">OK</button>}
    {needRefresh && <button type="button" onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Fermer"><X className="h-4 w-4" /></button>}
  </div>;
};
