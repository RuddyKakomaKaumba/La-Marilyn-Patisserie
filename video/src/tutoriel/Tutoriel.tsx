import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import "../fonts";
import { COLORS } from "../theme";
import { Backdrop } from "./components/Stage";
import { Captions } from "./components/Captions";
import { Parcours } from "./sequences/Parcours";
import { Final, FINAL_LEAD } from "./sequences/Final";
import { Soundtrack, VoiceOnly } from "./Soundtrack";
import { DURATION, SEQ } from "./timeline";

/**
 * « Votre commande, en quelques clics » : tutoriel du site La Marilyn.
 * Un plan-séquence sur le téléphone (accroche → commande), puis la
 * conclusion. Sous-titres et bande-son par-dessus.
 */
export const Tutoriel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
    <Backdrop />
    <Sequence name="1 à 5. Parcours" durationInFrames={SEQ.final.from + 12}>
      <Parcours />
    </Sequence>
    <Sequence name="6. Conclusion" from={SEQ.final.from - FINAL_LEAD} durationInFrames={DURATION - SEQ.final.from + FINAL_LEAD}>
      <Final />
    </Sequence>
    <Captions />
    <Soundtrack />
  </AbsoluteFill>
);

/** Composition audio seule : la voix off, pour l'export de la piste séparée. */
export const TutorielVoix: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
    <VoiceOnly />
  </AbsoluteFill>
);
