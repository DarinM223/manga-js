import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import configureStore from './configureStore.js'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ReduxToastr from 'react-redux-toastr'
// import { useScroll } from 'react-router-scroll'

import MainContainer from './containers/MainContainer.js'
import MangaViewContainer from './containers/MangaViewContainer.js'
import ChapterViewContainer from './containers/ChapterViewContainer.js'
import { reloadMangaList, visitManga } from './actions/manga.js'

// Start the image downloader queue on the main process.
window.api.start()

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
            <Routes>
              <Route path='/' element={MainContainer} onEnter={reloadMangaList(store)} />
              <Route path='/manga/:name' element={MangaViewContainer} onEnter={visitManga(store)} />
              <Route path='/chapter/:mangaName/:chapterNum' element={ChapterViewContainer} />
            </Routes>
          </HashRouter>
        </ThemeProvider>
      </div>
    </Provider>
  </React.StrictMode>
)
