const cheerio = require('cheerio')
const fetch = require('node-fetch')
const { NOT_LOADED, NOT_DOWNLOADED } = require('../constants.js')

/**
 * Returns the URL for the given manga. If chapterNum or pageNum is also
 * specified it returns the URL for the specific chapter or page of the manga.
 * @param {string} mangaName
 * @param {number|null} chapterNum
 * @param {number|null} pageNum
 * @return {string} the requested URL.
 */
function mangaURL (mangaName, chapterNum = null, pageNum = null) {
  if (chapterNum !== null && pageNum !== null) {
    return `http://www.mangareader.net/${mangaName}/${chapterNum}/${pageNum}`
  } else if (chapterNum !== null) {
    return `http://www.mangareader.net/${mangaName}/${chapterNum}`
  } else {
    return `http://www.mangareader.net/${mangaName}`
  }
}

/**
 * Sends a request to the specified url and
 * returns a Promise that contains the body of the response.
 * @param {boolean} buffer optional parameter that if true specifies that the response must return an arraybuffer.
 * @return {Promise<string>} the body of the response
 */
function sendRequest (url, buffer = false) {
  if (buffer) {
    return fetch(url).then((res) => res.buffer())
  }
  return fetch(url).then((res) => res.text())
}

/**
 * Parses the html body and returns the general manga data like
 * the dates when chapters came out or the manga name.
 * @param {string} body
 * @return {object} the manga as a nested object.
 */
function parseMangaData (mangaName, body) {
  const $ = cheerio.load(body)

  const title = $('#mangaproperties h1').text().trim()
  const description = $('#readmangasum p').text().trim()
  const image = $('#mangaimg img').attr('src')

  let chapters = []
  $('#listing tr').each(function (idx, element) {
    if (idx !== 0) {
      let [name, url, date] = [null, null, null]
      $(element).find('td').each(function (idx, element) {
        if (idx === 0) {
          name = $(element).find('a').text()
          url = `http://www.mangareader.net${$(element).find('a').attr('href')}`
        } else if (idx === 1) {
          date = $(element).text().trim()
        }
      })

      // Chapters are in increasing order (chapter 1 would
      // have a smaller index than chapter 50).
      chapters.push({
        name,
        url,
        date,
        loadState: NOT_LOADED,
        download: {
          state: NOT_DOWNLOADED,
          progress: 0
        },
        currentPage: 0,
        pages: []
      })
    }
  })

  return {
    type: 'www.mangareader.net',
    title,
    name: mangaName,
    description,
    new: true,
    image,
    chapters,
    currentChapter: 0
  }
}

/**
 * Parses the html body and returns an array of URLs to the pages of the chapter.
 * @param {string} body
 * @return {[string]} the page links in the chapter.
 */
function parsePageLinks (body) {
  const $ = cheerio.load(body)

  let links = []
  $('#pageMenu option').each(function (idx, option) {
    const url = `http://www.mangareader.net${option.attribs.value}`
    links.push(url)
  })

  return links
}

/**
 * Parses the html body and returns the URL of the image for the page of manga.
 * @param {string} body
 * @return {string} the image URL of the page.
 */
function parsePageImage (body) {
  const $ = cheerio.load(body)
  return $('#img').attr('src')
}

module.exports = {
  mangaURL,
  sendRequest,
  parseMangaData,
  parsePageLinks,
  parsePageImage
}
