import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, FileText, Megaphone, Trash2, Video, CalendarDays, Circle, MessageCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useWorkspace } from '@/hooks/useWorkspace';
import { deleteNotification, getNotificationsFor, markAllNotificationsRead, markNotificationRead, userKey, type AppNotification, type NotificationFilter } from '@/services/workspaceService';

const kindLabels = {
  information: 'Information',
  rh: 'Ressources humaines',
  agenda: 'Agenda',
  document: 'Document',
  video: 'Vidéo',
  message: 'Message',
  system: 'Service',
} as const;

const kindIcons = {
  information: Megaphone,
  rh: Bell,
  agenda: CalendarDays,
  document: FileText,
  video: Video,
  message: MessageCircle,
  system: Bell,
} as const;

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const workspace = useWorkspace();
  const [filter, setFilter] = useState<NotificationFilter>('Toutes');
  const [kindFilter, setKindFilter] = useState('Tous les types');
  const recipient = user || { email: null, uid: 'anonymous' };
  const key = userKey(recipient);

  const notifications = useMemo(() => getNotificationsFor(recipient), [key, workspace]);
  const filteredNotifications = notifications.filter((notification) => {
    const isRead = notification.readBy.includes(key);
    return (filter === 'Toutes' || (filter === 'Lues' ? isRead : !isRead)) &&
      (kindFilter === 'Tous les types' || kindLabels[notification.kind] === kindFilter);
  });
  const unreadCount = notifications.filter((notification) => !notification.readBy.includes(key)).length;
  const availableKinds = Array.from(new Set(notifications.map((item) => kindLabels[item.kind])));

  const handleOpen = (notification: AppNotification) => {
    if (!notification.readBy.includes(key)) markNotificationRead(notification.id, recipient);
    if (notification.kind === 'video') navigate('/videos');
    else if (notification.kind === 'agenda') navigate('/agenda');
    else if (notification.kind === 'document') navigate('/documents');
    else if (notification.kind === 'message') {
      const latest = workspace.messages.filter((message) => message.recipientEmail.toLowerCase() === key && message.body.startsWith(notification.message.slice(0, 80))).sort((a, b) => b.sentAt.localeCompare(a.sentAt))[0];
      navigate(latest ? `/messages?to=${encodeURIComponent(latest.senderEmail)}` : '/messages');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-[#139BD7]"><Bell className="h-6 w-6" /><span className="text-xs font-bold uppercase tracking-[0.16em]">Centre de notifications</span></div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">Vos notifications</h1>
          <p className="mt-1 text-sm text-slate-500">Les notifications personnelles et celles adressées à toute l’équipe apparaissent ici.</p>
        </div>
        <span className="w-fit rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700">{unreadCount} non lue{unreadCount === 1 ? '' : 's'}</span>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {(['Toutes', 'Non lues', 'Lues'] as NotificationFilter[]).map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${filter === item ? 'bg-[#139BD7] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{item}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={kindFilter} onChange={(event) => setKindFilter(event.target.value)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none focus:border-sky-400" aria-label="Filtrer par type de notification">
            <option>Tous les types</option>
            {availableKinds.map((kind) => <option key={kind}>{kind}</option>)}
          </select>
          {unreadCount > 0 && <button type="button" onClick={() => markAllNotificationsRead(recipient)} className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-sky-700 hover:bg-sky-50"><CheckCheck className="h-4 w-4" />Tout lire</button>}
        </div>
      </section>

      {filteredNotifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <Bell className="mx-auto h-9 w-9 text-slate-300" />
          <h2 className="mt-3 font-bold text-slate-800">Aucune notification dans ce filtre</h2>
          <p className="mt-1 text-sm text-slate-500">Les nouveaux messages apparaîtront ici lorsqu’ils vous seront adressés.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const isRead = notification.readBy.includes(key);
            const Icon = kindIcons[notification.kind];
            return (
              <article key={notification.id} className={`rounded-2xl border bg-white p-4 transition sm:p-5 ${isRead ? 'border-slate-200' : 'border-sky-200 shadow-sm'}`}>
                <div className="flex items-start gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isRead ? 'bg-slate-100 text-slate-500' : 'bg-sky-50 text-[#139BD7]'}`}><Icon className="h-5 w-5" /></span>
                  <button type="button" onClick={() => handleOpen(notification)} className="min-w-0 flex-1 text-left">
                    <span className="flex flex-wrap items-center gap-2">
                      <strong className="text-sm font-extrabold text-slate-800">{notification.title}</strong>
                      {!isRead && <Circle className="h-2 w-2 fill-sky-500 text-sky-500" aria-label="Non lue" />}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-600">{notification.message}</span>
                    <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400"><span className="font-semibold text-slate-500">{kindLabels[notification.kind]}</span><span>·</span><time>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(notification.createdAt))}</time></span>
                  </button>
                  <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                    <button type="button" onClick={() => markNotificationRead(notification.id, recipient, !isRead)} className="rounded-lg p-2 text-slate-400 hover:bg-sky-50 hover:text-sky-700" title={isRead ? 'Marquer comme non lue' : 'Marquer comme lue'} aria-label={isRead ? 'Marquer comme non lue' : 'Marquer comme lue'}>{isRead ? <Circle className="h-4 w-4" /> : <CheckCheck className="h-4 w-4" />}</button>
                    <button type="button" onClick={() => deleteNotification(notification.id, recipient)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Supprimer" aria-label="Supprimer la notification"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
