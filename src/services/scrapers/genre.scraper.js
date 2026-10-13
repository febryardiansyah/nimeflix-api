const cheerio = require("cheerio");
const { baseUrl } = require("../../config/source");
const { ImageList } = require("../../utils/genreImages");

const parseGenreList = (html) => {
  const $ = cheerio.load(html);
  const element = $(".genres");
  const genre_list = [];

  element.find("li > a").each(function (i, el) {
    const id = $(el).attr("href").replace("/genres/", "");
    genre_list.push({
      id,
      genre_name: $(el).text(),
      link: baseUrl + $(el).attr("href"),
      image_link: ImageList[i],
    });
  });

  return { genre_list };
};

const parseAnimeByGenre = (html) => {
  const $ = cheerio.load(html);
  const element = $(".page");
  const anime_list = [];

  element.find(".col-md-4").each(function () {
    const object = {};
    object.id = $(this)
      .find(".col-anime-title > a")
      .attr("href")
      .replace(`${baseUrl}anime/`, "");
    object.anime_name = $(this).find(".col-anime-title").text();
    object.thumb = $(this).find("div.col-anime-cover > img").attr("src");
    object.link = $(this).find(".col-anime-title > a").attr("href");
    object.studio = $(this).find(".col-anime-studio").text();
    object.episode = $(this).find(".col-anime-eps").text();
    object.score = parseFloat($(this).find(".col-anime-rating").text());
    object.release_date = $(this).find(".col-anime-date").text();

    const genre_list = [];
    $(this)
      .find(".col-anime-genre > a")
      .each(function () {
        const genre_name = $(this).text();
        const genre_link = $(this).attr("href");
        const genre_id = genre_link.replace(`${baseUrl}genres/`, "");
        genre_list.push({ genre_id, genre_name, genre_link });
      });
    object.genre_list = genre_list;

    anime_list.push(object);
  });

  return { anime_list };
};

module.exports = { parseGenreList, parseAnimeByGenre };
