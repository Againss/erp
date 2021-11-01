<!--
 * @Descripttion:染纱需求列表弹框
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-23 14:11:18
-->
<template>
  <div class="material-datainfoindex">
    <!-- 弹框 -->
    <cs-custom-pop ref="servePop" :options="requisitionOptions" />
  </div>
</template>

<script>
import { WaitingPlant } from '../api/index'
import { setOrderFun } from '../../public/mou'
export default {
  components: {},
  mixins: [setOrderFun],
  props: {
    isEdit: {
      type: Boolean
    },
    activeIndex: {
      type: String
    },
    orderData: {
      type: Object
    },
    data: {
      type: Object
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    },
    syncPop: {
      type: Function
    },
    taskNo: {
      type: String
    },
    removeInfoArray: {
      // 删除保留数组
      type: Array
    }
  },
  data() {
    const headerCellStyle = {
      background: '#F5F7FA'
    }
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const materialColumns = {
      // 原料信息
      _selectionc: {
        prop: 'selection',
        type: 'selection',
        className: 'precautionscolor',
        label: ''
      },
      _code: {
        prop: 'yarnCode',
        label: '序号',
        width: '50',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _skuId: {
        prop: 'skuId',
        label: '成品编码',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.skuId || ''
        }
      },
      _clothName: {
        prop: 'clothName',
        label: '布类',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.clothName || ''
        }
      },
      _yarnId: {
        prop: 'yarnId',
        label: '色纱编码',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnId || ''
        }
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱别',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnType || ''
        }
      },
      _yarnAttributes: {
        prop: 'yarnAttributes',
        label: '纱属性',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnAttributes || ''
        }
      },
      _dyeingColor: {
        prop: 'dyeingColor',
        label: '染纱颜色',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.dyeingColor || ''
        }
      },
      _planQty: {
        prop: 'planQty',
        label: '排产数量(KG)',
        minWidth: 140,
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.planQty)
        }
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划交期',
        className: 'ruleTip',
        rules: [commonBlurReg],
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.planDelivery
            ? this.$filters.parseTime(
              scope.row.planDelivery + '',
              '{y}-{m}-{d}'
            )
            : '-'
        }
      },
      _arrangeQty: {
        prop: 'arrangeQty',
        label: '已排总量(KG)',
        width: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.arrangeQty)
        }
      },
      _notQty: {
        prop: 'notQty',
        label: '未排总量(KG)',
        width: '120',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.notQty)
        }
      }
    }
    const requisitionOptions = {
      itemType: 'dialog',
      visible: false,
      title: '添加染纱需求',
      width: '90%',
      formDatas: {},
      formOptions: {},
      ok: (parme) => {
        if (
          !parme.hasOwnProperty('selectionArr') ||
          !parme.selectionArr.length
        ) {
          this.$message({ type: 'error', message: '请先添加一条数据' })
          return false
        } else {
          this.syncPop('servePop', parme.selectionArr || [])
          this.clearData()
        }
      },
      cancel: () => {
        this.clearData()
      },
      close: () => {
        this.clearData()
      },
      content: {
        _dataSource: {
          itemType: 'table',
          selectionChange: (val) => {
            this.selectionClick(val)
          },
          pagination,
          dataSource: [],
          columns: materialColumns
        }
      },
      popDialogHandle: () => {
        this.servePopDialogHandle()
      }
    }
    const pagination = {
      currentChange: (val) => {
        const com = { pageSize: this.pagination.pageSize || 20, pageNum: val }
        this.getData(com)
      },
      sizeChange: (val) => {
        this.$set(this.pagination, 'currentPage', 1)
        const com = { pageNum: 1, pageSize: val }
        this.getData(com)
      }
    }
    return {
      headerCellStyle,
      materialColumns,
      requisitionOptions,
      pagination,
      multipleSelection: []
    }
  },
  watch: {
    'requisitionOptions.visible': {
      // 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val) {
          this.getData()
        } else {
          this.requisitionOptions.formDatas = {}
        }
      }
    }
  },
  methods: {
    popHandle() {
      // 纱线编码显隐'SO0002'
      this.$set(
        this.requisitionOptions,
        'visible',
        !this.requisitionOptions.visible
      )
    },
    async getData() {
      const res = await WaitingPlant({ taskNo: this.taskNo })
      if (this.$pub.responseValidate(res)) {
        const IndexData = this.$utils.deepClone(res.data)
        IndexData &&
          IndexData.forEach((item) => {
            item.iscodeIndex = this.setIDCode(item)
            item.factoryNumCopy = item.factoryNum || 0
            item.edit = true
            // if (item.notQty === 0 || item.notQty === '0') { item.factoryNumEdit = true }
          })
        this.requisitionOptions.content._dataSource.dataSource = IndexData
      }
    },
    clearData() {
      this.requisitionOptions.visible = false
      this.searchFormDatas = {}
      this.requisitionOptions.content._dataSource.dataSource = []
      this.requisitionOptions.formDatas = {}
    },
    // 分录勾选
    selectionClick(e) {
      this.requisitionOptions.formDatas = { selectionArr: e }
    }
  }
}
</script>

<style lang="scss">
.material-datainfoindex {
  .precautionscolor {
    .cell {
      padding-left: 20px;
    }
  }
}
</style>

<style lang="scss" scoped>
.material-datainfoindex {
  /deep/.el-dialog__body {
    padding: 0 20px;
  }
  /deep/ .el-table {
    td {
      height: 50px;
      line-height: 50px;
      padding: 0;
      background: #fff;
    }
    th.is-leaf {
      height: 44px;
      line-height: 44px;
      padding: 0;
      background: #f5f7fa;
    }
  }
  .precautionscolor {
    .cell {
      padding-left: 20px;
    }
  }
}
</style>
