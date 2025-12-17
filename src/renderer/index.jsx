import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import loadStore from './configureStore.ts'
import { ThemeProvider, createTheme } from '@mui/material/styles'
// import { useScroll } from 'react-router-scroll'

import MangaViewComponent from './components/MangaViewComponent.tsx'
import MainComponent from './components/MainComponent.tsx'
import ChapterViewComponent from './components/ChapterViewComponent.jsx'

// Start the image downloader queue on the main process.
window.api.start()

const store = loadStore()
const theme = createTheme()
// const history = syncHistoryWithStore(hashHistory, store)
const root = ReactDOM.createRoot(document.getElementById('app'))

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <div>
        <ThemeProvider theme={theme}>
          <HashRouter
          // render={applyRouterMiddleware(useScroll())}
          >
            <Routes>
              <Route path='/' element={<MainComponent />} />
              <Route path='/manga/:name' element={<MangaViewComponent />} />
              <Route path='/chapter/:mangaName/:chapterNum' element={<ChapterViewComponent />} />
            </Routes>
          </HashRouter>
        </ThemeProvider>
      </div>
    </Provider>
  </React.StrictMode>
)
