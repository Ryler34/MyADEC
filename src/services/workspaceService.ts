import type { AppUser } from '@/types/auth';
import type { Employee, InternalDocument } from '@/types';
import { employees } from '@/data/directoryData';
import { internalDocuments } from '@/data/documentsData';
import { mockEvents, type CompanyEvent } from '@/data/calendarData';

const STORAGE_KEY = 'myadec_workspace_v1';
const UPDATE_EVENT = 'myadec-workspace-update';

export type NotificationKind = 'information' | 'rh' | 'agenda' | 'document' | 'video' | 'message' | 'system';
export type NotificationFilter = 'Toutes' | 'Non lues' | 'Lues';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  kind: NotificationKind;
  recipient: string;
  createdAt: string;
  readBy: string[];
  deletedBy: string[];
}

export interface ManagedAccount {
  id: string;
  email: string;
  displayName: string;
  role: string;
  department: string;
  matricule: string;
  status: 'active' | 'disabled';
  phone?: string;
  mobile?: string;
  office?: string;
}

export interface DirectMessage {
  id: string;
  threadId: string;
  senderEmail: string;
  senderName: string;
  recipientEmail: string;
  recipientName: string;
  body: string;
  sentAt: string;
  readBy: string[];
}

export interface PresenceRecord {
  lastSeenAt: number;
}

export interface VideoPost {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  author: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  recipient: string;
  createdAt: string;
}

export interface UserProfile {
  displayName?: string;
  photoURL?: string | null;
  department?: string;
  role?: string;
}

export interface WorkspaceState {
  accounts: ManagedAccount[];
  notifications: AppNotification[];
  documents: InternalDocument[];
  events: CompanyEvent[];
  videos: VideoPost[];
  announcements: Announcement[];
  profiles: Record<string, UserProfile>;
  messages: DirectMessage[];
  presence: Record<string, PresenceRecord>;
}

const initialAccounts: ManagedAccount[] = employees.map((employee: Employee) => ({
  id: employee.id,
  email: employee.email,
  displayName: employee.fullName,
  role: employee.direction === 'DG' ? 'Administrateur' : employee.role,
  department: employee.direction,
  matricule: employee.matricule,
  status: 'active',
}));

const createInitialState = (): WorkspaceState => ({
  accounts: initialAccounts,
  notifications: [
    {
      id: 'welcome-notification',
      title: 'Bienvenue sur MyADEC Pro',
      message: 'Retrouvez ici les informations, documents et actualités destinés aux collaborateurs.',
      kind: 'information',
      recipient: 'all',
      createdAt: '2026-10-22T08:00:00.000Z',
      readBy: [],
      deletedBy: [],
    },
    {
      id: 'security-notification',
      title: 'Rappel cybersécurité',
      message: 'Ne partagez jamais votre mot de passe et signalez les e-mails suspects au support IT.',
      kind: 'system',
      recipient: 'all',
      createdAt: '2026-10-21T09:30:00.000Z',
      readBy: [],
      deletedBy: [],
    },
  ],
  documents: internalDocuments,
  events: mockEvents,
  videos: [],
  announcements: [],
  profiles: {},
  messages: [],
  presence: {},
});

let memoryState: WorkspaceState | null = null;

export const readWorkspace = (): WorkspaceState => {
  if (memoryState) return memoryState;
  try {
    const rawState = localStorage.getItem(STORAGE_KEY);
    if (rawState) {
      const parsed = JSON.parse(rawState) as Partial<WorkspaceState>;
      const defaults = createInitialState();
      const accounts = (parsed.accounts || defaults.accounts).filter((account) => account.email.toLowerCase() !== 'admin@adec-ci.com' && account.id !== 'adec-admin')
        .map((account) => account.email.toLowerCase() === 'stephane.amon@adec-ci.com' ? { ...account, role: 'Administrateur' } : account);
      memoryState = { ...defaults, ...parsed, accounts } as WorkspaceState;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
      return memoryState;
    }
    memoryState = createInitialState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
  } catch {
    memoryState = createInitialState();
  }
  return memoryState;
};

const writeWorkspace = (nextState: WorkspaceState) => {
  memoryState = nextState;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch (error) {
    console.error('Impossible d’enregistrer les données de démonstration.', error);
  }
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
};

