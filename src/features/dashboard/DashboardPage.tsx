import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Users,
  Calendar,
  FileText,
  Play,
  BookOpen,
  ArrowRight,
  Clock,
  Search,
  Sparkles,
  Inbox,
  Award,
  ChevronRight,
  RotateCcw,
  Video,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { brandConfig } from '@/config/brand';
import { mockDGMessage, mockNewsArticles, type NewsItem } from '@/data/homeData';
import { DGMessageModal } from './components/DGMessageModal';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { useWorkspace } from '@/hooks/useWorkspace';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const workspace = useWorkspace();

  // États pour les modales
  const [isDGModalOpen, setIsDGModalOpen] = useState(false);
  const [dgModalMode, setDgModalMode] = useState<'read' | 'video'>('read');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // Filtres et recherche d'actualités
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Date du jour formatée en français
  const todayFormatted = useMemo(() => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  // Les 4 raccourcis officiels
  const quickAccessItems = [
    {
      title: 'Valeurs & Mission',
      description: 'Découvrir la mission et nos 5 valeurs',
      path: '/valeurs',
      icon: Star,
      bgIcon: 'bg-amber-500/10 text-amber-600',
      borderColor: 'hover:border-amber-300',
    },
    {
      title: 'Annuaire',
      description: 'Rechercher un collègue et ses coordonnées',
      path: '/annuaire',
      icon: Users,
      bgIcon: 'bg-sky-500/10 text-[#139BD7]',
      borderColor: 'hover:border-sky-300',
    },
    {
      title: 'Agenda',
      description: 'Consulter les réunions et événements',
      path: '/agenda',
      icon: Calendar,
      bgIcon: 'bg-orange-500/10 text-[#EA580C]',
      borderColor: 'hover:border-orange-300',
    },
    {
      title: 'Documents',
      description: 'Accéder aux procédures et formulaires RH',
      path: '/documents',
      icon: FileText,
      bgIcon: 'bg-indigo-500/10 text-indigo-600',
      borderColor: 'hover:border-indigo-300',
    },
    {
      title: 'Vidéos',
      description: 'Voir les messages vidéo publiés',
      path: '/videos',
      icon: Video,
      bgIcon: 'bg-rose-500/10 text-rose-600',
      borderColor: 'hover:border-rose-300',
    },
  ];

  // Catégories uniques pour les filtres
  const categories = ['Toutes', 'Stratégie', 'RH & Vie d’entreprise', 'Innovation', 'Sécurité', 'RSE'];

  // Actualités filtrées
  const filteredArticles = useMemo(() => {
    return mockNewsArticles.filter((article) => {
      const matchCategory =
        selectedCategory === 'Toutes' || article.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Article mis en avant (featured)
  const featuredArticle = useMemo(() => {
    return filteredArticles.find((a) => a.isFeatured) || filteredArticles[0];
  }, [filteredArticles]);

  // Autres articles récents (excluant le featured)
  const otherArticles = useMemo(() => {
    if (!featuredArticle) return [];
    return filteredArticles.filter((a) => a.id !== featuredArticle.id);
  }, [filteredArticles, featuredArticle]);

  // Ouvrir la modale DG en mode lecture ou vidéo
  const handleOpenDG = (mode: 'read' | 'video') => {
    setDgModalMode(mode);
    setIsDGModalOpen(true);
  };

  return (
    <div className="space-y-7 pb-10">
      {/* 1. MESSAGE DE BIENVENUE PERSONNALISÉ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#139BD7] via-[#0B85BC] to-[#0B72A2] p-6 sm:p-8 text-white shadow-adec-md">
        {/* Cercles décoratifs subtils en arrière-plan */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute right-20 -bottom-16 w-80 h-80 rounded-full bg-sky-300/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Badge de date dynamique */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="capitalize">{todayFormatted}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Bonjour, {user?.displayName || 'Collaborateur'} 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/95 leading-relaxed font-normal">
            Bienvenue sur votre portail collaborateur <strong className="font-semibold">{brandConfig.name}</strong>.
            Consultez les orientations de la direction, vos actualités internes et accédez à vos outils du quotidien.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenDG('read')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#139BD7] hover:bg-sky-50 text-xs sm:text-sm font-bold shadow-sm transition-transform active:scale-95"
            >
              <Award className="w-4 h-4 text-[#EA580C]" />
              Découvrir le mot du DG
            </button>
            <Link
              to="/annuaire"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <Users className="w-4 h-4" />
              Rechercher un collègue
            </Link>
          </div>
        </div>
      </section>

      {workspace.announcements.length > 0 && (
        <section className="space-y-3" aria-label="Informations publiées par l’administration">
          <div className="flex items-center justify-between px-1"><h2 className="text-base font-bold text-slate-800">Informations de l’administration</h2><Link to="/notifications" className="text-xs font-bold text-sky-700 hover:underline">Voir les notifications</Link></div>
          <div className="grid gap-3 md:grid-cols-2">{workspace.announcements.filter((announcement) => announcement.recipient === 'all' || announcement.recipient.toLowerCase() === (user?.email || '').toLowerCase()).slice(0, 4).map((announcement) => <article key={announcement.id} className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm"><p className="text-sm font-extrabold text-slate-800">{announcement.title}</p><p className="mt-1 text-xs leading-relaxed text-slate-600">{announcement.body}</p><p className="mt-3 text-[10px] text-slate-400">Publié par {announcement.author} · {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(announcement.createdAt))}</p></article>)}</div>
        </section>
      )}

      {/* 2. ACCÈS RAPIDE AUX FONCTIONNALITÉS */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            Accès rapides
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Vos espaces de travail
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {quickAccessItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 ${item.borderColor} shadow-xs hover:shadow-adec-sm transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl ${item.bgIcon} flex items-center justify-center mb-3 shadow-xs transition-transform group-hover:scale-105`}>
                    <Icon className="w-5 h-5 stroke-[2.2px]" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-[#139BD7] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#139BD7]">
                  <span>Ouvrir la page</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. BLOC « LE MOT DU DG » */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-adec-card overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              {/* En-tête avec auteur et badge officiel */}
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={mockDGMessage.author.avatarUrl}
                    alt={mockDGMessage.author.name}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-amber-200 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Award className="w-3 h-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 tracking-wider">
                      Le mot du DG
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {mockDGMessage.date}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                    {mockDGMessage.author.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {mockDGMessage.author.role}
                  </p>
                </div>
              </div>

              {/* Titre et Résumé du message */}
              <div>
                <h4 className="text-base sm:text-xl font-extrabold text-slate-800 leading-snug">
                  {mockDGMessage.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {mockDGMessage.excerpt}
                </p>
              </div>

              {/* Boutons d'action : Lire le message & Regarder la vidéo */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => handleOpenDG('read')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#139BD7] hover:bg-[#0B72A2] text-white text-xs sm:text-sm font-bold shadow-xs transition-transform active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  Lire le message
                </button>

                <button
                  onClick={() => handleOpenDG('video')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#EA580C] border border-orange-200 text-xs sm:text-sm font-bold transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Allocution vidéo ({mockDGMessage.videoDuration})
                </button>
              </div>
            </div>

            {/* Aperçu vidéo interactif sur grands écrans */}
            <div
              onClick={() => handleOpenDG('video')}
              className="relative w-full lg:w-72 aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shadow-sm cursor-pointer group flex-shrink-0"
            >
              <img
                src={mockDGMessage.videoThumbnail}
                alt="Miniature vidéo allocution"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3.5">
                <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-sm">
                  Vidéo DG
                </span>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <span className="text-xs font-bold">Visionner</span>
                  </div>
                  <span className="text-[11px] font-medium text-white/90">
                    {mockDGMessage.videoDuration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTUALITÉS RÉCENTES & MISE EN AVANT */}
      <section className="space-y-4">
        {/* En-tête de section avec filtres et recherche */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>Actualités récentes</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-[#139BD7] font-bold">
                {filteredArticles.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Restez informés des projets, initiatives et temps forts d'ADEC
            </p>
          </div>

          {/* Champ de recherche d'actualités */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une actualité..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#139BD7] focus:border-transparent transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Barre de filtres par catégorie */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#139BD7] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ÉTAT VIDE : Si aucune actualité ne correspond */}
        {filteredArticles.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-700">
              Aucune actualité disponible
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Aucun article ne correspond à votre recherche « {searchQuery} » ou à la catégorie « {selectedCategory} ».
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Toutes');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors mt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* CARTE « À LA UNE » (FEATURED) */}
            {featuredArticle && (
              <div
                onClick={() => setSelectedArticle(featuredArticle)}
                className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-sky-300 shadow-adec-card hover:shadow-adec-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col md:flex-row"
              >
                {/* Couverture immersive */}
                <div className={`w-full md:w-2/5 p-6 sm:p-8 bg-gradient-to-br ${featuredArticle.coverGradient} text-white flex flex-col justify-between min-h-[180px]`}>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      À la une
                    </span>
                    <span className="text-[11px] font-medium text-white/90">
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                      {featuredArticle.category}
                    </span>
                    <h3 className="mt-1 text-lg sm:text-xl font-extrabold leading-snug drop-shadow-xs">
                      {featuredArticle.title}
                    </h3>
                  </div>
                </div>

                {/* Contenu et résumé */}
                <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Publié le {featuredArticle.publishedAt}</span>
                      <span>•</span>
                      <span>Par {featuredArticle.author.name}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {featuredArticle.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#139BD7] group-hover:underline flex items-center gap-1">
                      Lire l'article complet
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ADEC Communication
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* GRILLE DES AUTRES ACTUALITÉS (1 col mobile, 2 col tablette, 3 col desktop) */}
            {otherArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {otherArticles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="group rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-adec-sm transition-all duration-200 p-5 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Catégorie & Temps de lecture */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#139BD7]">
                          {article.category}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>

                      {/* Titre */}
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug group-hover:text-[#139BD7] transition-colors line-clamp-2">
                        {article.title}
                      </h4>

                      {/* Résumé */}
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                        {article.summary}
                      </p>
                    </div>

                    {/* Date et Action */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">
                        {article.publishedAt}
                      </span>
                      <span className="font-bold text-[#139BD7] flex items-center gap-1 group-hover:underline">
                        Détails
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* MODALE : LE MOT DU DG (Lecture intégrale ou vidéo) */}
      <DGMessageModal
        message={mockDGMessage}
        isOpen={isDGModalOpen}
        onClose={() => setIsDGModalOpen(false)}
        initialMode={dgModalMode}
      />

      {/* MODALE : DÉTAIL D'UNE ACTUALITÉ */}
      <ArticleDetailModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
};
