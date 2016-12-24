import { createStore, combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

const store = createStore(
  combineReducers({
    routing: routerReducer
  })
)

export default store
