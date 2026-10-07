import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../brand";

type Props = {
  /** Horizontal position as a fraction of the frame width (0 left, 1 right). */
  readonly x: number;
  /** Vertical position as a fraction of the frame height (0 top, 1 bottom). */
  readonly y: number;
};

/** A touch hotspot: a dot with a ring that expands and fades over 0.6 s, marking a tap. */
export const TapRing: React.FC<Props> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const size = 130;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderRadius: "50%",
          border: `6px solid ${colors.accent}`,
          scale: interpolate(frame, [0, 0.6 * fps], [0.4, 1.3], clamp),
          opacity: interpolate(frame, [0, 0.15 * fps, 0.6 * fps], [0, 0.9, 0], clamp),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          width: 56,
          height: 56,
          marginLeft: -28,
          marginTop: -28,
          borderRadius: "50%",
          backgroundColor: "rgba(42,31,196,0.35)",
          opacity: interpolate(frame, [0, 0.1 * fps, 0.45 * fps], [0, 1, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
