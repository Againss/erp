import DrawFlow from './src/flowChart'

DrawFlow.install = function(Vue) {
  Vue.component(DrawFlow.name, DrawFlow)
}
export default DrawFlow
