import { NavigateFunction } from 'react-router-dom'
import { DownloadStateType, LoadStateType } from '../../../utils/constants.ts'
import { adapterFromURL, adapterFromHostname } from '../../../utils/url.ts'
import * as scraper from '../../../utils/scraper.ts'
import { Manga } from '../../../utils/manga.ts'
import { Dispatch } from '@reduxjs/toolkit'
import { State as MangaState } from '../reducers/manga.ts'

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
export const ALREADY_EXISTS = 'ALREADY_EXISTS'
export const EMPTY_CHAPTER = 'EMPTY_CHAPTER'
export const ERROR = 'ERROR'

export type Error = typeof ALREADY_EXISTS | typeof EMPTY_CHAPTER
export type Action =
  | { type: 'ADD_MANGA'; manga: Manga }
  | { type: 'REMOVE_MANGA'; name: string }
  | { type: 'VISIT_MANGA'; mangaName: string }
  | {
      type: 'UPDATE_PAGE'
      mangaName: string
      chapterNum: number
      amount: number
    }
  | { type: 'UPDATE_CHAPTER'; mangaName: string; chapterNum: number }
  | {
      type: 'LOAD_CHAPTER'
      mangaName: string
      chapterNum: number
      pages: string[]
    }
  | {
      type: 'SET_DOWNLOAD_STATE'
      state: DownloadStateType
      mangaName: string
      chapterNum: number
    }
  | { type: 'DOWNLOAD_CHAPTER'; mangaName: string; chapterNum: number }
  | {
      type: 'DOWNLOADED_PAGE'
      curr: number
      mangaName: string
      chapterNum: number
    }
  | { type: 'SET_LOADING'; mangaName: string; chapterNum: number }
  | { type: 'DIFF_CHANGES'; manga: Manga }
  | { type: 'ERROR'; error: Error }

export function addManga(
  url: string,
  mangaList: MangaState
): (dispatch: Dispatch<Action>) => Promise<Action> {
  const adapter = adapterFromURL(url)

  return (dispatch) => {
    return scraper
      .scrape(url, adapter)
      .then((manga) =>
        manga.name in mangaList
          ? dispatch({ type: 'ERROR', error: 'ALREADY_EXISTS' })
          : dispatch({ type: ADD_MANGA, manga })
      )
  }
}

export function reloadManga(
  manga: Manga
): (dispatch: Dispatch<Action>) => Promise<void> {
  const adapter = adapterFromHostname(manga.type)
  const url = adapter.mangaURL(manga.name)
  return (dispatch) => {
    return scraper.scrape(url, adapter).then((manga) => {
      dispatch({ type: DIFF_CHANGES, manga })
    })
  }
}

export function removeManga(
  mangaName: string,
  navigate: NavigateFunction
): (dispatch: Dispatch<Action>) => Promise<Action> {
  return async (dispatch) => {
    await navigate('/')
    return await dispatch({ type: REMOVE_MANGA, name: mangaName })
  }
}

export function visitManga(mangaName: string): Action {
  return {
    type: VISIT_MANGA,
    mangaName,
  }
}

export function updatePage(
  manga: Manga,
  chapterNum: number,
  amount: number
): Action {
  return {
    type: UPDATE_PAGE,
    mangaName: manga.name,
    chapterNum,
    amount,
  }
}

export function updateChapter(mangaName: string, chapterNum: number): Action {
  return {
    type: UPDATE_CHAPTER,
    mangaName,
    chapterNum,
  }
}

export function setLoading(mangaName: string, chapterNum: number): Action {
  return {
    type: SET_LOADING,
    mangaName,
    chapterNum,
  }
}

export function downloadChapter(mangaName: string, chapterNum: number): Action {
  return {
    type: DOWNLOAD_CHAPTER,
    mangaName,
    chapterNum,
  }
}

export function loadChapter(
  manga: Manga,
  chapterNum: number,
  navigate: NavigateFunction,
  background = false
): (dispatch: Dispatch<Action>) => Promise<void> {
  const chapterRoute = `/chapter/${manga.name}/${chapterNum}`
  return async (dispatch) => {
    const mangaName = manga.name
    const chapter = manga.chapters[chapterNum]
    const chapterURL = chapter.url
    const loadState = chapter.loadState
    const adapter = adapterFromURL(chapterURL)

    switch (loadState) {
      case LoadStateType.LOADED:
        if (!background) {
          await navigate(chapterRoute)
          await dispatch(updateChapter(mangaName, chapterNum))
        }
        break
      case LoadStateType.LOADING:
        // Ignore action if the chapter is already loading.
        break
      case LoadStateType.NOT_LOADED:
        await dispatch(setLoading(mangaName, chapterNum))

        // Load chapter, then dispatch to update state, then dispatch to update router.
        const links = await scraper.scrapeChapter(chapterURL, adapter)
        if (links.length === 0) {
          await dispatch({ type: 'ERROR', error: 'EMPTY_CHAPTER' })
        } else {
          await dispatch({
            type: LOAD_CHAPTER,
            mangaName: mangaName,
            chapterNum,
            pages: links,
          })
          if (!background) {
            await navigate(chapterRoute)
            await dispatch(updateChapter(mangaName, chapterNum))
          }
        }
    }
  }
}
