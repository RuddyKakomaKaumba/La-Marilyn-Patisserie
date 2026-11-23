import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { CUE, DURATION, FPS, SEQ, VOICE } from "./timeline";

const audio = (name: string) => staticFile(`tutoriel/audio/${name}.wav`);

/** Niveaux du mixage : la voix reste toujours au premier plan. */
export const MIX = {
  voice: 1.3,
  music: 0.62,
  /** Musique sous la voix (atténuation automatique). */
  musicUnderVoice: 0.26,
  musicFinal: 0.85,
  sfx: 0.4,
};

const musicVolume = (frame: number) => {
  let duck = 0;
  for (const v of VOICE) {
    const end = v.from + v.seconds * FPS;
    duck = Math.max(
      duck,
      interpolate(frame, [v.from - 8, v.from + 2, end - 2, end + 18], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
  }
  const base = interpolate(frame, [SEQ.final.from, SEQ.final.from + 40], [MIX.music, MIX.musicFinal], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return base + (MIX.musicUnderVoice - base) * duck;
};

type Cue = { at: number; file: string; volume?: number };
const C = CUE;

/** Effets sonores, calés sur les gestes et les transitions. */
const CUES: Cue[] = [
  { at: 16, file: "sfx-shimmer", volume: 0.45 },
  { at: C.photoToSite - 6, file: "sfx-whoosh", volume: 0.7 },
  { at: C.phoneIn, file: "sfx-shimmer", volume: 0.55 },
  { at: C.tapDecouvrir, file: "sfx-tap" },
  { at: C.navCreations, file: "sfx-whoosh-down", volume: 0.5 },
  { at: C.fastScroll, file: "sfx-whoosh", volume: 0.55 },
  { at: C.rewind, file: "sfx-whoosh-down", volume: 0.45 },
  { at: C.tapCard, file: "sfx-tap" },
  { at: C.ficheOpen, file: "sfx-drawer", volume: 0.7 },
  { at: C.tapAdd, file: "sfx-tap" },
  { at: C.added, file: "sfx-add", volume: 1.1 },
  { at: C.tapContinue, file: "sfx-tap" },
  { at: C.float1, file: "sfx-count", volume: 1.0 },
  { at: C.tapBurger, file: "sfx-tap" },
  { at: C.burgerAdded, file: "sfx-add", volume: 1.1 },
  { at: C.burgerAdded + 2, file: "sfx-count", volume: 1.0 },
  { at: C.multi + 70, file: "sfx-whoosh", volume: 0.45 },
  { at: C.multi + 96, file: "sfx-count", volume: 0.9 },
  { at: C.tapFloat, file: "sfx-tap" },
  { at: C.drawerOpen, file: "sfx-drawer", volume: 0.9 },
  { at: C.tapPlus, file: "sfx-tap" },
  { at: C.plusDone, file: "sfx-count", volume: 0.8 },
  { at: C.total, file: "sfx-total", volume: 0.9 },
  { at: C.tapFinaliser, file: "sfx-tap" },
  { at: C.navCommande, file: "sfx-whoosh-down", volume: 0.5 },
  { at: C.typeName, file: "sfx-type", volume: 0.8 },
  { at: C.typeName + 12, file: "sfx-type", volume: 0.7 },
  { at: C.tapDate, file: "sfx-tap" },
  { at: C.tapLivraison, file: "sfx-tap" },
  { at: C.typePlace, file: "sfx-type", volume: 0.8 },
  { at: C.typePlace + 12, file: "sfx-type", volume: 0.7 },
  { at: C.tapSend, file: "sfx-tap" },
  { at: C.message, file: "sfx-send", volume: 1.0 },
  { at: C.finalIn - 4, file: "sfx-final", volume: 0.9 },
];

export const Soundtrack: React.FC = () => (
  <>
    <Sequence name="Musique" durationInFrames={DURATION}>
      <Audio src={audio("musique")} volume={musicVolume} />
    </Sequence>
    {VOICE.map((v) => (
      <Sequence key={v.id} name={`Voix : ${v.text.slice(0, 30)}…`} from={v.from} durationInFrames={Math.ceil(v.seconds * FPS) + 6}>
        <Audio src={audio(v.id)} volume={MIX.voice} />
      </Sequence>
    ))}
    {CUES.map((c, i) => (
      <Sequence key={i} name={`Effet : ${c.file}`} from={Math.max(0, c.at)} durationInFrames={100}>
        <Audio src={audio(c.file)} volume={MIX.sfx * (c.volume ?? 1)} />
      </Sequence>
    ))}
  </>
);

/** Voix seule (piste séparée livrée avec la vidéo). */
export const VoiceOnly: React.FC = () => (
  <>
    {VOICE.map((v) => (
      <Sequence key={v.id} from={v.from} durationInFrames={Math.ceil(v.seconds * FPS) + 6}>
        <Audio src={audio(v.id)} volume={1} />
      </Sequence>
    ))}
  </>
);
