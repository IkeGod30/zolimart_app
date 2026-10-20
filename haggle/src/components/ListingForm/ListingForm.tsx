import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { formatPrice } from "../../lib/format";
import {
  emptyListingForm,
  validateListing,
  type ListingFormErrors,
  type ListingFormValues,
} from "../../lib/listing";
import { listingAdded } from "../../store/marketSlice";
import { useAppDispatch } from "../../store/hooks";
import { CATEGORIES, type Category } from "../../types";
import PhotoPicker from "../PhotoPicker/PhotoPicker";

interface ListingFormProps {
  onListed: (title: string) => void;
}

export default function ListingForm({ onListed }: ListingFormProps) {
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<ListingFormValues>(emptyListingForm);
  const [submitted, setSubmitted] = useState(false);

  const result = validateListing(values);
  // Errors only show once the seller has tried to submit, then update live.
  const errors: ListingFormErrors = submitted && "errors" in result ? result.errors : {};

  function update<K extends keyof ListingFormValues>(key: K, value: ListingFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if ("errors" in result) {
      setSubmitted(true);
      return;
    }
    dispatch(listingAdded(result.listing));
    onListed(result.listing.title);
    setValues({ ...emptyListingForm, sellerName: values.sellerName });
    setSubmitted(false);
  }

  const asking = Number(values.askingPrice);
  const minimum = Number(values.minimumPrice);
  const showRange = asking > 0 && minimum > 0 && minimum <= asking;

  return (
    <Card variant="outlined">
      <CardContent component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h6" component="h2" gutterBottom>
          List an item
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Item name"
            required
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            label="Description"
            multiline
            minRows={2}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Category"
              fullWidth
              value={values.category}
              onChange={(e) => update("category", e.target.value as Category)}
              error={!!errors.category}
              helperText={errors.category}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Seller name"
              required
              fullWidth
              value={values.sellerName}
              onChange={(e) => update("sellerName", e.target.value)}
              error={!!errors.sellerName}
              helperText={errors.sellerName}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Asking price"
              required
              fullWidth
              inputMode="decimal"
              value={values.askingPrice}
              onChange={(e) => update("askingPrice", e.target.value)}
              error={!!errors.askingPrice}
              helperText={errors.askingPrice ?? "Where bargaining starts."}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <TextField
              label="Minimum price"
              required
              fullWidth
              inputMode="decimal"
              value={values.minimumPrice}
              onChange={(e) => update("minimumPrice", e.target.value)}
              error={!!errors.minimumPrice}
              helperText={errors.minimumPrice ?? "Hidden from buyers."}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Stack>

          {showRange && (
            <Alert severity="info" variant="outlined">
              Buyers can bargain this item between {formatPrice(minimum)} and{" "}
              {formatPrice(asking)}. It will never sell below {formatPrice(minimum)}.
            </Alert>
          )}

          <PhotoPicker
            photos={values.photos}
            onChange={(updatePhotos) =>
              setValues((prev) => ({ ...prev, photos: updatePhotos(prev.photos) }))
            }
            error={errors.photos}
          />

          <Button type="submit" variant="contained" size="large">
            List item
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
