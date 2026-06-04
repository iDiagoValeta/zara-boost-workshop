import type { APIRoute } from "astro";
import { getProductById } from "../../../lib/products";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return Response.json({ error: "Missing product id." }, { status: 400 });
  }

  const product = getProductById(id);

  if (!product) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  return Response.json({ product });
};
