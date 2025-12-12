export type Msg = {
  readonly mangaName: string,
  readonly chapterNum: number,
  readonly total: number,
  readonly curr: number,
}

/**
 * Sends a bunch of messages in a specified interval
 * in order to reduce the amount of messages needed to be sent
 * to the main process.
 */
export default class BulkSender {
  downloadData: { [mangaName: string]: { [chapterNum: number]: { total: number, curr: number } } }
  send: (messages: Msg[]) => void
  interval: number

  constructor(send: (messages: Msg[]) => void, interval = 1000) {
    this.downloadData = {}
    this.send = send
    this.interval = interval

    this.start()
  }

  add(msg: Msg) {
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

  start() {
    setInterval(() => {
      if (Object.keys(this.downloadData).length !== 0) {
        let messages: Msg[] = []
        Object.keys(this.downloadData).forEach((mangaName) => {
          Object.keys(this.downloadData[mangaName]).forEach((chapterNum) => {
            const data = this.downloadData[mangaName][+chapterNum]
            messages.push({
              mangaName,
              chapterNum: parseInt(chapterNum, 10),
              total: data.total,
              curr: data.curr
            })
          })
        })
        this.downloadData = {}
        this.send(messages)
      }
    }, this.interval)
  }
}