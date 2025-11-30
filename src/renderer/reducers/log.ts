import { SET_LOADING, LOAD_CHAPTER, Action } from '../actions/manga.ts'
import { produce } from 'immer'

type State = { [mangaName: string]: { [chapterNum: number]: boolean } }
export const initState = {} as const satisfies State


export function log(state: State = initState, action: Action): State {
  switch (action.type) {
    case SET_LOADING:
      return produce(state, (draft) => {
        draft[action.mangaName] = draft[action.mangaName] ?? {}
        draft[action.mangaName][action.chapterNum] = true
      })
    // return {
    //   ...state,
    //   [action.mangaName]: {
    //     ...state[action.mangaName],
    //     [action.chapterNum]: true
    //   }
    // }
    // return produce(state, (draft) => {
    //   draft[action.mangaName][action.chapterNum] = true
    // })
    case LOAD_CHAPTER:
      return produce(state, (draft) => {
        delete draft[action.mangaName][action.chapterNum]
        if (Object.keys(draft[action.mangaName]).length <= 0) {
          delete draft[action.mangaName]
        }
      })
    // let newState = state.deleteIn([action.mangaName, action.chapterNum])
    // if (newState.get(action.mangaName).count() <= 0) {
    //   newState = newState.delete(action.mangaName)
    // }
    // return newState
    default:
      return state
  }
}
