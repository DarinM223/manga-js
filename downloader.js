const { startQueue } = require('./utils/downloadQueue.js')
const BulkSender = require('./utils/BulkSender.js')

function downloadProcessHandler (path, file) {
  const sender = new BulkSender((bulkMsg) => process.send(bulkMsg))
  startQueue(path, file, (msg) => sender.add(msg)).then((queue) => {
    process.send({ start: true })
    process.on('message', (msg) => {
      const { mangaName, chapterNum, type } = msg
      // Enqueue download tasks for each image.
      msg.pages.forEach((url, i) => {
        queue.enqueue({
          mangaName,
          chapterNum,
          type,
          url,
          total: msg.pages.length,
          curr: i
        })
      })
    })
  })
}

// Download process code.
process.on('message', (msg) => {
  if (msg.path) {
    downloadProcessHandler(msg.path, 'queue.json')
  }
})
