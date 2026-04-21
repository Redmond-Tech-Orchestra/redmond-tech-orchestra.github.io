import { useState } from "react";
import type { Concert } from "../content/types";
import { TicketIcon, DocumentIcon, VideoIcon } from "./Icons";
import Lightbox from "./Lightbox";

type Props = {
  concert: Concert;
  showProgram?: boolean;
};

export default function ConcertCard({ concert, showProgram = true }: Props) {
  const isPast = concert.status === "past";
  const [lightboxOpen, setLightboxOpen] = useState(false);
  return (
    <article className={"concert-item" + (isPast ? " past" : "")}>
      <div className="details">
        <div className="title-block">
          <h3>{concert.title}</h3>
          <span className="date">{concert.dateDisplay}</span>
          <span className="venue">{concert.venue}</span>
        </div>

        <p className="description">{concert.description}</p>

        {showProgram && concert.program && concert.program.length > 0 && (
          <div className="repertoire">
            {concert.program.map((entry, i) => (
              <RepertoireRow key={i} composer={entry.composer} pieces={entry.pieces} />
            ))}
          </div>
        )}

        <div className="actions">
          {concert.ticketsUrl && (
            <a className="btn" href={concert.ticketsUrl} target="_blank" rel="noopener noreferrer">
              <TicketIcon /> Get Tickets
            </a>
          )}
          {concert.programUrl && (
            <a className="btn btn-outline" href={concert.programUrl} target="_blank" rel="noopener noreferrer">
              <DocumentIcon /> Program
            </a>
          )}
          {concert.recordingsUrl && (
            <a className="btn" href={concert.recordingsUrl} target="_blank" rel="noopener noreferrer">
              <VideoIcon /> Recordings
            </a>
          )}
        </div>
      </div>

      {concert.poster ? (
        <button
          type="button"
          className="poster"
          onClick={() => setLightboxOpen(true)}
          aria-label={`View ${concert.title} poster full size`}
        >
          <img src={concert.poster} alt={`${concert.title} poster`} loading="lazy" />
        </button>
      ) : (
        <div className="poster poster-placeholder" aria-hidden="true">
          <span>Poster coming soon</span>
        </div>
      )}

      {lightboxOpen && concert.poster && (
        <Lightbox
          src={concert.poster}
          alt={`${concert.title} poster`}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </article>
  );
}

function RepertoireRow({ composer, pieces }: { composer: string; pieces: string[] }) {
  const label = shortComposer(composer);
  return (
    <>
      <div className="composer">{label}</div>
      <div className="pieces">
        {pieces.map((p, i) => (
          <span key={i}>{p}</span>
        ))}
      </div>
    </>
  );
}

// Use the last surname for the composer label (matches Figma style).
// Strips "/ arr. ..." suffixes and preserves known two-word surnames.
function shortComposer(name: string): string {
  const main = name.split("/")[0].trim();
  const knownTwoWord = ["Lloyd Webber", "Saint-Saëns"];
  for (const k of knownTwoWord) {
    if (main.includes(k)) return k;
  }
  const parts = main.split(" ");
  return parts[parts.length - 1];
}
