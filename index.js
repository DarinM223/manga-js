// Entry point for Electron application.

const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// Global reference to the main window.
let mainWindow = null

function createWindow () {
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

// TODO(DarinM223): rest of the code here.
