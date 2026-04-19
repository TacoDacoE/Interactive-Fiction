import { Box, IconButton, Stack, Tooltip, } from "@mui/material";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BottomScroll from "../components/BottomScroll/BottomScroll";
import LeftScroll from "../components/LeftScroll/LeftScroll";
import WavyBackgroundBox from "../components/decorative/WavyBackgroundBox";
import { useBackgroundMusic } from "../hooks/useBackgroundMusic";
import themeSong from "../assets/sounds/background_music.mp3";
import { useEffect, useState } from "react";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ActionBar from "../components/BottomScroll/ActionBar";
import CardGrid from "../components/PlayArea/CardGrid.js";
import Draw from "../components/BottomScroll/Draw";
import { useCardGame } from "../engine/useCardGameStore.js";

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

export default function MainPage({ title = "Page Title" }) {
  const layoutColors = false;
  const [backgroundMuted, setBackgroundMuted] = useState<boolean>(false);
  const { mute, unmute } = useBackgroundMusic(themeSong, 0.75);

  const toggleSound = () => {
    setBackgroundMuted(prev => !prev);
  }

  useEffect(() => {
    if (backgroundMuted) {
      mute();
    } else {
      unmute();
    }
  }, [backgroundMuted]);


  const gameOver = useCardGame((s) => s.gameOver)
  const activeDialoguePages = useCardGame((s) => s.activeDialoguePages)
  const resetGame = useCardGame((s) => s.resetGame)

  useEffect(() => {
    if (!gameOver) return
    if (activeDialoguePages !== null) return  // dialogue is handling it

    // Give the "Game Over" overlay time to finish (600 fade in + 2000 hold + 600 fade out)
    const t = setTimeout(() => resetGame(), 3000)
    return () => clearTimeout(t)
  }, [gameOver, activeDialoguePages])

  return (
    // Full screen backdrop — centers the game box
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        bgcolor: "black",
        overflow: "hidden",
      }}>
      {/* Fixed-size game container */}
      <WavyBackgroundBox sx={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        flexShrink: 0,
        display: "flex",
        overflow: "hidden",
        bgcolor: "background.default",
      }}>
        <Box sx={{
          width: 300,
          flexShrink: 0,
          height: "100%",      // 👈 remove pt/pb/px from here
          bgcolor: layoutColors ? "grey.200" : "transparent",
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          overflow: "hidden"   // safety net
        }}>
          {/* Inner box holds the padding, flex handles the height */}
          <Box pt={14} pl={4.5} pr={3.5} pb={20} sx={{
            flex: 1,
            overflow: "visible",
            display: "flex",
            minHeight: 0
          }}>
            <LeftScroll />
          </Box>
        </Box>

        {/* Main content */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <Box sx={{ flex: 1, display: "flex", bgcolor: layoutColors ? "red" : "transparent", minHeight: 0, position: "relative" }}>
            <Stack sx={{ position: "absolute", top: 12, right: 16 }} spacing={1}>
              <Tooltip title="Rules">
                <IconButton size="medium" >
                  <MenuBookIcon fontSize="medium" sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={backgroundMuted ? "Unmute" : "Mute"}>
                <IconButton onClick={() => toggleSound()} size="medium" >
                  {backgroundMuted ?
                    <VolumeOffIcon fontSize="medium" sx={{ color: "grey.100" }} /> :
                    <VolumeUpIcon fontSize="medium" sx={{ color: "grey.100" }} />
                  }
                </IconButton>
              </Tooltip>
            </Stack>
            <CardGrid />
          </Box>
          <Box sx={{
            height: "40%",
            minHeight: 200,
            flexShrink: 0,
            width: "100%",
            bgcolor: layoutColors ? "grey.400" : "transparent",
            display: "flex",
            justifyContent: "flex-end"
          }}>
            <Stack pl={8} pr={4} pt={4} pb={6}
              sx={{
                flex: 1,
                bgcolor: layoutColors ? "grey.500" : "transparent",
                minHeight: 0,
              }}
            >
              <BottomScroll />
              <Box sx={{ marginLeft: "auto" }}>
                <ActionBar />
              </Box>
            </Stack>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "20%", height: "100%", bgcolor: layoutColors ? "blue" : "transparent", maxWidth: 400, minWidth: 200 }}>
              <Draw />
            </Box>
          </Box>
        </Box>
      </WavyBackgroundBox>
    </Box>
  );
}