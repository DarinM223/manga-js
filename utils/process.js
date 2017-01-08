const { startQueue } = require('./downloadQueue.js')

/**
 * Sends a bunch of messages in a specified interval
 * in order to reduce the amount of messages needed to be sent
 * to the main process.
 */
class BulkSender {
  constructor (send) {
    this.downloadData = {}
    this.send = send

    this.start()
  }

  add (msg) {
    if (!(msg.mangaName in this.downloadData)) {
      this.downloadData[msg.mangaName] = {}
    }
    if (!(msg.chapterNum in this.downloadData[msg.mangaName])) {
      this.downloadData[msg.mangaName][msg.chapterNum] = {
        total: msg.total,
        curr: msg.curr
      }
    } else {
      this.downloadData[msg.mangaName][msg.chapterNum].curr = Math.max(
        msg.curr,
        this.downloadData[msg.mangaName][msg.chapterNum].curr
      )
    }
  }

  start () {
    setInterval(() => {
      if (Object.keys(this.downloadData).length !== 0) {
        let messages = []
        Object.keys(this.downloadData).forEach((mangaName) => {
          Object.keys(this.downloadData[mangaName]).forEach((chapterNum) => {
            const data = this.downloadData[mangaName][chapterNum]
            messages.push({
              mangaName,
              chapterNum,
              total: data.total,
              curr: data.curr
            })
          })
        })
        this.downloadData = {}
        this.send(messages)
      }
    }, 1000)
  }
}

function downloadProcessHandler (path, file) {
  const sender = new BulkSender((bulkMsg) => process.send(bulkMsg))
  startQueue(path, file, (msg) => sender.add(msg)).then((queue) => {
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

module.exports = {
  BulkSender,
  downloadProcessHandler
}
