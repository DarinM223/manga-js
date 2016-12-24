import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Link, Router, Route, hashHistory } from 'react-router'
import store from './configureStore.js'
import { syncHistoryWithStore } from 'react-router-redux'

const history = syncHistoryWithStore(hashHistory, store)

function Foo () {
  return (
    <div>
      <h1>Hello world!</h1>
      <Link to={'/'}>Back</Link>
    </div>
  )
}

function Bar () {
  return (
    <div>
      <h2>Hello world!</h2>
      <Link to={'/'}>Back</Link>
    </div>
  )
}

function App () {
  return (
    <div>
      <h1>Hello world!</h1>
      <li><Link to={'/foo'}>foo</Link></li>
      <li><Link to={'/bar'}>bar</Link></li>
    </div>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App} />
      <Route path='/foo' component={Foo} />
      <Route path='/bar' component={Bar} />
    </Router>
  </Provider>,
  document.getElementById('app')
)
