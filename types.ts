export interface Photo {
  id: string;
  src: string; // Base64 or URL
  caption: string;
}

export interface Video {
  id: string;
  url: string; // YouTube embed URL
  caption: string;
}

export type MediaItem = Photo | Video;

export interface Trip {
  id: string; // e.g., 'france'
  country: string; // e.g., 'France'
  countryCode: string; // e.g., 'FR'
  continent: string;
  coverImage: string; // Base64 or URL
  quote: string;
  photos: Photo[];
  videos: Video[];
}

export interface HomePageContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];