<!--
 * @Descripttion:染纱需求列表弹框
 * @version:
 * @Author: anthony
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: anthony
 * @LastEditTime: 2021-07-19 09:58:48
-->
<template>
  <div class="material-datainfo">
    <!-- 弹框 -->
    <cs-custom-pop ref="servePop" :options="requisitionOptions" />
  </div>
</template>

<script>
import { getPupList } from '../api/index.js'
import { setOrderFun } from '../../public/mou'
import { deepClone } from '@/utils'
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
      type: String
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
    indexCode: {
      type: String
    },
    orderDetail: { // 分录数组
      type: Array
    },
    removeInfoArray: { // 删除保留数组
      type: Array
    }
  },
  data() {
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    const materialColumns = { // 原料信息
      _selectionc: {
        prop: '',
        type: 'selection',
        label: ''
      },
      _code: {
        prop: 'yarnCode',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _skuId: {
        prop: 'skuId',
        label: '花布编码',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.skuId || ''
        }
      },
      _clothId: {
        prop: 'clothId',
        label: '布类',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cloth ? scope.row.cloth.label : ''
        }
      },
      _suggest: {
        prop: 'suggest',
        label: '规格',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.suggest || ''
        }
      },
      _factoryColor: {
        prop: 'factoryColor',
        label: '工厂色号',
        width: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.factoryColor || ''
        }
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱名',
        width: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnType || ''
        }
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        width: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnAttr || ''
        }
      },
      _customerColor: {
        prop: 'customerColor',
        label: '客户颜色',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.customerColor || ''
        }
      },
      _tech: {
        prop: 'tech',
        label: '工艺',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.tech || ''
        }
      },
      _planQty: {
        prop: 'qty',
        label: '排产数量(KG)',
        width: '140',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.qty || ''
        }
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划交期',
        width: '140',
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
      // _printDelivery: {
      //   prop: 'printDelivery',
      //   label: '印花交期',
      //   width: '140',
      //   showOverflowTooltip: true,
      //   formater: (scope) => {
      //     return scope.row.printDelivery
      //       ? this.$filters.parseTime(
      //         scope.row.printDelivery + '',
      //         '{y}-{m}-{d}'
      //       )
      //       : '-'
      //   }
      // },
      // _qtyplanFactory: {
      //   prop: 'planQty',
      //   label: '排厂量(KG)',
      //   className: 'ruleTip',
      //   minWidth: '120',
      //   editOptions: {
      //     itemType: 'input',
      //     labelWidth: '0',
      //     itemProp: 'planQty',
      //     rules: [
      //       { trigger: 'change' }
      //     ],
      //     trim: (val) => {
      //       return inputFilter(val)
      //     },
      //     change: (value, form, formDatas, setFormDatas) => {

      //     }
      //   },
      //   handle: (scope) => {},
      //   formater: (scope) => {
      //     this.$set(scope.row, 'edit', true)
      //     return scope.row.planQty
      //   }
      // },
      _arrangeFactoryQty: {
        prop: 'arrangeFactoryQty',
        label: '已排总量(KG)',
        align: 'right',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.arrangeFactoryQty || ''
        }
      },
      _notQty: {
        prop: 'notQty',
        label: '未排总量(KG)',
        align: 'right',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.qty - scope.row.arrangeFactoryQty) || ''
        }
      }
    }
    const requisitionOptions = {
      itemType: 'dialog',
      visible: false,
      title: '选择印花需求',
      width: '80%',
      formDatas: {},
      formOptions: {
        popError: true
      },
      ok: (parme) => {
        if (!parme.hasOwnProperty('selectionArr') || !parme.selectionArr.length) {
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
        _customerColor: {
          prop: 'customerColor',
          itemType: 'input',
          label: '客户颜色:',
          filterable: true,
          placeholder: '请输入客户颜色',
          valueType: 'object',
          itemStyle: { width: '23%', display: 'inline-block' },
          dataSource: []
        },
        _clothName: {
          prop: 'clothName',
          itemType: 'input',
          label: '布类',
          placeholder: '请输入布类',
          itemStyle: { width: '23%', display: 'inline-block' },
          clear: (form, formDatas, setFormDatas, scope) => {
            this.searchFormDatas.clothId = ''
          },
          clearable: true
        },
        _skuId: {
          prop: 'skuId',
          itemType: 'input',
          label: '花布编码',
          placeholder: '请输入花布编码',
          itemStyle: { width: '23%', display: 'inline-block' },
          clear: (form, formDatas, setFormDatas, scope) => {
            this.searchFormDatas.skuId = ''
          },
          clearable: true
        },
        _operate: {
          itemType: 'operate',
          submitText: '查询',
          itemStyle: { width: '30%', display: 'inline-block' },
          submitHandle: params => {
            const p = deepClone(params)
            // 提交时间
            if (p.hasOwnProperty('submitTime') && p.submitTime) {
              p.startDateTime = p.submitTime[0]
              p.endDateTime = p.submitTime[1]
            }
            delete p.submitTime
            this.searchFormDatas = p
            this.getData(p)
          },
          resetHandle: () => {
            this.searchFormDatas = {}
          }
        },
        _submitTime: {
          prop: 'submitTime',
          itemType: 'date',
          type: 'daterange',
          label: '计划交期',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          format: 'yyyy-MM-dd',
          valueFormat: 'timestamp',
          defaultTime: ['00:00:00', '23:59:59'],
          itemStyle: { width: '23%', display: 'inline-block' }
          // itemType: 'date',
          // type: 'daterange',
          // prop: 'dateRange',
          // label: '提交日期:',
          // itemStyle: { width: '25%', display: 'inline-block' },
          // // pickerOptions: pickerOptions,
          // startPlaceholder: '开始日期',
          // endPlaceholder: '结束日期',
          // format: 'yyyy-MM-dd',
          // valueFormat: 'timestamp',
          // defaultTime: ['00:00:00', '23:59:59']
        },
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
      // component: PopDialog
    }
    const pagination = {
      pagerCount: 3,
      currentChange: val => {
        const com = { pageSize: this.pagination.pageSize || 20, pageNum: val }
        this.getData(com, false)
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        const com = { pageNum: 1, pageSize: val }
        this.getData(com, false)
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
    'requisitionOptions.visible': {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val) {
          this.getData()
        }
      }
    }
  },
  created() {
    console.log(this.orderData, 'orderData')
  },
  mounted() {
  },
  methods: {
    popHandle() { // 纱线编码显隐
      this.$set(this.requisitionOptions, 'visible', !this.requisitionOptions.visible)
    },
    async getData(data = {}) {
      const taskNo = this.orderData
      const res = await getPupList({ 'taskNo': taskNo, ...data })
      if (this.$pub.responseValidate(res)) {
        const IndexData = this.$utils.deepClone(res.data)
        IndexData && IndexData.forEach(item => {
          item.edit = true
          item.iscodeIndex = this.setIDCode(item)
        })
        this.requisitionOptions.content._dataSource.dataSource = IndexData
      }
    },
    clearData() {
      this.requisitionOptions.visible = false
      this.searchFormDatas = {}
      this.requisitionOptions.content._dataSource.dataSource = []
    },
    // 分录勾选
    selectionClick(e) {
      this.requisitionOptions.formDatas = { 'selectionArr': e }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-form-item__content {
  margin-left: 90px !important;
}
/deep/ .el-form-item__label-wrap {
    width: 90px!important;
  }
/deep/.el-form .el-form-item:last-of-type{
  .el-form-item__content{
    margin-left: 0 !important;
  }
}
/deep/.el-form {
  position: relative;
}
/deep/.el-form-item .el-form-item__content .operate {
  width: 100% !important;
}
/deep/.el-table--medium th {
  padding: 0;
  height: 44px;
  background: #f5f7fa;
}
/deep/.el-table--medium td {
  padding: 0;
  height: 50px;
}
</style>
