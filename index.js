// Entry point for Electron application.

const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))

const { startQueue } = require('./utils/downloadQueue.js')

// Global reference to the main window.
let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  const initPath = path.join(app.getPath('userData'), 'init.json')

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

  const { downloadChapter, deleteDownload, retrievePage } = require('./downloader.js')

  ipcMain.on('start', (event, args) => {
    startQueue(app.getPath('userData'), 'queue.json', event.sender).then((queue) => {
      ipcMain.on('download-chapter', (event, args) => downloadChapter(event, args, queue))
      ipcMain.on('delete-download', (event, args) => returnAsync(args, deleteDownload(args), event, 'recv-delete-download'))
      ipcMain.on('retrieve-page', (event, args) => returnAsync(args, retrievePage(args), event, 'recv-retrieve-page'))

      event.returnValue = null
    })
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  // So Mac applications don't close when windows closed.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // So Mac applications can be recreated when the dock icon is clicked.
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Sends the return value when the promise completes.
 */
function returnAsync (args, promise, event, channel) {
  promise
    .then((result) => event.sender.send(channel, Object.assign({}, args, { err: null, result })))
    .catch((err) => event.sender.send(channel, Object.assign({}, args, { err, result: null })))
}
