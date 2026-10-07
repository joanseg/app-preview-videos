import { AbsoluteFill } from "remotion";
import { Caption } from "./captions/Caption";
import { type CaptionStyle, CaptionStyleContext } from "./captions/types";
import { Footage } from "./components/Footage";
import { Screen } from "./components/Screen";

type Props = {
  readonly captionStyle: CaptionStyle;
  readonly file: string;
  readonly startAt: number;
  readonly text: string;
  readonly highlight: string;
  readonly kicker: string;
};

/** One scene rendered with a given caption style, so the owner can compare styles side by side. */
export const CaptionLab: React.FC<Props> = ({ captionStyle, file, startAt, ...caption }) => (
  <CaptionStyleContext.Provider value={captionStyle}>
    <AbsoluteFill>
      <Screen>
        <Footage file={file} startAt={startAt} />
      </Screen>
      <Caption {...caption} />
    </AbsoluteFill>
  </CaptionStyleContext.Provider>
);
