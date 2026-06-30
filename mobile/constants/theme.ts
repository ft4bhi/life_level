export const Colors = {
  // Core palette
  background: '#0f0f14',
  backgroundLight: '#1a1a24',
  backgroundCard: '#1e1e2a',
  surface: '#252536',
  surfaceLight: '#2e2e42',

  // Accent
  gold: '#f5a623',
  goldLight: '#ffc857',
  goldDark: '#c4841d',
  goldGlow: 'rgba(245, 166, 35, 0.3)',

  // Text
  textPrimary: '#e8e6df',
  textSecondary: '#9a9a9a',
  textMuted: '#666666',

  // Status
  success: '#4ade80',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#60a5fa',

  // Level states
  levelCompleted: '#f5a623',
  levelCompletedGlow: 'rgba(245, 166, 35, 0.4)',
  levelActive: '#f5a623',
  levelActiveRing: 'rgba(245, 166, 35, 0.6)',
  levelLocked: '#3a3a4a',
  levelLockedIcon: '#666666',
  levelMissed: '#4a4a5a',
  levelMissedIcon: '#888888',

  // UI
  border: '#2a2a3a',
  divider: '#1e1e2e',
  overlay: 'rgba(0, 0, 0, 0.6)',
  buttonPrimary: '#f5a623',
  buttonPrimaryText: '#0f0f14',
  inputBackground: '#1a1a24',
  inputBorder: '#2a2a3a',
  tabBarBackground: '#0f0f14',
  tabBarBorder: '#1a1a24',
};

export const Typography = {
  fontFamily: {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    semiBold: 'DMSans_600SemiBold',
    bold: 'DMSans_700Bold',
  },
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
    '4xl': 48,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const Shadows = {
  glow: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const Moods = {
  happy: { emoji: '😊', label: 'Happy', color: '#fbbf24' },
  neutral: { emoji: '😐', label: 'Neutral', color: '#9ca3af' },
  sad: { emoji: '😢', label: 'Sad', color: '#60a5fa' },
  excited: { emoji: '🤩', label: 'Excited', color: '#f472b6' },
  anxious: { emoji: '😰', label: 'Anxious', color: '#a78bfa' },
  grateful: { emoji: '🙏', label: 'Grateful', color: '#34d399' },
} as const;

export type MoodType = keyof typeof Moods;
