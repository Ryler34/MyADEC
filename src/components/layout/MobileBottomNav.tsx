import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Star, Users, Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  // Les 5 menus officiels issus de la maquette ADEC
  const navItems = [
    { label: 'Accueil', path: '/', icon: Home },
    { label: 'Valeurs', path: '/valeurs', icon: Star },
    { label: 'Annuaire', path: '/annuaire', icon: Users },
    { label: 'Agenda', path: '/agenda', icon: Calendar },
    { label: 'Documents', path: '/documents', icon: FileText },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-slate-200/90 safe-bottom shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'relative flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors select-none',
                isActive ? 'text-[#139BD7]' : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-150',
                    isActive ? 'stroke-[2.4px] text-[#139BD7]' : 'stroke-[1.8px] text-slate-500'
                  )}
                />
              </div>
              <span
                className={cn(
                  'mt-1 font-semibold tracking-tight transition-colors',
                  isActive ? 'text-[#139BD7] font-bold' : 'text-slate-600'
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
