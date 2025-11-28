// Entry point for Electron application.

import { app, protocol, ipcMain, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'
import fs from 'fs/promises'
import { downloadChapter, deleteChapter, deleteManga } from './downloaderUtils.js'
import BulkSender from './utils/BulkSender.js'
import { startQueue } from './utils/downloadQueue.js'
import { MessageType } from './utils/constants.js'


// Global reference to the main window.
let mainWindow = null

const createWindow = () => {
  // Manga protocol is accessed through manga:// and allows the client to view locally downloaded files.
  protocol.registerFileProtocol('manga', (request, callback) => {
    const url = request.url.substr(8)
    const urlPath = path.join(app.getPath('userData'), path.normalize(url))
    callback({ path: urlPath })
  }, (err) => {
    if (err) console.error('Failed to register protocol')
  })

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
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

  ipcMain.on('load-state', (event, arg) => {
    fs.readFile(initPath, 'utf-8')
      .then((state) => { event.returnValue = state })
      .catch((err) => { console.log(err); event.returnValue = null })
  })

  ipcMain.on('start', (event, args) => {
    const sender = new BulkSender((bulkMsg) => event.sender.send(MessageType.DOWNLOADED_RECV, bulkMsg))
    startQueue(app.getPath('userData'), 'queue.json', (msg) => sender.add(msg)).then((queue) => {
      // Setup ipc handlers after queue started.
      ipcMain.on(MessageType.DOWNLOAD_CHAPTER_MSG, (event, args) => downloadChapter(event, args, queue))
      ipcMain.on(MessageType.DELETE_CHAPTER_MSG, (event, args) => returnAsync(args, deleteChapter(basePath, args), event, MessageType.DELETE_CHAPTER_RECV))
      ipcMain.on(MessageType.DELETE_MANGA_MSG, (event, args) => deleteManga(basePath, args))

      // Signal to the renderer that the queue has finished starting.
      event.returnValue = null
    })
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => app.quit())

/**
 * Sends the return value when the promise completes.
 */
function returnAsync(args, promise, event, channel) {
  promise
    .then((result) => event.sender.send(channel, Object.assign({}, args, { err: null, result })))
    .catch((err) => event.sender.send(channel, Object.assign({}, args, { err, result: null })))
}
