import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
import thunk from 'redux-thunk'
import { manga } from './reducers/manga.js'
import { log } from './reducers/log.js'
import { saveState, loadState } from './storage.js'
import { hashHistory } from 'react-router'
import throttle from 'lodash/throttle'
import createLogger from 'redux-logger'

import { listenForIpc } from './ipcListener.js'

const middleware = routerMiddleware(hashHistory)

export default function configureStore (loadFromDisk = true) {
  const reducer = combineReducers({
    manga,
    log,
    routing: routerReducer,
    toastr: toastrReducer
  })
  const logger = createLogger()

  let store
  if (loadFromDisk) {
    const persistedState = loadState()
    store = createStore(reducer, persistedState, applyMiddleware(thunk, middleware, logger))

    listenForIpc(store)
    store.subscribe(throttle(() => {
      saveState(store.getState())
    }), 1000)
  } else {
    store = createStore(reducer, applyMiddleware(thunk, middleware))
  }

  return store
}
