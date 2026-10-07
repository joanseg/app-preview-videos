import { AbsoluteFill } from "remotion";

type Box = { readonly x: number; readonly y: number; readonly w: number; readonly h: number };

/** Frosted boxes over personal details, measured in pixels on a full-bleed 886 × 1920 frame. */
export const Redact: React.FC<{ readonly boxes: readonly Box[] }> = ({ boxes }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {boxes.map((b) => (
      <div
        key={`${b.x}-${b.y}`}
        style={{
          position: "absolute",
          left: `${(b.x / 886) * 100}%`,
          top: `${(b.y / 1920) * 100}%`,
          width: `${(b.w / 886) * 100}%`,
          height: `${(b.h / 1920) * 100}%`,
          borderRadius: 14,
          backdropFilter: "blur(18px)",
          backgroundColor: "rgba(128,120,150,0.25)",
        }}
      />
    ))}
  </AbsoluteFill>
);
