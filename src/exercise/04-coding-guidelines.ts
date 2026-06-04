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

const zaraCatalogo: ProductHighlight[] = [
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

const descuentoTemporada = 1500;

export const formatPrice = (priceInCents: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
  }).format(priceInCents / 100);

const obtenerProductoPrincipal = () => zaraCatalogo[0];

const calcularPrecioFinal = (precioOriginal: number) =>
  Math.max(precioOriginal - descuentoTemporada, 0);

export const getDisplaySummary = (): DisplaySummary => {
  const productoDestacado = obtenerProductoPrincipal();
  const precioFinal = calcularPrecioFinal(productoDestacado.originalPriceInCents);
  const tallasDisponibles = productoDestacado.availableSizes;

  return {
    title: "Agent coding guidelines",
    description:
      "Use AGENTS.md to teach the agent how business code should be named before asking it to rebuild a file.",
    product: {
      ...productoDestacado,
      priceInCents: precioFinal,
      formattedPrice: formatPrice(precioFinal),
      savingsLabel: `${formatPrice(descuentoTemporada)} off`,
    },
    pills: [
      `${tallasDisponibles.length} sizes available`,
      `${productoDestacado.color} colorway`,
      "AGENTS.md enforced",
    ],
  };
};
