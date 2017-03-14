const bluebird = require('bluebird')
const fse = bluebird.promisifyAll(require('fs-extra'))
const loc = require('./utils/location.js')

function downloadChapter (event, args, queue) {
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

function deleteChapter (basePath, args) {
  const path = loc.chapterPath(basePath, args.mangaName, args.chapterNum)

  return fse.removeAsync(path)
}

function deleteManga (basePath, args) {
  const path = loc.mangaPath(basePath, args.mangaName)

  return fse.removeAsync(path)
}

module.exports = {
  downloadChapter,
  deleteChapter,
  deleteManga
}
