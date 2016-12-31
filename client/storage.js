import Immutable from 'immutable'
import { ipcRenderer } from 'electron'
import { restoreFromLog } from './restoreFromLog.js'

export function loadState () {
  try {
    const serializedState = ipcRenderer.sendSync('load-state')
    if (serializedState === null) {
      return undefined
    }

    const state = JSON.parse(serializedState)
    const [manga, log] = restoreFromLog(
      Immutable.fromJS(state.manga),
      Immutable.fromJS(state.log)
    )
    return Object.assign({}, state, { manga, log })
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export function saveState (state) {
  try {
    const manga = state.manga.toJS()
    const log = state.log.toJS()
    const savedState = Object.assign({}, state, { manga, log })
    const serializedState = JSON.stringify(savedState)
    ipcRenderer.send('save-state', serializedState)
  } catch (e) {
  }
}
