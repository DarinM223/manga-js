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

  async downloadImage(
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
    try {
      const chunk = await adapter.sendRequest(url, true)
      await fs.writeFile(imagePath, Buffer.from(chunk))
    } catch (err) {
      console.error(err)
    }
  }

  async isDownloadedImage(
    mangaName: string,
    chapterNum: number,
    url: string
  ): Promise<boolean> {
    const imagePath = loc.imagePath(this.path, mangaName, chapterNum, url)

    try {
      const fd = await fs.open(imagePath, 'r')
      await fd.close()
      return true
    } catch (_err) {
      return false
    }
  }

  reply(msg: Task): void {
    this.send(msg)
  }

  async start(): Promise<void> {
    const top = this.dequeue()
    if (top === null) {
      this.running = false
      return
    }

    await fs.mkdir(loc.chapterPath(this.path, top.mangaName, top.chapterNum), {
      recursive: true,
    })
    const downloaded = await this.isDownloadedImage(
      top.mangaName,
      top.chapterNum,
      top.url
    )
    if (!downloaded) {
      await this.downloadImage(top.mangaName, top.chapterNum, top.url, top.type)
    }

    this.reply(top)
    await this.write()
    await this.start()
  }
}

export async function startQueue(
  queuePath: string,
  file: string,
  send: (msg: Task) => void
): Promise<DownloadQueue> {
  const completePath = path.join(queuePath, file)
  const fd = await fs.open(completePath, 'a')
  await fd.close()
  const data = await fs.readFile(completePath, 'utf-8')
  return new DownloadQueue(queuePath, file, send, data.trim())
}
