import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Star, Users, Calendar, FileText, LogOut, Search, Bell, UserRound, ShieldCheck, Video, MessageCircle } from 'lucide-react';
import { AdecLogo } from '@/components/brand/AdecLogo';
import { useAuth } from '@/features/auth/AuthContext';
import { brandConfig } from '@/config/brand';
import { cn } from '@/lib/utils';

export const DesktopSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  // Les 5 menus officiels de l'application
  const navItems = [
    { label: 'Accueil', path: '/', icon: Home },
    { label: 'Valeurs', path: '/valeurs', icon: Star },
    { label: 'Annuaire', path: '/annuaire', icon: Users },
    { label: 'Agenda', path: '/agenda', icon: Calendar },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Vidéos', path: '/videos', icon: Video },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Messages', path: '/messages', icon: MessageCircle },
    { label: 'Mon profil', path: '/profile', icon: UserRound },
    ...(user?.role === 'Administrateur' ? [{ label: 'Administration', path: '/admin', icon: ShieldCheck }] : []),
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 xl:w-72 bg-white border-r border-slate-200/80 h-screen sticky top-0 z-20 flex-shrink-0 select-none">
      <div className="flex flex-col p-5">
        {/* En-tête : Logo ADEC bien visible & Nom de la marque */}
        <div className="flex items-center gap-3 px-2 py-2 mb-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-2 flex items-center justify-center">
            <AdecLogo size="sm" imgClassName="h-9 w-auto" />
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold text-slate-800 text-sm tracking-tight truncate">
              {brandConfig.name}
            </h2>
            <p className="text-[11px] font-medium text-slate-400 truncate">
              Espace Collaborateurs
            </p>
          </div>
        </div>

        {/* Barre de recherche rapide */}
        <div className="relative mb-5 px-1">
          <input
            type="text"
            placeholder="Rechercher (collaborateur, doc...)"
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#139BD7] focus:bg-white transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Liens de navigation officiels */}
        <nav className="space-y-1 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-sky-50 text-[#139BD7] font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-[#139BD7] stroke-[2.4px]' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Section Utilisateur & Déconnexion en bas */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        {user && (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <NavLink to="/profile" className="w-9 h-9 rounded-full bg-[#139BD7] text-white font-bold flex items-center justify-center text-xs flex-shrink-0 overflow-hidden" aria-label="Mon profil">
                {user.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full object-cover" /> : user.displayName?.charAt(0).toUpperCase() || 'A'}
              </NavLink>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {user.displayName}
                </p>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  {user.department || 'ADEC'}
                </p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Se déconnecter"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
              aria-label="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
