import { useDialog } from '../../hooks/useDialog';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShieldCheck, ExternalLink, ThumbsUp, MapPin } from 'lucide-react';
import { BRAND_CONFIG, REVIEWS } from '../data/config';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackAction?: (action: string) => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  isOpen,
  onClose,
  onTrackAction,
}) => {
  const dialogRef = useDialog(isOpen, onClose);
  if (!isOpen) return null;

  const handleOpenGoogle = () => {
    if (onTrackAction) onTrackAction('opened_external_google_reviews');
    window.open(BRAND_CONFIG.googleReviewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Customer reviews"
          tabIndex={-1}
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shadow-elevated-lg text-heading z-10 max-h-[88dvh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent-text">
                <Star className="w-5 h-5 fill-accent-text text-accent-text" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-heading">Google Customer Reviews</h3>
                <p className="text-xs text-text-muted">100% 5-Star Verified Mobile Detailing</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-text-muted hover:text-heading hover:bg-input transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Rating Big Stat */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-input via-input to-card border border-border flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-accent-text text-accent-text" />
                ))}
              </div>
              <div className="text-xs text-text-secondary">
                <strong className="text-heading font-bold">5.0 Star Rating</strong> based on {BRAND_CONFIG.reviewCount}+ Google reviews
              </div>
            </div>
            <button
              onClick={handleOpenGoogle}
              className="px-3.5 py-2 bg-input hover:bg-card text-xs font-semibold text-heading rounded-xl border border-border-strong flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Write Review</span>
              <ExternalLink className="w-3 h-3 text-text-muted" />
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-3 overflow-y-auto pr-1 flex-1 pb-3">
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-2xl bg-input/70 border border-border space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-heading">{review.author}</span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    </div>
                    <div className="text-[11px] text-accent-text font-medium">{review.service}</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-accent-text text-accent-text" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed italic">
                  "{review.comment}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-text-faint pt-1 border-t border-border">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {review.location}
                  </span>
                  <span>{review.date} on Google</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-border">
            <button
              onClick={handleOpenGoogle}
              className="w-full py-3 bg-accent hover:bg-accent-hover text-accent-contrast font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accent/20 cursor-pointer"
            >
              <span>See All {BRAND_CONFIG.reviewCount}+ Google Reviews</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
