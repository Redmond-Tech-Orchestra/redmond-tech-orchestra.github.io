import PageHero from "../components/PageHero";
import { SectionEyebrow } from "../components/SectionEyebrow";
import sponsorship from "../content/sponsorship.json";
import type { SponsorshipContent, SponsorshipImage } from "../content/types";
import { usePageMeta } from "../hooks/usePageTitle";
import { Link } from "react-router-dom";

const content = sponsorship as SponsorshipContent;

function SponsorFigure({ image }: { image: SponsorshipImage }) {
  return (
    <figure className="sponsor-figure">
      <img src={image.src} alt={image.alt} loading="lazy" />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );
}

function TierTable({ tiers }: { tiers: { name: string; price: string; benefits: string[] }[] }) {
  return (
    <ul className="sponsor-tiers">
      {tiers.map((tier) => (
        <li className="sponsor-tier" key={tier.name}>
          <div className="sponsor-tier__head">
            <h3>{tier.name}</h3>
            <div className="sponsor-tier__price">{tier.price}</div>
          </div>
          <ul className="sponsor-tier__benefits">
            {tier.benefits.map((benefit, i) => (
              <li key={i}>{benefit}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default function Sponsorship() {
  usePageMeta({
    title: "Sponsorship",
    description:
      "Partner with the Redmond Tech Orchestra for the 2026–27 season. Annual and per-concert sponsorship packages connecting your business with 3,000+ attendees per concert.",
    path: "/sponsor",
  });

  return (
    <>
      <PageHero title={content.hero.title} subtitle={content.hero.subtitle} />

      <section className="block" style={{ paddingTop: 0, paddingBottom: 0, marginTop: "-1rem" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <a
            className="btn btn-ghost"
            href="/sponsorship-2026-27.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            Download proposal (PDF)
          </a>
        </div>
      </section>

      <section className="block">
        <div className="container" style={{ maxWidth: 820 }}>
          {content.intro.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {content.introImage && <SponsorFigure image={content.introImage} />}
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionEyebrow>{content.audience.heading}</SectionEyebrow>
          <p style={{ maxWidth: 820 }}>{content.audience.lead}</p>
          <ul className="highlights">
            {content.audience.segments.map((segment) => (
              <li className="highlight-card" key={segment.title}>
                <h3>{segment.title}</h3>
                <p style={{ margin: 0 }}>{segment.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2" style={{ maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
            {content.audience.footnote}
          </p>
          {content.audience.image && (
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <SponsorFigure image={content.audience.image} />
            </div>
          )}
        </div>
      </section>

      {content.rationaleGroups.map((group) => (
        <section className="block" key={group.title}>
          <div className="container">
            <SectionEyebrow>{group.title}</SectionEyebrow>
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              {group.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <ul className="highlights">
              {group.highlights.map((h) => (
                <li className="highlight-card" key={h.title}>
                  <h3>{h.title}</h3>
                  <p style={{ margin: 0 }}>{h.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="block">
        <div className="container">
          <SectionEyebrow>{content.annualPackages.heading}</SectionEyebrow>
          {content.annualPackages.image && <SponsorFigure image={content.annualPackages.image} />}
          <p style={{ maxWidth: 820 }}>{content.annualPackages.lead}</p>
          <TierTable tiers={content.annualPackages.tiers} />
        </div>
      </section>

      <section className="block">
        <div className="container">
          <SectionEyebrow>{content.perConcertPackages.heading}</SectionEyebrow>
          <p style={{ maxWidth: 820 }}>{content.perConcertPackages.lead}</p>
          <TierTable tiers={content.perConcertPackages.tiers} />
        </div>
      </section>

      <section className="block">
        <div className="container" style={{ maxWidth: 820 }}>
          <SectionEyebrow>{content.inKind.heading}</SectionEyebrow>
          <p>
            {content.inKind.body.split("in-kind support").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <strong>in-kind support</strong>}
              </span>
            ))}
          </p>
        </div>
      </section>

      <section className="block">
        <div className="container" style={{ maxWidth: 820 }}>
          <SectionEyebrow>{content.contact.heading}</SectionEyebrow>
          {content.contact.image && <SponsorFigure image={content.contact.image} />}
          <p>{content.contact.body}</p>
          <p style={{ textAlign: "center" }}>
            <Link to="/contact?topic=Sponsorship" className="btn">Use the contact form</Link>
          </p>
        </div>
      </section>
    </>
  );
}
