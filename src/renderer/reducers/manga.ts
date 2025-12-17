import { LoadStateType, DownloadStateType } from '../../../utils/constants.ts'
import { Manga } from '../../../utils/manga.ts'
import {
  ADD_MANGA,
  REMOVE_MANGA,
  VISIT_MANGA,
  UPDATE_PAGE,
  LOAD_CHAPTER,
  DOWNLOAD_CHAPTER,
  DOWNLOADED_PAGE,
  UPDATE_CHAPTER,
  SET_LOADING,
  SET_DOWNLOAD_STATE,
  DIFF_CHANGES,
  Action
} from '../actions/manga.ts'
import { produce } from 'immer'
import { } from '../window.ts'

export type State = { readonly [mangaName: string]: Manga }
const initState = {} as const satisfies State

export function manga(state: State = initState, action: Action): State {
  switch (action.type) {
    case ADD_MANGA:
      return produce(state, (draft) => { draft[action.manga.name] = action.manga })
    case REMOVE_MANGA:
      return produce(state, (draft) => { delete draft[action.name] })
    case VISIT_MANGA:
      return produce(state, (draft) => { draft[action.mangaName].new = false })
    case UPDATE_PAGE:
      return produce(state, (draft) => {
        const totalPages = draft[action.mangaName].chapters[action.chapterNum].pages.length
        const page = draft[action.mangaName].chapters[action.chapterNum].currentPage
        const newPage = page + action.amount
        draft[action.mangaName].chapters[action.chapterNum].currentPage =
          newPage >= totalPages || newPage < 0 ? page : newPage
      })
    case SET_LOADING:
      return produce(state, (draft) => {
        draft[action.mangaName].chapters[action.chapterNum].loadState = LoadStateType.LOADING
      })
    case SET_DOWNLOAD_STATE:
      return produce(state, (draft) => {
        // Clear progress once downloaded.
        if (action.state === DownloadStateType.DOWNLOADED) {
          draft[action.mangaName].chapters[action.chapterNum].download.progress = 0
        }
        draft[action.mangaName].chapters[action.chapterNum].download.state = action.state
      })
    case DOWNLOADED_PAGE:
      return produce(state, (draft) => {
        draft[action.mangaName].chapters[action.chapterNum].download.progress = action.curr
      })
    case DOWNLOAD_CHAPTER:
      // Sends ipc call with the chapter's pages.
      const { mangaName, chapterNum } = action
      const type = state[mangaName].type
      const pages = state[mangaName].chapters[chapterNum].pages
      window.api.downloadChapter(mangaName, chapterNum, pages, type)
      return state
    case UPDATE_CHAPTER:
      return produce(state, (draft) => { draft[action.mangaName].currentChapter = action.chapterNum })
    case LOAD_CHAPTER:
      return produce(state, (draft) => {
        draft[action.mangaName].chapters[action.chapterNum].pages = action.pages
        draft[action.mangaName].chapters[action.chapterNum].loadState = LoadStateType.LOADED
      })
    case DIFF_CHANGES:
      return produce(state, (draft) => {
        draft[action.manga.name] = applyNewChanges(draft[action.manga.name], action.manga)
      })
    default:
      return state
  }
}

function applyNewChanges(oldManga: Manga, newManga: Manga): Manga {
  const oldMangaCount = oldManga.chapters.length
  const newMangaCount = newManga.chapters.length
  return produce(oldManga, (draft) => {
    if (oldMangaCount < newMangaCount) {
      // Add the new chapters to the old manga object.
      draft.new = true
      for (let i = oldMangaCount; i < newMangaCount; i++) {
        draft.chapters.push(newManga.chapters[i])
      }
    }
  })
}
