import type { ElementType, ReactNode } from "react";
import { StaffDivider } from "./StaffDivider";

type Props = {
  children: ReactNode;
  /** HTML element to render — usually "h2" for sections. */
  as?: ElementType;
  className?: string;
};

export function SectionEyebrow({ children, as: Tag = "h2", className }: Props) {
  const classes = ["section-eyebrow", className].filter(Boolean).join(" ");
  return (
    <Tag className={classes}>
      <StaffDivider side="left" />
      <span className="section-eyebrow__text">{children}</span>
      <StaffDivider side="right" />
    </Tag>
  );
}
