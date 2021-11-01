<!--
 * @Descripttion:染整需求列表弹框
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: anthony
 * @LastEditTime: 2021-07-19 09:56:19
-->
<template>
  <div class="dyeing_demand_detail_pup">
    <!-- 弹框 -->
    <cs-custom-pop ref="servePop" :options="requisitionOptions" />
  </div>
</template>

<script>
import { getPupList } from '../api/index'
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
      _index: {
        prop: 'index',
        label: '序号',
        width: '60',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _skuId: {
        prop: 'skuId',
        label: '产品编码',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.skuId || ''
        }
      },
      _cloth: {
        prop: 'cloth',
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
      _factoryColorNo: {
        prop: 'factoryColorNo',
        label: '工厂色号',
        width: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.factoryColorNo || ''
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
        width: '140',
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
        label: '染整工艺',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.tech || ''
        }
      },
      _planQty: {
        prop: 'qty',
        label: '排产数量',
        align: 'right',
        width: '140',
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
      // _dyeDelivery: {
      //   prop: 'dyeDelivery',
      //   label: '染整交期',
      //   className: 'ruleTip',
      //   width: '150',
      //   showOverflowTooltip: true,
      //   formater: (scope) => {
      //     return '-'
      //     // return scope.row.dyeDelivery
      //     //   ? this.$filters.parseTime(
      //     //     scope.row.dyeDelivery + '',
      //     //     '{y}-{m}-{d}'
      //     //   )
      //     //   : '-'
      //   }
      // },
      // _qtyplanFactory: {
      //   prop: 'planQty',
      //   label: '排厂量(KG)',
      //   showOverflowTooltip: true,
      //   minWidth: '120',
      //   handle: (scope) => {},
      //   formater: (scope) => {
      //     return scope.row.planQty || ''
      //   }
      // },
      _arrangeFactoryQty: {
        prop: 'arrangeFactoryQty',
        label: '已排总量',
        align: 'right',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.arrangeFactoryQty || ''
        }
      },
      _notQty: {
        prop: 'notQty',
        label: '未排总量',
        align: 'right',
        width: '140',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.qty - scope.row.arrangeFactoryQty) || ''
        }
      }
    }
    // 弹窗配置
    const requisitionOptions = {
      itemType: 'dialog',
      visible: false,
      title: '选择染整需求',
      width: '80%',
      formDatas: {},
      formOptions: {},
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
          itemStyle: { width: '23%', display: 'inline-block' },
          clear: (form, formDatas, setFormDatas, scope) => {
            this.searchFormDatas.customerColor = ''
          },
          clearable: true
        },
        _clothName: {
          prop: 'clothName',
          itemType: 'input',
          label: '布类',
          placeholder: '请输入布类',
          itemStyle: { width: '23%', display: 'inline-block' },
          clear: (form, formDatas, setFormDatas, scope) => {
            this.searchFormDatas.clothName = ''
          },
          clearable: true
        },
        _skuId: {
          prop: 'skuId',
          itemType: 'input',
          label: '产品编码',
          placeholder: '请输入产品编码',
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
            const searchData = deepClone(params)
            // 计划交期
            if (searchData.hasOwnProperty('planDelivery') && searchData.planDelivery) {
              searchData.startDateTime = searchData.planDelivery[0]
              searchData.endDateTime = searchData.planDelivery[1]
            }
            delete searchData.planDelivery
            this.searchFormDatas = searchData
            this.list(searchData)
          },
          resetHandle: () => {
            this.searchFormDatas = {}
          }
        },
        _planDelivery: {
          prop: 'planDelivery',
          itemType: 'date',
          type: 'daterange',
          label: '计划交期:',
          itemStyle: { width: '23%', display: 'inline-block' },
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          format: 'yyyy-MM-dd',
          valueFormat: 'timestamp',
          defaultTime: ['00:00:00', '23:59:59']
        },

        _dataSource: {
          itemType: 'table',
          selectionChange: (val) => {
            this.selectionClick(val)
          },
          dataSource: [],
          columns: materialColumns
        }
      },
      popDialogHandle: () => {
        this.servePopDialogHandle()
      }
    }
    return {
      headerCellStyle,
      materialColumns,
      requisitionOptions,
      multipleSelection: []
    }
  },
  watch: {
    'requisitionOptions.visible': {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val) {
          this.list()
        }
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 弹窗显隐
    popHandle() {
      this.$set(this.requisitionOptions, 'visible', !this.requisitionOptions.visible)
    },
    // 获取变更排厂列表数据
    async list(data = {}) {
      const taskNo = this.orderData
      const res = await getPupList({ 'taskNo': taskNo, ...data })
      if (this.$pub.responseValidate(res)) {
        const IndexData = this.$utils.deepClone(res.data)
        IndexData && IndexData.forEach(item => {
          item.iscodeIndex = this.setIDCode(item)
          item.edit = true
        })
        this.requisitionOptions.content._dataSource.dataSource = IndexData
      }
    },
    // 清除弹窗数据
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
/deep/.el-form-item .el-form-item__content .operate {
  width: 100% !important;
}
/deep/.el-form {
  position: relative;
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
/deep/ .el-form-item__label-wrap {
        text-align: right;
        margin: 0!important;
        width: 120px;
      }
</style>
