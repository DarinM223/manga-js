import { ipcRenderer } from 'electron'
import { NOT_DOWNLOADED, DOWNLOADED, DOWNLOADING } from '../utils/constants.js'
import { SET_DOWNLOAD_STATE, DOWNLOADED_PAGE } from './actions/manga.js'

export const listenForIpc = (store) => {
  ipcRenderer.on('recv-download-chapter', (event, args) => {
    if (args.err === null) {
      store.dispatch({
        type: SET_DOWNLOAD_STATE,
        state: DOWNLOADING,
        mangaName: args.mangaName,
        chapterNum: args.chapterNum
      })
    }
  })

  ipcRenderer.on('recv-downloaded', (event, args) => {
    for (const msg of args) {
      if (msg.curr >= msg.total - 1) {
        store.dispatch({
          type: SET_DOWNLOAD_STATE,
          state: DOWNLOADED,
          mangaName: msg.mangaName,
          chapterNum: msg.chapterNum
        })
      } else {
        store.dispatch({
          type: DOWNLOADED_PAGE,
          curr: msg.curr,
          mangaName: msg.mangaName,
          chapterNum: msg.chapterNum
        })
      }
    }
  })

  ipcRenderer.on('recv-delete-chapter', (event, args) => {
    if (args.err === null) {
      store.dispatch({
        type: SET_DOWNLOAD_STATE,
        state: NOT_DOWNLOADED,
        mangaName: args.mangaName,
        chapterNum: args.chapterNum
      })
    }
  })
}
