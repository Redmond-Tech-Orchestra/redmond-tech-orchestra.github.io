import { Link } from "react-router-dom";
import site from "../content/site.json";
import about from "../content/about.json";
import home from "../content/home.json";
import concertsData from "../content/concerts.json";
import type { Concert } from "../content/types";
import { TicketIcon } from "../components/Icons";

const concerts = concertsData as Concert[];

export default function Home() {
  const upcoming = concerts.find((c) => c.status === "upcoming");

  return (
    <>
      <section className="hero">
        <div>
          <h1>{site.orgName}</h1>
          <p>{site.tagline}</p>
          <div className="actions">
            <Link to="/concerts" className="btn">
              Upcoming Concerts
            </Link>
            <Link to="/about" className="btn btn-outline">
              About RTO
            </Link>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container intro-block">
          <h2>{home.intro.heading}</h2>
          {home.intro.body.map((p, i) => (
            <p key={i} className="intro-body">{p}</p>
          ))}
          <div className="text-center mt-2">
            <Link to={home.intro.cta.to} className="btn">
              {home.intro.cta.label}
            </Link>
          </div>
        </div>
      </section>

      {upcoming && (
        <section className="block">
          <div className="container">
            <article className="featured-concert">
              <div className="featured-body">
                <div className="meta">Next Concert</div>
                <h3>{upcoming.title}</h3>
                <div className="when-where">
                  <span className="date">{upcoming.dateDisplay}</span>
                  {upcoming.venue}
                </div>
                <p style={{ color: "var(--text-muted)", margin: 0 }}>
                  {upcoming.description}
                </p>
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
                  <Link to="/concerts" className="btn btn-outline">
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

      <section className="block alt">
        <div className="container">
          <h2>About the Orchestra</h2>
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
            <Link to="/about" className="btn btn-outline">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container text-center">
          <h2>Support our growth</h2>
          <p className="section-lead">
            RTO is a registered 501(c)(3) nonprofit. Your tax-deductible donation helps us bring orchestral
            music to the Puget Sound community.
          </p>
          <Link to="/donate" className="btn">
            Donate
          </Link>
        </div>
      </section>
    </>
  );
}
