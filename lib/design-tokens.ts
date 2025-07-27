/**
 * Design tokens for consistent theming across the application
 * Based on the brand colors defined in designsystem.md
 */

export const colors = {
  // Brand Colors
  primary: {
    blue: '#255c7e',
    orange: '#ed5925',
  },

  // Semantic Colors
  background: {
    primary: 'hsl(var(--background))',
    secondary: 'hsl(var(--secondary))',
    muted: 'hsl(var(--muted))',
  },

  text: {
    primary: 'hsl(var(--foreground))',
    secondary: 'hsl(var(--muted-foreground))',
    accent: 'hsl(var(--accent-foreground))',
  },

  // State Colors
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  error: 'hsl(var(--destructive))',
  info: 'hsl(var(--info))',
} as const;

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    bold: '700',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
} as const;

// CSS custom properties for dynamic theming
export const cssVariables = {
  '--color-primary-blue': colors.primary.blue,
  '--color-primary-orange': colors.primary.orange,
  '--spacing-xs': spacing.xs,
  '--spacing-sm': spacing.sm,
  '--spacing-md': spacing.md,
  '--spacing-lg': spacing.lg,
  '--spacing-xl': spacing.xl,
  '--spacing-2xl': spacing['2xl'],
  '--spacing-3xl': spacing['3xl'],
} as const;

// Utility functions for consistent styling
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = colors;

  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Color path "${path}" not found in design tokens`);
      return '#000000';
    }
  }

  return value;
};

export const getSpacing = (size: keyof typeof spacing) => {
  return spacing[size] || spacing.md;
};

// Type exports for TypeScript support
export type ColorPath =
  | 'primary.blue'
  | 'primary.orange'
  | 'background.primary'
  | 'background.secondary'
  | 'background.muted'
  | 'text.primary'
  | 'text.secondary'
  | 'text.accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type SpacingSize = keyof typeof spacing;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type Breakpoint = keyof typeof breakpoints;
