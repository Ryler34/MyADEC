import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Home,
  Star,
  Users,
  Calendar,
  FileText,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Mail,
  Bell,
  Video,
  UserRound,
  MessageCircle,
} from 'lucide-react';
import { AdecLogo } from '@/components/brand/AdecLogo';
import { useAuth } from '@/features/auth/AuthContext';
import { brandConfig } from '@/config/brand';
import { cn } from '@/lib/utils';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Les 5 menus officiels de l'application
  const links = [
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay avec fondu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Tiroir coulissant */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto"
          >
            <div>
              {/* En-tête du tiroir avec Logo bien visible */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-1.5 flex items-center justify-center">
                    <AdecLogo size="sm" imgClassName="h-7 w-auto" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm tracking-tight">
                    {brandConfig.name}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fiche collaborateur connecté */}
              {user && (
                <button type="button" onClick={() => { onClose(); navigate('/profile'); }} className="w-[calc(100%-2rem)] p-4 mx-4 mt-4 rounded-2xl bg-sky-50 border border-sky-100 text-left hover:bg-sky-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#139BD7] text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0 overflow-hidden">
                      {user.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full object-cover" /> : user.displayName?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-sky-700 font-medium truncate">
                        {user.role || 'Collaborateur ADEC'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-sky-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Session active
                    </span>
                    <span className="font-semibold text-slate-600">{user.department}</span>
                  </div>
                </button>
              )}

              {/* Liste des 5 liens de navigation */}
              <nav className="p-4 space-y-1">
                {links.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all',
                          isActive
                            ? 'bg-[#139BD7] text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon
                              className={cn(
                                'w-5 h-5',
                                isActive ? 'text-white stroke-[2.4px]' : 'text-slate-400 stroke-[1.8px]'
                              )}
                            />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight
                            className={cn(
                              'w-4 h-4',
                              isActive ? 'text-white/80' : 'text-slate-300'
                            )}
                          />
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Pied de tiroir : Support & Déconnexion */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-2">
              <a
                href={`mailto:${brandConfig.contact.supportEmail}`}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Support IT & RH</span>
              </a>

              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50/80 text-red-600 hover:bg-red-100 text-xs font-bold transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
