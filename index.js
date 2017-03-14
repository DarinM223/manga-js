// Entry point for Electron application.

const { app, protocol, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))

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
      webSecurity: false
    }
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Uncomment this line to debug the application.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => { mainWindow = null })

  const basePath = app.getPath('userData')
  const initPath = path.join(basePath, 'init.json')

  ipcMain.on('save-state', (event, state) => {
    fs.openAsync(initPath, 'a')
      .then((fd) => fs.closeAsync(fd))
      .then(() => fs.writeFileAsync(initPath, state, 'utf-8'))
      .catch((err) => console.log(err))
  })

  ipcMain.on('load-state', (event, arg) => {
    fs.readFileAsync(initPath, 'utf-8')
      .then((state) => { event.returnValue = state })
      .catch((err) => { console.log(err); event.returnValue = null })
  })

  const { downloadChapter, deleteChapter, deleteManga } = require('./downloaderUtils.js')
  const BulkSender = require('./utils/BulkSender.js')
  const { startQueue } = require('./utils/downloadQueue.js')
  const {
    DOWNLOAD_CHAPTER_MSG,
    DOWNLOADED_RECV,
    DELETE_CHAPTER_MSG,
    DELETE_CHAPTER_RECV,
    DELETE_MANGA_MSG
  } = require('./utils/constants.js')

  ipcMain.on('start', (event, args) => {
    const sender = new BulkSender((bulkMsg) => event.sender.send(DOWNLOADED_RECV, bulkMsg))
    startQueue(app.getPath('userData'), 'queue.json', (msg) => sender.add(msg)).then((queue) => {
      // Setup ipc handlers after queue started.
      ipcMain.on(DOWNLOAD_CHAPTER_MSG, (event, args) => downloadChapter(event, args, queue))
      ipcMain.on(DELETE_CHAPTER_MSG, (event, args) => returnAsync(args, deleteChapter(basePath, args), event, DELETE_CHAPTER_RECV))
      ipcMain.on(DELETE_MANGA_MSG, (event, args) => deleteManga(basePath, args))

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
function returnAsync (args, promise, event, channel) {
  promise
    .then((result) => event.sender.send(channel, Object.assign({}, args, { err: null, result })))
    .catch((err) => event.sender.send(channel, Object.assign({}, args, { err, result: null })))
}
