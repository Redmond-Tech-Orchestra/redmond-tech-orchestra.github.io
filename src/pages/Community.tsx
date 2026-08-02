import { Link } from "react-router-dom";
import CommunityImageCarousel from "../components/CommunityImageCarousel";
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
            <p key={i} className="intro-body community-intro">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionEyebrow>{content.stats.heading}</SectionEyebrow>
          <p className="intro-body community-intro">{content.stats.subheading}</p>
          <div className="community-highlights">
            {content.stats.items.map((stat, i) => (
              <div key={i} className="community-highlight">
                <span className="community-highlight__number">{stat.number}</span>
                <span className="community-highlight__label">{stat.label}</span>
              </div>
            ))}
          </div>
          <CommunityImageCarousel
            photos={content.photos}
            delayMs={content.carouselDelayMs}
          />
        </div>
      </section>

      <section className="block">
        <div className="container community-cta">
          <h2>{content.cta.heading}</h2>
          <p>{content.cta.body}</p>
          <p>
            <Link to={content.cta.buttonTo} className="btn">
              {content.cta.buttonLabel}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
