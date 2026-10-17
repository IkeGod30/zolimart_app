import { Box, LinearProgress, Typography } from "@mui/material";

interface OfferCountProps {
  count: number;
  totalCount: number;
}

export default function OfferCount({ count, totalCount }: OfferCountProps) {
  const percent = totalCount > 0 ? (count / totalCount) * 100 : 0;

  return (
    <Box sx={{ mt: 1 }}>
      <LinearProgress
        variant="determinate"
        value={percent}
        aria-label="Offers used"
        sx={{ height: 8, borderRadius: 4 }}
      />
      <Typography
        variant="caption"
        sx={{ mt: 0.5, display: "block", textAlign: "center", color: "text.secondary" }}
      >
        Offers used: {count} of {totalCount}
      </Typography>
    </Box>
  );
}
