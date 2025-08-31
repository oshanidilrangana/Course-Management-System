export const theme = {
  colors: {
    background: '#fbfcfe',
    cardBackground: '#ffffff',
    primary: '#1266e4',
    secondary: '#c08cee',
    accent: '#eeac5c',
    dark: '#292940',
    text: '#292940',
    textSecondary: '#5c6b7b',
    border: '#e2e6ee'
  },
  shadows: {
    card: '0 4px 15px rgba(0, 0, 0, 0.08)',
    cardHover: '0 8px 25px rgba(21, 114, 254, 0.2)'
  },
  card: {
    style: {
      width: '100%',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      color: '#292940',
      border: 'none',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
    },
    hover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(21, 114, 254, 0.2)'
    },
    accentBar: {
      height: '8px',
      background: 'linear-gradient(90deg, #1572fe, #c08cee)'
    }
  },
  page: {
    style: {
      minHeight: '100vh',
      padding: '2rem 0',
      backgroundColor: '#fbfcfe'
    },
    header: {
      color: '#292940',
      fontWeight: '700',
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }
  },
  button: {
    primary: {
      backgroundColor: '#1572fe',
      border: 'none',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '6px',
      '&:hover': {
        backgroundColor: '#1260d8',
        transform: 'translateY(-1px)'
      }
    },
    secondary: {
      backgroundColor: '#c08cee',
      border: 'none',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '6px',
      '&:hover': {
        backgroundColor: '#a971d6',
        transform: 'translateY(-1px)'
      }
    }
  },
  table: {
    style: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
    },
    header: {
      backgroundColor: '#f8f9fa',
      color: '#292940',
      fontWeight: '600'
    },
    row: {
      '&:hover': {
        backgroundColor: '#f8f9fa'
      }
    }
  }
};

export const pageContainerStyle = {
  minHeight: '100vh',
  padding: '2rem 0',
  backgroundColor: '#fbfcfe'
};

export const pageHeaderStyle = {
  color: '#292940',
  fontWeight: '700',
  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  marginBottom: '2rem'
};
