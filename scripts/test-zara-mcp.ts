import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "pnpm",
  args: ["tsx", "src/mcp/zara-products.server.ts"],
  stderr: "inherit",
});

const client = new Client({
  name: "zara-products-smoke-test",
  version: "1.0.0",
});

await client.connect(transport);

try {
  const tools = await client.listTools();
  const toolNames = tools.tools.map((tool) => tool.name);
  const expectedTools = ["list_products", "get_product", "search_products"];
  const missingTools = expectedTools.filter((toolName) => !toolNames.includes(toolName));

  if (missingTools.length > 0) {
    throw new Error(`Missing MCP tools: ${missingTools.join(", ")}`);
  }

  const listResult = await client.callTool({
    name: "list_products",
    arguments: { limit: 2 },
  });
  const searchResult = await client.callTool({
    name: "search_products",
    arguments: { query: "vestido", color: "azul", limit: 3 },
  });
  const detailResult = await client.callTool({
    name: "get_product",
    arguments: { id: "548714046" },
  });

  console.log("MCP tools:", toolNames.join(", "));
  console.log("list_products:", listResult.content);
  console.log("search_products:", searchResult.content);
  console.log("get_product:", detailResult.content);
  console.log("Zara MCP smoke test passed.");
} finally {
  await client.close();
}
