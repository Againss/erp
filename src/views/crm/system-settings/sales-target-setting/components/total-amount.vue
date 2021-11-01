<template>
  <div class="total-amount">
    <el-tooltip placement="right" effect="light">
      <div slot="content">
        <!-- table表格 -->
        <div class="table">
          <cs-custom-table
            :columns="columns"
            :data-source="dataSource"
            edit-type="pop"
            highlight-current-row
          />
        </div>
      </div>
      <span>
        <span>{{ totalAmount }}</span>
      </span>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'StateColumn',
  components: {

  },
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    const columns = [
      {
        prop: 'month',
        label: '月份',
        width: '80',
        center: true
      },
      {
        prop: 'money',
        label: '销售目标金额',
        width: '110',
        center: true
      }
    ]
    return {
      columns,
      months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
      // dataSource: []
    }
  },
  computed: {
    totalAmount() {
      const data = this.scope.row
      return this.numRecursion(this.months.map(item => data[item] ? data[item] / 10000 : 0).reduce((prev, curr, idx, arr) => prev + curr))
    //   return this.numRecursion((data.january || 0) + (data.february || 0) + (data.march || 0) + (data.april || 0) + (data.may || 0) + (data.june || 0) + (data.july || 0) + (data.august || 0) + (data.september || 0) + (data.october || 0) + (data.november || 0) + (data.december || 0))
    },
    dataSource() {
      const data = this.scope.row
      return this.months.map((item, index) => {
        return {
          month: `${index + 1}月`,
          money: this.numRecursion(data[item] ? data[item] / 10000 : 0)
        }
      })
    }
  },
  watch: {},
  mounted() {
    console.log('scope', this.scope)
    // const data = this.scope.row
    // this.dataSource = this.months.map((item, index) => {
    //   return {
    //     month: `${index + 1}月`,
    //     money: this.numRecursion(data[item] || 0)
    //   }
    // })
    // console.log('componentsOptions', this.componentsOptions)
  },
  methods: {
    // 输入一个数字, 每三位之间加一个逗号, 且保留两位小数
    numRecursion(num, newStr = '') {
      if (!/^[0-9]+.?[0-9]*$/.test(num)) {
        // throw '请输入数字'
      }
      function zzz(num) {
        if (num / 1000 >= 1) {
          zzz(parseInt(num / 1000))
          const temp = (num % 1000 + '').padStart(3, '0')
          newStr = newStr + ',' + temp
        } else {
          newStr = num % 1000
        }
        return newStr
      }
      return zzz(parseInt(num)) + '.' + num.toFixed(2).split('.')[1]
    }
  }
}
</script>

<style lang="scss">
.total-amount {
    .toolBox {
        display: flex;

    }
}
</style>
