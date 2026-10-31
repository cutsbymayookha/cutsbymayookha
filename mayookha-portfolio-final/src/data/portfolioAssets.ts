export interface ProjectDesign {
  projectId: string;
  designNumber: number;
  src: string;
  cardWebp: string;
  thumbWebp: string;
  width: number;
  height: number;
  label: string;
  slug: string;
  heading?: string;
  description?: string;
  statement?: string;
}

export interface ProjectOpeningAnimation {
  type: "svg-component";
  componentPath: string;
  description: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  projectHeading?: string;
  projectSubtitle?: string;
  brand: string;
  category: string;
  description: string;
  coverImage: string;
  coverWebp: string;
  coverWidth: number;
  coverHeight: number;
  openingAnimation: ProjectOpeningAnimation;
  designs: ProjectDesign[];
}

export interface SiteImageAsset {
  id: string;
  label: string;
  src: string;
  width: number;
  height: number;
}

export interface SiteDocumentAsset {
  id: string;
  label: string;
  src: string;
  downloadFilename: string;
}

/**
 * Resolves a public-root asset path safely across development, production, and Netlify.
 * Ensures no accidental `/public/` prefix is present and supports cache-busting retries.
 */
export function resolveAssetUrl(rawPath: string, retryCount = 0): string {
  const trimmed = rawPath.trim().replace(/^\/?public\//i, "/");
  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  const baseUrl =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    typeof import.meta.env.BASE_URL === "string"
      ? import.meta.env.BASE_URL
      : "/";

  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const fullPath = `${cleanBase}${normalizedPath}`;
  const encoded = encodeURI(fullPath);

  if (retryCount > 0) {
    const separator = encoded.includes("?") ? "&" : "?";
    return `${encoded}${separator}retry=${retryCount}`;
  }

  return encoded;
}

export const SITE_ASSETS: {
  landingPortrait: SiteImageAsset;
  aboutPortrait: SiteImageAsset;
  resumePdf: SiteDocumentAsset;
} = {
  landingPortrait: {
    id: "landing-portrait",
    label: "Landing Page Profile Photograph",
    src: "/landing-page-profile-pic.jpg",
    width: 405,
    height: 567,
  },
  aboutPortrait: {
    id: "about-portrait",
    label: "About Me Profile Photograph",
    src: "/about-me-profile-pic.jpg",
    width: 526,
    height: 758,
  },
  resumePdf: {
    id: "resume-pdf",
    label: "Mayookha Kurup Resume PDF",
    src: "/Resume.pdf",
    downloadFilename: "Resume.pdf",
  },
};

export const projects: Project[] = [
  {
    id: 1,
    slug: "alhind-air",
    title: "The Plot Takes Flight",
    subtitle: "Brand Strategy and Identity",
    projectHeading: "Alhind Air",
    brand: "ALHIND AIR",
    category: "Brand Strategy and Identity",
    description:
      "This project explores the branding of Alhind Air, an emerging airline developed by the Alhind Group focused on regional and international connectivity. The identity combines modern typography, a warm maroon and gold palette, and cohesive visual elements across brand guidelines, aircraft livery, boarding passes, and cabin touchpoints.",
    coverImage: "/alhind-air-cover.jpeg",
    coverWebp: "/alhind-air-cover.jpeg",
    coverWidth: 1600,
    coverHeight: 900,
    openingAnimation: {
      type: "svg-component",
      componentPath: "src/components/AlhindLandingTransition.tsx",
      description: "Airplane descending toward and landing on the runway",
    },
    designs: [
      {
        projectId: "alhind-air",
        designNumber: 1,
        src: "/alhind-air-design-1.jpeg",
        cardWebp: "/alhind-air-design-1.jpeg",
        thumbWebp: "/alhind-air-design-1.jpeg",
        width: 1600,
        height: 900,
        label: "Alhind Air Design 1",
        slug: "alhind-air-design-1",
        heading: "Alhind Air: The Making",
        description:
          "Developed a complete brand identity system, including logo design, typography, colour palette and brand applications. Extended the identity across boarding passes, aircraft livery and other branded touchpoints to maintain visual consistency.",
      },
      {
        projectId: "alhind-air",
        designNumber: 2,
        src: "/alhind-air-design-2.jpg",
        cardWebp: "/alhind-air-design-2.jpg",
        thumbWebp: "/alhind-air-design-2.jpg",
        width: 1536,
        height: 1024,
        label: "Alhind Air Design 2",
        slug: "alhind-air-design-2",
      },
      {
        projectId: "alhind-air",
        designNumber: 3,
        src: "/alhind-air-design-3.jpg",
        cardWebp: "/alhind-air-design-3.jpg",
        thumbWebp: "/alhind-air-design-3.jpg",
        width: 1280,
        height: 853,
        label: "Alhind Air Design 3",
        slug: "alhind-air-design-3",
        description:
          "The Alhind Air logo combines a bold wordmark with a distinctive geometric symbol and circular elements. The upward-pointing forms suggest flight, movement and progress, while the plum and golden-yellow accents create a distinctive, warm and welcoming identity.",
      },
      {
        projectId: "alhind-air",
        designNumber: 4,
        src: "/alhind-air-design-4.jpg",
        cardWebp: "/alhind-air-design-4.jpg",
        thumbWebp: "/alhind-air-design-4.jpg",
        width: 1536,
        height: 1024,
        label: "Alhind Air Design 4",
        slug: "alhind-air-design-4",
      },
      {
        projectId: "alhind-air",
        designNumber: 5,
        src: "/alhind-air-design-5.jpg",
        cardWebp: "/alhind-air-design-5.jpg",
        thumbWebp: "/alhind-air-design-5.jpg",
        width: 1280,
        height: 853,
        label: "Alhind Air Design 5",
        slug: "alhind-air-design-5",
      },
      {
        projectId: "alhind-air",
        designNumber: 6,
        src: "/alhind-air-design-6.jpg",
        cardWebp: "/alhind-air-design-6.jpg",
        thumbWebp: "/alhind-air-design-6.jpg",
        width: 1280,
        height: 853,
        label: "Alhind Air Design 6",
        slug: "alhind-air-design-6",
      },
      {
        projectId: "alhind-air",
        designNumber: 7,
        src: "/alhind-air-design-7.jpg",
        cardWebp: "/alhind-air-design-7.jpg",
        thumbWebp: "/alhind-air-design-7.jpg",
        width: 1280,
        height: 640,
        label: "Alhind Air Design 7",
        slug: "alhind-air-design-7",
      },
      {
        projectId: "alhind-air",
        designNumber: 8,
        src: "/alhind-air-design-8.jpg",
        cardWebp: "/alhind-air-design-8.jpg",
        thumbWebp: "/alhind-air-design-8.jpg",
        width: 1280,
        height: 914,
        label: "Alhind Air Design 8",
        slug: "alhind-air-design-8",
        statement:
          "Alhind Air: bringing people closer, connecting places, and making every journey feel warmer.",
      },
    ],
  },
  {
    id: 2,
    slug: "himalyan-cheese",
    title: "Himalayan Cheese: The Big Melt",
    subtitle: "Packaging Design",
    projectHeading: "Himalyan Cheese",
    brand: "HIMALYAN CHEESE",
    category: "Packaging Design",
    description:
      "This project explores the playful and artisanal packaging design for Himalyan Cheese. Featuring warm golden-yellow tones, custom wedge-inspired structural packaging with an integrated carry handle, and bold graphic illustrations, the design creates an inviting and memorable shelf presence.",
    coverImage: "/himalyan-cheese-cover.jpeg",
    coverWebp: "/himalyan-cheese-cover.jpeg",
    coverWidth: 1600,
    coverHeight: 900,
    openingAnimation: {
      type: "svg-component",
      componentPath: "src/components/HimalyanCheeseTransition.tsx",
      description: "Golden-yellow cheese wedge softening and melting",
    },
    designs: [
      {
        projectId: "himalyan-cheese",
        designNumber: 1,
        src: "/himalyan-cheese-design-1.jpg",
        cardWebp: "/himalyan-cheese-design-1.jpg",
        thumbWebp: "/himalyan-cheese-design-1.jpg",
        width: 1280,
        height: 853,
        label: "Himalyan Cheese Design 1",
        slug: "himalyan-cheese-design-1",
        heading: "Packed with Character",
        description:
          "A playful and contemporary packaging design for Himalayan Cheese, created to make the product stand out through bold colours, geometric illustrations, and expressive typography. The vibrant yellow, orange, and burgundy palette, combined with abstract cheese-inspired graphics and fun phrases, gives the packaging a distinctive and energetic personality. The triangular box structure adds visual interest while making the packaging more engaging and memorable.",
      },
      {
        projectId: "himalyan-cheese",
        designNumber: 2,
        src: "/himalyan-cheese-design-2.jpg",
        cardWebp: "/himalyan-cheese-design-2.jpg",
        thumbWebp: "/himalyan-cheese-design-2.jpg",
        width: 765,
        height: 503,
        label: "Himalyan Cheese Design 2",
        slug: "himalyan-cheese-design-2",
        heading: "A LITTLE CHEESY",
      },
      {
        projectId: "himalyan-cheese",
        designNumber: 3,
        src: "/himalyan-cheese-design-3.jpg",
        cardWebp: "/himalyan-cheese-design-3.jpg",
        thumbWebp: "/himalyan-cheese-design-3.jpg",
        width: 1280,
        height: 904,
        label: "Himalyan Cheese Design 3",
        slug: "himalyan-cheese-design-3",
        heading: "Unfolding a Cheesy Plot",
        description:
          "The packaging dieline is designed for a triangular cheese box featuring a playful combination of vibrant yellow, orange, and burgundy. It integrates bold geometric illustrations, expressive typography, and cheese-inspired patterns across the panels, ensuring a cohesive visual identity when folded into its final form. The structure combines functionality with a distinctive, eye-catching design.",
      },
      {
        projectId: "himalyan-cheese",
        designNumber: 4,
        src: "/himalyan-cheese-design-4.jpg",
        cardWebp: "/himalyan-cheese-design-4.jpg",
        thumbWebp: "/himalyan-cheese-design-4.jpg",
        width: 1280,
        height: 853,
        label: "Himalyan Cheese Design 4",
        slug: "himalyan-cheese-design-4",
        statement: "And that’s a wrap… with an extra slice of cheese",
      },
    ],
  },
  {
    id: 3,
    slug: "oro-di-limone",
    title: "Oro di Limone: The Golden Pour",
    subtitle: "Packaging Design",
    projectHeading: "Oro di Limone — The Golden Pour",
    projectSubtitle: "Packaging Design",
    brand: "ORO DI LIMONE",
    category: "Packaging Design",
    description:
      "Inspired by the sun-drenched coastal charm of Italy, Oro di Limone (“Gold of Lemon”) is a premium Limoncello packaging and label identity. Botanical lemon blossom illustrations, Mediterranean blues, and refined typography come together across bottle labels and carton packaging to evoke authentic Italian craftsmanship.",
    coverImage: "/oro-di-limone-cover.jpeg",
    coverWebp: "/oro-di-limone-cover.jpeg",
    coverWidth: 1600,
    coverHeight: 900,
    openingAnimation: {
      type: "svg-component",
      componentPath: "src/components/OroDiLimoneTransition.tsx",
      description: "Golden-yellow limoncello liquid splash and droplets",
    },
    designs: [
      {
        projectId: "oro-di-limone",
        designNumber: 1,
        src: "/oro-di-limone-design-1.jpg",
        cardWebp: "/oro-di-limone-design-1.jpg",
        thumbWebp: "/oro-di-limone-design-1.jpg",
        width: 1280,
        height: 853,
        label: "Oro di Limone Design 1",
        slug: "oro-di-limone-design-1",
        heading: "Cue the Citrus",
        description:
          "Inspired by the sun-drenched coast of Amalfi, Oro di Limone captures the warmth, charm, and easy elegance of Italian summer. From lemon-filled streets to the blue Mediterranean, the visual direction brings the brand’s Italian roots to life, setting the scene for a golden, citrus-inspired liqueur.",
      },
      {
        projectId: "oro-di-limone",
        designNumber: 2,
        src: "/oro-di-limone-design-2.jpg",
        cardWebp: "/oro-di-limone-design-2.jpg",
        thumbWebp: "/oro-di-limone-design-2.jpg",
        width: 1280,
        height: 853,
        label: "Oro di Limone Design 2",
        slug: "oro-di-limone-design-2",
        heading: "Zest Things First",
        description:
          "First comes the zest, then comes a little taste of la dolce vita. Oro di Limone is a premium limoncello packaging concept inspired by Italy’s Mediterranean coast. The teal, cream, and golden-yellow palette, lemon motifs, and coastal illustrations capture the charm of Italian culture and architecture. An elegant bottle label paired with a matching outer carton brings the concept together in a distinctive, premium identity.",
      },
      {
        projectId: "oro-di-limone",
        designNumber: 3,
        src: "/oro-di-limone-design-3.jpeg",
        cardWebp: "/oro-di-limone-design-3.jpeg",
        thumbWebp: "/oro-di-limone-design-3.jpeg",
        width: 1600,
        height: 900,
        label: "Oro di Limone Design 3",
        slug: "oro-di-limone-design-3",
      },
      {
        projectId: "oro-di-limone",
        designNumber: 4,
        src: "/oro-di-limone-design-4.jpg",
        cardWebp: "/oro-di-limone-design-4.jpg",
        thumbWebp: "/oro-di-limone-design-4.jpg",
        width: 1280,
        height: 579,
        label: "Oro di Limone Design 4",
        slug: "oro-di-limone-design-4",
        heading: "Label Me Italian",
        description:
          "Every great pour deserves a label with character. The front label brings Oro di Limone to life through its brand name, product details, and decorative lemon motifs, while the back keeps essential product information clear and readable. Complementary colours, typography, and illustrations tie both labels together in a distinctly Italian-inspired identity.",
      },
      {
        projectId: "oro-di-limone",
        designNumber: 5,
        src: "/oro-di-limone-design-5.jpeg",
        cardWebp: "/oro-di-limone-design-5.jpeg",
        thumbWebp: "/oro-di-limone-design-5.jpeg",
        width: 1600,
        height: 900,
        label: "Oro di Limone Design 5",
        slug: "oro-di-limone-design-5",
        statement: "Now, let the good pours roll! PACKUP!",
      },
    ],
  },
  {
    id: 4,
    slug: "the-write-take",
    title: "The Write Take",
    subtitle: "Stationery Copywriting",
    projectHeading: "The Write Take — Stationery Copywriting",
    brand: "THE WRITE TAKE",
    category: "Stationery Copywriting",
    description:
      "The Write Take (Scripted) is a cinema-inspired stationery and lifestyle branding collection that brings storytelling and film culture into everyday creative tools. Through expressive typographic wordplay across pens, storyboards, tote bags, cue-card bookmarks, and desk calendars, the identity turns daily planning and sketching into a cinematic experience.",
    coverImage: "/the-write-take-cover.jpeg",
    coverWebp: "/the-write-take-cover.jpeg",
    coverWidth: 1600,
    coverHeight: 900,
    openingAnimation: {
      type: "svg-component",
      componentPath: "src/components/TheWriteTakeTransition.tsx",
      description: "Pencil physically writing the lowercase word 'script'",
    },
    designs: [
      {
        projectId: "the-write-take",
        designNumber: 1,
        src: "/the-write-take-design-1.jpeg",
        cardWebp: "/the-write-take-design-1.jpeg",
        thumbWebp: "/the-write-take-design-1.jpeg",
        width: 1600,
        height: 900,
        label: "The Write Take Design 1",
        slug: "the-write-take-design-1",
        heading: "The Reel Deal in Stationery",
        description:
          "The assignment focused on stationery copywriting, developing creative names, catchy taglines, and descriptions for everyday products. Inspired by cinema, I created Scripted, a movie-themed stationery brand featuring pens, a notebook, a tote bag, bookmarks, and a calendar. Through playful wordplay and a cohesive visual identity, I gave everyday essentials their own starring roles.",
      },
      {
        projectId: "the-write-take",
        designNumber: 2,
        src: "/the-write-take-design-2.jpg",
        cardWebp: "/the-write-take-design-2.jpg",
        thumbWebp: "/the-write-take-design-2.jpg",
        width: 1280,
        height: 790,
        label: "The Write Take Design 2",
        slug: "the-write-take-design-2",
        heading: "A Cast of Characters: Logos",
      },
      {
        projectId: "the-write-take",
        designNumber: 3,
        src: "/the-write-take-design-3.jpg",
        cardWebp: "/the-write-take-design-3.jpg",
        thumbWebp: "/the-write-take-design-3.jpg",
        width: 1280,
        height: 853,
        label: "The Write Take Design 3",
        slug: "the-write-take-design-3",
      },
      {
        projectId: "the-write-take",
        designNumber: 4,
        src: "/the-write-take-design-4.jpg",
        cardWebp: "/the-write-take-design-4.jpg",
        thumbWebp: "/the-write-take-design-4.jpg",
        width: 1280,
        height: 720,
        label: "The Write Take Design 4",
        slug: "the-write-take-design-4",
      },
      {
        projectId: "the-write-take",
        designNumber: 5,
        src: "/the-write-take-design-5.jpg",
        cardWebp: "/the-write-take-design-5.jpg",
        thumbWebp: "/the-write-take-design-5.jpg",
        width: 1280,
        height: 853,
        label: "The Write Take Design 5",
        slug: "the-write-take-design-5",
      },
      {
        projectId: "the-write-take",
        designNumber: 6,
        src: "/the-write-take-design-6.jpg",
        cardWebp: "/the-write-take-design-6.jpg",
        thumbWebp: "/the-write-take-design-6.jpg",
        width: 1280,
        height: 853,
        label: "The Write Take Design 6",
        slug: "the-write-take-design-6",
      },
      {
        projectId: "the-write-take",
        designNumber: 7,
        src: "/the-write-take-design-7.jpeg",
        cardWebp: "/the-write-take-design-7.jpeg",
        thumbWebp: "/the-write-take-design-7.jpeg",
        width: 1600,
        height: 900,
        label: "The Write Take Design 7",
        slug: "the-write-take-design-7",
        statement: "One collection. A thousand plotlines.",
      },
    ],
  },
];
