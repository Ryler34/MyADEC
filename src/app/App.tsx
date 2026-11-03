import React, { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthContext';
import { SplashScreen } from '@/components/brand/SplashScreen';
import { router } from './router';
import { PwaProvider } from '@/features/pwa/PwaProvider';

export const App: React.FC = () => {
  // Détecter si le Splash Screen a déjà été présenté durant cette session
  const [showSplash, setShowSplash] = useState(() => {
    // Si l'utilisateur actualise complètement la page, le splash s'affiche
    // On peut utiliser sessionStorage pour éviter de réafficher lors de navigations
    return !sessionStorage.getItem('myadec_splash_displayed');
  });

  const handleSplashFinish = () => {
    sessionStorage.setItem('myadec_splash_displayed', 'true');
    setShowSplash(false);
  };

  return (
    <AuthProvider>
      <PwaProvider>
        {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
        <RouterProvider router={router} />
      </PwaProvider>
    </AuthProvider>
  );
};

export default App;
