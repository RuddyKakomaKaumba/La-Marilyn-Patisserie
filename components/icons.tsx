type IconProps = { className?: string };

export function ArrowRight({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.5 10h13M12 5.5 16.5 10 12 14.5" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.6 20.4 4.9 16.5A8.6 8.6 0 1 1 8 19.3Z" />
      <path d="M9.1 8.2c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .6.6 1.1 1.5 2 2.6 2.6.2.1.4.1.6 0l.6-.6c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.3.3.5v.5c0 .4-.2.7-.6.9-.6.3-1.4.4-2.3.1-2.2-.7-4-2.5-4.8-4.7-.3-.9-.2-1.7.1-2.2Z" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M10 4.5v11M4.5 10h11" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      className={className}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <path d="M14.8 8.2h-1.3c-1.2 0-1.9.7-1.9 1.9v10.4M9.6 12.6h5" />
    </svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 19.5s-7.5-4.4-7.5-9.7A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 2.2c0 5.3-7.5 9.7-7.5 9.7Z" />
    </svg>
  );
}

/** Toque de pâtissier. */
export function ToqueIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7.5 14.5a3.6 3.6 0 0 1-.9-7 4.3 4.3 0 0 1 8.3-1.4 3.6 3.6 0 0 1 1.6 6.9V19.5h-9Z" />
      <path d="M7.5 16.8h9" />
    </svg>
  );
}

/** Poche à douille. */
export function PipingBagIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 4.5h12l-4.6 11.2h-2.8Z" />
      <path d="M10.6 15.7 11.3 18h1.4l.7-2.3M12 20.2v.3" />
      <path d="M8 4.5c.5 1.4 1.8 2.2 4 2.2s3.5-.8 4-2.2" />
    </svg>
  );
}
