import { Button, Link, Subtitle1, Title1 } from "@fluentui/react-components";

import logo from "../assets/Moo.png";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className={"navbar " + (open ? "open" : "closed")}>
            <div className={"navbar-contents " + (open ? "open" : "closed")}>
                <div className="logo">
                    <img src={logo} width={64} height={64} />
                    <div className="text">
                        <Title1>RTO</Title1>
                    </div>
                </div>

                <Subtitle1 className="nav-section">pages</Subtitle1>
                <Link href="#schedule">schedule</Link>
                <Link href="#about">about</Link>

                <Subtitle1 className="nav-section">links</Subtitle1>
                <Link href="https://www.youtube.com/watch?v=ZGeWNR8CWnA" target="_blank">
                    musical
                </Link>
                <Link href="./bylaws.pdf" target="_blank">
                    bylaws
                </Link>

                <span id="copyright">&copy; 2024 &ndash; {new Date().getFullYear()}</span>
            </div>

            <div className="menu-button">
                <Button onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</Button>
            </div>
        </nav>
    );
}
