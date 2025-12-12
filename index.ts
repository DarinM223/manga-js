// Entry point for Electron application.

import { app, protocol, ipcMain, session, net, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'
import process from 'process'
import fs from 'fs/promises'
import { downloadChapter, deleteChapter, deleteManga } from './downloaderUtils.ts'
import BulkSender from './utils/BulkSender.ts'
import { startQueue } from './utils/DownloadQueue.ts'
import { MessageType } from './utils/constants.js'
import { app as preloadedServer } from './preload-server.ts'

// Global reference to the main window.
let mainWindow = null

protocol.registerSchemesAsPrivileged([{
  scheme: 'manga',
  privileges: {
    secure: true,
    standard: true,
    supportFetchAPI: true,
    bypassCSP: true,
  },
},])

const createWindow = () => {
  const partition = 'persist:subdeveloper'
  const ses = session.fromPartition(partition)
  // Manga protocol is accessed through manga:// and allows the client to view locally downloaded files.
  ses.protocol.handle('manga', (request) => {
    const reqUrl = request.url.slice('manga://'.length)
    const urlPath = path.join(app.getPath('userData'), path.normalize(reqUrl))
    return net.fetch(url.pathToFileURL(urlPath).toString())
  })

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      partition,
    }
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/index.html`)
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../renderer/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  // Uncomment this line to debug the application.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => { mainWindow = null })

  const basePath = app.getPath('userData')
  const initPath = path.join(basePath, 'init.json')

  ipcMain.on('save-state', (event, state) => {
    fs.open(initPath, 'a')
      .then((fd) => fd.close())
      .then(() => fs.writeFile(initPath, state, 'utf-8'))
      .catch((err) => console.log(err))
  })

  ipcMain.on('load-state', async (event, _arg) => {
    try {
      const state = await fs.readFile(initPath, 'utf-8')
      event.returnValue = state
    } catch (err) {
      console.log(err)
      try {
        await fs.copyFile('./init.json', initPath)
        event.returnValue = await fs.readFile(initPath, 'utf-8')
      } catch (err) {
        console.log(err)
        event.returnValue = null
      }
    }
  })

  ipcMain.on('start', (event, args) => {
    const sender = new BulkSender((bulkMsg) => event.sender.send(MessageType.DOWNLOADED_RECV, bulkMsg))
    startQueue(app.getPath('userData'), 'queue.json', (msg) => sender.add(msg)).then((queue) => {
      // Setup ipc handlers after queue started.
      ipcMain.on(MessageType.DOWNLOAD_CHAPTER_MSG, (event, args) => downloadChapter(event, args, queue))
      ipcMain.on(MessageType.DELETE_CHAPTER_MSG, (event, args) => returnAsync(args, deleteChapter(basePath, args), event, MessageType.DELETE_CHAPTER_RECV))
      ipcMain.on(MessageType.DELETE_MANGA_MSG, (_event, args) => deleteManga(basePath, args))

      // Signal to the renderer that the queue has finished starting.
      event.returnValue = null
    })
  })
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())

if (process.env['PRELOADED'] === '1') {
  console.log('Starting preload server:')
  const port = 3000
  preloadedServer.listen(port, () => {
    console.log(`Server listening at port ${port}:`)
  })
}

/**
 * Sends the return value when the promise completes.
 */
function returnAsync<T>(args: any, promise: Promise<T>, event: Electron.IpcMainEvent, channel: string) {
  promise
    .then((result) => event.sender.send(channel, Object.assign({}, args, { err: null, result })))
    .catch((err) => event.sender.send(channel, Object.assign({}, args, { err, result: null })))
}
