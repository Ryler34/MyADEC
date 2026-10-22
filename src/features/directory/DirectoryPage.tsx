import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, BriefcaseBusiness, Mail, MapPin, MessageCircle, Phone, Search, Users } from 'lucide-react';
import type { Employee } from '@/types';
import { employeeDirections, employees } from '@/data/directoryData';
import { useWorkspace } from '@/hooks/useWorkspace';
import { accountToEmployee, isRecentlyOnline } from '@/services/workspaceService';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');

export const DirectoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('Toutes');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const workspace = useWorkspace();
  const navigate = useNavigate();

  const directoryEmployees = useMemo(() => workspace.accounts
    .filter((account) => account.status === 'active' && account.id !== 'adec-admin' && account.email.toLowerCase() !== 'admin@adec-ci.com')
    .map((account) => {
      const base = employees.find((employee) => employee.email.toLowerCase() === account.email.toLowerCase()) || accountToEmployee(account);
      const photoURL = workspace.profiles[account.email.toLowerCase()]?.photoURL;
      return { ...base, avatarUrl: photoURL ?? base.avatarUrl, status: isRecentlyOnline(account.email, workspace.presence) ? 'online' as const : 'offline' as const };
    }), [workspace.accounts, workspace.presence, workspace.profiles]);

  const filteredEmployees = useMemo(() => {
    const query = normalize(searchQuery.trim());
    return directoryEmployees.filter((employee) => normalize([
      employee.firstName, employee.lastName, employee.fullName, employee.role,
      employee.direction, employee.department, employee.matricule, employee.office,
    ].join(' ')).includes(query) && (selectedDirection === 'Toutes' || employee.direction === selectedDirection) && (!onlineOnly || employee.status === 'online'));
  }, [directoryEmployees, onlineOnly, searchQuery, selectedDirection]);

  const clearFilters = () => { setSearchQuery(''); setSelectedDirection('Toutes'); setOnlineOnly(false); };

  return (
    <div className="space-y-6 pb-12">
      <header>
        <div className="flex items-center gap-2 text-[#139BD7]"><Users className="h-6 w-6" /><span className="text-xs font-bold uppercase tracking-[0.16em]">Espace collaborateurs</span></div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">Annuaire des Collaborateurs</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">Retrouvez rapidement un collègue par son nom, son métier, sa direction ou son matricule.</p>
      </header>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Filtres de l’annuaire">
        <label className="relative block"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Nom, fonction, direction, matricule…" className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" aria-label="Rechercher un collaborateur" /></label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">{['Toutes', ...employeeDirections].map((direction) => <button key={direction} type="button" onClick={() => setSelectedDirection(direction)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${selectedDirection === direction ? 'bg-[#139BD7] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700'}`}>{direction}</button>)}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3"><label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600"><input type="checkbox" checked={onlineOnly} onChange={(event) => setOnlineOnly(event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-[#139BD7]" /><span className="h-2 w-2 rounded-full bg-emerald-500" />En ligne uniquement</label><div className="flex items-center gap-3 text-xs text-slate-500"><span><strong className="text-slate-800">{filteredEmployees.length}</strong> collaborateur{filteredEmployees.length === 1 ? '' : 's'}</span>{(searchQuery || selectedDirection !== 'Toutes' || onlineOnly) && <button type="button" onClick={clearFilters} className="font-semibold text-sky-700 hover:underline">Effacer les filtres</button>}</div></div>
      </section>

      {filteredEmployees.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><Search className="mx-auto h-8 w-8 text-slate-300" /><h2 className="mt-3 font-bold text-slate-800">Aucun collaborateur trouvé</h2><p className="mt-1 text-sm text-slate-500">Modifiez la recherche ou retirez un filtre pour voir les résultats.</p><button type="button" onClick={clearFilters} className="mt-4 rounded-xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 hover:bg-sky-100">Réinitialiser</button></div> : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredEmployees.map((employee) => (
          <article key={employee.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
            <div className="p-4 sm:p-5"><div className="flex items-start gap-3"><div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-sky-100 text-lg font-extrabold text-sky-700"><span className="absolute inset-0 flex items-center justify-center">{employee.firstName[0]}{employee.lastName[0]}</span>{employee.avatarUrl && <img src={employee.avatarUrl} alt="" className="relative h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}<span className={`absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${employee.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} title={employee.status === 'online' ? 'En ligne' : 'Hors ligne'} /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h2 className="truncate font-extrabold text-slate-800">{employee.fullName}</h2><p className="mt-0.5 line-clamp-2 text-xs font-medium leading-relaxed text-slate-500">{employee.role}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${employee.status === 'online' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{employee.status === 'online' ? 'En ligne' : 'Hors ligne'}</span></div></div></div>
              <div className="mt-4 space-y-2 text-xs text-slate-500"><div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 shrink-0 text-sky-600" /><span className="font-semibold text-slate-700">{employee.direction}</span><span className="truncate">· {employee.department}</span></div><div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" /><span className="truncate">{employee.office}</span></div><div className="flex items-center gap-2"><BriefcaseBusiness className="h-3.5 w-3.5 shrink-0 text-slate-400" /><span>Matricule {employee.matricule}</span></div></div>
            </div>
            <div className="grid grid-cols-4 border-t border-slate-100 bg-slate-50/70 p-1.5 sm:p-2"><a href={`mailto:${employee.email}`} className="flex min-h-10 items-center justify-center gap-1 rounded-xl text-[11px] font-bold text-sky-700 hover:bg-sky-50 sm:text-xs" aria-label={`Envoyer un e-mail à ${employee.fullName}`}><Mail className="h-3.5 w-3.5" /><span className="hidden min-[380px]:inline">E-mail</span></a><button type="button" onClick={() => navigate(`/messages?to=${encodeURIComponent(employee.email)}`)} className="flex min-h-10 items-center justify-center gap-1 rounded-xl text-[11px] font-bold text-violet-700 hover:bg-violet-50 sm:text-xs" aria-label={`Envoyer un message à ${employee.fullName}`}><MessageCircle className="h-3.5 w-3.5" /><span className="hidden min-[380px]:inline">Message</span></button><a href={`tel:${(employee.mobile || employee.phone).replaceAll(' ', '')}`} className="flex min-h-10 items-center justify-center gap-1 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-white sm:text-xs" aria-label={`Appeler ${employee.fullName}`}><Phone className="h-3.5 w-3.5" /><span className="hidden min-[380px]:inline">Appeler</span></a><button type="button" onClick={() => setSelectedEmployee(employee)} className="flex min-h-10 items-center justify-center gap-1 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-white sm:text-xs" aria-label={`Voir le profil de ${employee.fullName}`}>Profil</button></div>
          </article>
        ))}</div>
      )}
      <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} onMessage={(employee) => navigate(`/messages?to=${encodeURIComponent(employee.email)}`)} />
    </div>
  );
};
