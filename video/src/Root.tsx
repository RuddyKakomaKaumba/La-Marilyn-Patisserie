import React from "react";
import { Composition, Still } from "remotion";
import { Cover } from "./Cover";
import { Film } from "./Film";
import { DURATION, FPS } from "./timeline";

export const Root: React.FC = () => (
  <>
    <Composition id="LancementVertical" component={Film} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
    <Composition id="LancementHorizontal" component={Film} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
    <Still id="CouvertureReels" component={Cover} width={1080} height={1920} />
  </>
);
