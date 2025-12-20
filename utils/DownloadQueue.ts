import fs from 'fs/promises'
import * as loc from './location.ts'
import path from 'path'
import { adapterFromHostname } from './url.ts'
import process from 'process'

type Immutable<T> = { readonly [K in keyof T]: T[K] }
export type Task = Immutable<{
  mangaName: string
  chapterNum: number
  type: string
  url: string
  total: number
  curr: number
}>

export class DownloadQueue {
  path: string
  file: string
  queue: Task[]
  running: boolean
  send: (msg: Task) => void

  constructor(
    path: string,
    file: string,
    send: (msg: Task) => void,
    data: string | null = null
  ) {
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
  write(): Promise<void> {
    const queuePath = path.join(this.path, this.file)
    return fs.writeFile(queuePath, JSON.stringify(this.queue), 'utf-8')
  }

  enqueue(data: Task): void {
    this.queue.push(data)

    // Restart queue if it stopped.
    if (!this.running) {
      this.running = true
      setTimeout(this.start.bind(this), 0)
    }
  }

  dequeue(): Task | null {
    if (this.queue.length === 0) {
      return null
    }

    const result = this.queue.shift()
    if (result === undefined) {
      return null
    }
    return result
  }

  downloadImage(
    mangaName: string,
    chapterNum: number,
    url: string,
    type: string
  ): Promise<void> {
    const adapter = adapterFromHostname(type)
    const imagePath = loc.imagePath(this.path, mangaName, chapterNum, url)
    if (url.startsWith('/')) {
      url = process.env.ELECTRON_RENDERER_URL + url
    }
    return adapter
      .sendRequest(url, true)
      .then((chunk) => fs.writeFile(imagePath, Buffer.from(chunk)))
      .catch((err) => console.error(err))
  }

  isDownloadedImage(
    mangaName: string,
    chapterNum: number,
    url: string
  ): Promise<boolean> {
    const imagePath = loc.imagePath(this.path, mangaName, chapterNum, url)

    return new Promise((resolve, _reject) => {
      return fs
        .open(imagePath, 'r')
        .then((fd) => fd.close())
        .then(() => resolve(true))
        .catch(() => resolve(false))
    })
  }

  reply(msg: Task): void {
    this.send(msg)
  }

  start(): Promise<void> {
    const top = this.dequeue()
    if (top === null) {
      this.running = false
      return Promise.resolve()
    }

    return fs
      .mkdir(loc.chapterPath(this.path, top.mangaName, top.chapterNum), {
        recursive: true,
      })
      .then(() =>
        this.isDownloadedImage(top.mangaName, top.chapterNum, top.url)
      )
      .then((downloaded) => {
        if (!downloaded) {
          return this.downloadImage(
            top.mangaName,
            top.chapterNum,
            top.url,
            top.type
          )
        }

        return Promise.resolve()
      })
      .then(() => {
        this.reply(top)
        return this.write()
      })
      .then(() => this.start())
  }
}

export function startQueue(
  queuePath: string,
  file: string,
  send: (msg: Task) => void
) {
  const completePath = path.join(queuePath, file)
  return fs
    .open(completePath, 'a')
    .then((fd) => fd.close())
    .then(() => fs.readFile(completePath, 'utf-8'))
    .then((data) => new DownloadQueue(queuePath, file, send, data.trim()))
}
