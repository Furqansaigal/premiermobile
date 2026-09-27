import React, { useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { Star, Instagram } from 'lucide-react';
import { REVIEWS_DATA } from '../data/content';

export const Reviews: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [filter, setFilter] = useState<'all' | 'Google' | 'Instagram'>('all');

  const filteredReviews = REVIEWS_DATA.filter(
    (rev) => filter === 'all' || rev.source === filter
  );
  const marqueeReviews = filteredReviews.length > 1 ? [...filteredReviews, ...filteredReviews] : filteredReviews;

  return (
    <section id="reviews" className="py-16 sm:py-20 lg:py-24 bg-surface-alt border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-accent-text font-semibold block">
            CLIENT REVIEWS
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-heading font-normal">
            What Our Customers Say.
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-accent-text">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs font-sans text-text font-bold ml-1">5.0 / 5.0</span>
            </div>
            <span className="text-text-faint hidden sm:inline">•</span>
            <span className="text-xs text-text-secondary font-sans font-medium">
              Google Business Profile Overall Rating
            </span>
          </div>
        </div>

        {/* Source Filter Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`text-[10px] sm:text-xs font-sans uppercase tracking-wide sm:tracking-widest px-3 sm:px-5 py-2.5 transition-all cursor-pointer rounded-xs ${
              filter === 'all'
                ? 'bg-accent text-accent-contrast font-bold shadow-md'
                : 'bg-card border border-border text-text-muted hover:text-heading'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setFilter('Google')}
            className={`text-[10px] sm:text-xs font-sans uppercase tracking-wide sm:tracking-widest px-3 sm:px-5 py-2.5 transition-all cursor-pointer rounded-xs flex items-center gap-1.5 sm:gap-2 ${
              filter === 'Google'
                ? 'bg-accent text-accent-contrast font-bold shadow-md'
                : 'bg-card border border-border text-text-muted hover:text-heading'
            }`}
          >
            <span className="font-bold text-sm">G</span>
            <span>Google Profile</span>
          </button>
          <button
            onClick={() => setFilter('Instagram')}
            className={`text-[10px] sm:text-xs font-sans uppercase tracking-wide sm:tracking-widest px-3 sm:px-5 py-2.5 transition-all cursor-pointer rounded-xs flex items-center gap-1.5 sm:gap-2 ${
              filter === 'Instagram'
                ? 'bg-accent text-accent-contrast font-bold shadow-md'
                : 'bg-card border border-border text-text-muted hover:text-heading'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram Posts</span>
          </button>
        </div>

        {/* Horizontal review marquee */}
        <div ref={ref} tabIndex={0} className="review-marquee -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8" aria-label="Customer reviews">
          {filteredReviews.length > 0 ? (
            <div className="review-marquee__track" style={{ animationPlayState: inView ? undefined : 'paused' }}>
              {marqueeReviews.map((rev, idx) => (
              <article
                aria-hidden={idx >= filteredReviews.length || undefined}
                key={`${rev.id}-${idx}`}
                className="review-marquee__card bg-card border border-border p-5 sm:p-6 rounded-xs flex flex-col hover:border-accent/50 transition-colors shadow-xl shadow-elevated"
              >
                <div className="flex min-h-0 flex-1 flex-col space-y-4">
                  {/* Header line with platform badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-accent-text">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>

                    {rev.source === 'Google' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-sans tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-xs font-medium">
                        <span className="font-bold">G</span>
                        <span>Google Review</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-sans tracking-wider bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded-xs font-medium">
                        <Instagram className="w-3 h-3" />
                        <span>Instagram</span>
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="line-clamp-4 font-serif text-sm sm:text-base text-text leading-relaxed italic font-light">
                    {rev.quote}
                  </p>
                </div>

                {/* Author Footer */}
                <div className="border-t border-border-subtle pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {rev.avatar && (
                      <img
                        loading="lazy"
                        decoding="async"
                        width={36}
                        height={36}
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-9 h-9 rounded-full object-cover border border-border-strong"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-heading text-xs">{rev.name}</span>
                      </div>
                      {rev.handle && (
                        <span className="text-[10px] text-accent-text font-mono block">{rev.handle}</span>
                      )}
                      {rev.vehicle && (
                        <span className="text-[10px] text-text-muted font-light block mt-0.5">{rev.vehicle}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-text-muted font-medium block">{rev.location}</span>
                  </div>
                </div>
              </article>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-10 bg-card border border-border rounded-xs">
              <p className="text-text-muted text-sm font-sans">No reviews under this filter.</p>
            </div>
          )}
        </div>


      </div>
    </section>
  );
};
