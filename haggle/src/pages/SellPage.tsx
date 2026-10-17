import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ListingForm from "../components/ListingForm/ListingForm";
import ListingImage from "../components/ListingImage/ListingImage";
import { MAX_ROUNDS, type Negotiation } from "../lib/bargain";
import { formatPrice } from "../lib/format";
import { listingRemoved } from "../store/marketSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { Listing } from "../types";

function ListingStatus({ listing, negotiation }: { listing: Listing; negotiation?: Negotiation }) {
  if (listing.soldPrice !== null) {
    return <Chip size="small" color="success" label={`Sold for ${formatPrice(listing.soldPrice)}`} />;
  }
  if (negotiation && negotiation.rounds.length > 0) {
    const label =
      negotiation.status === "final"
        ? `Final offer ${formatPrice(negotiation.currentAsk)} sent`
        : `Bargaining: ${negotiation.rounds.length}/${MAX_ROUNDS} offers, at ${formatPrice(negotiation.currentAsk)}`;
    return <Chip size="small" color="info" variant="outlined" label={label} />;
  }
  return <Chip size="small" variant="outlined" label="Available" />;
}

export default function SellPage() {
  const dispatch = useAppDispatch();
  const listings = useAppSelector((s) => s.market.listings);
  const negotiations = useAppSelector((s) => s.market.negotiations);
  const [toast, setToast] = useState<string | null>(null);

  function handleRemove(listing: Listing) {
    if (window.confirm(`Remove "${listing.title}" from the shop?`)) {
      dispatch(listingRemoved(listing.id));
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <ListingForm onListed={(title) => setToast(`"${title}" is now listed.`)} />
      </Grid>
      <Grid item xs={12} md={7}>
        <Typography variant="h6" component="h2" gutterBottom>
          Listings ({listings.length})
        </Typography>
        {listings.length === 0 && (
          <Typography color="text.secondary">You haven't listed anything yet.</Typography>
        )}
        <Stack spacing={2}>
          {listings.map((listing) => (
            <Card key={listing.id} variant="outlined">
              <CardContent sx={{ display: "flex", gap: 2, alignItems: "center", "&:last-child": { pb: 2 } }}>
                <Box sx={{ width: 88, flexShrink: 0, borderRadius: 1, overflow: "hidden" }}>
                  <ListingImage listing={listing} />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" noWrap>
                    {listing.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Asking {formatPrice(listing.askingPrice)} · Minimum{" "}
                    {formatPrice(listing.minimumPrice)}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <ListingStatus listing={listing} negotiation={negotiations[listing.id]} />
                  </Box>
                </Box>
                <Tooltip title="Remove listing">
                  <IconButton
                    aria-label={`Remove ${listing.title}`}
                    onClick={() => handleRemove(listing)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Grid>
      <Snackbar
        open={toast !== null}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Grid>
  );
}
