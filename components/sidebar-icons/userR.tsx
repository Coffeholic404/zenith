export default function UserRounded({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_1684_1926)">
        <circle cx="12" cy="6" r="4" fill="currentColor" />
        <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_1684_1926">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
