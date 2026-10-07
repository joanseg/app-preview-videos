import { Composition } from "remotion";
import { formats } from "./brand";
import { CaptionLab } from "./CaptionLab";
import { Screenshot } from "./Screenshot";
import { Example } from "./videos/Example";

/**
 * One <Composition> per video and per screenshot. Screenshots are 1-frame compositions at
 * 30 fps, not <Still>s: a <Still> runs at 1 fps, so the footage's `at` rounds to whole seconds.
 * Video length = sum of scene frames − 12 per fade; scripts/check.sh enforces the platform's limits.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Example" component={Example} durationInFrames={456} {...formats.appStorePreview} />
    <Composition
      id="CaptionLab"
      component={CaptionLab}
      durationInFrames={96}
      {...formats.appStorePreview}
      defaultProps={{
        captionStyle: "kinetic" as const,
        file: "example.mp4",
        startAt: 2,
        kicker: "Feature",
        text: "Every fee, before you buy",
        highlight: "Every fee",
      }}
    />
    <Composition
      id="ShotExample"
      component={Screenshot}
      durationInFrames={1}
      fps={30}
      {...formats.appStoreScreenshot}
      defaultProps={{ headline: "Do the thing in a few taps", file: "example.mp4", at: 2 }}
    />
  </>
);
