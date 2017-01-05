const bluebird = require('bluebird')
const fse = bluebird.promisifyAll(require('fs-extra'))

function downloadChapter (event, args, queue) {
  event.sender.send('recv-download-chapter', Object.assign({}, args, { err: null }))

  const [mangaName, chapterNum] = [args.mangaName, args.chapterNum]

  // Enqueue download tasks for each image.
  args.pages.forEach((url, i) => {
    queue.enqueue({
      mangaName,
      chapterNum,
      url,
      total: args.pages.length,
      curr: i
    })
  })
}

function deleteChapter (args, queue) {
  const path = queue.chapterPath(args.mangaName, args.chapterNum)

  return fse.removeAsync(path)
}

function deleteManga (args, queue) {
  const path = queue.mangaPath(args.mangaName)

  return fse.removeAsync(path)
}

module.exports = {
  downloadChapter,
  deleteChapter,
  deleteManga
}
