export interface DGMessage {
  id: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  title: string;
  excerpt: string;
  fullMessage: string;
  date: string;
  videoUrl?: string;
  videoDuration?: string;
  videoThumbnail?: string;
  highlights: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Stratégie' | 'RH & Vie d’entreprise' | 'Innovation' | 'Sécurité' | 'RSE';
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  coverGradient: string;
  isFeatured?: boolean;
}

export const mockDGMessage: DGMessage = {
  id: 'dg-oct-2026',
  author: {
    name: 'Stéphane K. Amon',
    role: 'Directeur Général — ADEC',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  title: 'Cap 2026 : Consolider notre leadership par la finance digitale et l’esprit d’équipe',
  excerpt:
    'Chères collaboratrices, chers collaborateurs, en franchissant cette nouvelle étape stratégique, nous réaffirmons notre ambition d’excellence. Notre mission reste claire : donner des ailes aux projets de nos clients grâce à la finance digitale et à l’engagement sans faille de chacun d’entre vous.',
  fullMessage: `Chères collaboratrices, chers collaborateurs,

En ce mois d'octobre 2026, je tiens à saluer l'implication exceptionnelle de l'ensemble de nos équipes au siège comme dans l'ensemble de nos agences.

Notre mission fondamentale — « Donner des ailes à vos projets par la finance digitale » — prend tout son sens à travers les réalisations concrètes que nous livrons au quotidien. Grâce aux efforts conjoints de nos pôles IT, Opérations, Risques et Réseau Commercial, nous avons accéléré le traitement des demandes de nos bénéficiaires de plus de 40%, tout en maintenant les plus hauts standards de conformité et de proximité humaine.

Les défis qui s'ouvrent devant nous pour la clôture de l'exercice exigent de nous trois qualités clés :
1. La Responsabilité, valeur phare mise à l'honneur ce mois-ci : chaque action compte pour la pérennité de notre institution.
2. L'Innovation pragmatique : simplifier la vie de nos collaborateurs et de nos clients avec des outils digitaux fluides et accessibles.
3. L'Esprit d'équipe : le succès d'ADEC est avant tout une aventure collective.

Je vous invite à consulter régulièrement notre nouvel espace interne MyADEC Pro pour rester informés des orientations de notre comité de direction et partager nos réussites.

Excellente rentrée opérationnelle à toutes et à tous.

Stéphane K. Amon
Directeur Général, ADEC`,
  date: '22 Octobre 2026',
  videoDuration: '03:45 min',
  videoThumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
  highlights: [
    'Accélération de 40% des délais de traitement',
    'Déploiement de nouveaux parcours digitaux pour les clients',
    'Mise en valeur du principe de Responsabilité',
  ],
};

export const mockNewsArticles: NewsItem[] = [
  {
    id: 'news-1',
    isFeatured: true,
    category: 'Stratégie',
    title: 'Déploiement réussi du nouveau portail digital ADEC Pro auprès des agences régionales',
    summary:
      'Une étape majeure franchie dans notre transformation digitale avec plus de 98% d’adhésion des collaborateurs et des processus métiers considérablement fluidifiés.',
    content: `Le déploiement national de la nouvelle infrastructure applicative d'ADEC s'est achevé la semaine dernière avec un taux de satisfaction remarquable.

Conçu pour répondre aux besoins opérationnels quotidiens, ce dispositif permet désormais un suivi en temps réel des dossiers, une réduction drastique de l'usage du papier et une coordination instantanée entre les directions régionales et le siège.

« Ce déploiement prouve une fois de plus la réactivité et la rigueur de nos équipes », a souligné la Direction des Systèmes d'Information lors du comité de suivi.

Les prochaines étapes incluront des modules complémentaires dédiés à l'analyse prédictive et à l'interconnexion avec nos partenaires bancaires.`,
    publishedAt: '21 Octobre 2026',
    readTime: '4 min',
    author: {
      name: 'Direction de la Communication',
      role: 'ADEC Siège',
    },
    coverGradient: 'from-[#139BD7] via-[#0284C7] to-[#0B72A2]',
  },
  {
    id: 'news-2',
    isFeatured: false,
    category: 'RH & Vie d’entreprise',
    title: 'Plan de formation 2026 : Ouverture des inscriptions pour les certifications digitales',
    summary:
      'La Direction des Ressources Humaines lance son catalogue de montées en compétences avec plus de 15 parcours certifiants en finance inclusive et management agile.',
    content: `Dans le cadre de notre engagement envers l'épanouissement professionnel de chacun, la DRH ouvre officiellement la campagne de formation pour le cycle 2026-2027.

Chaque collaborateur peut dès à présent échanger avec son manager et formuler ses souhaits de développement via l'espace RH. Des sessions en présentiel et en e-learning rythmeront les prochains trimestres.`,
    publishedAt: '19 Octobre 2026',
    readTime: '3 min',
    author: {
      name: 'Marie Traoré',
      role: 'Directrice des Ressources Humaines',
    },
    coverGradient: 'from-[#EA580C] to-[#C2410C]',
  },
  {
    id: 'news-3',
    isFeatured: false,
    category: 'Innovation',
    title: 'Adoption de l’intelligence artificielle responsable dans l’analyse documentaire',
    summary:
      'Le pôle Innovation teste une solution souveraine pour accélérer le contrôle de conformité des pièces d’identité et des dossiers d’adhésion.',
    content: `Dans une démarche d'innovation maîtrisée et éthique, notre laboratoire digital a initié un pilote permettant la pré-vérification automatisée des dossiers clients.

Les premiers retours démontrent un gain de temps de plus d'une heure par jour pour les chargés de clientèle, leur permettant de se recentrer sur le conseil personnalisé.`,
    publishedAt: '16 Octobre 2026',
    readTime: '5 min',
    author: {
      name: 'Koffi N’Dri',
      role: 'Responsable Pôle Innovation',
    },
    coverGradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'news-4',
    isFeatured: false,
    category: 'Sécurité',
    title: 'Mois de la Cybersécurité : Les réflexes essentiels pour protéger nos données',
    summary:
      'Rappel des bonnes pratiques contre le phishing et sécurisation des accès nomades pour tous les collaborateurs connectés.',
    content: `La sécurité de nos clients et de nos systèmes d'information est l'affaire de tous. Durant tout ce mois, le service Sécurité informatique diffusera des capsules vidéos et organisera des tests de sensibilisation.

Prenez le réflexe de verrouiller votre poste dès que vous quittez votre bureau et ne communiquez jamais vos identifiants professionnels.`,
    publishedAt: '14 Octobre 2026',
    readTime: '2 min',
    author: {
      name: 'Yao Kouamé',
      role: 'Responsable RSSI',
    },
    coverGradient: 'from-slate-700 to-slate-900',
  },
  {
    id: 'news-5',
    isFeatured: false,
    category: 'RSE',
    title: 'Journée Solidarité ADEC : Financement de 50 projets portés par des femmes entrepreneures',
    summary:
      'Retour sur la remise des bourses d’honneur organisée dans le cadre de nos engagements sociétaux et de notre démarche RSE.',
    content: `Fidèle à sa vocation de catalyseur économique local, ADEC a récompensé 50 lauréates du programme d'accompagnement à l'entrepreneuriat féminin.

Nos collaborateurs bénévoles ont assuré le mentorat de ces projets tout au long de l'année, illustrant concrètement notre valeur d'Impact-Driven.`,
    publishedAt: '10 Octobre 2026',
    readTime: '3 min',
    author: {
      name: 'Comité RSE & Mécénat',
      role: 'ADEC',
    },
    coverGradient: 'from-purple-600 to-indigo-800',
  },
];
