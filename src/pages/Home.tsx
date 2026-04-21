import { Link } from "react-router-dom";
import site from "../content/site.json";
import home from "../content/home.json";
import concertsData from "../content/concerts.json";
import type { Concert } from "../content/types";
import { SectionEyebrow } from "../components/SectionEyebrow";
import ConcertCard from "../components/ConcertCard";
import { usePageMeta } from "../hooks/usePageTitle";

const concerts = concertsData as Concert[];

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

      {upcoming && (
        <section id="next-concert" className="block">
          <div className="container">
            <SectionEyebrow>Next Concert</SectionEyebrow>
            <ul className="concert-list">
              <li>
                <ConcertCard concert={upcoming} />
              </li>
            </ul>
          </div>
        </section>
      )}

      <section className="block">
        <div className="container intro-block">
          <SectionEyebrow>{home.intro.eyebrow}</SectionEyebrow>
          <h2>{home.intro.heading}</h2>
          {home.intro.body.map((p, i) => (
            <p key={i} className="intro-body">{p}</p>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionEyebrow>{home.highlights.eyebrow}</SectionEyebrow>
          <ul className="video-highlights">
            {home.highlights.videos.map((v) => (
              <li key={v.id} className="video-highlight">
                <a
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={v.title}
                >
                  <div className="video-thumb">
                    <img
                      src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                    />
                    <span className="video-play" aria-hidden="true">▶</span>
                  </div>
                  <h3>{v.title}</h3>
                </a>
              </li>
            ))}
          </ul>
          <div className="text-center mt-2">
            <a
              className="btn btn-ghost"
              href={site.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              More on YouTube
            </a>
          </div>
        </div>
      </section>

      <section className="block">
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
