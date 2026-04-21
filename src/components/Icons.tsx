// Inline SVG icons from Fluent UI (matching the Figma design).
// Use `currentColor` so they inherit text color of the surrounding button.

type IconProps = { className?: string };

export function TicketIcon({ className }: IconProps) {
  return (
    <span className={"btn-icon " + (className ?? "")} aria-hidden="true">
      <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.6931 1.89758C11.0341 1.23857 9.96563 1.23857 9.3066 1.89758L1.89758 9.3066C1.23857 9.96563 1.23857 11.0341 1.89758 11.6931L2.77623 12.5717C3.15925 12.9548 3.69691 12.8862 4.02178 12.6931C4.16128 12.6101 4.32405 12.5624 4.49969 12.5624C5.01746 12.5624 5.43719 12.9821 5.43719 13.4999C5.43719 13.6755 5.38942 13.8383 5.3065 13.9778C5.11339 14.3027 5.04482 14.8403 5.42784 15.2234L6.30659 16.1021C6.9656 16.7611 8.03408 16.7611 8.6931 16.1021L16.1021 8.6931C16.7611 8.03408 16.7611 6.9656 16.1021 6.30659L15.2234 5.42789C14.8403 5.04482 14.3026 5.11346 13.9777 5.30662C13.8382 5.38958 13.6753 5.43737 13.4997 5.43737C12.9819 5.43737 12.5622 5.01764 12.5622 4.49987C12.5622 4.32419 12.61 4.16138 12.6929 4.02185C12.8861 3.69698 12.9547 3.15925 12.5716 2.77619L11.6931 1.89758Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function DocumentIcon({ className }: IconProps) {
  return (
    <span className={"btn-icon " + (className ?? "")} aria-hidden="true">
      <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 4.25C3 2.45508 4.45508 1 6.25 1H10.7574C11.4205 1 12.0563 1.26339 12.5251 1.73223L15.7678 4.97487C16.2366 5.44371 16.5 6.07953 16.5 6.74264V13.75C16.5 15.5449 15.0449 17 13.25 17H6.25C4.45508 17 3 15.5449 3 13.75V4.25ZM10.5 2.5V5.75C10.5 6.7165 11.2835 7.5 12.25 7.5H15V6.74264L11.25 2.99264V2.5H10.5Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function VideoIcon({ className }: IconProps) {
  return (
    <span className={"btn-icon " + (className ?? "")} aria-hidden="true">
      <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 6.25C2 4.45508 3.45508 3 5.25 3H10.75C12.5449 3 14 4.45508 14 6.25V11.75C14 13.5449 12.5449 15 10.75 15H5.25C3.45508 15 2 13.5449 2 11.75V6.25ZM15 6.7547L17.0146 5.20457C17.5079 4.82494 18.2188 5.17676 18.2188 5.79956V12.2002C18.2188 12.823 17.5079 13.1748 17.0146 12.7951L15 11.245V6.7547Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
