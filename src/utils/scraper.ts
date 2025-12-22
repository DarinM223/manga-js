import { Adapter, Manga } from './manga'

/**
 * Scrapes a specific chapter for the manga given the url to the chapter.
 * @return an array of image urls for each page in the chapter.
 */
export async function scrapeChapter(
  url: string,
  adapter: Adapter
): Promise<string[]> {
  const body = await adapter.sendRequest(url, false)
  const links = adapter.parsePageLinks(url, body)
  return Promise.all(
    links.map(async (link) => {
      const body = await adapter.sendRequest(link, false)
      return adapter.parsePageImage(link, body)
    })
  )
}

/**
 * Returns the data for the manga given the url to the manga.
 */
export async function scrape(url: string, adapter: Adapter): Promise<Manga> {
  const mangaName = url.substring(url.lastIndexOf('/') + 1, url.length)
  const body = await adapter.sendRequest(url, false)
  return adapter.parseMangaData(mangaName, body)
}
