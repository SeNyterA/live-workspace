module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'custom': 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
      },
      colors: {
        'layout': 'var(--bg-layout)',
        'sidebar': 'var(--bg-sidebar)',
        'divider': 'var(--divider-primary)',
        'divider-sec': 'var(--divider-secondary)',
        'primary': 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-active': 'var(--color-primary-active)',
        'primary-disabled': 'var(--color-primary-disabled)',
        'primary-focus': 'var(--color-primary-focus)',
        'secondary': 'var(--color-secondary)',
        'secondary-hover': 'var(--color-secondary-hover)',
        'secondary-active': 'var(--color-secondary-active)',
        'secondary-disabled': 'var(--color-secondary-disabled)',
        'secondary-focus': 'var(--color-secondary-focus)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};