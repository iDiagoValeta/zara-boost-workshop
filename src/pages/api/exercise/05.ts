import type { APIRoute } from "astro";
import { performanceExperiment } from "../../../exercise/05-agent-skills-performance";

type CheckViolation = {
  label: string;
  message: string;
};

const getViolations = (): CheckViolation[] => {
  const violations: CheckViolation[] = [];

  if (performanceExperiment.state === "baseline") {
    violations.push({
      label: "baseline state",
      message: "Switch the exercise data to an optimized state after the performance pass.",
    });
  }

  if (performanceExperiment.busyWorkMs > 0) {
    violations.push({
      label: "main-thread blocking work",
      message: "Remove the artificial busy loop so the initial render is not blocked.",
    });
  }

  if (performanceExperiment.missingImageDimensions) {
    violations.push({
      label: "missing image dimensions",
      message: "Set width and height on images to avoid layout shifts.",
    });
  }

  if (!performanceExperiment.useLazyLoading) {
    violations.push({
      label: "eager below-the-fold images",
      message: "Lazy-load gallery images that are below the fold.",
    });
  }

  if (!performanceExperiment.preloadHero) {
    violations.push({
      label: "unprioritized hero image",
      message: "Prioritize the hero image after reducing its size.",
    });
  }

  if (performanceExperiment.duplicateMarqueeItems > 12) {
    violations.push({
      label: "duplicated decorative DOM",
      message: "Reduce repeated decorative items that do not add meaning.",
    });
  }

  if (performanceExperiment.renderInvisiblePanels) {
    violations.push({
      label: "invisible panels",
      message: "Remove hidden/offscreen panels that make the DOM heavier.",
    });
  }

  const hasOversizedImages = [
    performanceExperiment.hero,
    ...performanceExperiment.gallery,
  ].some((image) => image.src.includes("w=2200") || image.src.includes("w=2400"));

  if (hasOversizedImages) {
    violations.push({
      label: "oversized remote images",
      message: "Use constrained image variants for the rendered sizes.",
    });
  }

  return violations;
};

export const prerender = false;

export const POST: APIRoute = async () => {
  const violations = getViolations();

  return Response.json({
    passed: violations.length === 0,
    violations,
    state: performanceExperiment.state,
  });
};
