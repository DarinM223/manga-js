import cheerio from 'cheerio'
import cloudscraper from 'cloudscraper'

export let adapterNotLoaded = true

export function sendRequest (url) {
  return new Promise((resolve, reject) => {
    cloudscraper.get(url, function (err, resp, body) {
      if (err) {
        return reject(err)
      }

      resolve(body)
    })
  })
}

export function mangaURL (mangaName, chapterNum = null, pageNum = null) {
  if (chapterNum !== null && pageNum !== null) {
    return `http://www.mangafreak.net/Read1_${mangaName}_${chapterNum}_${pageNum}#gohere`
  } else if (chapterNum !== null) {
    return `http://www.mangafreak.net/Read1_${mangaName}_${chapterNum}`
  } else {
    return `http://www.mangafreak.net/Manga/${mangaName}`
  }
}

export function parseMangaData (mangaName, body) {
  // TODO(DarinM223): implement this
}

export function parsePageLinks (body) {
  const $ = cheerio.load(body)

  let links = []
  $('.read_selector option').each(function (idx, option) {
    const url = `http://www.mangafreak.net${option.attribs.value}`
    links.push(url)
  })

  return links
}

export function parsePageImage (body) {
  const $ = cheerio.load(body)
  return $('#gohere').attr('src')
}
