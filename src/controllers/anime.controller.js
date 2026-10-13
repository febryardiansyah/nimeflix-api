const { default: Axios } = require("axios");
const { baseUrl } = require("../config/source");
const errors = require("../utils/httpError");
const response = require("../utils/response");
const episodeStream = require("../services/episodeStream.service");
const { parseAnimeDetail } = require("../services/scrapers/animeDetail.scraper");
const { parseBatch } = require("../services/scrapers/batch.scraper");
const { parseEpisode } = require("../services/scrapers/episode.scraper");

exports.detailAnime = async (req, res) => {
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

exports.batchAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = `${baseUrl}batch/${id}`;
  try {
    const axiosRes = await Axios.get(fullUrl);
    response.success(res, parseBatch(axiosRes.data, fullUrl));
  } catch (err) {
    errors.requestFailed(req, res, err);
  }
};

exports.epsAnime = async (req, res) => {
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

exports.epsMirror = async (req, res) => {
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
