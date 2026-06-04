import type { APIRoute } from "astro";
import { getProducts } from "../../../lib/products";

export const prerender = false;

export const GET: APIRoute = async () => {
  const products = getProducts();

  return Response.json({
    count: products.length,
    products,
  });
};
