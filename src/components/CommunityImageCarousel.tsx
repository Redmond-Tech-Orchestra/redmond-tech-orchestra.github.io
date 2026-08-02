import { useEffect, useState } from "react";

type CarouselPhoto = {
  src: string;
  alt: string;
};

type Props = {
  photos: CarouselPhoto[];
  delayMs?: number;
};

const DEFAULT_DELAY_MS = 4000;

function getPosition(index: number, activeIndex: number, total: number) {
  if (index === activeIndex) return "focal";
  if (index === (activeIndex + 1) % total) return "right";
  if (index === (activeIndex - 1 + total) % total) return "left";
  return "hidden";
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);

    const handleChange = () => setPrefersReducedMotion(query.matches);
    if (query.addEventListener) {
      query.addEventListener("change", handleChange);
      return () => query.removeEventListener("change", handleChange);
    }

    query.addListener(handleChange);
    return () => query.removeListener(handleChange);
  }, []);

  return prefersReducedMotion;
}

export default function CommunityImageCarousel({
  photos,
  delayMs = DEFAULT_DELAY_MS,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const normalizedDelay = Math.max(delayMs, 1000);

  useEffect(() => {
    if (photos.length < 2 || prefersReducedMotion) return;

    const rotation = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % photos.length);
    }, normalizedDelay);

    return () => window.clearInterval(rotation);
  }, [normalizedDelay, photos.length, prefersReducedMotion]);

  if (photos.length === 0) return null;

  return (
    <div
      className="community-carousel"
      role="group"
      aria-label="Community performance photos"
    >
      {photos.map((photo, index) => {
        const position = getPosition(index, activeIndex, photos.length);

        return (
          <div
            key={photo.src}
            className={`community-carousel__slide community-carousel__slide--${position}`}
            aria-hidden={position === "hidden"}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading={position === "hidden" ? "lazy" : "eager"}
              decoding="async"
            />
          </div>
        );
      })}
    </div>
  );
}
