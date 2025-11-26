import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyRouterMiddleware, Router, Route, hashHistory } from 'react-router-dom'
import configureStore from './configureStore.js'
import { ThemeProvider, createMuiTheme } from '@mui/material/styles'
import ReduxToastr from 'react-redux-toastr'
import { ipcRenderer } from 'electron'
// import { useScroll } from 'react-router-scroll'

import MainContainer from './containers/MainContainer.js'
import MangaViewContainer from './containers/MangaViewContainer.js'
import ChapterViewContainer from './containers/ChapterViewContainer.js'
import { reloadMangaList, visitManga } from './actions/manga.js'

// Start the image downloader queue on the main process.
ipcRenderer.sendSync('start')

const store = configureStore()
const theme = createMuiTheme()
// const history = syncHistoryWithStore(hashHistory, store)

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
      <ThemeProvider theme={theme}>
        <Router
          history={history}
          // render={applyRouterMiddleware(useScroll())}
        >
          <Route path='/' component={MainContainer} onEnter={reloadMangaList(store)} />
          <Route path='/manga/:name' component={MangaViewContainer} onEnter={visitManga(store)} />
          <Route path='/chapter/:mangaName/:chapterNum' component={ChapterViewContainer} />
        </Router>
      </ThemeProvider>
    </div>
  </Provider>,
  document.getElementById('app')
)
