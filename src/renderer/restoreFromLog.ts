import { LoadStateType } from '../../utils/constants.ts'
import { initState, State as LogState } from './reducers/log.ts'
import { State as MangaState } from './reducers/manga.ts'
import { produce } from 'immer'

export function restoreFromLog(
  manga: MangaState,
  log: LogState
): [MangaState, LogState] {
  const currManga = produce(manga, (draft) => {
    for (const mangaName in log) {
      for (const chapterNum in log[mangaName]) {
        draft[mangaName].chapters[+chapterNum].loadState =
          LoadStateType.NOT_LOADED
      }
    }
  })
  return [currManga, initState]
}
