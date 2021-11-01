<template>
  <div class="home-table">
    <cs-charts :option="echartsOptions" />
  </div>
</template>

<script>
export default {
  props: {
    chartsOption: {
      type: Object
    }
  },
  data() {
    return {
      // echartsOptions: {
      //   series: [{
      //     type: 'bar',
      //     data: [
      //       { name: '1997', value: 86085, type: 'America' },
      //       { name: '2007', value: 144776, type: 'America' },
      //       { name: '2017', value: 193868, type: 'America' },
      //       { name: '1997', value: 9616, type: 'China' },
      //       { name: '2007', value: 35715, type: 'China' },
      //       { name: '2017', value: 122503, type: 'China' },
      //       { name: '1997', value: 44122, type: 'Japan' },
      //       { name: '2007', value: 45153, type: 'Japan' },
      //       { name: '2017', value: 48675, type: 'Japan' },
      //       { name: '1997', value: 22159, type: 'Germany' },
      //       { name: '2007', value: 34447, type: 'Germany' },
      //       { name: '2017', value: 36865, type: 'Germany' }
      //     ]
      //   }],
      //   xAxis: [
      //     {
      //       type: 'category',
      //       data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      //     }
      //   ],
      //   yAxis: {
      //     axisLine: {
      //       show: true
      //     }
      //   }
      // }
    }
  },
  computed: {
    echartsOptions() {
      return this.chartsOption
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
