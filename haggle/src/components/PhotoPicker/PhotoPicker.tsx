import { useState } from "react";
import { Box, ButtonBase, Chip, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseIcon from "@mui/icons-material/Close";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { imageFileToDataUrl } from "../../lib/image";
import { MAX_PHOTOS, MIN_PHOTOS } from "../../types";

interface PhotoPickerProps {
  photos: string[];
  /** Takes an updater so photos that finish loading late don't overwrite newer edits. */
  onChange: (update: (photos: string[]) => string[]) => void;
  error?: string;
}

const tileSx = {
  position: "relative",
  aspectRatio: "4 / 3",
  borderRadius: 1,
  overflow: "hidden",
} as const;

const overlayButtonSx = {
  position: "absolute",
  top: 4,
  bgcolor: "rgba(0, 0, 0, 0.55)",
  color: "common.white",
  p: 0.25,
  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.75)" },
} as const;

export default function PhotoPicker({ photos, onChange, error }: PhotoPickerProps) {
  const [loading, setLoading] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const slotsLeft = MAX_PHOTOS - photos.length - loading;
  const needed = Math.max(0, MIN_PHOTOS - photos.length);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const accepted = files.slice(0, Math.max(0, slotsLeft));
    const problems: string[] = [];
    if (accepted.length < files.length) {
      problems.push(`Only ${MAX_PHOTOS} photos are allowed, so some files were skipped.`);
    }

    setLoading((n) => n + accepted.length);
    const results = await Promise.allSettled(accepted.map(imageFileToDataUrl));
    setLoading((n) => n - accepted.length);

    const urls: string[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") urls.push(r.value);
      else problems.push(r.reason instanceof Error ? r.reason.message : "A photo couldn't be loaded.");
    }
    onChange((prev) => [...prev, ...urls].slice(0, MAX_PHOTOS));
    setNotice(problems.length ? problems.join(" ") : null);
  }

  const remove = (index: number) => onChange((prev) => prev.filter((_, i) => i !== index));
  const makeCover = (index: number) =>
    onChange((prev) => [prev[index], ...prev.filter((_, i) => i !== index)]);

  return (
    <Box component="fieldset" sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
      <Typography component="legend" variant="subtitle2" sx={{ p: 0 }}>
        Photos * ({photos.length} of {MAX_PHOTOS})
      </Typography>
      <Typography variant="body2" color={error ? "error" : "text.secondary"} sx={{ mb: 1 }}>
        {error ??
          (needed > 0
            ? `Add at least ${MIN_PHOTOS} photos. ${needed} more needed.`
            : "The first photo is the cover buyers see in the shop.")}
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
        {photos.map((url, i) => (
          <Box key={`${i}-${url.slice(-24)}`} sx={tileSx}>
            <Box
              component="img"
              src={url}
              alt={`Photo ${i + 1}`}
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {i === 0 ? (
              <Chip
                label="Cover"
                size="small"
                color="primary"
                sx={{ position: "absolute", left: 4, bottom: 4, height: 20 }}
              />
            ) : (
              <Tooltip title="Make cover photo">
                <IconButton
                  aria-label={`Make photo ${i + 1} the cover`}
                  size="small"
                  onClick={() => makeCover(i)}
                  sx={{ ...overlayButtonSx, left: 4 }}
                >
                  <StarBorderIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Remove photo">
              <IconButton
                aria-label={`Remove photo ${i + 1}`}
                size="small"
                onClick={() => remove(i)}
                sx={{ ...overlayButtonSx, right: 4 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ))}

        {Array.from({ length: loading }, (_, i) => (
          <Box
            key={`loading-${i}`}
            sx={{ ...tileSx, display: "grid", placeItems: "center", bgcolor: "action.hover" }}
          >
            <CircularProgress size={24} aria-label="Loading photo" />
          </Box>
        ))}

        {slotsLeft > 0 && (
          <ButtonBase
            component="label"
            sx={{
              ...tileSx,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              border: "2px dashed",
              borderColor: error ? "error.main" : "divider",
              color: error ? "error.main" : "text.secondary",
              "&:hover": { borderColor: "primary.main", color: "primary.main" },
              "&:focus-within": { borderColor: "primary.main", color: "primary.main" },
            }}
          >
            <AddPhotoAlternateOutlinedIcon />
            <Typography variant="caption">Add photos</Typography>
            <input
              hidden
              type="file"
              accept="image/*"
              multiple
              aria-label="Add photos"
              onChange={handleFiles}
            />
          </ButtonBase>
        )}
      </Box>

      {notice && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {notice}
        </Typography>
      )}
    </Box>
  );
}
