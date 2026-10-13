const { default: Axios } = require("axios");
const source = require("../config/source");
const response = require("../utils/response");
const errors = require("../utils/httpError");
const { parseHome, parseCompleteAnimeList, parseOnGoingAnimeList } = require("../services/scrapers/animeList.scraper");
const { parseSchedule } = require("../services/scrapers/schedule.scraper");
const { parseGenreList, parseAnimeByGenre } = require("../services/scrapers/genre.scraper");
const { parseSearch } = require("../services/scrapers/search.scraper");

const { baseUrl } = source;

// `page/1` and the bare list both resolve to the same page on the source
// site, so page "1" (or an absent page param) is normalized to "".
const pagePath = (page) =>
  typeof page === "undefined" ? "" : page === "1" ? "" : `page/${page}`;

exports.home = async (req, res) => {
  try {
    const axiosRes = await Axios.get(baseUrl);
    const { on_going, complete } = parseHome(axiosRes.data);
    response.success(res, { base_url: baseUrl, on_going, complete });
  } catch (err) {
    console.log(err.message);
    errors.requestFailed(req, res, err);
  }
};

exports.completeAnimeList = async (req, res) => {
  const fullUrl = `${baseUrl}${source.completeAnime}${pagePath(req.params.page)}`;
  try {
    const axiosRes = await Axios.get(fullUrl);
    const { anime_list } = parseCompleteAnimeList(axiosRes.data);
    response.success(res, { base_url: fullUrl, anime_list });
  } catch (err) {
    console.log(err.message);
    errors.requestFailed(req, res, err);
  }
};

exports.onGoingAnimeList = async (req, res) => {
  const fullUrl = `${baseUrl}${source.onGoingAnime}${pagePath(req.params.page)}`;
  try {
    const axiosRes = await Axios.get(fullUrl);
    const { anime_list } = parseOnGoingAnimeList(axiosRes.data);
    response.success(res, { base_url: fullUrl, anime_list });
  } catch (err) {
    console.log(err.message);
    errors.requestFailed(req, res, err);
  }
};

exports.schedule = async (req, res) => {
  try {
    const axiosRes = await Axios.get(baseUrl + source.schedule);
    response.success(res, parseSchedule(axiosRes.data));
  } catch (err) {
    console.log(err.message);
    errors.requestFailed(req, res, err);
  }
};

exports.genre = async (req, res) => {
  const fullUrl = baseUrl + source.genreList;
  try {
    const axiosRes = await Axios.get(fullUrl);
    response.success(res, parseGenreList(axiosRes.data));
  } catch (err) {
    console.log(err.message);
    errors.requestFailed(req, res, err);
  }
};

exports.animeByGenre = async (req, res) => {
  const { id, pageNumber } = req.params;
  const fullUrl = `${baseUrl}genres/${id}/page/${pageNumber}`;
  try {
    const axiosRes = await Axios.get(fullUrl);
    const { anime_list } = parseAnimeByGenre(axiosRes.data);
    response.success(res, { base_url: fullUrl, anime_list });
  } catch (err) {
    errors.requestFailed(req, res, err);
  }
};

exports.search = async (req, res) => {
  const query = req.params.query;
  const fullUrl = `${baseUrl}?s=${query}&post_type=anime`;
  try {
    const axiosRes = await Axios.get(fullUrl);
    const { search_results } = parseSearch(axiosRes.data);
    response.success(res, { base_url: fullUrl, search_results });
  } catch (err) {
    console.log(err.message);
    errors.requestFailed(req, res, err);
  }
};
