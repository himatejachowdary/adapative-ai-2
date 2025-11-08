const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 12h4" />
    <path d="M12 6v6" />
    <path d="M12 12L8 8" />
    <path d="M12 12l-4 4" />
    <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
  </svg>
);

export default GoogleIcon;
