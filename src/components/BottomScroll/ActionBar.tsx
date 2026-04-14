import { Button, Stack, Typography } from "@mui/material";
import { useCardGame } from "../../engine/useCardGameStore";
import { evaluateTienLenHand } from "../../engine/EvaluateHand";
import { useEffect } from "react";
import { PLAY_HAND_LIMIT } from "../../constants";

const ActionBar = () => {
  const sortBySuit = useCardGame((s) => s.sortBySuit)
  const sortByRank = useCardGame((s) => s.sortByRank)
  const played = useCardGame((s) => s.played);
  const playSelected = useCardGame((s) => s.playSelected);
  const discardSelected = useCardGame((s) => s.discardSelected);
  const selected = useCardGame((s) => s.selected);
  const hand = useCardGame((s) => s.hand);
  const phase = useCardGame((s) => s.phase);
  const playsRemaining = useCardGame((s) => s.playsRemaining);


  useEffect(() => {
    if (phase === 'resolving' && played.length > 0) {
      const result = evaluateTienLenHand(played)
    }
  }, [phase])

  return (
    <Stack direction="row" display="flex" alignItems="center">
      <Button sx={{ color: "primary.light" }} disabled={selected.length == 0} onClick={playSelected}>
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