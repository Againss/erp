// 异步加载高德地图API
export function loadMP() {
  const mp = new Promise((resolve, reject) => {
    const hasLoaded1 = document.getElementById('amap')
    if (hasLoaded1) { // 只加载一次
      return
    }
    window.init = () => {
      resolve(window.AMap)
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = '//webapi.amap.com/maps?v=1.4.6&key=1be9b927c7dd48f2b524b05826765214&plugin=AMap.Driving,AMap.Geocoder,AMap.ToolBar&callback=init'
    script.id = 'amap'
    script.onerror = reject
    document.head.appendChild(script)
  })
  return Promise.all([mp]).then(result => result)
}
