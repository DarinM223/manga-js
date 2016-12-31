import { NOT_LOADED } from '../utils/constants.js'
import { initState } from './reducers/log.js'

export function restoreFromLog (manga, log) {
  let currManga = manga
  for (const mangaName of log.keys()) {
    for (const chapterNum of log.get(mangaName).keys()) {
      currManga = currManga.setIn([mangaName, 'chapters', chapterNum, 'loadState'], NOT_LOADED)
    }
  }
  return [currManga, initState]
}
