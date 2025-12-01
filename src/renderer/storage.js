import { fromJS } from 'immutable'
import { restoreFromLog } from './restoreFromLog.ts'

export function loadState() {
  try {
    const serializedState = window.api.loadState()
    if (serializedState === null) {
      return undefined
    }

    const state = JSON.parse(serializedState)
    const [manga, log] = restoreFromLog(
      fromJS(state.manga),
      fromJS(state.log)
    )
    return { ...state, manga, log }
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export function saveState(state) {
  try {
    const manga = state.manga.toJS()
    const log = state.log.toJS()
    const savedState = { ...state, manga, log }
    const serializedState = JSON.stringify(savedState)
    window.api.saveState(serializedState)
  } catch (e) {
    console.log(e)
  }
}
