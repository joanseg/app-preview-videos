import { colors, fontFamily } from "../brand";
import { useCaptionClock } from "./timing";
import { type CaptionProps, splitHighlight } from "./types";

/** Option A: a frosted-glass pill that rises in. */
export const Glass: React.FC<CaptionProps> = ({ text, highlight }) => {
  const { enter, exit } = useCaptionClock();
  const { before, mark, after } = splitHighlight(text, highlight);
  const t = enter(0.5);

  return (
    <>
      <div
        style={{
          maxWidth: 780,
          padding: "26px 40px",
          borderRadius: 36,
          backgroundColor: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(24px) saturate(1.4)",
          boxShadow: "0 18px 50px rgba(23,20,41,0.18)",
          color: colors.ink,
          fontFamily,
          fontSize: 54,
          fontWeight: 650,
          letterSpacing: "-0.02em",
          lineHeight: 1.12,
          textAlign: "center",
          opacity: t * exit,
          translate: `0px ${(1 - t) * 40}px`,
        }}
      >
        {before}
        <span style={{ color: colors.accent }}>{mark}</span>
        {after}
      </div>
    </>
  );
};
