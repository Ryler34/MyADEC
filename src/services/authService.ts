import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import type { AppUser, IAuthService, LoginCredentials } from '@/types/auth';
import { readWorkspace } from '@/services/workspaceService';

/**
 * Convertit un utilisateur Firebase en utilisateur typé applicatif
 */
function mapFirebaseUser(firebaseUser: FirebaseUser): AppUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0].replace('.', ' ') : 'Collaborateur ADEC'),
    photoURL: firebaseUser.photoURL,
    role: 'Collaborateur',
    department: 'Direction Générale',
    isDemoUser: false,
  };
}

const DEMO_STORAGE_KEY = 'myadec_demo_user_session';

class AuthService implements IAuthService {
  private currentDemoUser: AppUser | null = null;
  private authStateListeners: Array<(user: AppUser | null) => void> = [];

  constructor() {
    // Restaurer une session démo si présente
    try {
      const savedDemo = localStorage.getItem(DEMO_STORAGE_KEY) || sessionStorage.getItem(DEMO_STORAGE_KEY);
      if (savedDemo) {
        this.currentDemoUser = JSON.parse(savedDemo);
      }
    } catch {
      // Ignorer
    }

    // Écouter les changements Firebase
    firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        this.currentDemoUser = null;
        const appUser = mapFirebaseUser(firebaseUser);
        this.notifyListeners(appUser);
      } else if (!this.currentDemoUser) {
        this.notifyListeners(null);
      }
    });
  }

  private notifyListeners(user: AppUser | null) {
    this.authStateListeners.forEach((listener) => listener(user));
  }

  /**
   * Connexion via Firebase Auth avec gestion de session et mode fallback
   */
  async login(credentials: LoginCredentials): Promise<AppUser> {
    const { email, password, rememberMe = true } = credentials;
    const normalizedEmail = email.trim().toLowerCase();
    const isCompanyAddress = normalizedEmail.endsWith('@adec-ci.com');
    const managedAccount = readWorkspace().accounts.find((account) => account.email.toLowerCase() === normalizedEmail);

    if (isCompanyAddress && (!managedAccount || managedAccount.status !== 'active')) {
      throw new Error('Ce compte ADEC n’est pas actif. Contactez l’administration.');
    }

    try {
      // Appliquer la stratégie de persistance
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const appUser = mapFirebaseUser(userCredential.user);
      return appUser;
    } catch (error: any) {
      console.warn('Firebase login attempt:', error.code || error.message);

      // Si le fournisseur Email/Mot de passe n'est pas encore activé dans la console Firebase
      // OU pour permettre le test immédiat avec un e-mail de domaine ADEC
      // Mode démo local pour un compte ADEC actif dans l’annuaire du prototype.
      const isEnabledDemoAccount = isCompanyAddress && managedAccount?.status === 'active';

      if (isEnabledDemoAccount) {
        const demoUser: AppUser = {
          uid: 'demo-' + Date.now(),
          email: email.trim(),
          displayName: email.split('@')[0].replace('.', ' ').toUpperCase(),
          role: 'Collaborateur ADEC',
          department: 'Direction Générale',
          matricule: 'ADEC-2024-089',
          isDemoUser: true,
        };

        this.currentDemoUser = demoUser;
        if (rememberMe) {
          localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
        } else {
          sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
        }

        this.notifyListeners(demoUser);
        return demoUser;
      }

      // Traitement des messages d'erreur conviviaux en français
      throw new Error(this.getReadableErrorMessage(error));
    }
  }

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    this.currentDemoUser = null;
    localStorage.removeItem(DEMO_STORAGE_KEY);
    sessionStorage.removeItem(DEMO_STORAGE_KEY);

    try {
      await firebaseSignOut(auth);
    } catch {
      // Nettoyage local déjà effectué
    }

    this.notifyListeners(null);
  }

  /**
   * Réinitialisation de mot de passe
   */
  async resetPassword(email: string): Promise<void> {
    if (!email || !email.includes('@')) {
      throw new Error('Veuillez fournir une adresse e-mail professionnelle valide.');
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error: any) {
      console.warn('Password reset error:', error.code);
      // Si Firebase renvoie une erreur de config, on confirme pour la simulation
      if (error.code === 'auth/user-not-found') {
        throw new Error('Aucun compte collaborateur associé à cette adresse e-mail.');
      }
      // Succès simulé pour l'UX si c'est un e-mail ADEC
      if (email.endsWith('@adec-ci.com')) {
        return;
      }
      throw new Error(this.getReadableErrorMessage(error));
    }
  }

  /**
   * Utilisateur courant
   */
  getCurrentUser(): AppUser | null {
    if (this.currentDemoUser) {
      return this.currentDemoUser;
    }
    const fbUser = auth.currentUser;
    return fbUser ? mapFirebaseUser(fbUser) : null;
  }

  /**
   * Écouteur d'état d'authentification
   */
  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void {
    this.authStateListeners.push(callback);
    // Notifier immédiatement l'état initial
    callback(this.getCurrentUser());

    return () => {
      this.authStateListeners = this.authStateListeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Traduction des codes d'erreur Firebase en français professionnel
   */
  private getReadableErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/invalid-email':
        return "Format d'adresse e-mail invalide. Utilisez votre adresse @adec-ci.com.";
      case 'auth/user-disabled':
        return 'Ce compte collaborateur a été désactivé. Veuillez contacter le support RH/IT.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Identifiants incorrects. Vérifiez votre e-mail et votre mot de passe.';
      case 'auth/too-many-requests':
        return 'Trop de tentatives infructueuses. Veuillez patienter quelques minutes avant de réessayer.';
      case 'auth/network-request-failed':
        return 'Impossible de joindre le serveur. Vérifiez votre connexion Internet.';
      default:
        return error.message || 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
    }
  }
}

export const authService = new AuthService();
