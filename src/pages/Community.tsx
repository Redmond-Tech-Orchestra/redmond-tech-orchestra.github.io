import { useMemo } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import { SectionEyebrow } from "../components/SectionEyebrow";
import PageHero from "../components/PageHero";
import { usePageMeta } from "../hooks/usePageTitle";
import community from "../content/community.json";
import type { CommunityContent } from "../content/types";

const content = community as CommunityContent;

export default function Community() {
  const carouselPhotos =
    content.photos.length < 10
      ? [...content.photos, ...content.photos]
      : content.photos;
  const autoScroll = useMemo(
    () =>
      AutoScroll({
        playOnInit:
          typeof window === "undefined" ||
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        speed: 0.4,
        startDelay: 1000,
        stopOnFocusIn: false,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    [],
  );
  const [communityPhotosRef] = useEmblaCarousel(
    { align: "start", dragFree: true, loop: true },
    [autoScroll],
  );

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
          <div
            className="community-photos"
            ref={communityPhotosRef}
            role="region"
            aria-label="Community photos"
          >
            <div className="community-photos__track">
              {carouselPhotos.map((photo, i) => {
                const photoIndex = i % content.photos.length;
                const isDuplicate = i >= content.photos.length;

                return (
                  <div
                    key={`${photo.src}-${i}`}
                    className="community-photo-slide"
                    role={isDuplicate ? undefined : "group"}
                    aria-label={
                      isDuplicate
                        ? undefined
                        : `Photo ${photoIndex + 1} of ${content.photos.length}`
                    }
                    aria-hidden={isDuplicate || undefined}
                  >
                    <img
                      className="community-photo"
                      src={photo.src}
                      alt={isDuplicate ? "" : photo.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                );
              })}
            </div>
          </div>
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
