import cheerio from 'cheerio'
import cloudscraper from 'cloudscraper'
import { NOT_LOADED, NOT_DOWNLOADED } from '../constants.js'

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
  const $ = cheerio.load(body)

  const title = $('.manga_series_data h5').text().trim()
  const description = $('.manga_series_description p').text().trim()
  const image = $('.manga_series_image img').attr('src')

  let chapters = []
  $('.manga_series_list tr').each(function (idx, element) {
    if (idx !== 0) {
      let [name, url, date] = [null, null, null]
      $(element).find('td').each(function (idx, element) {
        if (idx === 0) {
          name = $(element).find('a').text()
          url = `http://www.mangafreak.net${$(element).find('a').attr('href')}`
        } else if (idx === 1) {
          date = $(element).text().trim()
        }
      })

      chapters.push({
        name,
        url,
        date,
        loadState: NOT_LOADED,
        download: {
          state: NOT_DOWNLOADED,
          progress: 0
        },
        currentPage: 0,
        pages: []
      })
    }
  })

  return {
    type: 'www.mangafreak.net',
    title,
    name: mangaName,
    description,
    new: true,
    image,
    chapters,
    currentChapter: 0
  }
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
