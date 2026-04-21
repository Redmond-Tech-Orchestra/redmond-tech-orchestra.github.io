import { Link } from "react-router-dom";
import site from "../content/site.json";

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
            <Link to="/concerts">Concerts</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/donate">Donate</Link>
            <a href={site.bylawsUrl} target="_blank" rel="noopener noreferrer">
              Bylaws
            </a>
            {site.social.youtube && (
              <a href={site.social.youtube} target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
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
