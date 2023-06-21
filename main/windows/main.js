const { BrowserWindow } = require('electron')
const { scheme } = require('../constant')
const resolve = require('../utils/resolve')
const { desktopCapturer } = require('electron')

let win
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';


function create() {
  // In the main process.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    center: true,
    resizable: true,
    webPreferences: {
      preload: resolve('main/preload/index.js'),
      // nodeIntegration: true,
      // contextIsolation: false,
    },
  })

  win.on('ready-to-show', () => {
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
      getWin().webContents.send('ALL_SOURCE', sources)
      for (const source of sources) {
        if (source.id.startsWith('screen')) {
          getWin().webContents.send('SET_SOURCE', source.id)
          return
        }
      }
    })
    
    win.show() // 初始化后再显示
  })

  win.on('closed', () => {
    win = null
  })

  win.loadURL(`${scheme}:///./index.html`)
}

const { Bonjour } = require('bonjour-service')

const service = new Bonjour()

const TYPE = '_bonjour_webrtc._http._tcp.local.'

// advertise an HTTP server on port 3000
service.publish({ name: 'My Web Server', type: TYPE, port: 13000 })

// browse for all http services
service.find({ type: TYPE }, function (service) {
  console.log('Found an server:', service.name)
  getWin().webContents.send('mdns_query', service)
})


function adjustSize(width, height) {
  if (!win) throw new Error('win is null')
  win.setSize(width, height)
  win.center()
}

function getWin() {
  if (!win) throw new Error('win is null')
  return win
}

module.exports = {
  create,
  adjustSize,
  getWin,
}
