export interface CompanyEvent {
  id: string;
  date: string;
  type: 'direction' | 'formation' | 'celebration' | 'seminaire';
  typeLabel: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  isVirtual: boolean;
  location: string;
  organizer: string;
}

export const mockEvents: CompanyEvent[] = [
  {
    id: 'evt-comite-direction-oct-22',
    date: '2026-10-22',
    type: 'direction',
    typeLabel: 'Direction',
    startTime: '09:00',
    endTime: '10:30',
    title: 'Comité de direction hebdomadaire',
    description: 'Point sur les priorités opérationnelles et les projets du quatrième trimestre.',
    isVirtual: false,
    location: 'Salle de conférence, siège ADEC',
    organizer: 'Direction générale',
  },
  {
    id: 'evt-formation-cyber-oct-22',
    date: '2026-10-22',
    type: 'formation',
    typeLabel: 'Formation',
    startTime: '14:00',
    endTime: '15:30',
    title: 'Les bons réflexes de cybersécurité',
    description: 'Session de sensibilisation au phishing et à la protection des données professionnelles.',
    isVirtual: true,
    location: 'En visioconférence',
    organizer: 'Équipe sécurité informatique',
  },
  {
    id: 'evt-seminaire-oct-27',
    date: '2026-10-27',
    type: 'seminaire',
    typeLabel: 'Séminaire',
    startTime: '10:00',
    endTime: '12:00',
    title: 'Atelier expérience collaborateur',
    description: 'Échange autour des idées pour améliorer les outils et les parcours internes.',
    isVirtual: false,
    location: 'Salle polyvalente, siège ADEC',
    organizer: 'Direction des ressources humaines',
  },
  {
    id: 'evt-celebration-nov-06',
    date: '2026-11-06',
    type: 'celebration',
    typeLabel: 'Vie d’entreprise',
    startTime: '16:00',
    endTime: '17:00',
    title: 'Célébration des réussites du mois',
    description: 'Un temps convivial pour partager les avancées et remercier les équipes.',
    isVirtual: false,
    location: 'Espace détente, siège ADEC',
    organizer: 'Communication interne',
  },
];
