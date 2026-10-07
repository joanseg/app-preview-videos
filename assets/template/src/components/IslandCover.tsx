import { AbsoluteFill } from "remotion";

type Box = { readonly x: number; readonly y: number; readonly w: number; readonly h: number };

/**
 * One black pill over the Dynamic Island, hiding what the phone's own screen recorder adds
 * there (the red recording dot, Live Activity art). A blur box looks like a smudge on black.
 * Default box: an iPhone 1180 × 2556 recording, in full-bleed 886 × 1920 pixels.
 * Measure it again for other devices; QuickTime recordings don't need it.
 */
export const IslandCover: React.FC<{ readonly box?: Box }> = ({
  box = { x: 222, y: 23, w: 468, h: 88 },
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: `${(box.x / 886) * 100}%`,
        top: `${(box.y / 1920) * 100}%`,
        width: `${(box.w / 886) * 100}%`,
        height: `${(box.h / 1920) * 100}%`,
        borderRadius: 999,
        backgroundColor: "black",
      }}
    />
  </AbsoluteFill>
);
