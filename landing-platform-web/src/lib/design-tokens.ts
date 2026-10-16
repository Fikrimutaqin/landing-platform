import { DesignTokens, StyleClass } from '../../../shared/types';

export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  colors: {
    primary: '#2563eb', // Blue 600
    secondary: '#64748b', // Slate 500
    accent: '#10b981', // Emerald 500
    background: '#ffffff',
    surface: '#f8fafc',
    muted: '#94a3b8',
    border: '#e2e8f0',
    destructive: '#ef4444',
  },
  fonts: {
    heading: 'sans',
    body: 'sans',
  },
  borderRadius: 'xl',
  shadow: 'md',
};

export interface TokenPresetTheme {
  id: string;
  name: string;
  description: string;
  tokens: DesignTokens;
}

export const TOKEN_PRESET_THEMES: TokenPresetTheme[] = [
  {
    id: 'modern-indigo',
    name: 'Modern Indigo',
    description: 'Tech SaaS & Modern Venture styling with indigo & violet accents',
    tokens: {
      colors: {
        primary: '#4f46e5',
        secondary: '#64748b',
        accent: '#06b6d4',
        background: '#ffffff',
        surface: '#f8fafc',
        muted: '#94a3b8',
        border: '#e2e8f0',
        destructive: '#ef4444',
      },
      fonts: {
        heading: 'sans',
        body: 'sans',
      },
      borderRadius: 'xl',
      shadow: 'md',
    },
  },
  {
    id: 'emerald-fintech',
    name: 'Emerald FinTech',
    description: 'High-conversion commerce and digital banking green aesthetic',
    tokens: {
      colors: {
        primary: '#059669',
        secondary: '#475569',
        accent: '#10b981',
        background: '#ffffff',
        surface: '#f0fdf4',
        muted: '#94a3b8',
        border: '#cbd5e1',
        destructive: '#e11d48',
      },
      fonts: {
        heading: 'sans',
        body: 'sans',
      },
      borderRadius: 'lg',
      shadow: 'md',
    },
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Rose / Neon',
    description: 'High-impact product landing page with energetic magenta & electric amber',
    tokens: {
      colors: {
        primary: '#ff2d9b',
        secondary: '#64748b',
        accent: '#ffd21f',
        background: '#090a0f',
        surface: '#12141c',
        muted: '#71717a',
        border: '#27272a',
        destructive: '#ef4444',
      },
      fonts: {
        heading: 'space',
        body: 'sans',
      },
      borderRadius: '2xl',
      shadow: 'xl',
    },
  },
  {
    id: 'clean-slate',
    name: 'Clean Minimalist Slate',
    description: 'Editorial elegance with pure typography and quiet grayscale structure',
    tokens: {
      colors: {
        primary: '#0f172a',
        secondary: '#475569',
        accent: '#3b82f6',
        background: '#ffffff',
        surface: '#fafafa',
        muted: '#a1a1aa',
        border: '#e4e4e7',
        destructive: '#dc2626',
      },
      fonts: {
        heading: 'serif',
        body: 'sans',
      },
      borderRadius: 'md',
      shadow: 'sm',
    },
  },
  {
    id: 'dark-obsidian',
    name: 'Dark Obsidian',
    description: 'Deep black and zinc palette engineered for developer tools and hardware',
    tokens: {
      colors: {
        primary: '#3b82f6',
        secondary: '#a1a1aa',
        accent: '#a855f7',
        background: '#090a0f',
        surface: '#18181b',
        muted: '#71717a',
        border: '#27272a',
        destructive: '#f43f5e',
      },
      fonts: {
        heading: 'mono',
        body: 'sans',
      },
      borderRadius: 'xl',
      shadow: '2xl',
    },
  },
];

export const INITIAL_STYLE_CLASSES: StyleClass[] = [
  {
    id: 'cls_hero_heading',
    name: 'hero-heading',
    description: 'High-impact display title for page headers',
    styles: {
      headlineFontSize: '4xl',
      fontWeight: 'bold',
      textAlign: 'left',
      margin: 'sm',
    },
  },
  {
    id: 'cls_body_lead',
    name: 'body-lead',
    description: 'Lead narrative paragraph with relaxed line height',
    styles: {
      fontSize: 'lg',
      fontWeight: 'normal',
      textAlign: 'left',
      margin: 'sm',
    },
  },
  {
    id: 'cls_primary_button',
    name: 'primary-button',
    description: 'High-conversion primary CTA button with shadow',
    styles: {
      borderRadius: 'xl',
      padding: 'md',
      shadow: 'md',
      fontWeight: 'semibold',
    },
  },
  {
    id: 'cls_feature_card',
    name: 'feature-card',
    description: 'Container card for feature grids and product highlights',
    styles: {
      borderRadius: '2xl',
      padding: 'lg',
      borderWidth: 1,
      shadow: 'md',
    },
  },
  {
    id: 'cls_badge_accent',
    name: 'badge-accent',
    description: 'Top pill tag for new announcements or version labels',
    styles: {
      borderRadius: 'full',
      padding: 'xs',
      fontSize: 'xs',
      fontWeight: 'semibold',
    },
  },
];
