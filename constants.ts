import { Trip, HomePageContent } from './types';

export const INITIAL_HOME_CONTENT: HomePageContent = {
  title: "Our Shared Journey",
  subtitle: "A collection of memories from the places we've explored.",
  backgroundImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
};


export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'japan',
    country: 'Japan',
    countryCode: 'JP',
    continent: 'Asia',
    coverImage: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2070&auto=format&fit=crop',
    quote: 'The Land of the Rising Sun opened our eyes to a world of harmony and innovation.',
    photos: [
      { id: 'jp-photo-1', src: 'https://images.unsplash.com/photo-1503891450247-ee5f8ec46dc3?q=80&w=1887&auto=format&fit=crop', caption: 'Shibuya Crossing bustle' },
      { id: 'jp-photo-2', src: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=2036&auto=format&fit=crop', caption: 'Fushimi Inari Shrine' },
    ],
    videos: [
      { id: 'jp-video-1', url: 'https://www.youtube.com/embed/1_44544484', caption: 'Tokyo street food tour' }
    ],
  },
    {
    id: 'italy',
    country: 'Italy',
    countryCode: 'IT',
    continent: 'Europe',
    coverImage: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?q=80&w=1974&auto=format&fit=crop',
    quote: 'Lost in the art, history, and flavors of a timeless country.',
    photos: [
      { id: 'it-photo-1', src: 'https://images.unsplash.com/photo-1529153510182-277c1df9037b?q=80&w=1887&auto=format&fit=crop', caption: 'Colosseum at sunset' },
    ],
    videos: [],
  },
];