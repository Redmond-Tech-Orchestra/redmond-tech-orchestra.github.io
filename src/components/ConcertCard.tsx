import { useState } from "react";
import type { Concert, ConcertCategory, Venue } from "../content/types";
import venuesData from "../content/venues.json";
import Lightbox from "./Lightbox";

const venues = venuesData as Record<string, Venue>;

const CATEGORY_LABEL: Record<ConcertCategory, string> = {
  masterworks: "Masterworks",
  chamber: "Chamber",
  community: "Community",
  session: "Recording Session",
};

function CategoryPill({ category }: { category: ConcertCategory }) {
  return (
    <span className={`category-pill category-pill--${category}`}>
      {CATEGORY_LABEL[category]}
    </span>
  );
}

export { CategoryPill };

type Props = {
  concert: Concert;
  showProgram?: boolean;
};

export default function ConcertCard({ concert, showProgram = true }: Props) {
  const isPast = concert.status === "past";
  const venue = concert.venueId ? venues[concert.venueId] : undefined;
  const venueDisplay = concert.venue ?? venue?.name ?? "";
  const [lightboxOpen, setLightboxOpen] = useState(false);
  return (
    <article
      className={
        "concert-item" +
        (isPast ? " past" : "") +
        (concert.category ? ` concert-item--${concert.category}` : "") +
        ` concert-item--${concert.posterOrientation ?? "portrait"}`
      }
      itemScope
      itemType="https://schema.org/MusicEvent"
    >
      <meta itemProp="eventStatus" content="https://schema.org/EventScheduled" />
      <meta
        itemProp="eventAttendanceMode"
        content="https://schema.org/OfflineEventAttendanceMode"
      />
      <div className="details">
        <div className="title-block">
          {concert.category && <CategoryPill category={concert.category} />}
          <h3 itemProp="name">{concert.title}</h3>
          {Array.isArray(concert.dateDisplay) ? (
            <time className="date date--multi" dateTime={concert.date} itemProp="startDate">
              {concert.dateDisplay.map((d, i) => (
                <span key={i} className="date-line">{d}</span>
              ))}
            </time>
          ) : (
            <time className="date" dateTime={concert.date} itemProp="startDate">
              {concert.dateDisplay}
            </time>
          )}
          <address
            className="venue"
            itemProp="location"
            itemScope
            itemType="https://schema.org/Place"
          >
            <span itemProp="name">{venueDisplay}</span>
            {venue ? (
              <span
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
                style={{ display: "none" }}
              >
                <span itemProp="streetAddress">{venue.streetAddress}</span>
                <span itemProp="addressLocality">{venue.addressLocality}</span>
                <span itemProp="addressRegion">{venue.addressRegion}</span>
                <span itemProp="postalCode">{venue.postalCode}</span>
                <span itemProp="addressCountry">{venue.addressCountry}</span>
              </span>
            ) : (
              <meta itemProp="address" content={venueDisplay} />
            )}
          </address>
        </div>

        <p className="description" itemProp="description">
          {concert.description}
        </p>

        {showProgram && concert.program && concert.program.length > 0 && (
          <div className="repertoire">
            {concert.program.map((entry, i) => (
              <RepertoireRow key={i} composer={entry.composer} pieces={entry.pieces} />
            ))}
          </div>
        )}

        <div className="actions">
          {concert.ticketsUrl && (
            <a
              className="btn"
              href={concert.ticketsUrl}
              target="_blank"
              rel="noopener noreferrer"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <meta itemProp="url" content={concert.ticketsUrl} />
              <meta
                itemProp="availability"
                content="https://schema.org/InStock"
              />
              Get Tickets
            </a>
          )}
          {!concert.ticketsUrl && concert.status === "upcoming" && (
            <p className="tickets-pending">
              Tickets on sale soon — check back closer to the date.
            </p>
          )}
          {concert.programUrl && (
            <a className="btn-ghost" href={concert.programUrl} target="_blank" rel="noopener noreferrer">
              View Program
            </a>
          )}
          {concert.recordingsUrl && (
            <a className="btn-ghost" href={concert.recordingsUrl} target="_blank" rel="noopener noreferrer">
              Watch Recordings
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
          <img
            src={concert.poster}
            alt={`${concert.title} poster`}
            loading="lazy"
            itemProp="image"
          />
        </button>
      ) : (
        <div className="poster-placeholder" aria-hidden="true">
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

/**
 * Reusable program/repertoire list for a concert. Renders the same composer
 * + pieces grid used inside ConcertCard so the Home featured-concert block
 * matches the Concerts page styling exactly. Returns null if there's no
 * program data.
 */
export function ConcertProgram({ program }: { program?: Concert["program"] }) {
  if (!program || program.length === 0) return null;
  return (
    <div className="repertoire">
      {program.map((entry, i) => (
        <RepertoireRow key={i} composer={entry.composer} pieces={entry.pieces} />
      ))}
    </div>
  );
}

// Use the last surname for the composer label (matches Figma style).
// Strips "/ arr. ..." suffixes and preserves known two-word surnames.
// For comma-separated multi-composer credits, returns the full string unchanged.
function shortComposer(name: string): string {
  const main = name.split("/")[0].trim();
  if (main.includes(",")) return main;
  const knownTwoWord = ["Lloyd Webber", "Saint-Saëns"];
  for (const k of knownTwoWord) {
    if (main.includes(k)) return k;
  }
  const parts = main.split(" ");
  return parts[parts.length - 1];
}
