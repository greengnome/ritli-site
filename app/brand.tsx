export const APP_STORE_URL =
  'https://apps.apple.com/il/app/ritli-focus-timer/id6809929070';

/** The app icon's mark: a rounded "r" and a small tomato, on its ink tile. */
export function RitliIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 192 192"
      fill="none"
    >
      <rect width="192" height="192" rx="43" fill="#1F1A17" />
      <path
        d="M72 66v62M72 104c0-22 12-36 32-36"
        stroke="#FFF6EC"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <circle cx="130" cy="124" r="15" fill="#E07A5F" />
      <path
        d="M130 110.6c-2.1-4.3-5.9-4.8-8.6-3.2M130 110.6c2.1-4.3 5.9-4.8 8.6-3.2"
        stroke="#6CC790"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Ritli home">
        <RitliIcon />
        <span>ritli</span>
      </a>
      {children}
    </header>
  );
}

export function SiteFooter({ current }: { current?: 'home' | 'privacy' }) {
  return (
    <footer className="site-footer">
      <a className="brand" href="/" aria-label="Ritli home">
        <span>ritli</span>
      </a>
      <nav className="footer-links" aria-label="Footer navigation">
        <a href="/" aria-current={current === 'home' ? 'page' : undefined}>
          Home
        </a>
        <a
          href="/privacy"
          aria-current={current === 'privacy' ? 'page' : undefined}
        >
          Privacy Policy
        </a>
      </nav>
      <small>© {new Date().getFullYear()} Ritli</small>
    </footer>
  );
}
