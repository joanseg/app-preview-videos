import { Underline } from "@remotion/rough-notation";
import { colors, fontFamily } from "../brand";
import { useCaptionClock } from "./timing";
import { type CaptionProps, splitHighlight } from "./types";

const halo = "0 0 18px rgba(255,255,255,0.95), 0 0 42px rgba(255,255,255,0.85)";

/** Option B: big words that rise in one by one; the key phrase gets a hand-drawn underline. */
export const Kinetic: React.FC<CaptionProps> = ({ text, highlight }) => {
  const { enter, exit } = useCaptionClock();
  const { before, mark, after } = splitHighlight(text, highlight);
  // Punctuation straight after the highlight (", before…") stays glued to it.
  const rest = after.split(" ");
  const glue = after.startsWith(" ") ? "" : (rest.shift() ?? "");
  const chunks = [
    ...before.split(" ").filter(Boolean).map((w) => ({ w, mark: false, glue: "" })),
    ...(mark ? [{ w: mark, mark: true, glue }] : []),
    ...rest.filter(Boolean).map((w) => ({ w, mark: false, glue: "" })),
  ];
  const wordsDone = 0.45 + chunks.length * 0.07;

  return (
    <>
      <div
        style={{
          maxWidth: 800,
          textAlign: "center",
          fontFamily,
          fontSize: 78,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.02,
          color: colors.ink,
          textShadow: halo,
          opacity: exit,
        }}
      >
        {chunks.map((c, i) => {
          const t = enter(0.45, i * 0.07);
          const word = (
            <span
              style={{
                display: "inline-block",
                color: c.mark ? colors.accent : colors.ink,
                opacity: t,
                translate: `0px ${(1 - t) * 50}px`,
                filter: `blur(${(1 - t) * 10}px)`,
              }}
            >
              {c.w}
            </span>
          );
          return (
            <span key={`${c.w}-${i}`}>
              {c.mark ? (
                <Underline
                  color={colors.accent}
                  strokeWidth={7}
                  iterations={1}
                  progress={enter(0.45, wordsDone)}
                >
                  {word}
                </Underline>
              ) : (
                word
              )}
              {c.glue ? <span style={{ display: "inline-block", opacity: t }}>{c.glue}</span> : null}{" "}
            </span>
          );
        })}
      </div>
    </>
  );
};
