import PageHero from "../components/PageHero";
import ConcertCard from "../components/ConcertCard";
import concertsData from "../content/concerts.json";
import type { Concert } from "../content/types";

const concerts = concertsData as Concert[];

export default function Concerts() {
  const upcoming = concerts.filter((c) => c.status === "upcoming");
  const past = concerts.filter((c) => c.status === "past");

  return (
    <>
      <PageHero
        title="Concerts"
        subtitle="Join us at one of our performances throughout the year."
      />
      <section className="block">
        <div className="container">
          {upcoming.length > 0 && (
            <ConcertSection title="Upcoming" concerts={upcoming} />
          )}
          {past.length > 0 && (
            <ConcertSection title="Past Performances" concerts={past} marginTop />
          )}
        </div>
      </section>
    </>
  );
}

function ConcertSection({
  title,
  concerts,
  marginTop,
}: {
  title: string;
  concerts: Concert[];
  marginTop?: boolean;
}) {
  return (
    <div className={"concert-section" + (marginTop ? " concert-section--spaced" : "")}>
      <h2 className="section-eyebrow">{title}</h2>
      <div className="concert-list">
        {concerts.map((c, i) => (
          <div key={c.id}>
            {i > 0 && <hr className="concert-divider" />}
            <ConcertCard concert={c} />
          </div>
        ))}
      </div>
    </div>
  );
}
