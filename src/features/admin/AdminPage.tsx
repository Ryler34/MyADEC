import React, { useMemo, useState } from 'react';
import { Bell, CalendarDays, FileText, LogOut, Megaphone, Plus, ShieldCheck, Trash2, Users, Video } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { useWorkspace } from '@/hooks/useWorkspace';
import { publishNotification, removeAccount, removeAnnouncement, removeDocument, removeEvent, removeVideo, saveAccount, saveAnnouncement, saveDocument, saveEvent, saveVideo, workspaceId, type NotificationKind } from '@/services/workspaceService';
import { deleteDocumentFile, saveDocumentFile } from '@/services/documentFileService';
import { documentCategories } from '@/data/documentsData';
import type { InternalDocument } from '@/types';
import { AdecInlineLoader } from '@/components/brand/AdecLoader';

type AdminTab = 'Comptes' | 'Publications' | 'Documents' | 'Agenda' | 'Notifications';
const tabs: AdminTab[] = ['Comptes', 'Publications', 'Documents', 'Agenda', 'Notifications'];

const fieldClass = 'h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100';
const labelClass = 'mb-1.5 block text-xs font-bold text-slate-600';

export const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const workspace = useWorkspace();
  const [activeTab, setActiveTab] = useState<AdminTab>('Comptes');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const [accountForm, setAccountForm] = useState({ displayName: '', email: '', role: 'Collaborateur', department: 'DG', matricule: '' });
  const [announcementForm, setAnnouncementForm] = useState({ title: '', body: '', recipient: 'all' });
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '', recipient: 'all', kind: 'information' as NotificationKind });
  const [videoForm, setVideoForm] = useState({ title: '', description: '', url: '', thumbnailUrl: '' });
  const [documentForm, setDocumentForm] = useState({ title: '', category: documentCategories[0] as InternalDocument['category'], fileType: 'pdf' as InternalDocument['fileType'], fileSize: '', issuer: '', description: '' });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSavingDocument, setIsSavingDocument] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '2026-10-30', startTime: '09:00', endTime: '10:00', type: 'direction' as 'direction' | 'formation' | 'celebration' | 'seminaire', typeLabel: 'Direction', location: 'Siège ADEC', organizer: 'Direction Générale', isVirtual: false });

  const activeAccounts = useMemo(() => workspace.accounts.filter((account) => account.status === 'active').length, [workspace.accounts]);
  const resetMessages = () => { setNotice(''); setError(''); };
  const success = (message: string) => { setError(''); setNotice(message); };
  const fail = (caught: unknown) => { setNotice(''); setError(caught instanceof Error ? caught.message : 'Une erreur est survenue.'); };
  const confirmRemove = (description: string, action: () => void) => {
    if (window.confirm(`Supprimer ${description} ?`)) {
      action();
      success('La ressource a été supprimée.');
    }
  };

  const createAccount = (event: React.FormEvent) => {
    event.preventDefault();
    resetMessages();
    try {
      const newAccount = saveAccount({ ...accountForm, email: accountForm.email.trim().toLowerCase(), matricule: accountForm.matricule || `ADEC-${new Date().getFullYear()}-${String(workspace.accounts.length + 1).padStart(3, '0')}`, status: 'active' });
      publishNotification({ title: 'Votre compte collaborateur est prêt', message: `Un espace MyADEC Pro a été préparé pour ${newAccount.displayName}.`, kind: 'system', recipient: newAccount.email.toLowerCase() });
      setAccountForm({ displayName: '', email: '', role: 'Collaborateur', department: 'DG', matricule: '' });
      success('Le compte de démonstration a été ajouté à l’annuaire.');
    } catch (caught) { fail(caught); }
  };

  const publishAnnouncement = (event: React.FormEvent) => {
    event.preventDefault();
    resetMessages();
    saveAnnouncement({ title: announcementForm.title.trim(), body: announcementForm.body.trim(), author: user?.displayName || 'Administration', recipient: announcementForm.recipient });
    publishNotification({ title: announcementForm.title.trim(), message: announcementForm.body.trim(), kind: 'information', recipient: announcementForm.recipient });
    setAnnouncementForm({ title: '', body: '', recipient: 'all' });
    success('L’information est publiée et une notification a été envoyée à la cible choisie.');
  };

  const sendNotification = (event: React.FormEvent) => {
    event.preventDefault();
    resetMessages();
    publishNotification({ title: notificationForm.title.trim(), message: notificationForm.message.trim(), kind: notificationForm.kind, recipient: notificationForm.recipient });
    setNotificationForm({ title: '', message: '', recipient: 'all', kind: 'information' });
    success('La notification a été enregistrée pour le destinataire sélectionné.');
  };

  const publishVideo = (event: React.FormEvent) => {
    event.preventDefault();
    resetMessages();
    saveVideo({ ...videoForm, author: user?.displayName || 'Administration', thumbnailUrl: videoForm.thumbnailUrl || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=960&auto=format&fit=crop&q=80' });
    publishNotification({ title: 'Nouvelle vidéo disponible', message: videoForm.title.trim(), kind: 'video', recipient: 'all' });
    setVideoForm({ title: '', description: '', url: '', thumbnailUrl: '' });
    success('La vidéo est publiée. Les collaborateurs la verront dans l’espace Vidéos.');
  };

  const publishDocument = async (event: React.FormEvent) => {
    event.preventDefault();
    resetMessages();
    if (!documentFile) {
      setError('Sélectionnez le fichier à publier.');
      return;
    }
    setIsSavingDocument(true);
    try {
      const fileSize = documentForm.fileSize || (documentFile.size >= 1024 * 1024
        ? `${(documentFile.size / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`
        : `${Math.max(1, Math.round(documentFile.size / 1024))} Ko`);
      const documentId = workspaceId();
      const saved = saveDocument({ ...documentForm, id: documentId, fileSize, updatedAt: new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date()), downloadUrl: `workspace-file://${documentId}` });
      await saveDocumentFile(saved.id, documentFile);
      const stateAfterSave = { ...documentForm };
      setDocumentForm({ title: '', category: documentCategories[0] as InternalDocument['category'], fileType: 'pdf', fileSize: '', issuer: '', description: '' });
      setDocumentFile(null);
      if (stateAfterSave.title) publishNotification({ title: 'Nouveau document disponible', message: stateAfterSave.title.trim(), kind: 'document', recipient: 'all' });
      success('Le document et son fichier sont publiés dans l’espace Documents.');
    } catch (caught) {
      fail(caught);
    } finally {
      setIsSavingDocument(false);
    }
  };

  const publishEvent = (event: React.FormEvent) => {
    event.preventDefault();
    resetMessages();
    saveEvent(eventForm);
    publishNotification({ title: 'Nouvel événement à l’agenda', message: `${eventForm.title} · ${eventForm.date} à ${eventForm.startTime}`, kind: 'agenda', recipient: 'all' });
    setEventForm((current) => ({ ...current, title: '', description: '' }));
    success('L’événement est ajouté à l’agenda et les collaborateurs en sont informés.');
  };

  return (
    <div className="mx-auto min-h-screen w-full min-w-0 max-w-6xl space-y-6 overflow-x-hidden bg-[#F4F7FB] px-3 py-4 pb-12 sm:px-5 sm:py-6 lg:px-8">
      <header className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 p-5 text-white shadow-lg sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="flex min-w-0 items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10"><ShieldCheck className="h-6 w-6 text-sky-300" /></span><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">Administration ADEC</p><h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Pilotage de l’application</h1><p className="mt-1 text-sm text-white/70">Espace de gestion réservé à l’administrateur.</p></div></div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <span className="mr-1 text-xs font-semibold text-white/70">{user?.displayName || 'Administrateur'}</span>
            <Link to="/" className="rounded-xl border border-white/20 px-3 py-2 text-xs font-bold text-white hover:bg-white/10">Portail collaborateur</Link>
            <button type="button" onClick={() => { void logout().then(() => navigate('/login')); }} className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-sky-50"><LogOut className="h-3.5 w-3.5" />Déconnexion</button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat icon={<Users className="h-4 w-4" />} label="Comptes actifs" value={activeAccounts} />
          <Stat icon={<Bell className="h-4 w-4" />} label="Notifications" value={workspace.notifications.length} />
          <Stat icon={<Video className="h-4 w-4" />} label="Vidéos" value={workspace.videos.length} />
          <Stat icon={<FileText className="h-4 w-4" />} label="Documents" value={workspace.documents.length} />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Outils d’administration">
        {tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => { setActiveTab(tab); resetMessages(); }} className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeTab === tab ? 'bg-[#139BD7] text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>{tab}</button>)}
      </div>

      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {activeTab === 'Comptes' && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Panel title="Créer un compte collaborateur" icon={<Plus className="h-4 w-4" />}>
            <form onSubmit={createAccount} className="space-y-3">
              <label><span className={labelClass}>Nom complet</span><input required value={accountForm.displayName} onChange={(event) => setAccountForm({ ...accountForm, displayName: event.target.value })} className={fieldClass} placeholder="Ex. Aminata Koné" /></label>
              <label><span className={labelClass}>E-mail professionnel</span><input required type="email" value={accountForm.email} onChange={(event) => setAccountForm({ ...accountForm, email: event.target.value })} className={fieldClass} placeholder="prenom.nom@adec-ci.com" /></label>
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2"><label className="min-w-0"><span className={labelClass}>Fonction / rôle</span><input required value={accountForm.role} onChange={(event) => setAccountForm({ ...accountForm, role: event.target.value })} className={fieldClass} /></label><label className="min-w-0"><span className={labelClass}>Direction</span><select value={accountForm.department} onChange={(event) => setAccountForm({ ...accountForm, department: event.target.value })} className={fieldClass}>{['DG', 'Finance', 'IT & Digital', 'RH', 'Risques', 'Opérations', 'Com'].map((item) => <option key={item}>{item}</option>)}</select></label></div>
              <label><span className={labelClass}>Matricule <span className="font-normal text-slate-400">(facultatif)</span></span><input value={accountForm.matricule} onChange={(event) => setAccountForm({ ...accountForm, matricule: event.target.value })} className={fieldClass} placeholder="Généré automatiquement si vide" /></label>
              <button className="h-11 w-full rounded-xl bg-[#139BD7] text-sm font-bold text-white hover:bg-sky-700">Ajouter le compte</button>
              <p className="text-[11px] leading-relaxed text-slate-400">Mode prototype : la fiche est créée dans le stockage local. La création d’identifiants Firebase nécessitera le service serveur sécurisé.</p>
            </form>
          </Panel>

          <Panel title={`Comptes enregistrés (${workspace.accounts.length})`} icon={<Users className="h-4 w-4" />}>
            <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
              {workspace.accounts.map((account) => <div key={account.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
                <Avatar name={account.displayName} photoURL={workspace.profiles[account.email.toLowerCase()]?.photoURL} />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{account.displayName}</p><p className="truncate text-xs text-slate-500">{account.email} · {account.role}</p><p className="mt-0.5 text-[10px] text-slate-400">{account.department} · {account.matricule}</p></div>
                {account.id !== 'adec-admin' && <button type="button" onClick={() => { if (window.confirm(`Supprimer la fiche de ${account.displayName} ?`)) { removeAccount(account.id); success('Le compte a été retiré de la liste active.'); } }} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Supprimer ${account.displayName}`} title="Supprimer le compte"><Trash2 className="h-4 w-4" /></button>}
              </div>)}
            </div>
          </Panel>
        </div>
      )}

      {activeTab === 'Publications' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Publier une information" icon={<Megaphone className="h-4 w-4" />}>
            <form onSubmit={publishAnnouncement} className="space-y-3">
              <label><span className={labelClass}>Titre</span><input required value={announcementForm.title} onChange={(event) => setAnnouncementForm({ ...announcementForm, title: event.target.value })} className={fieldClass} placeholder="Information à partager" /></label>
              <label><span className={labelClass}>Contenu</span><textarea required rows={4} value={announcementForm.body} onChange={(event) => setAnnouncementForm({ ...announcementForm, body: event.target.value })} className={`${fieldClass} h-auto py-3`} placeholder="Rédigez l’information destinée aux équipes…" /></label>
              <RecipientSelect accounts={workspace.accounts} value={announcementForm.recipient} onChange={(recipient) => setAnnouncementForm({ ...announcementForm, recipient })} />
              <button className="h-11 w-full rounded-xl bg-[#139BD7] text-sm font-bold text-white hover:bg-sky-700">Publier et notifier</button>
            </form>
            <div className="mt-5 border-t border-slate-100 pt-4"><h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Dernières publications</h3>{workspace.announcements.slice(0, 5).map((item) => <div key={item.id} className="flex items-start gap-2 border-b border-slate-100 py-2 last:border-0"><div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-700">{item.title}</p><p className="line-clamp-2 text-xs text-slate-500">{item.body}</p></div><button type="button" onClick={() => confirmRemove(`« ${item.title} »`, () => removeAnnouncement(item.id))} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Supprimer la publication"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div>
          </Panel>
          <Panel title="Publier une vidéo" icon={<Video className="h-4 w-4" />}>
            <form onSubmit={publishVideo} className="space-y-3">
              <label><span className={labelClass}>Titre de la vidéo</span><input required value={videoForm.title} onChange={(event) => setVideoForm({ ...videoForm, title: event.target.value })} className={fieldClass} placeholder="Ex. Le mot du Directeur Général" /></label>
              <label><span className={labelClass}>Lien vidéo (YouTube ou MP4)</span><input required type="url" value={videoForm.url} onChange={(event) => setVideoForm({ ...videoForm, url: event.target.value })} className={fieldClass} placeholder="https://…" /></label>
              <label><span className={labelClass}>Description / aperçu</span><textarea required rows={3} value={videoForm.description} onChange={(event) => setVideoForm({ ...videoForm, description: event.target.value })} className={`${fieldClass} h-auto py-3`} placeholder="Présentez la vidéo avant lecture…" /></label>
              <label><span className={labelClass}>Image de couverture (URL facultative)</span><input type="url" value={videoForm.thumbnailUrl} onChange={(event) => setVideoForm({ ...videoForm, thumbnailUrl: event.target.value })} className={fieldClass} placeholder="Une image par défaut sera utilisée" /></label>
              <button className="h-11 w-full rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-700">Publier la vidéo</button>
            </form>
            {workspace.videos.length > 0 && <div className="mt-4 border-t border-slate-100 pt-3"><h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Vidéos publiées</h3>{workspace.videos.map((video) => <div key={video.id} className="flex items-center gap-2 border-b border-slate-100 py-2 last:border-0"><p className="flex-1 truncate text-xs font-semibold text-slate-700">{video.title}</p><button type="button" onClick={() => confirmRemove(`la vidéo « ${video.title} »`, () => removeVideo(video.id))} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Supprimer la vidéo"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div>}
          </Panel>
        </div>
      )}

      {activeTab === 'Documents' && <Panel title="Ajouter un document" icon={<FileText className="h-4 w-4" />}>
        <form onSubmit={publishDocument} className="grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className={labelClass}>Titre</span><input required value={documentForm.title} onChange={(event) => setDocumentForm({ ...documentForm, title: event.target.value })} className={fieldClass} /></label>
          <label><span className={labelClass}>Catégorie</span><select value={documentForm.category} onChange={(event) => setDocumentForm({ ...documentForm, category: event.target.value as InternalDocument['category'] })} className={fieldClass}>{documentCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className={labelClass}>Format</span><select value={documentForm.fileType} onChange={(event) => setDocumentForm({ ...documentForm, fileType: event.target.value as InternalDocument['fileType'] })} className={fieldClass}>{['pdf', 'docx', 'xlsx', 'pptx'].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className={labelClass}>Taille indicative</span><input value={documentForm.fileSize} onChange={(event) => setDocumentForm({ ...documentForm, fileSize: event.target.value })} className={fieldClass} placeholder="2,4 Mo" /></label>
          <label><span className={labelClass}>Émetteur</span><input required value={documentForm.issuer} onChange={(event) => setDocumentForm({ ...documentForm, issuer: event.target.value })} className={fieldClass} placeholder="Direction des Ressources Humaines" /></label>
          <label className="sm:col-span-2"><span className={labelClass}>Description</span><textarea rows={3} value={documentForm.description} onChange={(event) => setDocumentForm({ ...documentForm, description: event.target.value })} className={`${fieldClass} h-auto py-3`} /></label>
          <label className="sm:col-span-2"><span className={labelClass}>Fichier à publier</span><input required type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={(event) => { const file = event.target.files?.[0] || null; setDocumentFile(file); if (file) { const extension = file.name.split('.').pop()?.toLowerCase(); setDocumentForm((current) => ({ ...current, fileType: extension === 'doc' ? 'docx' : extension === 'xls' ? 'xlsx' : extension === 'ppt' ? 'pptx' : (['pdf', 'docx', 'xlsx', 'pptx'].includes(extension || '') ? extension as InternalDocument['fileType'] : current.fileType) })); } }} className={`${fieldClass} py-2`} />{documentFile && <span className="mt-1 block text-[11px] text-emerald-700">{documentFile.name} · fichier prêt</span>}</label>
          <p className="sm:col-span-2 text-[11px] text-slate-400">Le fichier est conservé dans le stockage du navigateur sur cet appareil. Le stockage partagé sera raccordé au backend sécurisé.</p>
          <button disabled={isSavingDocument} className="h-11 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-80 sm:col-span-2">{isSavingDocument ? <AdecInlineLoader message="Publication en cours…" /> : 'Ajouter aux documents'}</button>
        </form>
        <div className="mt-5 border-t border-slate-100 pt-4"><h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Documents publiés</h3>{workspace.documents.map((document) => <div key={document.id} className="flex items-center gap-2 border-b border-slate-100 py-2 last:border-0"><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-700">{document.title}</p><p className="text-[10px] text-slate-400">{document.category} · {document.fileType.toUpperCase()}</p></div><button type="button" onClick={() => confirmRemove(`« ${document.title} »`, () => { removeDocument(document.id); if (document.downloadUrl.startsWith('workspace-file://')) void deleteDocumentFile(document.downloadUrl.slice('workspace-file://'.length)); })} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Supprimer le document"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div>
      </Panel>}

      {activeTab === 'Agenda' && <Panel title="Enrichir l’agenda" icon={<CalendarDays className="h-4 w-4" />}>
        <form onSubmit={publishEvent} className="grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className={labelClass}>Nom de l’événement</span><input required value={eventForm.title} onChange={(event) => setEventForm({ ...eventForm, title: event.target.value })} className={fieldClass} /></label>
          <label><span className={labelClass}>Date</span><input required type="date" value={eventForm.date} onChange={(event) => setEventForm({ ...eventForm, date: event.target.value })} className={fieldClass} /></label>
          <label><span className={labelClass}>Type</span><select value={eventForm.type} onChange={(event) => setEventForm({ ...eventForm, type: event.target.value as typeof eventForm.type, typeLabel: event.target.selectedOptions[0].text })} className={fieldClass}><option value="direction">Direction</option><option value="formation">Formation</option><option value="celebration">Célébration</option><option value="seminaire">Séminaire</option></select></label>
          <label><span className={labelClass}>Début</span><input required type="time" value={eventForm.startTime} onChange={(event) => setEventForm({ ...eventForm, startTime: event.target.value })} className={fieldClass} /></label>
          <label><span className={labelClass}>Fin</span><input required type="time" value={eventForm.endTime} onChange={(event) => setEventForm({ ...eventForm, endTime: event.target.value })} className={fieldClass} /></label>
          <label><span className={labelClass}>Lieu ou lien</span><input required value={eventForm.location} onChange={(event) => setEventForm({ ...eventForm, location: event.target.value })} className={fieldClass} /></label>
          <label><span className={labelClass}>Organisateur</span><input required value={eventForm.organizer} onChange={(event) => setEventForm({ ...eventForm, organizer: event.target.value })} className={fieldClass} /></label>
          <label className="sm:col-span-2"><span className={labelClass}>Description</span><textarea rows={3} value={eventForm.description} onChange={(event) => setEventForm({ ...eventForm, description: event.target.value })} className={`${fieldClass} h-auto py-3`} /></label>
          <button className="h-11 rounded-xl bg-orange-600 text-sm font-bold text-white hover:bg-orange-700 sm:col-span-2">Ajouter à l’agenda</button>
        </form>
        <div className="mt-5 border-t border-slate-100 pt-4"><h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Événements planifiés</h3>{workspace.events.map((event) => <div key={event.id} className="flex items-center gap-2 border-b border-slate-100 py-2 last:border-0"><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-700">{event.title}</p><p className="text-[10px] text-slate-400">{event.date} · {event.startTime} · {event.location}</p></div><button type="button" onClick={() => confirmRemove(`« ${event.title} »`, () => removeEvent(event.id))} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Supprimer l’événement"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div>
      </Panel>}

      {activeTab === 'Notifications' && <Panel title="Envoyer une notification ciblée" icon={<Bell className="h-4 w-4" />}>
        <form onSubmit={sendNotification} className="max-w-2xl space-y-3">
          <label><span className={labelClass}>Titre</span><input required value={notificationForm.title} onChange={(event) => setNotificationForm({ ...notificationForm, title: event.target.value })} className={fieldClass} placeholder="Titre de la notification" /></label>
          <label><span className={labelClass}>Message</span><textarea required rows={4} value={notificationForm.message} onChange={(event) => setNotificationForm({ ...notificationForm, message: event.target.value })} className={`${fieldClass} h-auto py-3`} placeholder="Message à transmettre…" /></label>
          <div className="grid gap-3 sm:grid-cols-2"><label><span className={labelClass}>Type</span><select value={notificationForm.kind} onChange={(event) => setNotificationForm({ ...notificationForm, kind: event.target.value as NotificationKind })} className={fieldClass}>{[['information', 'Information'], ['rh', 'Ressources humaines'], ['agenda', 'Agenda'], ['document', 'Document'], ['video', 'Vidéo'], ['system', 'Service']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><RecipientSelect accounts={workspace.accounts} value={notificationForm.recipient} onChange={(recipient) => setNotificationForm({ ...notificationForm, recipient })} /></div>
          <button className="h-11 rounded-xl bg-[#139BD7] px-5 text-sm font-bold text-white hover:bg-sky-700">Envoyer la notification</button>
          <p className="text-[11px] leading-relaxed text-slate-400">Les notifications sont conservées dans ce prototype avec leur destinataire. FCM sera connecté ultérieurement pour la diffusion sur appareils.</p>
        </form>
      </Panel>}
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => <div className="rounded-2xl bg-white/10 p-3"><span className="flex items-center gap-2 text-[10px] font-semibold text-white/70">{icon}{label}</span><strong className="mt-1 block text-xl text-white">{value}</strong></div>;

const Panel: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-slate-800">{icon}{title}</h2>{children}</section>;

const Avatar: React.FC<{ name: string; photoURL?: string | null }> = ({ name, photoURL }) => <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-xs font-extrabold text-sky-700">{photoURL ? <img src={photoURL} alt="" className="h-full w-full object-cover" /> : name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>;

const RecipientSelect: React.FC<{ accounts: ReturnType<typeof useWorkspace>['accounts']; value: string; onChange: (value: string) => void }> = ({ accounts, value, onChange }) => <label><span className={labelClass}>Destinataire</span><select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}><option value="all">Tous les collaborateurs</option>{accounts.filter((account) => account.status === 'active' && account.id !== 'adec-admin').map((account) => <option key={account.id} value={account.email.toLowerCase()}>{account.displayName} · {account.department}</option>)}</select></label>;

