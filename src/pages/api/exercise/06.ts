import type { APIRoute } from "astro";
import { mcpTools } from "../../../exercise/06-zara-mcp";

export const prerender = false;

export const POST: APIRoute = async () => {
  return Response.json({
    passed: true,
    expectedTools: mcpTools.map((tool) => tool.name),
    checks: [
      "The exercise expects a stdio MCP server.",
      "list_products is already implemented in the starter.",
      "Students should implement get_product and search_products.",
      "Run MCP Inspector against pnpm mcp:zara while developing.",
      "Run pnpm mcp:zara:test to verify the reference implementation end to end.",
    ],
  });
};
