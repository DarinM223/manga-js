import fetch from 'node-fetch'

/**
 * Returns the image URL of a specific page of the manga.
 * @param {string} mangaName
 * @param {number} chapterNum
 * @param {number} pageNum
 * @param {Adapter} adapter
 * @return {string} the image url of the page.
 */
export function pageImageURL (mangaName, chapterNum, pageNum, adapter) {
  return fetch(adapter.mangaURL(mangaName, chapterNum, pageNum))
    .then((res) => res.text())
    .then((body) => adapter.parsePageImage(body))
}

/**
 * Downloads a specific chapter for the manga.
 * @param {string} mangaName
 * @param {object} chapter
 * @param {Adapter} adapter
 * @return {Promise<[string]>} an array of image urls for each page in the chapter.
 */
export function downloadChapter (mangaName, chapter, adapter) {
  let promises = []
  for (const page of chapter.pages) {
    promises.push(pageImageURL(mangaName, chapter.num, page.num, adapter))
  }

  return Promise.all(promises)
}

/**
 * Returns the data for the manga given the url to the manga.
 * @param {string} mangaName
 * @param {Adapter} adapter
 * @return {Manga} the manga data that was parsed.
 */
export function scrape (url, adapter) {
  return fetch(url)
    .then((res) => res.text())
    .then((body) => adapter.parseMangaData(body))
}
