import { Video } from "@remotion/media";
import { staticFile, useVideoConfig } from "remotion";

type Props = {
  /** File in public/footage/. */
  readonly file: string;
  /** Second of the recording this scene starts at. */
  readonly startAt: number;
  /** 1 is real time; above 1 speeds up a wait. */
  readonly speed?: number;
};

/** One stretch of a screen recording, full-bleed and muted. */
export const Footage: React.FC<Props> = ({ file, startAt, speed = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <Video
      src={staticFile(`footage/${file}`)}
      trimBefore={Math.round(startAt * fps)}
      playbackRate={speed}
      muted
      objectFit="cover"
      premountFor={fps}
      style={{ position: "absolute", width: "100%", height: "100%" }}
    />
  );
};
