import { ADD_MANGA, REMOVE_MANGA, UPDATE_PAGE, LOAD_CHAPTER, UPDATE_CHAPTER } from '../actions/manga.js'
import Immutable from 'immutable'

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
      const currentPage = state.getIn([action.mangaName, 'chapters', action.chapterNum, 'currentPage'])
      const newPage = currentPage + action.amount

      if (newPage >= totalPages || newPage < 0) {
        return state
      } else {
        return state.setIn(
          [action.mangaName, 'chapters', action.chapterNum, 'currentPage'],
          newPage
        )
      }
    case UPDATE_CHAPTER:
      return state.setIn([action.mangaName, 'currentChapter'], action.chapterNum)
    case LOAD_CHAPTER:
      return state
        .setIn([action.mangaName, 'chapters', action.chapterNum, 'pages'], Immutable.fromJS(action.pages))
        .setIn([action.mangaName, 'chapters', action.chapterNum, 'loaded'], true)
    default:
      return state
  }
}
