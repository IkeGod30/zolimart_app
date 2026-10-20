import { useState } from "react";
import { Box, ButtonBase, IconButton, Link, Stack, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Listing } from "../../types";
import ListingImage from "../ListingImage/ListingImage";

interface PhotoGalleryProps {
  listing: Pick<Listing, "title" | "photos">;
}

const arrowSx = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  bgcolor: "rgba(0, 0, 0, 0.45)",
  color: "common.white",
  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.65)" },
} as const;

export default function PhotoGallery({ listing }: PhotoGalleryProps) {
  const { photos, title } = listing;
  const [index, setIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <Box sx={{ borderRadius: 1, overflow: "hidden" }}>
        <ListingImage listing={listing} aspectRatio="4 / 3" />
      </Box>
    );
  }

  const current = photos[Math.min(index, photos.length - 1)];
  const step = (delta: number) => setIndex((i) => (i + delta + photos.length) % photos.length);

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: "grey.900",
        }}
      >
        <Box
          component="img"
          src={current.url}
          alt={`${title}, photo ${index + 1} of ${photos.length}`}
          sx={{ display: "block", width: "100%", aspectRatio: "4 / 3", objectFit: "contain" }}
        />
        {photos.length > 1 && (
          <>
            <IconButton aria-label="Previous photo" onClick={() => step(-1)} sx={{ ...arrowSx, left: 8 }}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton aria-label="Next photo" onClick={() => step(1)} sx={{ ...arrowSx, right: 8 }}>
              <ChevronRightIcon />
            </IconButton>
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                px: 1,
                borderRadius: 1,
                bgcolor: "rgba(0, 0, 0, 0.55)",
                color: "common.white",
              }}
            >
              {index + 1} / {photos.length}
            </Typography>
          </>
        )}
      </Box>

      {photos.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ mt: 1, overflowX: "auto", pb: 0.5 }}>
          {photos.map((photo, i) => (
            <ButtonBase
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1} of ${photos.length}`}
              aria-pressed={i === index}
              sx={{
                flexShrink: 0,
                width: 72,
                height: 54,
                borderRadius: 1,
                overflow: "hidden",
                outline: "2px solid",
                outlineColor: i === index ? "primary.main" : "transparent",
                outlineOffset: 1,
                opacity: i === index ? 1 : 0.7,
              }}
            >
              <Box
                component="img"
                src={photo.url}
                alt=""
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </ButtonBase>
          ))}
        </Stack>
      )}

      {current.credit && (
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.5 }}>
          Photo:{" "}
          <Link href={current.credit.source} target="_blank" rel="noopener noreferrer">
            {current.credit.creator}
          </Link>
          ,{" "}
          <Link href={current.credit.licenseUrl} target="_blank" rel="noopener noreferrer">
            {current.credit.license}
          </Link>
        </Typography>
      )}
    </Box>
  );
}
