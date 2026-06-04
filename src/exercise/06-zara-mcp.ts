// Exercise 06: Build a Zara Products MCP server
//
// Challenge:
// 1. Start from a working MCP server with list_products already implemented.
// 2. Implement get_product and search_products.
// 3. Test the server with the MCP Inspector and with the smoke test script.
//
// Starter file:
// - src/mcp/zara-products.server.ts
//

export type McpToolBrief = {
  name: string;
  purpose: string;
  input: string;
  output: string;
};

export type McpExerciseStep = {
  title: string;
  description: string;
};

export const mcpTools: McpToolBrief[] = [
  {
    name: "list_products",
    purpose: "Already implemented in the starter. Lists products from the fake Zara catalog.",
    input: "{ limit?: number }",
    output: "{ count, total, products }",
  },
  {
    name: "get_product",
    purpose: "Recover one product by id, slug or normalized reference.",
    input: "{ id: string }",
    output: "{ product } or an MCP error result",
  },
  {
    name: "search_products",
    purpose: "Search by text, category, material, color and price range.",
    input:
      "{ query?: string, category?: string, material?: string, color?: string, minPrice?: number, maxPrice?: number, limit?: number }",
    output: "{ count, filters, products }",
  },
];

export const setupCommands = `# 1. Install dependencies
pnpm install

# 2. Run the starter MCP server.
# list_products already works here.
pnpm mcp:zara

# 3. Open MCP Inspector against the starter
pnpm mcp:zara:inspect

# 4. Run the reference solution MCP server
pnpm mcp:zara:solution

# 5. Smoke-test the solution from a real MCP client
pnpm mcp:zara:test`;

export const inspectorCommands = `# Open the MCP Inspector against the starter
pnpm mcp:zara:inspect

# First test the tool that is already implemented:
# - list_products with { "limit": 3 }

# After completing the TODOs, test:
# - get_product with { "id": "548714046" }
# - search_products with { "query": "vestido", "color": "azul" }`;

export const cursorConfigExample = `{
  "mcpServers": {
    "zara-products": {
      "command": "node",
      "args": [
        "./node_modules/.pnpm/tsx@4.22.4/node_modules/tsx/dist/cli.mjs",
        "./src/mcp/zara-products.server.ts"
      ],
      "cwd": "/absolute/path/to/zara-boost-workshop"
    }
  }
}`;

export const cursorConfigNotes: string[] = [
  "Cursor lanza el MCP sin el PATH de tu shell, asi que binarios gestionados por fnm/nvm (pnpm, node) no se encuentran y la conexion se cierra al instante.",
  "Llamamos a node directamente con el CLI de tsx y rutas relativas al cwd, sin depender de pnpm ni del PATH.",
  "Usamos tsx (no node a secas) porque el servidor importa modulos sin extension y un JSON, cosas que el soporte nativo de TS de Node todavia no resuelve.",
  "Ajusta cwd a la ruta absoluta de tu proyecto y la version de tsx@x.y.z a la instalada en node_modules/.pnpm.",
];

export const implementationSteps: McpExerciseStep[] = [
  {
    title: "Inspect the starter server",
    description:
      "The server already uses McpServer with StdioServerTransport, and list_products already returns real products from the local catalog.",
  },
  {
    title: "Reuse the existing product layer",
    description:
      "Keep using src/lib/products. getProducts is already wired; import getProductById and searchProducts for the two missing tools.",
  },
  {
    title: "Complete get_product",
    description:
      "Use the existing id input schema, call getProductById(id) and return either { product } or an MCP error result when the product does not exist.",
  },
  {
    title: "Complete search_products",
    description:
      "Use searchProducts(filters), apply the optional limit and return { count, filters, products } using the existing JSON response helper.",
  },
  {
    title: "Test with a client",
    description:
      "Run pnpm mcp:zara:inspect while developing. Run pnpm mcp:zara:test to verify the complete reference implementation.",
  },
];