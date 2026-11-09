import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import "./fonts";
import { S1Accroche } from "./sequences/S1Accroche";
import { S2Revelation, S2_LEAD } from "./sequences/S2Revelation";
import { S3Creations, S3_LEAD } from "./sequences/S3Creations";
import { S4Commande, S4_LEAD } from "./sequences/S4Commande";
import { S5Final, S5_LEAD } from "./sequences/S5Final";
import { Soundtrack } from "./Soundtrack";
import { COLORS } from "./theme";
import { DURATION, SEQ } from "./timeline";

/**
 * Film de lancement du site La Marilyn. Le même montage sert les deux
 * formats : chaque séquence adapte sa mise en page (voir lib/format.ts).
 * Les séquences se chevauchent de quelques images : ce sont les raccords.
 */
export const Film: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
    <Sequence name="1. Accroche" from={SEQ.accroche.from} durationInFrames={SEQ.accroche.to - SEQ.accroche.from + 4}>
      <S1Accroche />
    </Sequence>
    <Sequence
      name="2. Révélation"
      from={SEQ.revelation.from - S2_LEAD}
      durationInFrames={SEQ.revelation.to - SEQ.revelation.from + S2_LEAD}
    >
      <S2Revelation />
    </Sequence>
    <Sequence
      name="3. Créations"
      from={SEQ.creations.from - S3_LEAD}
      durationInFrames={SEQ.creations.to - SEQ.creations.from + S3_LEAD + 16}
    >
      <S3Creations />
    </Sequence>
    <Sequence
      name="4. Commande"
      from={SEQ.commande.from - S4_LEAD}
      durationInFrames={SEQ.commande.to - SEQ.commande.from + S4_LEAD}
    >
      <S4Commande />
    </Sequence>
    <Sequence name="5. Final" from={SEQ.final.from - S5_LEAD} durationInFrames={DURATION - SEQ.final.from + S5_LEAD}>
      <S5Final />
    </Sequence>
    <Soundtrack />
  </AbsoluteFill>
);
