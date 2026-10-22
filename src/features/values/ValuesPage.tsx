import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  ShieldCheck,
  Award,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Quote,
  Target,
  CheckCircle,
  HeartHandshake,
} from 'lucide-react';
import { missionStatement, valueOfTheMonth, adecValues } from '@/data/valuesData';

export const ValuesPage: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-6 h-6 stroke-[2.2px]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 stroke-[2.2px]" />;
      case 'Award':
        return <Award className="w-6 h-6 stroke-[2.2px]" />;
      case 'Lightbulb':
        return <Lightbulb className="w-6 h-6 stroke-[2.2px]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 stroke-[2.2px]" />;
      default:
        return <Sparkles className="w-6 h-6 stroke-[2.2px]" />;
    }
  };

  return (
    <div className="space-y-8 pb-12 select-none">
      {/* 1. BANNIÈRE INSTITUTIONNELLE : LA MISSION ADEC */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#139BD7] via-[#0284C7] to-[#0B72A2] p-6 sm:p-10 text-white shadow-adec-md">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-12 w-64 h-64 rounded-full bg-sky-300/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-amber-300" />
            Notre Raison d'Être
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            « {missionStatement.slogan} »
          </h1>

          <p className="text-sm sm:text-base text-white/95 leading-relaxed font-normal">
            {missionStatement.vision}
          </p>

          {/* 3 Engagements Socles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            {missionStatement.commitments.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15"
              >
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-[11px] text-white/90 mt-1 leading-snug">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. BLOC : LA VALEUR DU MOIS & TÉMOIGNAGE COLLABORATEUR */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-adec-card overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-800 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Focus Mensuel
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {valueOfTheMonth.subtitle}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-3">
            {/* Colonne gauche : Définition de la valeur */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-7 h-7 stroke-[2.2px]" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                    {valueOfTheMonth.valueTitle}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Valeur cardinale de notre gouvernance et de notre relation client
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {valueOfTheMonth.definition}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border-l-4 border-amber-500 text-slate-800 font-serif italic text-sm">
                {valueOfTheMonth.citation}
              </div>
            </div>

            {/* Colonne droite : Témoignage d'un collaborateur */}
            <div className="lg:col-span-5 bg-gradient-to-br from-sky-50 to-indigo-50/60 p-5 sm:p-6 rounded-2xl border border-sky-100/80 relative">
              <div className="absolute top-4 right-4 text-sky-200 pointer-events-none">
                <Quote className="w-10 h-10" />
              </div>

              <div className="flex items-center gap-3.5 mb-3.5">
                <img
                  src={valueOfTheMonth.testimonial.avatarUrl}
                  alt={valueOfTheMonth.testimonial.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-sky-200 shadow-xs"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {valueOfTheMonth.testimonial.name}
                  </h4>
                  <p className="text-xs text-sky-700 font-medium">
                    {valueOfTheMonth.testimonial.role}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {valueOfTheMonth.testimonial.department}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic relative z-10">
                « {valueOfTheMonth.testimonial.quote} »
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRÉSENTATION DES 5 VALEURS OFFICIELLES ADEC */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-[#139BD7]" />
            Nos 5 Piliers Fondamentaux
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chaque valeur façonne nos comportements, nos arbitrages et notre manière de travailler ensemble.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {adecValues.map((value, idx) => (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              className="group bg-white rounded-3xl border border-slate-200/90 hover:border-sky-300 p-6 shadow-xs hover:shadow-adec-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Icône et Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${value.colorScheme} text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105`}
                  >
                    {getIcon(value.iconName)}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${value.badgeColor}`}>
                    Pilier #{idx + 1}
                  </span>
                </div>

                {/* Titre & Résumé */}
                <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-[#139BD7] transition-colors">
                  {value.title}
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-1.5 leading-relaxed">
                  {value.shortDescription}
                </p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {value.detailedDescription}
                </p>
              </div>

              {/* Comportements clés attendus */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Au quotidien :
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {value.keyBehaviors.map((item, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#139BD7] mt-1.5 flex-shrink-0" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PIED DE PAGE VALEURS : CHARTE INTERNE */}
      <section className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-sm font-bold text-slate-800">
            Vous souhaitez approfondir la charte éthique d'ADEC ?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Téléchargez le document complet validé par la Direction Générale et le Comité de Déontologie.
          </p>
        </div>
        <a
          href="/documents"
          className="px-4 py-2.5 rounded-xl bg-[#139BD7] hover:bg-[#0B72A2] text-white text-xs font-bold transition-all shadow-xs flex-shrink-0"
        >
          Consulter les chartes dans Documents
        </a>
      </section>
    </div>
  );
};

