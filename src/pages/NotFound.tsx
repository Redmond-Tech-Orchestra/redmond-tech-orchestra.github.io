import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";

export default function NotFound() {
  return (
    <>
      <PageHero title="Page not found" subtitle="That page doesn't exist (yet)." />
      <section className="block">
        <div className="container text-center">
          <Link to="/" className="btn">
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
