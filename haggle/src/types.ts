export const CATEGORIES = [
  "Groceries",
  "Electronics",
  "Fashion",
  "Home",
  "Sports",
  "Books",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Attribution for openly licensed photos (required by CC BY). */
export interface ImageCredit {
  creator: string;
  license: string;
  licenseUrl: string;
  source: string;
}

/** Photos a seller must add to a new listing. */
export const MIN_PHOTOS = 3;
export const MAX_PHOTOS = 6;

export interface ListingPhoto {
  /** Image URL or downscaled data URL. */
  url: string;
  credit?: ImageCredit;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: Category;
  sellerName: string;
  /** The first photo is the cover. Empty shows a placeholder. */
  photos: ListingPhoto[];
  /** Price the seller opens at. Buyers never pay more than this. */
  askingPrice: number;
  /** Lowest price the seller will accept. Never shown to buyers. */
  minimumPrice: number;
  createdAt: number;
  /** Set once a bargain is agreed; a sold listing can't be bargained on. */
  soldPrice: number | null;
}

export type NewListing = Omit<Listing, "id" | "createdAt" | "soldPrice">;
