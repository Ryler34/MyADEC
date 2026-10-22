import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Video,
  Bell,
  Check,
  CalendarCheck,
} from 'lucide-react';
import type { CompanyEvent } from '@/data/calendarData';
import { useWorkspace } from '@/hooks/useWorkspace';

export const CalendarPage: React.FC = () => {
  // Mois et année actuellement affichés
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 22)); // 22 Octobre 2026
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-22');

  // Suivi des rappels programmés par l'utilisateur
  const [reminderSetEvents, setReminderSetEvents] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const workspace = useWorkspace();
  const events = workspace.events;

  // Navigation mois
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date(2026, 9, 22);
    setCurrentDate(today);
    setSelectedDate('2026-10-22');
  };

  // Calcul des jours du mois
  const { monthName, year, startDayOffset, daysArray } = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();

    const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long' });
    const name = monthFormatter.format(currentDate);

    // Jour de la semaine du 1er jour (0=dimanche, on convertit pour 0=lundi)
    const firstDay = new Date(y, m, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    const totalDays = new Date(y, m + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= totalDays; i++) {
      const monthStr = String(m + 1).padStart(2, '0');
      const dayStr = String(i).padStart(2, '0');
      days.push(`${y}-${monthStr}-${dayStr}`);
    }

    return {
      monthName: name,
      year: y,
      startDayOffset: offset,
      daysArray: days,
    };
  }, [currentDate]);

  // Événements du jour sélectionné
  const eventsForSelectedDay = useMemo(() => {
    return events.filter((evt) => evt.date === selectedDate);
  }, [events, selectedDate]);

  // Map des dates qui ont des événements
  const eventsByDate = useMemo(() => {
    const map: Record<string, CompanyEvent[]> = {};
    events.forEach((evt) => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [events]);

  // Déclencher un rappel la veille
  const handleToggleReminder = (eventId: string, eventTitle: string) => {
    const current = !!reminderSetEvents[eventId];
    const newState = !current;

    setReminderSetEvents((prev) => ({
      ...prev,
      [eventId]: newState,
    }));

    if (newState) {
      setToastMessage(`Rappel activé : vous recevrez une notification la veille de « ${eventTitle} »`);
    } else {
      setToastMessage(`Rappel désactivé pour « ${eventTitle} »`);
    }

    setTimeout(() => setToastMessage(null), 3500);
  };

  const getEventBadgeColor = (type: CompanyEvent['type']) => {
    switch (type) {
      case 'direction':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'formation':
        return 'bg-sky-100 text-[#139BD7] border-sky-200';
      case 'celebration':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'seminaire':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Formatter de date lisible pour la sélection
  const selectedDateFormatted = useMemo(() => {
    const parts = selectedDate.split('-');
    if (parts.length !== 3) return selectedDate;
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  }, [selectedDate]);

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* 1. EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-[#EA580C]" />
            Agenda & Événements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Consultez les réunions d'équipe, formations et comités institutionnels ADEC.
          </p>
        </div>

        {/* Rappel veille - Information prototype */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#EA580C] self-start sm:self-auto">
          <Bell className="w-3.5 h-3.5" />
          <span>Rappels SMS / Push automatiques la veille</span>
        </div>
      </div>

      {/* TOAST NOTIFICATION RAPPEL */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2.5"
          >
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DISPOSITION DOUBLE PANNEAU : CALENDRIER + LISTE D'ÉVÉNEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANNEAU GAUCHE : LE CALENDRIER MENSUEL (7 cols sur desktop) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-adec-card space-y-5">
          {/* Barre de navigation du mois */}
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-xl font-extrabold text-slate-800 capitalize">
              {monthName} {year}
            </h2>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToday}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Aujourd'hui
              </button>
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Mois précédent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Mois suivant"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grille des jours de la semaine */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 pb-2 border-b border-slate-100">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Grille des jours du mois */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Décalage du début de mois */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="aspect-square" />
            ))}

            {/* Jours actifs */}
            {daysArray.map((dateStr) => {
              const dayNum = parseInt(dateStr.split('-')[2]);
              const isSelected = dateStr === selectedDate;
              const hasEvents = !!eventsByDate[dateStr]?.length;
              const isToday = dateStr === '2026-10-22';

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center text-xs sm:text-sm font-bold transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#139BD7] text-white shadow-md scale-105'
                      : isToday
                      ? 'bg-sky-50 text-[#139BD7] border border-sky-300 font-extrabold'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{dayNum}</span>

                  {/* Pastille indiquant un événement */}
                  {hasEvents && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        isSelected ? 'bg-amber-300' : 'bg-[#EA580C]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Légende rapide sous le calendrier */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
              <span>Jour avec événements</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Aujourd'hui (22 Oct)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-md bg-[#139BD7]" />
              <span>Jour sélectionné</span>
            </div>
          </div>
        </div>

        {/* PANNEAU DROIT : ÉVÉNEMENTS DU JOUR SÉLECTIONNÉ (5 cols sur desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-adec-card space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Programme du jour
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 capitalize mt-0.5">
                {selectedDateFormatted}
              </h3>
            </div>

            {/* ÉTAT VIDE : Aucun événement prévu pour ce jour */}
            {eventsForSelectedDay.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">
                  Aucun événement ce jour-là
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Aucune réunion collective ou formation n'est inscrite à cette date.
                </p>
                <button
                  onClick={() => setSelectedDate('2026-10-22')}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 text-[#139BD7] text-xs font-bold hover:bg-sky-100 transition-colors mt-2"
                >
                  Voir les événements d'aujourd'hui
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {eventsForSelectedDay.map((event) => {
                  const isReminderActive = !!reminderSetEvents[event.id];

                  return (
                    <div
                      key={event.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all space-y-3"
                    >
                      {/* Badge et Heure */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getEventBadgeColor(
                            event.type
                          )}`}
                        >
                          {event.typeLabel}
                        </span>

                        <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-[#139BD7]" />
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                      </div>

                      {/* Titre & Description */}
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                          {event.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      {/* Lieu / Lien Visio */}
                      <div className="text-xs text-slate-500 flex items-start gap-2 pt-2 border-t border-slate-200/60">
                        {event.isVirtual ? (
                          <Video className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="leading-tight font-medium">
                          {event.location}
                        </span>
                      </div>

                      {/* Organisateur & Bouton Rappel Veille */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                        <span className="text-[11px] text-slate-500">
                          Par <strong className="text-slate-700">{event.organizer}</strong>
                        </span>

                        <button
                          onClick={() => handleToggleReminder(event.id, event.title)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isReminderActive
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isReminderActive ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Rappel activé</span>
                            </>
                          ) : (
                            <>
                              <Bell className="w-3.5 h-3.5 text-[#EA580C]" />
                              <span>Rappeler la veille</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Récapitulatif des prochains temps forts */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Prochains temps forts à ne pas manquer
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedDate('2026-10-30')}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-[#139BD7]">
                    Célébration des 15 ans d'ancienneté
                  </p>
                  <p className="text-[11px] text-slate-400">30 Octobre 2026 à 17:30</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setCurrentDate(new Date(2026, 10, 1));
                  setSelectedDate('2026-11-06');
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-[#139BD7]">
                    Séminaire Annuel Finance Inclusive
                  </p>
                  <p className="text-[11px] text-slate-400">06 Novembre 2026 à 09:00</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

