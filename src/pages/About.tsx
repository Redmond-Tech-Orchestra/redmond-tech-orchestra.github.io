import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { SectionEyebrow } from "../components/SectionEyebrow";
import about from "../content/about.json";
import { usePageMeta } from "../hooks/usePageTitle";

export default function About() {
  usePageMeta({
    title: "About",
    description:
      "Founded in 2024 by musicians working in tech, the Redmond Tech Orchestra is a community orchestra dedicated to making orchestral music accessible across the Eastside of Seattle.",
    path: "/about",
  });
  return (
    <>
      <PageHero title="About" backgroundImage="/img/hero-orchestra.jpg" />
      <section className="block">
        <div className="container">
          <SectionEyebrow>Our Story</SectionEyebrow>
          <div className="about-grid">
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
              <img src="/img/about-moomie.jpg" alt="Moomie, an RTO musician." />
            </div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionEyebrow>What sets us apart</SectionEyebrow>
          <ul className="highlights">
            {about.highlights.map((h) => (
              <li className="highlight-card" key={h.title}>
                <h3>{h.title}</h3>
                <p style={{ margin: 0 }}>{h.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionEyebrow>Meet the Team</SectionEyebrow>
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

      <section className="block">
        <div className="container">
          <SectionEyebrow>Meet the Members</SectionEyebrow>
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
