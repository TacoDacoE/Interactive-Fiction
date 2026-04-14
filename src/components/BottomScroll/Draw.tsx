import { ButtonBase, Box, Stack, Typography } from "@mui/material"
import { PlayingCardBack } from "../Card/PlayingCardDeck"
import { useCardGame } from "../../engine/useCardGameStore"
import { useRef, useState } from "react"

const CARD_WIDTH = 100
const CARD_HEIGHT = 140
const FLIGHT_MS = 350

const Draw = () => {
  const drawCard = useCardGame(s => s.drawCard)
  const hand = useCardGame(s => s.hand);
  const pileRef = useRef<HTMLDivElement>(null);
  const [flying, setFlying] = useState(false);
  const isHandFull = hand.length >= 13;
  const drawsRemaining = useCardGame(s => s.drawsRemaining);

  const handleDraw = () => {
    if (flying) return

    const el = pileRef.current
    if (!el) { drawCard(); return }

    const rect = el.getBoundingClientRect()
    const startX = rect.left + rect.width / 2 - CARD_WIDTH / 2
    const startY = rect.top + rect.height / 2 - CARD_HEIGHT / 2

    setFlying(true)

    const styleId = "card-fly-style"
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = `
      @keyframes cardFly {
        0%   { transform: translate(${startX}px, ${startY}px) rotate(0deg); opacity: 1; }
        100% { transform: translate(${startX - 200}px, ${startY - 30}px) rotate(-6deg); opacity: 0; }
      }
    `

    setTimeout(() => {
      setFlying(false)
      drawCard()
    }, FLIGHT_MS)
  }

  const isOutOfDraws = drawsRemaining <= 0;

  return (
    <>
      {(flying && !isOutOfDraws) && (
        <Box sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          pointerEvents: "none",
          zIndex: 9999,
          animation: `cardFly ${FLIGHT_MS}ms ease-in forwards`,
        }}>
          <PlayingCardBack width={CARD_WIDTH} height={CARD_HEIGHT} />
        </Box>
      )}

      <Stack display="flex" alignItems="flex-end">
        <ButtonBase
          ref={pileRef}
          onClick={handleDraw}
          disabled={flying || isHandFull}
          sx={{
            position: "relative",
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 1,
            transform: "translateY(-7px)",
            "&:hover:not(:disabled) > .card-top": { transform: "translateY(-4px)" },
          }}
        >
          <Box sx={{ position: "absolute", top: -4, left: 2, opacity: 1, pointerEvents: "none" }}>
            <PlayingCardBack width={CARD_WIDTH} height={CARD_HEIGHT} />
          </Box>
          <Box sx={{ position: "absolute", opacity: 1, pointerEvents: "none" }}>
            <PlayingCardBack width={CARD_WIDTH} height={CARD_HEIGHT} />
          </Box>

          <Box
            className="card-top"
            sx={{
              opacity: flying ? 0 : 1,
              transition: "opacity 0.05s, transform 0.15s ease",
            }}
          >
            <PlayingCardBack width={CARD_WIDTH} height={CARD_HEIGHT} />
          </Box>

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              opacity: flying ? 0 : 1,
              transition: "opacity 0.05s",
            }}
          >

            <Box
              component="span"
              sx={{
                pt: 10,
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.92)",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                lineHeight: 1,
              }}
            >
              Draw
            </Box>
          </Box>

          {(isHandFull || isOutOfDraws) && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Box
                component="span"
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "#fff",
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                  textAlign: "center",
                  lineHeight: 1.4,
                  px: 0.5,
                }}
              >
                {isOutOfDraws ? "No Draws Left" : "Full Hand"}
              </Box>
            </Box>
          )}
        </ButtonBase>
        <Typography sx={{ pr: 0.5, color: "#aaa" }}>
          {drawsRemaining}/13
        </Typography>
      </Stack>
    </>
  )
}

export default Draw