import cheerio from 'cheerio'

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
    return `http://www.mangareader.net/${mangaName}`
  } else if (chapterNum !== null) {
    return `http://www.mangareader.net/${mangaName}/${chapterNum}`
  } else {
    return `http://www.mangareader.net/${mangaName}/${chapterNum}/${pageNum}`
  }
}

/**
 * Parses the html body and returns the general manga data like
 * the dates when chapters came out or the manga name.
 * @param {string} body
 * @return {object} the manga as a nested object.
 */
export function parseMangaData (body) {
  const $ = cheerio.load(body)

  // TODO(DarinM223): parse the body for the manga image.
  // TODO(DarinM223): parse the body for the manga chapters.
}

/**
 * Parses the html body and returns the URL of the image for the page of manga.
 * @param {string} body
 * @return {string} the image URL of the page.
 */
export function parsePageImage (body) {
  const $ = cheerio.load(body)

  // TODO(DarinM223): parse the body for the image URL.
}
