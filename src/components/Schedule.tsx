import {
    Button,
    Caption1,
    Card,
    CardFooter,
    CardHeader,
    CardPreview,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    LargeTitle,
    Subtitle1,
    Subtitle2
} from "@fluentui/react-components";

import saintSaens from "../assets/saint-saens.jpg";
import gershwin from "../assets/gershwin.jpg";

export default function Schedule() {
    return (
        <section id="schedule">
            <LargeTitle>Concerts</LargeTitle>
            <div className="concerts mt-16">
                <Card className="concert-card">
                    <CardHeader
                        header={<Subtitle1>Starting with Saint-Saëns</Subtitle1>}
                        description={<Caption1>March, 30, 2024</Caption1>}
                    />
                    <CardPreview>
                        <img src={saintSaens} alt="Portrait of Camille Saint-Saëns" width={256} height={256} />
                    </CardPreview>
                    <CardFooter>
                        <Dialog>
                            <DialogTrigger disableButtonEnhancement>
                                <Button>Details</Button>
                            </DialogTrigger>
                            <DialogSurface>
                                <DialogBody>
                                    <DialogTitle>Organ Symphony</DialogTitle>
                                    <DialogContent className="concert-description">
                                        <Subtitle2>Dmitri Shostakovich</Subtitle2>
                                        <span>Waltz no. 2 from Suite for Jazz Orchestra no. 2</span>
                                        <br />
                                        <Subtitle2>Aaron Copland</Subtitle2>
                                        <span>Hoe-down from Rodeo</span>
                                        <br />
                                        <Subtitle2>Camille Saint-Saëns</Subtitle2>
                                        <span>Bacchanale from Samson and Delilah</span>
                                        <span>Danse Macabre</span>
                                        <span>Symphony No. 3 in C minor, Op. 78 "Organ"</span>
                                        <br />
                                        <p>
                                            The Organ Symphony is the most famous of Saint-Saëns' symphonies. It was
                                            composed in 1885 and premiered at the St James's Hall in London in 1886,
                                            conducted by the composer. The piece was commissioned for the inauguration
                                            of the newly built <i>Grand Organ</i> of the hall.
                                        </p>
                                        <p>
                                            The symphony has two movements:
                                            <ol>
                                                <li>Adagio – Allegro moderato</li>
                                                <li>Allegro moderato – Presto – Maestoso – Allegro</li>
                                            </ol>
                                        </p>
                                    </DialogContent>
                                    <DialogActions>
                                        <DialogTrigger disableButtonEnhancement>
                                            <Button appearance="secondary">Close</Button>
                                        </DialogTrigger>
                                    </DialogActions>
                                </DialogBody>
                            </DialogSurface>
                        </Dialog>
                    </CardFooter>
                </Card>

                <Card className="concert-card">
                    <CardHeader
                        header={<Subtitle1>Gershwin Red and Blue!</Subtitle1>}
                        description={<Caption1>Summer 2024</Caption1>}
                    />
                    <CardPreview>
                        <img src={gershwin} alt="Portrait of George Gershwin" width={256} height={256} />
                    </CardPreview>
                    <CardFooter>
                        <Dialog>
                            <DialogTrigger disableButtonEnhancement>
                                <Button>Details</Button>
                            </DialogTrigger>
                            <DialogSurface>
                                <DialogBody>
                                    <DialogTitle>Gershwin Blues!</DialogTitle>
                                    <DialogContent className="concert-description">
                                        <p>
                                            Get ready for some Gershwin! For this concert will will be playing American
                                            in Paris and Rhapsody in Blue!
                                        </p>
                                    </DialogContent>
                                    <DialogActions>
                                        <DialogTrigger disableButtonEnhancement>
                                            <Button appearance="secondary">Close</Button>
                                        </DialogTrigger>
                                    </DialogActions>
                                </DialogBody>
                            </DialogSurface>
                        </Dialog>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}
