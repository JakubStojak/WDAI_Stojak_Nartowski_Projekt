import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface AddReviewDialogProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export default function AddReviewDialog({
  open,
  handleClose,
  onSubmit,
}: AddReviewDialogProps) {
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rating) {
      onSubmit(rating, comment);
      handleClose();
      setComment("");
      setRating(5);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit,
          sx: { backgroundImage: "none" },
        },
      }}
    >
      <DialogTitle>Dodaj opinię</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          minWidth: "300px",
        }}
      >
        <DialogContentText>
          Podziel się swoimi wrażeniami na temat tego produktu.
        </DialogContentText>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography component="legend">Twoja ocena:</Typography>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
        </Box>

        <TextField
          autoFocus
          required
          margin="dense"
          id="comment"
          name="comment"
          label="Treść opinii"
          placeholder="Napisz co myślisz..."
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Anuluj</Button>
        <Button
          variant="contained"
          type="submit"
          disabled={!rating || !comment}
        >
          Dodaj opinię
        </Button>
      </DialogActions>
    </Dialog>
  );
}
