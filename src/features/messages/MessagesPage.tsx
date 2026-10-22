import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, MessageCircle, Search, Send } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useWorkspace } from '@/hooks/useWorkspace';
import { createThreadId, markThreadRead, sendDirectMessage } from '@/services/workspaceService';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const workspace = useWorkspace();
  const [searchParams, setSearchParams] = useSearchParams();
  const self = user?.email?.trim().toLowerCase() || '';
  const [selectedEmail, setSelectedEmail] = useState(searchParams.get('to')?.toLowerCase() || '');
  const [query, setQuery] = useState('');
  const [body, setBody] = useState('');

  const contacts = useMemo(() => workspace.accounts
    .filter((account) => account.status === 'active' && account.email.toLowerCase() !== self && account.id !== 'adec-admin' && account.email.toLowerCase() !== 'admin@adec-ci.com')
    .map((account) => ({ email: account.email.toLowerCase(), name: workspace.profiles[account.email.toLowerCase()]?.displayName || account.displayName, role: account.role }))
    .filter((contact) => contact.name.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')) || contact.email.includes(query.toLowerCase())), [workspace.accounts, workspace.profiles, self, query]);

  useEffect(() => {
    const requested = searchParams.get('to')?.toLowerCase();
    if (requested && requested !== selectedEmail) setSelectedEmail(requested);
  }, [searchParams, selectedEmail]);

  const selected = workspace.accounts.find((account) => account.email.toLowerCase() === selectedEmail);
  const recipientName = selected ? workspace.profiles[selectedEmail]?.displayName || selected.displayName : selectedEmail;
  const threadId = selectedEmail && self ? createThreadId(self, selectedEmail) : '';
  const thread = workspace.messages.filter((message) => message.threadId === threadId).sort((a, b) => a.sentAt.localeCompare(b.sentAt));

  useEffect(() => {
    if (threadId && thread.some((message) => message.recipientEmail.toLowerCase() === self && !message.readBy.includes(self))) markThreadRead(threadId, self);
  }, [threadId, self, thread]);

  const startChat = (email: string) => {
    setSelectedEmail(email);
    setSearchParams({ to: email });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanBody = body.trim();
    if (!cleanBody || !self || !selectedEmail || !user) return;
    sendDirectMessage({ senderEmail: self, senderName: user.displayName || self, recipientEmail: selectedEmail, recipientName, body: cleanBody });
    setBody('');
  };

  return <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-6xl flex-col gap-4 pb-6">
    <header><div className="flex items-center gap-2 text-[#139BD7]"><MessageCircle className="h-6 w-6" /><span className="text-xs font-bold uppercase tracking-[0.16em]">Échanges directs</span></div><h1 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">Messagerie interne</h1><p className="mt-1 text-sm text-slate-500">Écrivez directement à un collaborateur et poursuivez la conversation dans ce fil.</p></header>
    <div className="grid min-h-[560px] flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-[280px_minmax(0,1fr)]">
      <aside className={`${selectedEmail ? 'hidden md:flex' : 'flex'} min-w-0 flex-col border-r border-slate-100`}>
        <div className="border-b border-slate-100 p-4"><h2 className="font-bold text-slate-800">Collaborateurs</h2><label className="relative mt-3 block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-sky-400" /></label></div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">{contacts.map((contact) => {
          const id = createThreadId(self, contact.email);
          const messages = workspace.messages.filter((message) => message.threadId === id);
          const latest = messages[messages.length - 1];
          const unread = messages.filter((message) => message.recipientEmail.toLowerCase() === self && !message.readBy.includes(self)).length;
          return <button key={contact.email} type="button" onClick={() => startChat(contact.email)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${selectedEmail === contact.email ? 'bg-sky-50' : 'hover:bg-slate-50'}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">{contact.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-slate-800">{contact.name}</span><span className="block truncate text-xs text-slate-500">{latest?.body || contact.role}</span></span>{unread > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1 text-[10px] font-bold text-white">{unread}</span>}</button>;
        })}{contacts.length === 0 && <p className="p-4 text-sm text-slate-500">Aucun collaborateur trouvé.</p>}</div>
      </aside>
      <section className={`${selectedEmail ? 'flex' : 'hidden md:flex'} min-w-0 flex-col`}>
        {selectedEmail ? <><header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 sm:px-6"><button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden" onClick={() => { setSelectedEmail(''); setSearchParams({}); }} aria-label="Retour à la liste"><ArrowLeft className="h-5 w-5" /></button><div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">{recipientName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div className="min-w-0"><h2 className="truncate font-bold text-slate-800">{recipientName}</h2><p className="truncate text-xs text-slate-500">{selected?.email}</p></div></header>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4 sm:p-6">{thread.length === 0 ? <div className="flex h-full min-h-48 items-center justify-center text-center"><div><MessageCircle className="mx-auto h-8 w-8 text-slate-300"/><p className="mt-3 text-sm font-semibold text-slate-600">Démarrez votre conversation avec {recipientName}</p></div></div> : thread.map((message) => { const mine = message.senderEmail.toLowerCase() === self; return <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${mine ? 'rounded-br-md bg-[#139BD7] text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'}`}><p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.body}</p><time className={`mt-1 block text-right text-[10px] ${mine ? 'text-white/70' : 'text-slate-400'}`}>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(message.sentAt))}</time></div></div>; })}</div>
          <form onSubmit={submit} className="border-t border-slate-100 bg-white p-3 sm:p-4"><div className="flex items-end gap-2"><textarea value={body} onChange={(event) => setBody(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={2} maxLength={4000} placeholder="Écrire un message…" className="max-h-36 min-h-12 flex-1 resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:bg-white"/><button type="submit" disabled={!body.trim()} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#139BD7] text-white hover:bg-sky-700 disabled:opacity-40" aria-label="Envoyer le message"><Send className="h-4 w-4"/></button></div></form>
        </> : <div className="flex flex-1 items-center justify-center p-6 text-center"><div><MessageCircle className="mx-auto h-10 w-10 text-slate-300"/><h2 className="mt-3 font-bold text-slate-700">Choisissez un collaborateur</h2><p className="mt-1 text-sm text-slate-500">Vos conversations apparaîtront ici.</p></div></div>}
      </section>
    </div>
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0"/><div><p className="text-sm font-bold">Confidentialité des échanges</p><p className="mt-1 text-xs leading-relaxed">Cette version de démonstration conserve les messages dans le stockage local du navigateur. Le chiffrement de bout en bout n’est pas encore activé : ne partagez pas d’informations sensibles.</p></div></div>
  </div>;
};
