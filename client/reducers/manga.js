import { ADD_MANGA, REMOVE_MANGA, UPDATE_PAGE } from '../actions/manga.js'
import { List, Record } from 'immutable'

const Manga = Record({
  type: '',
  name: '',
  title: '',
  description: '',
  image: '',
  new: true
})

const initState = List([
  new Manga({
    type: 'mangareader',
    name: '',
    title: 'School Days',
    description: 'Nice boat',
    image: 'https://myanimelist.cdn-dena.com/images/anime/13/17594.webp',
    new: true
    // totalChapters: 60,
    // currentChapter: 20
  }),
  new Manga({
    type: 'mangareader',
    name: '',
    title: 'Keijo!!!!!!',
    description: 'Saving anime with the plot and backstory',
    image: 'https://myanimelist.cdn-dena.com/images/anime/10/81906.webp',
    new: false
    // totalChapters: 20,
    // currentChapter: 19
  })
])

export function manga (state = initState, action) {
  switch (action.type) {
    case ADD_MANGA:
      return state.push(new Manga(action.manga))
    case REMOVE_MANGA:
      return state
    case UPDATE_PAGE:
      return state
    default:
      return state
  }
}
