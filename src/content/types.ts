export type ProgramEntry = {
  composer: string;
  pieces: string[];
};

export type Venue = {
  name: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
};

export type ConcertCategory = "masterworks" | "chamber" | "community" | "session";

export type Concert = {
  id: string;
  title: string;
  date: string;          // ISO date
  dateDisplay: string | string[];   // human-readable; array for multi-show runs
  venue?: string;         // optional override; otherwise derived from venues[venueId].name
  venueId?: string;       // key into venues.json
  status: "upcoming" | "past";
  category?: ConcertCategory;  // defaults to "masterworks"
  description: string;
  poster?: string;        // path under /img/concerts/...
  posterOrientation?: "portrait" | "landscape" | "square";  // defaults to "portrait"
  ticketsUrl?: string;
  recordingsUrl?: string;
  programUrl?: string;
  program?: ProgramEntry[];
};

export type SiteContent = {
  orgName: string;
  shortName: string;
  tagline: string;
  foundingYear: number;
  nonprofitNote: string;
  donateUrl: string;
  bylawsUrl: string;
  social: {
    youtube: string | null;
    instagram: string | null;
    facebook: string | null;
    tiktok: string | null;
  };
  nav: { label: string; to: string }[];
};

export type AboutContent = {
  intro: string[];
  highlights: { title: string; body: string }[];
};
