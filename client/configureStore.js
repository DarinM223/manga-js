import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
import thunk from 'redux-thunk'
import { manga } from './reducers/manga.js'

export const store = createStore(
  combineReducers({
    manga,
    routing: routerReducer,
    toastr: toastrReducer
  }),
  applyMiddleware(thunk)
)
