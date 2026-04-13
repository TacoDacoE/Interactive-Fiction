import { Box, Button, Typography } from "@mui/material"
import ScrollSides from "../../assets/decorations/story_scroll_sides.svg";
import { useState } from "react";
import storyData from './story.json';

interface StoryScrollProps {
    storyId: string;
    onClose?: () => void;
}

const StoryScroll = (props: StoryScrollProps) => {
    const { storyId, onClose } = props;
    const [pageIndex, setPageIndex] = useState(0);

    const story = storyData.find((s) => s.id === storyId);
    if (!story) return null;

    const pages = story.pages;
    const currentPage = pages[pageIndex];
    const isLastPage = pageIndex === pages.length - 1;

    const handleNext = () => {
        if (isLastPage) {
            onClose?.();
        } else {
            setPageIndex((prev) => prev + 1);
        }
    };

    return (
      <Box
        sx={{
            position: "relative",
            top: "80%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            display: "flex",
            justifyContent: "center",
        }}
      >
        <Box
            py={1}
            sx={{
                display: 'flex',
                position: "relative",
                height: "60%",
                bgcolor: "#4D9388",
                width: "80%",
                borderLeft: "8px solid",
                borderRight: "8px solid",
                borderColor: "#E4B588",
                overflow: "visible",
                animation: "growRight 0.8s ease-in-out forwards",
                "@keyframes growRight": {
                    "0%": { maxWidth: "0%" },
                    "100%": { maxWidth: "100%" },
                },
            }}
        >
            {/* INNER PARCHMENT BOX */}
            <Box
                sx={{
                    position: 'relative',
                    top: "3.5%",
                    width: '100%',
                    height: '86%',
                    backgroundColor: "#FFCFA1",
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    borderRadius: 0,
                    px: 3,
                    py: 2,
                    gap: 2,
                }}
            >
                {/* CHARACTER PORTRAIT + NAME */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 160, ml:3, mt:1 }}>
                    <Box
                        sx={{
                            width: 200,
                            height: 200,
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            border: '1px solid rgba(0,0,0,0.15)',
                            backgroundImage: currentPage.portraitUrl
                                ? `url(${currentPage.portraitUrl})`
                                : 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 20px 20px',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Typography
                        sx={{
                            mt: 1.2,
                            fontFamily: 'Georgia, serif',
                            fontSize: '1.25rem',
                            color: '#212121',
                            fontWeight: 500,
                        }}
                    >
                        {currentPage.characterName}
                    </Typography>
                </Box>

                {/* DIALOGUE TEXT */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', pt: 1 }}>
                    <Typography
                        sx={{
                            fontFamily: 'Georgia, serif',
                            fontSize: '1.05rem',
                            color: '#2a1a0a',
                            lineHeight: 1.7,
                        }}
                    >
                        {currentPage.dialogue}
                    </Typography>
                </Box>

                {/* NEXT BUTTON */}
                <Button
                    variant="contained"
                    disableElevation
                    onClick={handleNext}
                    sx={{
                        bgcolor: '#FFCFA1',
                        color: '#212121',
                        '&:hover': { bgcolor: '#d6a77a', borderColor: '#212121' },
                        border: 1,
                        borderColor: '#212121',
                        position: 'absolute',
                        bottom: 20,
                        right: 80,
                        px: 4,
                        borderRadius: 5,
                    }}
                >
                    {isLastPage ? 'Close' : 'Next >'}
                </Button>
            </Box>

            {/* LEFT SCROLL SIDE */}
            <Box
                component="img"
                src={ScrollSides}
                sx={{
                    position: "absolute",
                    left: -10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    height: "120%",
                    pointerEvents: "none",
                }}
            />

            {/* RIGHT SCROLL SIDE */}
            <Box
                component="img"
                src={ScrollSides}
                sx={{
                    position: "absolute",
                    right: -10,
                    top: "50%",
                    transform: "translateY(-50%) scaleX(-1)",
                    height: "120%",
                    pointerEvents: "none",
                }}
            />
        </Box>
      </Box>
    );
}

export default StoryScroll;