import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  getProductById,
  getProducts,
  searchProducts,
  type ProductSearchFilters,
} from "../lib/products";

const createJsonResponse = (payload: unknown) => ({
  content: [
    {
      type: "text" as const,
      text: JSON.stringify(payload, null, 2),
    },
  ],
});

const server = new McpServer({
  name: "zara-products",
  version: "0.1.0",
});

server.registerTool(
  "list_products",
  {
    title: "List Zara products",
    description: "Return products from the local fake Zara catalog.",
    inputSchema: {
      limit: z.number().int().min(1).max(50).optional(),
    },
  },
  async ({ limit = 12 }) => {
    const products = getProducts().slice(0, limit);

    return createJsonResponse({
      count: products.length,
      total: getProducts().length,
      products,
    });
  },
);

server.registerTool(
  "get_product",
  {
    title: "Get Zara product",
    description: "Recover one product by id, slug or normalized reference.",
    inputSchema: {
      id: z.string(),
    },
  },
  async ({ id }) => {
    const product = getProductById(id);

    if (!product) {
      return {
        ...createJsonResponse({ error: `Product not found: ${id}` }),
        isError: true,
      };
    }

    return createJsonResponse({ product });
  },
);

server.registerTool(
  "search_products",
  {
    title: "Search Zara products",
    description: "Search by text, category, material, color and price range.",
    inputSchema: {
      query: z.string().optional(),
      category: z.string().optional(),
      material: z.string().optional(),
      color: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      limit: z.number().int().min(1).max(50).optional(),
    },
  },
  async ({ limit = 12, ...filters }: ProductSearchFilters & { limit?: number }) => {
    const products = searchProducts(filters).slice(0, limit);

    return createJsonResponse({
      count: products.length,
      filters,
      products,
    });
  },
);

// DO NO TOUCH THIS CODE
const transport = new StdioServerTransport();
await server.connect(transport);
