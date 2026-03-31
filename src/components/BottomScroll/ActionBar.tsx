import { Button, Stack } from "@mui/material";
import { useCardGame } from "../../engine/useCardGameStore";

const ActionBar = () => {
  const sortBySuit = useCardGame((s) => s.sortBySuit)
  const sortByRank = useCardGame((s) => s.sortByRank)
  const playSelected = useCardGame((s) => s.playSelected);

  return (
    <Stack direction="row">
      <Button sx={{ color: "primary.light" }} onClick={playSelected}>
        Play
      </Button>
      <Button sx={{ color: "primary.light" }} onClick={sortByRank}>
        Sort Rank
      </Button>
      <Button sx={{ color: "primary.light" }} onClick={sortBySuit}>
        Sort Suit
      </Button>
      <Button sx={{ color: "primary.light" }}>
        Discard
      </Button>
    </Stack>

  );
}

export default ActionBar;