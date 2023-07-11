const url = require("../helpers/base-url");
const { default: Axios } = require("axios");
const cheerio = require("cheerio");
const errors = require("../helpers/errors");
const episodeHelper = require("../helpers/episodeHelper");
const { baseUrl } = require("../helpers/base-url");
const e = require("express");
const { ImageList } = require("../helpers/image_genre");

// jQuery(window).on('load', function() {
//   jQuery.ajax(
//     {url: 'https://otakudesu.site/wp-admin/admin-ajax.php',
//     data: {
//       action: 'epslist',id: 119643
//     },
//   method: 'GET',beforeSend: function(){
//   jQuery('#_epslist').html('<div class="lds-css ng-scope"><div style="width:100%;height:100%" class="lds-dual-ring"><div></div></div></div>');
// },success: function(r) {
//   if(r) jQuery('#_epslist').html(r);
//   else jQuery('#_epslist').html('<div id="_noepslist"><li style="text-align: center;font-size: 13px;"><i>List Episode tidak/belum tersedia</i></li></div>');
// }});});

exports.detailAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = url.baseUrl + `anime/${id}`;
  // console.log(fullUrl);
  try {
    const response = await Axios.get(fullUrl);

    const $ = cheerio.load(response.data);
    const detailElement = $(".venser").find(".fotoanime");
    let object = {};
    let episode_list = [];
    object.thumb = detailElement.find("img").attr("src");
    object.anime_id = req.params.id;
    let genreList = [];

    object.synopsis = $("#venkonten > div.venser > div.fotoanime > div.sinopc")
      .find("p")
      .text();

    detailElement.find(".infozin").filter(function () {
      object.title = $(this)
        .find("p")
        .children()
        .eq(0)
        .text()
        .replace("Judul: ", "");
      object.japanase = $(this)
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
        .replace("Produser:  ", "");
      object.type = $(this)
        .find("p")
        .children()
        .eq(4)
        .text()
        .replace("Tipe: ", "");
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
        .each(function (idx, el) {
          const title = $(this).text();
          const id = $(this).attr("href").replace(`${baseUrl}genres/`, "");
          const link = $(this).attr("href");
          const img = ImageList[idx];
          genreList.push({ title, id, link, img });
        });
    });
    object.genre_list = genreList;
    // const idSourceStart = $.html().search(',id: ');
    // const idSourceEnd = $.html().indexOf("},method: 'GET'");
    // console.log(`ID => ${idSourceStart}`);
    // console.log(`ID => ${idSourceEnd}`);
    // const animeId = $.html().substring(idSourceStart+5,idSourceEnd).trim();

    // const epsListRes = await Axios.get('https://otakudesu.site/wp-admin/admin-ajax.php',{
    //   params:{
    //     action:'epslist','id':animeId,
    //   }
    // })
    // const $eps = cheerio.load(epsListRes.data);
    $("#venkonten > div.venser > div:nth-child(8) > ul > li").each(
      (i, element) => {
        const dataList = {
          title: $(element).find("span > a").text().trim(),
          id: $(element)
            .find("span > a")
            .attr("href")
            .replace(`${baseUrl}episode/`, "")
            .trim(),
          link: $(element).find("span > a").attr("href"),
          uploaded_on: $(element).find(".zeebr").text().trim(),
        };
        episode_list.push(dataList);
      }
    );
    object.episode_list =
      episode_list.length === 0
        ? [
            {
              title: "Belum tersedia",
              id: "Belum tersedia",
              link: "Belum tersedia",
              uploaded_on: "Belum tersedia",
            },
          ]
        : episode_list;
    const batch_link = {
      id:
        $("div.venser > div:nth-child(6) > ul").text().length !== 0
          ? $("div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a")
              .attr("href")
              .replace(`${baseUrl}batch/`, "")
          : "Belum tersedia",
      link:
        $("div.venser > div:nth-child(6) > ul").text().length !== 0
          ? $(
              "div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a"
            ).attr("href")
          : "Belum tersedia",
    };

    object.batch_link = batch_link;
    //console.log(epsElement);
    res.send(object);
  } catch (err) {
    console.log(err);
    errors.requestFailed(req, res, err);
  }
};
exports.batchAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = `${baseUrl}batch/${id}`;
  console.log(fullUrl);
  Axios.get(fullUrl)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const obj = {};
      obj.title = $(".batchlink > h4").text();
      obj.status = "success";
      obj.baseUrl = fullUrl;
      let low_quality = _batchQualityFunction(0, response.data);
      let medium_quality = _batchQualityFunction(1, response.data);
      let high_quality = _batchQualityFunction(2, response.data);
      obj.download_list = { low_quality, medium_quality, high_quality };
      res.send(obj);
    })
    .catch((err) => {
      errors.requestFailed(req, res, err);
    });
};
exports.epsAnime = async (req, res) => {
  const id = req.params.id;
  const fullUrl = `${url.baseUrl}episode/${id}`;
  try {
    const response = await Axios.get(fullUrl);
    const $ = cheerio.load(response.data);
    const streamElement = $("#lightsVideo").find("#embed_holder");
    const obj = {};
    obj.title = $(".venutama > h1").text();
    obj.baseUrl = fullUrl;
    obj.id = fullUrl.replace(url.baseUrl, "");
    const isFirstEps = id.split("-")[2] === "1";
    obj.isFirstEps = isFirstEps;
    let nextList = [];
    $(
      "#venkonten > div.venser > div.venutama > div.prevnext > div.flir > a"
    ).each((idx, el) => {
      nextList.push({
        title: $(el).text().trim(),
        id: $(el).attr("href").replace(`${baseUrl}episode/`, ""),
      });
    });
    console.log(nextList);
    obj.prev =
      nextList
        .map((e) => {
          if (e.title === "Previous Eps.") {
            return e.id;
          }
          return "";
        })
        .filter((item) => item)[0] || "";
    obj.next =
      nextList
        .map((e) => {
          console.log(e.title);
          if (e.title === "Next Eps.") {
            return e.id;
          }
          return "";
        })
        .filter((item) => item)[0] || "";
    const streamLink = streamElement.find("iframe").attr("src");
    obj.link_stream = await episodeHelper.get(streamLink);
    // obj.alternate_stream = await episodeHelper.getAlternateStream(streamLink);
    obj.alternate_stream = streamLink;
    console.log($("#pembed > div > iframe").attr("src"));
    let low_quality;
    let medium_quality;
    let high_quality;
    let mirror1 = [];
    let mirror2 = [];
    let mirror3 = [];

    $("#embed_holder > div.mirrorstream > ul.m360p > li").each((idx, el) => {
      ``;
      mirror1.push({
        host: $(el).find("a").text().trim(),
        id: $(el).find("a").attr("href"),
      });
    });
    $("#embed_holder > div.mirrorstream > ul.m480p > li").each((idx, el) => {
      mirror2.push({
        host: $(el).find("a").text().trim(),
        id: $(el).find("a").attr("href"),
      });
    });
    $("#embed_holder > div.mirrorstream > ul.m720p > li").each((idx, el) => {
      mirror3.push({
        host: $(el).find("a").text().trim(),
        id: $(el).find("a").attr("href"),
      });
    });
    obj.mirror1 = { quality: "360p", mirrorList: mirror1 };
    obj.mirror2 = { quality: "480p", mirrorList: mirror2 };
    obj.mirror3 = { quality: "720p", mirrorList: mirror3 };
    if (
      $(
        "#venkonten > div.venser > div.venutama > div.download > ul > li:nth-child(1)"
      ).text() === ""
    ) {
      console.log("ul is empty");
      low_quality = _notFoundQualityHandler(response.data, 0);
      medium_quality = _notFoundQualityHandler(response.data, 1);
      high_quality = _notFoundQualityHandler(response.data, 2);
    } else {
      console.log("ul is not empty");
      low_quality = _epsQualityFunction(0, response.data);
      medium_quality = _epsQualityFunction(1, response.data);
      high_quality = _epsQualityFunction(2, response.data);
    }
    obj.quality = { low_quality, medium_quality, high_quality };
    res.send(obj);
  } catch (err) {
    console.log(err);
    errors.requestFailed(req, res, err);
  }
};

