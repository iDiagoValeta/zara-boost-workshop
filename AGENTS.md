# AGENTS.md

## Package manager

- Always use **`pnpm`** for this project. Never use `npm` or `yarn`.
- Install dependencies: `pnpm install`
- Add a dependency: `pnpm add <package>`
- Add a dev dependency: `pnpm add -D <package>`
- Run scripts: `pnpm <script>` (for example, `pnpm dev`, `pnpm build`, `pnpm preview`).

Do not generate or commit `package-lock.json` or `yarn.lock` files. The only valid lockfile is `pnpm-lock.yaml`.

## Coding style

- Write all code identifiers (variables, functions, types, parameters) in **English**.
- Never use Spanish words in identifiers (for example, use `seasonalDiscount`, not `descuentoTemporada`).
- Keep brand names (such as Zara) out of identifiers. They belong in visible copy, prompts or content strings, not in variable or function names.
- When rebuilding a file, keep the exported types and functions stable so existing pages and imports keep working.
