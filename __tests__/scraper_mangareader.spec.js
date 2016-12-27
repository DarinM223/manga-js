/* global test, expect */

// TODO(DarinM223): mock fetch call to not use network.

test('properly scrapes one punch man manga in mangareader', () => {
  const adapter = require('../utils/sites/mangareader.js')
  const scraper = require('../utils/scraper.js')

  return scraper.scrape('http://www.mangareader.net/onepunch-man', adapter)
    .then((manga) => {
      expect(manga).toEqual({
        type: 'mangareader',
        name: 'Onepunch-Man Manga',
        image: 'http://s1.mangareader.net/cover/onepunch-man/onepunch-man-l0.jpg',
        description: 'Follows the life of an average hero who manages to win all battles with only one punch. This ability seems to frustrate him as he no longer feels the thrill and adrenaline of fighting a tough battle, which leads to him questioning his past desire of being strong.'
      })
    })
})

test('properly parses page image url', () => {
  const adapter = require('../utils/sites/mangareader.js')
  const scraper = require('../utils/scraper.js')

  return scraper.pageImageURL('onepunch-man', 1, 1, adapter)
    .then((imageURL) => expect(imageURL).toEqual('http://i3.mangareader.net/onepunch-man/1/onepunch-man-3798615.jpg'))
})
