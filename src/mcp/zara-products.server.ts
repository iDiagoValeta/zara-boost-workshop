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
    title: "TODO",
    description: "TODO",
    inputSchema: {
      todo: z.string()
    },
  },
  async ({ id }: { id: string }) => {
    createJsonResponse({
      todo: "TODO 1: import getProductById and return either { product } or an MCP error result.",
    }),
);

server.registerTool(
  "search_products",
  {
    title: "TODO",
    description: "TODO",
    inputSchema: {
      todo: z.string()
    },
  },
  async ({ limit, ...filters }: ProductSearchFilters & { limit?: number }) => {
    // const products = searchProducts(...)
    const products = []

    return createJsonResponse({
      count: products.length,
      filters,
      products,
    });
  }
);

// DO NO TOUCH THIS CODE
const transport = new StdioServerTransport();
await server.connect(transport);
