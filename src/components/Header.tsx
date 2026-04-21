import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import site from "../content/site.json";
import { MenuIcon, CloseIcon } from "./Icons";

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="brand" onClick={close}>
          <img src="/img/logo.png" alt="" className="brand-mark-img" width={40} height={40} />
          <span>{site.orgName}</span>
        </Link>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
        <nav id="primary-nav" className={"site-nav" + (open ? " open" : "")}>
          <ul>
            {site.nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={close}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/donate"
                onClick={close}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                Donate
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
