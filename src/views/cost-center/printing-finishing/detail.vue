<!--
 * @Descripttion: 印花报价详情
 * @Author: admin
 * @Date: 2021-06-10 15:58:39
 * @LastEditors: admin
 * @LastEditTime: 2021-07-29 15:01:25
-->

<template>
  <div class="printing-quotation">
    <div class="quotationDetail">
      <div class="new-header">
        <div class="msg-lf">
          <span>询价单号：</span>
          <span>{{ detailData.inquiryNo }}</span>
        </div>
        <div class="msg-lr">
          <div v-for="(item, index) in detailData.operationLog" v-show="item && item.operationType" :key="index">
            {{ `${item.operationType === 1? '询价' : item.operationType === 2? '报价' : item.operationType === 3? '确认' : ''}：${item.operationBy}` }}
            <template v-show="item && item.operationTime">{{
              `${parseTime(item.operationTime)}`
            }} </template>
          </div>
        </div>

      </div>
      <div class="base" style="background: #fff;">
        <div class="top-base">
          <div class="msg-title">基本信息</div>
        </div>
        <cs-custom-form
          :data-source="baseDataSource"
          :options="baseOptions"
          :form-datas="baseDatas"
        />
      </div>

      <!-- 送货清单列表 -->
      <div class="base">
        <div class="top-base">
          <div class="msg-title">印花清单</div>
        </div>
        <div id="dyeOrderDetailBranch" class="dyeOrderDetailBranch">
          <!-- v-for="(item, index) in baseDatas.pdDyeOrderDetailInfoRespList" :key="index" -->
          <div v-for="(item, index) in baseDatas.pdPrintOrderDetailRespList" :key="index" class="list-order">
            <!-- 清单基本信息 -->
            <div class="list-form">

              <cs-custom-form
                ref="tableForm"
                :data-source="detailDataSource"
                :form-datas="item"
                :options="tableformOtions"
              />
            </div>
            <!-- 清单表格信息 -->
            <div class="print-branch-detail">
              <cs-custom-table
                ref="tableList"
                :columns="columns"
                :data-source="item.copytable"
              />
            </div>
            <!-- 更多 -->
            <!-- 默认小于两条数据时不显示更多 -->
            <div class="show-more">
              <div v-if="!item.copytable.length" style="cursor:pointer;" @click="showMore(item, index)">更多<i class="el-icon-arrow-down" /></div>
              <div v-if="item.copytable.length" style="cursor:pointer;" @click="showMore(item, index)">收起<i class="el-icon-arrow-up" /></div>

            </div>
            <!-- 价格信息  可编辑 -->
            <div class="price-message">

              <cs-custom-form
                ref="priceForm"
                :data-source="priceDataSource"
                :form-datas="item"
                :options="tableformOtions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 按钮部分 -->
    <bottomBar :config="barConfig" />

    <!-- 调用审批流 -->
    <approve
      v-if="approveConfig.visible"
      :config="approveConfig"
      @close="approveConfig.visible = false"
    />
  </div>
</template>

