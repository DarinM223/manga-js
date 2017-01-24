/* global test, expect, jasmine */

import configureStore from '../client/configureStore.js'
import { LOADED, NOT_LOADED, NOT_DOWNLOADED } from '../utils/constants.js'
import {
  addManga,
  removeManga,
  updatePage,
  loadChapter,
  VISIT_MANGA,
  DIFF_CHANGES
} from '../client/actions/manga.js'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

test('manga reducer', () => {
  const store = configureStore(false)
  const mangaName = 'onepunch-man'
  const getManga = (store) => store.getState().manga.get(mangaName)
  return store
    .dispatch(addManga(`http://www.mangareader.net/${mangaName}`, store.getState().manga))
    .then(() => {
      expect(store.getState().manga.has(mangaName)).toEqual(true)

      // Test if visiting the manga sets the 'new' property to false.
      expect(getManga(store).get('new')).toEqual(true)
      store.dispatch({ type: VISIT_MANGA, mangaName })
      expect(getManga(store).get('new')).toEqual(false)

      // Test loading a chapter.
      return store.dispatch(loadChapter(store.getState().manga.get(mangaName), 0, true))
    }).then(() => {
      // Test that chapter was loaded.
      expect(getManga(store).getIn(['chapters', 0, 'loadState'])).toEqual(LOADED)

      // Test updating a page.
      const pages = getManga(store).getIn(['chapters', 0, 'pages']).count()
      store.dispatch(updatePage(getManga(store), 0, pages - 1))
      expect(getManga(store).getIn(['chapters', 0, 'currentPage'])).toEqual(pages - 1)
      store.dispatch(updatePage(store.getState().manga.get(mangaName), 0, -(pages - 1)))
      expect(getManga(store).getIn(['chapters', 0, 'currentPage'])).toEqual(0)

      // Test that attempting to update a page out of bounds won't update the page.
      store.dispatch(updatePage(getManga(store), 0, 100))
      expect(getManga(store).getIn(['chapters', 0, 'currentPage'])).toEqual(0)
      store.dispatch(updatePage(getManga(store), 0, -200))
      expect(getManga(store).getIn(['chapters', 0, 'currentPage'])).toEqual(0)

      // Test diffing manga changes.
      const oldManga = getManga(store)
      const newManga = oldManga.update('chapters', (chapters) => chapters.push({
        name: 'A new chapter!',
        url: 'www.google.com',
        date: '1/1/1',
        loadState: NOT_LOADED,
        download: {
          state: NOT_DOWNLOADED,
          progress: 0
        },
        currentPage: 0,
        pages: []
      }))

      store.dispatch({ type: DIFF_CHANGES, manga: newManga.toJS() })
      // Check if all of the old chapters are still the same.
      for (let i = 0; i < oldManga.get('chapters').count(); i++) {
        const oldChapter = oldManga.getIn(['chapters', i]).toJS()
        const newChapter = getManga(store).getIn(['chapters', i]).toJS()
        expect(oldChapter).toEqual(newChapter)
      }
      // Check if there is a new chapter added.
      expect(getManga(store).get('chapters').count()).toEqual(newManga.get('chapters').count())

      // Test removing the manga.
      store.dispatch(removeManga(mangaName))
      expect(store.getState().manga.has(mangaName)).toEqual(false)
    })
})
