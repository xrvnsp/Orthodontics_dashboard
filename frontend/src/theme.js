import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1', // Indigo 500
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899', // Pink 500
      light: '#f472b6',
      dark: '#db2777',
      contrastText: '#ffffff',
    },
    background: {
      default: 'transparent', // Handled by CssBaseline gradient
      paper: 'rgba(255, 255, 255, 0.4)',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 20, // Modern squircle look
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          /* Beautiful soft animated mesh-like gradient background */
          background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 25%, #fdf4ff 75%, #f1f5f9 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
        '#root': {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
        /* Custom Scrollbar for premium feel */
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(99, 102, 241, 0.2)',
          borderRadius: '10px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(99, 102, 241, 0.4)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)', // Safari support
          borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
          color: '#1e293b',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.02)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderTop: '1px solid rgba(255, 255, 255, 0.8)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.07)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        elevation1: {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(31, 38, 135, 0.12)',
          },
        },
        elevation2: {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 48px rgba(31, 38, 135, 0.15)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          borderRadius: '24px',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 22px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.45)',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#e2e8f0',
          color: '#475569',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#cbd5e1',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(203, 213, 225, 0.4)',
        },
        head: {
          fontWeight: 700,
          color: '#475569',
          backgroundColor: 'rgba(248, 250, 252, 0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: '0.75rem',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(241, 245, 249, 0.6) !important',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.2s ease-in-out',
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
          }
        },
        notchedOutline: {
          borderColor: 'rgba(255, 255, 255, 0.6)',
          borderWidth: '1px',
        }
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
