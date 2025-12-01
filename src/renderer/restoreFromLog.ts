import { LoadStateType } from '../../utils/constants.js'
import { initState, State as LogState } from './reducers/log.js'
import { State as MangaState } from './reducers/manga.ts';
import { produce } from 'immer';

export function restoreFromLog(manga: MangaState, log: LogState): [MangaState, LogState] {
  const currManga = produce(manga, (draft) => {
    for (const mangaName in log) {
      const chapters = log[mangaName]
      for (const chapterNum of Object.keys(chapters) as unknown as Array<keyof typeof chapters>) {
        draft[mangaName].chapters[chapterNum].loadState = LoadStateType.NOT_LOADED
      }
    }
  })
  return [currManga, initState]
}
