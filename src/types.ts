export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  estimatedTime: string;
  startingPrice: number;
  popular?: boolean;
}

export interface PackageItem {
  id: string;
  category: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  duration: string;
  badge?: string;
  features: string[];
  isMostBooked?: boolean;
}

export interface ReviewItem {
  id: string;
  rating: number;
  quote: string;
  name: string;
  location: string;
  vehicle?: string;
  date?: string;
  source?: 'Google' | 'Instagram';
  handle?: string;
  avatar?: string;
  verified?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceAreaMetro {
  name: string;
  subtitle: string;
  neighborhoods: string[];
  zipCodes: string[];
}

export interface BeforeAfterComparison {
  id: string;
  title: string;
  subtitle: string;
  beforeImage: string;
  afterImage: string;
  tag: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  vehicleYearMakeModel: string;
  serviceId: string;
  locationMetro: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}
