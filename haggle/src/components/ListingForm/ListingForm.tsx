import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { formatPrice } from "../../lib/format";
import { imageFileToDataUrl } from "../../lib/image";
import {
  emptyListingForm,
  validateListing,
  type ListingFormErrors,
  type ListingFormValues,
} from "../../lib/listing";
import { listingAdded } from "../../store/marketSlice";
import { useAppDispatch } from "../../store/hooks";
import { CATEGORIES, type Category } from "../../types";

interface ListingFormProps {
  onListed: (title: string) => void;
}

export default function ListingForm({ onListed }: ListingFormProps) {
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<ListingFormValues>(emptyListingForm);
  const [submitted, setSubmitted] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const result = validateListing(values);
  // Errors only show once the seller has tried to submit, then update live.
  const errors: ListingFormErrors = submitted && "errors" in result ? result.errors : {};

  function update<K extends keyof ListingFormValues>(key: K, value: ListingFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      update("imageUrl", await imageFileToDataUrl(file));
      setImageError(null);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Couldn't load that image.");
    }
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

          <Box>
            {values.imageUrl ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  component="img"
                  src={values.imageUrl}
                  alt="Selected item photo"
                  sx={{ width: 96, height: 72, objectFit: "cover", borderRadius: 1 }}
                />
                <Button color="inherit" onClick={() => update("imageUrl", null)}>
                  Remove photo
                </Button>
              </Stack>
            ) : (
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCameraOutlinedIcon />}
              >
                Add photo
                <input hidden type="file" accept="image/*" onChange={handleImage} />
              </Button>
            )}
            {imageError && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {imageError}
              </Typography>
            )}
          </Box>

          <Button type="submit" variant="contained" size="large">
            List item
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
