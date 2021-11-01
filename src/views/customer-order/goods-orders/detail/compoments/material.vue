<!--
 * @Author: xj
 * @Description:原料信息
 * @Date: 2021-04-18 10:20:39
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-27 17:45:01
 * @FilePath: d:\erp\src\views\customer-order\goods-orders\detail\compoments\material.vue
-->
<template>
  <!-- 原料信息 -->
  <div ref="materialList" class="order-items goods-order-items">
    <div class="header-top">
      <span>原料信息</span>
    </div>
    <div class="material-datainfo ">
      <cs-custom-form ref="materialData" class="page-table-border" :data-source="materialData" />
    </div>
  </div>
</template>

<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  name: 'GoodsMaterialcustom',
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    data: {
      type: [Object, Array]
    },
    syncMoudleDataHandle: {
      type: Function
    },
    rule: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // table表头颜色
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getListData({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getListData({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    // const materialDatasource = []
    const materialColumns = { // 原料信息
      _code: {
        prop: 'yarnCode',
        label: '纱线编码',
        width: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnCode || ''
        }
      },
      _yarn: {
        prop: 'yarn',
        label: '纱支/细度',
        width: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div class="icon-itemtext" >'
          scope.row.naturalFiber && scope.row.naturalFiber.forEach(v => {
            html += `<p :title="${this.funscope(v.yarn, 2)}">${this.funscope(v.yarn, 2)}</p>`
          })
          scope.row.chemicalFiber && scope.row.chemicalFiber.forEach(vm => {
            html += `<p  :title="${this.funscope(vm.fineness, 2)}">${this.funscope(vm.fineness, 2)}</p>`
          })
          html += '</div>'
          return html
        }
      },
      _element: {
        prop: 'element',
        label: '成份',
        width: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div  class="icon-itemtext">'
          scope.row.naturalFiber && scope.row.naturalFiber.forEach(v => {
            html += `<p  :title="${this.funscope(v.element, 2)}">${this.funscope(v.element, 2)}</p>`
          })
          scope.row.chemicalFiber && scope.row.chemicalFiber.forEach(vm => {
            html += `<p  :title="${this.funscope(vm.element, 2)}">${this.funscope(vm.element, 2)}</p>`
          })
          html += '</div>'
          return html
        }
      },
      _elementRatio: {
        prop: 'elementRatio',
        label: '比例(%)',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div   class="icon-itemtext" >'
          scope.row.naturalFiber && scope.row.naturalFiber.forEach(v => {
            html += `<p :title="${v.elementRatio || ''}">${v.elementRatio || ''}</p>`
          })
          scope.row.chemicalFiber && scope.row.chemicalFiber.forEach(vm => {
            html += `<p >&nbsp;&nbsp;&nbsp;&nbsp;</p>`
          })
          html += '</div>'
          return html
        }
      },
      _yarnCategory: {
        prop: 'yarnCategory',
        label: '纱类/丝类',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          let html = '<div   class="icon-itemtext">'
          scope.row.naturalFiber && scope.row.naturalFiber.forEach(v => {
            html += `<p class="borbottom">${this.funscope(v.yarnCategory, 2)}</p>`
          })
          scope.row.chemicalFiber && scope.row.chemicalFiber.forEach(vm => {
            html += `<p class="borbottom">${this.funscope(vm.wireCategory, 2)}</p>`
          })
          html += '</div>'
          return html
        }
      },
      _certificate: {
        prop: 'certificate',
        label: '证书要求',
        showOverflowTooltip: true,
        width: '120',
        formater: (scope) => {
          return this.funscope(scope.row.certificate, 2)
        },
        editOptions: {
          labelWidth: '0',
          itemType: 'select',
          valueType: 'object',
          valueKey: 'value',
          clearable: true,
          filterable: true,
          size: 'small',
          change: (value, form, formDatas, setFormDatas) => {
            this.syncMoudleDataHandle('materialData', formDatas.tableForm || [])
          },
          dataSource: []
        }
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        label: '供应商纱线编码',
        showOverflowTooltip: true,
        width: '120',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          maxlength: 50,
          size: 'small',
          change: (value, form, formDatas, setFormDatas) => {
            this.syncMoudleDataHandle('materialData', formDatas.tableForm || [])
          }
        }
      }
    }
    const materialData = {
      _tableForm: {
        prop: 'tableForm',
        itemType: 'table-form',
        tooltipEffect: 'light',
        dataSource: [],
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: materialColumns,
        operates: null
      }
    }
    return {
      pagination,
      headerCellStyle,
      // materialDatasource, // 显示数据
      materialData, // 操作栏
      materialColumns// 每列数据
    }
  },
  computed: {},
  watch: {
    isEdit: {
      handler(val, oldVal) {
        if (this.data) {
          const data = this.$utils.deepClone(this.materialData._tableForm.dataSource)
          data.forEach((item) => { item.edit = val })
          this.materialData._tableForm.dataSource = data || []
        }
      },
      deep: true,
      immediate: true
    },
    data: {
      handler(v) {
        if (v) {
          const data = this.$utils.deepClone(v) || []
          data.forEach((item) => { item.edit = this.isEdit })

          this.materialData._tableForm.dataSource = data
        }
      },
      deep: true,
      immediate: true
    },
    rule: {
      handler(v) { },
      deep: true
    }
  },
  created() {
    this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '证书要求' }, 'combine')
  },
  mounted() { },
  methods: {

    getCombine() {
      this.getOptionConfig({ pageName: '大货订单', fieldName: '销售季度' }).then(res => {
        this.allQuarter = res || []
      })
    },
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'combine') { // 证书要求
          this.$set(this.materialData._tableForm.columns._certificate.editOptions, 'dataSource', res)
        }
      })
    },
    // xw
    funscope(data, type = '1') {
      if (data && data.value) {
        return type === '1' ? [data] : data.label
      } else {
        return type === '1' ? [] : ''
      }
    }
  }
}
</script>

<style lang="scss">
.goods-order-items{
  .icon-itemtext {
    // cursor: pointer;
    p{
      overflow: hidden;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
    }
  }
}
</style>
<style lang="scss" scoped>
.order-items {
  background: #ffffff;
  .header-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 15px 20px;
    span {
      font-size: 16px;
      display: flex;
      // font-weight: 500;
    }
    .el-button {
      display: flex;
      span {
        font-size: 14px;
      }
    }
    .left {
      display: flex;
      align-items: center;
      .title {
        margin-right: 40px;
      }
      .date-title {
        position: relative;
        .item-title::before {
          display: block;
          content: '*';
          position: absolute;
          left: -8px;
          color: #ff4444;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      .total {
        margin: 0 80px;
      }
    }
  }
  .page-table {
    height: auto;
    border-bottom-width: 1px;
  }

  .borbottom {
    border-bottom: 1px solid #dfe6ec;
  }
  .page-table-border {
    /deep/ .el-table--mini{
      font-size: 14px !important;
    }
    /deep/tbody .el-table__row td {
      border-bottom-width: 1px !important;
      padding: 1px  0 !important;
    }
  }
}
</style>
