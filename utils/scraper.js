/**
 * Scrapes a specific chapter for the manga given the url to the chapter.
 * @param {string} url
 * @param {Adapter} adapter
 * @return {Promise<[string]>} an array of image urls for each page in the chapter.
 */
function scrapeChapter (url, adapter) {
  return adapter.sendRequest(url)
    .then((body) => Promise.resolve(adapter.parsePageLinks(url, body)))
    .then((links) => {
      return Promise.all(links.map((link) => {
        return adapter.sendRequest(link)
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

  return adapter.sendRequest(url)
    .then((body) => adapter.parseMangaData(mangaName, body))
}

module.exports = { scrapeChapter, scrape }
