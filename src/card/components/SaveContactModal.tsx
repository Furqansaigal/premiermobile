import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Share2, Copy, Check, QrCode, Download, ExternalLink } from 'lucide-react';
import { BRAND_CONFIG, generateVCard } from '../data/config';

interface SaveContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackAction?: (action: string) => void;
}

export const SaveContactModal: React.FC<SaveContactModalProps> = ({
  isOpen,
  onClose,
  onTrackAction,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadVCard = () => {
    if (onTrackAction) onTrackAction('downloaded_vcard_contact');
    const vCardData = generateVCard();
    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'PremierMobileAutoDetail.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareLink = async () => {
    const cardUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Premier Mobile Auto Detail',
          text: 'Premier Mobile Auto Detail - Luxury Mobile Detailing in San Antonio, New Braunfels, Austin',
          url: cardUrl,
        });
        if (onTrackAction) onTrackAction('shared_via_native_share');
        return;
      } catch (err) {
        // Fallback to copy
      }
    }

    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    if (onTrackAction) onTrackAction('copied_page_link');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
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
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shadow-elevated-lg text-heading z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent-text">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-heading">Save Digital Business Card</h3>
                <p className="text-xs text-text-muted">Add directly to your phone contacts</p>
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
            {/* Primary VCF Download */}
            <button
              onClick={handleDownloadVCard}
              className="w-full p-4 rounded-2xl bg-accent hover:bg-accent-hover text-accent-contrast font-bold flex items-center justify-between shadow-lg shadow-accent/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-black/15 flex items-center justify-center text-accent-contrast">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent-contrast/80">One-Tap Action</div>
                  <div className="text-sm font-extrabold text-accent-contrast">Save Contact to Phone (.vcf)</div>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-black/15 text-accent-contrast font-bold">
                Save
              </span>
            </button>

            {/* Share / Copy Card Link */}
            <button
              onClick={handleShareLink}
              className="w-full p-3.5 rounded-2xl bg-input border border-border hover:border-border-strong text-heading flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl bg-card flex items-center justify-center text-text-secondary">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-text-muted">Share with Friends / Family</div>
                  <div className="text-xs font-semibold text-heading">Share or Copy Card Link</div>
                </div>
              </div>
              <div>
                {copied ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  <Copy className="w-4 h-4 text-text-muted" />
                )}
              </div>
            </button>

            {/* Contact Details Quick Preview */}
            <div className="p-3.5 rounded-2xl bg-input/60 border border-border text-xs text-text-secondary space-y-1.5">
              <div className="flex justify-between">
                <span className="text-text-faint">Business:</span>
                <span className="font-semibold text-heading">Premier Mobile Auto Detail</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-faint">Direct Phone:</span>
                <span className="text-accent-text font-mono font-medium">{BRAND_CONFIG.phoneDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-faint">Email:</span>
                <span className="text-text-secondary">{BRAND_CONFIG.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-faint">Service Area:</span>
                <span className="text-text-secondary">San Antonio &bull; New Braunfels &bull; Austin</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
