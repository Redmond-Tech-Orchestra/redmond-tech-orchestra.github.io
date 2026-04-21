import type { ComponentType } from "react";
import { LuTicket, LuMenu, LuX } from "react-icons/lu";
import { SiInstagram, SiFacebook, SiYoutube, SiTiktok } from "react-icons/si";

type IconProps = { className?: string };

function wrap(Icon: ComponentType<{ size?: number | string }>) {
  return function WrappedIcon({ className }: IconProps) {
    return (
      <span className={"btn-icon " + (className ?? "")} aria-hidden="true">
        <Icon size="100%" />
      </span>
    );
  };
}

// UI icons (Lucide)
export const TicketIcon = wrap(LuTicket);
export const MenuIcon = wrap(LuMenu);
export const CloseIcon = wrap(LuX);

// Brand / social icons (Simple Icons)
export const InstagramIcon = wrap(SiInstagram);
export const FacebookIcon = wrap(SiFacebook);
export const YouTubeIcon = wrap(SiYoutube);
export const TikTokIcon = wrap(SiTiktok);
