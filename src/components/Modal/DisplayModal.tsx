import { Box, Button, Stack, Typography } from '@mui/material'
import Modal from '@mui/material/Modal'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import StoryScrollSide from '../../assets/decorations/StoryScrollSides.svg'
import { useCardGame } from '../../engine/useCardGameStore'
import Page, { PageData } from './Page'
import { useState } from 'react'

const pages: PageData[] = [
  {
    name: 'Alice',
    imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
    content: 'Alice was a brave adventurer who...',
  },
  {
    name: 'Bob',
    imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
    content: 'Bob was a cunning merchant who...',
  },
  {
    name: 'Carol',
    imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
    content: 'Carol was a wise scholar who...',
  },
]

const DisplayModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(0)
  const gameResult = useCardGame((s) => s.gameResult)
  const gameOver = useCardGame((s) => s.gameOver)

  const isLastPage = currentPage === pages.length - 1

  const handleNext = () => {
    if (isLastPage) {
      setIsOpen(false)
    } else {
      setCurrentPage((prev) => prev + 1)
    }
  }

  return (
    <Modal
      open={isOpen}
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

          <Typography id="modal-modal-title" variant="h2" fontWeight={600}>
            Game over - theme:
          </Typography>

          <Page
            page={pages[currentPage]}
            renderActions={() => (
              <Button
                variant='outlined'
                endIcon={<ChevronRightIcon />}
                sx={{ border: '1.5px solid', borderRadius: 8 }}
                onClick={handleNext}
              >
                {isLastPage ? 'Close' : 'Next'}
              </Button>
            )}
          />
        </Box>
      </Box>
    </Modal>
  )
}

export default DisplayModal