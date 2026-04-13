import { useCardGame } from '../../engine/useCardGameStore';
import { evaluateTienLenHand } from '../../engine/EvaluateHand';
import SlotCounter from 'react-slot-counter';
import { Box, Stack, Typography } from '@mui/material';

export function HandScoreDisplay() {
  const hand = useCardGame((state) => state.hand)
  const selected = useCardGame((state) => state.selected)
  const played = useCardGame((state) => state.played)
  const phase = useCardGame((state) => state.phase)
  const score = useCardGame((state) => state.score);
  const suitScores = useCardGame((state) => state.suitScores);

  const isResolving = phase === 'resolving' || phase === 'clearing'
  const activeCards = isResolving
    ? played
    : hand.filter((card) => selected.includes(card.id))
  const result = evaluateTienLenHand(activeCards)
  const hasSelection = isResolving || selected.length > 0
  const bars = suitScores;
  const max = Math.max(...bars, 1) // the `1` prevents division by zero
  const normalizedBars = bars.map(v => (v / max) * 100)
  const maxIndex = bars.indexOf(Math.max(...bars))
  return (
    <Stack spacing={2} display="flex">
      <Stack direction="row" justifyContent={'space-between'} alignItems={'center'} pb={1}>
        <Typography variant='h5' fontWeight={600}>
          Round<br />Score
        </Typography>
        <Box
          sx={{
            fontSize: '1.8rem',
            fontFamily: 'monospace',
            background: '#c76e24',
            display: 'flex',
            justifyContent: 'flex-end',
            px: 1,
            height: 48,
            width: 80,
            borderRadius: 2,
            border: '1px solid #f4a565',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            color: '#ffe8e8',
          }}
        >
          <SlotCounter value={score} speed={2} />
        </Box>
      </Stack>
      <Box
        sx={{
          bgcolor: "rgba(0,0,0,0.1)",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          borderRadius: 2,
          py: 1,
        }}
      >
        <Typography variant='h3' fontWeight={600}>
          {selected.length > 0 ? result.name : '\u00A0'}
        </Typography>
      </Box>
      <Stack direction="row" spacing={0.5} pt={0.5}>
        <Box
          sx={{
            fontSize: '1.4rem',
            fontFamily: 'monospace',
            background: '#c76e24',
            display: 'flex',
            justifyContent: 'flex-end',
            px: 1.5,
            height: 40,
            width: 50,
            borderRadius: 2,
            border: '1px solid #f4a565',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            color: '#ffe8e8',
          }}
        >
          <SlotCounter value={hasSelection ? result.rankSum : 0} speed={2} />
        </Box>

        <span style={{ fontSize: '2rem', transform: 'translateY(-6px)' }}>×</span>

        <Box
          sx={{
            fontSize: '1.4rem',
            fontFamily: 'monospace',
            background: '#4B7D75',
            display: 'flex',
            px: 1.5,
            height: 40,
            width: 50,
            borderRadius: 2,
            border: '1px solid #559187',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            color: '#e8f4ff',
          }}
        >
          <SlotCounter value={hasSelection ? result.mult : 0} speed={2} />
        </Box>
      </Stack>
      <Box display="flex" justifyContent="center">
        <Stack direction="row" spacing={0.25}>
          <span>♠</span>
          <Box sx={{ fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.1)', display: "flex", justifyContent: "flex-end", width: 20, px: 0.5, borderRadius: 1 }}>
            <SlotCounter value={hasSelection ? result.spadesScore : 0} speed={2} />
          </Box>
          <span>♣</span>
          <Box sx={{ fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.1)', display: "flex", justifyContent: "flex-end", width: 20, px: 0.5, borderRadius: 1 }}>
            <SlotCounter value={hasSelection ? result.clubsScore : 0} speed={2} />
          </Box>
          <span style={{ color: '#911114' }}>♦</span>
          <Box sx={{ fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.1)', display: "flex", justifyContent: "flex-end", width: 20, px: 0.5, borderRadius: 1 }}>
            <SlotCounter value={hasSelection ? result.diamondsScore : 0} speed={2} />
          </Box>
          <span style={{ color: '#911114' }}>♥</span>
          <Box sx={{ fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.1)', display: "flex", justifyContent: "flex-end", width: 20, px: 0.5, borderRadius: 1 }}>
            <SlotCounter value={hasSelection ? result.heartsScore : 0} speed={2} />
          </Box>
        </Stack>
      </Box>
      <Stack spacing={0.5}>
        <Box display="flex" alignItems="flex-end" gap={0.5} height={90}>
          {normalizedBars.map((value, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: `${value}%`,
                background: i === maxIndex ? 'rgba(44, 107, 114, 0.6)' : 'rgba(44, 91, 114, 0.3)',
                border: `1px solid ${i === maxIndex ? '#4caf98' : '#8f8f8f'}`,
                borderRadius: '2px 2px 0 0',
                transition: 'height 0.3s ease',
              }}
            />
          ))}
        </Box>
        <Box display="flex" gap={0.5}>
          {['♠', '♣', '♦', '♥'].map((suit, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                textAlign: 'center',
                fontSize: '1rem',
                color: i >= 2 ? '#911114' : 'inherit',
              }}
            >
              {suit}
            </Box>
          ))}
        </Box>
      </Stack>
    </Stack>
  )
}