export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  department?: string;
  role?: string;
  matricule?: string;
  isDemoUser?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
}

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AppUser>;
  loginWithGoogle?(): Promise<AppUser>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void;
  getCurrentUser(): AppUser | null;
}
