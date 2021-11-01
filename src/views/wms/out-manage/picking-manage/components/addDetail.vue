<template>
  <div class="AddDetail">
    <el-dialog
      title="添加拣货明细"
      :visible="dialogVisible"
      width="1380px"
      @close="$emit('close')"
    >
      <div class="form-main">
        <form-title :options="{ title: '货物明细' }">
          <div slot="content">
            <cs-custom-form
              ref="searchForm"
              :form-datas="searchFormDatas"
              :data-source="searchData"
              :options="formOptions"
            />
          </div>
        </form-title>
        <div class="form-box">
          <cs-custom-table
            ref="table"
            :max-height="'180'"
            :columns="columns"
            :data-source="dataSourceAll"
            :selection="selection"
            tooltip-effect="dark"
            :empty-text="'请先选择拣货库位'"
            @selection-change="selectionChange"
          />
        </div>
      </div>
      <div class="form-main">
        <form-title :options="{ title: '拣货明细' }" />
        <div class="form-box">
          <cs-custom-form
            ref="inlineTable"
            :data-source="tableData"
            :options="formOtions"
            :form-datas="formDatas"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <!-- <el-button @click="$emit('close')">取 消</el-button> -->
        <el-button @click="submit">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FormTitle from '@/views/wms/public/components/formTitle'
