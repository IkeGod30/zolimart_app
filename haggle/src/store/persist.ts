import type { ImageCredit, Listing } from "../types";
import type { MarketState } from "./marketSlice";
import { seedListings } from "./seed";

const STORAGE_KEY = "zolimart:market:v1";

/** Demo listings that shipped before seededIds was tracked. */
const LEGACY_SEED_IDS = ["seed-basket", "seed-headphones", "seed-jacket", "seed-novel"];

/**
 * Brings a saved market up to date with the current demo listings: adds demo
 * items the visitor hasn't seen yet and refreshes photos on existing ones,
 * without touching sales or bringing back demo items the seller removed.
 */
export function mergeSeeds(saved: MarketState, seeds: Listing[] = seedListings): MarketState {
  const seeded = new Set(saved.seededIds ?? LEGACY_SEED_IDS);
  const seedById = new Map(seeds.map((s) => [s.id, s]));

  const listings = saved.listings.map((listing) => {
    const seed = seedById.get(listing.id);
    return seed ? { ...listing, photos: seed.photos } : listing;
  });
  const added = seeds.filter(
    (s) => !seeded.has(s.id) && !listings.some((l) => l.id === s.id)
  );

  return {
    ...saved,
    listings: [...listings, ...added],
    seededIds: [...new Set([...seeded, ...seeds.map((s) => s.id)])],
  };
}

/** Listings saved before multi-photo support had a single optional image. */
type LegacyListing = Omit<Listing, "photos"> & {
  photos?: Listing["photos"];
  imageUrl?: string | null;
  imageCredit?: ImageCredit;
};

export function upgradeListing(saved: LegacyListing): Listing {
  if (saved.photos) return saved as Listing;
  const { imageUrl, imageCredit, ...rest } = saved;
  return {
    ...rest,
    photos: imageUrl ? [{ url: imageUrl, ...(imageCredit && { credit: imageCredit }) }] : [],
  };
}

/** Returns the saved market, or undefined if there is none or it's unreadable. */
export function loadMarket(): MarketState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as MarketState;
    if (!Array.isArray(parsed.listings) || typeof parsed.negotiations !== "object") {
      return undefined;
    }
    return mergeSeeds({ ...parsed, listings: parsed.listings.map(upgradeListing) });
  } catch {
    return undefined;
  }
}

let lastSaveFailed = false;
const saveListeners = new Set<() => void>();

/** For useSyncExternalStore: whether the most recent save failed. */
export const saveStatus = {
  subscribe(listener: () => void) {
    saveListeners.add(listener);
    return () => {
      saveListeners.delete(listener);
    };
  },
  failed: () => lastSaveFailed,
};

export function saveMarket(state: MarketState): void {
  let failed = false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked (e.g. private mode): keep working in memory,
    // and let the UI warn that changes won't survive a reload.
    failed = true;
  }
  if (failed !== lastSaveFailed) {
    lastSaveFailed = failed;
    saveListeners.forEach((l) => l());
  }
}
