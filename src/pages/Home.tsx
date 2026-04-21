import { Link } from "react-router-dom";
import site from "../content/site.json";
import about from "../content/about.json";
import home from "../content/home.json";
import concertsData from "../content/concerts.json";
import venuesData from "../content/venues.json";
import type { Concert, Venue } from "../content/types";
import { TicketIcon } from "../components/Icons";

const concerts = concertsData as Concert[];
const venues = venuesData as Record<string, Venue>;

export default function Home() {
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
      <div className="hero-photo" role="img" aria-label="Redmond Tech Orchestra performing" />

      <section className="hero-intro">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">{home.hero.eyebrow}</p>
            <h1>{home.hero.headline}</h1>
            <p className="hero-subhead">{home.hero.subhead}</p>
          </div>
          <div className="actions">
            <Link to="/concerts" className="btn">
              Upcoming Concerts
            </Link>
            <Link to="/about" className="btn btn-ghost">
              About Us
            </Link>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container intro-block">
          <p className="section-eyebrow section-eyebrow--inline">{home.intro.eyebrow}</p>
          <h2>{home.intro.heading}</h2>
          {home.intro.body.map((p, i) => (
            <p key={i} className="intro-body">{p}</p>
          ))}
          <div className="text-center mt-2">
            <Link to={home.intro.cta.to} className="btn btn-ghost">
              {home.intro.cta.label}
            </Link>
          </div>
        </div>
      </section>

      {upcoming && (
        <section className="block alt">
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
                <div className="actions">
                  {upcoming.ticketsUrl && (
                    <a
                      className="btn"
                      href={upcoming.ticketsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TicketIcon /> Get Tickets
                    </a>
                  )}
                  <Link to="/concerts" className="btn btn-ghost">
                    All Concerts
                  </Link>
                </div>
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
          <h2 className="section-eyebrow">About the Orchestra</h2>
          <p className="section-lead">{about.intro[1]}</p>
          <div className="highlights">
            {about.highlights.map((h) => (
              <div className="highlight-card" key={h.title}>
                <h3>{h.title}</h3>
                <p style={{ margin: 0 }}>{h.body}</p>
              </div>
            ))}
          </div>
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
