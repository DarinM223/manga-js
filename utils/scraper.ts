import { Adapter, Manga } from "./manga"

/**
 * Scrapes a specific chapter for the manga given the url to the chapter.
 * @return an array of image urls for each page in the chapter.
 */
export function scrapeChapter(url: string, adapter: Adapter): Promise<string[]> {
  return adapter.sendRequest(url, false)
    .then((body) => Promise.resolve(adapter.parsePageLinks(url, body)))
    .then((links) => {
      return Promise.all(links.map((link) => {
        return adapter.sendRequest(link, false)
          .then((body) => adapter.parsePageImage(link, body))
      }))
    })
}

/**
 * Returns the data for the manga given the url to the manga.
 */
export function scrape(url: string, adapter: Adapter): Promise<Manga> {
  const mangaName = url.substring(url.lastIndexOf('/') + 1, url.length)

  return adapter.sendRequest(url, false)
    .then((body) => adapter.parseMangaData(mangaName, body))
}