// Exercise 04: Coding guidelines with AGENTS.md
//
// Challenge:
// 1. Add a coding style section to AGENTS.md.
// 2. Ask the agent to recreate this file while keeping the exported API stable.
// 3. Run the check page at /exercise/04.
//
// Goal:
// The page should keep rendering the same product summary, but this source file
// should stop using brand names or Spanish words in identifiers.

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

const seasonalDiscount = 1500;

export const formatPrice = (priceInCents: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
  }).format(priceInCents / 100);

const getFeaturedProduct = () => productCatalog[0];

const calculateFinalPrice = (originalPrice: number) =>
  Math.max(originalPrice - seasonalDiscount, 0);

export const getDisplaySummary = (): DisplaySummary => {
  const featuredProduct = getFeaturedProduct();
  const finalPrice = calculateFinalPrice(featuredProduct.originalPriceInCents);
  const availableSizes = featuredProduct.availableSizes;

  return {
    title: "Agent coding guidelines",
    description:
      "Use AGENTS.md to teach the agent how business code should be named before asking it to rebuild a file.",
    product: {
      ...featuredProduct,
      priceInCents: finalPrice,
      formattedPrice: formatPrice(finalPrice),
      savingsLabel: `${formatPrice(seasonalDiscount)} off`,
    },
    pills: [
      `${availableSizes.length} sizes available`,
      `${featuredProduct.color} colorway`,
      "AGENTS.md enforced",
    ],
  };
};
