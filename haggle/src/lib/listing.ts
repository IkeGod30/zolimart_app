import { CATEGORIES, MAX_PHOTOS, MIN_PHOTOS, type Category, type NewListing } from "../types";

/** Raw form values; prices are strings straight from the inputs. */
export interface ListingFormValues {
  title: string;
  description: string;
  category: Category;
  sellerName: string;
  /** Photo URLs in display order; the first is the cover. */
  photos: string[];
  askingPrice: string;
  minimumPrice: string;
}

export type ListingFormErrors = Partial<Record<keyof ListingFormValues, string>>;

export const emptyListingForm: ListingFormValues = {
  title: "",
  description: "",
  category: CATEGORIES[0],
  sellerName: "",
  photos: [],
  askingPrice: "",
  minimumPrice: "",
};

const MAX_PRICE = 1_000_000;

function parsePrice(raw: string): number | null {
  if (!/^\d+(\.\d{1,2})?$/.test(raw.trim())) return null;
  return Number(raw);
}

/**
 * Checks a listing form. Returns either field errors or the listing ready to
 * be saved. The seller must set both prices with minimum <= asking, and add
 * between MIN_PHOTOS and MAX_PHOTOS photos.
 */
export function validateListing(
  values: ListingFormValues
): { errors: ListingFormErrors } | { listing: NewListing } {
  const errors: ListingFormErrors = {};

  const title = values.title.trim();
  if (!title) errors.title = "Give the item a name.";
  else if (title.length > 80) errors.title = "Keep the name under 80 characters.";

  const sellerName = values.sellerName.trim();
  if (!sellerName) errors.sellerName = "Enter the seller name buyers will see.";

  if (!CATEGORIES.includes(values.category)) errors.category = "Pick a category.";

  const askingPrice = parsePrice(values.askingPrice);
  if (askingPrice === null || askingPrice <= 0) {
    errors.askingPrice = "Enter a price above $0, e.g. 45 or 45.99.";
  } else if (askingPrice > MAX_PRICE) {
    errors.askingPrice = "Asking price is too high.";
  }

  const minimumPrice = parsePrice(values.minimumPrice);
  if (minimumPrice === null || minimumPrice <= 0) {
    errors.minimumPrice = "Enter a price above $0, e.g. 30 or 30.50.";
  } else if (askingPrice !== null && minimumPrice > askingPrice) {
    errors.minimumPrice = "Minimum price can't be above the asking price.";
  }

  if (values.photos.length < MIN_PHOTOS) {
    const missing = MIN_PHOTOS - values.photos.length;
    errors.photos = `Add at least ${MIN_PHOTOS} photos (${missing} more needed).`;
  } else if (values.photos.length > MAX_PHOTOS) {
    errors.photos = `You can add up to ${MAX_PHOTOS} photos.`;
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    listing: {
      title,
      description: values.description.trim(),
      category: values.category,
      sellerName,
      photos: values.photos.map((url) => ({ url })),
      askingPrice: askingPrice!,
      minimumPrice: minimumPrice!,
    },
  };
}
