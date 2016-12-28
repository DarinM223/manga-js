import { ADD_MANGA, REMOVE_MANGA, UPDATE_PAGE } from '../actions/manga.js'
import Immutable from 'immutable'

const initState = Immutable.fromJS({
  'schooldays': {
    type: 'mangareader',
    name: '',
    title: 'School Days',
    description: 'Nice boat',
    image: 'https://myanimelist.cdn-dena.com/images/anime/13/17594.webp',
    new: true,
    chapters: []
  },
  'keijo': {
    type: 'mangareader',
    name: 'keijo',
    title: 'Keijo!!!!!!',
    description: 'Saving anime with the plot and backstory',
    image: 'https://myanimelist.cdn-dena.com/images/anime/10/81906.webp',
    new: false,
    chapters: []
  }
})

export function manga (state = initState, action) {
  switch (action.type) {
    case ADD_MANGA:
      const manga = Immutable.fromJS(action.manga)
      return state.set(action.manga.name, manga)
    case REMOVE_MANGA:
      return state
    case UPDATE_PAGE:
      return state
    default:
      return state
  }
}
