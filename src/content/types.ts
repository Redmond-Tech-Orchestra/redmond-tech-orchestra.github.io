export type ProgramEntry = {
  composer: string;
  pieces: string[];
};

export type Concert = {
  id: string;
  title: string;
  date: string;          // ISO date
  dateDisplay: string;   // human-readable
  venue: string;
  status: "upcoming" | "past";
  description: string;
  poster?: string;        // path under /img/concerts/...
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
  };
  nav: { label: string; to: string }[];
};

export type AboutContent = {
  intro: string[];
  highlights: { title: string; body: string }[];
};
