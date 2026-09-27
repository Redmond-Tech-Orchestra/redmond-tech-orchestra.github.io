import sponsors from "../content/sponsors.json";
import type { Sponsor, SponsorsContent } from "../content/types";
import { usePageMeta } from "../hooks/usePageTitle";
import { SectionEyebrow } from "../components/SectionEyebrow";
import PageHero from "../components/PageHero";

const content = sponsors as SponsorsContent;

function SponsorSection({
  heading,
  sponsors,
  size,
}: {
  heading: string;
  sponsors: Sponsor[];
  size: "principal" | "partner" | "supporter";
}) {
  if (sponsors.length === 0) {
    return null;
  }

  return (
    <section className="sponsor-logos__section">
      <SectionEyebrow>{heading}</SectionEyebrow>
      <ul className={`sponsor-logos sponsor-logos--${size}`}>
        {sponsors.map((sponsor) => {
          const logo = (
            <img
              src={sponsor.logo}
              alt={`${sponsor.name} logo`}
              loading="lazy"
            />
          );

          return (
            <li className="sponsor-logos__item" key={sponsor.name}>
              {sponsor.url ? (
                <a href={sponsor.url} aria-label={sponsor.name}>
                  {logo}
                </a>
              ) : (
                logo
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function TierRow({
  heading,
  tiers,
}: {
  heading: string;
  tiers: { name: string; price: string; benefits: string[] }[];
}) {
  return (
    <section className="sponsors-glance__row">
      <h2 className="sponsors-glance__row-title">{heading}</h2>
      <ul className="sponsors-glance__tiers">
        {tiers.map((tier) => (
          <li className="sponsors-glance__tier" key={tier.name}>
            <h3>{tier.name}</h3>
            <div className="sponsors-glance__price">{tier.price}</div>
            <ul className="sponsors-glance__benefits">
              {tier.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Sponsors() {
  usePageMeta({
    title: "Sponsors",
    description:
      "Annual, per-concert, and in-kind sponsorship opportunities with the Redmond Tech Orchestra.",
    path: "/sponsors",
  });

  return (
    <>
    <PageHero
        title={content.hero.eyebrow}
        backgroundImage={content.hero.image.src}
      />

    <section className="block sponsor-logos-block">
      <div className="container">
        <SponsorSection
          heading="Principal Patrons"
          sponsors={content.sponsors.principalPatrons}
          size="principal"
        />
        <SponsorSection
          heading="Partners"
          sponsors={content.sponsors.partners}
          size="partner"
        />
        <SponsorSection
          heading="Supporters"
          sponsors={content.sponsors.supporters}
          size="supporter"
        />
      </div>
    </section>

    <section className="block">
        <div className="container">
          <SectionEyebrow>{content.tagline}</SectionEyebrow>
          <div className="container">
            <header className="sponsors-glance__intro">
              <h1>{content.hero.title}</h1>
              <p>{content.hero.subtitle}</p>
            </header>

            <div className="sponsors-glance__table">
              <TierRow
                heading={content.annualPackages.heading}
                tiers={content.annualPackages.tiers}
              />
              <TierRow
                heading={content.perConcertPackages.heading}
                tiers={content.perConcertPackages.tiers}
              />

              <section className="sponsors-glance__in-kind">
                <h2>{content.inKind.heading}</h2>
                <p>{content.inKind.body}</p>
              </section>
            </div>
          </div>
        </div>
      </section>
      
      <section className="block" style={{ paddingTop: 0, paddingBottom: 0, marginTop: "1.5rem" }}>
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

    </>
  );
}
