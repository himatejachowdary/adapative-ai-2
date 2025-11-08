const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <div className="logo-pulse-glow">
    <svg
      width="100"
      height="100"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
        fill="url(#grad1)"
        fillOpacity="0.1"
      />
      <path
        d="M12 7a.997.997 0 00-.707.293l-2 2a.999.999 0 101.414 1.414L12 9.414l1.293 1.293a.999.999 0 101.414-1.414l-2-2A.997.997 0 0012 7z"
        stroke="url(#grad1)"
        strokeWidth="0.5"
      />
      <path
        d="M12 17a.997.997 0 00.707-.293l2-2a.999.999 0 10-1.414-1.414L12 14.586l-1.293-1.293a.999.999 0 10-1.414 1.414l2 2A.997.997 0 0012 17z"
        stroke="url(#grad1)"
        strokeWidth="0.5"
      />
      <path
        d="M9.293 9.293a.999.999 0 10-1.414 1.414L9.172 12l-1.293 1.293a.999.999 0 101.414 1.414L10.586 12l-1.293-1.293z"
        stroke="url(#grad1)"
        strokeWidth="0.5"
      />
      <path
        d="M14.707 9.293a.999.999 0 00-1.414 1.414L14.586 12l-1.293 1.293a.999.999 0 101.414 1.414L16 12.303l-1.293-1.293z"
        stroke="url(#grad1)"
        strokeWidth="0.5"
      />
      <path
        d="M12 4a1 1 0 00-1 1v1a1 1 0 002 0V5a1 1 0 00-1-1zM12 18a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM6 11H5a1 1 0 000 2h1a1 1 0 000-2zM19 11h-1a1 1 0 000 2h1a1 1 0 000-2z"
        stroke="url(#grad1)"
        strokeWidth="1"
      />
    </svg>
  </div>
);

export default Logo;
