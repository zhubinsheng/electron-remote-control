const noop = () => {}
const { getScreen, adjustWindowSize: setWinSize, moveMouse, keyToggle = noop, mouseClick = noop, getDesktopCapturer, getscreencache} =
  window.electron || {}

const isElectron = true

async function getScreenSize() {
  return isElectron ? getScreen() : { width: window.screen.width, height: window.screen.height }
}

// 调整页面大小
async function adjustWindowSize(width, height) {
  if (!isElectron) return console.log('asjustWindowSize', width, height)
  setWinSize(width, height)
}

async function getScreenStream() {
  console.log('isElectron', isElectron)
  // getDesktopCapturer()
  // 这段代码是测试用的，如果不是electron环境则使用摄像头 
  if (!isElectron) return navigator.mediaDevices.getUserMedia({ audio: false, video: true })

  // 否则使用桌面流
  let sourceId = getscreencache()
  console.log('sourceId', sourceId)
  console.log('window.screen', window.screen)

  
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height,
        }
      }
    })
    .then((stream) => {
      resolve(stream)
    })
    .catch((error) => {
      console.error(error)
      reject(error)
    })


  })
}

function bindMoveMouse(x, y) {
  if (!isElectron) return console.log('bindMoveMouse', x, y)
  moveMouse(x, y)
}

export { getScreenSize, adjustWindowSize, getScreenStream, bindMoveMouse, keyToggle, mouseClick }
