/* global test, expect, jasmine */

import scraper from '../utils/scraper.js'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

test('properly scrapes demi-chan manga data', () => {
  const adapter = require('../utils/sites/mangafreak.js')

  return scraper.scrape('http://www3.mangafreak.net/Manga/Ajin_Chan_Wa_Kataritai', adapter)
    .then((manga) => {
      expect(manga.chapters.length).not.toEqual(0)
      delete manga.chapters
      expect(manga).toEqual({
        type: 'www.mangafreak.net',
        name: 'Ajin_Chan_Wa_Kataritai',
        title: 'Ajin-chan wa Kataritai',
        description: 'Succubus, Dullahan and Vampire. They are known as Ajin, or "demi"s and are slightly different than the average human. They have lived alongside humans for ages under persecution. However, in recent years, they have become accepted as members of society. This manga follows a high school biology teacher who has a great interest in demis and his interaction with the various demis in his school, each with their own cute problems.',
        image: 'http://images.mangafreak.net/manga_images/ajin_chan_wa_kataritai.jpg',
        new: true,
        currentChapter: 0
      })
    })
})

test('properly scrapes demi-chan chapter 1', () => {
  const adapter = require('../utils/sites/mangafreak.js')

  return scraper.scrapeChapter('http://www3.mangafreak.net/Read1_Ajin_Chan_Wa_Kataritai_1', adapter)
    .then((imageURLs) => expect(imageURLs).toEqual([
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_1.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_2.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_3.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_4.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_5.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_6.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_7.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_8.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_9.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_10.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_11.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_12.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_13.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_14.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_15.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_16.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_17.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_18.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_19.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_20.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_21.jpg?v5',
      'http://images.mangafreak.net/mangas/ajin_chan_wa_kataritai/ajin_chan_wa_kataritai_1/ajin_chan_wa_kataritai_1_22.jpg?v5'
    ]))
})
