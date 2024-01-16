import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Schedule from "./components/Schedule";
import About from "./components/About";

export default function App() {
    return (
        <FluentProvider theme={webLightTheme}>
            <main>
                <Navbar />
                <div className="content">
                    <Landing />
                    <Schedule />
                    <About />
                </div>
            </main>
        </FluentProvider>
    );
}
