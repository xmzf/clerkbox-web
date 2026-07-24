/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Roboto"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        display: ['"Roboto"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      colors: {
        md3: {
          primary:              'rgb(var(--md-primary-rgb) / <alpha-value>)',
          'on-primary':         'rgb(var(--md-onPrimary-rgb) / <alpha-value>)',
          'primary-container':  'rgb(var(--md-primaryContainer-rgb) / <alpha-value>)',
          'on-primary-container':'rgb(var(--md-onPrimaryContainer-rgb) / <alpha-value>)',
          secondary:            'rgb(var(--md-secondary-rgb) / <alpha-value>)',
          'on-secondary':       'rgb(var(--md-onSecondary-rgb) / <alpha-value>)',
          'secondary-container':'rgb(var(--md-secondaryContainer-rgb) / <alpha-value>)',
          'on-secondary-container':'rgb(var(--md-onSecondaryContainer-rgb) / <alpha-value>)',
          tertiary:             'rgb(var(--md-tertiary-rgb) / <alpha-value>)',
          'on-tertiary':        'rgb(var(--md-onTertiary-rgb) / <alpha-value>)',
          'tertiary-container': 'rgb(var(--md-tertiaryContainer-rgb) / <alpha-value>)',
          'on-tertiary-container':'rgb(var(--md-onTertiaryContainer-rgb) / <alpha-value>)',
          error:                'rgb(var(--md-error-rgb) / <alpha-value>)',
          'on-error':           'rgb(var(--md-onError-rgb) / <alpha-value>)',
          'error-container':    'rgb(var(--md-errorContainer-rgb) / <alpha-value>)',
          'on-error-container': 'rgb(var(--md-onErrorContainer-rgb) / <alpha-value>)',
          surface:              'rgb(var(--md-surface-rgb) / <alpha-value>)',
          'on-surface':         'rgb(var(--md-onSurface-rgb) / <alpha-value>)',
          'on-surface-variant': 'rgb(var(--md-onSurfaceVariant-rgb) / <alpha-value>)',
          outline:              'rgb(var(--md-outline-rgb) / <alpha-value>)',
          'outline-variant':    'rgb(var(--md-outlineVariant-rgb) / <alpha-value>)',
          'surface-variant':    'rgb(var(--md-surfaceContainer-rgb) / <alpha-value>)',
          inverse:              'rgb(var(--md-inverseSurface-rgb) / <alpha-value>)',
          'inverse-on-surface': 'rgb(var(--md-onInverseSurface-rgb) / <alpha-value>)',
        },
      },
      boxShadow: {
        'md3-1': '0px 1px 3px 1px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.3)',
        'md3-2': '0px 2px 6px 2px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.3)',
        'md3-3': '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px 0px rgba(0,0,0,0.3)',
        'md3-4': '0px 6px 10px 4px rgba(0,0,0,0.15), 0px 2px 3px 0px rgba(0,0,0,0.3)',
        'md3-5': '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px 0px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        'md3-none': '0px',
        'md3-xs': '4px',
        'md3-sm': '8px',
        'md3-md': '12px',
        'md3-lg': '16px',
        'md3-xl': '28px',
        'md3-full': '9999px',
      },
      transitionTimingFunction: {
        'md3-emphasized': 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
        'md3-standard': 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
        'md3-decelerate': 'cubic-bezier(0.0, 0.0, 0.0, 1.0)',
      },
      transitionDuration: {
        'md3-short': '200ms',
        'md3-medium': '300ms',
        'md3-long': '500ms',
      },
      keyframes: {
        'md3-elevate': {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'md3-fade-up': {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'wave': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'md3-elevate': 'md3-elevate 450ms cubic-bezier(0.2, 0.0, 0.0, 1.0) forwards',
        'md3-fade-up': 'md3-fade-up 500ms cubic-bezier(0.2, 0.0, 0.0, 1.0) forwards',
        'wave': 'wave 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
