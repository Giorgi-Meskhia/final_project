export interface UnsplashPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  downloads?: number;
  likes: number;
  liked_by_user: boolean;
  description: string | null;
  alt_description: string | null;
  urls: UnsplashUrls;
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  user: UnsplashUser;
}

export interface UnsplashUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

export interface UnsplashUser {
  id: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string | null;
  portfolio_url: string | null;
  bio: string | null;
  location: string | null;
  total_likes: number;
  total_photos: number;
  total_collections: number;
  profile_image: {
    small: string;
    medium: string;
    large: string;
  };
  links: {
    self: string;
    html: string;
    photos: string;
    likes: string;
    portfolio: string;
  };
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

