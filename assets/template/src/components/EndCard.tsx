import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, colors, fontFamily } from "../brand";
import { Backdrop } from "./Backdrop";

type Props = {
  /** Small print under the lockup, one line each. */
  readonly notes: readonly string[];
};

/** Closing frame: the wordmark, the tagline and the required disclosures. */
export const EndCard: React.FC<Props> = ({ notes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const ease = Easing.bezier(0.16, 1, 0.3, 1);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 28 }}>
        <div
          style={{
            color: colors.accentInk,
            fontSize: 190,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            scale: interpolate(frame, [0, 0.7 * fps], [0.9, 1], { ...clamp, easing: ease }),
            opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], clamp),
          }}
        >
          {brand.wordmark}
        </div>
        <div
          style={{
            color: colors.ink,
            fontSize: 58,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            opacity: interpolate(frame, [0.4 * fps, 0.9 * fps], [0, 1], clamp),
          }}
        >
          {brand.tagline}
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 150,
          gap: 8,
          opacity: interpolate(frame, [0.8 * fps, 1.2 * fps], [0, 1], clamp),
        }}
      >
        {notes.map((note) => (
          <div key={note} style={{ color: colors.inkQuiet, fontSize: 30, fontWeight: 500 }}>
            {note}
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
