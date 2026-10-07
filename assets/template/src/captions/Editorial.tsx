import { colors, fontFamily } from "../brand";
import { useCaptionClock } from "./timing";
import { type CaptionProps, splitHighlight } from "./types";

/** Option D: a left-aligned card with a small kicker, a headline that wipes up and a brand-colour edge. */
export const Editorial: React.FC<CaptionProps> = ({ text, highlight, kicker }) => {
  const { enter, exit } = useCaptionClock();
  const { before, mark, after } = splitHighlight(text, highlight);
  const card = enter(0.5);
  const line = enter(0.6, 0.15);

  return (
    <>
      <div
        style={{
          position: "relative",
          alignSelf: "stretch",
          padding: "26px 38px 30px 48px",
          borderRadius: 28,
          overflow: "hidden",
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(24px) saturate(1.4)",
          boxShadow: "0 18px 50px rgba(23,20,41,0.16)",
          fontFamily,
          opacity: card * exit,
          translate: `${(1 - card) * -50}px 0px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 12,
            background: `linear-gradient(${colors.backdrop[0]}, ${colors.backdrop[1]}, ${colors.accent}, ${colors.backdrop[2]})`,
            scale: `1 ${card}`,
            transformOrigin: "top",
          }}
        />
        {kicker ? (
          <div
            style={{
              color: colors.accent,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 10,
              opacity: enter(0.4, 0.1),
            }}
          >
            {kicker}
          </div>
        ) : null}
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              color: colors.ink,
              fontSize: 60,
              fontWeight: 750,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              translate: `0px ${(1 - line) * 110}%`,
            }}
          >
            {before}
            <span style={{ color: colors.accent }}>{mark}</span>
            {after}
          </div>
        </div>
      </div>
    </>
  );
};
