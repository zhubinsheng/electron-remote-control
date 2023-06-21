const { ipcMain } = require('electron')
// const robot = require('robotjs')
const { adjustSize, getWin } = require('./windows/main')

const { desktopCapturer } = require('electron')

module.exports = () => {
  ipcMain.handle('getScreen', async () => {
    // const screenSize = robot.getScreenSize()
    // const height = screenSize.height
    // const width = screenSize.width

    // return { width, height }
  })

  ipcMain.handle('moveMouse', (e, x, y) => {})

  ipcMain.handle('adjustWindowSize', (e, width = 800, height = 600) => adjustSize(width, height))

  ipcMain.handle('keyToggle', (e, key, type) => {})

  ipcMain.handle('mouseClick', (e, button, double) => {})
  
  ipcMain.handle('getDesktopCapturer', (e) => {
    if (parseInt(process.versions.electron) >= 17) {
      desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
        getWin().webContents.send('ALL_SOURCE', sources)
        for (const source of sources) {
          if (source.id.startsWith('screen')) {
            getWin().webContents.send('SET_SOURCE', source.id)
            return
          }
        }
      })
    }
  })
}