export const subscribeWorkspace = (callback: () => void) => {
  const handleStorage = () => {
    memoryState = null;
    callback();
  };
  window.addEventListener(UPDATE_EVENT, callback);
  window.addEventListener('storage', handleStorage);
  return () => {
    window.removeEventListener(UPDATE_EVENT, callback);
    window.removeEventListener('storage', handleStorage);
  };
};

export const workspaceId = () => `workspace-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
export const userKey = (user: Pick<AppUser, 'email' | 'uid'>) => (user.email || user.uid).trim().toLowerCase();

export const applyUserProfile = (user: AppUser | null): AppUser | null => {
  if (!user) return null;
  const state = readWorkspace();
  const profile = user.email ? state.profiles[user.email.toLowerCase()] : undefined;
  const managedAccount = user.email
    ? state.accounts.find((account) => account.email.toLowerCase() === user.email?.toLowerCase())
    : undefined;
  return {
    ...user,
    displayName: profile?.displayName || managedAccount?.displayName || user.displayName,
    photoURL: profile?.photoURL ?? user.photoURL,
    role: profile?.role || managedAccount?.role || user.role,
    department: profile?.department || managedAccount?.department || user.department,
    matricule: managedAccount?.matricule || user.matricule,
  };
};

export const getNotificationsFor = (user: Pick<AppUser, 'email' | 'uid'>) => {
  const key = userKey(user);
  return readWorkspace().notifications
    .filter((notification) =>
      (notification.recipient === 'all' || notification.recipient.toLowerCase() === key) &&
      !notification.deletedBy.includes(key),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const getUnreadCount = (user: Pick<AppUser, 'email' | 'uid'>) => {
  const key = userKey(user);
  return getNotificationsFor(user).filter((notification) => !notification.readBy.includes(key)).length;
};

export const setPresence = (email: string, online: boolean) => {
  const state = readWorkspace();
  const key = email.trim().toLowerCase();
  const presence = { ...state.presence };
  if (online) presence[key] = { lastSeenAt: Date.now() };
  else delete presence[key];
  writeWorkspace({ ...state, presence });
};

export const isRecentlyOnline = (email: string, presence = readWorkspace().presence) => {
  const record = presence[email.trim().toLowerCase()];
  return !!record && Date.now() - record.lastSeenAt < 45_000;
};

export const createThreadId = (firstEmail: string, secondEmail: string) =>
  [firstEmail.trim().toLowerCase(), secondEmail.trim().toLowerCase()].sort().join('::');

export const sendDirectMessage = (input: Omit<DirectMessage, 'id' | 'threadId' | 'sentAt' | 'readBy'>) => {
  const state = readWorkspace();
  const threadId = createThreadId(input.senderEmail, input.recipientEmail);
  const message: DirectMessage = {
    ...input,
    id: workspaceId(),
    threadId,
    sentAt: new Date().toISOString(),
    readBy: [input.senderEmail.toLowerCase()],
  };
  writeWorkspace({ ...state, messages: [...state.messages, message] });
  publishNotification({
    title: `Nouveau message de ${input.senderName}`,
    message: input.body.length > 110 ? `${input.body.slice(0, 107)}…` : input.body,
    kind: 'message',
    recipient: input.recipientEmail.toLowerCase(),
  });
  return message;
};

export const markThreadRead = (threadId: string, email: string) => {
  const key = email.trim().toLowerCase();
  const state = readWorkspace();
  writeWorkspace({ ...state, messages: state.messages.map((message) =>
    message.threadId === threadId && message.recipientEmail.toLowerCase() === key
      ? { ...message, readBy: Array.from(new Set([...message.readBy, key])) }
      : message,
  ) });
};

export const saveProfile = (email: string, profile: UserProfile) => {
  const state = readWorkspace();
  const key = email.toLowerCase();
  writeWorkspace({ ...state, profiles: { ...state.profiles, [key]: { ...state.profiles[key], ...profile } } });
};

export const publishNotification = (notification: Omit<AppNotification, 'id' | 'createdAt' | 'readBy' | 'deletedBy'>) => {
  const state = readWorkspace();
  const next: AppNotification = { ...notification, id: workspaceId(), createdAt: new Date().toISOString(), readBy: [], deletedBy: [] };
  writeWorkspace({ ...state, notifications: [next, ...state.notifications] });
  return next;
};

export const markNotificationRead = (id: string, user: Pick<AppUser, 'email' | 'uid'>, read = true) => {
  const key = userKey(user);
  const state = readWorkspace();
  writeWorkspace({ ...state, notifications: state.notifications.map((item) => {
    if (item.id !== id) return item;
    return { ...item, readBy: read ? Array.from(new Set([...item.readBy, key])) : item.readBy.filter((entry) => entry !== key) };
  }) });
};

export const markAllNotificationsRead = (user: Pick<AppUser, 'email' | 'uid'>) => {
  const key = userKey(user);
  const state = readWorkspace();
  writeWorkspace({ ...state, notifications: state.notifications.map((item) =>
    item.recipient === 'all' || item.recipient.toLowerCase() === key
      ? { ...item, readBy: Array.from(new Set([...item.readBy, key])) }
      : item,
  ) });
};

export const deleteNotification = (id: string, user: Pick<AppUser, 'email' | 'uid'>) => {
  const key = userKey(user);
  const state = readWorkspace();
  writeWorkspace({ ...state, notifications: state.notifications.map((item) =>
    item.id === id ? { ...item, deletedBy: Array.from(new Set([...item.deletedBy, key])) } : item,
  ) });
};

export const saveAccount = (account: Omit<ManagedAccount, 'id'> & { id?: string }) => {
  const state = readWorkspace();
  const nextAccount: ManagedAccount = { ...account, id: account.id || workspaceId() };
  const exists = state.accounts.some((item) => item.email.toLowerCase() === nextAccount.email.toLowerCase());
  if (exists) throw new Error('Un compte existe déjà pour cette adresse e-mail.');
  writeWorkspace({ ...state, accounts: [nextAccount, ...state.accounts] });
  return nextAccount;
};

export const removeAccount = (id: string) => {
  const state = readWorkspace();
  if (id === 'adec-admin') throw new Error('Le compte administrateur principal ne peut pas être supprimé.');
  writeWorkspace({ ...state, accounts: state.accounts.filter((account) => account.id !== id) });
};

export const saveAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
  const state = readWorkspace();
  const next: Announcement = { ...announcement, id: workspaceId(), createdAt: new Date().toISOString() };
  writeWorkspace({ ...state, announcements: [next, ...state.announcements] });
  return next;
};

export const removeAnnouncement = (id: string) => {
  const state = readWorkspace();
  writeWorkspace({ ...state, announcements: state.announcements.filter((item) => item.id !== id) });
};

export const saveVideo = (video: Omit<VideoPost, 'id' | 'createdAt'>) => {
  const state = readWorkspace();
  const next: VideoPost = { ...video, id: workspaceId(), createdAt: new Date().toISOString() };
  writeWorkspace({ ...state, videos: [next, ...state.videos] });
  return next;
};

export const removeVideo = (id: string) => {
  const state = readWorkspace();
  writeWorkspace({ ...state, videos: state.videos.filter((item) => item.id !== id) });
};

export const saveDocument = (document: Omit<InternalDocument, 'id'> & { id?: string }) => {
  const state = readWorkspace();
  const next = { ...document, id: document.id || workspaceId() };
  writeWorkspace({ ...state, documents: [next, ...state.documents] });
  return next;
};

export const removeDocument = (id: string) => {
  const state = readWorkspace();
  writeWorkspace({ ...state, documents: state.documents.filter((item) => item.id !== id) });
};

export const saveEvent = (event: Omit<CompanyEvent, 'id'>) => {
  const state = readWorkspace();
  const next = { ...event, id: workspaceId() };
  writeWorkspace({ ...state, events: [next, ...state.events] });
  return next;
};

export const removeEvent = (id: string) => {
  const state = readWorkspace();
  writeWorkspace({ ...state, events: state.events.filter((item) => item.id !== id) });
};

export const accountToEmployee = (account: ManagedAccount): Employee => ({
  id: account.id,
  matricule: account.matricule,
  firstName: account.displayName.split(' ')[0] || account.displayName,
  lastName: account.displayName.split(' ').slice(1).join(' '),
  fullName: account.displayName,
  role: account.role,
  department: account.department,
  direction: account.department,
  email: account.email,
  phone: account.phone || '',
  mobile: account.mobile || '',
  office: account.office || 'Siège Plateau',
  status: 'offline',
});
