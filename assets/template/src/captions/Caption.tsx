import { AbsoluteFill } from "remotion";
import { stage } from "../brand";
import { Editorial } from "./Editorial";
import { Glass } from "./Glass";
import { Kinetic } from "./Kinetic";
import { Sticker } from "./Sticker";
import { type CaptionProps, useCaptionStyle } from "./types";

const styles = { glass: Glass, kinetic: Kinetic, sticker: Sticker, editorial: Editorial } as const;

/** A caption in the current caption style (see CaptionStyleContext). */
export const Caption: React.FC<CaptionProps> = (props) => {
  const Style = styles[useCaptionStyle()];
  return (
    <AbsoluteFill
      style={{
        height: stage.bandHeight,
        justifyContent: "center",
        alignItems: "center",
        padding: "56px 48px 0",
      }}
    >
      <Style {...props} />
    </AbsoluteFill>
  );
};
