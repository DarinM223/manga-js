const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))
const fse = bluebird.promisifyAll(require('fs-extra'))
const fetch = require('node-fetch')
const loc = require('./location.js')
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
  constructor (path, file, send, data = null) {
    this.path = path
    this.file = file
    this.send = send

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

  downloadImage (mangaName, chapterNum, url) {
    return fetch(url).then((res) => {
      return new Promise((resolve, reject) => {
        const imagePath = loc.imagePath(this.path, mangaName, chapterNum, url)
        const dest = fs.createWriteStream(imagePath)
        const stream = res.body

        stream.pipe(dest)
        stream.on('end', resolve)
        stream.on('error', reject)
      })
    })
  }

  isDownloadedImage (mangaName, chapterNum, url) {
    const imagePath = loc.imagePath(this.path, mangaName, chapterNum, url)

    return new Promise((resolve, reject) => {
      return fs.openAsync(imagePath, 'r')
        .then((fd) => fs.closeAsync(fd))
        .then(() => resolve(true))
        .catch(() => resolve(false))
    })
  }

  reply (msg) {
    this.send(msg)
  }

  start () {
    const top = this.dequeue()
    if (top === null) {
      this.running = false
      return Promise.resolve()
    }

    return fse.mkdirsAsync(loc.chapterPath(this.path, top.mangaName, top.chapterNum))
      .then(() => this.isDownloadedImage(top.mangaName, top.chapterNum, top.url))
      .then((downloaded) => {
        if (!downloaded) {
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

function startQueue (queuePath, file, send) {
  const completePath = path.join(queuePath, file)
  return fs.openAsync(completePath, 'a')
    .then((fd) => fs.closeAsync(fd))
    .then(() => fs.readFileAsync(completePath, 'utf-8'))
    .then((data) => new DownloadQueue(queuePath, file, send, data.trim()))
}

module.exports = {
  DownloadQueue,
  startQueue
}
