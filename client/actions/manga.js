import { actions } from 'react-redux-toastr'
import { push } from 'react-router-redux'
import { ipcRenderer } from 'electron'

import {
  NOT_LOADED,
  LOADED,
  LOADING,
  DOWNLOADING
} from '../../utils/constants.js'

export const ADD_MANGA = 'ADD_MANGA'
export const REMOVE_MANGA = 'REMOVE_MANGA'
export const UPDATE_PAGE = 'UPDATE_PAGE'
export const UPDATE_CHAPTER = 'UPDATE_CHAPTER'
export const LOAD_CHAPTER = 'LOAD_CHAPTER'
export const SET_DOWNLOAD_STATE = 'SET_DOWNLOAD_STATE'
export const SET_LOADING = 'SET_LOADING'

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
    scraper.scrape(url, adapter).then((manga) => {
      if (mangaList.has(manga.name)) {
        dispatch(errorNotify('Manga already exists', 'The manga with the given name already exists in the list'))
      } else {
        dispatch({ type: ADD_MANGA, manga })
      }
    })
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
  ipcRenderer.send('download-chapter', { mangaName, chapterNum })

  return {
    type: SET_DOWNLOAD_STATE,
    state: DOWNLOADING,
    mangaName,
    chapterNum
  }
}

export function loadChapter (manga, chapterNum) {
  const scraper = require('../../utils/scraper.js')
  const adapter = require('../../utils/sites/mangareader.js')

  const chapterRoute = `/chapter/${manga.get('name')}/${chapterNum}`
  return (dispatch) => {
    const mangaName = manga.get('name')
    const chapter = manga.get('chapters').get(chapterNum)
    const chapterURL = chapter.get('url')
    const loadState = chapter.get('loadState')

    switch (loadState) {
      case LOADED:
        dispatch(push(chapterRoute))
        dispatch(updateChapter(mangaName, chapterNum))
        break
      case LOADING:
        // Ignore action if the chapter is already loading.
        break
      case NOT_LOADED:
        dispatch(setLoading(mangaName, chapterNum))

        // Load chapter, then dispatch to update state, then dispatch to update router.
        scraper.scrapeChapter(chapterURL, adapter).then((links) => {
          if (links.length === 0) {
            dispatch(errorNotify('Chapter is empty', 'The chapter being loaded has no pages'))
          } else {
            dispatch({
              type: LOAD_CHAPTER,
              mangaName: mangaName,
              chapterNum,
              pages: links
            })
            dispatch(push(chapterRoute))
            dispatch(updateChapter(mangaName, chapterNum))
          }
        })
        break
    }
  }
}
