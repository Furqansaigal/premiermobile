import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LazyVideo } from './LazyVideo';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Sparkles, Volume2, VolumeX } from 'lucide-react';

import showcase1 from '../assets/videos/showcase-1.mp4';
import showcase2 from '../assets/videos/showcase-2.mp4';
import showcase3 from '../assets/videos/showcase-3.mp4';
import showcase4 from '../assets/videos/showcase-4.mp4';
import showcase5 from '../assets/videos/showcase-5.mp4';
import showcase6 from '../assets/videos/showcase-6.mp4';
import showcase7 from '../assets/videos/showcase-7.mp4';
import mobile1 from '../assets/videos/optimized/showcase-1-mobile.mp4';
import mobile2 from '../assets/videos/optimized/showcase-2-mobile.mp4';
import mobile3 from '../assets/videos/optimized/showcase-3-mobile.mp4';
import mobile4 from '../assets/videos/optimized/showcase-4-mobile.mp4';
import mobile5 from '../assets/videos/optimized/showcase-5-mobile.mp4';
import mobile6 from '../assets/videos/optimized/showcase-6-mobile.mp4';
import mobile7 from '../assets/videos/optimized/showcase-7-mobile.mp4';
import poster1 from '../assets/videos/optimized/showcase-1-poster.jpg';
import poster2 from '../assets/videos/optimized/showcase-2-poster.jpg';
import poster3 from '../assets/videos/optimized/showcase-3-poster.jpg';
import poster4 from '../assets/videos/optimized/showcase-4-poster.jpg';
import poster5 from '../assets/videos/optimized/showcase-5-poster.jpg';
import poster6 from '../assets/videos/optimized/showcase-6-poster.jpg';
import poster7 from '../assets/videos/optimized/showcase-7-poster.jpg';

interface VideoReelProps {
  onOpenBooking: (packageId?: string) => void;
}

interface ShowcaseVideo {
  id: string;
  title: string;
  badge: string;
  videoUrl: string;
  mobileUrl: string;
  poster: string;
}

const SHOWCASE_VIDEOS: ShowcaseVideo[] = [
  { id: 'showcase-1', title: 'Premium Mobile Detail', badge: 'ON-SITE PROCESS', videoUrl: showcase1, mobileUrl: mobile1, poster: poster1 },
  { id: 'showcase-2', title: 'Interior Refresh', badge: 'INTERIOR CARE', videoUrl: showcase2, mobileUrl: mobile2, poster: poster2 },
  { id: 'showcase-3', title: 'Precision Exterior Care', badge: 'DETAIL IN MOTION', videoUrl: showcase3, mobileUrl: mobile3, poster: poster3 },
  { id: 'showcase-4', title: 'Showroom-Ready Finish', badge: 'FINAL RESULT', videoUrl: showcase4, mobileUrl: mobile4, poster: poster4 },
  { id: 'showcase-5', title: 'Mobile Detail Service', badge: 'ON-SITE SERVICE', videoUrl: showcase5, mobileUrl: mobile5, poster: poster5 },
  { id: 'showcase-6', title: 'Care in Every Detail', badge: 'PREMIUM CARE', videoUrl: showcase6, mobileUrl: mobile6, poster: poster6 },
  { id: 'showcase-7', title: 'Fresh, Clean Finish', badge: 'DETAILING RESULTS', videoUrl: showcase7, mobileUrl: mobile7, poster: poster7 },
];

