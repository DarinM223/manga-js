import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom'
import configureStore from './configureStore.js'
import { ThemeProvider, createTheme } from '@mui/material/styles'
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
const theme = createTheme()
// const history = syncHistoryWithStore(hashHistory, store)
const root = ReactDOM.createRoot(document.getElementById('app'))

root.render(
  <React.StrictMode>
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
          <HashRouter
          // render={applyRouterMiddleware(useScroll())}
          >
            <Route path='/' component={MainContainer} onEnter={reloadMangaList(store)} />
            <Route path='/manga/:name' component={MangaViewContainer} onEnter={visitManga(store)} />
            <Route path='/chapter/:mangaName/:chapterNum' component={ChapterViewContainer} />
          </HashRouter>
        </ThemeProvider>
      </div>
    </Provider>
  </React.StrictMode>
)
