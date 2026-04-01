import { useCardGame } from '../../engine/useCardGameStore';
import { evaluateTienLenHand } from '../../engine/EvaluateHand';
import SlotCounter from 'react-slot-counter';
import { Box, Stack, Typography } from '@mui/material';

export function HandScoreDisplay() {
  const hand = useCardGame((state) => state.hand)
  const selected = useCardGame((state) => state.selected)
  const played = useCardGame((state) => state.played)
  const phase = useCardGame((state) => state.phase)

  const isResolving = phase === 'resolving' || phase === 'clearing'
  const activeCards = isResolving
    ? played
    : hand.filter((card) => selected.includes(card.id))
  const result = evaluateTienLenHand(activeCards)
  const hasSelection = isResolving || selected.length > 0

  return (
    <Stack spacing={0.5} display="flex" alignItems="center">
      <Typography variant='h3' fontWeight={600}>
        {selected.length > 0 ? result.name : '\u00A0'}
      </Typography>
      <Stack direction="row" spacing={0.5}>
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
    </Stack>
  )
}