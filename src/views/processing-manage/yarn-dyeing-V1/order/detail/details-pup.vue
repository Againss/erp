<!--
 * @Descripttion:染纱订单 原料调拨通知 弹框 ==>已提交
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-06-24 11:53:44
-->
<template>
  <div class="material-datainfo requis_DataSummary2">
    <!-- 弹框-->
    <cs-custom-pop
      ref="servePop"
      :options="requisitionOptions"
      edit-type="pop"
    />
  </div>
</template>

<script>
// TransferNotice
import { TransferList } from '../api/index'
import { setOrderFun } from '../../public/mou'
import tableSummation from '@/components/table-summation/index.vue'
import { inputFilter } from '@/views/processing-manage/public/index.js'
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
    data: {
      type: Object
    },
    rowData: {
      type: Object
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    }
  },
  data() {
    const headerCellStyle = {
      background: '#F5F7FA'
    }
    const BlurFactoryNum = (rule, value, callback) => {
      const i = rule.field.split('.')[1]
      const row = this.validateObj.tableForm[i]
      const fa = row.subAllotQty // 调拨量
      const no = row.allotQty // 未调拨量
      if (Number(fa) > Number(no)) {
        return callback(new Error('调拨量不能大于未调拨量'))
      } else {
        console.log('ommm', fa, no)
        // this.sumObj[`_${'subAllotQty'}`].num = this.getSum('subAllotQty')
        callback()
      }
    }
    const MatchingYarn = (rule, value, callback) => {
      const i = rule.field.split('.')[1]
      const row = this.validateObj.tableForm[i]
      const fa = row.subSendQty // 配纱量
      const no = row.sendQty // 未配纱量
      if (Number(fa) > Number(no)) {
        return callback(new Error('配纱量不能大于未配纱量'))
      } else {
        // this.sumObj[`_${'subSendQty'}`].num = this.getSum('subSendQty')
        callback()
      }
    }
    const materialColumns = {
      // 原料信息
      _yarnCode: {
        prop: 'yarnCode',
        label: '坯纱编码',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnCode || ''
        }
      },
      _yarnCard: {
        // pm
        prop: 'yarnCard',
        label: '纱牌/纱批',
        minWidth: 140,
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnCard || ''
        }
      },
      _supplierName: {
        // pm
        prop: 'supplierName',
        label: '仓库',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.supplierName || ''
        }
      },
      _yarnType: {
        // pm
        prop: 'yarnType',
        label: '纱名',
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
      _yarnNum: {
        // pm
        prop: 'yarnNum',
        label: '纱需求量(KG)',
        width: '110',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.yarnNum)
        }
      },
      _subAllotQty: {
        prop: 'subAllotQty',
        label: '调拨量(KG)',
        minWidth: '110',
        editOptions: {
          itemType: 'input',
          placeholder: '请输入',
          labelWidth: '0',
          align: 'right',
          itemProp: 'subAllotQty',
          rules: [{ validator: BlurFactoryNum, trigger: ['change'] }],
          trim: (val) => {
            return inputFilter(val)
          }
        },
        handle: (scope) => {},
        formater: (scope) => {
          return this.DigitalVerification(scope.row.subAllotQty)
        }
      },
      _subAllotDelivery: {
        prop: 'subAllotDelivery',
        label: '计划送纱期',
        minWidth: 150,
        showOverflowTooltip: true,
        handle: (scope) => {},
        formater: (scope) => {
          return scope.row.subAllotDelivery
            ? this.$filters.parseTime(
              scope.row.subAllotDelivery + '',
              '{y}-{m}-{d}'
            )
            : '-'
        },
        editOptions: {
          itemType: 'date',
          labelWidth: '0',
          itemProp: 'subAllotDelivery',
          placeholder: '请选择送纱期',
          clearable: true,
          rules: [
            {
              message: '请选择送纱期',
              trigger: ['change']
            }
          ]
        }
      },
      _subSendQty: {
        prop: 'subSendQty',
        label: '配纱量(KG)',
        minWidth: '110',
        editOptions: {
          itemType: 'input',
          placeholder: '请输入',
          labelWidth: '0',
          align: 'right',
          itemProp: 'subSendQty',
          rules: [{ validator: MatchingYarn, trigger: ['change'] }],
          trim: (val) => {
            return inputFilter(val)
          }
        },
        handle: (scope) => {},
        formater: (scope) => {
          return this.DigitalVerification(scope.row.subSendQty)
        }
      },
      _subSendDelivery: {
        prop: 'subSendDelivery',
        label: '配纱期',
        minWidth: 150,
        showOverflowTooltip: true,
        handle: (scope) => {},
        formater: (scope) => {
          return scope.row.subSendDelivery
            ? this.$filters.parseTime(
              scope.row.subSendDelivery + '',
              '{y}-{m}-{d}'
            )
            : '-'
        },
        editOptions: {
          itemType: 'date',
          labelWidth: '0',
          itemProp: 'subSendDelivery',
          placeholder: '请选择配纱期',
          clearable: true,
          rules: [
            {
              message: '请选择配纱期',
              trigger: ['change']
            }
          ]
        }
      },
      _allotedQty: {
        // pm
        prop: 'allotedQty',
        label: '已调拨量(KG)',
        width: '110',
        align: 'right',
        placeholder: '请输入',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.allotedQty)
        }
      },
      _allotQty: {
        // pm
        prop: 'allotQty',
        label: '未调拨量(KG)',
        width: '110',
        align: 'right',
        placeholder: '请输入',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.allotQty)
        }
      },
      _sendedQty: {
        // pm
        prop: 'sendedQty',
        label: '已配纱量(KG)',
        width: '110',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.sendedQty)
        }
      },
      _sendQty: {
        // pm
        prop: 'sendQty',
        label: '未配纱量(KG)',
        width: '110',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.DigitalVerification(scope.row.sendQty)
        }
      }
    }
    const requisitionOptions = {
      itemType: 'dialog',
      visible: false,
      title: '原料调配通知',
      // width: '1560px',
      className: 'detail requisition',
      width: '90%',
      formDatas: {},
      formOptions: {
        syncDataHandle: (val) => {
          this.validateObj = this.$utils.deepClone(val)
          console.log(val, 'formOptionsformOptions')
        },
        popError: true
      },
      ok: () => {
        this.validateSubmit()
      },
      cancel: () => {
        this.requisitionOptions.visible = false
      },
      close: () => {
        this.requisitionOptions.visible = false
      },
      content: {
        _tableForm: {
          prop: 'tableForm',
          itemType: 'table-form',
          pagination,
          rowKey: 'uuid',
          dataSource: [],
          columns: materialColumns
        },
        _sum: {
          dataSource: [],
          prop: 'sum',
          components: {
            tableSummation
          },
          componentsOptions: {
            _subAllotQty: {
              title: '调拨总数(KG):',
              num: 0
            },
            _allotQty: {
              title: '未调拨总数(KG):',
              num: 0,
              formater: (val) => {
                var sum = 0
                this.requisitionOptions.formDatas &&
                  this.requisitionOptions.formDatas.tableForm &&
                  this.requisitionOptions.formDatas.tableForm.forEach((i) => {
                    sum =
                      this.$utils.getFloat(sum, 2) +
                      this.$utils.getFloat(i.allotQty, 2)
                    sum = this.$utils.getFloat(sum, 2)
                  })
                return sum
              }
            },
            _subSendQty: {
              title: '配纱总数(KG):',
              num: 0
            },
            _sendQty: {
              title: '未配纱总数(KG):',
              num: 0,
              formater: (val) => {
                var sum = 0
                this.requisitionOptions.formDatas &&
                  this.requisitionOptions.formDatas.tableForm &&
                  this.requisitionOptions.formDatas.tableForm.forEach((i) => {
                    sum =
                      this.$utils.getFloat(sum, 2) +
                      this.$utils.getFloat(i.sendQty, 2)
                    sum = this.$utils.getFloat(sum, 2)
                  })
                return sum
              }
            }
          }
        }
      },
      popDialogHandle: () => {
        this.servePopDialogHandle()
      }
    }
    const pagination = {
      currentChange: (val) => {
        const com = { pageSize: this.pagination.pageSize || 20, pageNum: val }
        this.list(com, false)
      },
      sizeChange: (val) => {
        this.$set(this.pagination, 'currentPage', 1)
        const com = { pageNum: 1, pageSize: val }
        this.list(com, false)
      }
    }
    return {
      validateObj: null,
      headerCellStyle,
      materialColumns,
      requisitionOptions,
      pagination,
      selectionArr: []
    }
  },
  computed: {
    sumObj() {
      return this.requisitionOptions.content._sum.componentsOptions
    }
  },
  watch: {
    rowData: {
      handler(val, oldVal) {},
      deep: true,
      immediate: true
    },
    'requisitionOptions.visible': {
      // 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val) {
          console.log('ssssssom', val)
          this.rowData && this.rowData.orderId && this.getData()
        }
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    popHandle() {
      // 纱线编码显隐
      this.$set(
        this.requisitionOptions,
        'visible',
        !this.requisitionOptions.visible
      )
    },
    async getData() {
      const res = await TransferList({ orderId: this.rowData.orderId })
      if (this.$pub.responseValidate(res)) {
        var allotQtyAll = 0
        var sendQtyAll = 0
        const IndexData = this.$utils.deepClone(res.data)
        IndexData &&
          IndexData.forEach((item, i) => {
            item.edit = true
            item.index = i

            allotQtyAll =
              this.$utils.getFloat(item.allotedQty, 2) +
              this.$utils.getFloat(allotQtyAll, 2)
            sendQtyAll =
              this.$utils.getFloat(item.sendedQty, 2) +
              this.$utils.getFloat(sendQtyAll, 2)
          })

        this.sumObj[`_${'subAllotQty'}`].num = this.getSum('subAllotQty')
        this.sumObj[`_${'subSendQty'}`].num = this.getSum('subSendQty')

        this.sumObj[`_${'subAllotQty'}`].num = this.$utils.getFloat(
          allotQtyAll,
          2
        )
        this.sumObj[`_${'subSendQty'}`].num = this.$utils.getFloat(
          sendQtyAll,
          2
        )

        this.requisitionOptions.formDatas = { tableForm: IndexData || {}}
        this.requisitionOptions.content._tableForm.dataSource = IndexData
        console.log('sssss纱线编码显隐')
      }
    },
    clearData() {
      this.requisitionOptions.visible = false
      this.searchFormDatas = {}
      this.requisitionOptions.content._tableForm.dataSource = []
    },
    diff(arr1, arr2) {
      var set1 = new Set(arr1)
      var set2 = new Set(arr2)
      var subset = []
      for (const item of set1) {
        if (!set2.has(item)) {
          subset.push(item)
        }
      }
      return subset
    },
    validateSubmit() {
      const table0 = this.$utils.deepClone(this.validateObj.tableForm)
      // 纵向相同的sku会有多行，然后按照sku分组，组内调拨+配纱 < 单一sku的需求
      var skuArr = []
      const fun = (table) => {
        var out = false
        for (var i = 0; i < table.length; i++) {
          if (!out) {
            var sameArr =
              table.filter(
                (k, p) =>
                  k.yarnCode === table[i].yarnCode && k.index !== table[i].index
              ) || []
            var diffArr = []
            console.log(sameArr, 'sameArr')
            if (sameArr.length) {
              skuArr.push([...sameArr, table[i]])
              diffArr = this.diff(table, [...sameArr, table[i]])
            } else {
              skuArr.push([table[i]])
              diffArr = this.diff(table, [table[i]])
            }
            if (diffArr.length && diffArr.length > 1) {
              fun(diffArr)
            } else if (diffArr.length && diffArr.length === 1) {
              skuArr.push(diffArr)
              out = true
            } else {
              out = true
            }
          }
          break
        }
      }
      fun(table0) // sku分组
      console.log(skuArr, 'skuArr')
      for (var k = 0; k < skuArr.length; k++) {
        var obj = skuArr[k]
        var skuSum = 0
        var needQty = 0
        for (var j = 0; j < obj.length; j++) {
          // 每个SKU
          var e = obj[j]
          if (e.allotQty && e.allotQty > 0) {
            // 未调拨量
            // if (!e.qtyNew || !e.allotPlanDelivery) {
            if (
              Boolean(parseFloat(e.subAllotQty)) !== Boolean(e.subAllotDelivery)
            ) {
              this.$message({
                // message: '请补充完成调拨量',
                message: `请补充完成第${e.index + 1}信息`,
                type: 'warning'
              })
              return
            } else if (
              Boolean(parseFloat(e.subAllotQty)) &&
              Boolean(e.subAllotDelivery)
            ) {
              skuSum =
                this.$utils.getFloat(skuSum, 2) +
                this.$utils.getFloat(e.subAllotQty || 0, 2)
              skuSum = this.$utils.getFloat(skuSum, 2)
              console.log('skuSu1m', skuSum)
            }
          }
          if (e.sendQty && e.sendQty > 0) {
            // 未配纱量
            if (
              Boolean(parseFloat(e.subSendQty)) !== Boolean(e.subSendDelivery)
            ) {
              this.$message({
                message: `请补充完成第${e.index + 1}信息`,
                type: 'warning'
              })
              return
            } else if (
              Boolean(parseFloat(e.subSendQty)) &&
              Boolean(e.subSendDelivery)
            ) {
              skuSum =
                this.$utils.getFloat(skuSum, 2) +
                this.$utils.getFloat(e.subSendQty || 0, 2)
              skuSum = this.$utils.getFloat(skuSum, 2)
              console.log('skuSu2m', skuSum)
            }
          }
          needQty = parseFloat(e.yarnNum || 0)
        }
        console.log(skuSum, needQty)
        console.log(k, 'k', skuArr[k])
        if (skuSum > needQty) {
          // SKU之和不大于该SKU总需求
          this.$message({
            message: `纱线编码${skuArr[k][0].yarnCode}的调拨量总计超过总需求量`,
            type: 'warning'
          })
          return
        }
      } // 校验成功
      console.log('ommm我成功了', {
        orderId: this.rowData.orderId,
        demandDetailMaterials: this.validateObj.tableForm
      })
      var details = []
      this.validateObj.tableForm.forEach((i) => {
        var obj = {}
        if (i.subAllotQty) {
          obj.subAllotQty = i.subAllotQty
          obj.subAllotDelivery = i.subAllotDelivery
        }
        if (i.subSendQty) {
          obj.subSendQty = i.subSendQty
          obj.subSendDelivery = i.subSendDelivery
        }
        if (i.subAllotQty || i.subSendQty) {
          details.push(obj)
        }
      })
      if (!details.length) {
        this.$message({
          message: '至少添加一条有效数据',
          type: 'warning'
        })
        return
      } else {
        this.$emit('AllocationClcik', {
          orderId: this.rowData.orderId,
          demandDetailMaterials: this.validateObj.tableForm
        })
        this.requisitionOptions.visible = false
      }
    },
    getSum(property) {
      var sum = 0
      this.validateObj &&
        this.validateObj.tableForm &&
        this.validateObj.tableForm.length &&
        this.validateObj.tableForm.forEach((i) => {
          sum =
            this.$utils.getFloat(sum, 2) +
            this.$utils.getFloat(i[property] || 0, 2)
          sum = this.$utils.getFloat(sum, 2)
        })
      return sum || 0
    }
  }
}
</script>
<style lang="scss" scoped>
.material-datainfo {
  /deep/.el-dialog__body {
    padding: 0 20px !important;
    /deep/ .el-table {
      font-size: 14px;
      td {
        height: 50px;
        line-height: 50px;
        padding: 0;
      }
      th .cell {
        height: 40px;
        line-height: 40px;
      }
    }
  }
  .detail {
    /deep/ .el-table td {
      border-bottom: 1px solid #dfe6ec;
      height: 50px;
      padding: 0;
    }
    /deep/ .el-table th.is-leaf {
      padding: 0;
      background: #f5f7fa;
      height: 44px;
    }
  }
  /deep/ th.ruleTip .cell::before {
    display: block;
    content: "*";
    position: absolute;
    left: 4px;
    color: #fe4949;
  }
}
</style>
