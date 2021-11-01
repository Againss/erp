<template>
  <div
    id="yarn-dyeing-v1-detailBranch"
    class="analyse_detail_cxp"
    :class="isEdit ? '' : 'analyse_detail_disable1'"
  >
    <div class="header-product">
      <cs-custom-form
        :key="id"
        :data-source="msgDataSource"
        :options="formOptions"
        :form-datas="formDatas"
      />
    </div>
    <div class="order-items goods-order-items">
      <div v-if="isEdit && activeName === 'Y'" class="header-top">
        <div class="Info_div">
          <el-button
            class="Info_button"
            size="mini"
            @click="add"
          >添加</el-button>
          <el-button
            class="Info_button Info_remove"
            size="mini"
            @click="remove"
          >移除</el-button>
        </div>
      </div>
      <div class="material-datainfo">
        <!-- :reset-errors="isEdit" -->
        <cs-custom-form
          class="page-table-border"
          :data-source="tableDataSource"
          :options="tableFormOptions"
          edit-type="pop"
        />
      </div>
    </div>
    <cs-custom-pop
      v-if="requisitionOptions.visible"
      :options="requisitionOptions"
    />
  </div>
</template>

<script>
import { inputFilter } from '@/views/processing-manage/public/index.js'
import * as api from '@/views/processing-manage/yarn-dyeing-V1/demand/api/index.js'
import * as apiPub from '@/views/processing-manage/public/api/index.js'
export default {
  props: {
    activeName: {
      type: String
    },
    id: {
      type: String
    },
    isEdit: {
      type: Boolean
    },
    taskNo: {
      type: String
    }
  },
  data() {
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    var BlurFactoryNum = (rule, value, callback) => {
      const i = rule.field.split('.')[1]
      const row = this.result.demandDetailSubmitRequests.tableForm.tableForm[i]
      const fa = row.factoryNum // 排厂量
      const no = row.notQty // 未排总量
      const faCopy = row.factoryNumCopy // 一进入页面 默认的排厂量
      const im =
        this.$utils.getFloat(faCopy, 2) * 1 + this.$utils.getFloat(no, 2) * 1
      const ip = this.$utils.getFloat(fa, 2) * 1
      if (!fa) {
        return callback(new Error('请输入排厂量'))
      } else if (Number(ip) > Number(im)) {
        return callback(new Error('排厂量不能大于未排总量'))
      } else {
        callback()
      }
    }
    const ismax999Reg = this.$getRules({
      type: 'number',
      pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/,
      message: '0~99999999.99',
      trigger: ['blur']
    })
    const detailStyle = {
      width: '30%',
      'line-height': '20px',
      'margin-bottom': '0'
    }
    const msgDataSource = {
      _supplier: {
        prop: 'supplier',
        itemType: this.selectTypeChange,
        itemStyle: detailStyle,
        label: '染纱厂：',
        valueType: 'object',
        clearable: true,
        filterable: true,
        rules: [
          { required: true, message: '染纱厂不能为空', trigger: 'change' }
        ],
        dataSource: [],
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          if (value) {
            return `<div title='${
              value ? value.label : ''
            }' class='yarn-style'>${value ? value.label : ''}</div>`
          } else {
            return ''
          }
        }
      },
      _pmUser: {
        prop: 'pmUser',
        itemType: this.selectTypeChange,
        itemStyle: detailStyle,
        label: '跟单人员：',
        valueType: 'object',
        itemClassName: 'demandDetailRight',
        filterable: true,
        rules: [
          { required: true, message: '跟单人员不能为空', trigger: 'change' }
        ],
        clearable: true,
        dataSource: [],
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          if (value) {
            return `<div class='yarn-style'>${value ? value.label : ''}</div>`
          } else {
            return ''
          }
        }
      },
      _orderId: {
        prop: 'orderId',
        itemType: 'itemview',
        itemClassName: 'demandDetailRight',
        itemStyle: detailStyle,
        label: '染纱单号：',
        clearable: true,
        isShow: (scope) => {
          return this.activeIndex === '2'
        },
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          if (value) {
            return `<div title='${value}' class='yarn-style'>${value}</div>`
          } else {
            return ''
          }
        }
      },
      _createdByName: {
        prop: 'createdByName',
        itemType: 'itemview',
        itemClassName: 'hide_18px',
        itemStyle: detailStyle,
        label: '排厂人：',
        clearable: true,
        isShow: (scope) => {
          return this.activeIndex === '2'
        },
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          if (value) {
            return `<div title='${value}' class='yarn-style'>${value}</div>`
          } else {
            return ''
          }
        }
      },
      _createdTime: {
        prop: 'createdTime',
        itemType: 'itemview',
        itemClassName: 'hide_18px demandDetailRight',
        itemStyle: detailStyle,
        label: '排厂时间：',
        isShow: (scope) => {
          return this.activeIndex === '2'
        },
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          if (value) {
            return `<div class='yarn-style'>${
              value ? this.$filters.parseTime(value) : '-'
            }</div>`
          } else {
            return ''
          }
        }
      },
      _status: {
        prop: 'status',
        itemType: 'itemview',
        itemStyle: detailStyle,
        label: '状态：',
        itemClassName: 'hide_18px demandDetailRight',
        clearable: true,
        isShow: (scope) => {
          return this.activeIndex === '2'
        },
        renderContent: (
          value,
          options,
          form,
          formDatas,
          setFormDatas,
          scope
        ) => {
          if (value) {
            return this.getStatus(value)
          } else {
            return ''
          }
        }
      }
    }
    const tableColumns = {
      // 原料信息
      _selectionc: {
        prop: 'iscodeIndex',
        type: 'selection',
        className: 'precautionscolor',
        isShow: (scope) => {
          return this.isEdit
        },
        label: ''
      },
      _code: {
        prop: 'yarnCode',
        label: '序号',
        minWidth: '50',
        itemClassName: 'tionsco',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _skuId: {
        prop: 'skuId',
        label: '成品编码',
        minWidth: '120',
        showOverflowTooltip: true
      },
      _clothName: {
        prop: 'clothName',
        label: '布类',
        showOverflowTooltip: true
      },
      _yarnId: {
        prop: 'yarnId',
        label: '色纱编码',
        showOverflowTooltip: true
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱别',
        showOverflowTooltip: true
      },
      _yarnAttributes: {
        prop: 'yarnAttributes',
        label: '纱属性',
        showOverflowTooltip: true
      },
      _dyeingColor: {
        prop: 'dyeingColor',
        label: '染纱颜色',
        showOverflowTooltip: true
      },
      _planQty: {
        prop: 'planQty',
        label: '排产数量(KG)',
        width: '110',
        align: 'right',
        showOverflowTooltip: true
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划交期',
        minWidth: 110,
        align: 'center',
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
      _dyeingDelivery: {
        prop: 'dyeingDelivery',
        label: '染纱交期',
        minWidth: '155',
        align: 'right',
        editOptions: {
          itemType: 'date',
          valueFormat: 'timestamp',
          labelWidth: '0',
          size: 'mini',
          clearable: true,
          itemProp: 'dyeingDelivery',
          placeholder: '请选择',
          rules: [
            { required: true, message: '请选择染纱交期', trigger: 'change' }
          ]
        },
        formater: (scope) => {
          return scope.row.dyeingDelivery
            ? this.$filters.parseTime(
              scope.row.dyeingDelivery + '',
              '{y}-{m}-{d}'
            )
            : ''
        }
      },
      _factoryNum: {
        prop: 'factoryNum',
        label: '排厂量(KG)',
        align: 'right',
        minWidth: '120',
        editOptions: {
          placeholder: '请输入',
          itemType: 'input',
          size: 'mini',
          labelWidth: '0',
          // clearable: true,
          itemProp: 'factoryNum',
          rules: [
            { required: true, validator: BlurFactoryNum, trigger: 'blur' },
            ismax999Reg
          ],
          trim: (val) => {
            return inputFilter(val)
          }
        }
      },
      _arrangeQty: {
        prop: 'arrangeQty',
        label: '已排总量(KG)',
        width: '120',
        align: 'right',
        showOverflowTooltip: true
      },
      _notQty: {
        prop: 'notQty',
        label: '未排总量(KG)',
        width: '120',
        align: 'right',
        showOverflowTooltip: true
      }
    }
    const tableDataSource = {
      _tableForm: {
        prop: 'tableForm',
        rowKey: 'id',
        itemType: 'table-form',
        headerCellClassName: this.isSing,
        syncFormDatasToDataSource: false,
        getTable: (val) => {
          this.table = val
        },
        dataSource: [],
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        selectionChange: (val) => {
          this.result.selection = val
          this.$emit('form', this.result)
        },
        size: 'mini',
        columns: tableColumns,
        operates: null
      }
    }
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
        minWidth: 140,
        showOverflowTooltip: true
      },
      _clothName: {
        prop: 'clothName',
        label: '布类',
        showOverflowTooltip: true
      },
      _yarnId: {
        prop: 'yarnId',
        label: '色纱编码',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱别',
        showOverflowTooltip: true
      },
      _yarnAttributes: {
        prop: 'yarnAttributes',
        label: '纱属性',
        showOverflowTooltip: true
      },
      _dyeingColor: {
        prop: 'dyeingColor',
        label: '染纱颜色',
        showOverflowTooltip: true
      },
      _planQty: {
        prop: 'planQty',
        label: '排产数量(KG)',
        minWidth: 140,
        align: 'right',
        showOverflowTooltip: true
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
        width: 120,
        align: 'right',
        showOverflowTooltip: true
      },
      _notQty: {
        prop: 'notQty',
        label: '未排总量(KG)',
        width: 120,
        align: 'right',
        showOverflowTooltip: true
      }
    }
    const requisitionOptions = {
      itemType: 'dialog',
      visible: false,
      title: '添加染纱需求',
      width: '90%',
      formDatas: {},
      formOptions: {},
      ok: (c) => {
        if (!c.hasOwnProperty('selectionArr') || !c.selectionArr.length) {
          this.$message({ type: 'error', message: '请先添加一条数据' })
          return
        } else {
          var com = this.result.demandDetailSubmitRequests.tableForm
          const add = this.addSelection.filter(
            (item) => !com.some((ele) => ele.iscodeIndex === item.iscodeIndex)
          )
          this.tableDataSource._tableForm.dataSource = this.$utils.deepClone([
            ...this.tableDataSource._tableForm.dataSource,
            ...add
          ])
          this.requisitionOptions.visible = false
        }
      },
      cancel: () => {
        this.requisitionOptions.visible = false
      },
      close: () => {
        this.requisitionOptions.visible = false
      },
      content: {
        _dataSource: {
          itemType: 'table',
          selectionChange: (val) => {
            this.addSelection = val
            this.requisitionOptions.formDatas = { selectionArr: val }
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
      addSelection: [],
      result: {
        supplier: {},
        pmUser: {},
        demandDetailSubmitRequests: {},
        selection: []
      },
      materialColumns,
      requisitionOptions,
      msgDataSource,
      formOptions: {
        size: 'small',
        inline: true,
        labelWidth: '94px',
        className: 'detail-branch-detail-form',
        hideRequiredAsterisk: false,
        syncDataHandle: (c) => {
          this.result.pmUser = c.pmUser && c.pmUser.value ? c.pmUser : null
          this.result.supplier =
            c.supplier && c.supplier.value ? c.supplier : null
          this.$emit('form', this.result)
        }
      },
      formDatas: {},
      tableFormOptions: {
        popError: true,
        syncDataHandle: (c) => {
          this.result.demandDetailSubmitRequests = this.$utils.deepClone(c)
          this.$emit('form', this.result)
        }
      },
      tableDataSource
    }
  },
  computed: {},
  watch: {
    id() {
      this.getDetail()
      this.getSupplierList()
      this.getSysOrgInfo()
    },
    isEdit(val) {
      this.getDetail(val)
    }
  },
  methods: {
    // 染纱厂下拉
    async getSupplierList() {
      const res = await apiPub.supplierList({
        isEnabled: '1',
        status: '5',
        supplierCategory: 1,
        supplierType: '10002'
      })
      if (res.code === 200) {
        this.msgDataSource._supplier.dataSource =
          res.data &&
          res.data.map((n) => ({ label: n.supplierName, value: n.id + '' }))
      }
    },
    // 跟单人员下拉
    async getSysOrgInfo() {
      const res = await apiPub.sysOrgInfo({ functionTag: 'WAV' })
      if (res.code === 200) {
        const idsArr = []
        res.data &&
          res.data.forEach((val) => {
            idsArr.push(val.orgId)
          })
        const res1 = await apiPub.fllowOrderList({
          orgIds: idsArr,
          requireOrgFlag: 1
        })
        this.msgDataSource._pmUser.dataSource =
          res1.data &&
          res1.data.list.map((n) => ({ label: n.realName, value: n.id + '' }))
      }
    },
    selectTypeChange() {
      if (this.isEdit) {
        return 'select'
      }
      return 'itemview'
    },
    add() {
      this.addSelection = []
      this.requisitionOptions.visible = true
      this.getAddDetail()
    },
    remove() {
      if (!this.result.selection.length) {
        this.$message({ type: 'error', message: '请先选中一条数据' })
        return false
      } else {
        var com = this.result.demandDetailSubmitRequests.tableForm
        const add = com.filter(
          (item) =>
            !this.result.selection.some(
              (ele) => ele.iscodeIndex === item.iscodeIndex
            )
        )
        this.tableDataSource._tableForm.dataSource = this.$utils.deepClone(add)
      }
    },
    async getDetail(t) {
      // 获取详情数据
      var res = {}
      // 待排厂 taskId 已排厂orderid
      if (this.activeName === 'Y') {
        res = await api.orderInfo({ orderId: this.id })
        if (res.code === 200) {
          this.formDatas = res.data || {}
          res.data.orderDetails &&
            res.data.orderDetails.forEach((o) => {
              o.iscodeIndex = this.setIDCode(o)
              o.edit = t
            })
          this.tableDataSource._tableForm.dataSource =
            res.data.orderDetails || []
        }
      } else {
        res = await api.WaitingPlant({ taskNo: this.id })
        if (res.code === 200) {
          res.data &&
            res.data.forEach((o) => {
              o.edit = true
            })
          this.tableDataSource._tableForm.dataSource = res.data || []
        }
      }
    },
    async getAddDetail() {
      const res = await api.WaitingPlant({ taskNo: this.taskNo })
      if (this.$pub.responseValidate(res)) {
        res.data &&
          res.data.forEach((o) => {
            o.iscodeIndex = this.setIDCode(o)
            o.factoryNumCopy = o.factoryNum || 0
            // o.edit = true
            if (o.notQty === 0 || o.notQty === '0') {
              o.factoryNumEdit = true
            }
          })
        // IndexData &&
        //   IndexData.forEach((item) => {
        //     item.iscodeIndex = this.setIDCode(item)
        //     item.factoryNumCopy = item.factoryNum || 0
        //     item.edit = true
        //     // if (item.notQty === 0 || item.notQty === '0') { item.factoryNumEdit = true }
        //   })
        this.requisitionOptions.content._dataSource.dataSource = res.data || []
      }
    },
    // 染纱需求 弹窗生成唯一标识 成品编码+色纱编码+计划交期
    setIDCode(data) {
      const code = data.skuId || ''
      const yan = data.yarnId || ''
      const dateIndex = data.planDelivery
        ? this.$filters.parseTime(data.planDelivery + '', '{y}-{m}-{d}')
        : '-' || 0
      return code + '-' + yan + '-' + dateIndex
    }
  }
}
</script>

<style lang="scss">
#yarn-dyeing-v1-detailBranch {
  .detail-branch-detail-form {
    background: #fff;
    .el-form-item--small {
      margin-bottom: 0 !important;
    }
  }
  .yarn-style {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 300px;
    white-space: nowrap;
    color: #474747;
    display: flex;
    align-items: center;
  }
  table th.isSing div:before {
    content: "*";
    color: red;
  }
  .precautionscolor {
    .cell {
      padding-left: 20px;
    }
  }
  .demandDetailRight {
    margin-left: 26px;
    margin-right: 10px;
  }
}
.analyse_detail_disable1 {
  .el-table__header-wrapper .ruleTip .cell::before {
    content: "" !important;
  }
  .material-datainfo {
    .el-table__header-wrapper .has-gutter tr th {
      padding: 0;
    }
  }
}
</style>
<style lang="scss" scoped>
.analyse_detail_cxp {
  width: 100%;
  background: #fff;
  .header-product {
    border-top: 1px solid #f1f7fb;
    padding: 15px;
  }
  .goods-order-items {
    border-top: 16px solid #f1f7fb;
    .header-top {
      padding: 15px 10px 5px 10px;
      .Info_div {
        .Info_button {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #0986ff;
          border: 1px solid #0986ff;
          border-radius: 4px;
          margin-right: 15px;
          margin-left: 0;
        }
        .Info_remove {
          color: #ff4444;
          border: 1px solid #ff4444;
        }
      }
    }
    .material-datainfo {
      margin: 0 10px;
      padding-top: 10px;
      /deep/.table tr:nth-child(even) {
        background: #fff;
      }
    }
    .page-table-border {
      /deep/ .el-table--mini {
        font-size: 14px !important;
      }
      /deep/ .el-table {
        font-size: 14px;
        td {
          height: 50px;
          line-height: 50px;
          padding: 0;
        }
        th .cell {
          height: 44px;
          line-height: 44px;
        }
      }
      /deep/ th.ruleTip .cell::before {
        display: block;
        content: "*";
        position: absolute;
        left: 4px;
        color: #fe4949;
      }
      /deep/tbody .el-table__row td {
        padding: 12px 0;
        .el-form-item.el-form-item {
          margin-bottom: 0 !important;
        }
      }
    }
  }
  /deep/ .hide_18px {
    margin-top: 4px;
  }
}
</style>

