import type { Listing } from "../types";

/**
 * Bargaining engine.
 *
 * The buyer makes offers; the seller answers each one automatically with a
 * counter-offer ("current ask"). Every agreed price lands between the
 * listing's minimum and asking price:
 *
 * - The current ask starts at the asking price and only ever moves down,
 *   never below the minimum.
 * - An offer at or above the current ask closes the deal at the current ask.
 * - An offer below the minimum is turned down; the seller only gives a token
 *   concession so lowballing doesn't pay.
 * - An offer between the minimum and the current ask makes the seller move
 *   toward it, conceding a bigger share of the gap each round. If the two
 *   prices end up within a small tolerance, the seller takes the offer.
 * - After MAX_ROUNDS offers the seller's ask becomes final: the buyer can
 *   accept it or walk away.
 */

export const MAX_ROUNDS = 5;

/** Share of the gap the seller gives up in round 1, rising each round. */
const BASE_CONCESSION = 0.25;
const CONCESSION_STEP = 0.1;
/** Share of the gap to the minimum the seller gives up after a lowball. */
const LOWBALL_CONCESSION = 0.1;

export type RoundOutcome = "too-low" | "countered" | "accepted";

export interface OfferRound {
  offer: number;
  outcome: RoundOutcome;
  /** Seller's ask after this round (the agreed price when accepted). */
  ask: number;
}

export type NegotiationStatus = "open" | "final" | "accepted";

export interface Negotiation {
  rounds: OfferRound[];
  currentAsk: number;
  status: NegotiationStatus;
  agreedPrice: number | null;
}

type Prices = Pick<Listing, "askingPrice" | "minimumPrice">;

const toCents = (value: number) => Math.round(value * 100) / 100;

/** Prices within this distance of each other are treated as a match. */
export function agreementTolerance(askingPrice: number): number {
  return Math.max(0.5, toCents(askingPrice * 0.02));
}

export function startNegotiation(listing: Prices): Negotiation {
  return {
    rounds: [],
    currentAsk: listing.askingPrice,
    status: "open",
    agreedPrice: null,
  };
}

export function roundsLeft(negotiation: Negotiation): number {
  return Math.max(0, MAX_ROUNDS - negotiation.rounds.length);
}

/** Returns an error message for an unacceptable offer, or null if it's fine. */
export function validateOffer(
  negotiation: Negotiation,
  listing: Prices,
  offer: number
): string | null {
  if (negotiation.status === "accepted") return "This deal is already closed.";
  if (negotiation.status === "final") {
    return "The seller has made a final offer. Accept it or walk away.";
  }
  if (!Number.isFinite(offer) || offer <= 0) return "Enter an offer above $0.";
  if (toCents(offer) !== offer) return "Offers can have at most two decimal places.";
  if (offer > listing.askingPrice) {
    return "Your offer can't be above the asking price.";
  }
  const lastOffer = negotiation.rounds[negotiation.rounds.length - 1]?.offer;
  if (lastOffer !== undefined && offer < lastOffer) {
    return "Your offer can't be lower than your previous offer.";
  }
  return null;
}

/**
 * Applies a buyer's offer and returns the updated negotiation. Invalid offers
 * (see validateOffer) leave the negotiation unchanged.
 */
export function submitOffer(
  negotiation: Negotiation,
  listing: Prices,
  offer: number
): Negotiation {
  if (validateOffer(negotiation, listing, offer) !== null) return negotiation;

  const { minimumPrice, askingPrice } = listing;
  const ask = negotiation.currentAsk;
  const round = negotiation.rounds.length + 1;

  const close = (price: number): Negotiation => ({
    rounds: [...negotiation.rounds, { offer, outcome: "accepted", ask: price }],
    currentAsk: price,
    status: "accepted",
    agreedPrice: price,
  });

  if (offer >= ask) return close(ask);

  let nextAsk: number;
  let outcome: RoundOutcome;

  if (offer < minimumPrice) {
    outcome = "too-low";
    nextAsk = ask - (ask - minimumPrice) * LOWBALL_CONCESSION;
  } else {
    if (ask - offer <= agreementTolerance(askingPrice)) return close(offer);
    outcome = "countered";
    const concession = BASE_CONCESSION + CONCESSION_STEP * (round - 1);
    nextAsk = ask - (ask - offer) * concession;
    if (nextAsk - offer <= agreementTolerance(askingPrice)) return close(offer);
  }

  // Round up to whole cents so rounding never takes the seller below the floor.
  nextAsk = Math.ceil(nextAsk * 100) / 100;
  nextAsk = Math.min(ask, Math.max(nextAsk, minimumPrice, offer));

  return {
    rounds: [...negotiation.rounds, { offer, outcome, ask: nextAsk }],
    currentAsk: nextAsk,
    status: round >= MAX_ROUNDS ? "final" : "open",
    agreedPrice: null,
  };
}

/** The buyer takes the seller's current ask. */
export function acceptAsk(negotiation: Negotiation): Negotiation {
  if (negotiation.status === "accepted") return negotiation;
  return {
    ...negotiation,
    status: "accepted",
    agreedPrice: negotiation.currentAsk,
  };
}
