const cheerio = require("cheerio");
const url = require("../helpers/base-url");
const { default: Axios } = require("axios");
const baseUrl = url.baseUrl;
const completeAnime = url.completeAnime;
const onGoingAnime = url.onGoingAnime;
const errors = require("../helpers/errors");
const response = require("../helpers/response");
const ImageList = require("../helpers/image_genre").ImageList;

exports.home = (req, res) => {
  let on_going = [];
  let complete = [];
  Axios.get(baseUrl)
    .then((axiosRes) => {
      const $ = cheerio.load(axiosRes.data);
      const element = $(".venz");
      let episode, uploaded_on, day_updated, thumb, title, link, id;
      element
        .children()
        .eq(0)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.replace(`${baseUrl}anime/`, "");
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          day_updated = $(this).find(".epztipe").text().replace(" ", "");
          on_going.push({
            id,
            title,
            thumb,
            link,
            episode,
            uploaded_on,
            day_updated,
          });
        });
      return axiosRes;
    })
    .then((axiosRes) => {
      const $ = cheerio.load(axiosRes.data);
      const element = $(".venz");
      let episode, uploaded_on, score, thumb, title, link, id;
      element
        .children()
        .eq(1)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.replace(`${baseUrl}anime/`, "");
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          score = parseFloat($(this).find(".epztipe").text().replace(" ", ""));
          complete.push({
            id,
            title,
            thumb,
            link,
            episode,
            score,
            uploaded_on,
          });
        });
      response.success(res, {
        base_url: baseUrl,
        on_going,
        complete,
      });
    })
    .catch((err) => {
      console.log(err.message);
      errors.requestFailed(req, res, err);
    });
};

exports.completeAnimeList = (req, res) => {
  const params = req.params.page;
  const page =
    typeof params === "undefined" ? "" : params === "1" ? "" : `page/${params}`;
  const fullUrl = `${baseUrl}${completeAnime}${page}`;
  Axios.get(fullUrl)
    .then((axiosRes) => {
      const $ = cheerio.load(axiosRes.data);
      const element = $(".venz");
      let anime_list = [];
      let episode, uploaded_on, score, thumb, title, link, id;
      element
        .children()
        .eq(0)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.replace(`${baseUrl}anime/`, "");
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          score = parseFloat($(this).find(".epztipe").text().replace(" ", ""));
          anime_list.push({
            id,
            title,
            thumb,
            link,
            episode,
            score,
            uploaded_on,
          });
        });
      response.success(res, {
        base_url: fullUrl,
        anime_list,
      });
    })
    .catch((err) => {
      console.log(err.message);
      errors.requestFailed(req, res, err);
    });
};

exports.onGoingAnimeList = (req, res) => {
  const params = req.params.page;
  const page = typeof params === "undefined" ? "" : params === "1" ? "" : `page/${params}`;
  const fullUrl = `${baseUrl}${onGoingAnime}${page}`;
  Axios.get(fullUrl)
    .then((axiosRes) => {
      const $ = cheerio.load(axiosRes.data);
      const element = $(".venz");
      let anime_list = [];
      let episode, uploaded_on, day_updated, thumb, title, link, id;
      element
        .children()
        .eq(0)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.replace(`${baseUrl}anime/`, "");
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          day_updated = $(this).find(".epztipe").text().replace(" ", "");
          anime_list.push({
            id,
            title,
            thumb,
            link,
            episode,
            uploaded_on,
            day_updated,
          });
        });
      response.success(res, {
        base_url: fullUrl,
        anime_list,
      });
    })
    .catch((err) => {
      console.log(err.message);
      errors.requestFailed(req, res, err);
    });
};

exports.schedule = (req, res) => {
  Axios.get(baseUrl + url.schedule)
    .then((axiosRes) => {
      const $ = cheerio.load(axiosRes.data);
      const element = $(".kgjdwl321");
      let schedule_list = [];
      let day;
      let anime_name, link, id;
      element.find(".kglist321").each(function () {
        day = $(this).find("h2").text();
        let anime_list = [];
        $(this)
          .find("ul > li")
          .each(function () {
            anime_name = $(this).find("a").text();
            link = $(this).find("a").attr("href");
            id = link.replace(baseUrl + "anime/", "");
            anime_list.push({ id, anime_name, link });
          });
        schedule_list.push({ day, anime_list });
      });
      response.success(res, { schedule_list });
    })
    .catch((err) => {
      console.log(err.message);
      errors.requestFailed(req, res, err);
    });
};

exports.genre = (req, res) => {
  const fullUrl = baseUrl + url.genreList;
  Axios.get(fullUrl)
    .then((axiosRes) => {
      const $ = cheerio.load(axiosRes.data);
      const element = $(".genres");
      let genre_list = [];
      element.find("li > a").each(function (i, el) {
        const id = $(el).attr("href").replace("/genres/", "");
        genre_list.push({
          id,
          genre_name: $(el).text(),
          link: baseUrl + $(el).attr("href"),
          image_link: ImageList[i],
        });
      });
      response.success(res, { genre_list });
    })
    .catch((err) => {
      console.log(err.message);
      errors.requestFailed(req, res, err);
    });
};

exports.animeByGenre = (req, res) => {
  const pageNumber = req.params.pageNumber;
  const id = req.params.id;
  const fullUrl = baseUrl + `genres/${id}/page/${pageNumber}`;
  Axios.get(fullUrl)
    .then((axiosRes) => {
      const $ = cheerio.load(axiosRes.data);
      const element = $(".page");
      let anime_list = [];
      let object = {};
      let genre_name, genre_link, genre_id;
      element.find(".col-md-4").each(function () {
        object = {};
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
        let genre_list = [];
        $(this)
          .find(".col-anime-genre > a")
          .each(function () {
            genre_name = $(this).text();
            genre_link = $(this).attr("href");
            genre_id = genre_link.replace(`${baseUrl}genres/`, "");
            genre_list.push({ genre_id, genre_name, genre_link });
          });
        object.genre_list = genre_list;
        anime_list.push(object);
      });
      response.success(res, {
        base_url: fullUrl,
        anime_list,
      });
    })
    .catch((err) => {
      errors.requestFailed(req, res, err);
    });
};

exports.search = (req, res) => {
  const query = req.params.query;
  const fullUrl = `${baseUrl}?s=${query}&post_type=anime`;
  Axios.get(fullUrl)
    .then((axiosRes) => {
      const $ = cheerio.load(axiosRes.data);
      const element = $(".page");
      let search_results = [];
      if (element.find("ul > li").length !== 0) {
        element.find("ul > li").each(function () {
          const genre_list = [];
          $(this)
            .find(".set")
            .find("a")
            .each(function () {
              genre_list.push({
                genre_id: $(this).attr("href").replace(`${baseUrl}genres/`, ""),
                genre_title: $(this).text(),
                genre_link: $(this).attr("href"),
              });
            });
          search_results.push({
            id: $(this).find("h2 > a").attr("href").replace(`${baseUrl}anime/`, ""),
            title: $(this).find("h2").text(),
            thumb: $(this).find("img").attr("src"),
            link: $(this).find("h2 > a").attr("href"),
            status: $(this).find(".set").eq(1).text().replace("Status : ", ""),
            score: parseFloat(
              $(this).find(".set").eq(2).text().replace("Rating : ", "")
            ),
            genre_list,
          });
        });
      }
      response.success(res, {
        base_url: fullUrl,
        search_results,
      });
    })
    .catch((err) => {
      console.log(err.message);
      errors.requestFailed(req, res, err);
    });
};
