import { State as LogState } from './reducers/log.ts'
import { State as MangaState } from './reducers/manga.ts'
import { restoreFromLog } from './restoreFromLog.ts'
import {} from './window.ts'

export type State = { manga: MangaState; log: LogState }

export function loadState(): State | undefined {
  try {
    const serializedState = window.api.loadState()
    if (serializedState === null) {
      return undefined
    }

    const state = JSON.parse(serializedState)
    const [manga, log] = restoreFromLog(state.manga, state.log)
    return { ...state, manga, log }
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export function saveState(state: State) {
  try {
    const serializedState = JSON.stringify(state)
    window.api.saveState(serializedState)
  } catch (e) {
    console.log(e)
  }
}
