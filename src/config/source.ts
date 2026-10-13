// Base otakudesu.blog source urls/paths used by every scraper.
export interface Source {
  baseUrl: string;
  completeAnime: string;
  onGoingAnime: string;
  schedule: string;
  genreList: string;
}

const source: Source = {
  baseUrl: "https://otakudesu.blog/",
  completeAnime: "complete-anime/",
  onGoingAnime: "ongoing-anime/",
  schedule: "jadwal-rilis/",
  genreList: "genre-list/",
};

export default source;
