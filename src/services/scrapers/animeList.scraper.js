const cheerio = require("cheerio");
const { baseUrl } = require("../../config/source");

// Shared parser for the `.venz > ul > li` anime card markup used on the
// homepage, the complete-anime list, and the ongoing-anime list. The only
// difference between "ongoing" and "complete" cards is the trailing field:
// ongoing cards show the day it was updated, complete cards show a score.
const parseVenzList = ($, container, variant) => {
  const list = [];

  container
    .find("ul > li")
    .each(function () {
      let title, thumb, link, id;
      $(this)
        .find(".thumb > a")
        .filter(function () {
          title = $(this).find(".thumbz > h2").text();
          thumb = $(this).find(".thumbz > img").attr("src");
          link = $(this).attr("href");
          id = link.replace(`${baseUrl}anime/`, "");
        });

      const uploaded_on = $(this).find(".newnime").text();
      const episode = $(this).find(".epz").text().replace(" ", "");
      const tail = $(this).find(".epztipe").text().replace(" ", "");

      const item = { id, title, thumb, link, episode, uploaded_on };
      if (variant === "complete") {
        item.score = parseFloat(tail);
      } else {
        item.day_updated = tail;
      }
      list.push(item);
    });

  return list;
};

const parseHome = (html) => {
  const $ = cheerio.load(html);
  const venz = $(".venz");
  const on_going = parseVenzList($, venz.children().eq(0), "ongoing");
  const complete = parseVenzList($, venz.children().eq(1), "complete");
  return { on_going, complete };
};

const parseCompleteAnimeList = (html) => {
  const $ = cheerio.load(html);
  const anime_list = parseVenzList($, $(".venz").children().eq(0), "complete");
  return { anime_list };
};

const parseOnGoingAnimeList = (html) => {
  const $ = cheerio.load(html);
  const anime_list = parseVenzList($, $(".venz").children().eq(0), "ongoing");
  return { anime_list };
};

module.exports = { parseHome, parseCompleteAnimeList, parseOnGoingAnimeList };
