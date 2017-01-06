const { startQueue } = require('./downloadQueue.js')

function downloadProcessHandler (path, file) {
  startQueue(path, file, (msg) => process.send(msg)).then((queue) => {
    process.send({ start: true })
    process.on('message', (msg) => {
      const [mangaName, chapterNum] = [msg.mangaName, msg.chapterNum]
      // Enqueue download tasks for each image.
      msg.pages.forEach((url, i) => {
        queue.enqueue({
          mangaName,
          chapterNum,
          url,
          total: msg.pages.length,
          curr: i
        })
      })
    })
  })
}

module.exports = { downloadProcessHandler }
