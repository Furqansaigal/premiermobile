import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/** Decorative only: never delay navigation, capture input, or remount page content. */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(pathname);
  const [transition, setTransition] = useState<string | null>(null);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    setTransition(null);
    // New pages start at the top; section anchors and history navigation stay untouched.
    if (navigationType !== 'POP' && !hash) window.scrollTo({ top: 0, behavior: 'instant' });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setTransition(pathname);
  }, [pathname, hash, navigationType]);

  useEffect(() => {
    if (transition === null) return;
    const timer = window.setTimeout(() => setTransition(null), 950);
    return () => window.clearTimeout(timer);
  }, [transition]);

  const active = transition === pathname;
  const tone = pathname === '/' ? 'home' : pathname.replace(/\/$/, '') === '/card' ? 'card' : 'other';

  return (
    <div className="page-shell" data-page-tone={tone}>
      <div className={active ? 'page-content page-content--entering' : 'page-content'}>
        {children}
      </div>
      {active && <div key={pathname} className="page-shine" aria-hidden="true"><div className="page-shine__reflection" /></div>}
    </div>
  );
}
