export interface ServicePackage {
  id: string;
  name: string;
  badge?: string;
  priceStart: number;
  duration: string;
  popular?: boolean;
  shortDesc: string;
  features: string[];
  vehiclePricing: {
    sedan: number;
    midSuv: number;
    truckThirdRow: number;
    exotic: number;
  };
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  service: string;
  comment: string;
  location: string;
}

export interface TrackingEvent {
  event: string;
  timestamp: string;
  label?: string;
}
