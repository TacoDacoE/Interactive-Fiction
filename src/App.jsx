import './App.css'
import DisplayModal from './components/Modal/DisplayModal.tsx'
import MainPage from './pages/MainPage.tsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { usePhaseSequence } from './engine/useCardGameStore.ts'
import GameOverOverlay from './components/SpecialDisplays/GameOverOverlay.tsx';
import WinOverlay from './components/SpecialDisplays/WinOverlay.tsx';

const theme = createTheme({
  typography: {
    h1: { fontFamily: '"Cinzel", serif', fontSize: '2rem' },
    h2: { fontFamily: '"Cinzel", serif', fontSize: '1.75rem' },
    h3: { fontFamily: '"Cinzel", serif', fontSize: '1.5rem' },
    h4: { fontFamily: '"Cinzel", serif', fontSize: '1.25rem' },
    h5: { fontFamily: '"Cinzel", serif', fontSize: '1.1rem' },
    h6: { fontFamily: '"Cinzel", serif', fontSize: '1rem' },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: 'none',
            boxShadow: 'none',
          },
          '&:focus': {
            outline: 'none',
          },
          '&.Mui-disabled': {
            color: '#999 !important',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevents all-caps
        },
      },
    },
  },
});

function App() {
  usePhaseSequence(2000, 200);

  return (
    <ThemeProvider theme={theme}>
      <MainPage />
      <WinOverlay />
      <GameOverOverlay />
      <DisplayModal />
    </ThemeProvider>
  )
}

export default App