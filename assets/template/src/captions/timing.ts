import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Shared caption clock. Captions wait out the incoming 0.4 s fade and are gone
 * before the outgoing one, so two captions never overlap.
 */
export const useCaptionClock = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const start = 0.4 * fps;
  /** 0 → 1 over `seconds`, starting `delay` seconds after the caption appears. */
  const enter = (seconds: number, delay = 0) =>
    interpolate(frame, [start + delay * fps, start + (delay + seconds) * fps], [0, 1], {
      ...clamp,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  const exit = interpolate(
    frame,
    [durationInFrames - 0.5 * fps, durationInFrames - 0.2 * fps],
    [1, 0],
    clamp,
  );
  return { frame, fps, start, enter, exit };
};
