# Zara Boost · AI for Developers Workshop

A 2-hour hands-on workshop by **midudev**: from prompts to agents.

We build a real AI workflow for a fashion ecommerce frontend team — installing and
creating **Skills**, a custom **command**, a tiny **MCP server**, and running AI
**locally in the browser** with the Prompt API and WebGPU.

> This repository contains the presentation site and the exercises we build live.

## Requirements

You need two things installed on your machine.

### 1. Node.js (v22.12 or higher)

Download and install the LTS version from [nodejs.org](https://nodejs.org).

Check it works:

```sh
node --version
# v22.12.0 or higher
```

### 2. pnpm

This project uses **pnpm** as its package manager (do not use `npm` or `yarn` to
install dependencies). Once Node.js is installed, install pnpm globally:

```sh
npm install -g pnpm@latest-11
```

Check it works:

```sh
pnpm --version
```

## Get the project

You have two options.

### Option A — Clone with Git (recommended)

```sh
git clone https://github.com/midudev/zara-boost-workshop.git
cd zara-boost-workshop
```

### Option B — Download without Git

If you don't have Git installed, you can download the project as a ZIP:

1. Go to the repository: `https://github.com/midudev/zara-boost-workshop`
2. Click the green **Code** button → **Download ZIP**.
3. Unzip it and open the folder in your terminal:

```sh
cd zara-boost-workshop
```

## Run it

From the root of the project:

```sh
pnpm install
pnpm dev
```

Then open [http://localhost:4321](http://localhost:4321).

## Exercise 01 — OpenAI

The first exercise is in `src/exercise/01-our-first-query.ts`.

You will create an [OpenAI](https://platform.openai.com) account, generate an API
key, and complete the TODOs in the file to translate/adapt product copy for
`en`, `es` and `fr`.

Before running the exercise, paste your API key into the `OPENAI_API_KEY`
constant in `src/exercise/01-our-first-query.ts`:

```ts
const OPENAI_API_KEY = "your-key-here";
```

Do not commit API keys or `.env` files.

## Commands

All commands are run from the root of the project:

| Command         | Action                                       |
| :-------------- | :------------------------------------------- |
| `pnpm install`  | Install dependencies                         |
| `pnpm dev`      | Start the dev server at `localhost:4321`     |
| `pnpm build`    | Build the production site to `./dist/`        |
| `pnpm preview`  | Preview the production build locally          |

## Tech stack

- [Astro](https://astro.build) — site framework
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [Geist](https://vercel.com/font) — Geist Pixel & Geist Mono typefaces
