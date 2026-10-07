import { AbsoluteFill } from "remotion";
import { colors } from "../brand";

/** The brand's four-stop colour mesh, the ground behind every scene and the end card. */
export const Backdrop: React.FC = () => {
  const [tl, tr, br, bl] = colors.backdrop;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.backdropBase,
        backgroundImage: [
          `radial-gradient(118% 76% at 10% 0%, ${tl}, transparent)`,
          `radial-gradient(104% 70% at 96% 6%, ${tr}, transparent)`,
          `radial-gradient(112% 74% at 86% 98%, ${br}, transparent)`,
          `radial-gradient(96% 62% at 6% 92%, ${bl}, transparent)`,
        ].join(", "),
      }}
    />
  );
};
