import Immutable from 'immutable'

import { SET_LOADING, LOAD_CHAPTER } from '../actions/manga.js'

export const initState = Immutable.fromJS({})

export function log (state = initState, action) {
  switch (action.type) {
    case SET_LOADING:
      return state.setIn([action.mangaName, action.chapterNum], true)
    case LOAD_CHAPTER:
      let newState = state.deleteIn([action.mangaName, action.chapterNum])
      if (newState.get(action.mangaName).count() <= 0) {
        newState = newState.delete(action.mangaName)
      }
      return newState
    default:
      return state
  }
}
