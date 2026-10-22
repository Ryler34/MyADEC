import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User } from 'lucide-react';
import { AdecLogo } from '@/components/brand/AdecLogo';
import { useAuth } from '@/features/auth/AuthContext';
import { brandConfig } from '@/config/brand';
import { getUnreadCount } from '@/services/workspaceService';
import { useWorkspace } from '@/hooks/useWorkspace';

interface MobileHeaderProps {
  onOpenDrawer: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenDrawer }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  useWorkspace();
  const unreadCount = user ? getUnreadCount(user) : 0;

  return (
    <header className="sticky top-0 z-30 lg:hidden w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 h-16 flex items-center justify-between safe-top">
      {/* Bouton Menu Drawer */}
      <button
        onClick={onOpenDrawer}
        className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Logo ADEC bien visible & Titre */}
      <div className="flex items-center gap-2.5">
        <div className="bg-white rounded-lg p-1 shadow-xs border border-slate-100 flex items-center justify-center">
          <AdecLogo size="sm" imgClassName="h-7 w-auto" />
        </div>
        <span className="font-bold text-slate-800 text-sm tracking-tight">
          {brandConfig.name}
        </span>
      </div>

      {/* Notifications et Profil */}
      <div className="flex items-center gap-1 -mr-1">
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EA580C] px-1 text-[9px] font-extrabold text-white ring-2 ring-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="w-8 h-8 overflow-hidden rounded-full bg-sky-100 border border-sky-200 text-[#139BD7] flex items-center justify-center font-bold text-xs"
          aria-label="Profil collaborateur"
        >
          {user?.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full object-cover" /> : user?.displayName ? (
            user.displayName.charAt(0).toUpperCase()
          ) : (
            <User className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
