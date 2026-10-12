const url = require("../helpers/base-url");
const { default: Axios } = require("axios");
const cheerio = require("cheerio");
const errors = require("../helpers/errors");
const episodeHelper = require("../helpers/episodeHelper");
const response = require("../helpers/response");
const { baseUrl } = require("../helpers/base-url");

exports.detailAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = url.baseUrl + `anime/${id}`;
  try {
    const axiosRes = await Axios.get(fullUrl);

    const $ = cheerio.load(axiosRes.data);
    const detailElement = $(".venser").find(".fotoanime");
    let object = {};
    let episode_list = [];
    object.anime_id = req.params.id;
    object.thumb = detailElement.find("img").attr("src");
    let genre_name, genre_id, genre_link;
    let genreList = [];

    object.synopsis = $("#venkonten > div.venser > div.fotoanime > div.sinopc")
      .find("p")
      .text();

    detailElement.find(".infozin").filter(function () {
      object.title = $(this)
        .find("p")
        .children()
        .eq(0)
        .text()
        .replace("Judul: ", "");
      object.japanese = $(this)
        .find("p")
        .children()
        .eq(1)
        .text()
        .replace("Japanese: ", "");
      object.score = parseFloat(
        $(this).find("p").children().eq(2).text().replace("Skor: ", "")
      );
      object.producer = $(this)
        .find("p")
        .children()
        .eq(3)
        .text()
        .replace("Produser: ", "");
      object.type = $(this)
        .find("p")
        .children()
        .eq(4)
        .text()
        .replace("Tipe: ", "");
      object.status = $(this)
        .find("p")
        .children()
        .eq(5)
        .text()
        .replace("Status: ", "");
      object.total_episode = parseInt(
        $(this).find("p").children().eq(6).text().replace("Total Episode: ", "")
      );
      object.duration = $(this)
        .find("p")
        .children()
        .eq(7)
        .text()
        .replace("Durasi: ", "");
      object.release_date = $(this)
        .find("p")
        .children()
        .eq(8)
        .text()
        .replace("Tanggal Rilis: ", "");
      object.studio = $(this)
        .find("p")
        .children()
        .eq(9)
        .text()
        .replace("Studio: ", "");
      $(this)
        .find("p")
        .children()
        .eq(10)
        .find("span > a")
        .each(function () {
          genre_name = $(this).text();
          genre_id = $(this).attr("href").replace(`${baseUrl}genres/`, "");
          genre_link = $(this).attr("href");
          genreList.push({ genre_id, genre_name, genre_link });
        });
      object.genre_list = genreList;
    });

    $("#venkonten > div.venser > div:nth-child(8) > ul > li").each((i, element) => {
      episode_list.push({
        id: $(element)
          .find("span > a")
          .attr("href")
          .replace(`${baseUrl}episode/`, "")
          .trim(),
        title: $(element).find("span > a").text().trim(),
        link: $(element).find("span > a").attr("href"),
        uploaded_on: $(element).find(".zeebr").text().trim(),
      });
    });
    object.episode_list = episode_list;

    const hasBatch = $("div.venser > div:nth-child(6) > ul").text().length !== 0;
    object.batch_link = {
      id: hasBatch
        ? $("div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a")
            .attr("href")
            .replace(`${baseUrl}batch/`, "")
        : null,
      link: hasBatch
        ? $("div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a").attr("href")
        : null,
    };

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
    const $ = cheerio.load(axiosRes.data);
    const title = $(".batchlink > h4").text();
    const low_quality = _batchQualityFunction(0, axiosRes.data);
    const medium_quality = _batchQualityFunction(1, axiosRes.data);
    const high_quality = _batchQualityFunction(2, axiosRes.data);
    response.success(res, {
      title,
      base_url: fullUrl,
      download_list: { low_quality, medium_quality, high_quality },
    });
  } catch (err) {
    errors.requestFailed(req, res, err);
  }
};

