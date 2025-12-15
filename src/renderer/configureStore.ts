import { configureStore, EnhancedStore, ThunkDispatch } from '@reduxjs/toolkit'
import { manga } from './reducers/manga.ts'
import { log } from './reducers/log.js'
import { saveState, loadState, State } from './storage.ts'
import throttle from 'lodash/throttle'
import { listenForIpc } from './ipcListener.ts'
import { Action } from './actions/manga.ts'

export type AppStore = {
  dispatch: ThunkDispatch<State, undefined, Action>;
} & EnhancedStore<State, Action>

export default function loadStore(loadFromDisk = true): AppStore {
  const reducer = {
    manga,
    log,
  }

  if (loadFromDisk) {
    const preloadedState = loadState()
    const store = configureStore<State, Action>({ reducer, preloadedState })

    listenForIpc(store)
    store.subscribe(throttle(() => {
      saveState(store.getState())
    }, 1000))
    return store
  } else {
    return configureStore<State, Action>({ reducer })
  }
}
