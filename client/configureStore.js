import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
import thunk from 'redux-thunk'
import { manga } from './reducers/manga.js'
import { log } from './reducers/log.js'
import { saveState, loadState } from './storage.js'
import { hashHistory } from 'react-router'
import throttle from 'lodash/throttle'

const middleware = routerMiddleware(hashHistory)

export default function configureStore () {
  const persistedState = loadState()
  const store = createStore(
    combineReducers({
      manga,
      log,
      routing: routerReducer,
      toastr: toastrReducer
    }),
    persistedState,
    applyMiddleware(thunk, middleware)
  )

  store.subscribe(throttle(() => {
    saveState(store.getState())
  }), 1000)

  return store
}
