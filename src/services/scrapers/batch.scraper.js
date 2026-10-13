const cheerio = require("cheerio");
const { parseQualityList } = require("../../utils/qualityParser");

const parseBatch = (html, fullUrl) => {
  const $ = cheerio.load(html);
  const title = $(".batchlink > h4").text();
  const selector = ".download2 .batchlink";

  const low_quality = parseQualityList(html, selector, 0);
  const medium_quality = parseQualityList(html, selector, 1);
  const high_quality = parseQualityList(html, selector, 2);

  return {
    title,
    base_url: fullUrl,
    download_list: { low_quality, medium_quality, high_quality },
  };
};

module.exports = { parseBatch };
