import { ServicePackage, ReviewItem } from '../types';

export const BRAND_CONFIG = {
  name: 'Premier Mobile',
  fullName: 'Premier Mobile Auto Detail',
  tagline: 'Professional Auto Detail',
  coverageAreas: ['San Antonio', 'New Braunfels', 'Austin'],
  phoneDisplay: '(210) 580-6738',
  phoneRaw: '+12105806738',
  smsMessage: 'Hi Premier Mobile! I scanned your business card and would like to get a quote/book detailing for my vehicle.',
  email: 'premier@premiermobiletexas.com',
  websiteUrl: 'https://premiermobiletexas.com/',
  bookingUrl: 'https://premiermobiletexas.com/?utm_source=qr_business_card&utm_medium=card_scan&utm_campaign=card_direct#reserve',
  googleReviewUrl: 'https://share.google/Pcyl4FS6omabveKxx',
  rating: 5.0,
  reviewCount: 7,
  socials: {
    instagram: {
      url: 'https://instagram.com/premiermobile.tx',
      handle: '@premiermobile.tx',
    },
    facebook: {
      url: 'https://www.facebook.com/profile.php?id=61592722244241',
      handle: 'Premier Mobile Auto Detail',
    },
    tiktok: {
      url: 'https://www.tiktok.com/@premiermobile.tx?_r=1&_t=ZP-98zn0xiNXpP',
      handle: '@premiermobile.tx',
    },
  },
  operatingHours: 'Mon - Sun: 7:00 AM - 8:00 PM',
  statusBadge: 'Accepting Appointments',
};

export const SERVICES: ServicePackage[] = [
  {
    id: 'refresh',
    name: 'The Refresh',
    badge: 'ESSENTIAL CARE',
    popular: false,
    priceStart: 129,
    duration: '2-3 hrs',
    shortDesc: 'Essential exterior wash & interior cabin vacuum.',
    vehiclePricing: {
      sedan: 129,
      midSuv: 139,
      truckThirdRow: 149,
      exotic: 180,
    },
    features: [
      'Two-bucket hand wash & scratch-free dry',
      'Wheel, tire & trim dressing',
      'Full cabin, trunk & floor mat vacuum',
      'Streak-free interior & exterior glass polish',
    ],
  },
  {
    id: 'prestige',
    name: 'The Prestige',
    badge: 'MOST BOOKED',
    popular: true,
    priceStart: 249,
    duration: '4-5 hrs',
    shortDesc: 'Total interior steam reset & single-stage machine gloss polish.',
    vehiclePricing: {
      sedan: 249,
      midSuv: 279,
      truckThirdRow: 289,
      exotic: 299,
    },
    features: [
      'Everything in The Refresh',
      'Clay bar paint decontamination',
      'Single-stage machine gloss polish',
      'Hot steam carpet & seat stain extraction',
      'Leather deep clean & condition',
    ],
  },
  {
    id: 'concours',
    name: 'The Concours',
    badge: 'ELITE PROTECTION',
    popular: false,
    priceStart: 699,
    duration: '5-24 hrs',
    shortDesc: '9H nano-ceramic coating with multi-stage paint correction.',
    vehiclePricing: {
      sedan: 699,
      midSuv: 729,
      truckThirdRow: 739,
      exotic: 749,
    },
    features: [
      'Everything in The Prestige',
      'Multi-stage paint correction',
      '9H nano-ceramic coating, multi-year warranty',
      'Full engine bay steam & dressing',
    ],
  },
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Kasey Rodriguez',
    rating: 5,
    date: 'a year ago',
    service: 'Detailing',
    location: 'Google Review',
    comment: 'I have never been so impressed! When he started it was hot and sunny. When it started raining I said no worries we can finish another time. His exact words were...',
  },
  {
    id: 'rev-2',
    author: 'Nadia Bailey',
    rating: 5,
    date: '2 weeks ago',
    service: 'Detailing',
    location: 'Google Review',
    comment: 'Very professional and gets the job done! Great customer service and communication!!',
  },
  {
    id: 'rev-3',
    author: 'Jazzalina Jazzo',
    rating: 5,
    date: 'an hour ago',
    service: 'Detailing',
    location: 'Google Review',
    comment: 'If you\u2019re looking for someone to detail your car call Premier Mobile Texas. I just had my 2022 Mercedes Benz GLC 300 done by them and I could not be more...',
  },
  {
    id: 'rev-4',
    author: 'Michael Reyna',
    rating: 5,
    date: '3 days ago',
    service: 'Detailing',
    location: 'Google Review',
    comment: 'Did an amazing job on my vehicle!!! Thank you.',
  },
  {
    id: 'rev-5',
    author: 'Hannah Banana',
    rating: 5,
    date: '4 days ago',
    service: 'Detailing',
    location: 'Google Review',
    comment: 'My car looks brand new!! Great, reliable and professional!! Very affordable!!',
  },
  {
    id: 'rev-6',
    author: 'Nikolas Waldenmaier',
    rating: 5,
    date: '6 days ago',
    service: 'Detailing',
    location: 'Google Review',
    comment: 'They did absolutely exceptional work. Communication was top tier throughout the entire process! They turned my truck into an entirely new truck and even earned...',
  },
  {
    id: 'rev-7',
    author: 'Mary Perez',
    rating: 5,
    date: 'a week ago',
    service: 'Ceramic Coating',
    location: 'Google Review',
    comment: 'Thank you to the guys with Premier Mobile Details. My Challenger looks like it just came off the showroom at the car dealer. They did an excellent job, the car is so smooth after the ceramic coating. The shine is blinding. I highly recommend this company.',
  },
];

export function generateVCard(): string {
  return `BEGIN:VCARD
VERSION:3.0
N:Auto Detail;Premier Mobile;;;
FN:Premier Mobile Auto Detail
ORG:Premier Mobile Texas
TITLE:Professional Auto Detailing & Ceramic Coatings
TEL;TYPE=CELL,VOICE:${BRAND_CONFIG.phoneRaw}
EMAIL;TYPE=WORK:${BRAND_CONFIG.email}
URL:${BRAND_CONFIG.websiteUrl}
NOTE:Mobile Auto Detailing in San Antonio, New Braunfels, Austin. Book online: ${BRAND_CONFIG.websiteUrl}card
END:VCARD`;
}
