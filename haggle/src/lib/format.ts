const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatPrice = (value: number) => currency.format(value);

const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export const formatDate = (timestamp: number) => date.format(timestamp);
