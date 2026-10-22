export * from './auth';

// Navigation
export interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  badge?: string | number;
  isPrimary?: boolean;
}

// Collaborateurs / Annuaire
export interface Employee {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  department: string;
  direction: string;
  email: string;
  phone: string;
  mobile: string;
  office: string;
  avatarUrl?: string;
  status: 'online' | 'offline';
  bio?: string;
  joinDate?: string;
}

// Actualités internes
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Flash Info' | 'Projet' | 'RH & Vie d’entreprise' | 'Innovation' | 'Sécurité';
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  coverImage?: string;
  isFeatured?: boolean;
  likesCount?: number;
  commentsCount?: number;
}

// Communications Direction Générale
export interface LeadershipMessage {
  id: string;
  title: string;
  excerpt: string;
  fullMessage: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  date: string;
  isImportant?: boolean;
  attachedDocs?: Array<{
    name: string;
    url: string;
    size: string;
  }>;
}

// Missions et Valeurs
export interface CompanyValue {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  colorScheme: 'blue' | 'orange' | 'navy' | 'emerald';
}

export interface CompanyMission {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
}

// Agenda & Événements
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'reunion' | 'formation' | 'seminaire' | 'celebration' | 'direction';
  organizer: string;
  isMandatory?: boolean;
}

// Documents internes
export interface InternalDocument {
  id: string;
  title: string;
  category:
    | 'Ressources Humaines'
    | 'Procédures & Métiers'
    | 'Chartes & Éthique'
    | 'Modèles & Formulaires'
    | 'Sécurité & IT';
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx';
  fileSize: string;
  updatedAt: string;
  downloadUrl: string;
  issuer: string;
  description?: string;
}
