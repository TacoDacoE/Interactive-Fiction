import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PlayingCardDeck from './components/Card/PlayingCardDeck'
import MainPage from './pages/MainPage.tsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { usePhaseSequence } from './engine/useCardGameStore.ts'

const theme = createTheme({
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
        },
      },
    },
  },
});

function App() {
  usePhaseSequence();

  return (
    <ThemeProvider theme={theme}>
      <MainPage />
    </ThemeProvider>
  )
}

export default App