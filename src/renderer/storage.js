import { restoreFromLog } from './restoreFromLog.ts'

export function loadState() {
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

export function saveState(state) {
  try {
    const serializedState = JSON.stringify(state)
    window.api.saveState(serializedState)
  } catch (e) {
    console.log(e)
  }
}
