import { app, BrowserWindow } from 'electron'

let port = '9004'
let win
const appUrl = `http://localhost:${port}/`

const createWindow = () => {
  win = new BrowserWindow({
    show: false,
    // backgroundColor: '#2e2c29',
    minWidth: 1280,
    minHeight: 960
  })

  win.maximize()
  win.loadURL(appUrl)
  win.setMenu(null)
  win.webContents.openDevTools()

  win.once('ready-to-show', () => {
    win.show()
  })
}

app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
