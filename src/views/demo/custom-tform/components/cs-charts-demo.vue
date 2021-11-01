/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div class="table">
    <div class="custom-demo-title">图表 demo:</div>
    <!--        此处注意图表组件是根据外部元素宽高自适应渲染，需有一个高度值，option必传，其他非必传-->
    <div style="height: 360px;width: 500px">
      <cs-charts :option="echartsOptions" />
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      echartsOptions: {
        series: [{
          type: 'map',
          map: 'china'
        }],
        xAxis: {
          axisLine: {
            show: false
          }
        },
        yAxis: {
          axisLine: {
            show: false
          }
        }
      }
    }
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
    .table{ padding-bottom: 10px;}
    .custom-demo-title{ font-size: 16px; padding: 10px; font-weight: bold; padding: 10px}
</style>
