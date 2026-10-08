import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Caption } from "../captions/Caption";
import { EndCard } from "../components/EndCard";
import { Footage } from "../components/Footage";
import { Redact } from "../components/Redact";
import { Screen } from "../components/Screen";
import { Soundtrack } from "../components/Soundtrack";
import { TapRing } from "../components/TapRing";

/**
 * Pattern for one preview, cut from public/footage/example.mp4. Copy it per flow.
 * - One <TransitionSeries.Sequence> per scene; scenes join with 12-frame fades.
 * - `startAt` (seconds into the recording) and `speed` pick the stretch each scene shows.
 * - Tap rings and redaction boxes sit inside <Screen>, in full-bleed 886 × 1920 pixel
 *   or fraction coordinates measured on the recording. <Redact> takes the same file,
 *   startAt and speed as the scene's <Footage>: it paints over the box with clean surface
 *   borrowed from beside it, so it must play in step.
 * - A hard cut inside one scene (two inner <Sequence>s) skips an animation that would
 *   reveal something, such as a slide that drags a covered row out from under its box.
 * - A tap ring lasts as long as its <Sequence>; keep it ≤ 0.6 s and end it before a hard cut,
 *   or it lingers on the next screen. The tap is the last frame before the screen reacts.
 * Composition length = sum of scene frames − 12 × number of fades (see Root.tsx).
 * Delete this file and its <Composition> once the first real video exists.
 */
export const Example: React.FC = () => {
  const { fps } = useVideoConfig();
  const cut = linearTiming({ durationInFrames: 12 });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Soundtrack track="close-up.mp3" />
      <TransitionSeries>
        <TransitionSeries.Sequence name="Home" durationInFrames={Math.round(6 * fps)} premountFor={fps}>
          <Screen>
            <Sequence name="Home" durationInFrames={1.2 * fps} premountFor={fps}>
              <Footage file="example.mp4" startAt={0} />
              <Redact file="example.mp4" startAt={0} boxes={[{ x: 170, y: 1610, w: 272, h: 48, feather: 4 }]} />
            </Sequence>
            <Sequence name="Next screen" from={1.2 * fps} premountFor={fps}>
              <Footage file="example.mp4" startAt={1.5} />
            </Sequence>
            <Sequence from={0.6 * fps} durationInFrames={0.6 * fps} premountFor={fps}>
              <TapRing x={0.4} y={0.933} />
            </Sequence>
          </Screen>
          <Caption kicker="Feature" text="Do the thing in a few taps" highlight="a few taps" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={cut} />

        <TransitionSeries.Sequence name="Wait" durationInFrames={Math.round(5.5 * fps)} premountFor={fps}>
          <Screen>
            <Footage file="example.mp4" startAt={4} speed={3} />
          </Screen>
          <Caption kicker="Feature" text="Done in seconds" highlight="seconds" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={cut} />

        <TransitionSeries.Sequence name="End card" durationInFrames={Math.round(4.5 * fps)} premountFor={fps}>
          <EndCard notes={["Sign-in required."]} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
