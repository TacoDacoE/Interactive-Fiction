import { Box, Stack } from "@mui/material"
import LeftDecor from "../../assets/decorations/left_scroll_decor.svg";
import RightDecor from "../../assets/decorations/right_scroll_decor.svg";
import PlayingCard from "../Card/PlayingCardDeck";
import { RANKS } from "../Card/PlayingCardDeck";

const BottomScroll = ({ }) => {
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
      <Box px={1} display="flex" alignItems="center" sx={{ height: "100%", borderTop: "2px solid", borderBottom: "2px solid", borderColor: "#E4B588" }}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            width: '100%',
            '& > *:not(:first-of-type)': {
              marginLeft: `calc((100% - ${9 * 100}px) / ${9 - 1})`,
            },
            '& > *': {
              transition: 'transform 0.2s ease',
            },
            '& > *:hover': {
              transform: 'translateY(-16px)',
            },
          }}
        >
          <span>
            <PlayingCard rank={RANKS['K']} suit='spades' onClick={() => { }} width={100} height={140} />
          </span>
        </Stack>
      </Box>
    </Box >
  )
}

export default BottomScroll;