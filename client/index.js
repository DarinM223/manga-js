import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import store from './configureStore.js'
import { syncHistoryWithStore } from 'react-router-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import MainComponent from './components/MainComponent.js'

injectTapEventPlugin()

function App () {
  const manga = [
    {
      title: 'School Days',
      description: 'Nice boat',
      image: 'https://myanimelist.cdn-dena.com/images/anime/13/17594.webp',
      new: true,
      totalChapters: 60,
      currentChapter: 20
    },
    {
      title: 'Keijo!!!!!!',
      description: 'Saving anime with the plot and backstory',
      image: 'https://myanimelist.cdn-dena.com/images/anime/10/81906.webp',
      new: false,
      totalChapters: 20,
      currentChapter: 19
    }
  ]

  return <MainComponent manga={manga} />
}

const history = syncHistoryWithStore(hashHistory, store)

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router history={history}>
        <Route path='/' component={App} />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
)
