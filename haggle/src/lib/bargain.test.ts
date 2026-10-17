import {
  MAX_ROUNDS,
  acceptAsk,
  startNegotiation,
  submitOffer,
  validateOffer,
  type Negotiation,
} from "./bargain";

const listing = { askingPrice: 100, minimumPrice: 70 };

function offers(...amounts: number[]): Negotiation {
  return amounts.reduce((n, amount) => submitOffer(n, listing, amount), startNegotiation(listing));
}

describe("bargaining", () => {
  it("starts at the asking price", () => {
    const n = startNegotiation(listing);
    expect(n.currentAsk).toBe(100);
    expect(n.status).toBe("open");
  });

  it("accepts an offer at the asking price", () => {
    const n = offers(100);
    expect(n.status).toBe("accepted");
    expect(n.agreedPrice).toBe(100);
  });

  it("closes at the current ask when the offer meets or beats it", () => {
    const first = offers(80);
    const n = submitOffer(first, listing, Math.ceil(first.currentAsk));
    expect(n.status).toBe("accepted");
    expect(n.agreedPrice).toBe(first.currentAsk);
  });

  it("counters an in-range offer with a price between the offer and the ask", () => {
    const n = offers(80);
    expect(n.status).toBe("open");
    expect(n.rounds[0].outcome).toBe("countered");
    expect(n.currentAsk).toBeLessThan(100);
    expect(n.currentAsk).toBeGreaterThan(80);
  });

  it("concedes a larger share of the gap in later rounds", () => {
    const n = offers(80, 80);
    const firstDrop = 100 - n.rounds[0].ask;
    const secondDrop = n.rounds[0].ask - n.rounds[1].ask;
    expect(firstDrop / (100 - 80)).toBeCloseTo(0.25, 2);
    expect(secondDrop / (n.rounds[0].ask - 80)).toBeCloseTo(0.35, 2);
  });

  it("turns down offers below the minimum with only a small concession", () => {
    const n = offers(30);
    expect(n.rounds[0].outcome).toBe("too-low");
    expect(n.status).toBe("open");
    expect(n.currentAsk).toBe(97); // 10% of the 30 gap to the minimum
  });

  it("never closes below the minimum, however long the buyer lowballs", () => {
    const n = offers(10, 20, 30, 40, 50);
    expect(n.status).toBe("final");
    expect(n.currentAsk).toBeGreaterThanOrEqual(listing.minimumPrice);
    expect(acceptAsk(n).agreedPrice).toBeGreaterThanOrEqual(listing.minimumPrice);
  });

  it("accepts an offer within the tolerance of the ask", () => {
    const n = submitOffer({ ...startNegotiation(listing), currentAsk: 75 }, listing, 73);
    expect(n.status).toBe("accepted");
    expect(n.agreedPrice).toBe(73);
  });

  it("makes the ask final after the last round", () => {
    const n = offers(...Array(MAX_ROUNDS).fill(60));
    expect(n.rounds).toHaveLength(MAX_ROUNDS);
    expect(n.status).toBe("final");
    expect(validateOffer(n, listing, 90)).toMatch(/final offer/);
    expect(submitOffer(n, listing, 90)).toBe(n);
  });

  it("lets the buyer accept the current ask at any point", () => {
    const n = acceptAsk(offers(80));
    expect(n.status).toBe("accepted");
    expect(n.agreedPrice).toBe(n.currentAsk);
  });

  it("works when the minimum equals the asking price", () => {
    const fixed = { askingPrice: 50, minimumPrice: 50 };
    const n = submitOffer(startNegotiation(fixed), fixed, 40);
    expect(n.currentAsk).toBe(50);
    expect(submitOffer(n, fixed, 50).agreedPrice).toBe(50);
  });

  it("keeps every ask and agreed price between the minimum and asking price", () => {
    const prices = [
      { askingPrice: 45, minimumPrice: 34 },
      { askingPrice: 19.99, minimumPrice: 12.5 },
      { askingPrice: 1250, minimumPrice: 900 },
    ];
    for (const p of prices) {
      for (let start = 0.05; start <= 1; start += 0.05) {
        let n = startNegotiation(p);
        let offer = Math.round(p.askingPrice * start * 100) / 100;
        while (n.status === "open") {
          n = submitOffer(n, p, offer);
          for (const r of n.rounds) {
            expect(r.ask).toBeGreaterThanOrEqual(p.minimumPrice);
            expect(r.ask).toBeLessThanOrEqual(p.askingPrice);
          }
          offer = Math.min(p.askingPrice, Math.round((offer + p.askingPrice * 0.03) * 100) / 100);
        }
        const done = acceptAsk(n);
        expect(done.agreedPrice).toBeGreaterThanOrEqual(p.minimumPrice);
        expect(done.agreedPrice).toBeLessThanOrEqual(p.askingPrice);
      }
    }
  });
});

describe("validateOffer", () => {
  const fresh = startNegotiation(listing);

  it.each([
    [0, /above \$0/],
    [-5, /above \$0/],
    [Number.NaN, /above \$0/],
    [10.555, /two decimal/],
    [101, /above the asking price/],
  ])("rejects %s", (offer, message) => {
    expect(validateOffer(fresh, listing, offer)).toMatch(message);
  });

  it("rejects an offer lower than the buyer's previous one", () => {
    expect(validateOffer(offers(80), listing, 75)).toMatch(/previous offer/);
  });

  it("rejects offers once the deal is closed", () => {
    expect(validateOffer(offers(100), listing, 90)).toMatch(/closed/);
  });

  it("accepts a sensible offer", () => {
    expect(validateOffer(fresh, listing, 85.5)).toBeNull();
  });
});