import { PublicWms } from '@/views/wms/public/index'
import { picking } from './index.js'
export default {
  name: 'AddDetail',
  components: { FormTitle },
  mixins: [PublicWms, picking],
  props: {
    dialogVisible: { type: Boolean, default: false },
    code: { type: String }
  },
  data() {
    var checkSpecifics = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空！'))
      } else {
        return callback()
      }
    }
    const columns_base = [
      {
        prop: 'path',
        label: '库位号',
        showOverflowTooltip: true
      },
      {
        prop: 'serialNo',
        label: '条形码',
        showOverflowTooltip: true
      },
      {
        prop: 'materiel',
        label: '产品编号',
        showOverflowTooltip: true
      },
      {
        prop: 'batchNo',
        label: '批次号',
        showOverflowTooltip: true
      }
    ]
    const columns_2 = [
      {
        prop: 'materielType',
        label: '物料类型',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => {
          const obj = {
            '0101': '天然纤维',
            '0102': '化学纤维',
            '0103': '组合纱',
            '0201': '坯布',
            '0202': '色布',
            '0203': '组合布',
            '0204': '花布'
          }
          return obj[scope.row.materielType] || ''
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'dyelot',
        label: '缸号',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnCard',
        label: '纱牌/纱批',
        showOverflowTooltip: true
      },
      {
        prop: 'leftWeight',
        label: '重量',
        align: 'right',
        maxWidth: '100'
        // editOptions: {
        //   className: 'specifics-input',
        //   labelWidth: '0',
        //   itemType: 'input',
        //   rules: [{ validator: checkSpecifics, trigger: ['change'] }],
        //   trim: (value) => {
        //     return this.validInput(value, 'weightOutFact')
        //   }
        // }
      },
      {
        prop: 'ballCount',
        label: '球数',
        align: 'right',
        maxWidth: '100',
        editOptions: {
          className: 'specifics-input',
          labelWidth: '0',
          itemType: 'input',
          rules: [{ validator: checkSpecifics, trigger: ['change'] }],
          trim: (value) => {
            return this.validInput(value, 'ballCount')
          }
        }
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'center'
      }
    ]
    const columns_1 = [
      {
        prop: 'materielType',
        label: '物料类型',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => {
          const obj = {
            '0101': '天然纤维',
            '0102': '化学纤维',
            '0103': '组合纱',
            '0201': '坯布',
            '0202': '色布',
            '0203': '组合布',
            '0204': '花布'
          }
          return obj[scope.row.materielType] || ''
        }
      },
      {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        minWidth: 120
      },
      {
        prop: 'productInfo',
        label: '产品信息',
        showOverflowTooltip: true,
        minWidth: '160'
      },
      {
        prop: 'machineNo',
        label: '机台号',
        minWidth: '150'
      },
      {
        prop: 'stitchNum',
        label: '针数',
        minWidth: '150'
      },
      {
        prop: 'inchNum',
        label: '寸数',
        minWidth: '150'
      },
      {
        prop: 'dyelot',
        label: '缸号',
        showOverflowTooltip: true
      },
      {
        prop: 'leftWeight',
        label: '重量',
        align: 'right',
        maxWidth: '100'
      },
      {
        prop: 'sellerTeamName',
        label: '销售组织',
        showOverflowTooltip: true,
        align: 'center'
      }
    ]
    const popOperates = {
      label: '操作',
      width: '180',
      fixed: 'right',
      dataSource: [
        {
          label: '拆散',
          isShow: (scope) => {
            return !scope.row.edit && scope.row.productType === 2
          },
          handle: (params) => {
            params.row.edit = true
          }
        },
        {
          label: '删除',
          isShow: true,
          style: { color: 'red' },
          handle: (params) => {
            this.delMateriel({ outPickSubNo: this.id, serialSubNo: params.row.serialSubNo })
          }
        },
        {
          label: '确定',
          isShow: (scope) => {
            return scope.row.edit
          },
          // permitTag: ['srm:basicData:assessSpecific:modify'],
          handle: (params) => {
            this.$refs.inlineTable.form.validate((valid) => {
              if (valid) {
                const formRowDatas = this.$refs.inlineTable
                  .dynamicValidateFormRuleForm.tableForm
                for (const i in formRowDatas[params.$index]) {
                  if (i !== 'edit') {
                    params.row[i] = formRowDatas[params.$index][i]
                  }
                }
                this.$set(
                  params.row,
                  'leftWeight',
                  (
                    (params.row.leftWeight / this.row.ballCount) *
                    params.row.ballCount
                  ).toFixed(2)
                )
                // params.row.edit = !params.row.edit
                params.row.edit = false
                if (params.row.ballCount !== this.row.ballCount) {
                  this.split({ serialSubNo: params.row.serialSubNo, ballCountFact: params.row.ballCount, outPickSubNo: this.id })
                }
              }
            })
          }
        },
        {
          isShow: (scope) => {
            return scope.row.edit
          },
          label: '取消',
          handle: (params) => {
            params.row.edit = false
          }
        }
      ]
    }
    const searchData = [
      {
        prop: 'locationCodes',
        itemType: 'select',
        label: '拣货库位:',
        itemStyle: { width: '20%' },
        placeholder: '请选择',
        dataSource: [],
        rules: [{ required: true }],
        showMessage: false
      },
      {
        prop: 'materiel',
        itemType: 'input',
        label: '产品编号:',
        itemStyle: { width: '20%' },
        placeholder: '请输入单号',
        clearable: true
      },
      {
        itemType: 'operate',
        submitText: '查询',
        resetHidden: true,
        itemStyle: {
          'font-size': '14px',
          color: '#0986FF',
          'margin-left': '-10px'
        },
        submitHandle: (params) => {
          const params1 = { pageSize: 999999, pageNum: 1 }
          params.locationCodes
            ? (params1.locationCodes = [params.locationCodes])
            : ''
          params.materiel ? (params1.materiel = params.materiel) : ''
          params1.productType = this.productType
          params1.searchType = 'E'
          this.getStockManageList(params1)
        }
      },
      {
        itemType: 'operate',
        submitText: '添加拣货明细',
        resetHidden: true,
        itemStyle: {
          position: 'absolute',
          right: '0'
        },
        submitHandle: (params) => {
          if (!this.choseArr.length) {
            this.$message({
              type: 'warning',
              message: '请选择拣货数据'
            })
            return
          }
          this.storage = this.$utils.deepClone(this.choseArr)
          var serialNos = []
          this.storage.forEach(i => {
            serialNos.push(i.serialNo)
          })
          this.add({ serialNos: serialNos, outPickSubNo: this.id })
        }
      }
    ]
    const selection = {}
    return {
      row: {},
      formDatas: {},
      formOtions: {
        showMessage: true
      },
      tableData: [
        {
          maxHeight: '180',
          prop: 'tableForm',
          itemType: 'table-form',
          tooltipEffect: 'dark',
          dataSource: [],
          columns: [],
          form: {},
          operates: popOperates,
          rowClick: (row, column, event) => {
            this.row = this.$utils.deepClone(row)
          }
        }
      ],
      selection,
      columns_base,
      columns_1,
      columns_2,
      dataSourceAll: [],
      popOperates,
      searchFormDatas: {},
      searchData,
      formOptions: {
        size: 'small',
        inline: true
      },
      choseArr: [],
      storage: []
    }
  },
  computed: {
    columns() {
      const arr = [
        ...this.columns_base,
        ...this['columns_' + this.productType]
      ]
      return arr
    }
  },
  mounted() {
    //  此拣货单关联的预出单上的预出库仓下的库位，需要隐藏掉仓库默认的暂存库区
    this.getWarehouseLocationList({ warehouseCode: this.code })
    this.$set(this.tableData[0], 'columns', this.columns)
    this.getPage((res) => { this.$set(this.tableData[0], 'dataSource', res) })
  },
  methods: {
    selectionChange(result) {
      this.choseArr = result
    },
    validInput(value, type) {
      const patt =
        type === 'weightOutFact'
          ? /^\d+(\.\d{0,2})?$/
          : /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/
      if (!patt.test(value)) {
        return ''
      }
      return value
    },
    submit() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" >
.AddDetail {
  * {
    box-sizing: border-box;
  }
  .form-main {
    .form-title .label {
      font-weight: bold;
      flex: 0 0 120px;
    }
  }
  .custom-form {
    .el-form.el-form--inline {
      margin-top: 18px;
    }
  }
  .table-form {
    .specifics-input > input[type="text"] {
      text-align: right;
      height: 28px;
      width: 120px;
    }
  }
  .form-box {
    .el-table th {
      background-color: #f5f7fa;
      height: 40px;
      padding: 0;
    }
  }
}
</style>

<style lang="scss" >
.AddDetail {
  .el-dialog__wrapper .el-dialog {
    margin-top: 10vh !important;
  }
}
</style>
