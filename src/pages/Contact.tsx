import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import { usePageMeta } from "../hooks/usePageTitle";
import site from "../content/site.json";

const TOPICS = ["General inquiry", "Joining the orchestra", "Sponsorship", "Press / media", "Outreach", "Other"];
const JOINING_TOPIC = "Joining the orchestra";
const OPENINGS = [
  "Oboe (Substitute)",
  "2nd Bassoon",
  "Tuba (Substitute)",
  "Percussion (Substitute)",
  "Viola",
  "Cello",
  "Bass",
];
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvzlgljy";

export default function Contact() {
  usePageMeta({
    title: "Contact",
    description:
      "Get in touch with the Redmond Tech Orchestra about joining, sponsorship, press inquiries, or anything else.",
    path: "/contact",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get("topic") ?? "";
  const initialTopic = TOPICS.includes(topicParam) ? topicParam : "";
  const [topic, setTopic] = useState(initialTopic);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Formspree error:", response.status, errorData);
        throw new Error(`Formspree returned ${response.status}`);
      }

      setSubmitted(true);
      form.reset();
      setTopic("");
    } catch (err) {
      console.error("Form submission error:", err);
      setError("We couldn't send your message right now. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle={
          <>
            If you have feedback, questions, or any other inquiries, please use the contact form to reach out to us. A member of our team will get back to you shortly. You can also reach us on Instagram at{" "}
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
              @redmondtechorchestra
            </a>
            .
          </>
        }
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
                <select
                  id="topic"
                  name="topic"
                  required
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                >
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
            {topic === JOINING_TOPIC && (
              <aside className="joining-info" aria-labelledby="joining-info-title">
                <h2 id="joining-info-title">Current openings</h2>
                <ul>
                  {OPENINGS.map((opening) => (
                    <li key={opening}>{opening}</li>
                  ))}
                </ul>
                <p>
                  All openings require an audition. Audition materials will be provided upon request.
                </p>
                <p>We rehearse Thursdays from 5–7 p.m.</p>
              </aside>
            )}
            <div className="form-row">
              <div>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required />
              </div>
            </div>
            {submitted && <p className="form-message success">Thanks - we'll be in touch soon.</p>}
            {error && <p className="form-message error">{error}</p>}
            <button className="btn" type="submit" disabled={submitted || isSubmitting}>
              {submitted ? "Sent" : isSubmitting ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
