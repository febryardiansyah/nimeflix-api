const cheerio = require("cheerio");
const { baseUrl } = require("../../config/source");

const parseSchedule = (html) => {
  const $ = cheerio.load(html);
  const element = $(".kgjdwl321");
  const schedule_list = [];

  element.find(".kglist321").each(function () {
    const day = $(this).find("h2").text();
    const anime_list = [];

    $(this)
      .find("ul > li")
      .each(function () {
        const anime_name = $(this).find("a").text();
        const link = $(this).find("a").attr("href");
        const id = link.replace(baseUrl + "anime/", "");
        anime_list.push({ id, anime_name, link });
      });

    schedule_list.push({ day, anime_list });
  });

  return { schedule_list };
};

module.exports = { parseSchedule };
