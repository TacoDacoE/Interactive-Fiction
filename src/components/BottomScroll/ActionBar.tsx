import { Button, Stack, Typography } from "@mui/material";
import { useCardGame } from "../../engine/useCardGameStore";
import { evaluateTienLenHand } from "../../engine/EvaluateHand";
import { useEffect } from "react";
import { PLAY_HAND_LIMIT } from "../../constants";
import chimeFx from "../../assets/sounds/chime.mp3";
import { useSoundFX } from "../../hooks/useSoundFX";

const ActionBar = () => {
  const sortBySuit = useCardGame((s) => s.sortBySuit);
  const sortByRank = useCardGame((s) => s.sortByRank);
  const playSelected = useCardGame((s) => s.playSelected);
  const discardSelected = useCardGame((s) => s.discardSelected);
  const selected = useCardGame((s) => s.selected);
  const hand = useCardGame((s) => s.hand);
  const playsRemaining = useCardGame((s) => s.playsRemaining);

  const { playSound } = useSoundFX(chimeFx, 0.5);


  return (
    <Stack direction="row" display="flex" alignItems="center">
      <Button
        sx={{ color: "primary.light" }}
        disabled={selected.length == 0}
        onClick={() => {
          playSound();
          playSelected();
        }}
      >
        Play ({playsRemaining}/{PLAY_HAND_LIMIT})
      </Button>
      <Button sx={{ color: "primary.light" }} onClick={sortByRank}>
        Sort Rank
      </Button>
      <Button sx={{ color: "primary.light" }} onClick={sortBySuit}>
        Sort Suit
      </Button>
      <Button sx={{ color: "primary.light" }} disabled={selected.length == 0} onClick={discardSelected}>
        Discard
      </Button>
      <Typography variant="body2" color="#bbb" ml={2.5} px={0.5} bgcolor="rgba(255,255,255,0.1)" borderRadius={1}>
        {hand.length}/13
      </Typography>
    </Stack>

  );
}

export default ActionBar;