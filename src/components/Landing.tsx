import { Display, Subtitle1 } from "@fluentui/react-components";

export default function Landing() {
    return (
        <section id="landing">
            <div className="text">
                <Display align="center">Redmond Tech Orchestra</Display>
                <Subtitle1 className="container" align="center">
                    Inspiring, educating, and serving the local community in enriching lives through the beauty and
                    shared experience of orchestral music.
                </Subtitle1>
            </div>
        </section>
    );
}
