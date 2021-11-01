<!--
 * @name: 批色信息
 * @description: 批色信息
 * @author: panmr
 * @time: 2021-06-23 14:33:26
-->
<template>
  <div class="content">
    <div class="order-header">
      <div>
        <span class="title-max">批色信息</span>
        <el-button v-if="isEdit" style="right: 15px;float: right" size="mini" type="primary" :disabled="disabled" @click="doAdd">新增</el-button>
      </div>
    </div>
    <div class="test-info">
      <div class="test-box batch-color-form">
        <cs-custom-form ref="batchColorForm" :data-source="informations" :options="formOptions" :form-datas="formDatas" :reset-errors="isEdit" />
      </div>
      <!--   已处理状态显示审批信息   -->
      <div v-if="data && data.status === 3" style="margin-top: 15px;">
        <span class="title-max">审批信息</span>
        <div>
          <span style="margin-left:40px;font-size: 14px;color: #888E9E;font-weight: 400;line-height:40px; height: 40px">评审意见: </span>
          <span style="font-size: 14px;color: #474747;font-weight: 400;line-height:40px; height: 40px">{{ data.reviewComments || '' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'BatchColorInfo',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({
        informations: [], // 批色信息list
        qaGreigeInspectionInfoResponse: {}, // 加工基础信息
        qaCustomerOrderInfoResponse: {} // 客户订单基本信息
      })
    },
    syncMoudleDataHandle: {
      type: Function
    }
  },
  data() {
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    const max99Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,0})|(0{1}))(\.\d{0,2})?$/, message: '0.01~9.99', trigger: ['blur', 'change'] })
    const checkCmcDe = (rule, value, callback) => {
      if (Number(value) === 0) {
        callback(new Error('不能为零'))
      }
      callback()
    }
    return {
      disabled: false,
      formOptions: {
        inline: true,
        labelWidth: '140px',
        popError: true,
        size: 'small',
        validate: (flag, res, err) => {},
        syncDataHandle: (syncData) => {
          this.syncMoudleDataHandle('informations', syncData.tableForm)
        }
      },
      formDatas: {},
      rowbatchColorResultMap: { 0: 'Fail', 1: 'Pass', 2: 'L/G' },
      informations: {
        _tableForm: {
          prop: 'tableForm',
          props: { edit: 'edit' },
          headerCellStyle: { 'background-color': '#F5F7FA' },
          className: 'pop-table',
          itemType: 'table-form',
          itemStyle: { 'width': '100%', 'margin-bottom': '-1px', 'margin-right': '0' },
          border: true,
          columns: {
            _cmcDe: { prop: 'cmcDe', label: 'CMC DE', showOverflowTooltip: true, className: '', minWidth: 100,
              editOptions: {
                labelWidth: '0',
                itemType: 'input',
                placeholder: '请输入（0.01~9.99）',
                disabled: false,
                rules: [commonBlurReg, max99Reg, { validator: checkCmcDe, trigger: 'blur' }],
                change: (value, form, formDatas, setFormDatas, scope) => {
                  if (value) {
                    // 7.14好修改：CMC DE < 1 批色结果自动显示pass
                    if (Number(value) < 1) { // 7.14好修改：CMC DE < 1 批色结果自动显示pass
                      scope.row.batchColorResult = 1
                    }
                    if (Number(value) >= 1) { // CMC DE的值如果>=1，批色结果自动显示Fail，<1才能选择Pass或L/G
                      scope.row.batchColorResult = 0
                    }
                  }
                }
              }
            },
            _batchColorResult: { prop: 'batchColorResult', label: '批色结果', showOverflowTooltip: true, minWidth: 100,
              editOptions: {
                labelWidth: '0',
                itemType: 'select',
                disabled: false,
                dataSource: [
                  { value: 0, label: 'Fail', disabled: false },
                  { value: 1, label: 'Pass', disabled: false },
                  { value: 2, label: 'L/G', disabled: false }
                ],
                rules: [commonBlurReg]
              },
              formater: scope => this.rowbatchColorResultMap[scope.row.batchColorResult] || scope.row.batchColorResult
            },
            _comment: { prop: 'comment', label: '评语', showOverflowTooltip: true, className: '', minWidth: 100,
              editOptions: {
                labelWidth: '0',
                itemType: 'input',
                type: 'textarea',
                placeholder: '请输入（0～200字）',
                maxlength: 200,
                rows: 1,
                clearable: true,
                rules: []
              }
            },
            _dealTime: { prop: 'dealTime', label: '处理时间', className: 'redStar', minWidth: '70', showOverflowTooltip: true,
              formater: scope => scope.row.dealTime ? this.$filters.parseTime(scope.row.dealTime, '{y}-{m}-{d} {h}:{i}') : ''
            }
          },
          dataSource: []
        }
      }
    }
  },
  watch: {
    isEdit: {
      handler(v) {
        this.$nextTick(() => {
          this.$refs.batchColorForm.form.clearValidate()
        })
      },
      deep: true,
      immediate: true
    },
    data: {
      handler(data) {
        this.$nextTick(() => {
          this.disabled = false
          this.informations['_tableForm'].dataSource = Object.assign([], data.informations || [])
          if (this.informations['_tableForm'].dataSource.length) {
            if (this.informations['_tableForm'].dataSource[this.informations['_tableForm'].dataSource.length - 1].batchColorResult !== 0) { // 如果最后一行的结果为 Pass or L/G 不能新增（按钮置灰）/ 只能提交
              this.disabled = true
            } else {
              this.disabled = false
            }
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 初始化
    init() {},
    // 新增批色记录
    doAdd() {
      if (this.informations['_tableForm'].dataSource.length === 10) {
        this.$message({ type: 'warning', message: '最多可增加10行!' })
        return
      }
      this.disabled = true
      this.informations['_tableForm'].dataSource.push({
        id: Date.now(),
        edit: true,
        cmcDe: '',
        batchColorResult: undefined,
        comment: '',
        dealTime: ''
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.order-header {
  background: #ffffff;
  padding: 20px;
  border-bottom: 1px solid #EEEFF0;
}
//验布样式
.test-info{
  background-color: #FFFFFF;
  padding: 20px;
  .test-box{
    width: 100%;
    box-sizing: border-box;
    /deep/ .el-form-item__content{
      width: 100%;
    }
    /deep/ .el-form-item{
      margin-bottom: 0px;
    }
  }
}
.batch-color-form{
  /deep/  .el-table__row td{
    margin: 0;
    padding: 0;
  }

  /deep/ .cell{
    margin: 0 !important;
    padding: 0 !important;
  }
  /deep/ .cell>span{
    display: block;
    line-height: 32px;
    padding: 0 10px;
  }
  /deep/ .el-form-item{
    margin: 0 !important;
    padding: 0 !important;
    .el-input__inner,.el-textarea__inner{
      border-radius: 0;
      border-color: transparent;
    }
    .is-error{
      .el-input__inner{
        border-radius: 0;
        border-color:#ff4949;
      }
    }
  }
  /deep/ .has-gutter{
    .cell{
      padding: 0 10px !important;
    }
  }

}
</style>
