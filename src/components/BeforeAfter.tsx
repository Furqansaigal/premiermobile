import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BEFORE_AFTER_DATA } from '../data/content';
import { MoveHorizontal, Pause, Play } from 'lucide-react';

export const BeforeAfter: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoDirection = useRef(1);

  const currentComparison = BEFORE_AFTER_DATA[activeTab];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stopForReducedMotion = () => {
      if (mediaQuery.matches) setIsAutoPlaying(false);
    };

    stopForReducedMotion();
    mediaQuery.addEventListener('change', stopForReducedMotion);
    return () => mediaQuery.removeEventListener('change', stopForReducedMotion);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    let frameId = 0;
    let lastTime: number | undefined;

    const animate = (time: number) => {
      if (lastTime !== undefined) {
        const elapsed = Math.min((time - lastTime) / 1000, 0.08);
        setSliderPosition((position) => {
          let nextPosition = position + autoDirection.current * elapsed * 15;
          if (nextPosition >= 88) {
            nextPosition = 88;
            autoDirection.current = -1;
          } else if (nextPosition <= 12) {
            nextPosition = 12;
            autoDirection.current = 1;
          }
          return nextPosition;
        });
      }
      lastTime = time;
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [isAutoPlaying]);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsAutoPlaying(false);
    isDragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    handleMove(event.clientX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  return (
    <section id="results" className="py-14 sm:py-16 lg:py-20 bg-surface border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-accent-text font-semibold block">
            THE DIFFERENCE
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-heading font-normal">
            Before. And after.
          </h2>
          <p className="text-text-muted font-sans font-light text-sm sm:text-base">
            These aren't stock photos. Every result below happened in a customer's driveway.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-8 sm:mb-10">
          {BEFORE_AFTER_DATA.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(idx);
                setSliderPosition(50);
              }}
              className={`text-xs font-sans uppercase tracking-widest px-4 sm:px-5 py-2.5 transition-all cursor-pointer rounded-xs ${
                activeTab === idx
                  ? 'bg-accent text-accent-contrast font-bold shadow-md'
                  : 'bg-card border border-border text-text-muted hover:text-heading'
              }`}
            >
              {item.tag}
            </button>
          ))}
        </div>

        {/* Interactive Image Comparison Slider Container */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-12">
          <div
            ref={containerRef}
            role="slider"
            aria-label="Before and after image comparison"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(sliderPosition)}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') {
                setIsAutoPlaying(false);
                setSliderPosition((value) => Math.max(0, value - 5));
              }
              if (event.key === 'ArrowRight') {
                setIsAutoPlaying(false);
                setSliderPosition((value) => Math.min(100, value + 5));
              }
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerMove={handlePointerMove}
            className="relative aspect-[4/5] sm:aspect-[3/4] md:aspect-[16/10] overflow-hidden rounded-xs border border-border shadow-2xl shadow-elevated-lg select-none cursor-ew-resize bg-black touch-pan-y"
          >
            {/* After Image (Full width background) */}
            <img
              src={currentComparison.afterImage}
              alt={`After: ${currentComparison.title} — mobile auto detailing in San Antonio, TX by Premier Mobile Auto Detail`}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            />
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-emerald-500/30 text-emerald-400 text-[11px] font-sans uppercase tracking-widest font-semibold rounded-xs pointer-events-none z-10">
              AFTER
            </div>

            {/* Before Image (Clipped overlay) */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={currentComparison.beforeImage}
                alt={`Before: ${currentComparison.title} — mobile auto detailing in San Antonio, TX by Premier Mobile Auto Detail`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-neutral-700 text-neutral-300 text-[11px] font-sans uppercase tracking-widest font-semibold rounded-xs z-10">
                BEFORE
              </div>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute inset-y-0 z-20 w-0.5 bg-accent cursor-ew-resize shadow-[0_0_15px_rgba(216,195,165,0.8)]"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Handle */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-card border-2 border-accent text-accent-text flex items-center justify-center shadow-2xl">
                <MoveHorizontal className="w-5 h-5" />
              </div>
            </div>
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setIsAutoPlaying((playing) => !playing);
              }}
              className="absolute bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-xs border border-white/25 bg-black/75 px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
              aria-pressed={isAutoPlaying}
              aria-label={isAutoPlaying ? 'Pause automatic comparison' : 'Start automatic comparison'}
            >
              {isAutoPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isAutoPlaying ? 'Pause auto' : 'Start auto'}
            </button>
          </div>

          <p className="text-center text-xs text-text-faint font-sans mt-3">
            ← Drag slider horizontally to compare before & after →
          </p>

          {/* Active Comparison Caption */}
          <div className="mt-5 p-4 sm:p-5 bg-card border border-border rounded-xs text-center space-y-1.5 max-w-3xl mx-auto shadow-elevated">
            <h3 className="text-base sm:text-lg font-serif text-heading font-medium">
              {currentComparison.title}
            </h3>
            <p className="text-xs sm:text-sm text-text-muted font-sans leading-relaxed">
              {currentComparison.subtitle}
            </p>
          </div>
        </div>

        {/* 3 Detail Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto text-left">
          <div className="bg-card border border-border p-5 rounded-xs space-y-2 shadow-elevated">
            <div className="text-accent-text text-xs font-semibold flex items-center gap-2">
              <span>◆</span>
              <span>PAINT CORRECTION</span>
            </div>
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              Oxidized single-stage paint restored to full mirror gloss.
            </p>
          </div>

          <div className="bg-card border border-border p-5 rounded-xs space-y-2 shadow-elevated">
            <div className="text-accent-text text-xs font-semibold flex items-center gap-2">
              <span>◆</span>
              <span>STAIN EXTRACTION</span>
            </div>
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              10 years of pet hair and deep set stains removed from cloth seats.
            </p>
          </div>

          <div className="bg-card border border-border p-5 rounded-xs space-y-2 shadow-elevated">
            <div className="text-accent-text text-xs font-semibold flex items-center gap-2">
              <span>◆</span>
              <span>CLARITY RESTORATION</span>
            </div>
            <p className="text-xs text-text-secondary font-sans leading-relaxed">
              Cloudy yellow headlights returned to factory transparency in 45 minutes.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
