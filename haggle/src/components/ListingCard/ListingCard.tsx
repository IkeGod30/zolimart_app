import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import { formatPrice } from "../../lib/format";
import { useAppSelector } from "../../store/hooks";
import type { Listing } from "../../types";
import ListingImage from "../ListingImage/ListingImage";

interface ListingCardProps {
  listing: Listing;
  onBargain: (listingId: string) => void;
}

export default function ListingCard({ listing, onBargain }: ListingCardProps) {
  const negotiation = useAppSelector((s) => s.market.negotiations[listing.id]);
  const sold = listing.soldPrice !== null;
  const inProgress = !sold && negotiation !== undefined && negotiation.rounds.length > 0;

  return (
    <Card
      variant="outlined"
      sx={{ height: "100%", display: "flex", flexDirection: "column", opacity: sold ? 0.7 : 1 }}
    >
      <CardActionArea
        onClick={() => onBargain(listing.id)}
        aria-label={`View details for ${listing.title}`}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <Box sx={{ position: "relative" }}>
          <ListingImage listing={listing} />
          {listing.photos.length > 1 && (
            <Chip
              icon={<PhotoLibraryOutlinedIcon />}
              label={listing.photos.length}
              size="small"
              sx={{
                position: "absolute",
                right: 8,
                bottom: 8,
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "common.white",
                "& .MuiChip-icon": { color: "inherit" },
              }}
            />
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, width: "100%" }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip label={listing.category} size="small" />
            {sold && <Chip label="Sold" size="small" color="default" variant="outlined" />}
            {inProgress && <Chip label="Bargaining" size="small" color="info" variant="outlined" />}
          </Stack>
          <Typography variant="h6" component="h3" sx={{ lineHeight: 1.3 }}>
            {listing.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Sold by {listing.sellerName}
          </Typography>
          {sold ? (
            <Typography variant="h6" component="p">
              Sold for {formatPrice(listing.soldPrice!)}
            </Typography>
          ) : (
            <Typography variant="h6" component="p">
              {inProgress && (
                <Typography component="s" variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                  {formatPrice(listing.askingPrice)}
                </Typography>
              )}
              {formatPrice(inProgress ? negotiation.currentAsk : listing.askingPrice)}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant={sold ? "outlined" : "contained"}
          fullWidth
          onClick={() => onBargain(listing.id)}
        >
          {sold ? "View deal" : inProgress ? "Continue bargaining" : "Make an offer"}
        </Button>
      </CardActions>
    </Card>
  );
}
