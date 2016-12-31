import Immutable from 'immutable'

import { LOADING, LOADED } from '../../utils/constants.js'

import {
  ADD_MANGA,
  REMOVE_MANGA,
  UPDATE_PAGE,
  LOAD_CHAPTER,
  UPDATE_CHAPTER,
  SET_LOADING
} from '../actions/manga.js'

const initState = Immutable.fromJS({})

export function manga (state = initState, action) {
  switch (action.type) {
    case ADD_MANGA:
      const manga = Immutable.fromJS(action.manga)
      return state.set(action.manga.name, manga)
    case REMOVE_MANGA:
      return state.delete(action.name)
    case UPDATE_PAGE:
      const totalPages = state.getIn([action.mangaName, 'chapters', action.chapterNum, 'pages']).count()
      return state.updateIn([action.mangaName, 'chapters', action.chapterNum, 'currentPage'], page => {
        const newPage = page + action.amount

        if (newPage >= totalPages || newPage < 0) {
          return page
        } else {
          return newPage
        }
      })
    case SET_LOADING:
      return state.setIn([action.mangaName, 'chapters', action.chapterNum, 'loadState'], LOADING)
    case UPDATE_CHAPTER:
      return state.setIn([action.mangaName, 'currentChapter'], action.chapterNum)
    case LOAD_CHAPTER:
      return state
        .setIn([action.mangaName, 'chapters', action.chapterNum, 'pages'], Immutable.fromJS(action.pages))
        .setIn([action.mangaName, 'chapters', action.chapterNum, 'loadState'], LOADED)
    default:
      return state
  }
}
