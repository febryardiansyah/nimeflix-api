import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import source from "../../config/source";
import { parseQualityList, parseAltQualityList } from "../../utils/qualityParser";
import * as episodeStream from "../episodeStream.service";
import { DownloadList, EpisodeDetail, MirrorGroup, MirrorOption } from "../../types";

const { baseUrl } = source;

const buildMirrorList = ($: CheerioAPI, selector: string): MirrorOption[] => {
  const mirror_list: MirrorOption[] = [];
  $(selector).each((_idx, el) => {
    mirror_list.push({
      host: $(el).find("a").text().trim(),
      id: $(el).find("a").attr("data-content"),
    });
  });
  return mirror_list;
};

const parseDownloadList = (html: string): DownloadList => {
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

type EpisodeMeta = Omit<EpisodeDetail, "link_stream" | "alternate_stream"> & {
  streamLink: string | undefined;
};

// Parses everything on an episode page except the actual stream resolution,
// which requires a follow-up network request handled by episodeStream.service.
const parseEpisodeMeta = (html: string, fullUrl: string): EpisodeMeta => {
  const $ = cheerio.load(html);
  const streamElement = $("#lightsVideo").find("#embed_holder");
  const obj = {} as EpisodeMeta;

  obj.id = fullUrl.replace(baseUrl, "");
  obj.title = $(".venutama > h1").text();
  obj.base_url = fullUrl;
  obj.is_first_episode = obj.id.split("-")[2] === "1";

  const nextList: { title: string; id: string }[] = [];
  $("#venkonten > div.venser > div.venutama > div.prevnext > div.flir > a").each(
    (_idx, el) => {
      nextList.push({
        title: $(el).text().trim(),
        id: ($(el).attr("href") || "").replace(`${baseUrl}episode/`, ""),
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
  ] as MirrorGroup[];

  obj.download_list = parseDownloadList(html);

  return obj;
};

export const parseEpisode = async (
  html: string,
  fullUrl: string
): Promise<EpisodeDetail> => {
  const { streamLink, ...obj } = parseEpisodeMeta(html, fullUrl);
  const link_stream = await episodeStream.get(streamLink as string);
  const alternate_stream = await episodeStream.getAlternateStream(streamLink as string);
  return { ...obj, link_stream, alternate_stream };
};
