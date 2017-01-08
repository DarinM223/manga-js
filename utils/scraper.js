const fetch = require('node-fetch')

/**
 * Scrapes a specific chapter for the manga given the url to the chapter.
 * @param {string} url
 * @param {Adapter} adapter
 * @return {Promise<[string]>} an array of image urls for each page in the chapter.
 */
function scrapeChapter (url, adapter) {
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
function scrape (url, adapter) {
  const mangaName = url.substring(url.lastIndexOf('/') + 1, url.length)

  return fetch(url)
    .then((res) => res.text())
    .then((body) => adapter.parseMangaData(mangaName, body))
}

module.exports = { scrapeChapter, scrape }
