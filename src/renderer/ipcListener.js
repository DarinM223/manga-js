import { DownloadStateType } from '../../utils/constants.js'
import { SET_DOWNLOAD_STATE, DOWNLOADED_PAGE } from './actions/manga.ts'

export const listenForIpc = (store) => {
  window.electron.ipcRenderer.on('recv-download-chapter', (event, args) => {
    if (args.err === null) {
      store.dispatch({
        type: SET_DOWNLOAD_STATE,
        state: DownloadStateType.DOWNLOADING,
        mangaName: args.mangaName,
        chapterNum: args.chapterNum
      })
    }
  })

  window.electron.ipcRenderer.on('recv-downloaded', (event, args) => {
    for (const msg of args) {
      if (msg.curr >= msg.total - 1) {
        store.dispatch({
          type: SET_DOWNLOAD_STATE,
          state: DownloadStateType.DOWNLOADED,
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

  window.electron.ipcRenderer.on('recv-delete-chapter', (event, args) => {
    if (args.err === null) {
      store.dispatch({
        type: SET_DOWNLOAD_STATE,
        state: DownloadStateType.NOT_DOWNLOADED,
        mangaName: args.mangaName,
        chapterNum: args.chapterNum
      })
    }
  })
}
