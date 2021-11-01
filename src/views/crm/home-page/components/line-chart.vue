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
          type: 'line',
          data: [
            { name: '1997', value: 86085, type: 'America' },
            { name: '2007', value: 144776, type: 'America' },
            { name: '2017', value: 193868, type: 'America' },
            { name: '1997', value: 9616, type: 'China' },
            { name: '2007', value: 35715, type: 'China' },
            { name: '2017', value: 122503, type: 'China' },
            { name: '1997', value: 44122, type: 'Japan' },
            { name: '2007', value: 45153, type: 'Japan' },
            { name: '2017', value: 48675, type: 'Japan' },
            { name: '1997', value: 22159, type: 'Germany' },
            { name: '2007', value: 34447, type: 'Germany' },
            { name: '2017', value: 36865, type: 'Germany' }
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
