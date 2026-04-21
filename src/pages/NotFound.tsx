import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { usePageMeta } from "../hooks/usePageTitle";

export default function NotFound() {
  usePageMeta({ title: "Page not found" });
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
