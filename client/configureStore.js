import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'
import { manga } from './reducers/manga.js'

export const store = createStore(
  combineReducers({
    manga,
    routing: routerReducer
  }),
  applyMiddleware(thunk)
)
