import { Highlight } from "@remotion/rough-notation";
import { spring } from "remotion";
import { colors, fontFamily } from "../brand";
import { useCaptionClock } from "./timing";
import { type CaptionProps, splitHighlight } from "./types";

/** Option C: a tilted accent-colour sticker that pops in; the key phrase gets a mint marker. */
export const Sticker: React.FC<CaptionProps> = ({ text, highlight }) => {
  const { frame, fps, start, enter, exit } = useCaptionClock();
  const { before, mark, after } = splitHighlight(text, highlight);
  const pop = spring({ frame: frame - start, fps, config: { damping: 11, stiffness: 170 } });

  return (
    <>
      <div
        style={{
          maxWidth: 760,
          padding: "22px 36px 26px",
          borderRadius: 26,
          backgroundColor: colors.accent,
          boxShadow: "0 16px 40px rgba(42,31,196,0.35)",
          color: "white",
          fontFamily,
          fontSize: 62,
          fontWeight: 750,
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
          textAlign: "center",
          scale: `${0.55 + pop * 0.45}`,
          rotate: `${-10 + pop * 7}deg`,
          opacity: Math.min(1, pop * 3) * exit,
        }}
      >
        {before}
        {mark ? (
          <Highlight color={colors.marker} progress={enter(0.5, 0.35)} iterations={1}>
            <span style={{ color: colors.ink }}>{mark}</span>
          </Highlight>
        ) : null}
        {after}
      </div>
    </>
  );
};
