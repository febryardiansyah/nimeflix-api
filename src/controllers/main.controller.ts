import { Request, Response } from "express";
import Axios from "axios";
import source from "../config/source";
import * as response from "../utils/response";
import * as errors from "../utils/httpError";
import {
  parseHome,
  parseCompleteAnimeList,
  parseOnGoingAnimeList,
} from "../services/scrapers/animeList.scraper";
import { parseSchedule } from "../services/scrapers/schedule.scraper";
import { parseGenreList, parseAnimeByGenre } from "../services/scrapers/genre.scraper";
import { parseSearch } from "../services/scrapers/search.scraper";

const { baseUrl } = source;

// `page/1` and the bare list both resolve to the same page on the source
// site, so page "1" (or an absent page param) is normalized to "".
const pagePath = (page: string | undefined): string =>
  typeof page === "undefined" ? "" : page === "1" ? "" : `page/${page}`;

export const home = async (req: Request, res: Response): Promise<void> => {
  try {
    const axiosRes = await Axios.get(baseUrl);
    const { on_going, complete } = parseHome(axiosRes.data);
    response.success(res, { base_url: baseUrl, on_going, complete });
  } catch (err) {
    console.log((err as Error).message);
    errors.requestFailed(req, res, err);
  }
};

export const completeAnimeList = async (req: Request, res: Response): Promise<void> => {
  const fullUrl = `${baseUrl}${source.completeAnime}${pagePath(req.params.page)}`;
  try {
    const axiosRes = await Axios.get(fullUrl);
    const { anime_list } = parseCompleteAnimeList(axiosRes.data);
    response.success(res, { base_url: fullUrl, anime_list });
  } catch (err) {
    console.log((err as Error).message);
    errors.requestFailed(req, res, err);
  }
};

export const onGoingAnimeList = async (req: Request, res: Response): Promise<void> => {
  const fullUrl = `${baseUrl}${source.onGoingAnime}${pagePath(req.params.page)}`;
  try {
    const axiosRes = await Axios.get(fullUrl);
    const { anime_list } = parseOnGoingAnimeList(axiosRes.data);
    response.success(res, { base_url: fullUrl, anime_list });
  } catch (err) {
    console.log((err as Error).message);
    errors.requestFailed(req, res, err);
  }
};

export const schedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const axiosRes = await Axios.get(baseUrl + source.schedule);
    response.success(res, parseSchedule(axiosRes.data));
  } catch (err) {
    console.log((err as Error).message);
    errors.requestFailed(req, res, err);
  }
};

export const genre = async (req: Request, res: Response): Promise<void> => {
  const fullUrl = baseUrl + source.genreList;
  try {
    const axiosRes = await Axios.get(fullUrl);
    response.success(res, parseGenreList(axiosRes.data));
  } catch (err) {
    console.log((err as Error).message);
    errors.requestFailed(req, res, err);
  }
};

export const animeByGenre = async (req: Request, res: Response): Promise<void> => {
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

export const search = async (req: Request, res: Response): Promise<void> => {
  const query = req.params.query;
  const fullUrl = `${baseUrl}?s=${query}&post_type=anime`;
  try {
    const axiosRes = await Axios.get(fullUrl);
    const { search_results } = parseSearch(axiosRes.data);
    response.success(res, { base_url: fullUrl, search_results });
  } catch (err) {
    console.log((err as Error).message);
    errors.requestFailed(req, res, err);
  }
};
