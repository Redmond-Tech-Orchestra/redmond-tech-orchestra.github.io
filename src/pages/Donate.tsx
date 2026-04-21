import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import site from "../content/site.json";

export default function Donate() {
  return (
    <>
      <PageHero title="Support our growth" />
      <section className="block">
        <div className="container" style={{ maxWidth: 720 }}>
          <p>
            Join us on our mission to support musical education and ensure that the joy of orchestral
            performances is accessible to all. Your donation goes a long way towards supporting the local
            music & arts communities.
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
