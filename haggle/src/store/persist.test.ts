import type { Listing } from "../types";
import type { MarketState } from "./marketSlice";
import { mergeSeeds } from "./persist";
import { seedListings } from "./seed";

const userListing: Listing = {
  id: "user-1",
  title: "Desk Lamp",
  description: "",
  category: "Home",
  sellerName: "Tony",
  imageUrl: null,
  askingPrice: 40,
  minimumPrice: 30,
  createdAt: 1,
  soldPrice: null,
};

const seed = (id: string) => seedListings.find((l) => l.id === id)!;

describe("mergeSeeds", () => {
  it("adds new demo items to a market saved before they existed", () => {
    // Saved by the first version: 3 of the 4 original demos (one removed) plus a user item.
    const saved = {
      listings: [
        { ...seed("seed-basket"), soldPrice: 40 },
        { ...seed("seed-headphones"), imageUrl: null, imageCredit: undefined },
        seed("seed-jacket"),
        userListing,
      ],
      negotiations: {},
    } as unknown as MarketState;

    const merged = mergeSeeds(saved);
    const ids = merged.listings.map((l) => l.id);

    expect(ids).toHaveLength(seedListings.length - 1 + 1);
    expect(ids).toContain("user-1");
    expect(ids).not.toContain("seed-novel"); // the seller removed it
    expect(merged.listings.find((l) => l.id === "seed-basket")!.soldPrice).toBe(40);
    expect(merged.listings.find((l) => l.id === "seed-headphones")!.imageUrl).toBe(
      "/images/headphones.jpg"
    );
    expect(merged.seededIds).toEqual(expect.arrayContaining(seedListings.map((l) => l.id)));
  });

  it("doesn't bring back demo items removed after they were seeded", () => {
    const saved: MarketState = {
      listings: [userListing],
      negotiations: {},
      seededIds: seedListings.map((l) => l.id),
    };
    expect(mergeSeeds(saved).listings).toEqual([userListing]);
  });
});
