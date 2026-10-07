import { AbsoluteFill } from "remotion";
import { stage } from "../brand";
import { Backdrop } from "./Backdrop";
import { IslandCover } from "./IslandCover";

/**
 * The recording's frame, set on the backdrop below the caption band, with rounded corners
 * and no device bezel. Footage, taps and redactions go inside as children.
 * `coverIsland` hides what the phone's own screen recorder puts in the Dynamic Island.
 */
export const Screen: React.FC<{
  readonly children: React.ReactNode;
  readonly coverIsland?: boolean;
}> = ({ children, coverIsland = false }) => (
  <AbsoluteFill>
    <Backdrop />
    <div
      style={{
        position: "absolute",
        top: stage.screen.top,
        left: "50%",
        marginLeft: -stage.screen.width / 2,
        width: stage.screen.width,
        height: stage.screen.height,
        borderRadius: 64,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(23,20,41,0.25)",
      }}
    >
      {children}
      {coverIsland ? <IslandCover /> : null}
    </div>
  </AbsoluteFill>
);
