import { Link } from "react-router-dom";
import site from "../content/site.json";
import { InstagramIcon, FacebookIcon, YouTubeIcon, TikTokIcon } from "./Icons";

const socialLinks = [
  { key: "instagram", label: "Instagram", url: site.social.instagram, Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", url: site.social.facebook, Icon: FacebookIcon },
  { key: "youtube", label: "YouTube", url: site.social.youtube, Icon: YouTubeIcon },
  { key: "tiktok", label: "TikTok", url: site.social.tiktok, Icon: TikTokIcon },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div>
          <h4>{site.orgName}</h4>
          <p style={{ margin: 0 }}>A community orchestra in Redmond, WA.</p>
        </div>
        <div>
          <h4>Links</h4>
          <div className="links">
            <Link to="/contact">Contact</Link>
            <Link to="/donate">Donate</Link>
            <a href={site.bylawsUrl} target="_blank" rel="noopener noreferrer">
              Bylaws
            </a>
          </div>
        </div>
        <div>
          <h4>Follow</h4>
          <div className="social-links">
            {socialLinks.map(({ key, label, url, Icon }) =>
              url ? (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                >
                  <Icon />
                </a>
              ) : null
            )}
          </div>
        </div>
        <div className="legal">
          &copy; {site.foundingYear}&ndash;{year} {site.orgName} &middot; {site.nonprofitNote}
        </div>
      </div>
    </footer>
  );
}
