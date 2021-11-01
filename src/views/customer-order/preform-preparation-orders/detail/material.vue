/**
 * @Description:原料信息
 * @author Roman
 * @date 2021-04-27 15:11:51
 * @edit 2021-04-27 15:11:51
*/
<template>
  <!-- 原料信息 -->
  <div ref="materialList" class="order-items goods-order-items">
    <div class="header-top">
      <span>原料信息</span>
    </div>
    <div class="material-datainfo">
      <cs-custom-form ref="materialData" class="page-table-border" :data-source="materialData" :options="formOptions" :form-datas="materiaformDatas" />
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
import { querySupplier } from './api'
export default {
  name: 'Materialcustom',
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
    // 交期数量弹窗内容
    const popContent = {
      _certificate: {
        prop: 'certificate',
        label: '证书要求',
        itemType: 'select',
        valueType: 'object',
        clearable: true,
        placeholder: '请选择证书要求',
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '备坯单', fieldName: '证书要求' }, 'combine')
        },
        dataSource: []
      },
      _supplier: {
        prop: 'supplier',
        label: '供应商',
        itemType: 'select',
        clearable: true,
        filterable: true,
        rules: [],
        placeholder: '输入文字模糊查询',
        valueType: 'object',
        visibleChange: value => {
          this.getSelect({ supplierCategory: '0', supplierType: '1' })
        },
        dataSource: []
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        label: '供应商纱线编码',
        itemType: 'input',
        clearable: true,
        maxlength: 50
      }
    }
    // 交期数量弹窗配置
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '编辑原料信息',
      okText: '保存',
      ok: params => {
        if (params.supplierYarnCode && ((!params.supplier || !params.supplier.value))) {
          this.$message({
            message: '供应商不能为空！',
            type: 'error'
          })
          return false
        }
        const data = { ...this.currentRow.row, ...params }
        const newData = this.$utils.deepClone(this.materialData._tableForm.dataSource)
        newData.splice(this.currentRow.$index, 1, data)
        this.materialData._tableForm.dataSource = newData
        // this.materiaformDatas=newData
        this.syncMoudleDataHandle('materialData', newData)
        this.popHandle()
      },
      cancel: params => {
        this.popHandle()
      },
      close: this.popClose,
      formDatas: {},
      formOptions: {},
      content: popContent
    }
    const tableOperates = {
      label: '操作',
      width: '60',
      dataSource: [{
        label: '编辑',
        isShow: true,
        handle: scope => {
          // console.log(scope)
          // this.allPopHandle('编辑颜色&数量&交期')
          const om = this.popOptions.content
          this.$set(om._certificate, 'dataSource', this.funscope(scope.row.certificate) || [])// 预计使用量List
          this.$set(om._supplier, 'dataSource', this.funscope(scope.row.supplier) || [])// 供应商
          this.popOptions.formDatas = { ...scope.row }
          this.currentRow = scope
          this.popHandle()
          // this.editAll = scope.row
          // this.editAll.index = scope.$index
          // if (this.editAll.maxQuantitySeq) {
          //   this.maxQuantitySeq = this.editAll.maxQuantitySeq
          // }
          // // 字段加密内容
          // this.encryptFn(this.allContent, this.rule, 'edit')
        }
      }
      ]
    }
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
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        width: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnName
        }
      },
      _yarnProperty: {
        prop: 'yarnProperty',
        label: '纱属性',
        width: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnProperty
        }
      },
      _certificate: {
        prop: 'certificate',
        label: '证书要求',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.funscope(scope.row.certificate, 2)
        }
      },
      _supplier: {
        prop: 'supplier',
        label: '供应商',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.funscope(scope.row.supplier, 2)
        }
      },
      _supplierYarnCode: {
        prop: 'supplierYarnCode',
        label: '供应商纱线编码',
        showOverflowTooltip: true,
        minWidth: '120'
      }
    }
    const materialData = {
      _tableForm: {
        prop: 'tableForm',
        itemType: 'table-form',
        tooltipEffect: 'dark',
        dataSource: [],
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        columns: materialColumns,
        operates: tableOperates
      }
    }

    return {
      tableOperates,
      currentRow: null,
      popOptions,
      pagination,
      headerCellStyle,
      materiaformDatas: {},
      formOptions: {
        // size: 'medium',
        syncDataHandle: (syncData) => {
          // console.log('syncData', syncData)
          this.syncMoudleDataHandle('materialData', syncData.tableForm)
        }
      },
      // materialDatasource, // 显示数据
      materialData,
      materialColumns// 每列数据
    }
  },
  computed: {},
  watch: {
    isEdit: {
      handler(val, oldVal) {
        if (this.data) {
          const data = this.$utils.deepClone(this.materialData._tableForm.dataSource)
          this.materialData._tableForm.dataSource = data || []
        }
        if (val) {
          this.materialData._tableForm.operates = this.tableOperates
        } else {
          this.materialData._tableForm.operates = null
        }
      },
      deep: true,
      immediate: true
    },
    data: {
      handler(v) {
        if (v) {
          const data = this.$utils.deepClone(v) || []
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
    this.getOptionConfigSelect({ pageName: '备坯单', fieldName: '证书要求' }, 'combine')
    this.getSelect({ supplierCategory: '0', supplierType: '1' })
  },
  mounted() { },
  methods: {
    popHandle() {
      this.popOptions.visible = !this.popOptions.visible
    },
    getCombine() {
      this.getOptionConfig({ pageName: '备坯单', fieldName: '销售季度' }).then(res => {
        this.allQuarter = res || []
      })
    },
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'combine') { // 证书要求
          this.popOptions.content._certificate.dataSource = res
          // this.$set(this.materialData._tableForm.columns._certificate.editOptions, 'dataSource', res)
        }
      })
    },
    // 选项配置下拉
    getSelect(data) {
      querySupplier(data).then(res => {
        let list = res.data || []
        list = list.map(v => {
          return { label: v.supplierName, value: v.id }
        })
        // console.log(res, list)
        this.popOptions.content._supplier.dataSource = list
      })
    },
    popClose() {
      // console.log(123)
      this.currentRow = null
      this.popOptions.content._supplier.rules = []
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
      color: #151222;
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
    /deep/tbody .el-table__row td {
       height: 50px;
    }
    /deep/ .el-form-item__content {
      line-height: 23px !important;
    }
  }
}
</style>
