import { ipcRenderer } from 'electron'
import { NOT_DOWNLOADED, DOWNLOADED, DOWNLOADING } from '../utils/constants.js'
import { SET_DOWNLOAD_STATE } from './actions/manga.js'

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
    if (args.err === null) {
      store.dispatch({
        type: SET_DOWNLOAD_STATE,
        state: DOWNLOADED,
        mangaName: args.mangaName,
        chapterNum: args.chapterNum
      })
    }
  })

  ipcRenderer.on('recv-cancel-download', (event, args) => {
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

  ipcRenderer.on('recv-delete-download', (event, args) => {
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
