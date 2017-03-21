import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyRouterMiddleware, Router, Route, hashHistory } from 'react-router'
import configureStore from './configureStore.js'
import { syncHistoryWithStore } from 'react-router-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ReduxToastr from 'react-redux-toastr'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { ipcRenderer } from 'electron'
import { useScroll } from 'react-router-scroll'

import MainContainer from './containers/MainContainer.js'
import MangaViewContainer from './containers/MangaViewContainer.js'
import ChapterViewContainer from './containers/ChapterViewContainer.js'
import { reloadMangaList, visitManga } from './actions/manga.js'

// Start the image downloader queue on the main process.
ipcRenderer.sendSync('start')

injectTapEventPlugin()

const store = configureStore()
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
        <Router
          history={history}
          render={applyRouterMiddleware(useScroll())}
        >
          <Route path='/' component={MainContainer} onEnter={reloadMangaList(store)} />
          <Route path='/manga/:name' component={MangaViewContainer} onEnter={visitManga(store)} />
          <Route path='/chapter/:mangaName/:chapterNum' component={ChapterViewContainer} />
        </Router>
      </MuiThemeProvider>
    </div>
  </Provider>,
  document.getElementById('app')
)
