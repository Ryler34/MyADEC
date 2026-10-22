import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppUser, LoginCredentials } from '@/types/auth';
import { authService } from '@/services/authService';
import { applyUserProfile, saveProfile, setPresence, type UserProfile } from '@/services/workspaceService';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: UserProfile) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => applyUserProfile(authService.getCurrentUser()));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      setUser(applyUserProfile(currentUser));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const email = user?.email?.trim().toLowerCase();
    if (!email) return;
    const heartbeat = () => setPresence(email, true);
    const offline = () => setPresence(email, false);
    heartbeat();
    const timer = window.setInterval(heartbeat, 15_000);
    window.addEventListener('pagehide', offline);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('pagehide', offline);
      offline();
    };
  }, [user?.email]);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const loggedUser = applyUserProfile(await authService.login(credentials));
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const updateProfile = (profile: UserProfile) => {
    if (!user?.email) return;
    saveProfile(user.email, profile);
    setUser((currentUser) => currentUser ? { ...currentUser, ...profile } : currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        resetPassword,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
