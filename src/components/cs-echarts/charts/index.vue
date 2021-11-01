/**
 * @Description: 公共图表组件
 * @author Roman
 * @date 2020/9/14
*/
<template>
  <div style="width: 100%; height: 100%">
    <v-chart
      autoresize
      :options="options"
      :loading="loading"
      :loading-option="loadingOption"
      :init-options="initOptions"
      :theme="theme"
    />
  </div>
</template>

<script>
import ECharts from '../index'
import theme from '../theme/walden'

export default {
  name: 'CsCharts',
  components: {
    'v-chart': ECharts
  },
  props: {
    loadingOption: {
      type: Object,
      required: false,
      default: () => ({
        text: 'Loading...',
        color: '#41b7ca',
        textColor: '#e8e8e8',
        maskColor: 'rgba(255, 255, 255, 0.1)',
        zlevel: 0
      })
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    option: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      options: {},
      theme,
      initOptions: { merge: false }
    }
  },
  watch: {
    option: {
      handler(newData, oldData) {
        this.render(newData)
      },
      deep: true
    }
  },
  mounted() {
    this.render(this.option)
  },
  methods: {
    render(option) {
      const options = this.update(option)
      this.options = options
    },
    deepEditObject(obj, editobj) {
      for (const i in editobj) {
        if (editobj[i].constructor === Object) {
          if (obj[i]) {
            this.deepEditObject(obj[i], editobj[i])
          } else {
            obj[i] = editobj[i]
          }
        } else {
          obj[i] = editobj[i]
        }
      }
      return obj
    },
    update(Props) {
      const obj = {
        backgroundColor: 'transparent',
        grid: {
          top: '10%',
          left: '1%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisLine: { // 坐标轴轴线相关设置。数学上的x轴
            show: true
          },
          axisLabel: { // 坐标轴刻度标签的相关设置
            textStyle: {
              margin: 15
            }
          },
          axisTick: {
            show: false
          },
          data: []
        },
        yAxis: {
          type: 'value',
          // name: '单位（%）',
          min: 0,
          // max: 140,
          splitNumber: 7,
          splitLine: {
            show: true
          },
          axisLine: {
            show: true
          },
          axisLabel: {
            margin: 20
          },
          axisTick: {
            show: false
          }
        },
        series: []
      }
      const option = this.deepEditObject(obj, Props)
      return option
    }
  }
}
</script>
