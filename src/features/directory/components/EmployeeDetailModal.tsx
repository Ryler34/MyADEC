import React, { useEffect } from 'react';
import { BriefcaseBusiness, Building2, Mail, MapPin, MessageCircle, Phone, UserRound, X } from 'lucide-react';
import type { Employee } from '@/types';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  onMessage: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ employee, onClose, onMessage }) => {
  useEffect(() => {
    if (!employee) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [employee, onClose]);

  if (!employee) return null;

  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="employee-profile-title" className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 to-blue-800 px-6 pb-6 pt-7 text-white">
          <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25" aria-label="Fermer le profil"><X className="h-4 w-4" /></button>
          <div className="flex items-center gap-4 pr-8">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-xl font-extrabold text-sky-700">{initials}{employee.avatarUrl && <img src={employee.avatarUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />}</div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-100">Profil collaborateur</p>
              <h2 id="employee-profile-title" className="mt-1 text-xl font-extrabold">{employee.fullName}</h2>
              <p className="mt-0.5 text-sm text-white/85">{employee.role}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {employee.bio && <p className="text-sm leading-relaxed text-slate-600">{employee.bio}</p>}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-3.5"><span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-400"><Building2 className="h-3.5 w-3.5" /> Direction</span><p className="mt-1.5 text-sm font-semibold text-slate-800">{employee.direction} · {employee.department}</p></div>
            <div className="rounded-2xl bg-slate-50 p-3.5"><span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-400"><BriefcaseBusiness className="h-3.5 w-3.5" /> Matricule</span><p className="mt-1.5 text-sm font-semibold text-slate-800">{employee.matricule}</p></div>
            <div className="rounded-2xl bg-slate-50 p-3.5"><span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-400"><MapPin className="h-3.5 w-3.5" /> Bureau</span><p className="mt-1.5 text-sm font-semibold text-slate-800">{employee.office}</p></div>
            <div className="rounded-2xl bg-slate-50 p-3.5"><span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-400"><UserRound className="h-3.5 w-3.5" /> Statut</span><p className="mt-1.5 flex items-center gap-2 text-sm font-semibold capitalize text-slate-800"><span className={`h-2 w-2 rounded-full ${employee.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />{employee.status === 'online' ? 'En ligne' : 'Hors ligne'}</p></div>
          </div>
          {employee.joinDate && <p className="text-xs text-slate-400">Chez ADEC depuis le {employee.joinDate}</p>}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <a href={`mailto:${employee.email}`} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#139BD7] px-4 text-sm font-bold text-white hover:bg-sky-700"><Mail className="h-4 w-4" /> Envoyer un e-mail</a>
            <button type="button" onClick={() => { onClose(); onMessage(employee); }} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-violet-700 hover:bg-violet-50"><MessageCircle className="h-4 w-4" /> Message</button>
            <a href={`tel:${(employee.mobile || employee.phone).replaceAll(' ', '')}`} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"><Phone className="h-4 w-4" /> Appeler</a>
          </div>
        </div>
      </section>
    </div>
  );
};
