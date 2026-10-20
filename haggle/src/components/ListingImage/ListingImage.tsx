import { Box } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import type { Listing } from "../../types";

interface ListingImageProps {
  listing: Pick<Listing, "title" | "photos">;
  aspectRatio?: string;
}

/** The listing's cover photo, or a placeholder if it has none. */
export default function ListingImage({ listing, aspectRatio = "4 / 3" }: ListingImageProps) {
  const cover = listing.photos[0];

  if (!cover) {
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
      src={cover.url}
      alt={listing.title}
      sx={{ display: "block", width: "100%", aspectRatio, objectFit: "cover" }}
    />
  );
}
