import { useEffect, useRef } from 'react';

/** Keep keyboard focus inside an open dialog and restore its trigger on close. */
export function useDialog(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const dialog = dialogRef.current as HTMLDivElement;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
    )).filter((element) => element.getClientRects().length > 0);
    dialog.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const containFocus = (event: FocusEvent) => {
      if (!dialog.contains(event.target as Node)) dialog.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', containFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', containFocus);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen]);
  return dialogRef;
}
