export interface PriceInput {
  distanceKm: number;
  paymentInterval: "Monthly" | "Annual";
  subscriptionFrequency: "Daily" | "Weekend";
}

export function calculatePrice({
  distanceKm,
  paymentInterval,
  subscriptionFrequency,
}: PriceInput): { monthlyPrice: number; yearlyPrice: number } {
  const basePerMonth = subscriptionFrequency === "Daily" ? 30 : 15;
  let distanceFactor = 1;

  if (distanceKm > 0 && distanceKm <= 50) distanceFactor = 1.1;
  else if (distanceKm > 50 && distanceKm <= 200) distanceFactor = 1.3;
  else if (distanceKm > 200) distanceFactor = 1.6;

  const monthlyPrice = Number((basePerMonth * distanceFactor).toFixed(2));
  let yearlyPrice = Number((monthlyPrice * 12).toFixed(2));

  if (paymentInterval === "Annual") {
    yearlyPrice = Number((yearlyPrice * 0.9).toFixed(2));
  }

  return { monthlyPrice, yearlyPrice };
}
