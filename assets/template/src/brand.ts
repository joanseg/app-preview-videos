/**
 * Everything app-specific lives here. Fill it in from the app's design tokens
 * (a DESIGN.md, a tokens file, the app's asset catalog) before building videos.
 */
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const brand = {
  /** Shown big on the end card. Use the app's real wordmark casing. */
  wordmark: "appname",
  /** One line under the wordmark: the app's tagline or subtitle. */
  tagline: "Your tagline here.",
  /** The font file in public/fonts/ and its family name. */
  font: { family: "Schibsted Grotesk", file: "fonts/SchibstedGrotesk.ttf", weights: "400 900" },
} as const;

export const colors = {
  /** Four soft background stops (top-left, top-right, bottom-right, bottom-left) over a base. */
  backdrop: ["#FFD8C0", "#C9CFFF", "#BFF0E2", "#F7CFEE"] as const,
  backdropBase: "#F8F7FC",
  /** Text on the backdrop. */
  ink: "#171429",
  inkQuiet: "#565072",
  /** The brand accent: highlighted words, tap rings, the sticker style. */
  accent: "#2A1FC4",
  /** Accent for text (often a shade darker than `accent`). */
  accentInk: "#3B2FA8",
  /** A light second colour for the sticker style's marker. */
  marker: "#BFF0E2",
} as const;

export const fontFamily = brand.font.family;

loadFont({ family: fontFamily, url: staticFile(brand.font.file), weight: brand.font.weights });

/** The recordings' pixel size (all clips in a project must share it). */
export const source = { width: 1180, height: 2556 } as const;

/** Output frames. See the skill's references/platform-specs.md. */
export const formats = {
  appStorePreview: { width: 886, height: 1920, fps: 30 },
  socialVertical: { width: 1080, height: 1920, fps: 30 },
  appStoreScreenshot: { width: 1320, height: 2868 },
  playScreenshot: { width: 1080, height: 1920 },
} as const;

/** Preview layout: captions in a band at the top, the recording below it on the backdrop. */
export const stage = (() => {
  const bandHeight = 380;
  const height = 1500;
  return {
    bandHeight,
    screen: { top: bandHeight, height, width: Math.round((height * source.width) / source.height) },
  };
})();
