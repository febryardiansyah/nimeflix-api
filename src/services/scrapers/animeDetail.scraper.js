const cheerio = require("cheerio");
const { baseUrl } = require("../../config/source");

const parseAnimeDetail = (html, animeId) => {
  const $ = cheerio.load(html);
  const detailElement = $(".venser").find(".fotoanime");
  const object = {};
  const episode_list = [];
  const genreList = [];

  object.anime_id = animeId;
  object.thumb = detailElement.find("img").attr("src");

  object.synopsis = $("#venkonten > div.venser > div.fotoanime > div.sinopc")
    .find("p")
    .text();

  detailElement.find(".infozin").filter(function () {
    object.title = $(this).find("p").children().eq(0).text().replace("Judul: ", "");
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
    object.type = $(this).find("p").children().eq(4).text().replace("Tipe: ", "");
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
        const genre_name = $(this).text();
        const genre_id = $(this).attr("href").replace(`${baseUrl}genres/`, "");
        const genre_link = $(this).attr("href");
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
      ? $("div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a").attr(
          "href"
        )
      : null,
  };

  return object;
};

module.exports = { parseAnimeDetail };
