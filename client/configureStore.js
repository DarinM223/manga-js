import { createStore, combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { manga } from './reducers/manga.js'

export const store = createStore(
  combineReducers({
    manga,
    routing: routerReducer
  })
)
