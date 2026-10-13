// Shared domain types for the otakudesu.blog scraper responses.

export interface GenreRef {
  genre_id: string;
  genre_name: string;
  genre_link: string;
}

export interface AnimeListItem {
  id: string;
  title: string;
  thumb: string | undefined;
  link: string;
  episode: string;
  uploaded_on: string;
  day_updated?: string;
  score?: number;
}

export interface ScheduleAnimeItem {
  id: string;
  anime_name: string;
  link: string;
}

export interface ScheduleDay {
  day: string;
  anime_list: ScheduleAnimeItem[];
}

export interface GenreListItem {
  id: string;
  genre_name: string;
  link: string;
  image_link: string;
}

export interface AnimeByGenreItem {
  id: string;
  anime_name: string;
  thumb: string | undefined;
  link: string;
  studio: string;
  episode: string;
  score: number;
  release_date: string;
  genre_list: GenreRef[];
}

export interface SearchGenreRef {
  genre_id: string;
  genre_title: string;
  genre_link: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  thumb: string | undefined;
  link: string;
  status: string;
  score: number;
  genre_list: SearchGenreRef[];
}

export interface EpisodeListItem {
  id: string;
  title: string;
  link: string | undefined;
  uploaded_on: string;
}

export interface BatchLink {
  id: string | null;
  link: string | null;
}

export interface AnimeDetail {
  anime_id: string;
  thumb: string | undefined;
  synopsis: string;
  title: string;
  japanese: string;
  score: number;
  producer: string;
  type: string;
  status: string;
  total_episode: number;
  duration: string;
  release_date: string;
  studio: string;
  genre_list: GenreRef[];
  episode_list: EpisodeListItem[];
  batch_link: BatchLink;
}

export interface DownloadLink {
  host: string;
  link: string | undefined;
}

export interface QualityDownload {
  quality: string;
  size: string;
  download_links: DownloadLink[];
}

export interface DownloadList {
  low_quality: QualityDownload | undefined;
  medium_quality: QualityDownload | undefined;
  high_quality: QualityDownload | undefined;
}

export interface BatchDetail {
  title: string;
  base_url: string;
  download_list: DownloadList;
}

export interface MirrorOption {
  host: string;
  id: string | undefined;
}

export interface MirrorGroup {
  quality: string;
  mirror_list: MirrorOption[];
}

export interface EpisodeDetail {
  id: string;
  title: string;
  base_url: string;
  is_first_episode: boolean;
  prev: string;
  next: string;
  mirrors: MirrorGroup[];
  download_list: DownloadList;
  link_stream: string;
  alternate_stream: string;
}
