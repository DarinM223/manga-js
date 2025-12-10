import fs from 'fs/promises'
import * as loc from './location.js'
import path from 'path'
import { adapterFromHostname } from './url.js'
import process from 'process'

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

export class DownloadQueue {
  constructor(path, file, send, data = null) {
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
  write() {
    const queuePath = path.join(this.path, this.file)
    return fs.writeFile(queuePath, JSON.stringify(this.queue), 'utf-8')
  }

  enqueue(data) {
    this.queue.push(data)

    // Restart queue if it stopped.
    if (!this.running) {
      this.running = true
      setTimeout(this.start.bind(this), 0)
    }
  }

  dequeue() {
    if (this.queue.length === 0) {
      return null
    }

    const result = this.queue.shift()
    return result
  }

  downloadImage(mangaName, chapterNum, url, type) {
    const adapter = adapterFromHostname(type)
    const imagePath = loc.imagePath(this.path, mangaName, chapterNum, url)
    if (url.startsWith('/')) {
      url = process.env.ELECTRON_RENDERER_URL + url
    }
    return adapter.sendRequest(url, true)
      .then((chunk) => fs.writeFile(imagePath, Buffer.from(chunk)))
      .catch((err) => console.error(err))
  }

  isDownloadedImage(mangaName, chapterNum, url) {
    const imagePath = loc.imagePath(this.path, mangaName, chapterNum, url)

    return new Promise((resolve, reject) => {
      return fs.open(imagePath, 'r')
        .then((fd) => fd.close())
        .then(() => resolve(true))
        .catch(() => resolve(false))
    })
  }

  reply(msg) {
    this.send(msg)
  }

  start() {
    const top = this.dequeue()
    if (top === null) {
      this.running = false
      return Promise.resolve()
    }

    return fs.mkdir(loc.chapterPath(this.path, top.mangaName, top.chapterNum), { recursive: true })
      .then(() => this.isDownloadedImage(top.mangaName, top.chapterNum, top.url))
      .then((downloaded) => {
        if (!downloaded) {
          return this.downloadImage(top.mangaName, top.chapterNum, top.url, top.type)
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

export function startQueue(queuePath, file, send) {
  const completePath = path.join(queuePath, file)
  return fs.open(completePath, 'a')
    .then((fd) => fd.close())
    .then(() => fs.readFile(completePath, 'utf-8'))
    .then((data) => new DownloadQueue(queuePath, file, send, data.trim()))
}