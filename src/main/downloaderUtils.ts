import Electron from 'electron'
import fs from 'fs/promises'
import * as loc from '../utils/location.ts'
import { DownloadQueue } from '../utils/DownloadQueue.ts'

type DeleteChapterArgs = {
  readonly mangaName: string
  readonly chapterNum: number
}
type DownloadChapterArgs = DeleteChapterArgs & {
  readonly pages: string[]
  readonly type: string
}

export function downloadChapter(
  event: Electron.IpcMainEvent,
  args: DownloadChapterArgs,
  queue: DownloadQueue
) {
  event.sender.send(
    'recv-download-chapter',
    Object.assign({}, args, { err: null })
  )
  const { mangaName, chapterNum, type } = args

  // Enqueue download tasks for each image.
  args.pages.forEach((url, i) => {
    queue.enqueue({
      mangaName,
      chapterNum,
      type,
      url,
      total: args.pages.length,
      curr: i,
    })
  })
}

export function deleteChapter(basePath: string, args: DeleteChapterArgs) {
  const path = loc.chapterPath(basePath, args.mangaName, args.chapterNum)

  return fs.rm(path, { recursive: true })
}

export function deleteManga(basePath: string, args: { mangaName: string }) {
  const path = loc.mangaPath(basePath, args.mangaName)

  return fs.rm(path, { recursive: true })
}
