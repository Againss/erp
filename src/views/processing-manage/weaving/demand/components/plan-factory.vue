<template>
  <div id="PlanFactory">
    <div class="detail">
      <cs-custom-table
        max-height="300"
        :columns="columns"
        :table-scrollx="true"
        row-key="id"
        :data-source="dataSource"
        @selection-change="selectionChange"
      />
    </div>
    <div class="btn">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-bottom"
        :disabled="!addResult.length || !dataSource.length"
        @click="add"
      >添加排厂</el-button>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-top"
        :disabled="backDisabled"
        @click="back"
      >移除排厂</el-button>
    </div>
    <div class="detail">
      <div class="top">
        <div>{{ activeName === "N" ? "已选择排厂" : "已排厂" }}</div>
        <cs-custom-form
          ref="formSearch"
          :data-source="searchData"
          :options="searchOptions"
          :form-datas="searchFormDatas"
        />
      </div>
      <cs-custom-form
        ref="formList"
        edit-type="pop"
        :data-source="formDataSource"
        :options="formOptions"
        :form-datas="formDatas"
      />
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import * as api from '../api/index'
import * as apiPub from '@/views/processing-manage/public/api/index.js'
import {
  inputFilter,
  integerFilter
} from '@/views/processing-manage/public/index.js'
export default {
  name: 'PlanFactory',
  props: {
    options: {
      type: Object
    }
  },
  data() {
    var qtyVlidate = (rule, value, callback) => {
      const i = rule.field.split('.')[1]
      const row = this.validateObj.tableForm[i]
      const sum =
        parseFloat(row.qty || 0) + parseFloat(row.leaveFactoryQty || 0)
      if (!row.qtyNew) {
        callback(new Error('请输入排厂量'))
      } else if (row.qtyNew > sum) {
        callback(new Error('排厂量不能大于未排总量'))
      } else {
        this.refresh(this.validateObj.tableForm)
        callback()
      }
    }
    const validateNumber = (rule, value, callback) => {
      if (!value || value === '0') {
        callback(new Error('只能输入大于0的计划开台数'))
      }
      callback()
    }
    const columnsForm = {
      _selection: {
        with: '50',
        type: 'selection'
        // reserveSelection: true
      },
      // A全部 N待排厂O已排厂
      _index: {
        minWidth: '50',
        label: '序号',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _taskNo: {
        prop: 'taskNo',
        label: '任务单号',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _skuId: {
        prop: 'skuId',
        label: '坯布编码',
        minWidth: '160',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _clothType: {
        prop: 'clothType',
        label: '布类',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _custom: {
        prop: 'widthName',
        label: '成品规格',
        minWidth: '160',
        showOverflowTooltip: true,
        handle: (scope) => {},
        //  成品规格=布封+克重
        formater: (scope) => {
          return `${scope.row.widthName}-${scope.row.weightName}`
        }
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '160',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _gauge: {
        prop: 'diameter',
        label: '针寸数',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {},
        formater: (scope) => {
          return `${scope.row.gauge}-${scope.row.diameter}`
        }
      },

      _planQty: {
        prop: 'planQty',
        label: '坯布需求(KG)',
        minWidth: '160',
        align: 'right',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '坯布计划交期',
        minWidth: '160',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _planMachine: {
        prop: 'planMachine',
        label: '计划开台数',
        minWidth: '120',
        // showOverflowTooltip: true,
        handle: (scope) => {},
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          itemProp: 'planMachine',
          placeholder: '请输入计划开台数',
          trim: (val) => {
            return integerFilter(val)
          },
          rules: [
            {
              required: true,
              validator: validateNumber,
              trigger: ['change']
            }
          ]
        },
        formater: (scope) => {
          this.$set(scope.row, 'edit', true)
          return scope.row.planMachine
        }
      },
      _knitDelivery: {
        prop: 'knitDelivery',
        label: '坯布交期',
        minWidth: '160',
        showOverflowTooltip: true,
        handle: (scope) => {},
        formater: (scope) => {
          this.$set(scope.row, 'edit', true)
          return scope.row.knitDelivery
        },
        editOptions: {
          itemType: 'date',
          placeholder: '坯布交期',
          labelWidth: '0',
          itemProp: 'knitDelivery',
          // valueFormat: 'timestamp',
          rules: [
            {
              required: true,
              message: '请选择坯布交期',
              trigger: ['change']
            }
          ]
        }
      },
      _qtyNew: {
        prop: 'qtyNew',
        label: '排厂量(KG)',
        minWidth: '120',
        align: 'right',
        showOverflowTooltip: true,
        handle: (scope) => {},
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          itemProp: 'qty',
          placeholder: '请输入排厂量',
          trim: (val) => {
            return inputFilter(val)
          },
          rules: [
            {
              required: true,
              trigger: ['change'],
              validator: qtyVlidate
            }
          ]
        },
        formater: (scope) => {
          this.$set(scope.row, 'edit', true)
          return scope.row.qtyNew
        }
      },
      _arrangeFactoryQty: {
        prop: 'arrangeFactoryQty',
        label: '已排总量',
        minWidth: '140',
        align: 'right',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _leaveFactoryQty: {
        prop: 'leaveFactoryQty',
        label: '未排总量',
        align: 'right',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {}
      }
    }
    const columns = {
      _selection: {
        with: '50',
        type: 'selection'
        // reserveSelection: true
      },
      // A全部 N待排厂O已排厂
      _index: {
        minWidth: '50',
        label: '序号',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _skuId: {
        prop: 'skuId',
        label: '坯布编码',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _clothType: {
        prop: 'clothType',
        label: '布类',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _custom: {
        prop: 'widthName',
        label: '成品规格',
        minWidth: '160',
        showOverflowTooltip: true,
        handle: (scope) => {},
        //  成品规格=布封+克重
        formater: (scope) => {
          return `${scope.row.widthName}-${scope.row.weightName}`
        }
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '160',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _customerColor: {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _procedureId: {
        prop: 'procedureId',
        label: '工艺',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _planQty: {
        prop: 'planQty',
        label: '排厂数量',
        minWidth: '140',
        align: 'right',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _planDelivery: {
        prop: 'planDelivery',
        label: '计划交期',
        minWidth: '140',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _arrangeFactoryQty: {
        prop: 'arrangeFactoryQty',
        label: '已排总量',
        minWidth: '140',
        align: 'right',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _leaveFactoryQty: {
        prop: 'leaveFactoryQty',
        label: '未排总量',
        minWidth: '140',
        align: 'right',
        showOverflowTooltip: true,
        handle: (scope) => {}
      }
    }
    const formDataSource = {
      _tableForm: {
        // rowKey: 'id',
        prop: 'tableForm',
        itemType: 'table-form',
        'max-height': '300',
        dataSource: [],
        columns: columnsForm,
        selectionChange: (val) => {
          this.selectionChangeBack(val)
        }
      }
    }
    const itemStyle = {
      'margin-bottom': 0
    }
    const searchData = {
      _suppler: {
        prop: 'suppler',
        label: '织厂',
        itemType: 'select',
        dataSource: [],
        clearable: true,
        itemStyle,
        filterable: true,
        valueType: 'object',
        valueKey: 'value',
        rules: [{ required: true, trigger: 'change' }]
      },
      _pmUser: {
        prop: 'pmUser',
        label: '跟单人员',
        itemType: 'select',
        dataSource: [],
        itemStyle,
        filterable: true,
        valueType: 'object',
        valueKey: 'value',
        rules: [{ required: true, trigger: 'change' }]
      }
    }
    return {
      columnsForm,
      supplerO: null,
      searchData,
      searchOptions: {
        showMessage: false,
        size: 'small',
        inline: true,
        syncDataHandle: (c) => {
          this.result.pmUser = c.pmUser
          this.result.suppler = c.suppler
        }
      },
      columns,
      dataSource: [],
      formDataSource,
      formOptions: {
        popError: true,
        validate: (prop, flag, errmsg) => {},
        syncDataHandle: (c) => {
          this.validateObj = deepClone(c)
        }
      },
      validateObj: null,
      searchFormDatas: {},
      addResult: [],
      backResult: [],
      formDatas: {},
      result: {},
      validate: (callback) => {
        this.$refs['formSearch'].form.validate((valid1) => {
          if (valid1) {
            this.$refs['formList'].form.validate((valid2) => {
              if (valid2) {
                return callback(true)
              }
            })
          }
        })
      }
    }
  },
  computed: {
    backDisabled() {
      if (this.formDataSource._tableForm.dataSource.length) {
        return !this.backResult.length
      }
      return true
    },
    selectResult() {
      var r = deepClone(this.options.selectResult)
      return r || []
    },
    searchParams() {
      var r = deepClone(this.options.searchParams)
      return r || {}
    },
    activeName() {
      return this.searchParams.status
    }
  },
  created() {
    this.init()
  },
  methods: {
    refresh(tableForm) {
      var details = {}
      if (this.activeName === 'O') {
        details =
          tableForm &&
          tableForm.map((n) => ({
            id: n.id,
            uuid: n.uuid,
            knitDelivery: n.knitDelivery,
            planMachine: n.planMachine,
            qty: n.qtyNew,
            orderDetailId: n.orderDetailId
          }))
      } else {
        details =
          tableForm &&
          tableForm.map((n) => ({
            id: n.id,
            uuid: n.uuid,
            knitDelivery: n.knitDelivery,
            planMachine: n.planMachine,
            qty: n.qtyNew
          }))
      }

      this.result.details = details
    },
    add() {
      // 校验
      var data = this.formDataSource._tableForm.dataSource
      var tip = true
      for (var i = 0; i < this.addResult.length; i++) {
        this.addResult[i].knitDelivery = this.addResult[i].knitDelivery ? this.addResult[i].knitDelivery : this.addResult[i].planDelivery
        const k = data.findIndex((j) => j.uuid === this.addResult[i].uuid)
        if (k !== -1) {
          this.$message({
            // message: '已排厂里已包括',
            message: `${
              this.activeName === 'N' ? '已选择排厂中' : '已排厂中'
            }已包含勾选数据`,
            type: 'warning'
          })
          tip = false
          return
        }
      }
      tip
        ? (this.formDataSource._tableForm.dataSource = [
          ...this.formDataSource._tableForm.dataSource,
          ...this.addResult
        ])
        : ''
    },
    back() {
      const arr = []
      for (var i = 0; i < this.backResult.length; i++) {
        const k = this.dataSource.findIndex(
          (j) => j.uuid === this.backResult[i].uuid
        )
        if (k === -1) {
          this.dataSource.push(this.backResult[i])
        }
        const p = this.validateObj.tableForm.findIndex(
          (o) => o.uuid === this.backResult[i].uuid
        )
        arr.push(this.validateObj.tableForm[p])
      }
      this.formDataSource._tableForm.dataSource = this.diff(
        this.validateObj.tableForm,
        arr
      )
      this.backResult = []
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
    selectionChange(val) {
      this.addResult = val
    },
    selectionChangeBack(val) {
      this.backResult = val
    },
    // 待排
    async getConstant() {
      const errFun = (res) => {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
      const res0 = await Promise.all([
        apiPub.supplierList({
          supplierCategory: 1,
          supplierType: '10003',
          isEnabled: 1,
          status: 5
        }),
        apiPub.sysOrgInfo({ functionTag: 'WAV' })
      ])
      const resSupplier = res0[0]
      resSupplier.code === 200
        ? (this.searchData._suppler.dataSource = resSupplier.data.map((n) => ({
          label: n.supplierName,
          value: n.id + ''
        })))
        : errFun(resSupplier)
      const resOrginfo = res0[1]
      if (resOrginfo.code === 200) {
        const resOrginfoData = resOrginfo.data || []
        const idsArr = []
        resOrginfoData.length &&
          resOrginfoData.forEach((val) => {
            idsArr.push(val.orgId)
          })
        if (idsArr.length) {
          const res1 = await apiPub.fllowOrderList({
            orgIds: idsArr,
            requireOrgFlag: 1
          })
          this.searchData._pmUser.dataSource =
            res1.data &&
            res1.data.list.map((n) => ({
              label: n.realName,
              value: n.id + ''
            }))
        }
      } else {
        errFun(resOrginfo)
      }
    },
    async getList() {
      // 页码
      var p = {
        pageSize: 500,
        pageNum: 1
      }
      if (this.activeName === 'O') {
        p = { ...p, ...this.searchParams }
      }
      const res = await api.list({ ...p, status: 'N' })
      if (res.code === 200) {
        this.dataSource = res.data.list || []
        // 已排处理
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    async getEditFactory(params) {
      const res = await api.editFactory({
        knitOrderNo: this.selectResult[0].knitOrderNo
      })
      if (res.code === 200) {
        res.data.details &&
          res.data.details.forEach((n) => {
            n.qtyNew = n.qty
          })
        this.formDataSource._tableForm.dataSource = res.data.details || []
        this.result.orderId = res.data.orderId
        this.searchFormDatas = {
          suppler: res.data.suppler,
          pmUser: res.data.pmUser
        }
        this.supplerO = deepClone(res.data.suppler)
      }
    },
    init() {
      // A全部 N待排厂O已排厂
      if (this.activeName === 'N') {
        this.formDataSource._tableForm.dataSource = this.selectResult.map(t => {
          t.knitDelivery = t.knitDelivery ? t.knitDelivery : t.planDelivery
          return t
        })
      } else {
        this.getEditFactory()
      }
      this.getConstant() // 织厂，跟单人
      this.getList()
    }
  }
}
</script>
<style  lang='scss' scoped>
#PlanFactory {
  .btn {
    padding: 14px 0;
    margin: 0 -20px;
    background: #eef5f9;
    text-align: center;
  }
  .top {
    height: 64px;
    display: flex;
    align-items: center;
    div {
      color: #151222;
      font-size: 18px;
      //  line-height: 64px;
    }
  }
}
</style>
<style  lang='scss'>
#PlanFactory {
  .detail {
    width: 100%;
    .el-table th {
      background-color: #f5f7fa;
      padding: 0;
      .cell {
        height: 40px;
        line-height: 40px;
      }
    }
    .el-table td {
      height: 50px;
      line-height: 50px;
      padding: 0;
    }
  }
  .btn {
    .el-button.el-button--primary.el-button--small {
      padding-left:36px;
      padding-right:36px;
    }
  }
}
</style>
