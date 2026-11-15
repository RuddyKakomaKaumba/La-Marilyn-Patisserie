import { AVAILABILITY_NOTICE, upcomingClosedRanges } from "@/lib/availability";
import { formatRange, nowInDouala } from "@/lib/requests";

/**
 * Mention du calendrier indicatif, sous le champ de date des formulaires :
 * pas de garantie de disponibilité, et dates fermées à venir
 * (lib/availability.ts) affichées avant que le visiteur ne choisisse.
 */
export default function DateNotice() {
  const closed = upcomingClosedRanges(nowInDouala().today);
  return (
    <div className="space-y-1 text-[0.8125rem] leading-relaxed text-muted">
      <p>{AVAILABILITY_NOTICE}</p>
      {closed.length > 0 && (
        <p>
          Dates fermées aux nouvelles demandes&nbsp;:{" "}
          {closed.map((r) => formatRange(r.from, r.to)).join(", ")}.
        </p>
      )}
    </div>
  );
}
