const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))
const fse = bluebird.promisifyAll(require('fs-extra'))
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

class DownloadQueue {
  constructor (path, file, sender, data = null) {
    this.path = path
    this.file = file
    this.sender = sender

    if (data === null || data.length === 0) {
      this.queue = []
    } else {
      this.queue = JSON.parse(data)
    }

    this.running = true
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

    // Restart queue if it stopped.
    if (!this.running) {
      this.running = true
      setTimeout(this.start.bind(this), 0)
    }
  }

  dequeue () {
    if (this.queue.length === 0) {
      return null
    }

    const result = this.queue.shift()
    return result
  }

  mangaPath (mangaName) {
    return path.join(this.path, mangaName)
  }

  chapterPath (mangaName, chapterNum) {
    return path.join(this.mangaPath(mangaName), chapterNum + '')
  }

  imagePath (mangaName, chapterNum, url) {
    const encodedURL = encodeURIComponent(url)
    return path.join(this.chapterPath(mangaName, chapterNum), encodedURL)
  }

  downloadImage (mangaName, chapterNum, url) {
    return fetch(url).then((res) => {
      return new Promise((resolve, reject) => {
        const imagePath = this.imagePath(mangaName, chapterNum, url)
        const dest = fs.createWriteStream(imagePath)
        const stream = res.body

        stream.pipe(dest)
        stream.on('end', resolve)
        stream.on('error', reject)
      })
    })
  }

  getDownloadedImage (mangaName, chapterNum, url) {
    const imagePath = this.imagePath(mangaName, chapterNum, url)

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
      this.running = false
      return Promise.resolve()
    }

    return fse.mkdirsAsync(this.chapterPath(top.mangaName, top.chapterNum))
      .then(() => this.getDownloadedImage(top.mangaName, top.chapterNum, top.url))
      .then((data) => {
        if (data === null) {
          return this.downloadImage(top.mangaName, top.chapterNum, top.url)
        }

        return Promise.resolve()
      })
      .then(() => {
        this.reply(Object.assign({}, top))
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
    .then((data) => new DownloadQueue(queuePath, file, sender, data.trim()))
}

module.exports = {
  DownloadQueue,
  startQueue
}
