import * as cheerio from "cheerio";
import source from "../../config/source";
import { ScheduleAnimeItem, ScheduleDay } from "../../types";

const { baseUrl } = source;

export const parseSchedule = (
  html: string
): { schedule_list: ScheduleDay[] } => {
  const $ = cheerio.load(html);
  const element = $(".kgjdwl321");
  const schedule_list: ScheduleDay[] = [];

  element.find(".kglist321").each(function () {
    const day = $(this).find("h2").text();
    const anime_list: ScheduleAnimeItem[] = [];

    $(this)
      .find("ul > li")
      .each(function () {
        const anime_name = $(this).find("a").text();
        const link = $(this).find("a").attr("href") || "";
        const id = link.replace(baseUrl + "anime/", "");
        anime_list.push({ id, anime_name, link });
      });

    schedule_list.push({ day, anime_list });
  });

  return { schedule_list };
};
