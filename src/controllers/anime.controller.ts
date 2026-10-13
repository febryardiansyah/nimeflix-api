import { Request, Response } from "express";
import Axios from "axios";
import source from "../config/source";
import * as errors from "../utils/httpError";
import * as response from "../utils/response";
import * as episodeStream from "../services/episodeStream.service";
import { parseAnimeDetail } from "../services/scrapers/animeDetail.scraper";
import { parseBatch } from "../services/scrapers/batch.scraper";
import { parseEpisode } from "../services/scrapers/episode.scraper";

const { baseUrl } = source;

export const detailAnime = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const fullUrl = baseUrl + `anime/${id}`;
  try {
    const axiosRes = await Axios.get(fullUrl);
    const object = parseAnimeDetail(axiosRes.data, id);
    response.success(res, object);
  } catch (err) {
    console.log(err);
    errors.requestFailed(req, res, err);
  }
};

export const batchAnime = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const fullUrl = `${baseUrl}batch/${id}`;
  try {
    const axiosRes = await Axios.get(fullUrl);
    response.success(res, parseBatch(axiosRes.data, fullUrl));
  } catch (err) {
    errors.requestFailed(req, res, err);
  }
};

export const epsAnime = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const fullUrl = `${baseUrl}episode/${id}`;
  try {
    const axiosRes = await Axios.get(fullUrl);
    const obj = await parseEpisode(axiosRes.data, fullUrl);
    response.success(res, obj);
  } catch (err) {
    console.log(err);
    errors.requestFailed(req, res, err);
  }
};

export const epsMirror = async (req: Request, res: Response): Promise<void> => {
  // mirrorId is the base64 `data-content` payload captured from the
  // episode's mirror list (see exports.epsAnime).
  const mirrorId = req.body.mirrorId;
  const animeId = req.params.animeId;
  try {
    const streamLink = await episodeStream.resolveMirror(mirrorId);
    const link_stream = streamLink !== "-" ? await episodeStream.get(streamLink) : "-";
    response.success(res, {
      anime_id: animeId,
      stream_link: streamLink,
      link_stream,
    });
  } catch (error) {
    console.log(error);
    errors.requestFailed(req, res, error);
  }
};
