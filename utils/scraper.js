import fetch from 'node-fetch'

/**
 * Scrapes a specific chapter for the manga given the url to the chapter.
 * @param {string} url
 * @param {Adapter} adapter
 * @return {Promise<[string]>} an array of image urls for each page in the chapter.
 */
export function scrapeChapter (url, adapter) {
  return fetch(url)
    .then((res) => res.text())
    .then((body) => Promise.resolve(adapter.parsePageLinks(body)))
    .then((links) => {
      return Promise.all(links.map((link) => {
        return fetch(link)
          .then((res) => res.text())
          .then((body) => adapter.parsePageImage(body))
      }))
    })
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
