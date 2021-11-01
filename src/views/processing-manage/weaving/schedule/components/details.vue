<!--
 * @Author: lishili
 * @Description: 染整需求列表分录
 * @Date: 2021-07-1 14:43:56
 -->
<template>
  <div>
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Details',
  data() {
    const columns = {
      _index: {
        type: 'index',
        label: '序号',
        formater: (scope) => {
          return (
            scope.$index + 1
          )
        }
      },
      _sendId: {
        prop: 'sendId',
        label: '纱线编码',
        minWidth: '20',
        showOverflowTooltip: true,
        style: {
          'white-space': 'nowrap'
        }
      },
      _name: {
        prop: 'name',
        label: '纱名',
        minWidth: '20',
        showOverflowTooltip: true
      },
      _xuqiu: {
        prop: 'xuqiu',
        label: '纱需求量KG',
        minWidth: '20',
        showOverflowTooltip: true
      },
      _time: {
        prop: 'time',
        label: '计划到纱期',
        minWidth: '20',
        showOverflowTooltip: true
      },
      _tongzhi: {
        prop: 'tongzhi',
        label: '通知送纱量KG',
        minWidth: '20',
        showOverflowTooltip: true
      },
      _yidao: {
        prop: 'yidao',
        label: '已到纱数KG',
        minWidth: '20',
        showOverflowTooltip: true
      },
      _zaitu: {
        prop: 'zaitu',
        label: '在途纱数KG',
        minWidth: '20',
        showOverflowTooltip: true
      }
    }
    return {
      columns,
      dataSource: [{}]
    }
  },
  created() {
    this.init()
    console.log(this.$attrs.options.componentsOptions.id)
  },
  methods: {
    async init() {
      const { id } = this.$attrs.options.componentsOptions
      console.log(id)
      this.dataSource = [{ sendId: id }]
    }
  }
}
</script>

<style>

</style>
