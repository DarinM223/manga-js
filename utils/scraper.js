import fetch from 'node-fetch'

/**
 * Downloads a specific page of the manga.
 * @param {string} mangaName
 * @param {number} chapterNum
 * @param {number} pageNum
 * @param {Adapter} adapter
 * @return {ImageData} // TODO(DarinM223): figure out what fetch(imageURL) returns.
 */
export function downloadPage (mangaName, chapterNum, pageNum, adapter) {
  return fetch(adapter.mangaURL(mangaName, chapterNum, pageNum))
    .then((res) => res.text())
    .then((body) => Promise.resolve(adapter.parsePageImage(body)))
    .then((imageURL) => fetch(imageURL))
}

/**
 * Downloads a specific chapter for the manga.
 */
export function downloadChapter (mangaName, chapter, adapter) {
  let promises = []
  for (const page of chapter.pages) {
    promises.push(downloadPage(mangaName, chapter.num, page.num, adapter))
  }

  return Promise.all(promises)
}

/**
 * Returns the data for the manga given the manga name.
 * @param {string} mangaName
 * @param {Adapter} adapter
 */
export function scrape (mangaName, adapter) {
  return fetch(adapter.mangaURL(mangaName))
    .then((res) => res.text())
    .then((body) => adapter.parseBody(body))
}