export const VideoReels: React.FC<VideoReelProps> = ({ onOpenBooking }) => {
  // Default opening frame: black truck preview, blue-canopy detail in the center, Camry preview.
  const [activeIndex, setActiveIndex] = useState(4);
  const [isMuted, setIsMuted] = useState(true);

  const previousIndex = (activeIndex - 1 + SHOWCASE_VIDEOS.length) % SHOWCASE_VIDEOS.length;
  const nextIndex = (activeIndex + 1) % SHOWCASE_VIDEOS.length;
  const activeVideo = SHOWCASE_VIDEOS[activeIndex];
  const previousVideo = SHOWCASE_VIDEOS[previousIndex];
  const nextVideo = SHOWCASE_VIDEOS[nextIndex];

  return (
    <section className="relative overflow-hidden bg-surface-alt py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl space-y-4 text-center sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-input px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-accent-text">
            <Sparkles className="h-3 w-3 fill-current" />
            <span>See us at work</span>
          </div>
          <h2 className="font-serif text-4xl font-normal leading-tight text-heading sm:text-5xl lg:text-6xl">Detailing in Motion</h2>
          <p className="mx-auto max-w-2xl font-sans text-base font-light leading-relaxed text-text-secondary sm:text-lg">
            Real Premier Mobile work, brought right to your driveway. Browse the videos using the arrows.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-4 sm:gap-6 lg:grid-cols-3">
            <button
              type="button"
              onClick={() => setActiveIndex(previousIndex)}
              className="group hidden aspect-[4/5] overflow-hidden rounded-xs border border-border bg-card text-left shadow-elevated transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent/60 lg:block"
              aria-label={`Show previous video: ${previousVideo.title}`}
            >
              <div className="relative h-full w-full overflow-hidden bg-black">
                <img src={previousVideo.poster} alt="" loading="lazy" decoding="async" width={720} height={1280} className="h-full w-full object-cover opacity-55 transition-opacity duration-300 group-hover:opacity-75" />
                <div className="absolute inset-0 bg-black/25" />
                <span className="absolute bottom-4 left-4 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/90">Previous</span>
              </div>
            </button>

            <div className="relative mx-auto w-full max-w-md min-w-0 lg:max-w-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVideo.id}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="aspect-[4/5] overflow-hidden rounded-xs border border-accent/50 bg-card shadow-elevated-lg"
                >
                  <div className="relative h-full w-full overflow-hidden bg-black">
                    <LazyVideo key={activeVideo.id} src={activeVideo.videoUrl} mobileSrc={activeVideo.mobileUrl} poster={activeVideo.poster} muted={isMuted} label={activeVideo.title} className="h-full w-full object-cover" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35" />

                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                      <span className="rounded-xs border border-accent/40 bg-black/70 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-accent backdrop-blur-md">{activeVideo.badge}</span>
                      <button
                        type="button"
                        onClick={() => setIsMuted((value) => !value)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white backdrop-blur-md transition-colors hover:text-accent"
                        aria-label={isMuted ? 'Unmute active video' : 'Mute active video'}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <div className="mb-1.5 flex items-center gap-1.5 font-sans text-[11px] font-medium text-accent">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>Premier Mobile · Central Texas</span>
                      </div>
                      <h3 className="font-serif text-2xl leading-tight sm:text-3xl">{activeVideo.title}</h3>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button type="button" onClick={() => setActiveIndex(previousIndex)} className="absolute left-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white backdrop-blur-md transition-colors hover:bg-accent hover:text-accent-contrast sm:h-11 sm:w-11 lg:-left-5" aria-label="Show previous video">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => setActiveIndex(nextIndex)} className="absolute right-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white backdrop-blur-md transition-colors hover:bg-accent hover:text-accent-contrast sm:h-11 sm:w-11 lg:-right-5" aria-label="Show next video">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveIndex(nextIndex)}
              className="group hidden aspect-[4/5] overflow-hidden rounded-xs border border-border bg-card text-left shadow-elevated transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent/60 lg:block"
              aria-label={`Show next video: ${nextVideo.title}`}
            >
              <div className="relative h-full w-full overflow-hidden bg-black">
                <img src={nextVideo.poster} alt="" loading="lazy" decoding="async" width={720} height={1280} className="h-full w-full object-cover opacity-55 transition-opacity duration-300 group-hover:opacity-75" />
                <div className="absolute inset-0 bg-black/25" />
                <span className="absolute bottom-4 right-4 font-sans text-[10px] font-semibold uppercase tracking-widest text-white/90">Next</span>
              </div>
            </button>
          </div>

          <div className="mt-6 text-center">
            <button type="button" onClick={() => onOpenBooking('prestige')} className="inline-flex items-center justify-center gap-2 rounded-xs bg-accent px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-widest text-accent-contrast transition-colors hover:bg-accent-hover">
              <Calendar className="h-4 w-4" />
              Request an Estimate
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
