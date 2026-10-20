import { emptyListingForm, validateListing, type ListingFormValues } from "./listing";

const valid: ListingFormValues = {
  ...emptyListingForm,
  title: "  Desk lamp ",
  sellerName: "Tony",
  askingPrice: "40",
  minimumPrice: "25.50",
  photos: ["/a.jpg", "/b.jpg", "/c.jpg"],
};

describe("validateListing", () => {
  it("returns a trimmed listing with numeric prices and its photos", () => {
    const result = validateListing(valid);
    expect(result).toEqual({
      listing: expect.objectContaining({
        title: "Desk lamp",
        askingPrice: 40,
        minimumPrice: 25.5,
        photos: [{ url: "/a.jpg" }, { url: "/b.jpg" }, { url: "/c.jpg" }],
      }),
    });
  });

  it.each([
    [0, /3 more needed/],
    [2, /1 more needed/],
    [7, /up to 6/],
  ])("rejects %i photos", (count, message) => {
    const photos = Array.from({ length: count }, (_, i) => `/${i}.jpg`);
    const result = validateListing({ ...valid, photos });
    expect("errors" in result && result.errors.photos).toMatch(message);
  });

  it("accepts up to 6 photos", () => {
    const photos = Array.from({ length: 6 }, (_, i) => `/${i}.jpg`);
    expect("listing" in validateListing({ ...valid, photos })).toBe(true);
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
