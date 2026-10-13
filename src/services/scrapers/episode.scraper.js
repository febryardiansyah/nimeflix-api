const cheerio = require("cheerio");
const { baseUrl } = require("../../config/source");
const { parseQualityList, parseAltQualityList } = require("../../utils/qualityParser");
const episodeStream = require("../episodeStream.service");

const buildMirrorList = ($, selector) => {
  const mirror_list = [];
  $(selector).each((idx, el) => {
    mirror_list.push({
      host: $(el).find("a").text().trim(),
      id: $(el).find("a").attr("data-content"),
    });
  });
  return mirror_list;
};

const parseDownloadList = (html) => {
  const $ = cheerio.load(html);
  if ($(".download > ul > li").length === 0) {
    return {
      low_quality: parseAltQualityList(html, 0),
      medium_quality: parseAltQualityList(html, 1),
      high_quality: parseAltQualityList(html, 2),
    };
  }
  return {
    low_quality: parseQualityList(html, ".download", 0),
    medium_quality: parseQualityList(html, ".download", 1),
    high_quality: parseQualityList(html, ".download", 2),
  };
};

// Parses everything on an episode page except the actual stream resolution,
// which requires a follow-up network request handled by episodeStream.service.
const parseEpisodeMeta = (html, fullUrl) => {
  const $ = cheerio.load(html);
  const streamElement = $("#lightsVideo").find("#embed_holder");
  const obj = {};

  obj.id = fullUrl.replace(baseUrl, "");
  obj.title = $(".venutama > h1").text();
  obj.base_url = fullUrl;
  obj.is_first_episode = obj.id.split("-")[2] === "1";

  const nextList = [];
  $("#venkonten > div.venser > div.venutama > div.prevnext > div.flir > a").each(
    (idx, el) => {
      nextList.push({
        title: $(el).text().trim(),
        id: $(el).attr("href").replace(`${baseUrl}episode/`, ""),
      });
    }
  );
  obj.prev =
    nextList.filter((item) => item.title === "Previous Eps.").map((item) => item.id)[0] ||
    "";
  obj.next =
    nextList.filter((item) => item.title === "Next Eps.").map((item) => item.id)[0] || "";

  obj.streamLink = streamElement.find("iframe").attr("src");

  obj.mirrors = [
    { quality: "360p", mirror_list: buildMirrorList($, ".mirrorstream ul.m360p > li") },
    { quality: "480p", mirror_list: buildMirrorList($, ".mirrorstream ul.m480p > li") },
    { quality: "720p", mirror_list: buildMirrorList($, ".mirrorstream ul.m720p > li") },
  ];

  obj.download_list = parseDownloadList(html);

  return obj;
};

const parseEpisode = async (html, fullUrl) => {
  const { streamLink, ...obj } = parseEpisodeMeta(html, fullUrl);
  obj.link_stream = await episodeStream.get(streamLink);
  obj.alternate_stream = await episodeStream.getAlternateStream(streamLink);
  return obj;
};

module.exports = { parseEpisode };
