import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import { store } from './configureStore.js'
import { syncHistoryWithStore } from 'react-router-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import MainContainer from './containers/MainContainer.js'

injectTapEventPlugin()

const history = syncHistoryWithStore(hashHistory, store)

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router history={history}>
        <Route path='/' component={MainContainer} />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
)
