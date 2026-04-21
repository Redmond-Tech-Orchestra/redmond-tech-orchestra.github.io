import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import about from "../content/about.json";

export default function About() {
  return (
    <>
      <PageHero title="About RTO" />
      <section className="block">
        <div className="container about-grid">
          <div>
            {about.intro.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            <div className="mt-2">
              <Link to="/concerts" className="btn">
                View Upcoming Concerts
              </Link>
            </div>
          </div>
          <div>
            <img src="/img/hero-flute.jpg" alt="An RTO musician playing the flute." />
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="container">
          <h2>What sets us apart</h2>
          <div className="highlights">
            {about.highlights.map((h) => (
              <div className="highlight-card" key={h.title}>
                <h3>{h.title}</h3>
                <p style={{ margin: 0 }}>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <h2 className="section-eyebrow">Meet the Team</h2>
          <div className="team-grid">
            {about.team.map((member) => (
              <article className="team-card" key={member.name}>
                {"image" in member && member.image && (
                  <img className="team-photo" src={member.image} alt={member.name} loading="lazy" />
                )}
                <h3>{member.name}</h3>
                <div className="team-role">{member.role}</div>
                <p>{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="container">
          <h2 className="section-eyebrow">Meet the Members</h2>
          <div className="quote-grid">
            {about.memberQuotes.map((q) => (
              <figure className="quote-card" key={q.name}>
                {"image" in q && q.image && (
                  <img className="member-photo" src={q.image} alt={q.name} loading="lazy" />
                )}
                <blockquote>{q.quote}</blockquote>
                <figcaption>
                  <strong>{q.name}</strong>
                  <span>{q.instrument}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
