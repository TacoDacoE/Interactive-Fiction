import { Box } from "@mui/material"
import LeftDecor from "../../assets/decorations/left_scroll_decor.svg";
import RightDecor from "../../assets/decorations/right_scroll_decor.svg";

const BottomScroll = ({ }) => {
  return (
    <Box py={2}
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
          "0%": {
            maxWidth: "0px",
          },
          "100%": {
            maxWidth: "100%", // set this to a value larger than the box will ever be
          },
        },
      }}
    >
      <img style={{ position: "absolute", left: "-7px", top: "50%", transform: "translate(-17%, -44%)" }} height="165%" src={LeftDecor} alt="My Icon" />
      <img style={{ position: "absolute", right: "0", top: "50%", transform: "translate(140%, -50%)" }} height="120%" src={RightDecor} alt="My Icon" />
      <Box sx={{ height: "100%", borderTop: "2px solid", borderBottom: "2px solid", borderColor: "#E4B588" }}>
      </Box>
    </Box>
  )
}

export default BottomScroll;