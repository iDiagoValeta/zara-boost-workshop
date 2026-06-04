import type { APIRoute } from "astro";
import type { ProductSearchFilters } from "../../../lib/products";
import { searchProducts } from "../../../lib/products";

export const prerender = false;

const getTextParam = (url: URL, name: string) => {
  const value = url.searchParams.get(name);

  return value?.trim() || undefined;
};

const getNumberParam = (url: URL, name: string) => {
  const value = getTextParam(url, name);

  if (!value) {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : Number.NaN;
};

export const GET: APIRoute = async ({ url }) => {
  const minPrice = getNumberParam(url, "minPrice");
  const maxPrice = getNumberParam(url, "maxPrice");

  if (Number.isNaN(minPrice) || Number.isNaN(maxPrice)) {
    return Response.json(
      { error: "minPrice and maxPrice must be valid numbers." },
      { status: 400 },
    );
  }

  const filters: ProductSearchFilters = {
    query: getTextParam(url, "query") ?? getTextParam(url, "q"),
    category: getTextParam(url, "category"),
    material: getTextParam(url, "material"),
    color: getTextParam(url, "color"),
    minPrice,
    maxPrice,
  };
  const products = searchProducts(filters);

  return Response.json({
    count: products.length,
    filters,
    products,
  });
};
