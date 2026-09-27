// Google Analytics 4 (GA4) helper for tracking /card QR code visits & CTA events

export const GA_MEASUREMENT_ID: string =
  ((import.meta as any).env?.VITE_GA_MEASUREMENT_ID as string) || 'G-B2J2MZZ9HD';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Initialize GA4 script tag dynamically if valid measurement ID or placeholder
export function initGA4() {
  if (typeof window === 'undefined' || !import.meta.env.PROD) return;

  if (!window.dataLayer) {
    window.dataLayer = window.dataLayer || [];
  }

  function gtag(...args: any[]) {
    window.dataLayer?.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: '/card',
    page_title: 'Premier Mobile Auto Detail | QR Business Card Hub',
    campaign_source: 'qr_business_card',
    campaign_medium: 'card_scan',
    campaign_name: 'direct_business_cards',
  });

  // Inject script tag if not already present
  if (!document.getElementById('ga4-script') && GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }
}

// Send custom event to GA4 and console in development
export function trackGAEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      page_path: '/card',
      qr_source: 'business_card',
      ...params,
    });
  }
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[GA4 Event - /card]: ${eventName}`, params);
  }
}
