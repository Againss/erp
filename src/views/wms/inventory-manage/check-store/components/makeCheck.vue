<!--
 * @Author: Do not edit
 * @Date: 2020-12-03 09:13:35
 * @LastEditTime: 2019-10-15 15:00:45
 * @LastEditors: Aurnm
 **  盘点确认页面
 -->
<template>
  <div class="make-detail">
    <header class="new-header">
      <span class="check-code">盘点计划单号：{{ formDatas.checkPlanId }}</span>
    </header>
    <div class="check-one-detail">
      <div class="check-words">盘点信息</div>
      <div class="first-check">
        <cs-custom-form
          ref="checkPlan"
          class="p-10"
          :data-source="makeData"
          :options="formOtions"
          :form-datas="formDatas"
        />
      </div>
    </div>
    <!-- 盘点明细表格部分 -->
    <div class="check-two-table">
      <div class="check-words">
        盘点明细
      </div>
      <!-- 表格 -->
      <div class="table-details detail">
        <cs-custom-form
          ref="inlineTable"
          class="table-form"
          tooltip-effect="dark"
          :data-source="checkDataSource"
          :options="checkformOtions"
          :form-datas="checkFormDatas"
        />
      </div>
      <!-- 总计 -->
      <div class="totalNum">
        <span style="font-size: 16px; font-weight: bold">总计：</span>
        <span class="tipFirst">{{ checkAmount }}</span>
      </div>
    </div>
    <!-- 其他说明部分 -->
    <div class="other-part">
      <div>
        <cs-custom-form
          ref="remarkForm"
          class="clearfix"
          :form-datas="remarkFormDatas"
          :data-source="newCheckOther"
          :options="remarkFormOtions"
        />
      </div>
    </div>
    <!-- 按钮位置 -->
    <div class="button-groups">
      <div class="btn-all">
        <el-button
          size="small"
          type="primary"
          @click="saveBtn"
        >
          确认
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="comeBack"
        >
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { checkDetail, makeDetail, makeCheck } from '../api/index.js'
import { fetchLog } from '@/views/wms/public/fetchLog'
import popoverColumn from '@/components/cs-custom-table/columns/popover-column'
import propertyCard from '@/components/property-card/index.vue'
export default {
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 仓库输入时，，相应的盘亏、盘盈也计算
    const changeInput = (value, form, formDatas, setFormDatas, scope) => {
      const index = scope.$index
      const rowData = formDatas.tableForm[index]
      if (value < rowData.locationAmount) {
        rowData.lossAmount = rowData.locationAmount - value
        rowData.moreAmount = '-'
        rowData.checkResultType = 2
      } else if (value > rowData.locationAmount) {
        rowData.moreAmount = value - rowData.locationAmount
        rowData.lossAmount = '-'
        rowData.checkResultType = 1
      } else {
        rowData.moreAmount = '-'
        rowData.lossAmount = '-'
        rowData.checkResultType = 0
      }
      this.$set(this.checkDataSource[0].dataSource, index, rowData)
      console.log('this.checkDataSource[0].dataSource', this.checkDataSource[0].dataSource)
    }
    // 限制输入整数
    const ruleTrim = (data) => {
      data = data.replace(/[^0-9]/g, '')
      data = data.toUpperCase()
      data = data.replace('_', '')
      return data
    }
    // 盘点确认详情
    const makeData = [
      {
        prop: 'warehouse',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '盘点仓库：',
        readonly: true
      },
      {
        prop: 'checkType',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '盘点类型：',
        readonly: true
      },
      {
        prop: 'createdByName',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '创建人：',
        readonly: true,
        formater: scope => {
          return scope.row.enable === 1 ? '启用' : scope.row.enable === 0 ? '禁用' : ''
        }
      },
      {
        prop: 'checkStartTime',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '盘点开始时间：',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.checkStartTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        },
        readonly: true
      },
      {
        prop: 'createdTime',
        itemType: 'input',
        itemStyle: { 'width': '27%', 'margin': '0px 2%' },
        label: '创建时间：',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.createdTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        },
        readonly: true
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'locationCode',
        label: '库位',
        minWidth: '130'
      },
      {
        prop: 'materiel',
        label: '产品编号',
        minWidth: '180',
        edit: () => {
          return false
        },
        components: {
          popoverColumn
        },
        componentsOptions: {
          customOptions: {
            placement: 'right',
            style: {
              color: '#0986FF',
              cursor: 'pointer',
              marginTop: '5px'
            },
            width: '500',
            content: propertyCard,
            contentOptions: {},
            trigger: 'click',
            mouseleave: true,
            formDatas: {},
            show: (scope) => {
              return scope.row['materiel']
            }
          }
        }
      },
      {
        prop: 'materielInfo.yarnName',
        label: '纱名',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.yarnName
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'materielInfo.yarnProperty',
        label: '纱属性',
        minWidth: '160',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.materielInfo) {
            return scope.row.materielInfo.yarnProperty
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'materielType',
        label: '物料类型',
        minWidth: '110',
        formater: scope => {
          if (scope.row.materielInfo) {
            return this.getStatus(scope.row.materielInfo)
          } else {
            return '--'
          }
        }
      },
      // {
      //   prop: 'materielInfo.clothColor',
      //   label: '成品颜色',
      //   minWidth: '110',
      //   formater: scope => {
      //     if (scope.row.materielInfo) {
      //       return scope.row.materielInfo.clothColor
      //     } else {
      //       return '--'
      //     }
      //   }
      // },
      // {
      //   prop: 'materielInfo.flower',
      //   label: '印花花号',
      //   minWidth: '100',
      //   formater: scope => {
      //     if (scope.row.materielInfo) {
      //       return scope.row.materielInfo.flower
      //     } else {
      //       return '--'
      //     }
      //   }
      // },
      {
        prop: 'locationAmount',
        label: '库位数',
        minWidth: '80'
      },
      {
        prop: 'checkAmount',
        label: '盘点件数',
        minWidth: '80',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          trim: ruleTrim,
          rules: commonBlurReg,
          change: changeInput
        }
      },
      {
        prop: 'lossAmount',
        label: '盘亏件数',
        minWidth: '80'
      },
      {
        prop: 'moreAmount',
        label: '盘盈件数',
        minWidth: '80'
      },
      {
        prop: 'unit',
        label: '包装单位',
        minWidth: '80',
        formater: scope => {
          if (scope.row.materielInfo) {
            return this.getUnit(scope.row.materielInfo)
          } else {
            return '--'
          }
        }
      },
      {
        prop: 'checkUserName',
        label: '盘点人',
        minWidth: '100'
      }
    ]
    // 从新赋值表格数据
    const checkDataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        columns: columns
      }
    ]

    // 其他说明
    const newCheckOther = [
      {
        prop: 'remark',
        itemType: 'input',
        label: '其他说明',
        type: 'textarea',
        rows: 6,
        itemStyle: {
          width: '100%',
          marginRight: '10%',
          float: 'left'
        },
        trim: (value) => {
          return value
        },
        rules: commonBlurReg,
        maxlength: 500
      }
    ]
    return {
      makeData, // 盘点确认详情
      checkDataSource,
      columns,
      formDatas: {},
      dataSource: [],
      formOtions: {
        inline: true
      },
      checkFormDatas: {},
      checkformOtions: {
        showMessage: true
      },
      newCheckOther, // 其他说明
      remarkFormDatas: {},
      remarkFormOtions: {
        inline: false,
        size: 'small',
        labelPosition: 'top'
      },
      rowInfoMessages: {}, // 日志先后拿到的信息
      checkAmount: '', // 件数
      inputValue: '', // 输入框的值
      lossNum: '',
      profitNum: '',
      checkId: '',
      copySave: [],
      listData: []
    }
  },
  computed: {

  },
  created() {
    this.editList({ checkPlanId: this.$route.query.checkPlanId })
    this.downList({ checkPlanId: this.$route.query.checkPlanId })
  },
  mounted() {},
  methods: {
    // 包装单位
    getUnit(data) {
      let str = ''
      switch (data.materielType) {
        case '0101':
          str = '件'
          break
        case '0102':
          str = '件'
          break
        case '0103':
          str = '件'
          break
        case '0201':
          str = '卷'
          break
        case '0202':
          str = '卷'
          break
        case '0203':
          str = '卷'
          break
        default:
          break
      }
      return str
    },
    // 物料类型
    getStatus(data) {
      let str = ''
      switch (data.materielType) {
        case '0101':
          str = '天然纤维'
          break
        case '0102':
          str = '化学纤维'
          break
        case '0103':
          str = '组合纱线'
          break
        case '0201':
          str = '坯布'
          break
        case '0202':
          str = '色布'
          break
        case '0203':
          str = '组合布'
          break
        case '0204':
          str = '花布'
          break
        default:
          break
      }
      return str
    },
    // 返回到列表页
    comeBack() {
      this.$confirm(' 你确认要取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.$router.push('/wms/inventory-manage/check-store/index')
        })
    },
    // 点击编辑获取详情
    async editList(data) {
      const res = await checkDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.formDatas = res.data || {}
      this.formDatas.warehouse = this.formDatas.warehouse.label
      this.formDatas.checkType = this.formDatas.checkType === '1' ? '明盘' : this.formDatas.checkType === '2' ? '盲盘' : ''
      // 时间转换
      this.formDatas.createdTime = this.formDatas.createdTime ? this.$filters.parseTime(this.formDatas.createdTime + '', '{y}-{m}-{d} {h}:{i}') : ''
      this.formDatas.checkStartTime = this.formDatas.checkStartTime ? this.$filters.parseTime(this.formDatas.checkStartTime + '', '{y}-{m}-{d} {h}:{i}') : ''
      this.checkAmount = res.data.checkAmount
    },
    async downList(data) {
      const res = await makeDetail({ ...data })
      if (res.code !== 200) {
        return false
      }
      this.listData = res.data.list || []
      this.rowInfoMessages = { ...res.data.list }
      this.listData.forEach(val => {
        val.path = val.locationCode
        val.edit = true
      })
      this.$set(this.checkDataSource[0], 'dataSource', this.listData)
      this.checkFormDatas = res.data
    },
    // 保存按钮
    async saveBtn() {
      // this.$refs.inlineTable.$refs.dynamicValidateForm.validate前端调用Roman写的组件中的ruler验证
      this.$refs.inlineTable.$refs.dynamicValidateForm.validate(async(valid) => {
        if (valid) {
          this.copySave = this.checkDataSource[0].dataSource
          // 盘盈、盘亏总数相加
          let copylossNum = 0
          let copyMoreNum = 0
          this.checkDataSource[0].dataSource.forEach(val => {
            if (val.lossAmount !== '-') {
              copylossNum += parseInt(val.lossAmount)
            } else if (val.moreAmount !== '-') {
              copyMoreNum += parseInt(val.moreAmount)
            }
          })
          const obj = {
            checkPlanId: this.$route.query.checkPlanId,
            actualLossAmount: copylossNum,
            actualMoreAmount: copyMoreNum,
            remark: this.$refs.remarkForm.dynamicValidateFormRuleForm.remark
          }
          const logData = { ...obj, checkPlanDetails: this.copySave }
          // 前端添加验证--其他说明
          if (this.$refs.remarkForm.dynamicValidateFormRuleForm.remark === '' || this.$refs.remarkForm.dynamicValidateFormRuleForm.remark === undefined) {
            this.$message({
              type: 'info',
              message: '其他说明不能为空!'
            })
            return false
          }
          const res = await makeCheck({ ...obj, checkPlanDetails: this.copySave })
          if (res.code !== 200) {
            return false
          }
          // 日志--修改
          const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, logData, 'id')
          this.fetchLog(this.getLogMessages('UPDATE', '/wms/checkPlan/confirm'), logData, JSON.stringify({ beforeText: `在'仓储管理-库内管理-盘点管理',修改一条记录`, ...{ beforeCode, afterCode }}))
          this.$message({
            type: 'success',
            message: '盘点确认成功!'
          })
          this.$router.push('/wms/inventory-manage/check-store/index')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.make-detail{
  .new-header{
    margin: 20px;
    font-family: PingFangSC-Regular;
    font-size: 18px;
  }
  // 盘点信息的样式
  .check-one-detail{
    padding-top: 20px;
    margin: 15px;
    padding-bottom: 10px;
    background-color: #fff;

    .details-tab{
      padding-left: 15px;
      .el-tabs__nav-wrap::after{
        height: 1px;
      }
    }
    /deep/ .el-input__inner{
      border: none;
    }
    .check-words{
      font-size: 16px;
      padding-bottom: 15px;
      padding-left: 15px;
      border-bottom: 1px solid #dfe4ed;
    }
  }
  // 盘点明细表格的样式
  .check-two-table{
    padding-top: 20px;
    padding-left: 15px;
    padding-right: 15px;
    margin: 15px;
    padding-bottom: 10px;
    background-color: #fff;

    .check-input{
      .el-input__inner{
        border: none;
      }
    }

    .table-details{
      // height: 600px;
      // overflow-y: scroll;

      .el-table th {
        background-color: #f5f7fa;
      }
    }

    .check-words{
      font-size: 16px;
      margin-bottom: 15px;
    }

    .totalNum{
      color: #666666;
      margin: 24px 0 12px;
      .tipFirst {
        margin-right: 15px;
        color: #ff9b02;
        font-size: 16px;
      }
    }
  }
  // 其他说明部分
  .other-part{
    margin: 15px;
    padding: 0px 15px;
    background-color: #fff;
    font-family: PingFangSC-Regular;
    padding-bottom: 40px;

    /deep/ .el-form--label-top .el-form-item__label{
      padding: 10px 0px 5px 0px;
    }
  }
  // 按钮的样式
  .button-groups{
    display: flex;
  }
  .button-groups {
    bottom: 0;
    z-index: 1000;
    padding: 10px;
    width: 100%;
    background: #fff;
    position: fixed;
    border-top: 1px solid #ECF0F3;
    .btn-all {
      position: relative;
      left: 40%;
    }
  }
}
</style>
<style lang="scss">
  .table-details{
    .el-table__body-wrapper{
      height: 400px;
      overflow: scroll;
    }
    .el-table th {
      background-color: #f5f7fa;
    }
  }
</style>
