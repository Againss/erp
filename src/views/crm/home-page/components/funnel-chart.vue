<template>
  <div class="home-table">
    <cs-charts :option="echartsOptions" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      echartsOptions: {
        series: [{
          type: 'funnel',
          colors: ['#1cd389', '#668eff', '#ffc751', '#ff6e73', '#8683e6', '#9692ff'],
          data: [
            { name: '意向', value: 100, num: 98756 },
            { name: '方案', value: 80, num: 88756 },
            { name: '商務', value: 60, num: 78756 },
            { name: '即將成交', value: 40, num: 68756 },
            { name: '贏單', value: 20, num: 58756 }
          ]
        }],
        xAxis: {
          axisLine: {
            show: true
          }
        },
        yAxis: {
          axisLine: {
            show: true
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.home-table {
    width: 100%;
    height: 300px;
    padding: 10px;
    background: #fff;
}
</style>

