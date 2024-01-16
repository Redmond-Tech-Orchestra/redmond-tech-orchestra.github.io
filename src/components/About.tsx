import { LargeTitle } from "@fluentui/react-components";

import flute from "../assets/flute.jpg";

export default function About() {
    return (
        <section id="about">
            <LargeTitle>About</LargeTitle>
            <div className="description container">
                <div>
                    <p>
                        The Redmond Tech Orchestra is a community orchestra based in Redmond, Washington. We are a
                        nonprofit organization dedicated to fostering a vibrant cultural enviornment, supporting musical
                        education, and ensuring that the joy of orchestral performances is accessible to all.
                    </p>
                </div>
                <div>
                    <img src={flute} alt="Musician playing a flute." width={450} />
                </div>
            </div>
        </section>
    );
}
