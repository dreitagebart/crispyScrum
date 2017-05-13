import thunk from 'redux-thunk'
import { app, Menu, shell, BrowserWindow, ipcMain as ipc } from 'electron'
import { applyMiddleware, createStore } from 'redux'
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux'
import reducers from './src/reducers'

const store = createStore(
  reducers,
  applyMiddleware(
    triggerAlias, // optional, see below
    thunk,
    forwardToRenderer // IMPORTANT! This goes last
  )
)

replayActionMain(store)

let menuTemplate = [{
  label: 'App',
  submenu: [{
    label: 'reload',
    click: () => {
      win.reload()
    }
  }, {
    label: 'debug menu',
    click: () => win.webContents.openDevTools()
  }]
}, {
  label: 'Help',
  submenu: [{
    label: 'issues',
    click: () => shell.openExternal(process.env.npm_package_bugs_url)
  }, {
    label: 'about',
    click: () => createAboutWindow()
  }]
}]

let menu
let port = '9004'
let about
let win
let openTasks = {}
const appUrl = `http://localhost:${port}/`

const createAboutWindow = () => {
  let url = `${appUrl}about/`
  if (!about) {
    about = new BrowserWindow({
      show: false,
      minWidth: 600,
      minHeight: 400,
      alwaysOnTop: true,
      minimizable: false,
      movable: true,
      resizable: false,
      skipTaskbar: false
    })

    about.loadURL(url)
    about.setMenu(null)
    about.once('ready-to-show', () => {
      about.show()
    })

    about.on('closed', () => {
      about = null
    })
  }
}

const createTaskWindow = id => {
  let url = `${appUrl}taskDetach/${id}`
  openTasks[id] = new BrowserWindow({
    show: false,
    minWidth: 800,
    minHeight: 600
  })

  openTasks[id].setMenu(null)
  openTasks[id].loadURL(url)
  openTasks[id].webContents.openDevTools()

  openTasks[id].once('ready-to-show', () => {
    openTasks[id].show()
    // openTasks[id].webContents.send('task-detached')
  })

  openTasks[id].on('closed', () => {
    openTasks[id] = null
  })
}

const createAppWindow = () => {
  menu = Menu.buildFromTemplate(menuTemplate)

  win = new BrowserWindow({
    show: false,
    // backgroundColor: '#2e2c29',
    minWidth: 1280,
    minHeight: 960
  })

  win.maximize()
  win.loadURL(appUrl)
  win.setMenu(menu)
  win.webContents.openDevTools()

  win.once('ready-to-show', () => {
    win.show()
  })
}

app.on('ready', () => {
  createAppWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createAppWindow()
  }
})

// ipc signals processing
ipc.on('task-detach', (event, arg) => {
  createTaskWindow(arg)
})