exports.epsMirror = async (req, res) => {
  const mirrorId = req.body.mirrorId;
  const animeId = req.params.animeId;
  const fullUrl = `${baseUrl}${animeId}/${mirrorId}`;
  try {
    const response = await Axios.get(fullUrl);
    const $ = cheerio.load(response.data);
    const obj = {};
    obj.title = $(".venutama > h1").text();
    obj.baseUrl = fullUrl;
    obj.id = fullUrl.replace(url.baseUrl, "");
    const streamLink = $("#pembed > div > iframe").attr("src");
    obj.streamLink = streamLink;
    obj.link_stream = await episodeHelper.get(streamLink);
    res.send(obj);
  } catch (error) {
    console.log(error);
    errors.requestFailed(req, res, err);
  }
};

function _batchQualityFunction(num, res) {
  const $ = cheerio.load(res);
  const element = $(".download2").find(".batchlink");
  const download_links = [];
  let response;
  element.find("ul").filter(function () {
    const quality = $(this).find("li").eq(num).find("strong").text();
    const size = $(this).find("li").eq(num).find("i").text();
    $(this)
      .find("li")
      .eq(num)
      .find("a")
      .each(function () {
        const _list = {
          host: $(this).text(),
          link: $(this).attr("href"),
        };
        download_links.push(_list);
        response = { quality, size, download_links };
      });
  });
  return response;
}
function _epsQualityFunction(num, res) {
  const $ = cheerio.load(res);
  const element = $(".download");
  const download_links = [];
  let response;

  element.find("ul").filter(function () {
    const quality = $(this).find("li").eq(num).find("strong").text();
    const size = $(this).find("li").eq(num).find("i").text();
    $(this)
      .find("li")
      .eq(num)
      .find("a")
      .each(function () {
        const _list = {
          host: $(this).text(),
          link: $(this).attr("href"),
        };
        download_links.push(_list);
        response = { quality, size, download_links };
      });
  });
  return response;
}

