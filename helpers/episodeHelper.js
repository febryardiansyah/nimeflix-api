const { default: Axios } = require("axios");
const cheerio = require("cheerio");
const { baseUrl } = require("./base-url");

const AJAX_URL = `${baseUrl}wp-admin/admin-ajax.php`;
const NONCE_ACTION = "aa1208d27f29ca340c92c66d1926f13f";
const MIRROR_ACTION = "2a3505c93b0035d3f455df82bf976b84";

const get = async (url) => {
  try {
    const response = await Axios.get(url);
    const $ = cheerio.load(response.data);
    const videoSourceUrl = $("video > source").attr("src");
    if (videoSourceUrl) {
      return videoSourceUrl;
    }
    let source1 = $.html().search('"file":');
    let source2 = $.html().search("'file':");
    const source3Url = $('#mediaplayer').attr('src');
    console.log(`source 1 ${source1}`);
    console.log(`source 2 ${source2}`);
    
    if (source1 !== -1) {
      const end = $.html().indexOf('","');
      return $.html().substring(source1 + 8, end);
    } else if (source2 !== -1) {
      const end = $.html().indexOf("','");
      return $.html().substring(source2 + 8, end);
    }
    const res3 = source3Url ? await alternateSource(source3Url) : '-';
    if(res3 !== '-'){
      return res3;
    }
    const _url = $('body > #mediaplayer > source').attr('src');
    return _url || '-';
  } catch (error) {
    console.log(`ERR => ${error}`);
    return "-";
  }
};

const alternateSource = async(url) =>{
  const response = await Axios.get(url);
  const $ = cheerio.load(response.data);
  const source3 = $.html().search('"play_url"');
  console.log(`SOURCE 3 ==> ${source3}`);
  if (source3 !== 1) {
    const end = $.html().indexOf('","format_id');
    return $.html().substring(source3+12,end);
  }
  return '-';
}

const getAlternateStream = async(url)=>{
  const response = await Axios.get(url);
  const $ = cheerio.load(response.data);
  const source = $('#mediaplayer').attr('src');
  return source || '-';
}

// Mirror options on an episode page no longer link directly to a stream page.
// Instead each option exposes a base64 encoded `data-content` JSON payload
// (e.g. {"id":206377,"i":0,"q":"480p"}) that must be exchanged for a nonce
// and then posted back to WordPress' admin-ajax endpoint to receive a
// base64 encoded iframe snippet containing the real embed url.
const resolveMirror = async (dataContent) => {
  try {
    const decoded = JSON.parse(Buffer.from(dataContent, "base64").toString("utf-8"));
    const nonceResponse = await Axios.post(
      AJAX_URL,
      new URLSearchParams({ action: NONCE_ACTION }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const nonce = nonceResponse.data?.data;
    const embedResponse = await Axios.post(
      AJAX_URL,
      new URLSearchParams({ ...decoded, nonce, action: MIRROR_ACTION }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const embedHtml = Buffer.from(embedResponse.data?.data || "", "base64").toString("utf-8");
    const $ = cheerio.load(embedHtml);
    return $("iframe").attr("src") || "-";
  } catch (error) {
    console.log(`ERR => ${error}`);
    return "-";
  }
};

module.exports = { get, getAlternateStream, resolveMirror };
