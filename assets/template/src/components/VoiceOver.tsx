import { Audio } from "@remotion/media";
import { Sequence, staticFile, useVideoConfig } from "remotion";

type Line = {
  /** File in public/voice/, as written by scripts/voice.sh (e.g. "send-2.wav"). */
  readonly file: string;
  /** Second of the video the line starts at. */
  readonly at: number;
};

/** Places cleaned voice-over lines on the video's timeline. Pair with <Soundtrack underVoice />. */
export const VoiceOver: React.FC<{ readonly lines: readonly Line[] }> = ({ lines }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {lines.map((l) => (
        <Sequence key={l.file} from={Math.round(l.at * fps)} layout="none">
          <Audio src={staticFile(`voice/${l.file}`)} premountFor={fps} />
        </Sequence>
      ))}
    </>
  );
};
