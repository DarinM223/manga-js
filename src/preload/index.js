import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  start: () => ipcRenderer.sendSync('start'),
  loadState: () => ipcRenderer.sendSync('load-state'),
  saveState: (serializedState) => ipcRenderer.send('save-state', serializedState),
  deleteChapter: (mangaName, chapterNum) => ipcRenderer.send('delete-chapter', { mangaName, chapterNum }),
  deleteManga: (mangaName) => ipcRenderer.send('delete-manga', { mangaName }),
  downloadChapter: (mangaName, chapterNum, pages, type) => ipcRenderer.send('download-chapter', { mangaName, chapterNum, pages, type }),
}

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