import { configureStore, Store } from '@reduxjs/toolkit'
import { reducer as toastrReducer, ToastrState } from 'react-redux-toastr'
import { manga } from './reducers/manga.ts'
import { log } from './reducers/log.js'
import { saveState, loadState, State } from './storage.ts'
import throttle from 'lodash/throttle'
import { listenForIpc } from './ipcListener.js'
import { Action } from './actions/manga.ts'

export type AppStore = Store<State, Action>

export default function loadStore(loadFromDisk = true): AppStore {
  const reducer = {
    manga,
    log,
    toastr: toastrReducer
  }

  let store: AppStore
  if (loadFromDisk) {
    const preloadedState = loadState()
    store = configureStore({ reducer, preloadedState })

    listenForIpc(store)
    store.subscribe(throttle(() => {
      saveState(store.getState())
    }, 1000))
  } else {
    store = configureStore({ reducer })
  }

  return store
}