exports.epsAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = `${url.baseUrl}episode/${id}`;
  try {
    const axiosRes = await Axios.get(fullUrl);
    const $ = cheerio.load(axiosRes.data);
    const streamElement = $("#lightsVideo").find("#embed_holder");
    const obj = {};
    obj.id = fullUrl.replace(url.baseUrl, "");
    obj.title = $(".venutama > h1").text();
    obj.base_url = fullUrl;
    obj.is_first_episode = id.split("-")[2] === "1";

    let nextList = [];
    $('#venkonten > div.venser > div.venutama > div.prevnext > div.flir > a').each((idx, el) => {
      nextList.push({
        title: $(el).text().trim(),
        id: $(el).attr('href').replace(`${baseUrl}episode/`, ''),
      });
    });
    obj.prev = nextList
      .filter((item) => item.title === 'Previous Eps.')
      .map((item) => item.id)[0] || '';
    obj.next = nextList
      .filter((item) => item.title === 'Next Eps.')
      .map((item) => item.id)[0] || '';

    const streamLink = streamElement.find("iframe").attr("src");
    obj.link_stream = await episodeHelper.get(streamLink);
    obj.alternate_stream = await episodeHelper.getAlternateStream(streamLink);

    // Mirror options are no longer plain links; each <a> now carries a
    // base64 encoded `data-content` payload that must be resolved via
    // episodeHelper.resolveMirror before it can be used as a real stream url.
    const buildMirrorList = (selector) => {
      const mirror_list = [];
      $(selector).each((idx, el) => {
        mirror_list.push({
          host: $(el).find('a').text().trim(),
          id: $(el).find('a').attr('data-content'),
        });
      });
      return mirror_list;
    };
    obj.mirrors = [
      { quality: '360p', mirror_list: buildMirrorList('.mirrorstream ul.m360p > li') },
      { quality: '480p', mirror_list: buildMirrorList('.mirrorstream ul.m480p > li') },
      { quality: '720p', mirror_list: buildMirrorList('.mirrorstream ul.m720p > li') },
    ];

    let low_quality, medium_quality, high_quality;
    if ($('.download > ul > li').length === 0) {
      low_quality = _notFoundQualityHandler(axiosRes.data, 0);
      medium_quality = _notFoundQualityHandler(axiosRes.data, 1);
      high_quality = _notFoundQualityHandler(axiosRes.data, 2);
    } else {
      low_quality = _epsQualityFunction(0, axiosRes.data);
      medium_quality = _epsQualityFunction(1, axiosRes.data);
      high_quality = _epsQualityFunction(2, axiosRes.data);
    }
    obj.download_list = { low_quality, medium_quality, high_quality };

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
    const streamLink = await episodeHelper.resolveMirror(mirrorId);
    const link_stream = streamLink !== '-' ? await episodeHelper.get(streamLink) : '-';
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

function _batchQualityFunction(num, html) {
  const $ = cheerio.load(html);
  const element = $(".download2").find(".batchlink");
  const download_links = [];
  let result;
  element.find("ul").filter(function () {
    const quality = $(this).find("li").eq(num).find("strong").text();
    const size = $(this).find("li").eq(num).find("i").text();
    $(this)
      .find("li")
      .eq(num)
      .find("a")
      .each(function () {
        download_links.push({
          host: $(this).text(),
          link: $(this).attr("href"),
        });
        result = { quality, size, download_links };
      });
  });
  return result;
}

function _epsQualityFunction(num, html) {
  const $ = cheerio.load(html);
  const element = $(".download");
  const download_links = [];
  let result;

  element.find("ul").filter(function () {
    const quality = $(this).find("li").eq(num).find("strong").text();
    const size = $(this).find("li").eq(num).find("i").text();
    $(this)
      .find("li")
      .eq(num)
      .find("a")
      .each(function () {
        download_links.push({
          host: $(this).text(),
          link: $(this).attr("href"),
        });
        result = { quality, size, download_links };
      });
  });
  return result;
}

function _notFoundQualityHandler(html, num) {
  const $ = cheerio.load(html);
  const download_links = [];
  const element = $('.download');
  let result;

  element.filter(function () {
    if ($(this).find('.anime-box > .anime-title').eq(0).text() === '') {
      $(this).find('.yondarkness-box').filter(function () {
        const quality = $(this).find('.yondarkness-title').eq(num).text().split('[')[1].split(']')[0];
        const size = $(this).find('.yondarkness-title').eq(num).text().split(']')[1].split('[')[1];
        $(this).find('.yondarkness-item').eq(num).find('a').each((idx, el) => {
          download_links.push({
            host: $(el).text(),
            link: $(el).attr("href"),
          });
          result = { quality, size, download_links };
        });
      });
    } else {
      $(this).find('.anime-box').filter(function () {
        const quality = $(this).find('.anime-title').eq(num).text().split('[')[1].split(']')[0];
        const size = $(this).find('.anime-title').eq(num).text().split(']')[1].split('[')[1];
        $(this).find('.anime-item').eq(num).find('a').each((idx, el) => {
          download_links.push({
            host: $(el).text(),
            link: $(el).attr("href"),
          });
          result = { quality, size, download_links };
        });
      });
    }
  });
  return result;
}
