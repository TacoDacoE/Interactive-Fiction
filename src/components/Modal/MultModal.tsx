import {
  Dialog, DialogTitle, DialogContent, IconButton, Table,
  TableHead, TableRow, TableCell, TableBody, Chip, Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const HANDS = [
  { name: "4 Pairs Seq", desc: "A sequence of four pairs (excluding 2)", mult: "×8", color: "error" },
  { name: "4 of a Kind", desc: "4 cards same rank", mult: "×7", color: "error" },
  { name: "3 Pairs Seq", desc: "A sequence of three pairs (excluding 2)", mult: "×6", color: "error" },
  { name: "Sequence", desc: "3 or more cards of sequential ranks (excluding 2)", mult: "×4", color: "warning" },
  { name: "Triple", desc: "3 cards of the same rank", mult: "×3", color: "warning" },
  { name: "Pair", desc: "2 cards of the same rank", mult: "×2", color: "success" },
  { name: "High Card", desc: "Scores highest card when no other combination is made", mult: "×1", color: "success" },
] as const;

const LEFT = HANDS.slice(0, 3);
const RIGHT = HANDS.slice(3);

interface Props {
  open: boolean;
  onClose: () => void;
}

function HandTable({ rows }: { rows: typeof LEFT }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 600, color: "white" }}>Hand</TableCell>
          <TableCell align="right" sx={{ fontWeight: 600, color: "white" }}>Mult</TableCell>
        </TableRow>
      </TableHead>
      <TableBody sx={{ color: "white" }}>
        {rows.map(({ name, desc, mult, color }) => (
          <TableRow key={name}>
            <TableCell>
              <Box sx={{ fontWeight: 500, fontSize: "0.85rem", color: "white" }}>{name}</Box>
              <Box sx={{ fontSize: "0.72rem", color: "white" }}>{desc}</Box>
            </TableCell>
            <TableCell align="right">
              <Chip label={mult} color={color as any} size="small" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function MultModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { bgcolor: "rgba(6, 6, 26, 0.9)", backdropFilter: "blur(4px)" } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "white" }}>
        Hand rankings
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" sx={{ color: "white" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
          <HandTable rows={LEFT} />
          <HandTable rows={RIGHT} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}