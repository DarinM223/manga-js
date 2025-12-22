import { Chapter, Manga } from '../manga.ts'
import { Buffer } from 'buffer'

/**
 * Returns the URL for the given manga.
 */
export function mangaURL(mangaName: string): string {
  return `/preloaded/manga/${mangaName}`
}

/**
 * Sends a request to the specified url and
 * returns a Promise that contains the body of the response.
 */
export async function sendRequest<B extends boolean>(
  url: string,
  buffer: B
): Promise<B extends true ? Buffer : string> {
  const res = await fetch(url)
  if (buffer) {
    // @ts-ignore
    return await res.arrayBuffer()
  } else {
    // @ts-ignore
    return await res.text()
  }
}

/**
 * Parses the html body and returns the general manga data like
 * the dates when chapters came out or the manga name.
 */
export function parseMangaData(
  mangaName: string,
  body: Buffer | string
): Manga {
  const manga: Manga = JSON.parse(
    Buffer.isBuffer(body) ? body.toString() : body
  )
  return manga
}

/**
 * Parses the html body and returns an array of URLs to the pages of the chapter.
 */
export function parsePageLinks(url: string, body: Buffer | string): string[] {
  const chapter: Chapter = JSON.parse(
    Buffer.isBuffer(body) ? body.toString() : body
  )
  return chapter.pages
}

/**
 * Parses the html body and returns the URL of the image for the page of manga.
 */
export function parsePageImage(pageUrl: string, body: Buffer | string): string {
  return pageUrl
}
