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
}

/** Attach the source near the viewport; only play while visible, with a poster fallback. */
export const LazyVideo: React.FC<LazyVideoProps> = ({
  src, mobileSrc, poster, className, muted = true, background = false,
  priority = false, label = 'Detailing video',
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let near = false;
    let visible = false;
    // Give the critical text, font and poster a head start over background media.
    let ready = !priority;
    const load = () => {
      if (!video.getAttribute('src')) {
        video.src = mobileSrc && window.matchMedia('(max-width: 767px)').matches ? mobileSrc : src;
        video.load();
      }
    };
    const sync = () => {
      if (reducedMotion.matches || connection?.saveData || userPaused.current || document.hidden) {
        video.pause();
        return;
      }
      if (near && ready) load();
      if (visible && ready) void video.play().catch(() => setPlaying(false));
      else video.pause();
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
      window.clearTimeout(timer);
      nearObserver.disconnect();
      visibleObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', sync);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [src, mobileSrc, priority]);

  const togglePlayback = () => {
    const video = ref.current;
    if (!video) return;
    userPaused.current = !video.paused;
    if (!video.paused) video.pause();
    else {
      if (!video.getAttribute('src')) {
        video.src = mobileSrc && window.matchMedia('(max-width: 767px)').matches ? mobileSrc : src;
        video.load();
      }
      void video.play().catch(() => setPlaying(false));
    }
  };

  return <>
    <video ref={ref} poster={poster} preload="none" loop muted={muted} playsInline
      aria-hidden={background || undefined} aria-label={background ? undefined : label}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} className={className} />
    <button type="button" onClick={togglePlayback}
      aria-label={`${playing ? 'Pause' : 'Play'} ${background ? 'background video' : label}`}
      className={`absolute z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white ${background ? 'bottom-3 right-3' : 'bottom-24 right-4'}`}>
      {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </button>
  </>;
};
