const cheerio = require("cheerio");

// Used by both the batch page (`.download2 .batchlink`) and the normal
// episode download section (`.download`): each quality tier is rendered as
// `<ul><li><strong>quality</strong><i>size</i><a>host</a>...</li></ul>`.
const parseQualityList = (html, containerSelector, num) => {
  const $ = cheerio.load(html);
  const element = $(containerSelector);
  const download_links = [];
  let result;

  element.find("ul").filter(function () {
    const quality = $(this).find("li").eq(num).find("strong").text();
    const size = $(this).find("li").eq(num).find("i").text();
    $(this)
      .find("li")
      .eq(num)
      .find("a")
      .each(function () {
        download_links.push({
          host: $(this).text(),
          link: $(this).attr("href"),
        });
        result = { quality, size, download_links };
      });
  });
  return result;
};

// Fallback layout used on some episode pages where the download section
// renders as `.anime-box`/`.anime-title` (or `.yondarkness-box` for some
// mirrors) instead of the usual `ul > li` structure, encoding
// `[quality][size]` inside the title text itself.
const parseAltQualityList = (html, num) => {
  const $ = cheerio.load(html);
  const download_links = [];
  const element = $(".download");
  let result;

  element.filter(function () {
    const isYondarkness =
      $(this).find(".anime-box > .anime-title").eq(0).text() === "";
    const boxSelector = isYondarkness ? ".yondarkness-box" : ".anime-box";
    const titleSelector = isYondarkness ? ".yondarkness-title" : ".anime-title";
    const itemSelector = isYondarkness ? ".yondarkness-item" : ".anime-item";

    $(this)
      .find(boxSelector)
      .filter(function () {
        const quality = $(this)
          .find(titleSelector)
          .eq(num)
          .text()
          .split("[")[1]
          .split("]")[0];
        const size = $(this)
          .find(titleSelector)
          .eq(num)
          .text()
          .split("]")[1]
          .split("[")[1];
        $(this)
          .find(itemSelector)
          .eq(num)
          .find("a")
          .each((idx, el) => {
            download_links.push({
              host: $(el).text(),
              link: $(el).attr("href"),
            });
            result = { quality, size, download_links };
          });
      });
  });
  return result;
};

module.exports = { parseQualityList, parseAltQualityList };
