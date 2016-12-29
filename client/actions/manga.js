import { actions } from 'react-redux-toastr'
import { push } from 'react-router-redux'

export const ADD_MANGA = 'ADD_MANGA'
export const REMOVE_MANGA = 'REMOVE_MANGA'
export const UPDATE_PAGE = 'UPDATE_PAGE'
export const LOAD_CHAPTER = 'LOAD_CHAPTER'

// TODO(DarinM223): implement these helper functions.

function errorNotify (title, message) {
  return actions.add({
    type: 'error',
    title,
    message,
    options: {
      showCloseButton: true,
      timeOut: 3000
    }
  })
}

export function addManga (url, mangaList) {
  const scraper = require('../../utils/scraper.js')
  const adapter = require('../../utils/sites/mangareader.js')

  return (dispatch) => {
    // TODO(DarinM223): also add to database.
    scraper.scrape(url, adapter).then((manga) => {
      if (mangaList.has(manga.name)) {
        dispatch(errorNotify('Manga already exists', 'The manga with the given name already exists in the list'))
      } else {
        dispatch({
          type: ADD_MANGA,
          manga
        })
      }
    })
  }
}

export function removeManga () {
  return (dispatch) => {
    // TODO(DarinM223): remove anime from database.

    dispatch({
      type: REMOVE_MANGA
    })
  }
}

export function updatePage (manga, chapterNum, amount) {
  return {
    type: UPDATE_PAGE,
    mangaName: manga.get('name'),
    chapterNum: chapterNum,
    amount
  }
}

export function loadChapter (manga, chapterNum) {
  const scraper = require('../../utils/scraper.js')
  const adapter = require('../../utils/sites/mangareader.js')

  const chapterRoute = `/chapter/${manga.get('name')}/${chapterNum}`
  return (dispatch) => {
    const chapter = manga.get('chapters').get(chapterNum)
    const chapterURL = chapter.get('url')
    if (chapter.get('loaded')) {
      dispatch(push(chapterRoute))
    } else {
      // Load chapter, then dispatch to update state, then dispatch to update router.
      scraper.scrapeChapter(chapterURL, adapter).then((links) => {
        if (links.length === 0) {
          dispatch(errorNotify('Chapter is empty', 'The chapter being loaded has no pages'))
        } else {
          dispatch({
            type: LOAD_CHAPTER,
            mangaName: manga.get('name'),
            chapterNum,
            pages: links
          })
          dispatch(push(chapterRoute))
        }
      })
    }
  }
}
