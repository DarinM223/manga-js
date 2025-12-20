import { ElectronAPI } from '@electron-toolkit/preload'
import { API } from '../preload/index.ts'

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

export default {}
