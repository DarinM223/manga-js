const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))
const fetch = require('node-fetch')
const path = require('path')

/*
 * Queue format:
 * [
 *   {
 *     mangaName: string,
 *     chapterNum: number,
 *     url: string,
 *     total: number,
 *     curr: number
 *   },
 *   ...
 * ]
 */

class PersistentQueue {
  constructor (path, file, sender, data = null) {
    this.path = path
    this.file = file
    this.sender = sender

    if (data === null || data.length === 0) {
      this.queue = []
    } else {
      this.queue = JSON.parse(data)
    }

    this.start()
  }

  // Super slow stringifies and writes the entire JSON.
  // Doesn't matter for now since the size of the queue will be small, YOLO >_<
  write () {
    const queuePath = path.join(this.path, this.file)
    return fs.writeFileAsync(queuePath, JSON.stringify(this.queue), 'utf-8')
  }

  enqueue (data) {
    this.queue.push(data)

    // Restart queue if it went empty.
    if (this.queue.length <= 1) {
      this.start()
    }
  }

  dequeue () {
    if (this.queue.length === 0) {
      return null
    }

    const result = this.queue.shift()
    return result
  }

  downloadImage (url) {
    return fetch(url)
      .then((res) => {
        const encodedURL = encodeURIComponent(url)
        const imagePath = path.join(this.path, encodedURL)
        const dest = fs.createWriteStream(imagePath)
        res.body.pipe(dest)
      })
  }

  getDownloadedImage (url) {
    const encodedURL = encodeURIComponent(url)
    const imagePath = path.join(this.path, encodedURL)

    return new Promise((resolve, reject) => {
      return fs.readFileAsync(imagePath, 'utf-8')
        .then((data) => resolve(data))
        .catch(() => resolve(null))
    })
  }

  reply (msg) {
    this.sender.send('recv-downloaded', msg)
  }

  start () {
    const top = this.dequeue()
    if (top === null) {
      return Promise.resolve()
    }

    return this.getDownloadedImage(top.url)
      .then((data) => {
        if (data === null) {
          return this.downloadImage(top.url)
        }

        return Promise.resolve()
      })
      .then(() => {
        if (top.curr >= top.total - 1) {
          const [mangaName, chapterNum] = [top.mangaName, top.chapterNum]
          this.reply({ mangaName, chapterNum })
        }

        return this.write()
      })
      .then(() => this.start())
  }
}

function startQueue (queuePath, file, sender) {
  const completePath = path.join(queuePath, file)
  return fs.openAsync(completePath, 'a')
    .then((fd) => fs.closeAsync(fd))
    .then(() => fs.readFileAsync(completePath, 'utf-8'))
    .then((data) => new PersistentQueue(queuePath, file, sender, data.trim()))
}

module.exports = {
  PersistentQueue,
  startQueue
}
