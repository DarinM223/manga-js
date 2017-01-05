import { ipcRenderer } from 'electron'
import { NOT_DOWNLOADED, DOWNLOADED, DOWNLOADING } from '../utils/constants.js'
import { SET_DOWNLOAD_STATE, DOWNLOADED_PAGE } from './actions/manga.js'

export const listenForIpc = (store) => {
  ipcRenderer.on('recv-download-chapter', (event, args) => {
    console.log('Received: ', args)
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
    console.log('Received: ', args)
    if (args.curr >= args.total - 1) {
      store.dispatch({
        type: SET_DOWNLOAD_STATE,
        state: DOWNLOADED,
        mangaName: args.mangaName,
        chapterNum: args.chapterNum
      })
    } else {
      store.dispatch({
        type: DOWNLOADED_PAGE,
        curr: args.curr,
        mangaName: args.mangaName,
        chapterNum: args.chapterNum
      })
    }
  })

  ipcRenderer.on('recv-delete-chapter', (event, args) => {
    console.log('Received: ', args)
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
