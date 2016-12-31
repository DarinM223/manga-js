import cheerio from 'cheerio'
import { NOT_LOADED } from '../constants.js'

/**
 * Returns the URL for the given manga. If chapterNum or pageNum is also
 * specified it returns the URL for the specific chapter or page of the manga.
 * @param {string} mangaName
 * @param {number|null} chapterNum
 * @param {number|null} pageNum
 * @return {string} the requested URL.
 */
export function mangaURL (mangaName, chapterNum = null, pageNum = null) {
  if (chapterNum !== null && pageNum !== null) {
    return `http://www.mangareader.net/${mangaName}/${chapterNum}/${pageNum}`
  } else if (chapterNum !== null) {
    return `http://www.mangareader.net/${mangaName}/${chapterNum}`
  } else {
    return `http://www.mangareader.net/${mangaName}`
  }
}

/**
 * Parses the html body and returns the general manga data like
 * the dates when chapters came out or the manga name.
 * @param {string} body
 * @return {object} the manga as a nested object.
 */
export function parseMangaData (mangaName, body) {
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

      chapters.push({ name, url, date, loadState: NOT_LOADED, currentPage: 0, pages: [] })
    }
  })

  return {
    type: 'mangareader',
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
export function parsePageLinks (body) {
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
export function parsePageImage (body) {
  const $ = cheerio.load(body)
  return $('#img').attr('src')
}
