/* global test, expect */

// TODO(DarinM223): mock fetch call to not use network.

test('properly scrapes one punch man manga data', () => {
  const adapter = require('../utils/sites/mangareader.js')
  const scraper = require('../utils/scraper.js')

  return scraper.scrape('http://www.mangareader.net/onepunch-man', adapter)
    .then((manga) => {
      expect(manga.chapters.length).not.toEqual(0)
      delete manga.chapters

      expect(manga).toEqual({
        type: 'mangareader',
        name: 'onepunch-man',
        title: 'Onepunch-Man Manga',
        description: 'Follows the life of an average hero who manages to win all battles with only one punch. This ability seems to frustrate him as he no longer feels the thrill and adrenaline of fighting a tough battle, which leads to him questioning his past desire of being strong.',
        image: 'http://s1.mangareader.net/cover/onepunch-man/onepunch-man-l0.jpg',
        new: true
      })
    })
})

test('properly scrapes one punch man chapter 1', () => {
  const adapter = require('../utils/sites/mangareader.js')
  const scraper = require('../utils/scraper.js')

  const imageFileName = (url) => url.substring(url.lastIndexOf('/') + 1, url.length)

  return scraper.scrapeChapter('http://www.mangareader.net/onepunch-man/1', adapter)
    .then((imageURLs) => expect(imageURLs.map(imageFileName)).toEqual([
      'onepunch-man-3798615.jpg',
      'onepunch-man-3798617.jpg',
      'onepunch-man-3798619.jpg',
      'onepunch-man-3798621.jpg',
      'onepunch-man-3798623.jpg',
      'onepunch-man-3798625.jpg',
      'onepunch-man-3798627.jpg',
      'onepunch-man-3798629.jpg',
      'onepunch-man-3798631.jpg',
      'onepunch-man-3798633.jpg',
      'onepunch-man-3798635.jpg',
      'onepunch-man-3798637.jpg',
      'onepunch-man-3798639.jpg',
      'onepunch-man-3798641.jpg',
      'onepunch-man-3798643.jpg',
      'onepunch-man-3798645.jpg',
      'onepunch-man-3798647.jpg',
      'onepunch-man-3798649.jpg',
      'onepunch-man-3798651.jpg'
    ]))
})
