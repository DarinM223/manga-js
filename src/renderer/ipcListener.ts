import { DownloadStateType } from '../../utils/constants.ts'
import { SET_DOWNLOAD_STATE, DOWNLOADED_PAGE } from './actions/manga.ts'
import { AppStore } from './configureStore.ts'
import {} from './window.ts'

export const listenForIpc = (store: AppStore) => {
  window.electron.ipcRenderer.on('recv-download-chapter', (_event, args) => {
    if (args.err === null) {
      store.dispatch({
        type: SET_DOWNLOAD_STATE,
        state: DownloadStateType.DOWNLOADING,
        mangaName: args.mangaName,
        chapterNum: args.chapterNum,
      })
    }
  })

  window.electron.ipcRenderer.on('recv-downloaded', (_event, args) => {
    for (const msg of args) {
      if (msg.curr >= msg.total - 1) {
        store.dispatch({
          type: SET_DOWNLOAD_STATE,
          state: DownloadStateType.DOWNLOADED,
          mangaName: msg.mangaName,
          chapterNum: msg.chapterNum,
        })
      } else {
        store.dispatch({
          type: DOWNLOADED_PAGE,
          curr: msg.curr,
          mangaName: msg.mangaName,
          chapterNum: msg.chapterNum,
        })
      }
    }
  })

  window.electron.ipcRenderer.on('recv-delete-chapter', (_event, args) => {
    if (args.err === null) {
      store.dispatch({
        type: SET_DOWNLOAD_STATE,
        state: DownloadStateType.NOT_DOWNLOADED,
        mangaName: args.mangaName,
        chapterNum: args.chapterNum,
      })
    }
  })
}
