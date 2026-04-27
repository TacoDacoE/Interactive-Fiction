import { Box, Button, Stack, Typography } from '@mui/material'
import Modal from '@mui/material/Modal'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import StoryScrollSide from '../../assets/decorations/StoryScrollSides.svg'
import { useCardGame, useInitialDraw } from '../../engine/useCardGameStore'
import Page from './Page'
import { useEffect, useState } from 'react'

const DisplayModal = () => {
  const activeDialoguePages = useCardGame((s) => s.activeDialoguePages)
  const activeDialogueSuit = useCardGame((s) => s.activeDialogueSuit)
  const dismissDialogue = useCardGame((s) => s.dismissDialogue)
  const nextRound = useCardGame((s) => s.nextRound)
  const [currentPage, setCurrentPage] = useState(0)

  // Reset page index whenever new dialogue loads
  useEffect(() => {
    setCurrentPage(0)
  }, [activeDialoguePages])

  const pages = activeDialoguePages ?? []
  const isLastPage = currentPage === pages.length - 1

  const handleNext = () => {
    if (isLastPage) {
      nextRound();
      dismissDialogue()
    } else {
      setCurrentPage((prev) => prev + 1)
    }
  }

  return (
    <Modal
      open={!!activeDialoguePages}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          },
        },
      }}
    >
      <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
        <Box
          height={400}
          sx={{
            boxSizing: "border-box",
            pt: 4,
            pb: 2,
            px: 2,
            bgcolor: "#FFCFA1",
            boxShadow: "inset 0 20px 0 #4D9388, inset 0 -20px 0 #4D9388",
            width: 0,
            animationDelay: '3s',
            animation: "expandWidth 0.4s ease-in forwards",
            mx: "auto",
            "@keyframes expandWidth": {
              from: { width: 0 },
              to: { width: 800 },
            },
          }}
          position="relative"
        >
          <img style={{ position: "absolute", top: "0px", left: "0px", width: "36px", transform: "translate(-34px,-40px)" }} src={StoryScrollSide} alt="" />
          <img style={{ position: "absolute", top: "0px", right: "0px", width: "36px", transform: "translate(34px,-40px)" }} src={StoryScrollSide} alt="" />

          <Typography id="modal-modal-title" variant="h2" fontWeight={600} color="#212121">
            Game over - theme: {activeDialogueSuit}
          </Typography>

          <Page
            page={pages[currentPage]}
            renderActions={() => (
              <Button
                variant='contained'
                disableElevation
                endIcon={<ChevronRightIcon />}
                sx={{
                  bgcolor: '#FFCFA1',
                  color: '#212121',
                  '&:hover': { bgcolor: '#d6a77a', borderColor: '#212121' },
                  border: 1,
                  borderColor: '#212121',
                  borderRadius: 5,
                  px: 3,
                }}
                onClick={handleNext}
              >
                {isLastPage ? 'Play again' : 'Next'}
              </Button>
            )}
          />
        </Box>
      </Box>
    </Modal>
  )
}

export default DisplayModal