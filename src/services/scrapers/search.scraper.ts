import * as cheerio from "cheerio";
import source from "../../config/source";
import { SearchGenreRef, SearchResultItem } from "../../types";

const { baseUrl } = source;

export const parseSearch = (html: string): { search_results: SearchResultItem[] } => {
  const $ = cheerio.load(html);
  const element = $(".page");
  const search_results: SearchResultItem[] = [];

  if (element.find("ul > li").length !== 0) {
    element.find("ul > li").each(function () {
      const genre_list: SearchGenreRef[] = [];
      $(this)
        .find(".set")
        .find("a")
        .each(function () {
          genre_list.push({
            genre_id: ($(this).attr("href") || "").replace(`${baseUrl}genres/`, ""),
            genre_title: $(this).text(),
            genre_link: $(this).attr("href") || "",
          });
        });

      search_results.push({
        id: ($(this).find("h2 > a").attr("href") || "").replace(`${baseUrl}anime/`, ""),
        title: $(this).find("h2").text(),
        thumb: $(this).find("img").attr("src"),
        link: $(this).find("h2 > a").attr("href") || "",
        status: $(this).find(".set").eq(1).text().replace("Status : ", ""),
        score: parseFloat(
          $(this).find(".set").eq(2).text().replace("Rating : ", "")
        ),
        genre_list,
      });
    });
  }

  return { search_results };
};
