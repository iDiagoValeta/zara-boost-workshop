// Exercise 05: Agent Skills + Lighthouse performance pass
//
// Challenge:
// 1. Run Lighthouse against /exercise/05 and capture the baseline score.
// 2. Install one skill from addyosmani/web-quality-skills.
// 3. Ask the agent to use the installed skill to improve this page.
// 4. Run Lighthouse again and compare the before/after.
//
// This starter file intentionally keeps a few performance problems so the
// improvement is visible during the workshop.

export type SkillInstallOption = {
  label: string;
  command: string;
  note: string;
};

export type CampaignImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type PerformanceExperiment = {
  state: "baseline" | "optimized";
  statusLabel: string;
  hero: CampaignImage;
  gallery: CampaignImage[];
  busyWorkMs: number;
  duplicateMarqueeItems: number;
  renderInvisiblePanels: boolean;
  missingImageDimensions: boolean;
  useLazyLoading: boolean;
  preloadHero: boolean;
};

export const skillsBriefing = [
  {
    title: "skills.sh",
    description:
      "The public directory and leaderboard from Vercel for discovering reusable Agent Skills. A skill is usually a folder with a SKILL.md file that tells the agent when and how to apply a specialized workflow.",
    url: "https://skills.sh",
  },
  {
    title: "skills CLI",
    description:
      "The installer for skills. It can add a whole repository, one specific skill from that repository, list available skills and search the ecosystem.",
    url: "https://vercel.com/docs/agent-resources/skills",
  },
  {
    title: "autoskills",
    description:
      "A zero-config CLI that scans the project stack and installs curated skills for agents such as Cursor and Claude Code. It uses skills.sh under the hood.",
    url: "https://github.com/midudev/autoskills",
  },
] as const;

export const installOptions: SkillInstallOption[] = [
  {
    label: "Install the full Web Quality Skills pack",
    command: "pnpm dlx skills add addyosmani/web-quality-skills",
    note: "Adds performance, Core Web Vitals, accessibility, SEO, best-practices and the full web-quality audit skill.",
  },
  {
    label: "Install only the performance skill",
    command: "pnpm dlx skills add addyosmani/web-quality-skills --skill performance",
    note: "Best if the exercise should focus only on loading speed, images, fonts and JavaScript cost.",
  },
  {
    label: "Let autoskills choose from the project stack",
    command: "pnpm dlx autoskills -a cursor",
    note: "Scans package.json, lockfiles and config files, then proposes relevant skills for Cursor.",
  },
];

export const agentPrompt = `Usa la skill de performance de addyosmani/web-quality-skills para auditar y optimizar el ejercicio 05.

Objetivo:
- Mejorar Lighthouse Performance de /exercise/05 de forma clara.
- Mantener el contenido y la estética de la página.
- Optimizar imágenes, trabajo de JavaScript, layout shifts y DOM innecesario.
- No tocar README.md.

Archivos principales:
- src/pages/exercise/05.astro
- src/exercise/05-agent-skills-performance.ts

Cuando termines, explícame qué cambió y qué debería mejorar en Lighthouse.`;

export const optimizationHints = [
  "Reduce oversized remote images and set explicit width and height.",
  "Remove the artificial main-thread blocking work from the starter.",
  "Lazy-load below-the-fold images and prioritize only the hero.",
  "Delete hidden/offscreen DOM that is not needed for the visible page.",
  "Keep the same visual story while reducing bytes and layout instability.",
];

const heroImageBase =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=70&w=1024";

export const performanceExperiment: PerformanceExperiment = {
  state: "optimized",
  statusLabel: "After · optimized",
  hero: {
    src: `${heroImageBase}&ixlib=rb-4.1.0`,
    alt: "Editorial fashion campaign with layered neutral garments",
    caption: "Constrained hero image with explicit dimensions and priority load.",
    width: 1024,
    height: 1280,
  },
  gallery: [
    {
      src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=70&w=800",
      alt: "Studio model wearing a long coat",
      caption: "Lazy-loaded image below the fold.",
      width: 800,
      height: 1000,
    },
    {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=70&w=800",
      alt: "Monochrome editorial outfit",
      caption: "Explicit dimensions avoid layout shifts.",
      width: 800,
      height: 1000,
    },
    {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=70&w=800",
      alt: "Fashion retail shopping street",
      caption: "Constrained remote asset, lazy-loaded.",
      width: 800,
      height: 533,
    },
  ],
  busyWorkMs: 0,
  duplicateMarqueeItems: 12,
  renderInvisiblePanels: false,
  missingImageDimensions: false,
  useLazyLoading: true,
  preloadHero: true,
};
