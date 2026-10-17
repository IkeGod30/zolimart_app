import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  MAX_ROUNDS,
  startNegotiation,
  validateOffer,
  type Negotiation,
  type OfferRound,
} from "../../lib/bargain";
import { formatPrice } from "../../lib/format";
import { askAccepted, offerSubmitted, walkedAway } from "../../store/marketSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { Listing } from "../../types";
import ListingImage from "../ListingImage/ListingImage";
import OfferCount from "../OfferCount/OfferCount";

interface BargainDialogProps {
  listingId: string | null;
  onClose: () => void;
}

function roundSummary(round: OfferRound): string {
  switch (round.outcome) {
    case "accepted":
      return `Seller accepted at ${formatPrice(round.ask)}`;
    case "too-low":
      return `Too low. Seller moved to ${formatPrice(round.ask)}`;
    case "countered":
      return `Seller countered at ${formatPrice(round.ask)}`;
  }
}

function SellerMessage({ listing, negotiation }: { listing: Listing; negotiation: Negotiation }) {
  const last = negotiation.rounds[negotiation.rounds.length - 1];
  const ask = formatPrice(negotiation.currentAsk);

  if (negotiation.status === "accepted") {
    return (
      <Alert severity="success">
        Deal! You bought this for {formatPrice(negotiation.agreedPrice!)}.
      </Alert>
    );
  }
  if (negotiation.status === "final") {
    return (
      <Alert severity="warning">
        Final offer: the seller won't go below {ask}. Accept it or walk away.
      </Alert>
    );
  }
  if (!last) {
    return (
      <Alert severity="info">
        Offer any price up to {formatPrice(listing.askingPrice)}. The seller replies to each
        offer, and you get {MAX_ROUNDS} offers.
      </Alert>
    );
  }
  if (last.outcome === "too-low") {
    return (
      <Alert severity="error">
        That's too low for the seller. They'll come down a little to {ask}, but you'll need
        to offer more.
      </Alert>
    );
  }
  return <Alert severity="info">The seller counters at {ask}.</Alert>;
}

export default function BargainDialog({ listingId, onClose }: BargainDialogProps) {
  const listing = useAppSelector((s) =>
    s.market.listings.find((l) => l.id === listingId)
  );
  const stored = useAppSelector((s) =>
    listingId ? s.market.negotiations[listingId] : undefined
  );
  const negotiation = useMemo(
    () => stored ?? (listing ? startNegotiation(listing) : null),
    [stored, listing]
  );
  const dispatch = useAppDispatch();
  const [offerInput, setOfferInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setOfferInput("");
    setError(null);
    onClose();
  }

  if (!listing || !negotiation) return null;

  const sold = listing.soldPrice !== null;
  const closed = sold || negotiation.status === "accepted";
  const canOffer = !closed && negotiation.status === "open";
  const hasRounds = negotiation.rounds.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!listing || !negotiation) return;
    const amount = Number(offerInput);
    const problem = validateOffer(negotiation, listing, amount);
    setError(problem);
    if (problem) return;
    dispatch(offerSubmitted({ listingId: listing.id, amount }));
    setOfferInput("");
  }

  function handleAccept() {
    setError(null);
    dispatch(askAccepted(listing!.id));
  }

  function handleWalkAway() {
    dispatch(walkedAway(listing!.id));
    handleClose();
  }

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="sm" scroll="body">
      <DialogTitle>{listing.title}</DialogTitle>
      <DialogContent>
        <Box sx={{ borderRadius: 1, overflow: "hidden", mb: listing.imageCredit ? 0.5 : 2 }}>
          <ListingImage listing={listing} aspectRatio="16 / 9" />
        </Box>
        {listing.imageCredit && (
          <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 2 }}>
            Photo:{" "}
            <Link href={listing.imageCredit.source} target="_blank" rel="noopener noreferrer">
              {listing.imageCredit.creator}
            </Link>
            ,{" "}
            <Link href={listing.imageCredit.licenseUrl} target="_blank" rel="noopener noreferrer">
              {listing.imageCredit.license}
            </Link>
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary">
          Sold by {listing.sellerName} · {listing.category}
        </Typography>
        {listing.description && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            {listing.description}
          </Typography>
        )}

        <Stack direction="row" spacing={4} sx={{ my: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Asking price
            </Typography>
            <Typography variant="h6">{formatPrice(listing.askingPrice)}</Typography>
          </Box>
          {!sold && hasRounds && (
            <Box>
              <Typography variant="overline" color="text.secondary">
                Seller's current price
              </Typography>
              <Typography variant="h6" color="success.main">
                {formatPrice(negotiation.currentAsk)}
              </Typography>
            </Box>
          )}
        </Stack>

        {sold && negotiation.status !== "accepted" ? (
          <Alert severity="info">
            This item has been sold for {formatPrice(listing.soldPrice!)}.
          </Alert>
        ) : (
          <Box aria-live="polite">
            <SellerMessage listing={listing} negotiation={negotiation} />
          </Box>
        )}

        {canOffer && (
          <Stack
            component="form"
            onSubmit={handleSubmit}
            direction="row"
            spacing={1}
            sx={{ mt: 2 }}
            noValidate
          >
            <TextField
              label="Your offer"
              type="number"
              size="small"
              fullWidth
              autoFocus
              value={offerInput}
              onChange={(e) => {
                setOfferInput(e.target.value);
                setError(null);
              }}
              error={error !== null}
              helperText={error ?? " "}
              inputProps={{ min: 0.01, step: "0.01", max: listing.askingPrice }}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={offerInput.trim() === ""}
              sx={{ alignSelf: "flex-start", height: 40 }}
            >
              Offer
            </Button>
          </Stack>
        )}

        {!sold && <OfferCount count={negotiation.rounds.length} totalCount={MAX_ROUNDS} />}

        {hasRounds && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Offer history</Typography>
            <List dense disablePadding>
              {negotiation.rounds.map((round, i) => (
                <ListItem key={i} disableGutters>
                  <ListItemText
                    primary={`${i + 1}. You offered ${formatPrice(round.offer)}`}
                    secondary={roundSummary(round)}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, flexWrap: "wrap", gap: 1 }}>
        {!closed && hasRounds && (
          <Button color="inherit" onClick={handleWalkAway}>
            Walk away
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleClose}>Close</Button>
        {!closed && (
          <Button variant="contained" color="success" onClick={handleAccept}>
            {hasRounds ? "Accept" : "Buy now for"} {formatPrice(negotiation.currentAsk)}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
