import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import { store } from './configureStore.js'
import { syncHistoryWithStore } from 'react-router-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ReduxToastr from 'react-redux-toastr'
import injectTapEventPlugin from 'react-tap-event-plugin'

import MainContainer from './containers/MainContainer.js'
import MangaViewContainer from './containers/MangaViewContainer.js'
import ChapterViewContainer from './containers/ChapterViewContainer.js'

injectTapEventPlugin()

const history = syncHistoryWithStore(hashHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <div>
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        position='top-right'
        transitionIn='fadeIn'
        transitionOut='fadeOut'
        progressBar
      />
      <MuiThemeProvider>
        <Router history={history}>
          <Route path='/' component={MainContainer} />
          <Route path='/manga/:name' component={MangaViewContainer} />
          <Route path='/chapter/:mangaName/:chapterNum' component={ChapterViewContainer} />
        </Router>
      </MuiThemeProvider>
    </div>
  </Provider>,
  document.getElementById('app')
)
