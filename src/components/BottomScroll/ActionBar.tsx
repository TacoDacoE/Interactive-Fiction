import { Button, Stack, Typography } from "@mui/material";
import { useCardGame } from "../../engine/useCardGameStore";
import { evaluateTienLenHand } from "../../engine/EvaluateHand";
import { useEffect } from "react";

const ActionBar = () => {
  const sortBySuit = useCardGame((s) => s.sortBySuit)
  const sortByRank = useCardGame((s) => s.sortByRank)
  const played = useCardGame((s) => s.played);
  const playSelected = useCardGame((s) => s.playSelected);
  const discardSelected = useCardGame((s) => s.discardSelected);
  const selected = useCardGame((s) => s.selected);
  const hand = useCardGame((s) => s.hand);
  const phase = useCardGame((s) => s.phase);


  useEffect(() => {
    if (phase === 'resolving' && played.length > 0) {
      const result = evaluateTienLenHand(played)
      console.log(`Hand: ${result.name} | Chips: ${result.chips} | Mult: ${result.mult}`)
      console.log('Scoring cards:', result.scoringCards.map(c => `${c.rank}${c.suit[0]}`))
    }
  }, [phase])

  return (
    <Stack direction="row" display="flex" alignItems="center">
      <Button sx={{ color: "primary.light" }} disabled={selected.length == 0} onClick={playSelected}>
        Play
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
      <Typography variant="body2" color="#bbb" pl={1}>
        {hand.length}/13
      </Typography>
    </Stack>

  );
}

export default ActionBar;