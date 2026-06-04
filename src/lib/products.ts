import type { Product } from "../exercise/01-our-first-query";
import products from "../data/products.json";

export type ZaraProduct = Product & {
  id: string;
  slug: string;
  sourceUrl: string;
  color: string;
  reference: string;
};

export type ProductSearchFilters = {
  query?: string;
  category?: string;
  material?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
};

const zaraProducts = products as ZaraProduct[];

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const parsePrice = (price: string) => {
  const numericPrice = Number.parseFloat(price.replace(",", "."));

  return Number.isNaN(numericPrice) ? 0 : numericPrice;
};

export const getProducts = () => zaraProducts;

export const getProductById = (identifier: string) => {
  const normalizedIdentifier = normalize(identifier);

  return zaraProducts.find((product) => {
    const normalizedReference = normalize(product.reference.replace("/", "-"));

    return (
      normalize(product.id) === normalizedIdentifier ||
      normalize(product.slug) === normalizedIdentifier ||
      normalizedReference === normalizedIdentifier
    );
  });
};

export const searchProducts = ({
  query,
  category,
  material,
  color,
  minPrice,
  maxPrice,
}: ProductSearchFilters) => {
  const normalizedQuery = query ? normalize(query) : "";
  const normalizedCategory = category ? normalize(category) : "";
  const normalizedMaterial = material ? normalize(material) : "";
  const normalizedColor = color ? normalize(color) : "";

  return zaraProducts.filter((product) => {
    const searchableProduct = normalize(
      [
        product.name,
        product.category,
        product.material,
        product.color,
        product.reference,
        product.sourceDescription,
      ].join(" "),
    );
    const productPrice = parsePrice(product.price);

    return (
      (!normalizedQuery || searchableProduct.includes(normalizedQuery)) &&
      (!normalizedCategory ||
        normalize(product.category).includes(normalizedCategory)) &&
      (!normalizedMaterial ||
        normalize(product.material).includes(normalizedMaterial)) &&
      (!normalizedColor || normalize(product.color).includes(normalizedColor)) &&
      (minPrice === undefined || productPrice >= minPrice) &&
      (maxPrice === undefined || productPrice <= maxPrice)
    );
  });
};
