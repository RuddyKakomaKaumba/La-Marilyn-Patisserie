import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { S3_CUTS } from "./sequences/S3Creations";
import { ORDER } from "./sequences/S4Commande";
import { DURATION, FPS, SEQ, VOICE } from "./timeline";

const audio = (name: string) => staticFile(`audio/${name}.wav`);

/** Niveaux du mixage. La voix reste toujours au premier plan. */
const MIX = {
  voice: 1.25,
  music: 0.74,
  /** Niveau de la musique sous la voix (atténuation automatique). */
  musicUnderVoice: 0.36,
  musicFinal: 0.96,
  sfx: 0.42,
};

/** Atténue la musique pendant chaque réplique, avec des rampes douces. */
const musicVolume = (frame: number) => {
  let duck = 0;
  for (const v of VOICE) {
    const end = v.from + v.seconds * FPS;
    duck = Math.max(
      duck,
      interpolate(frame, [v.from - 8, v.from + 2, end - 2, end + 22], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
  }
  // Montée finale, une fois la dernière réplique dite.
  const base = interpolate(frame, [SEQ.final.from, SEQ.final.from + 150], [MIX.music, MIX.musicFinal], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Le final est plus dense : la musique s'efface davantage sous la dernière réplique.
  const under = frame >= SEQ.final.from ? MIX.musicUnderVoice * 0.7 : MIX.musicUnderVoice;
  return base + (under - base) * duck;
};

type Cue = { at: number; file: string; volume?: number };

/** Effets sonores, calés sur les transitions et les gestes à l'écran. */
const CUES: Cue[] = [
  { at: 12, file: "sfx-shimmer", volume: 0.5 },
  { at: SEQ.revelation.from - 14, file: "sfx-whoosh", volume: 0.8 },
  // Séquence 3 : un souffle à chaque changement d'univers
  ...S3_CUTS.slice(0, 4).map((cut, i): Cue => ({
    at: SEQ.creations.from + cut - (i === 0 ? 16 : 10),
    file: i % 2 ? "sfx-whoosh-down" : "sfx-whoosh",
    volume: i === 0 ? 0.9 : 0.65,
  })),
  { at: SEQ.creations.from + S3_CUTS[2] + 14, file: "sfx-shimmer", volume: 0.4 },
  { at: SEQ.commande.from - 10, file: "sfx-whoosh-down", volume: 0.7 },
  { at: SEQ.commande.from + ORDER.tapCard, file: "sfx-tap" },
  { at: SEQ.commande.from + ORDER.toForm, file: "sfx-whoosh-down", volume: 0.45 },
  { at: SEQ.commande.from + ORDER.tapPick, file: "sfx-tap" },
  { at: SEQ.commande.from + ORDER.tapDate, file: "sfx-tap" },
  { at: SEQ.commande.from + ORDER.tapDate + 5, file: "sfx-type", volume: 0.8 },
  { at: SEQ.commande.from + ORDER.tapSend, file: "sfx-tap" },
  { at: SEQ.commande.from + ORDER.message, file: "sfx-pop", volume: 1.1 },
  { at: SEQ.final.from + 4, file: "sfx-shimmer", volume: 0.6 },
  { at: SEQ.final.from + 80, file: "sfx-shimmer", volume: 0.45 },
];

export const Soundtrack: React.FC = () => (
  <>
    <Sequence name="Musique" durationInFrames={DURATION}>
      <Audio src={audio("music")} volume={musicVolume} />
    </Sequence>
    {VOICE.map((v) => (
      <Sequence key={v.id} name={`Voix : ${v.text.slice(0, 32)}…`} from={v.from} durationInFrames={Math.ceil(v.seconds * FPS) + 6}>
        <Audio src={audio(v.id)} volume={MIX.voice} />
      </Sequence>
    ))}
    {CUES.map((c, i) => (
      <Sequence key={i} name={`Effet : ${c.file}`} from={Math.max(0, c.at)} durationInFrames={110}>
        <Audio src={audio(c.file)} volume={MIX.sfx * (c.volume ?? 1)} />
      </Sequence>
    ))}
  </>
);