function _notFoundQualityHandler(res, num) {
  const $ = cheerio.load(res);
  const download_links = [];
  const element = $(".download");
  let response;

  element.filter(function () {
    if ($(this).find(".anime-box > .anime-title").eq(0).text() === "") {
      $(this)
        .find(".yondarkness-box")
        .filter(function () {
          const quality = $(this)
            .find(".yondarkness-title")
            .eq(num)
            .text()
            .split("[")[1]
            .split("]")[0];
          const size = $(this)
            .find(".yondarkness-title")
            .eq(num)
            .text()
            .split("]")[1]
            .split("[")[1];
          $(this)
            .find(".yondarkness-item")
            .eq(num)
            .find("a")
            .each((idx, el) => {
              const _list = {
                host: $(el).text(),
                link: $(el).attr("href"),
              };
              download_links.push(_list);
              response = { quality, size, download_links };
            });
        });
    } else {
      $(this)
        .find(".anime-box")
        .filter(function () {
          const quality = $(this)
            .find(".anime-title")
            .eq(num)
            .text()
            .split("[")[1]
            .split("]")[0];
          const size = $(this)
            .find(".anime-title")
            .eq(num)
            .text()
            .split("]")[1]
            .split("[")[1];
          $(this)
            .find(".anime-item")
            .eq(num)
            .find("a")
            .each((idx, el) => {
              const _list = {
                host: $(el).text(),
                link: $(el).attr("href"),
              };
              download_links.push(_list);
              response = { quality, size, download_links };
            });
        });
    }
  });
  return response;
}

// $('.mirrorstream a[href^="#"]').on("click",function(e){e.preventDefault();e=e.currentTarget,e=JSON.parse(atob(e.dataset.content));
//   $.ajax("https://otakudesu.site/wp-admin/admin-ajax.php",
//   {method:"POST",processData:!0,cache:!0,data:{...e,action:"2a3505c93b0035d3f455df82bf976b84",nonce:"575a7b4484"}})
//   .done(function({data:e}){document.getElementById("pembed").innerHTML=atob(e)}).fail(function(){})});

//   https://www.blogger.com/video.g?token=AD6v5dwvYfJBzZWimA6wEqPkqNDX5r_Vi8g3vT6yX58Mhg5LLH95whkMYCewuDoc_fnKrU9DI30qErnb8ZtW9fOCfV2BTbRYHWocEsYP_hV2Ey9UiipSndJ_azciSd0BH7shH1s76GM
// https://www.blogger.com/video.g?token=AD6v5dw1IgfcmeNfeb_Em6NhrMbRZBqUIyVqk9LIdWzah68QhEZtNTyb-899-vA4syJikINeMFkZYgszcRnrYU_qX_VKyDdoGRBj7N7f_6hVxJqapfwzAx7bwU5eC33eq5HMLYkCYSY

