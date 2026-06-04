import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getDisplaySummary } from "../../../exercise/04-coding-guidelines";

type CheckViolation = {
  label: string;
  message: string;
};

const exerciseFile = "src/exercise/04-coding-guidelines.ts";

const restrictedPatterns = [
  {
    label: "`zara`",
    pattern: /zara/i,
    message: "The brand name appears in source code. Keep it out of identifiers.",
  },
  {
    label: "`zaraCatalogo`",
    pattern: /\bzaraCatalogo\b/,
    message: "Rename the catalog variable to English and avoid brand names.",
  },
  {
    label: "`descuentoTemporada`",
    pattern: /\bdescuentoTemporada\b/,
    message: "Rename the discount variable to English.",
  },
  {
    label: "`obtenerProductoPrincipal`",
    pattern: /\bobtenerProductoPrincipal\b/,
    message: "Rename the selector function to English.",
  },
  {
    label: "`calcularPrecioFinal`",
    pattern: /\bcalcularPrecioFinal\b/,
    message: "Rename the pricing helper to English.",
  },
  {
    label: "`precioOriginal`",
    pattern: /\bprecioOriginal\b/,
    message: "Rename the price parameter to English.",
  },
  {
    label: "`productoDestacado`",
    pattern: /\bproductoDestacado\b/,
    message: "Rename the featured product variable to English.",
  },
  {
    label: "`precioFinal`",
    pattern: /\bprecioFinal\b/,
    message: "Rename the final price variable to English.",
  },
  {
    label: "`tallasDisponibles`",
    pattern: /\btallasDisponibles\b/,
    message: "Rename the available sizes variable to English.",
  },
];

const getSource = () => readFile(join(process.cwd(), exerciseFile), "utf-8");

const getViolations = (source: string): CheckViolation[] =>
  restrictedPatterns
    .filter(({ pattern }) => pattern.test(source))
    .map(({ label, message }) => ({ label, message }));

const assertSummaryShape = () => {
  const summary = getDisplaySummary();

  if (!summary.title || !summary.description || !summary.product.name) {
    throw new Error("The display summary is missing required copy.");
  }

  if (!summary.product.formattedPrice || !summary.product.savingsLabel) {
    throw new Error("The product summary is missing formatted pricing.");
  }

  if (!Array.isArray(summary.pills) || summary.pills.length < 3) {
    throw new Error("The summary must include at least three pills.");
  }

  return summary;
};

export const prerender = false;

export const POST: APIRoute = async () => {
  try {
    const source = await getSource();
    const violations = getViolations(source);
    const summary = assertSummaryShape();

    return Response.json({
      passed: violations.length === 0,
      file: exerciseFile,
      violations,
      summary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return Response.json({ error: message }, { status: 500 });
  }
};
