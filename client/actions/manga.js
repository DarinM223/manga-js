export const ADD_MANGA = 'ADD_MANGA'
export const REMOVE_MANGA = 'REMOVE_MANGA'
export const UPDATE_PAGE = 'UPDATE_PAGE'

// TODO(DarinM223): implement these helper functions.

export function addManga (url) {
  return (dispatch) => {
    console.log(`Adding manga with url: ${url}`)

    dispatch({
      type: ADD_MANGA
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
