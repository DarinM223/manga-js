import { createStore, combineReducers, applyMiddleware } from '@reduxjs/toolkit'
import { reducer as toastrReducer } from 'react-redux-toastr'
import { manga } from './reducers/manga.ts'
import { log } from './reducers/log.js'
import { saveState, loadState } from './storage.js'
// import { hashHistory } from 'react-router-dom'
import throttle from 'lodash/throttle'
// import createLogger from 'redux-logger'

import { listenForIpc } from './ipcListener.js'

export default function configureStore (loadFromDisk = true) {
  const reducer = combineReducers({
    manga,
    log,
    toastr: toastrReducer
  })
  // const logger = createLogger()

  let store
  if (loadFromDisk) {
    const persistedState = loadState()
    store = createStore(reducer, persistedState, applyMiddleware(/* middleware, */))

    listenForIpc(store)
    store.subscribe(throttle(() => {
      saveState(store.getState())
    }), 1000)
  } else {
    store = createStore(reducer, applyMiddleware(thunk, middleware))
  }

  return store
}
