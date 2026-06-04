// Exercise 04: Coding guidelines with AGENTS.md
//
// Reference solution:
// This keeps the exported API stable while replacing starter identifiers with
// English, brand-neutral names.

export type ProductHighlight = {
  id: string;
  name: string;
  category: string;
  color: string;
  originalPriceInCents: number;
  priceInCents: number;
  availableSizes: string[];
};

export type DisplayProduct = ProductHighlight & {
  formattedPrice: string;
  savingsLabel: string;
};

export type DisplaySummary = {
  title: string;
  description: string;
  product: DisplayProduct;
  pills: string[];
};

const productCatalog: ProductHighlight[] = [
  {
    id: "linen-overshirt-001",
    name: "Linen Blend Overshirt",
    category: "Overshirts",
    color: "Ecru",
    originalPriceInCents: 4995,
    priceInCents: 4995,
    availableSizes: ["S", "M", "L", "XL"],
  },
];

const seasonalDiscountInCents = 1500;

export const formatPrice = (priceInCents: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
  }).format(priceInCents / 100);

const getFeaturedProduct = () => productCatalog[0];

const getFinalPrice = (originalPriceInCents: number) =>
  Math.max(originalPriceInCents - seasonalDiscountInCents, 0);

export const getDisplaySummary = (): DisplaySummary => {
  const featuredProduct = getFeaturedProduct();
  const finalPriceInCents = getFinalPrice(featuredProduct.originalPriceInCents);
  const availableSizes = featuredProduct.availableSizes;

  return {
    title: "Agent coding guidelines",
    description:
      "Use AGENTS.md to teach the agent how business code should be named before asking it to rebuild a file.",
    product: {
      ...featuredProduct,
      priceInCents: finalPriceInCents,
      formattedPrice: formatPrice(finalPriceInCents),
      savingsLabel: `${formatPrice(seasonalDiscountInCents)} off`,
    },
    pills: [
      `${availableSizes.length} sizes available`,
      `${featuredProduct.color} colorway`,
      "AGENTS.md enforced",
    ],
  };
};
