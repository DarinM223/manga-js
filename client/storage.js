import Immutable from 'immutable'
import { ipcRenderer } from 'electron'

export function loadState () {
  try {
    const serializedState = ipcRenderer.sendSync('load-state')
    if (serializedState === null) {
      return undefined
    }

    const state = JSON.parse(serializedState)
    const manga = Immutable.fromJS(state.manga)
    return Object.assign({}, state, { manga })
  } catch (e) {
    return undefined
  }
}

export function saveState (state) {
  try {
    const manga = state.manga.toJS()
    const savedState = Object.assign({}, state, { manga })
    const serializedState = JSON.stringify(savedState)
    ipcRenderer.send('save-state', serializedState)
  } catch (e) {
  }
}
