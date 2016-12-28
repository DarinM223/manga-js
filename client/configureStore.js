import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
import thunk from 'redux-thunk'
import { manga } from './reducers/manga.js'
import { hashHistory } from 'react-router'

const middleware = routerMiddleware(hashHistory)
export const store = createStore(
  combineReducers({
    manga,
    routing: routerReducer,
    toastr: toastrReducer
  }),
  applyMiddleware(thunk, middleware)
)
