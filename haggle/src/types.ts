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

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: Category;
  sellerName: string;
  /** Image URL or downscaled data URL; null shows a placeholder. */
  imageUrl: string | null;
  imageCredit?: ImageCredit;
  /** Price the seller opens at. Buyers never pay more than this. */
  askingPrice: number;
  /** Lowest price the seller will accept. Never shown to buyers. */
  minimumPrice: number;
  createdAt: number;
  /** Set once a bargain is agreed; a sold listing can't be bargained on. */
  soldPrice: number | null;
}

export type NewListing = Omit<Listing, "id" | "createdAt" | "soldPrice">;
