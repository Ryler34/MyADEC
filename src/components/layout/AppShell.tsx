import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { NavigationDrawer } from './NavigationDrawer';
import { PageTransition } from './PageTransition';

export const AppShell: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-[#F4F7FB] text-slate-800">
      {/* Barre latérale Desktop */}
      <DesktopSidebar />

      {/* Tiroir latéral Mobile / Tablette */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Conteneur principal */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* En-tête mobile */}
        <MobileHeader onOpenDrawer={() => setIsDrawerOpen(true)} />

        {/* Zone de contenu dynamique avec transition de page */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>

      {/* Navigation inférieure Mobile (5 menus officiels ADEC) */}
      <MobileBottomNav />
    </div>
  );
};
