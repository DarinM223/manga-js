const { startDownloader } = require('./downloadQueue.js')

function downloadProcessHandler (path, file) {
  startDownloader(path, file, (msg) => process.send(msg)).then((downloader) => {
    process.send({ start: true })
    process.on('message', (msg) => {
      const [mangaName, chapterNum] = [msg.mangaName, msg.chapterNum]
      // Add chapter download task.
      downloader.addChapterTask(mangaName, chapterNum, msg.pages)
    })
  })
}

module.exports = { downloadProcessHandler }
