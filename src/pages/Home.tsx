import { Link } from "react-router-dom";
import site from "../content/site.json";
import about from "../content/about.json";
import home from "../content/home.json";
import concertsData from "../content/concerts.json";
import venuesData from "../content/venues.json";
import type { Concert, Venue } from "../content/types";
import { TicketIcon } from "../components/Icons";
import { SectionEyebrow } from "../components/SectionEyebrow";
import { ConcertProgram } from "../components/ConcertCard";
import { usePageMeta } from "../hooks/usePageTitle";

const concerts = concertsData as Concert[];
const venues = venuesData as Record<string, Venue>;

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Redmond Tech Orchestra",
  alternateName: "RTO",
  description:
    "A community orchestra of working tech professionals based in Redmond, Washington. We perform free and low-cost concerts across the Eastside.",
  foundingDate: "2024",
  foundingLocation: { "@type": "Place", name: "Redmond, Washington" },
  areaServed: { "@type": "Place", name: "Greater Seattle / Eastside, Washington" },
  logo: "https://www.redmondtechorchestra.org/img/logo.png",
  image: "https://www.redmondtechorchestra.org/img/heroes/home-hero.jpg",
  url: "https://www.redmondtechorchestra.org/",
  nonprofitStatus: "Nonprofit501c3",
  sameAs: [
    "https://www.instagram.com/redmondtechorchestra/",
    "https://www.facebook.com/people/Redmond-Tech-Orchestra/61557022596926/",
    "https://www.youtube.com/@RedmondTechOrchestra",
    "https://www.tiktok.com/@redmondtechorch",
  ],
};

export default function Home() {
  usePageMeta({
    title: "Home",
    description:
      "The Redmond Tech Orchestra is a 501(c)(3) community orchestra of working musicians performing free and low-cost concerts on the Eastside of Seattle.",
    path: "/",
    image: "https://www.redmondtechorchestra.org/img/heroes/home-hero.jpg",
  });
  const upcoming = concerts.find((c) => c.status === "upcoming");
  const upcomingVenue = upcoming?.venueId ? venues[upcoming.venueId] : undefined;
  const upcomingVenueName = upcoming?.venue ?? upcomingVenue?.name ?? "";
  const upcomingDates = upcoming
    ? Array.isArray(upcoming.dateDisplay)
      ? upcoming.dateDisplay
      : [upcoming.dateDisplay]
    : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <div className="hero-photo" role="img" aria-label="Redmond Tech Orchestra performing" />

      <section className="hero-intro">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">{home.hero.eyebrow}</p>
            <h1>{home.hero.headline}</h1>
            <p className="hero-subhead">{home.hero.subhead}</p>
          </div>
          <div className="actions">
            {upcoming ? (
              <a href="#next-concert" className="btn">
                Upcoming Concerts
              </a>
            ) : (
              <Link to="/concerts" className="btn">
                Upcoming Concerts
              </Link>
            )}
            <Link to="/about" className="btn btn-ghost">
              About Us
            </Link>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container intro-block">
          <SectionEyebrow>{home.intro.eyebrow}</SectionEyebrow>
          <h2>{home.intro.heading}</h2>
          {home.intro.body.map((p, i) => (
            <p key={i} className="intro-body">{p}</p>
          ))}
        </div>
      </section>

      {upcoming && (
        <section id="next-concert" className="block alt">
          <div className="container">
            <article className="featured-concert">
              <div className="featured-body">
                <div className="meta">Next Concert</div>
                <h3>{upcoming.title}</h3>
                <div className="when-where">
                  {upcomingDates.map((d, i) => (
                    <span key={i} className="date">{d}</span>
                  ))}
                  {upcomingVenueName && <span className="venue">{upcomingVenueName}</span>}
                </div>
                {upcoming.description && (
                  <p className="featured-description">{upcoming.description}</p>
                )}
                <ConcertProgram program={upcoming.program} />
                {upcoming.ticketsUrl ? (
                  <div className="actions">
                    <a
                      className="btn"
                      href={upcoming.ticketsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TicketIcon /> Get Tickets
                    </a>
                  </div>
                ) : (
                  <p className="tickets-pending">
                    Tickets on sale soon — check back closer to the date.
                  </p>
                )}
              </div>
              {upcoming.poster ? (
                <a
                  className="featured-poster"
                  href={upcoming.poster}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${upcoming.title} poster`}
                >
                  <img src={upcoming.poster} alt={`${upcoming.title} poster`} />
                </a>
              ) : (
                <div className="poster-placeholder" aria-hidden="true">
                  <span>Poster coming soon</span>
                </div>
              )}
            </article>
          </div>
        </section>
      )}

      <section className="block">
        <div className="container">
          <SectionEyebrow>About the Orchestra</SectionEyebrow>
          <p className="section-lead">{about.intro[1]}</p>
          <ul className="highlights">
            {about.highlights.map((h) => (
              <li className="highlight-card" key={h.title}>
                <h3>{h.title}</h3>
                <p style={{ margin: 0 }}>{h.body}</p>
              </li>
            ))}
          </ul>
          <div className="text-center mt-2">
            <Link to="/about" className="btn btn-ghost">
              Meet the Orchestra
            </Link>
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="container text-center">
          <h2>Support our growth</h2>
          <p className="section-lead">
            {site.orgName} is a registered 501(c)(3) nonprofit. Your tax-deductible donation helps us keep
            ticket prices low and bring more orchestral music to the Eastside.
          </p>
          <Link to="/donate" className="btn">
            Donate
          </Link>
        </div>
      </section>
    </>
  );
}
