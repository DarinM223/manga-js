export const ADD_MANGA = 'ADD_MANGA'
export const REMOVE_MANGA = 'REMOVE_MANGA'
export const UPDATE_PAGE = 'UPDATE_PAGE'

// TODO(DarinM223): implement these helper functions.

function addManga () {
  return (dispatch) => {
    // TODO(DarinM223): add anime to database.

    dispatch({
      type: ADD_MANGA
    })
  }
}

function removeManga () {
  return (dispatch) => {
    // TODO(DarinM223): remove anime from database.

    dispatch({
      type: REMOVE_MANGA
    })
  }
}

function updatePage () {
  return (dispatch) => {
    // TODO(DarinM223): update page in database.

    dispatch({
      type: UPDATE_PAGE
    })
  }
}
