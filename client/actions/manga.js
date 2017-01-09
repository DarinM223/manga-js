import { actions } from 'react-redux-toastr'
import { push } from 'react-router-redux'

import { NOT_LOADED, LOADED, LOADING } from '../../utils/constants.js'
import { adapterFromURL, adapterFromHostname } from '../../utils/url.js'
import scraper from '../../utils/scraper.js'

export const ADD_MANGA = 'ADD_MANGA'
export const REMOVE_MANGA = 'REMOVE_MANGA'
export const VISIT_MANGA = 'VISIT_MANGA'
export const UPDATE_PAGE = 'UPDATE_PAGE'
export const UPDATE_CHAPTER = 'UPDATE_CHAPTER'
export const LOAD_CHAPTER = 'LOAD_CHAPTER'
export const SET_DOWNLOAD_STATE = 'SET_DOWNLOAD_STATE'
export const DOWNLOAD_CHAPTER = 'DOWNLOAD_CHAPTER'
export const DOWNLOADED_PAGE = 'DOWNLOADED_PAGE'
export const SET_LOADING = 'SET_LOADING'
export const DIFF_CHANGES = 'DIFF_CHANGES'

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
  const adapter = adapterFromURL(url)

  return (dispatch) => {
    scraper.scrape(url, adapter).then((manga) => {
      if (mangaList.has(manga.name)) {
        dispatch(errorNotify('Manga already exists', 'The manga with the given name already exists in the list'))
      } else {
        dispatch({ type: ADD_MANGA, manga })
      }
    })
  }
}

export function visitManga (store) {
  return (nextState) => {
    store.dispatch({
      type: VISIT_MANGA,
      mangaName: nextState.params.name
    })
  }
}

export function reloadMangaList (store) {
  // Only automatically reload manga list when you first open the application.
  // Reloading after the fact will have to be done manually using the refresh button.
  let reloaded = false
  return (nextState) => {
    if (!reloaded) {
      for (const mangaName of store.getState().manga.keys()) {
        const manga = store.getState().manga.get(mangaName)
        store.dispatch(reloadManga(manga))
      }

      reloaded = true
    }
  }
}

export function reloadManga (manga) {
  const adapter = adapterFromHostname(manga.get('type'))
  const url = adapter.mangaURL(manga.get('name'))

  return (dispatch) => {
    scraper.scrape(url, adapter).then((manga) => dispatch({ type: DIFF_CHANGES, manga }))
  }
}

export function removeManga (mangaName) {
  return (dispatch) => {
    dispatch({ type: REMOVE_MANGA, name: mangaName })
    dispatch(push('/'))
  }
}

export function updatePage (manga, chapterNum, amount) {
  return {
    type: UPDATE_PAGE,
    mangaName: manga.get('name'),
    chapterNum,
    amount
  }
}

export function updateChapter (mangaName, chapterNum) {
  return {
    type: UPDATE_CHAPTER,
    mangaName,
    chapterNum
  }
}

export function setLoading (mangaName, chapterNum) {
  return {
    type: SET_LOADING,
    mangaName,
    chapterNum
  }
}

export function downloadChapter (mangaName, chapterNum) {
  return {
    type: DOWNLOAD_CHAPTER,
    mangaName,
    chapterNum
  }
}

export function loadChapter (manga, chapterNum, background = false) {
  const chapterRoute = `/chapter/${manga.get('name')}/${chapterNum}`
  return (dispatch) => {
    const mangaName = manga.get('name')
    const chapter = manga.get('chapters').get(chapterNum)
    const chapterURL = chapter.get('url')
    const loadState = chapter.get('loadState')
    const adapter = adapterFromURL(chapterURL)

    switch (loadState) {
      case LOADED:
        if (!background) {
          dispatch(push(chapterRoute))
          dispatch(updateChapter(mangaName, chapterNum))
        }
        break
      case LOADING:
        // Ignore action if the chapter is already loading.
        break
      case NOT_LOADED:
        dispatch(setLoading(mangaName, chapterNum))

        // Load chapter, then dispatch to update state, then dispatch to update router.
        return scraper.scrapeChapter(chapterURL, adapter).then((links) => {
          if (links.length === 0) {
            dispatch(errorNotify('Chapter is empty', 'The chapter being loaded has no pages'))
          } else {
            dispatch({
              type: LOAD_CHAPTER,
              mangaName: mangaName,
              chapterNum,
              pages: links
            })
            if (!background) {
              dispatch(push(chapterRoute))
              dispatch(updateChapter(mangaName, chapterNum))
            }
          }
        })
    }

    return Promise.resolve()
  }
}
