import { useDialog } from '../../hooks/useDialog';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, MessageSquare, Copy, Check, Clock, MapPin, Send } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

interface ContactActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackAction?: (action: string) => void;
}

export const ContactActionSheet: React.FC<ContactActionSheetProps> = ({
  isOpen,
  onClose,
  onTrackAction,
}) => {
  const [copied, setCopied] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [copyError, setCopyError] = useState('');

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(BRAND_CONFIG.phoneDisplay);
      setCopyError('');
    } catch {
      setCopyError(`Please copy this number: ${BRAND_CONFIG.phoneDisplay}`);
      return;
    }
    setCopied(true);
    if (onTrackAction) onTrackAction('copied_phone_number');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCall = () => {
    if (onTrackAction) onTrackAction('tapped_call_phone');
    window.location.href = `tel:${BRAND_CONFIG.phoneRaw}`;
  };

  const handleText = (customText?: string) => {
    if (onTrackAction) onTrackAction('tapped_sms_text');
    const msg = customText || BRAND_CONFIG.smsMessage;
    window.location.href = `sms:${BRAND_CONFIG.phoneRaw}?&body=${encodeURIComponent(msg)}`;
  };

  const dialogRef = useDialog(isOpen, onClose);
  if (!isOpen) return null;

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

        {/* Action Sheet Card */}
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Call or text Premier Mobile"
          tabIndex={-1}
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="max-h-[92dvh] overflow-y-auto overscroll-contain relative w-full max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shadow-elevated-lg text-heading z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent-text">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-heading">Call or Text Premier Mobile</h3>
                <p className="text-xs text-text-muted">Direct response from our detailing team</p>
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

          <div className="space-y-3">
            {/* Direct Call Button */}
            <button
              onClick={handleCall}
              className="w-full p-4 rounded-2xl bg-input border border-border hover:border-accent/60 flex items-center justify-between group transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-text-muted">Tap to Call Direct</div>
                  <div className="text-base font-bold text-heading">{BRAND_CONFIG.phoneDisplay}</div>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                Call Now
              </span>
            </button>

            {/* Direct Text Message Button */}
            <button
              onClick={() => handleText()}
              className="w-full p-4 rounded-2xl bg-input border border-border hover:border-accent/60 flex items-center justify-between group transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-text-muted">Send Direct SMS Text</div>
                  <div className="text-sm font-semibold text-heading">Get Quick Quote & Schedule</div>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300">
                Text Us
              </span>
            </button>

            {/* Quick SMS composer box */}
            <div className="p-3.5 rounded-2xl bg-input/60 border border-border space-y-2">
              <label htmlFor="quick-text-message" className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                Quick Text Message:
              </label>
              <div className="flex gap-2">
                <input
                  id="quick-text-message"
                  type="text"
                  placeholder="e.g. Need detail for truck in San Antonio..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="min-w-0 flex-1 px-3 py-2 bg-input border border-border-strong rounded-xl text-xs text-heading placeholder-text-faint focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => handleText(customMsg || undefined)}
                  className="px-3 py-2 bg-accent text-accent-contrast rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-accent-hover cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>

            {/* Copy phone number button */}
            <button
              onClick={handleCopyPhone}
              className="w-full py-2.5 px-4 bg-input border border-border rounded-xl text-xs text-text-secondary hover:text-heading flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Phone number copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-text-muted" />
                  <span>Copy phone number ({BRAND_CONFIG.phoneDisplay})</span>
                </>
              )}
            </button>

            {copyError && <p role="status" className="text-xs text-text-secondary">{copyError}</p>}
            {/* Operating info */}
            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-muted px-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-accent-text" /> {BRAND_CONFIG.operatingHours}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-accent-text" /> SA &bull; NB &bull; ATX
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
