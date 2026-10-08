import { Video } from "@remotion/media";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";

export type RedactBox = {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  /**
   * Where to borrow clean background from: a thin strip just beside the box, stretched over it.
   * "right" (default) or "left" copy a column (keeps rows, card edges and vertical gradients);
   * "above" / "below" copy a row. `at` overrides the strip's x (or y) when the neighbour is text.
   */
  readonly sample?: "right" | "left" | "above" | "below";
  readonly at?: number;
  /** Soft-edge width in 886-wide pixels (default 14). Use ~4 when other text sits right against the box. */
  readonly feather?: number;
};

type Props = {
  readonly boxes: readonly RedactBox[];
  /** The same clip as the scene's <Footage>, so the borrowed pixels move in step with it. */
  readonly file: string;
  readonly startAt: number;
  readonly speed?: number;
};

const W = 886;
const H = 1920;
const defaultFeather = 14;
const strip = 4;
const gap = 6;

/**
 * Hides personal details by painting over them with the surface right next to them,
 * stretched from a thin strip, with feathered edges, so nothing shows that anything was covered.
 * Boxes are measured in pixels on a full-bleed 886 × 1920 frame.
 */
export const Redact: React.FC<Props> = ({
  boxes,
  file,
  startAt,
  speed = 1,
}) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {boxes.map((b) => {
        const side = b.sample ?? "right";
        const feather = b.feather ?? defaultFeather;
        const X = b.x - feather;
        const Y = b.y - feather;
        const cw = b.w + 2 * feather;
        const ch = b.h + 2 * feather;
        // The clip inside is the whole frame, stretched along one axis so the strip covers the box.
        let left = -X;
        let top = -Y;
        let width = W;
        let height = H;
        if (side === "right" || side === "left") {
          const s =
            b.at ?? (side === "right" ? b.x + b.w + gap : b.x - gap - strip);
          const k = cw / strip;
          width = W * k;
          left = -s * k; // the strip's first column lands on the container's left edge
        } else {
          const s =
            b.at ?? (side === "below" ? b.y + b.h + gap : b.y - gap - strip);
          const k = ch / strip;
          height = H * k;
          top = -s * k; // the strip's first row lands on the container's top edge
        }
        const pct = (v: number, of: number) => `${(v / of) * 100}%`;
        const edge = (dir: string, f: number, size: number) =>
          `linear-gradient(${dir}, transparent 0%, black ${pct(f, size)}, black ${pct(size - f, size)}, transparent 100%)`;
        const mask = `${edge("to right", feather, cw)}, ${edge("to bottom", feather, ch)}`;
        return (
          <div
            key={`${b.x}-${b.y}`}
            style={{
              position: "absolute",
              left: pct(X, W),
              top: pct(Y, H),
              width: pct(cw, W),
              height: pct(ch, H),
              overflow: "hidden",
              maskImage: mask,
              WebkitMaskImage: mask,
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }}
          >
            <Video
              src={staticFile(`footage/${file}`)}
              trimBefore={Math.round(startAt * fps)}
              playbackRate={speed}
              muted
              objectFit="fill"
              premountFor={fps}
              style={{
                position: "absolute",
                left: pct(left, cw),
                top: pct(top, ch),
                width: pct(width, cw),
                height: pct(height, ch),
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
