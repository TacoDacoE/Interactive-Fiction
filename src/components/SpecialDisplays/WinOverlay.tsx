import { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useCardGame } from '../../engine/useCardGameStore'

const CREDITS = [
  { role: 'Game Design/Story', name: 'Cathy Lin' },
  { role: 'Game Design/Story', name: 'Eason Wang' },
  { role: 'Programming', name: 'Johnny Nguyen' },
  { role: 'Special Thanks', name: 'Ryan Scheiding' },
]

const FADE_MS = 800
const CREDITS_SCROLL_MS = 10000

type WinPhase = 'fadein' | 'visible' | 'credits' | 'fadeout'


const WinOverlay = () => {
  const gameOver = useCardGame((s) => s.gameOver)
  const gameResult = useCardGame((s) => s.gameResult)
  const resetGame = useCardGame((s) => s.resetGame)

  const [phase, setPhase] = useState<WinPhase | null>(null)
  const [opacity, setOpacity] = useState(0)
  const [creditsStarted, setCreditsStarted] = useState(false)

  useEffect(() => {
    if (!gameOver || gameResult !== 'win') return
    setPhase('fadein')
    setOpacity(0)
    setCreditsStarted(false)
    const t = setTimeout(() => {
      setOpacity(1)
      setPhase('visible')
    }, 50)
    return () => clearTimeout(t)
  }, [gameOver, gameResult])

  const handleLeave = () => {
    setPhase('credits')
    // Small delay so DOM mounts before triggering the CSS transition
    setTimeout(() => setCreditsStarted(true), 50)
  }

  const handlePlayAgain = () => {
    setPhase('fadeout')
    setOpacity(0)
    setTimeout(() => {
      setPhase(null)
      resetGame()
    }, FADE_MS)
  }

  if (!phase) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        bgcolor: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transition: `opacity ${FADE_MS}ms ease-in-out`,
        overflow: 'hidden',
      }}
    >
      {/* Vignette */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Win screen */}
      {phase !== 'credits' && (
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
            px: 4,
            textAlign: 'center',
          }}
        >
          <Box sx={{ width: 60, height: '1px', bgcolor: '#b8960c' }} />

          <Typography
            variant="h1"
            sx={{
              color: '#e8d48b',
              fontWeight: 700,
              fontSize: { xs: '3rem', md: '5rem' },
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            Victory
          </Typography>

          <Typography
            sx={{
              color: 'rgba(232, 212, 139, 0.5)',
              fontSize: '0.95rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            Would you like to return to the living world?
          </Typography>

          <Box sx={{ width: 60, height: '1px', bgcolor: '#b8960c' }} />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleLeave}
              sx={{
                color: 'rgba(232, 212, 139, 0.7)',
                borderColor: 'rgba(232, 212, 139, 0.3)',
                borderRadius: 0,
                px: 5,
                py: 1.5,
                fontSize: '0.85rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                '&:hover': {
                  bgcolor: 'rgba(232, 212, 139, 0.05)',
                  borderColor: 'rgba(232, 212, 139, 0.6)',
                },
              }}
            >
              Wake up
            </Button>

            <Button
              variant="contained"
              onClick={handlePlayAgain}
              disableElevation
              sx={{
                bgcolor: '#b8960c',
                color: '#0a0a0f',
                borderRadius: 0,
                px: 5,
                py: 1.5,
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                '&:hover': { bgcolor: '#d4ae18' },
              }}
            >
              Play Again
            </Button>
          </Box>
        </Box>
      )}

      {/* Credits */}
      {phase === 'credits' && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 7,
            pb: 8,
            transform: creditsStarted ? 'translateY(-120vh)' : 'translateY(110vh)',
            transition: creditsStarted
              ? `transform ${CREDITS_SCROLL_MS}ms linear`
              : 'none',
            zIndex: 1,
          }}
        >
          <Box sx={{ width: 40, height: '1px', bgcolor: 'rgba(184,150,12,0.4)' }} />

          <Typography
            sx={{
              color: 'rgba(232, 212, 139, 0.4)',
              fontSize: '0.75rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
            }}
          >
            Credits
          </Typography>

          {CREDITS.map((credit) => (
            <Box key={credit.role} sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  color: 'rgba(232, 212, 139, 0.35)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                {credit.role}
              </Typography>
              <Typography
                sx={{
                  color: '#e8d48b',
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                }}
              >
                {credit.name}
              </Typography>
            </Box>
          ))}

          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Box sx={{ width: 40, height: '1px', bgcolor: 'rgba(184,150,12,0.4)', mx: 'auto', mb: 6 }} />
            <Typography
              sx={{
                color: 'rgba(232, 212, 139, 0.2)',
                fontSize: '0.75rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
              }}
            >
              Thank you for playing
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default WinOverlay;