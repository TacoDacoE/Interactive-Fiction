import { Box } from "@mui/material"
import PlayingCard from "../Card/PlayingCard"
import { RANKS } from "../Card/constants"
import { useCardGame } from "../../engine/useCardGameStore"
import { evaluateTienLenHand } from "../../engine/EvaluateHand"
import { keyframes } from "@mui/system"

const CARD_WIDTH = 100
const CARD_HEIGHT = 140

const RANK_ORDER: Record<string, number> = {
  '3': 1, '4': 2, '5': 3, '6': 4,
  '7': 5, '8': 6, '9': 7, '10': 8,
  'J': 9, 'Q': 10, 'K': 11, 'A': 12, '2': 13,
}

const flyIn = keyframes`
  from { opacity: 0; transform: translateY(40px) scale(0.8); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`
const flyOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`
const scorePopUp = keyframes`
  from { opacity: 0; transform: translateY(0px); }
  to   { opacity: 1; transform: translateY(-10px); }
`
const multPop = keyframes`
  0%   { opacity: 0; transform: translate(-50%, 0px) scale(0.6); }
  60%  { opacity: 1; transform: translate(-50%, -16px) scale(1.15); }
  100% { opacity: 1; transform: translate(-50%, -12px) scale(1); }
`

const CardGrid = () => {
  const played = useCardGame((s) => s.played)
  const phase = useCardGame((s) => s.phase)
  const result = evaluateTienLenHand(played)

  // Delay mult badge until after the last score popup has appeared
  const lastCardDelay = (played.length - 1) * 60
  const multDelay = lastCardDelay + 300 + 250 + 80 // last card fly-in + score pop + small pause

  if (played.length === 0) return null

  return (
    <Box sx={{ width: '100%', height: '100%', px: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box
        sx={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, ${CARD_WIDTH}px)`,
          justifyContent: 'center',
          gap: 1,
          alignContent: 'center',
          width: '100%',
          maxWidth: 800,
        }}
      >
        {played.map((card, i) => {
          const cardDelay = i * 60
          const scoreDelay = cardDelay + 300

          return (
            <Box key={card.id} sx={{ position: 'relative' }}>
              {/* Score popup */}
              {(result.name === 'High Card' ? card.id === result.scoringCards[0].id : true) && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -28,
                    left: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    opacity: 0,
                    animation: phase !== 'clearing'
                      ? `${scorePopUp} 250ms ease-out ${scoreDelay}ms forwards`
                      : 'none',
                  }}
                >
                  <Box sx={{ bgcolor: 'rgba(0,0,0,0.75)', color: '#FFD952', fontSize: 13, fontWeight: 700, px: 1, py: 0.25, borderRadius: 1 }}>
                    +{RANK_ORDER[card.rank] ?? card.value}
                  </Box>
                </Box>
              )}

              {/* Card */}
              <Box
                sx={{
                  animation: phase === 'clearing'
                    ? `${flyOut} 200ms ease-in forwards`
                    : `${flyIn} 300ms ease-out ${cardDelay}ms both`,
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
            </Box>
          )
        })}

        {/* Multiplier badge — centered over the whole grid */}
        {result.mult > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: -60,
              left: '50%',
              opacity: 0,
              pointerEvents: 'none',
              animation: phase !== 'clearing'
                ? `${multPop} 300ms cubic-bezier(0.34,1.56,0.64,1) ${multDelay}ms forwards`
                : 'none',
            }}
          >
            <Box
              sx={{
                bgcolor: '#4B7D75',
                color: '#fff',
                fontWeight: 800,
                fontSize: 15,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              ×{result.mult} - {result.name}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CardGrid