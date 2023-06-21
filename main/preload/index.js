const { contextBridge, ipcRenderer } = require('electron')

console.log('contextBridge', contextBridge)
console.log('ipcRenderer', ipcRenderer)

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer,
  getScreen: () => ipcRenderer.invoke('getScreen'),
  moveMouse: (x = 0, y = 0) => ipcRenderer.invoke('moveMouse', x, y),
  adjustWindowSize: (width, height) => ipcRenderer.invoke('adjustWindowSize', width, height),
  keyToggle: (key, type) => ipcRenderer.invoke('keyToggle', key, type),
  mouseClick: (button, double) => ipcRenderer.invoke('mouseClick', button, double),
  getDesktopCapturer: () => ipcRenderer.invoke('getDesktopCapturer'),

  getscreencache: () => {
    return cache
  },
})

let cache
ipcRenderer.on('mdns_query', async (event, data) => {
  console.log('mdns_query', data)
})

ipcRenderer.on('SET_SOURCE', async (event, sourceId) => {
  console.log('SET_SOURCE', sourceId)
  cache = sourceId
})
ipcRenderer.on('ALL_SOURCE', async (event, sources) => {
  console.log('ALL_SOURCE', sources)

  const screenNames = document.getElementById('screenNames')
  screenNames.textContent = ''

  sources.forEach((source) => {
    screenNames.textContent += `${source.id}, ${source.display_id} (${source.name}) | `

    // if (source.id.startsWith('screen')) {

    //   navigator.mediaDevices.getUserMedia({
    //     audio: false,
    //     video: {
    //       mandatory: {
    //         chromeMediaSource: 'desktop',
    //         chromeMediaSourceId: source.id,
    //         minWidth: 640,
    //         maxWidth: 640,
    //         minHeight: 320,
    //         maxHeight: 320
    //       }
    //     }
    //   })
    //   .then((stream) => {
    //     // const screenVideos = document.getElementById('screenVideos')
    //     // const video = document.createElement('video')
    //     // screenVideos.appendChild(video)
    //     // video.srcObject = stream
    //     // video.onloadedmetadata = () => {
    //     //   video.play()
    //     // }
    //   })
    //   .catch((error) => console.error(error))
    // }

  })

})


