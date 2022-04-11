const { default: Axios } = require("axios");
const cheerio = require("cheerio");
const get = async (url) => {
  try {
    const response = await Axios.get(url);
    const $ = cheerio.load(response.data);
    let source1 = $.html().search('"file":');
    let source2 = $.html().search("'file':");
    const source3Url = $('#mediaplayer').attr('src');
    console.log(source1);
    console.log(source2);
    
    if (source1 !== -1) {
      const end = $.html().indexOf('","');
      return $.html().substring(source1 + 8, end);
    } else if (source2 !== -1) {
      const end = $.html().indexOf("','");
      return $.html().substring(source2 + 8, end);
    }
    const res3 = await alternateSource(source3Url);
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

module.exports = { get,getAlternateStream };
