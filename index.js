// Entry point for Electron application.

const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

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
    fs.open(initPath, 'a', (err, fd) => {
      if (err) return console.log(err)
      fs.close(fd, (err) => {
        if (err) return console.log(err)

        fs.writeFile(initPath, state, 'utf-8', (err) => {
          if (err) return console.log(err)
        })
      })
    })
  })

  ipcMain.on('load-state', (event, arg) => {
    fs.readFile(initPath, 'utf-8', (err, state) => {
      if (err) {
        event.returnValue = null
        return console.log(err)
      }
      event.returnValue = state
    })
  })

  const {
    downloadChapter,
    cancelDownload,
    deleteDownload,
    retrieveChapter
  } = require('./downloader.js')

  ipcMain.on('download-chapter', (event, args) => returnAsync(args, downloadChapter(args), event, 'recv-download-chapter'))
  ipcMain.on('cancel-download', (event, args) => returnAsync(args, cancelDownload(args), event, 'recv-cancel-download'))
  ipcMain.on('delete-download', (event, args) => returnAsync(args, deleteDownload(args), event, 'recv-delete-download'))
  ipcMain.on('retrieve-chapter', (event, args) => returnAsync(args, retrieveChapter(args), event, 'recv-retrieve-chapter'))
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
