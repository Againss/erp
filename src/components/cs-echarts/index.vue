/**
 * @Description: 公共图表组件公用依赖库
 * @author Roman
 * @date 2020/9/14
*/
<template>
  <div class="echarts" />
</template>

<style>
    .echarts {
        width: 100%!important;
        height: 100%!important;
    }
</style>
<script>
import VueECharts from 'vue-echarts'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/chart/pie'
// import 'echarts/lib/chart/scatter'
// import 'echarts/lib/chart/radar'
// import 'echarts/lib/chart/map'
// import 'echarts/lib/chart/treemap'
// import 'echarts/lib/chart/graph'
// import 'echarts/lib/chart/gauge'
// import 'echarts/lib/chart/funnel'
// import 'echarts/lib/chart/parallel'
// import 'echarts/lib/chart/sankey'
// import 'echarts/lib/chart/boxplot'
// import 'echarts/lib/chart/candlestick'
// import 'echarts/lib/chart/effectScatter'
// import 'echarts/lib/chart/lines'
// import 'echarts/lib/chart/heatmap'
// import 'echarts/lib/component/graphic'
// import 'echarts/lib/component/grid'
// import 'echarts/lib/component/legend'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/polar'
// import 'echarts/lib/component/geo'
// import 'echarts/lib/component/parallel'
// import 'echarts/lib/component/singleAxis'
// import 'echarts/lib/component/brush'
// import 'echarts/lib/component/title'
// import 'echarts/lib/component/dataZoom'
// import 'echarts/lib/component/visualMap'
// import 'echarts/lib/component/markPoint'
// import 'echarts/lib/component/markLine'
// import 'echarts/lib/component/markArea'
// import 'echarts/lib/component/timeline'
// import 'echarts/lib/component/toolbox'
//
// import 'echarts/map/js/china'
// import 'zrender/lib/vml/vml'
export default {
  mixins: [VueECharts],
  props: {
    loadingOption: {
      type: Object,
      required: false,
      default: () => { return {} }
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    loading: {
      handler(newData, oldData) {
        if (newData) {
          this.showLoading(this.loadingOption)
        } else {
          this.hideLoading()
        }
      },
      deep: true
    },
    'options.geojson': {
      handler(newData, oldData) {
        if (newData) {
          VueECharts.registerMap(newData.name, newData.data)
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.loading) {
      this.showLoading(this.loadingOption)
    } else {
      this.hideLoading()
    }
  }
}
</script>
