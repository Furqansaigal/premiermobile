import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface LazyVideoProps {
  src: string;
  mobileSrc?: string;
  poster: string;
  className?: string;
  muted?: boolean;
  background?: boolean;
  priority?: boolean;
  label?: string;
  showPlaybackControl?: boolean;
  preloadWhenNear?: 'metadata' | 'auto';
}

/** Attach the source near the viewport; only play while visible, with a poster fallback. */
export const LazyVideo: React.FC<LazyVideoProps> = ({
  src, mobileSrc, poster, className, muted = true, background = false,
  priority = false, label = 'Detailing video', showPlaybackControl = true,
  preloadWhenNear = 'metadata',
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [needsPlay, setNeedsPlay] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let near = false;
    let visible = false;
    let disposed = false;
    let playPending = false;
    let playAttempt = 0;
    // Give the critical text, font and poster a head start over background media.
    let ready = !priority;
    const load = () => {
      if (!video.getAttribute('src')) {
        // Still no request at page load; buffer only this selected video near the viewport.
        video.preload = preloadWhenNear;
        video.src = mobileSrc && window.matchMedia('(max-width: 767px)').matches ? mobileSrc : src;
        video.load();
      }
    };
    const pause = () => {
      playAttempt++;
      playPending = false;
      video.pause();
    };
    const play = () => {
      if (!video.paused || playPending) return;
      const attempt = ++playAttempt;
      playPending = true;
      void video.play().then(() => {
        if (disposed || attempt !== playAttempt) return;
        playPending = false;
        setNeedsPlay(false);
      }).catch((error: DOMException) => {
        if (disposed || attempt !== playAttempt) return;
        playPending = false;
        // A source switch/unmount abort is expected, not a playback failure.
        if (error.name !== 'AbortError') setNeedsPlay(true);
      });
    };
    const sync = () => {
      if (reducedMotion.matches || connection?.saveData || userPaused.current || document.hidden) {
        pause();
        if (!background && (reducedMotion.matches || connection?.saveData)) setNeedsPlay(true);
        return;
      }
      if ((near || visible) && ready) load();
      if (visible && ready) play();
      else pause();
    };
    const nearObserver = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      sync();
    }, { rootMargin: '200px 0px' });
    const visibleObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.05 });
    nearObserver.observe(video);
    visibleObserver.observe(video);
    const timer = priority ? window.setTimeout(() => { ready = true; sync(); }, 1200) : undefined;
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      nearObserver.disconnect();
      visibleObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', sync);
      pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [src, mobileSrc, priority, preloadWhenNear, background]);

  const togglePlayback = () => {
    const video = ref.current;
    if (!video) return;
    userPaused.current = !video.paused;
    if (!video.paused) video.pause();
    else {
      if (!video.getAttribute('src')) {
        video.preload = preloadWhenNear;
        video.src = mobileSrc && window.matchMedia('(max-width: 767px)').matches ? mobileSrc : src;
        video.load();
      }
      if (video.error) video.load();
      void video.play().then(() => setNeedsPlay(false)).catch(() => setNeedsPlay(true));
    }
  };

  return <>
    <video ref={ref} poster={poster} preload="none" loop muted={muted} playsInline
      aria-hidden={background || undefined} aria-label={background ? undefined : label}
      onPlay={() => { setPlaying(true); setNeedsPlay(false); }} onPause={() => setPlaying(false)}
      onError={() => setNeedsPlay(true)} className={className} />
    {(showPlaybackControl || (!background && needsPlay && !playing)) && <button type="button" onClick={togglePlayback}
      aria-label={`${playing ? 'Pause' : 'Play'} ${background ? 'background video' : label}`}
      className={`absolute z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white ${background ? 'bottom-3 right-3' : 'bottom-24 right-4'}`}>
      {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </button>}
  </>;
};
