import { AbsoluteFill, useVideoConfig } from "remotion";
import { colors, fontFamily, source } from "./brand";
import { Backdrop } from "./components/Backdrop";
import { Footage } from "./components/Footage";
import { Redact } from "./components/Redact";

export type ScreenshotProps = {
  readonly headline: string;
  /** File in public/footage/. */
  readonly file: string;
  /** Second of the recording to show. */
  readonly at: number;
  /** Personal details to cover, as for <Redact>. */
  readonly redact?: readonly { x: number; y: number; w: number; h: number }[];
  /** Height of the headline area on a 1320-wide canvas. Google Play caps text at 20 % of the image: use ~470. */
  readonly headlineArea?: number;
};

/** A store screenshot at any portrait size: a headline over the backdrop, one frame of the app below. */
export const Screenshot: React.FC<ScreenshotProps> = ({ headline, file, at, redact = [], headlineArea = 600 }) => {
  const { width, height } = useVideoConfig();
  const u = width / 1320; // layout was tuned on a 1320-wide canvas
  const top = headlineArea * u;
  const shotHeight = height - top - 52 * u;
  const shotWidth = (shotHeight * source.width) / source.height;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Backdrop />
      <div
        style={{
          position: "absolute",
          top: 170 * u,
          left: 110 * u,
          right: 110 * u,
          color: colors.ink,
          fontSize: 108 * u,
          fontWeight: 700,
          letterSpacing: "-0.035em",
          lineHeight: 1.04,
          textAlign: "center",
        }}
      >
        {headline}
      </div>
      <div
        style={{
          position: "absolute",
          top,
          left: (width - shotWidth) / 2,
          width: shotWidth,
          height: shotHeight,
          borderRadius: 96 * u,
          overflow: "hidden",
          boxShadow: `0 ${40 * u}px ${120 * u}px rgba(23,20,41,0.22)`,
        }}
      >
        <Footage file={file} startAt={at} />
        <Redact boxes={redact} file={file} startAt={at} />
      </div>
    </AbsoluteFill>
  );
};
