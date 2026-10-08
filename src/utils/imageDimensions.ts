export type ImageDimensions = {
  width: number;
  height: number;
};

const IMAGE_DIMENSIONS: Record<string, ImageDimensions> = {
  "/img/about-moomie.jpg": { width: 1400, height: 1050 },
  "/img/community/20260905_RedmondArtsInThePark_carousel.webp": { width: 1200, height: 600 },
  "/img/community/Korean_National_Day.webp": { width: 1600, height: 800 },
  "/img/community/LWHS_Prep_Orchestra_Camp_2026.webp": { width: 1600, height: 800 },
  "/img/community/Marymoor_Village_Station_Grand_Opening.webp": { width: 1600, height: 800 },
  "/img/community/Microsoft_Asian_Spring_Festival.webp": { width: 1080, height: 540 },
  "/img/community/community_outreach_2.webp": { width: 1800, height: 1440 },
  "/img/concerts/MOOSE-Aug-2026-V3.jpg": { width: 1200, height: 1553 },
  "/img/concerts/arts-in-the-park-2026.jpg": { width: 1880, height: 1058 },
  "/img/concerts/broadway-hollywood.jpg": { width: 1200, height: 1600 },
  "/img/concerts/chamber-spotlight.png": { width: 842, height: 772 },
  "/img/concerts/chime.webp": { width: 1600, height: 1067 },
  "/img/concerts/dvorak-chamber.jpg": { width: 1280, height: 720 },
  "/img/concerts/harmony-in-motion.jpg": { width: 1200, height: 1553 },
  "/img/concerts/jurassic-park-freeway.jpg": { width: 1280, height: 720 },
  "/img/concerts/marymoor-grand-opening.jpg": { width: 1600, height: 1067 },
  "/img/concerts/origins-of-modern-music.webp": { width: 1200, height: 1553 },
  "/img/concerts/rach-fest.jpg": { width: 1440, height: 1799 },
  "/img/concerts/rhythm-and-blues.webp": { width: 635, height: 823 },
  "/img/concerts/saint-saens.png": { width: 745, height: 953 },
  "/img/concerts/shakespeare.jpg": { width: 1728, height: 2304 },
  "/img/concerts/symphonic-fantasia.jpg": { width: 1200, height: 1600 },
  "/img/concerts/tchaik-night.jpg": { width: 1500, height: 1941 },
  "/img/concerts/video-games-anime.webp": { width: 1200, height: 1364 },
  "/img/logo.png": { width: 465, height: 465 },
  "/img/members/bryan.jpg": { width: 571, height: 761 },
  "/img/members/isabella.png": { width: 515, height: 641 },
  "/img/members/sven.jpg": { width: 750, height: 750 },
  "/img/sponsor/audience-feedback.png": { width: 1213, height: 858 },
  "/img/sponsor/ensemble-strip.png": { width: 1610, height: 459 },
  "/img/sponsor/heart-wordcloud.png": { width: 763, height: 654 },
  "/img/team/ethan.webp": { width: 712, height: 1068 },
  "/img/team/jada.jpg": { width: 500, height: 500 },
  "/img/team/nandhini.jpg": { width: 750, height: 1334 },
  "/img/team/peter.jpg": { width: 664, height: 996 },
};

export function getImageDimensions(src: string | undefined): ImageDimensions | undefined {
  return src ? IMAGE_DIMENSIONS[src] : undefined;
}
