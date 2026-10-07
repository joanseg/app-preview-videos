import { createContext, useContext } from "react";

export type CaptionProps = {
  readonly text: string;
  /** A word or phrase inside `text` to emphasise. */
  readonly highlight?: string;
  /** Small label above the headline; only the editorial style shows it. */
  readonly kicker?: string;
};

export type CaptionStyle = "glass" | "kinetic" | "sticker" | "editorial";

/** Which caption style the videos use; CaptionLab overrides it per comparison render. */
export const CaptionStyleContext = createContext<CaptionStyle>("kinetic");
export const useCaptionStyle = () => useContext(CaptionStyleContext);

/** Splits `text` around `highlight` so a style can treat the highlighted part on its own. */
export const splitHighlight = (text: string, highlight?: string) => {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || at < 0) return { before: text, mark: "", after: "" };
  return { before: text.slice(0, at), mark: highlight, after: text.slice(at + highlight.length) };
};
