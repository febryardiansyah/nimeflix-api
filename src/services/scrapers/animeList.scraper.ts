import * as cheerio from "cheerio";
import type { Cheerio, CheerioAPI, Element } from "cheerio";
import source from "../../config/source";
import { AnimeListItem } from "../../types";

const { baseUrl } = source;

type Variant = "ongoing" | "complete";

// Shared parser for the `.venz > ul > li` anime card markup used on the
// homepage, the complete-anime list, and the ongoing-anime list. The only
// difference between "ongoing" and "complete" cards is the trailing field:
// ongoing cards show the day it was updated, complete cards show a score.
const parseVenzList = (
  $: CheerioAPI,
  container: Cheerio<Element>,
  variant: Variant
): AnimeListItem[] => {
  const list: AnimeListItem[] = [];

  container.find("ul > li").each(function () {
    let title = "";
    let thumb: string | undefined;
    let link = "";
    let id = "";
    $(this)
      .find(".thumb > a")
      .filter(function () {
        title = $(this).find(".thumbz > h2").text();
        thumb = $(this).find(".thumbz > img").attr("src");
        link = $(this).attr("href") || "";
        id = link.replace(`${baseUrl}anime/`, "");
        return true;
      });

    const uploaded_on = $(this).find(".newnime").text();
    const episode = $(this).find(".epz").text().replace(" ", "");
    const tail = $(this).find(".epztipe").text().replace(" ", "");

    const item: AnimeListItem = { id, title, thumb, link, episode, uploaded_on };
    if (variant === "complete") {
      item.score = parseFloat(tail);
    } else {
      item.day_updated = tail;
    }
    list.push(item);
  });

  return list;
};

export const parseHome = (
  html: string
): { on_going: AnimeListItem[]; complete: AnimeListItem[] } => {
  const $ = cheerio.load(html);
  const venz = $(".venz");
  const on_going = parseVenzList($, venz.children().eq(0), "ongoing");
  const complete = parseVenzList($, venz.children().eq(1), "complete");
  return { on_going, complete };
};

export const parseCompleteAnimeList = (
  html: string
): { anime_list: AnimeListItem[] } => {
  const $ = cheerio.load(html);
  const anime_list = parseVenzList($, $(".venz").children().eq(0), "complete");
  return { anime_list };
};

export const parseOnGoingAnimeList = (
  html: string
): { anime_list: AnimeListItem[] } => {
  const $ = cheerio.load(html);
  const anime_list = parseVenzList($, $(".venz").children().eq(0), "ongoing");
  return { anime_list };
};
