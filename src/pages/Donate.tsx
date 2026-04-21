import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import site from "../content/site.json";
import { usePageMeta } from "../hooks/usePageTitle";

export default function Donate() {
  usePageMeta({
    title: "Donate",
    description:
      "Support the Redmond Tech Orchestra. Donations to our 501(c)(3) nonprofit are tax-deductible and help us keep concerts free and accessible.",
    path: "/donate",
  });
  return (
    <>
      <PageHero title="Support our growth" />
      <section className="block">
        <div className="container" style={{ maxWidth: 720 }}>
          <p>
            Donations help us pay for venues, sheet music rentals, instrument repairs, and the
            other quietly expensive things that go into putting on a concert. They're how we keep
            tickets free or low-cost.
          </p>
          <p>
            RTO is a registered 501(c)(3) nonprofit organization. Donations are tax-deductible to the full
            extent of the law.
          </p>
          <p>
            Interested in sponsoring as a business?{" "}
            <Link to="/contact">Reach out via our contact form</Link>.
          </p>
          <div className="mt-2">
            <a className="btn btn-gold" href={site.donateUrl} target="_blank" rel="noopener noreferrer">
              Donate via PayPal
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
