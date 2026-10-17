import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import {
  acceptAsk,
  startNegotiation,
  submitOffer,
  type Negotiation,
} from "../lib/bargain";
import type { Listing, NewListing } from "../types";
import { seedListings } from "./seed";

export interface MarketState {
  listings: Listing[];
  /** Keyed by listing id. */
  negotiations: Record<string, Negotiation>;
  /** Demo listings already added, so removed ones don't come back on load. */
  seededIds: string[];
}

export const initialMarketState: MarketState = {
  listings: seedListings,
  negotiations: {},
  seededIds: seedListings.map((l) => l.id),
};

function recordSale(listing: Listing, negotiation: Negotiation) {
  if (negotiation.status === "accepted") listing.soldPrice = negotiation.agreedPrice;
}

export const marketSlice = createSlice({
  name: "market",
  initialState: initialMarketState,
  reducers: {
    listingAdded: {
      reducer(state, action: PayloadAction<Listing>) {
        state.listings.unshift(action.payload);
      },
      prepare(listing: NewListing) {
        return {
          payload: { ...listing, id: nanoid(), createdAt: Date.now(), soldPrice: null },
        };
      },
    },
    listingRemoved(state, action: PayloadAction<string>) {
      state.listings = state.listings.filter((l) => l.id !== action.payload);
      delete state.negotiations[action.payload];
    },
    offerSubmitted(state, action: PayloadAction<{ listingId: string; amount: number }>) {
      const { listingId, amount } = action.payload;
      const listing = state.listings.find((l) => l.id === listingId);
      if (!listing || listing.soldPrice !== null) return;
      const current = state.negotiations[listingId] ?? startNegotiation(listing);
      const next = submitOffer(current, listing, amount);
      state.negotiations[listingId] = next;
      recordSale(listing, next);
    },
    askAccepted(state, action: PayloadAction<string>) {
      const listing = state.listings.find((l) => l.id === action.payload);
      if (!listing || listing.soldPrice !== null) return;
      const current = state.negotiations[action.payload] ?? startNegotiation(listing);
      const next = acceptAsk(current);
      state.negotiations[action.payload] = next;
      recordSale(listing, next);
    },
    walkedAway(state, action: PayloadAction<string>) {
      const negotiation = state.negotiations[action.payload];
      if (negotiation && negotiation.status !== "accepted") {
        delete state.negotiations[action.payload];
      }
    },
  },
});

export const { listingAdded, listingRemoved, offerSubmitted, askAccepted, walkedAway } =
  marketSlice.actions;

export default marketSlice.reducer;
