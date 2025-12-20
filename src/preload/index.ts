import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  start: (): void => ipcRenderer.sendSync('start'),
  loadState: (): string => ipcRenderer.sendSync('load-state'),
  saveState: (serializedState: string) =>
    ipcRenderer.send('save-state', serializedState),
  deleteChapter: (mangaName: string, chapterNum: number) =>
    ipcRenderer.send('delete-chapter', { mangaName, chapterNum }),
  deleteManga: (mangaName: string) =>
    ipcRenderer.send('delete-manga', { mangaName }),
  downloadChapter: (
    mangaName: string,
    chapterNum: number,
    pages: string[],
    type: string
  ) =>
    ipcRenderer.send('download-chapter', {
      mangaName,
      chapterNum,
      pages,
      type,
    }),
}

export type API = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
