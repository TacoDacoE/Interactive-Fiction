import { Box, ButtonBase, Stack } from "@mui/material"
import LeftDecor from "../../assets/decorations/left_scroll_decor.svg";
import RightDecor from "../../assets/decorations/right_scroll_decor.svg";
import PlayingCard from "../Card/PlayingCardDeck";
import { RANKS } from "../Card/PlayingCardDeck";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCardGame, useInitialDraw } from "../../engine/useCardGameStore";

const CARD_WIDTH = 100
const STACK_GAP = 8 // default MUI Stack gap in px when not overlapping

const BottomScroll = () => {
  const hand = useCardGame((state) => state.hand)
  const toggleSelect = useCardGame((state) => state.toggleSelect)
  const selected = useCardGame((state) => state.selected)

  useInitialDraw(13)

  const cardCount = hand.length
  const totalNaturalWidth = cardCount * CARD_WIDTH + (cardCount - 1) * STACK_GAP
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldStack, setShouldStack] = useState(false)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    setShouldStack(totalNaturalWidth > el.getBoundingClientRect().width)
  }, [totalNaturalWidth])

  return (
    <Box
      py={1}
      sx={{
        position: "relative",
        height: "100%",
        bgcolor: "#FFCFA1",
        width: "100%",
        borderLeft: "8px solid",
        borderRight: "8px solid",
        borderColor: "#E4B588",
        animation: "growRight 0.8s ease-in-out forwards",
        "@keyframes growRight": {
          "0%": { maxWidth: "0px" },
          "100%": { maxWidth: "100%" },
        },
      }}
    >
      <img style={{ position: "absolute", left: "-7px", top: "50%", transform: "translate(-17%, -44%)" }} height="165%" src={LeftDecor} alt="My Icon" />
      <img style={{ position: "absolute", right: "0", top: "50%", transform: "translate(140%, -50%)" }} height="120%" src={RightDecor} alt="My Icon" />
      <Box
        ref={containerRef}
        px={1}
        sx={{
          position: "relative",   // stacking context for the absolute inner
          height: "100%",
          width: "calc(100% - 16px)",
          borderTop: "2px solid",
          borderBottom: "2px solid",
          borderColor: "#E4B588",
        }}
      >
        {/* Absolutely positioned so it NEVER contributes to parent width */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 8,   // match px={1} = 8px
            right: 8,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            // NO overflow hidden — let hover escape upward
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={shouldStack ? 0 : 1}
            sx={{
              width: '100%',
              ...(shouldStack && cardCount > 1 && {
                '& > *:not(:first-of-type)': {
                  marginLeft: `calc((100% - ${cardCount * CARD_WIDTH}px) / ${cardCount - 1})`,
                },
              }),
              '& > *': {
                transition: 'transform 0.2s ease',
              },
              '& > *:hover': {
                transform: 'rotate(-5deg) translateY(-40px)',
              },
            }}
          >
            {hand.map((card) => {
              const isSelected = selected.includes(card.id)
              return (
                <ButtonBase
                  key={card.id}
                  style={{ transform: isSelected ? 'translateY(-40px)' : undefined }}
                >
                  <PlayingCard
                    rank={RANKS[card.rank]}
                    suit={card.suit}
                    onClick={() => toggleSelect(card.id)}
                    width={CARD_WIDTH}
                    height={140}
                  />
                </ButtonBase>
              )
            })}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default BottomScroll;