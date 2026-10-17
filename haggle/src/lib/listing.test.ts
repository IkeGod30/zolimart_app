import { emptyListingForm, validateListing, type ListingFormValues } from "./listing";

const valid: ListingFormValues = {
  ...emptyListingForm,
  title: "  Desk lamp ",
  sellerName: "Tony",
  askingPrice: "40",
  minimumPrice: "25.50",
};

describe("validateListing", () => {
  it("returns a trimmed listing with numeric prices", () => {
    const result = validateListing(valid);
    expect(result).toEqual({
      listing: expect.objectContaining({
        title: "Desk lamp",
        askingPrice: 40,
        minimumPrice: 25.5,
      }),
    });
  });

  it("requires a minimum price no higher than the asking price", () => {
    const result = validateListing({ ...valid, minimumPrice: "41" });
    expect("errors" in result && result.errors.minimumPrice).toMatch(/can't be above/);
  });

  it("allows the minimum to equal the asking price", () => {
    expect("listing" in validateListing({ ...valid, minimumPrice: "40" })).toBe(true);
  });

  it.each(["", "abc", "0", "-3", "1.234"])("rejects asking price %j", (askingPrice) => {
    const result = validateListing({ ...valid, askingPrice });
    expect("errors" in result && result.errors.askingPrice).toBeTruthy();
  });

  it("requires a title and seller name", () => {
    const result = validateListing({ ...valid, title: " ", sellerName: "" });
    expect("errors" in result && Object.keys(result.errors).sort()).toEqual([
      "sellerName",
      "title",
    ]);
  });
});
