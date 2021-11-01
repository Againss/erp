<template>
  <div class="dynamic-table">
    <div class="interval" />
    <div class="title">抽纱明细</div>
    <!-- <div class="search"> -->
    <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    <!-- </div> -->

  </div>

</template>

<script>
export default {
  props: {
    options: {
      type: Object
    }
  },
  data() {
    const numberReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '保留两位小数', trigger: ['blur'] })
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })

    const columnsInfos = {
      '_orderNo': {
        prop: 'orderNo',
        label: '订单号',
        width: '156',
        showOverflowTooltip: true
      },
      '_orderType': {
        prop: 'orderType',
        label: '订单类型',
        width: '156',
        showOverflowTooltip: true,
        formater: scope => {
          const obj = {
            // 1: '备纱单',
            // 2: '备坯单',
            1: '样板订单',
            2: '大货订单'
          }
          return obj[scope.row.orderType] || '-'
        }
      },
      '_clothType': {
        prop: 'clothType',
        label: '布类',
        minWidth: '60',
        showOverflowTooltip: true
      },
      '_yarnCode': {
        prop: 'yarnCode',
        label: '坯纱编码',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_yarnName': {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '120',
        showOverflowTooltip: true
        // formater: scope => {
        //   const yarnNameArr = scope.row.yarnName ? scope.row.yarnName.split(',') : []
        //   let str = '<span>'
        //   yarnNameArr.forEach((item, index) => {
        //     if (index !== yarnNameArr.length) {
        //       str += item + '</br>'
        //     } else {
        //       str += item + '</span>'
        //     }
        //   })
        //   return str
        // }
      },
      '_yarnAttr': {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '100',
        showOverflowTooltip: true
        // formater: scope => {
        //   const yarnAttrArr = scope.row.yarnAttr ? scope.row.yarnAttr.split(',') : []
        //   let str = '<span>'
        //   yarnAttrArr.forEach((item, index) => {
        //     if (index !== yarnAttrArr.length) {
        //       str += item + '</br>'
        //     } else {
        //       str += item + '</span>'
        //     }
        //   })
        //   return str
        // }
      },
      '_whetherDyed': {
        prop: 'whetherDyed',
        label: '是否染色',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const obj = {
            1: '是',
            0: '否'
          }
          return obj[scope.row.whetherDyed] || '-'
        }
      },
      '_yarnColor': {
        prop: 'yarnColor',
        label: '染纱颜色',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_yarnNum': {
        prop: 'yarnNum',
        label: '坯纱重量(KG)',
        align: 'right',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.yarnNum) ? (+scope.row.yarnNum).toFixed(2) : '-'
        }
      },
      '_lastTotalLockNum': {
        prop: 'lastTotalLockNum',
        label: '抽纱重量(KG)',
        align: 'right',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.lastTotalLockNum) ? (+scope.row.lastTotalLockNum).toFixed(2) : '-'
        }
      },
      '_needNum': {
        prop: 'needNum',
        label: '待抽重量(KG)',
        align: 'right',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.needNum) ? (+scope.row.needNum).toFixed(2) : '-'
        }
      },
      '_lockNum': {
        prop: 'lockNum',
        label: '本次抽纱重量(KG)',
        minWidth: '150',
        showOverflowTooltip: true,
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          maxlength: 200,
          placeholder: '请输入数字',
          rules: [numberReg],
          change: value => {
            console.log(11)
          }
        }
      },
      '_salesTeam': {
        prop: 'salesTeam',
        label: '销售团队',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_needClothNum': {
        prop: 'needClothNum',
        label: '需织坯量(KG)',
        align: 'right',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.needClothNum) ? (+scope.row.needClothNum).toFixed(2) : '-'
        }
      },
      '_garmentPartName': {
        prop: 'garmentPartName',
        label: '成衣部位',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_dyeCraft': {
        prop: 'dyeCraft',
        label: '染整工艺',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const dyeCraft = scope.row.dyeCraft ? JSON.parse(scope.row.dyeCraft).join(',') : '-'
          // console.log(JSON.parse(scope.row.dyeCraft))
          return dyeCraft
        }
      },
      '_produceProcess': {
        prop: 'produceProcess',
        label: '生产流程',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_customerName': {
        prop: 'customerName',
        label: '客户',
        minWidth: '80',
        showOverflowTooltip: true
      }
    }
    const searchData = {
      _tableForm: {
        prop: 'dynamicTableForm',
        headerCellStyle: { 'background-color': '#F5F7FA', height: '44px' },
        className: 'pop-table',
        itemType: 'table-form',
        label: '',
        labelWidth: '0',
        dataSource: [],
        columns: columnsInfos,
        tooltipEffect: 'dark'
      }
    }
    return {
      searchData,
      formOtions: {
        popError: true,
        size: 'small',
        syncDataHandle: (syncData) => {
          console.log(syncData)
          this.$refs.searchForm && this.$refs.searchForm.$children[0] && this.$refs.searchForm.$children[0].validate((valid) => {
            if (valid) {
              this.options.footerComponentOption.errFlag = true
              this.options.footerComponentOption.handle(syncData.dynamicTableForm)
            } else {
              this.options.footerComponentOption.errFlag = false
              return false
            }
          })
        //   this.options.footerComponentOption.handle(syncData.dynamicTableForm)
        }
      },
      formDatas: {}
    }
  },
  computed: {
    yarnData() {
      console.log(this.options)
      return this.options.footerComponentOption.dataSource
    }
  },
  watch: {
    yarnData: {
      handler(v) {
        console.log(v)
        if (v && v.length) this.formDatas = { dynamicTableForm: v }
      }
    }
  }
}
</script>

<style lang="scss">
    .dynamic-table {
      position: relative;
      // margin-top: 20px;
      margin-top: 41px;
      font-size: 16px;
      .title {
        margin-bottom: 15px;
      }
      .interval {
        position: absolute;
        top: -35px;
        left: -20px;
        width: 1240px;
        height: 16px;
        background-color: #eef5f9;
      }
    }
</style>
