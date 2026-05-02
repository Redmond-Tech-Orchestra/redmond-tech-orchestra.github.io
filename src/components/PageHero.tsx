import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: ReactNode;
  backgroundImage?: string;
};

export default function PageHero({ title, subtitle, backgroundImage }: Props) {
  const style = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : undefined;
  return (
    <section
      className={"page-hero" + (backgroundImage ? " page-hero--image" : "")}
      style={style}
    >
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}
