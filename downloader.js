const bluebird = require('bluebird')
const fse = bluebird.promisifyAll(require('fs-extra'))
const loc = require('./utils/location.js')

function downloadChapter (event, args, worker) {
  event.sender.send('recv-download-chapter', Object.assign({}, args, { err: null }))

  // Send the download chapter message to the downloader process.
  worker.send(args)
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
