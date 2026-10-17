import { Box } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import type { Listing } from "../../types";

interface ListingImageProps {
  listing: Pick<Listing, "title" | "imageUrl">;
  aspectRatio?: string;
}

export default function ListingImage({ listing, aspectRatio = "4 / 3" }: ListingImageProps) {
  if (!listing.imageUrl) {
    return (
      <Box
        role="img"
        aria-label={`No photo for ${listing.title}`}
        sx={{
          aspectRatio,
          display: "grid",
          placeItems: "center",
          bgcolor: "action.hover",
          color: "text.disabled",
        }}
      >
        <ImageOutlinedIcon sx={{ fontSize: 48 }} />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={listing.imageUrl}
      alt={listing.title}
      sx={{ display: "block", width: "100%", aspectRatio, objectFit: "cover" }}
    />
  );
}
