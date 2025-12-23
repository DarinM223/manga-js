import { Action } from '../actions/manga.ts'
import { produce } from 'immer'

export type State = { [mangaName: string]: { [chapterNum: number]: boolean } }
export const initState = {} as const satisfies State

export function log(state: State = initState, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
      return produce(state, (draft) => {
        draft[action.mangaName] = draft[action.mangaName] ?? {}
        draft[action.mangaName][action.chapterNum] = true
      })
    case 'LOAD_CHAPTER':
      return produce(state, (draft) => {
        delete draft[action.mangaName][action.chapterNum]
        if (Object.keys(draft[action.mangaName]).length <= 0) {
          delete draft[action.mangaName]
        }
      })
    default:
      return state
  }
}