var VIDEO_CONFIG = {
  thumbnail:
    "https://i9.ytimg.com/vi_blogger/QL0ZCPF_nXs/1.jpg?sqp=CPK0jpMGGPDEAfqGspsBBgjAAhC0AQ&rs=AMzJL3kROkQEtt0TNrQx5TJZmB9rqMBS5Q",
  iframe_id: "BLOGGER-video-40bd1908f17f9d7b-7550",
  allow_resize: true,
  streams: [
    {
      play_url:
        "https://rr7---sn-2uuxa3vh-wvbz.googlevideo.com/videoplayback?expire=1650723570&ei=cppjYt6hHcqB-LYPyu-W6AE&ip=36.73.34.105&id=40bd1908f17f9d7b&itag=18&source=blogger&mh=uU&mm=31&mn=sn-2uuxa3vh-wvbz&ms=au&mv=m&mvi=7&pl=22&susc=bl&eaua=cqAgRwQh9JI&mime=video/mp4&vprv=1&dur=1440.357&lmt=1650672523408269&mt=1650694126&txp=1311224&sparams=expire,ei,ip,id,itag,source,susc,eaua,mime,vprv,dur,lmt&sig=AOq0QJ8wRAIgHFcBFGWXeC8yRlY0zUYuE3Sj2IU-xNjgeP6LvDyIaJICIGLqhniHCNQPpxJw1Vu780mf-IobSYTyqZqvFprx1bh0&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIhAOAv3A7iewWKvQszakHh2DShYEntSesYLD3Hy6Rc-VlhAiAgFTWBZB93qJli_NfYJl1-RgxHhVZEzQBej0ITlcV1bg%3D%3D",
      format_id: 18,
    },
  ],
};

var VIDEO_CONFIG1 = {
  thumbnail:
    "https://i9.ytimg.com/vi_blogger/QL0ZCPF_nXs/1.jpg?sqp=CPK0jpMGGPDEAfqGspsBBgjAAhC0AQ&rs=AMzJL3kROkQEtt0TNrQx5TJZmB9rqMBS5Q",
  iframe_id: "BLOGGER-video-40bd1908f17f9d7b-7550",
  allow_resize: true,
  streams: [
    {
      play_url:
        "https://rr7---sn-2uuxa3vh-wvbz.googlevideo.com/videoplayback?expire=1650723570&ei=cppjYt6hHcqB-LYPyu-W6AE&ip=36.73.34.105&id=40bd1908f17f9d7b&itag=18&source=blogger&mh=uU&mm=31&mn=sn-2uuxa3vh-wvbz&ms=au&mv=m&mvi=7&pl=22&susc=bl&eaua=cqAgRwQh9JI&mime=video/mp4&vprv=1&dur=1440.357&lmt=1650672523408269&mt=1650694126&txp=1311224&sparams=expire,ei,ip,id,itag,source,susc,eaua,mime,vprv,dur,lmt&sig=AOq0QJ8wRAIgHFcBFGWXeC8yRlY0zUYuE3Sj2IU-xNjgeP6LvDyIaJICIGLqhniHCNQPpxJw1Vu780mf-IobSYTyqZqvFprx1bh0&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIhAOAv3A7iewWKvQszakHh2DShYEntSesYLD3Hy6Rc-VlhAiAgFTWBZB93qJli_NfYJl1-RgxHhVZEzQBej0ITlcV1bg%3D%3D",
      format_id: 18,
    },
  ],
};

var VIDEO_CONFIG2 = {
  thumbnail:
    "https://i9.ytimg.com/vi_blogger/QL0ZCPF_nXs/1.jpg?sqp=CMm1jpMGGPDEAfqGspsBBgjAAhC0AQ&rs=AMzJL3keQ6LWF8_1liSuBzLkBHhr7BqKbQ",
  iframe_id: "BLOGGER-video-40bd1908f17f9d7b-7550",
  allow_resize: true,
  streams: [
    {
      play_url:
        "https://rr7---sn-2uuxa3vh-wvbz.googlevideo.com/videoplayback?expire=1650723657&ei=yZpjYq2bGNfYuALm8I2QDQ&ip=36.73.34.105&id=40bd1908f17f9d7b&itag=18&source=blogger&mh=uU&mm=31&mn=sn-2uuxa3vh-wvbz&ms=au&mv=m&mvi=7&pl=22&susc=bl&eaua=cqAgRwQh9JI&mime=video/mp4&vprv=1&dur=1440.357&lmt=1650672523408269&mt=1650694609&txp=1311224&sparams=expire,ei,ip,id,itag,source,susc,eaua,mime,vprv,dur,lmt&sig=AOq0QJ8wRAIgBBKkilKXw5FM7_4aQbv62rGk3_PRxVQ9u76nwf4eEncCIFqROzRkusBks3r1dmOhhkD1SCCCmF1i6VIRzrDm5TX1&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRQIgMYUlmwmkl-7aVhun7QhgHWHBQ4aY8i9LcAaQ2I4AkeUCIQDwFOXfS5M-4PZoGeoSYZV9jLz9NaTz-DQHWLEYW9MK1w%3D%3D",
      format_id: 18,
    },
  ],
};
