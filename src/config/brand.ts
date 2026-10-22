/**
 * Configuration centralisée de la marque ADEC
 * Permet de modifier facilement les informations, logos et couleurs de l'application.
 */

export interface BrandConfig {
  name: string;
  fullName: string;
  subtitle: string;
  restrictedAccessText: string;
  orgName: string;
  logoUrl: string;
  demoEmailDomain: string;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    accent: string;
    accentHover: string;
    background: string;
    card: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  contact: {
    supportEmail: string;
    itHelpdesk: string;
  };
}

export const brandConfig: BrandConfig = {
  name: "ADEC Ensemble",
  fullName: "MyADEC Pro — ADEC Ensemble",
  subtitle: "L'application des collaborateurs d'ADEC",
  restrictedAccessText: "Accès réservé aux collaborateurs d'ADEC",
  orgName: "ADEC",
  // Logo officiel ADEC
  logoUrl: "https://i.ibb.co/cKFJGcZw/gsie-adec-logo.png",
  demoEmailDomain: "adec-ci.com",
  colors: {
    primary: "#139BD7", // Bleu dynamique de la maquette ADEC
    primaryDark: "#0B72A2",
    primaryLight: "#E8F5FB",
    accent: "#EA580C", // Orange corporate d'action (boutons CTA)
    accentHover: "#D95304",
    background: "#F8FAFC",
    card: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    border: "#E2E8F0",
    success: "#16A34A",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  contact: {
    supportEmail: "support@adec-ci.com",
    itHelpdesk: "helpdesk@adec-ci.com",
  },
};
