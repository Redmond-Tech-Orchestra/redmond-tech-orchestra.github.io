import { Link } from "react-router-dom";
import { SectionEyebrow } from "../components/SectionEyebrow";
import PageHero from "../components/PageHero";
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
      <PageHero
        title={content.hero.eyebrow}
        backgroundImage={content.hero.image.src}
      />

      <section className="block">
        <div className="container">
          <SectionEyebrow>{content.tagline}</SectionEyebrow>
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
          <h2 style={{ textAlign: "center" }}>
            Connecting communities through performances at landmark Eastside events.
          </h2>
          <div className="community-highlights">
            <div className="community-highlight">
              <span className="community-highlight__number">250+</span>
              <span className="community-highlight__label">Mentorship Reach</span>
            </div>
            <div className="community-highlight">
              <span className="community-highlight__number">67B</span>
              <span className="community-highlight__label">Annual Volunteer Hours</span>
            </div>
            <div className="community-highlight">
              <span className="community-highlight__number">One</span>
              <span className="community-highlight__label">Stronger Community</span>
            </div>
          </div>
          <div className="community-photos">
            <img
              className="community-photo"
              src="/img/community/Marymoor_Village_Station_Grand_Opening.png"
              alt="Marymoor Village Station Grand Opening"
              loading="lazy"
            />
            <img
              className="community-photo"
              src="/img/community/Microsoft_Asian_Spring_Festival.png"
              alt="Microsoft Asian Spring Festival"
              loading="lazy"
            />
            <img
              className="community-photo"
              src="/img/community/LakeWashingtonHighSchool2026.png"
              alt="Lake Washington High School 2026"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container community-cta">
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
