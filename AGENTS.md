# AGENTS.md

## Package manager

- Always use **`pnpm`** for this project. Never use `npm` or `yarn`.
- Install dependencies: `pnpm install`
- Add a dependency: `pnpm add <package>`
- Add a dev dependency: `pnpm add -D <package>`
- Run scripts: `pnpm <script>` (for example, `pnpm dev`, `pnpm build`, `pnpm preview`).

Do not generate or commit `package-lock.json` or `yarn.lock` files. The only valid lockfile is `pnpm-lock.yaml`.
