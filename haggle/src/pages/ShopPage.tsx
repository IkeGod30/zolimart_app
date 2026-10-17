import { useMemo, useState } from "react";
import {
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BargainDialog from "../components/BargainDialog/BargainDialog";
import ListingCard from "../components/ListingCard/ListingCard";
import { useAppSelector } from "../store/hooks";
import { CATEGORIES } from "../types";

const ALL = "All";

export default function ShopPage() {
  const listings = useAppSelector((s) => s.market.listings);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [activeId, setActiveId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings
      .filter((l) => category === ALL || l.category === category)
      .filter(
        (l) =>
          !q ||
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.sellerName.toLowerCase().includes(q)
      )
      // Available items first, newest first within each group.
      .sort(
        (a, b) =>
          Number(a.soldPrice !== null) - Number(b.soldPrice !== null) ||
          b.createdAt - a.createdAt
      );
  }, [listings, query, category]);

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search items or sellers"
          size="small"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputProps={{ "aria-label": "Search items or sellers" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          {[ALL, ...CATEGORIES].map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {visible.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 8 }}>
          {listings.length === 0
            ? "Nothing is listed yet. Switch to Sell to list the first item."
            : "No items match your search."}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {visible.map((listing) => (
            <Grid item key={listing.id} xs={12} sm={6} md={4} lg={3}>
              <ListingCard listing={listing} onBargain={setActiveId} />
            </Grid>
          ))}
        </Grid>
      )}

      {activeId && <BargainDialog listingId={activeId} onClose={() => setActiveId(null)} />}
    </>
  );
}
