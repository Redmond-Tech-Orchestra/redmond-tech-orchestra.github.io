import { useState, type FormEvent } from "react";
import PageHero from "../components/PageHero";
import { usePageMeta } from "../hooks/usePageTitle";

const TOPICS = ["General inquiry", "Joining the orchestra", "Sponsorship", "Press / media", "Other"];

export default function Contact() {
  usePageMeta({
    title: "Contact",
    description:
      "Get in touch with the Redmond Tech Orchestra about joining, sponsorship, press inquiries, or anything else.",
    path: "/contact",
  });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire up a forms backend (Formspree, Netlify Forms, etc.).
    // The contact email is intentionally not stored in source to avoid scraping.
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="If you have feedback, questions, or any other inquiries, please use the contact form to reach out to us. A member of our team will get back to you shortly."
      />
      <section className="block">
        <div className="container">
          <form className="form-card" onSubmit={onSubmit}>
            <div className="form-row two">
              <div>
                <label htmlFor="firstName">First name</label>
                <input id="firstName" name="firstName" required />
              </div>
              <div>
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" name="lastName" required />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label htmlFor="topic">I have a question about…</label>
                <select id="topic" name="topic" required defaultValue="">
                  <option value="" disabled>
                    Select a topic
                  </option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required />
              </div>
            </div>
            <button className="btn" type="submit" disabled={submitted}>
              {submitted ? "Thanks — we'll be in touch" : "Send"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
