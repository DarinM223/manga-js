
/**
 * Returns the URL for the given manga.
 */
function mangaURL(mangaName: string): string {
  return mangaName
}

/**
 * Sends a request to the specified url and
 * returns a Promise that contains the body of the response.
 */
async function sendRequest<B extends boolean>(url: string, buffer: B): Promise<B extends true ? Buffer : string> {
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
function parseMangaData(mangaName: string, body: Buffer | string) {
  throw new Error("preloaded")
}

/**
 * Parses the html body and returns an array of URLs to the pages of the chapter.
 */
function parsePageLinks(url: string, body: Buffer | string) {
  throw new Error("preloaded")
}

/**
 * Parses the html body and returns the URL of the image for the page of manga.
 */
function parsePageImage(body: Buffer | string): string {
  throw new Error("preloaded")
}

export default {
  mangaURL,
  sendRequest,
  parseMangaData,
  parsePageLinks,
  parsePageImage
}
