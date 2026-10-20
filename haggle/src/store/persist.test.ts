import type { Listing } from "../types";
import type { MarketState } from "./marketSlice";
import { mergeSeeds, upgradeListing } from "./persist";
import { seedListings } from "./seed";

const userListing: Listing = {
  id: "user-1",
  title: "Desk Lamp",
  description: "",
  category: "Home",
  sellerName: "Tony",
  photos: [],
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
        { ...seed("seed-headphones"), photos: [] },
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
    expect(merged.listings.find((l) => l.id === "seed-headphones")!.photos[0].url).toBe(
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

describe("upgradeListing", () => {
  const { photos: _photos, ...legacyBase } = userListing;

  it("turns a single saved image into the photo list", () => {
    const upgraded = upgradeListing({ ...legacyBase, imageUrl: "data:image/jpeg;base64,abc" });
    expect(upgraded.photos).toEqual([{ url: "data:image/jpeg;base64,abc" }]);
    expect(upgraded).not.toHaveProperty("imageUrl");
  });

  it("keeps the photo credit", () => {
    const credit = { creator: "A", license: "CC BY 2.0", licenseUrl: "l", source: "s" };
    const upgraded = upgradeListing({ ...legacyBase, imageUrl: "/x.jpg", imageCredit: credit });
    expect(upgraded.photos).toEqual([{ url: "/x.jpg", credit }]);
  });

  it("gives listings without an image an empty photo list", () => {
    expect(upgradeListing({ ...legacyBase, imageUrl: null }).photos).toEqual([]);
  });

  it("leaves current listings alone", () => {
    expect(upgradeListing(userListing)).toBe(userListing);
  });
});
