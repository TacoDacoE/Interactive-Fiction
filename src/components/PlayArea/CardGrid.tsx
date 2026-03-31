import { Box } from "@mui/material"
import PlayingCard from "../Card/PlayingCardDeck"
import { RANKS } from "../Card/PlayingCardDeck"
import { useCardGame } from "../../engine/useCardGameStore"
import { keyframes } from "@mui/system"

const CARD_WIDTH = 100
const CARD_HEIGHT = 140

// --- Animations ---

const flyIn = keyframes`
  from { opacity: 0; transform: translateY(40px) scale(0.8); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

const flyOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`

// --- Component ---

const CardGrid = () => {
  const played = useCardGame((s) => s.played)
  const phase = useCardGame((s) => s.phase)

  if (played.length === 0) return null

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        px: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, ${CARD_WIDTH}px)`,
          justifyContent: 'center',
          gap: 1,
          alignContent: 'center',
          width: '100%',
          maxWidth: 800,
        }}
      >
        {played.map((card, i) => (
          <Box
            key={card.id}
            sx={{
              animation: phase === 'clearing'
                ? `${flyOut} 200ms ease-in forwards`
                : `${flyIn} 300ms ease-out ${i * 60}ms both`,
            }}
          >
            <PlayingCard
              rank={RANKS[card.rank as keyof typeof RANKS]}
              suit={card.suit}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              onClick={() => { }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default CardGrid