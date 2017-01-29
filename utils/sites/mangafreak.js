const cheerio = require('cheerio')
const cloudscraper = require('cloudscraper')
const { NOT_LOADED, NOT_DOWNLOADED } = require('../constants.js')

function mangaURL (mangaName, chapterNum = null, pageNum = null) {
  if (chapterNum !== null && pageNum !== null) {
    return `http://www.mangafreak.net/Read1_${mangaName}_${chapterNum}_${pageNum}#gohere`
  } else if (chapterNum !== null) {
    return `http://www.mangafreak.net/Read1_${mangaName}_${chapterNum}`
  } else {
    return `http://www.mangafreak.net/Manga/${mangaName}`
  }
}

function sendRequest (url, buffer = false) {
  return new Promise((resolve, reject) => {
    if (buffer) {
      cloudscraper.request({ method: 'GET', url: url, encoding: null }, function (err, resp, body) {
        if (err) {
          return reject(err)
        }

        resolve(body)
      })
    } else {
      cloudscraper.get(url, function (err, resp, body) {
        if (err) {
          return reject(err)
        }

        resolve(body)
      })
    }
  })
}

function parseMangaData (mangaName, body) {
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

function parsePageLinks (body) {
  const $ = cheerio.load(body)

  let links = []
  $('.read_selector option').each(function (idx, option) {
    const url = `http://www.mangafreak.net${option.attribs.value}`
    links.push(url)
  })

  return links
}

function parsePageImage (body) {
  const $ = cheerio.load(body)
  return $('#gohere').attr('src')
}

module.exports = {
  mangaURL,
  sendRequest,
  parseMangaData,
  parsePageLinks,
  parsePageImage
}
