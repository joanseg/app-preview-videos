import { Audio } from "@remotion/media";
import { interpolate, staticFile, useVideoConfig } from "remotion";

type Props = {
  /** File in public/music/. */
  readonly track: string;
  /** Lower the music under a voice-over. */
  readonly underVoice?: boolean;
};

/** Background music for a whole preview: fades in, and out over the end card. */
export const Soundtrack: React.FC<Props> = ({ track, underVoice = false }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const level = underVoice ? 0.16 : 0.45;
  return (
    <Audio
      src={staticFile(`music/${track}`)}
      premountFor={fps}
      volume={(f) =>
        interpolate(f, [0, 0.4 * fps, durationInFrames - 1.5 * fps, durationInFrames], [0, level, level, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};
