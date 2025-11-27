import fs from 'fs/promises'
import * as loc from './utils/location.js'

export function downloadChapter (event, args, queue) {
  event.sender.send('recv-download-chapter', Object.assign({}, args, { err: null }))
  const { mangaName, chapterNum, type } = args

  // Enqueue download tasks for each image.
  args.pages.forEach((url, i) => {
    queue.enqueue({
      mangaName,
      chapterNum,
      type,
      url,
      total: args.pages.length,
      curr: i
    })
  })
}

export function deleteChapter (basePath, args) {
  const path = loc.chapterPath(basePath, args.mangaName, args.chapterNum)

  return fs.rm(path)
}

export function deleteManga (basePath, args) {
  const path = loc.mangaPath(basePath, args.mangaName)

  return fs.rm(path)
}