<script>
import * as api from './api/index.js'
import { parseTime } from '@/utils'
import bottomBar from '@/components/button-bar/index.vue'
import { fetchLog } from '@/views/wms/public/fetchLog'
import printImgItem from './components/printImg.vue'
import approve from '@/components/approve/index.vue'
export default {
  name: 'QuotationDetail',
  components: { bottomBar, approve },
  mixins: [fetchLog],
  data() {
    const validRule = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      if (!value) {
        return callback(new Error('此项不能为空'))
      } else if (parseFloat(value) === 0) {
        return callback(new Error('只能输入正数，两位小数'))
      } else if (value && !reg.test(value)) {
        return callback(new Error('只能输入正数，两位小数'))
      } else if (value > 99999999.99) {
        return callback(new Error('只能输入正数，两位小数'))
      }
      return callback()
    }
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const detailStyle = {
      width: '32%',
      height: '28px',
      'line-height': '28px',
      'margin-bottom': '0',
      'display': 'flex',
      'margin-left': 0
    }
    // 基本信息
    const baseDataSource = {
      _printNo: {
        prop: 'printNo',
        itemType: 'itemview',
        label: '印花单号：'
      },
      _supplier: {
        prop: 'supplier',
        label: '印花厂：',
        itemType: 'itemview',
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _pmUser: {
        prop: 'pmUser',
        label: '跟单人员：',
        itemType: 'itemview',
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? value.label : ''
        }
      },
      _createdBy: {
        prop: 'createdBy',
        label: '排厂人：',
        itemType: 'itemview'
      },
      _planTime: {
        prop: 'planTime',
        label: '排厂时间：',
        itemType: 'itemview',
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? parseTime(value + '', '{y}-{m}-{d}') : '-'
        }
      },
      _deadline: {
        prop: 'deadline',
        label: '报价截止日期：',
        itemType: 'itemview',
        renderContent(value, options, form, formDatas, setFormDatas, scope) {
          return value ? parseTime(value + '', '{y}-{m}-{d}') : '-'
        }
      }
    }
    // 清单基本信息
    const detailDataSource = {
      _skuId: {
        prop: 'skuId',
        itemType: 'itemview',
        label: '印花布编码：',
        itemStyle: detailStyle
      },
      _suggest: {
        prop: 'suggest',
        itemType: 'itemview',
        label: '成品规格：',
        itemStyle: detailStyle
      },
      _customerColor: {
        prop: 'customerColor',
        itemType: 'itemview',
        label: '客户颜色：',
        itemStyle: detailStyle
      },
      _printDelivery: {
        prop: 'printDelivery',
        itemType: 'itemview',
        label: '交期：',
        itemStyle: detailStyle,
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
              value
                ? this.$filters.parseTime(value + '', '{y}-{m}-{d} {h}:{i}')
                : '-'
            }</div>`
          } else {
            return ''
          }
        }
      },
      _planQty: {
        prop: 'planQty',
        itemType: 'itemview',
        label: '印花布重量：',
        itemStyle: detailStyle
      },
      _tech: {
        prop: 'tech',
        itemType: 'itemview',
        label: '印花工艺：',
        itemStyle: detailStyle
      },
      _printLoss: {
        prop: 'printLoss',
        itemType: 'itemview',
        label: '印损：',
        itemStyle: detailStyle
      },
      _colorPath: {
        prop: 'colorPath',
        // itemType: 'itemview',
        label: '印花图案：',
        // itemStyle: detailStyle
        className: 'img-style',
        itemStyle: {
          'line-height': '20px',
          'margin-bottom': '0'
        },
        components: {
          printImgItem
        }
      }

    }
    // 价格信息
    const priceDataSource = {
      _price: {
        prop: 'price',
        label: '单价（元）：',
        itemType: 'input',
        className: 'inputWidth',
        itemStyle: 'margin-right: 60px;',
        rules: [
          {
            required: true,
            trigger: ['change'],
            validator: validRule
          }
        ],
        isShow: () => {
          return this.status !== 2
        },
        change: (value, v1, scope, v3, v4, index) => {
          // console.log(value, v1, scope, v3)
          scope.price = value
          scope.totalPrice = this.$utils.getFloat(value * scope.planQty, 2) || ''
        }
      },
      _totalPrice: {
        prop: 'totalPrice',
        label: '总价（元）：',
        itemType: 'input',
        className: 'inputWidth',
        // disabled: true,
        rules: [commonBlurReg],
        readonly: true,
        clearable: true,
        itemStyle: 'margin-right: 60px;',
        isShow: () => {
          return this.status !== 2
        }
      },
      _record: {
        prop: 'record',
        label: '备注：',
        className: 'inputWidth',
        clearable: true,
        itemType: 'input',
        itemStyle: 'width: 27%',
        maxlength: 200,
        title: true,
        isShow: () => {
          return this.status !== 2
        }
      }
    }
    // 清单表格信息
    const columns = {
      _index: {
        minWidth: '50',
        label: '序号',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _skuId: {
        prop: 'skuId',
        label: '色布编码',
        showOverflowTooltip: true
      },
      _cloth: {
        prop: 'cloth',
        label: '布类',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cloth ? scope.row.cloth.label : ''
        }
      },
      _yarnType: {
        prop: 'yarnType',
        label: '纱名',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _yarnAttr: {
        prop: 'yarnAttr',
        label: '纱属性',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _elementName: {
        prop: 'elementName',
        label: '成份',
        showOverflowTooltip: true,
        handle: (scope) => {}
      },
      _planQty: {
        prop: 'planQty',
        label: '色布重量(KG)',
        align: 'right',
        showOverflowTooltip: true,
        handle: (scope) => {}
      }
    }

    const approveConfig = {
      visible: false,
      pass: () => {
        this.appInfo(1)
      },
      back: () => {
        this.appInfo(0)
      }
    }
    const barConfig = {
      _confirm: {
        type: 'primary',
        text: '确认价格',
        submit: async() => {
          const data = {
            inquiryNo: this.$route.query.id
          }
          await api.confirm(data)
          this.$message.success('操作成功')
          const description = {
            beforeText: `在'成本中心-印花报价'更新了一条记录`,
            beforeCode: { id: this.$route.query.id }
          }
          const opratorType = `UPDATE`
          this.$store.dispatch('app/fetchParamsLog', {
            params: data,
            opratorType,
            api: `/costCenter/print/confirm`,
            description,
            appId: 'costCenter'
          })
          this.getDetail({ inquiryNo: this.$route.query.id })
        },
        isShow: () => {
          // 待智布确认
          return this.status === 3 && !this.isRevise && !this.baseDatas.rejected && this.$permission(['costCenter:print:confirm'])
        }

      },
      _modify: {
        type: 'primary',
        text: '修改价格',
        submit: async() => {
          this.isRevise = true
          this.$set(this.tableformOtions, 'disabled', false)
        },
        isShow: () => {
          // 待智布确认
          return this.status === 3 && !this.isRevise && this.$permission(['costCenter:print:modifyPrice'])
        }

      },
      _submit: {
        type: 'primary',
        text: '提交',
        submit: async() => {
          // console.log(this.$refs.priceForm.dynamicValidateFormRuleForm)
          const priceMessage = this.$refs.priceForm || []
          const res = priceMessage.find((item) => {
            let isValid = false
            item.form.validate((valid) => {
              isValid = !valid
            })
            return isValid
          })
          if (res) {
            return
          }
          const modifyPriceData = []
          priceMessage && priceMessage.forEach((item, index) => {
            modifyPriceData.push({
              id: item.dynamicValidateFormRuleForm.id,
              price: item.dynamicValidateFormRuleForm.price,
              totalPrice: item.dynamicValidateFormRuleForm.totalPrice,
              record: item.dynamicValidateFormRuleForm.record
            })
          })
          const data = {
            inquiryNo: this.$route.query.id,
            modifyPriceData
          }
          await api.modifyPrice(data)
          this.$message.success('操作成功')
          const description = {
            beforeText: `在'成本中心-印花报价'更新了一条记录`,
            beforeCode: { id: this.$route.query.id }
          }
          const opratorType = `UPDATE`
          this.$store.dispatch('app/fetchParamsLog', {
            params: data,
            opratorType,
            api: `/costCenter/print/modifyPrice`,
            description,
            appId: 'costCenter'
          })
          this.isRevise = false
          this.$set(this.tableformOtions, 'disabled', true)
          this.getDetail({ inquiryNo: this.$route.query.id })
        },
        isShow: () => {
          // 点击修改价格显示提交和取消
          return this.isRevise
        }

      },
      _cancel: {
        type: '',
        text: '取消',
        submit: async() => {
          this.isRevise = false
          this.$set(this.tableformOtions, 'disabled', true)
          this.getDetail({ inquiryNo: this.$route.query.id })
        },
        isShow: () => {
          // 点击修改价格显示提交和取消
          return this.isRevise
        }

      },
      _aduit: {
        type: 'primary',
        text: '审核',
        submit: () => {
          this.approveConfig.visible = true
        },
        isShow: () => {
          // 审批中可撤回
          return this.status === 5 && !this.isRevise && this.$permission(['costCenter:print:audit'])
        }

      },
      _withdraw: {
        type: '',
        text: '撤回',
        submit: () => {
          this.$confirm('确定要撤回该数据吗？', '提示', {
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(async() => {
              const data = {
                inquiryNo: this.$route.query.id
              }
              await api.withdraw(data)
              this.$message.success('操作成功')
              const description = {
                beforeText: `在'成本中心-印花报价'更新了一条记录`,
                beforeCode: { id: this.$route.query.id }
              }
              const opratorType = `UPDATE`
              this.$store.dispatch('app/fetchParamsLog', {
                params: data,
                opratorType,
                api: `/costCenter/print/withdraw`,
                description,
                appId: 'costCenter'
              })
              this.getDetail({ inquiryNo: this.$route.query.id })
            })
            .catch(() => {

            })
        },
        isShow: () => {
          // 审批中可撤回
          return this.status === 5 && !this.isRevise && this.$permission(['costCenter:print:withdraw'])
        }

      },
      _back: {
        type: '',
        text: '返回',
        isShow: () => {
          return !this.isRevise
        },
        submit: () => {
          this.$router.push(`/cost-center/printing-finishing/list`)
        }
      }
    }

    return {
      columns,
      detailDataSource,
      priceDataSource,
      InfoRespList: [],
      tableFormDatas: {},
      baseDataSource,
      baseDatas: {},
      baseOptions: {
        inline: true,
        className: 'msg-content'
      },

      detailData: {},
      parseTime,
      tableformOtions: {
        disabled: true,
        validate: (prop, flag, errmsg) => {},
        popError: (prop, flag, errmsg) => {}
        // showMessage: true
      },
      barConfig,
      isRevise: false, // 是否修改价格
      approveConfig
    }
  },
  computed: {
    status() {
      return this.detailData && this.detailData.status
    }

  },
  created() {
    this.getDetail({ inquiryNo: this.$route.query.id })
  },
  methods: {
    // 获取详情
    async getDetail(data) {
      const res = await api.printingFinishingDetail(data)
      if (!res || res.code !== 200) {
        return false
      }

      this.detailData = res.data || {}
      this.baseDatas = res.data.baseInfo || {}
      // console.log(this.baseDatas)
      this.baseDatas && this.baseDatas.pdPrintOrderDetailRespList.forEach((item, index) => {
        item.colorPath = 'https://oss-exhibition.sfabric.com/customerOrder/so_print/dT0xMTgwOTkxNjA3LDI2NDU3NTgzMDQmZm09MjYmZ3A9MA==_1608863703069-IxxEGE.jpg'
        item.copytable = []
      })
      // 审批流程Id
      this.approveConfig.procInstId = this.detailData.processKey
      this.approveConfig.workflowId = this.detailData.inquiryNo
    },

    // 更多
    showMore(item, index) {
      const obj = { ...this.baseDatas }
      if (obj.pdPrintOrderDetailRespList[index].orderDetailMaterialInfoRespList.length === 0) {
        this.$message.error('暂无数据！')
        return
      }
      obj.pdPrintOrderDetailRespList[index].copytable = obj.pdPrintOrderDetailRespList[index].copytable.length ? [] : [...obj.pdPrintOrderDetailRespList[index].orderDetailMaterialInfoRespList]
      this.baseDatas = obj
    },

    // 审核
    appInfo(val) {
      const str = val ? '通过' : '驳回'
      this.$store.dispatch('app/fetchParamsLog', {
        params: {
          inquiryNo: this.$route.query.id
        },
        opratorType: 'EXAMINE',
        api: '/sysSettings/workflow/workflowTask',
        description: {
          beforeText: '在成本中心印花报价审核' + str + '了一条数据',
          beforeCode: {
            inquiryNo: this.$route.query.id
          }
        },
        appId: 'costCenter'
      })
      this.getDetail({ inquiryNo: this.$route.query.id })
    }

  }
}
</script>

<style lang="scss" scoped>
.printing-quotation{
  /deep/ .table-detail .el-form-item__content .table {
    padding-bottom: 10px;
  }
  .quotationDetail {
  padding: 0 20px;
  .new-header {
    display: flex;
    line-height: 65px;
    justify-content: space-between;
    .new-tip{
      color: #666666;
      font-size: 18px;
    }
    .msg-lf {
      font-size: 18px;
      color: #151222;
    }
    .msg-lr {
      display: flex;
      font-size: 12px;
      color: #666666;
      // margin-right: 30px;
      > div {
        margin-left: 20px;
      }
    }
  }
  .base {
    // background: #fff;
    .top-base{
    border-bottom: 1px solid #e9eff2;
    background: #fff;
    }
    .msg-title {
      font-size: 16px;
      line-height: 64px;
      color: #151222;
      margin-left: 20px;
      margin-right: 20px;
    }
    /deep/ .el-form-item__content{
      color: #474747;
    }
  }

}

  #dyeOrderDetailBranch {
  width: 100%;
  height: 100%;
  // background: #fff;
  // margin-bottom: 16px;
  /deep/ .list-order .price-message .el-form > .el-form-item:nth-child(3) .el-input.is-disabled .el-input__inner {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .list-order{
    background: #fff;
    margin-bottom: 16px;
    /deep/ .list-form .el-popover__reference .el-form-item__content {
        margin-left: 96px !important;
        color:  #474747;
    }
    /deep/ .list-form .el-form-item__content {
      margin-left: 0 !important;
      color:  #474747;
    }

    /deep/ .price-message .el-form > .el-form-item:first-child .el-input.is-disabled .el-input__inner {
      border: none;
      background: #fff;
      font-size: 18px;
      color: #FF9B02;
    }
    /deep/ .price-message .el-form > .el-form-item:nth-child(2) .el-input.is-disabled .el-input__inner {
      border: none;
      background: #fff;
      font-size: 18px;
      color: #FF9B02;
    }
    /deep/ .price-message .el-form > .el-form-item:nth-child(3) .el-input.is-disabled .el-input__inner {
      border: none;
      background: #fff;
      font-size: 14px;
      color: #474747;
    }
  }
  .print-branch-detail {
    //表格
    // margin-bottom: 10px;
    background: #fff;
    padding: 0 10px;
    /deep/ .el-table__empty-block {
      display: none;
    }

    // /deep/ .el-table th > .cell {
    //   font-weight: 400;
    // }
  }

  .show-more{
    // padding: 15px 10px;
    text-align: center;
    font-size: 14px;
    color: #666;
    border-bottom: 1px solid #E9EFF2;
    margin: 15px 10px;
    padding-bottom: 15px;
  }
  /deep/ .price-message .custom-form{
    padding: 0 40px !important;
  }

  // /deep/ .price-message .custom-form .el-form-item__label:before{
  //   content: '';
  // }

  /deep/ .price-message .custom-form .el-form-item__label{
    color: #474747 !important;
  }
}
/deep/ #dyeOrderDetailBranch .el-form{
  display: flex;
  flex-wrap: wrap;
}
/deep/.el-table--medium th, .el-table--medium td {
    padding: 0
  }
}
</style>

<style lang='scss'>
.printing-quotation{
  .quotePop {
    .el-form-item__error{
      display: none;
    }
  }

  .ButtonBar .button-group {
    // margin-left: 0;
    z-index: 10;
  }
  .quotationDetail {
    margin-bottom: 70px;
    .reasonStyle .el-input__inner{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    // .el-form-item__label{
    //   color: #888e9e !important;
    // }
  .base {
    .el-form-item__label{
      color: #888e9e !important;
    }
    .msg-content {
      background: #fff;
      padding: 0 20px 0;
      margin: 16px 0;
      padding-bottom: 20px;
      > div {
        width: 24%;
      }
      .el-form-item {
        margin-bottom: -6px;
      }
      .el-input__inner {
        border: none;
      }
    }
  }
  #dyeOrderDetailBranch.dyeOrderDetailBranch {
    // box-shadow:  10px 12px 10px 0 rgba(161,177,192,0.2);
    // z-index: 2;
  .custom-form{
    padding: 16px 50px;
    box-shadow: 0px 7px 10px 0px rgba(161,177,192,0.1);
    z-index: 2;
  }
  .detail-branch-detail-form {
    background: #fff;
    .el-form-item__label {
      height: 28px;
      line-height: 28px;
      color: #888e9e;
    }
    .el-form-item__content {
      line-height: 28px;
      color: #474747;
    }
    padding: 16px 40px;
    margin-top: 16px;
  }
  .print-branch-detail {
    .el-table th.is-leaf {
      background: #f5f7fa;
      height: 44px;
    }
    .table tr:nth-child(even) {
      background: #fff;
    }
  }
}

}

}

</style>

