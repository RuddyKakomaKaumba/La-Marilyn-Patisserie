/** Courbe de transition d'une section sombre vers la section crème suivante. */
export default function CurveDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 390 40"
      preserveAspectRatio="none"
      className={`absolute inset-x-0 -bottom-px z-0 h-7 w-full text-cream md:h-10 ${className}`}
    >
      <path d="M0 14C92 34 238 36 390 4V40H0Z" fill="currentColor" />
    </svg>
  );
}
