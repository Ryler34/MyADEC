export interface NavLinkItem {
  id: string;
  label: string;
  path: string;
  icon: 'Home' | 'Star' | 'Users' | 'Calendar' | 'FileText';
}

/**
 * Liste stricte des 5 menus de l'application issue de la maquette :
 * 1. Accueil
 * 2. Valeurs
 * 3. Annuaire
 * 4. Agenda
 * 5. Documents
 */
export const navigationItems: NavLinkItem[] = [
  {
    id: 'accueil',
    label: 'Accueil',
    path: '/',
    icon: 'Home',
  },
  {
    id: 'valeurs',
    label: 'Valeurs',
    path: '/valeurs',
    icon: 'Star',
  },
  {
    id: 'annuaire',
    label: 'Annuaire',
    path: '/annuaire',
    icon: 'Users',
  },
  {
    id: 'agenda',
    label: 'Agenda',
    path: '/agenda',
    icon: 'Calendar',
  },
  {
    id: 'documents',
    label: 'Documents',
    path: '/documents',
    icon: 'FileText',
  },
];
