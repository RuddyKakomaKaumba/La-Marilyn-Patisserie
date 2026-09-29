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
