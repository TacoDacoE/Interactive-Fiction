import { Box, Stack, Typography } from "@mui/material"
import BottomCorner from "../../assets/decorations/bottom_corner.svg";
import TopDecor from "../../assets/decorations/scroll_decor_top.svg";
import { HandScoreDisplay } from "./HandScoring";

const LeftScroll = ({ }) => {
  return (
    <Box px={1} sx={{
      position: "relative",
      flex: 1,
      bgcolor: "#FFCFA1",
      width: "100%",
      borderTop: "8px solid",
      borderLeft: "8px solid",
      borderRight: "8px solid",
      borderColor: "#4D9388",
      animation: "growDown 0.8s ease-in-out forwards",
      "@keyframes growDown": {
        "0%": {
          maxHeight: "0px",
        },
        "100%": {
          maxHeight: "100%",
        },
      },
    }}>
      <img style={{ position: "absolute", bottom: "-96px", left: "-8px", width: "calc(100% + 15.5px)" }} src={BottomCorner} alt="My Icon" />
      <img style={{ position: "absolute", top: "-100px", width: "300px", transform: "translate(-48px,0)" }} src={TopDecor} alt="My Icon" />
      <Box sx={{ height: "100%", borderLeft: "2px solid", borderRight: "2px solid", borderColor: "#E4B588" }}>
        <Stack alignItems="center" py={1}>
          <Typography variant="h3">Small Blind</Typography>
          <HandScoreDisplay />
        </Stack>
      </Box>
    </Box>
  )
}

export default LeftScroll;