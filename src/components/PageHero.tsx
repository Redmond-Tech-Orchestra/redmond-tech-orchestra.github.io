type Props = {
  title: string;
  subtitle?: string;
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
