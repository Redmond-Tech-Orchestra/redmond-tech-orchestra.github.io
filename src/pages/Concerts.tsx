import PageHero from "../components/PageHero";
import ConcertCard from "../components/ConcertCard";
import { SectionEyebrow } from "../components/SectionEyebrow";
import concertsData from "../content/concerts.json";
import venuesData from "../content/venues.json";
import site from "../content/site.json";
import type { Concert, Venue } from "../content/types";
import { usePageMeta } from "../hooks/usePageTitle";

const concerts = concertsData as Concert[];
const venues = venuesData as Record<string, Venue>;
const SITE_ORIGIN = "https://redmond-tech-orchestra.github.io";
const DEFAULT_DURATION_HOURS = 2;

function buildEventJsonLd(c: Concert) {
  const venue = c.venueId ? venues[c.venueId] : undefined;
  const venueName = venue?.name ?? c.venue ?? "";
  const start = new Date(c.date);
  const end = new Date(start.getTime() + DEFAULT_DURATION_HOURS * 60 * 60 * 1000);
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: c.title,
    startDate: c.date,
    endDate: end.toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: venueName,
      address: venue
        ? {
            "@type": "PostalAddress",
            streetAddress: venue.streetAddress,
            addressLocality: venue.addressLocality,
            addressRegion: venue.addressRegion,
            postalCode: venue.postalCode,
            addressCountry: venue.addressCountry,
          }
        : venueName,
    },
    description: c.description,
    image: c.poster ? [`${SITE_ORIGIN}${c.poster}`] : undefined,
    organizer: {
      "@type": "MusicGroup",
      name: site.orgName,
      url: `${SITE_ORIGIN}/`,
    },
    performer: {
      "@type": "MusicGroup",
      name: site.orgName,
    },
    offers: c.ticketsUrl
      ? {
          "@type": "Offer",
          url: c.ticketsUrl,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
}

export default function Concerts() {
  usePageMeta({
    title: "Concerts",
    description:
      "Upcoming and past Redmond Tech Orchestra concerts. Free and low-cost orchestral performances across Redmond, Bellevue, and the greater Eastside.",
    path: "/concerts",
  });
  const sorted = [...concerts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groups = new Map<number, Concert[]>();
  for (const c of sorted) {
    const year = new Date(c.date).getFullYear();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(c);
  }
  const years = Array.from(groups.keys());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(sorted.map(buildEventJsonLd)),
        }}
      />
      <PageHero
        title="Concerts"
        backgroundImage="/img/heroes/orchestra-kpc.jpg"
      />
      <section className="block">
        <div className="container">
          {years.map((year) => (
            <ConcertSection key={year} title={String(year)} concerts={groups.get(year)!} />
          ))}
        </div>
      </section>
    </>
  );
}

function ConcertSection({
  title,
  concerts,
}: {
  title: string;
  concerts: Concert[];
}) {
  return (
    <div className="concert-section">
      <SectionEyebrow>{title}</SectionEyebrow>
      <ul className="concert-list">
        {concerts.map((c, i) => (
          <li key={c.id}>
            {i > 0 && <hr className="concert-divider" />}
            <ConcertCard concert={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}
