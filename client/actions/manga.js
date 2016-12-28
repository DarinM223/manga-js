import { actions } from 'react-redux-toastr'

export const ADD_MANGA = 'ADD_MANGA'
export const REMOVE_MANGA = 'REMOVE_MANGA'
export const UPDATE_PAGE = 'UPDATE_PAGE'

// TODO(DarinM223): implement these helper functions.

export function addManga (url, mangaList) {
  const scraper = require('../../utils/scraper.js')
  const adapter = require('../../utils/sites/mangareader.js')

  return (dispatch) => {
    // TODO(DarinM223): also add to database.
    scraper.scrape(url, adapter).then((manga) => {
      if (manga.name in mangaList) {
        dispatch(actions.add({
          type: 'error',
          title: 'Manga already exists',
          message: 'The manga with the given name already exists in the list',
          options: {
            showCloseButton: true
          }
        }))
      } else {
        dispatch({
          type: ADD_MANGA,
          manga: manga
        })
      }
    })
  }
}

export function removeManga () {
  return (dispatch) => {
    // TODO(DarinM223): remove anime from database.

    dispatch({
      type: REMOVE_MANGA
    })
  }
}

export function updatePage () {
  return (dispatch) => {
    // TODO(DarinM223): update page in database.

    dispatch({
      type: UPDATE_PAGE
    })
  }
}
