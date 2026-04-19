import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useCardGame } from '../../engine/useCardGameStore'

const FADE_DURATION_MS = 600
const DISPLAY_MS = 2000

const GameOverOverlay = () => {
  const gameOver = useCardGame((s) => s.gameOver)
  const gameResult = useCardGame((s) => s.gameResult)
  const [visible, setVisible] = useState(false)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (!gameOver || gameResult !== 'loss') return

    setVisible(true)

    // Fade in
    const fadeIn = setTimeout(() => setOpacity(1), 50)

    // Fade out after display duration
    const fadeOut = setTimeout(() => setOpacity(0), FADE_DURATION_MS + DISPLAY_MS)

    // Unmount after fade out completes
    const unmount = setTimeout(
      () => setVisible(false),
      FADE_DURATION_MS + DISPLAY_MS + FADE_DURATION_MS
    )

    return () => {
      clearTimeout(fadeIn)
      clearTimeout(fadeOut)
      clearTimeout(unmount)
    }
  }, [gameOver, gameResult])

  if (!visible) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 1300,
        opacity,
        transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: '#fff',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textShadow: '0 2px 24px rgba(0,0,0,0.6)',
          userSelect: 'none',
          fontSize: '4rem',
        }}
      >
        Game Over
      </Typography>
    </Box>
  )
}

export default GameOverOverlay;