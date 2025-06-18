export const theme = {
  colors: {
    primary: {
      navy: '#0A2463',
      violet: '#3E92CC',
    },
    secondary: {
      coral: '#FF6B6B',
      mint: '#A8F9FF',
    },
    neutral: {
      offWhite: '#F8F9FA',
      charcoal: '#212529',
    },
  },
  fonts: {
    headings: '"Satoshi Bold", sans-serif',
    body: '"Inter", sans-serif',
    code: '"JetBrains Mono", monospace',
  },
  shadows: {
    card: '0 25px 50px -12px rgba(0,0,0,0.25)',
    button: '0 4px 14px 0 rgba(0, 118, 255, 0.39)',
  },
  transitions: {
    default: 'all 0.3s ease-in-out',
    spring: { type: 'spring', damping: 10, stiffness: 100 },
  },
};