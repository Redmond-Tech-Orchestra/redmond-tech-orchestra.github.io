import { Link } from "react-router-dom";
import { SectionEyebrow } from "../components/SectionEyebrow";
import { usePageMeta } from "../hooks/usePageTitle";
import community from "../content/community.json";
import type { CommunityContent } from "../content/types";

const content = community as CommunityContent;

export default function Community() {
  usePageMeta({
    title: "Community",
    description:
      "Redmond Tech Orchestra musicians visit local high schools to coach student orchestras, share repertoire, and inspire the next generation.",
    path: "/community",
  });

  return (
    <>
      <section
        className="page-hero page-hero--image community-hero"
        style={{ backgroundImage: `url(${content.hero.image.src})` }}
        aria-label={content.hero.image.alt}
      >
        <div className="container">
          <p className="hero-eyebrow">{content.hero.eyebrow}</p>
          <h1>{content.hero.title}</h1>
          <p>{content.hero.subtitle}</p>
        </div>
      </section>

      <section className="block">
        <div className="container community-tagline">
          <p>{content.tagline}</p>
        </div>
      </section>

      <section className="block">
        <div className="container" style={{ maxWidth: 820 }}>
          {content.intro.map((paragraph, i) => (
            <p key={i} className="intro-body" style={{ textAlign: "left" }}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionEyebrow>{content.stats.heading}</SectionEyebrow>
          <ul className="community-stats">
            {content.stats.items.map((stat) => (
              <li className="community-stat" key={stat.label}>
                <div className="community-stat__number">{stat.number}</div>
                <div className="community-stat__label">{stat.label}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="block">
        <div className="container" style={{ maxWidth: 820 }}>
          <figure className="quote-card community-quote">
            <blockquote>{content.testimonial.quote}</blockquote>
            <figcaption>
              <div className="quote-card__byline">
                <strong>{content.testimonial.author}</strong>
                <span>{content.testimonial.affiliation}</span>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="block">
        <div className="container community-cta" style={{ maxWidth: 820 }}>
          <h2>{content.cta.heading}</h2>
          <p>{content.cta.body}</p>
          <p style={{ textAlign: "center", marginBottom: 0 }}>
            <Link to={content.cta.buttonTo} className="btn">
              {content.cta.buttonLabel}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
