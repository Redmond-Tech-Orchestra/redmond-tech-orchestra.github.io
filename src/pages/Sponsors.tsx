import sponsors from "../content/sponsors.json";
import type { Sponsor, SponsorsContent } from "../content/types";
import { usePageMeta } from "../hooks/usePageTitle";
import { SectionEyebrow } from "../components/SectionEyebrow";
import PageHero from "../components/PageHero";
import { Link } from "react-router-dom";

const content = sponsors as SponsorsContent;

function parseSponsorDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new Error(`Invalid sponsor start date "${value}". Expected YYYY-MM-DD.`);
  }

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    throw new Error(`Invalid sponsor start date "${value}".`);
  }

  return date;
}

function getActiveSponsors(sponsors: Sponsor[], now = new Date()) {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  return sponsors
    .map((sponsor) => ({
      sponsor,
      startDate: parseSponsorDate(sponsor.startDate),
    }))
    .filter(({ startDate }) => {
      const expirationDate = new Date(startDate);
      expirationDate.setUTCFullYear(expirationDate.getUTCFullYear() + 1);

      return startDate.getTime() <= today && today < expirationDate.getTime();
    })
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .map(({ sponsor }) => sponsor);
}

function SponsorSection({
  heading,
  sponsors,
  size,
}: {
  heading: string;
  sponsors: Sponsor[];
  size: "principal" | "partner" | "supporter";
}) {
  const activeSponsors = getActiveSponsors(sponsors);

  if (activeSponsors.length === 0) {
    return null;
  }

  return (
    <section className="sponsor-logos__section">
      <SectionEyebrow>{heading}</SectionEyebrow>
      <ul className={`sponsor-logos sponsor-logos--${size}`}>
        {activeSponsors.map((sponsor) => {
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
          <SectionEyebrow>{content.whySponsor.tagline}</SectionEyebrow>
          <section className="sponsors-why">
            <h2>{content.whySponsor.heading}</h2>
            <p>
              <strong>{content.whySponsor.lead.emphasis}</strong>{" "}
              {content.whySponsor.lead.body}
            </p>
            <ul>
              {content.whySponsor.points.map((point) => (
                <li key={point.emphasis}>
                  <strong>{point.emphasis}</strong> {point.body}
                </li>
              ))}
            </ul>
          </section>
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
        <div
          className="container"
          style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}
        >
          <Link to={content.whySponsor.contact.buttonTo} className="btn">
            {content.whySponsor.contact.buttonLabel}
          </Link>
          <a
            className="btn btn-ghost"
            href="/sponsorship-2026-27.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.whySponsor.contact.download}
          </a>
        </div>
      </section>

    </>
  );
}
