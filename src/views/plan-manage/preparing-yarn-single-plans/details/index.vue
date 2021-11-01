<template>
  <div class="preparing-yarn-single-plans">
    <!-- 抽纱详情列表搜索 -->
    <div class="base-info">基本信息</div>
    <div class="search baseInfo">
      <cs-custom-form ref="searchForm" :data-source="searchData" :form-datas="searchFormDatas" :options="formOtions" />
    </div>
    <div class="order-information">
      <div class="title">
        <div class="order-information-title">订单信息</div>
        <!-- <el-button v-if="isDetail && $permission(['aps-center:grayYarn:addRecord'])" size="small" @click="orderInformationEdit">编辑</el-button>
        <el-button v-if="isDetail && $permission(['aps-center:grayYarn:addRecord'])" size="small" type="primary" @click="orderInformationClick">抽纱</el-button>
        <el-button v-if="!isDetail" size="small" @click="orderInformationCancel">取消</el-button>
        <el-button v-if="!isDetail && $permission(['aps-center:grayYarn:addRecord'])" size="small" type="primary" @click="orderInformationSave">保存</el-button> -->
      </div>
      <!-- 列表 -->
      <div class="have-order-information">
        <cs-custom-form ref="orderInformationSearchForm" :data-source="orderInformationData" :options="orderInformationFormOtions" :form-datas="orderInformationFormDatas" />
        <!-- <cs-custom-table
          tooltip-effect="dark"
          :header-cell-style="headerCellStyle"
          max-height="450"
          :columns="orderInformationColumns"
          :table-scrollx="true"
          :data-source="orderInformationDataSource"
        /> -->
      </div>
      <!-- <div v-else class="no-order-information">还未进行抽纱，请选择库存进行原料划扣</div> -->
    </div>

    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="status-button-group">
      <el-button v-if="!isDetail && $permission(['aps-center:yarnPlanOrder:hold'])" type="primary" @click="saveOrderInformation">保存</el-button>
      <el-button v-if="+status === 0 && isDetail && $permission(['aps-center:yarnPlanOrder:edit'])" type="primary" @click="editOrderInformation">编辑</el-button>
      <el-button v-if="+status === 0 && isDetail && $permission(['aps-center:yarnPlanOrder:audit'])" type="primary" @click="examineOrderInformation">审核</el-button>
      <el-button v-if="isDetail && +status === 1 && $permission(['aps-center:yarnPlanOrder:alter'])" type="primary" @click="changeOrderInformation">变更</el-button>
      <el-button @click="back">取消</el-button>
    </div>

    <!-- 带搜索弹出框 -->
    <cs-custom-popsearch :options="popOptions" @close="popsearchClose" />
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="popForm" :options="detailPopOptions" />
    </div>
  </div>
</template>

<script>
import { DrawnworkDetails } from './components/index.js'
import dynamicTtable from './components/dynamic-table'
import selectInventoryText from './components/select-inventory-text'
// import { detail } from '@/views/base-data/reissue-setting/api/index.js'
export default {
  mixins: [DrawnworkDetails],
  data() {
    const numberReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位正数, 最多两位小数', trigger: ['blur'] })
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 抽用数量正则校验
    // const numberReg = this.$getRules({ pattern: 'number', trigger: ['blur'] })
    // 基本信息
    const searchData = {
      '_code': {
        prop: 'code',
        itemType: 'itemview',
        label: '订单号:',
        itemStyle: { width: '25%' }
      },
      '_customer': {
        prop: 'customer',
        itemType: 'itemview',
        label: '客户:',
        itemStyle: { width: '25%' },
        renderContent: value => {
          return value ? value.label || '-' : '-'
        }
      },
      '_customerService': {
        prop: 'customerService',
        itemType: 'itemview',
        label: '客服:',
        itemStyle: { width: '25%' },
        renderContent: value => {
          return value ? value.label || '-' : '-'
        }
      },
      '_sellerTeam': {
        prop: 'sellerTeam',
        itemType: 'itemview',
        itemStyle: { width: '25%' },
        label: '销售团队:',
        renderContent: value => {
          return value ? value.label || '-' : '-'
        }
      },
      '_createdTime': {
        prop: 'createdTime',
        itemType: 'itemview',
        itemStyle: { width: '25%' },
        label: '创建时间:',
        renderContent: value => {
          return value ? this.$filters.parseTime(value, '{y}-{m}-{d} {h}:{m}') : '-'
        }
      }

      // '_operate': {
      //   itemType: 'operate',
      //   submitText: '查询',
      //   submitHandle: async params => {
      //     console.log('查询', params)
      //     // this.purchaseRequirePage({ ...params, deliveryStartTime, deliveryEndTime })
      //     const flag = this.orderInformationDataSourceCopy.some(item => +item.status !== 1)
      //     // debugger
      //     if (flag) {
      //       const res = await this.$uiUtils.confirmMsg({ message: '有部分已抽纱列表未完成抽纱, 是否继续搜索', cancelMessage: '已取消' })
      //       if (res) {
      //         console.log('确认')
      //         this.searchFormDatas = params
      //         this.getGrayYarnInfo()
      //       } else {
      //         console.log('取消')
      //       }
      //     } else {
      //       this.searchFormDatas = params
      //       this.getGrayYarnInfo()
      //     }
      //   },
      //   resetHandle: () => {
      //     this.searchFormDatas = {}
      //   }
      // }
    }
    // 订单信息列表表头
    const orderInformationColumns = {
      '_id': {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: (scope) => {
          // return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
          return scope.$index + 1
        }
      },
      '_yarnCode': {
        prop: 'yarnCode',
        label: '纱线编码',
        minWidth: '130',
        showOverflowTooltip: true
      },
      '_type': {
        prop: 'type',
        label: '纤维类型',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const obj = {
            0: '天然纤维',
            1: '化学纤维',
            2: '组合纱线'
          }
          return obj[scope.row.type] || '-'
        }
      },
      '_yarnName': {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_yarnProperty': {
        prop: 'yarnProperty',
        label: '纱属性',
        minWidth: '100',
        showOverflowTooltip: true
      },
      '_yarnTotal': {
        prop: 'yarnTotal',
        label: '数量(KG)',
        align: 'right',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.yarnTotal) ? (+scope.row.yarnTotal).toFixed(2) : '-'
        }
      },
      '_purchaseQty': {
        prop: 'purchaseQty',
        label: '采购数量(KG)',
        align: 'right',
        minWidth: '130',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.purchaseQty) ? (+scope.row.purchaseQty).toFixed(2) : '-'
        }
      },
      '_planUseTime': {
        prop: 'planUseTime',
        label: '计划采购交期',
        minWidth: '150',
        className: 'redStar',
        // isShow: scope => {
        //   return this.isDetail
        // },
        // showOverflowTooltip: true,
        formater: scope => {
          return scope.row.planUseTime ? this.$filters.parseTime(scope.row.planUseTime, '{y}-{m}-{d}') : '-'
        },
        editOptions: {
          size: 'mini',
          labelWidth: '0',
          itemType: 'date',
          // clearable: true,
          format: 'yyyy-MM-dd',
          focus: (dateObj) => {
            // debugger
            // console.log(dateObj)
            // if (!dateObj) {
            //   return false
            // }
          },
          blur: () => {},
          valueFormat: 'timestamp',
          readonly: false,
          // maxlength: 200,
          placeholder: '请选择'
          // rules: [numberReg, commonChangeReg]
        }
      },
      '_lockNum': {
        prop: 'lockNum',
        label: '抽库存量(KG)',
        align: 'right',
        minWidth: '130',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.lockNum) ? (+scope.row.lockNum).toFixed(2) : '-'
        }
      },
      '_estimateUseTime': {
        prop: 'estimateUseTime',
        label: '预计使用交期',
        minWidth: '120',
        // isShow: scope => {
        //   return this.isDetail
        // },
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.estimateUseTime ? this.$filters.parseTime(scope.row.estimateUseTime, '{y}-{m}-{d}') : '-'
        }
      },
      '_estimateUserAmount': {
        prop: 'estimateUserAmount',
        label: '预计使用量(KG)',
        align: 'right',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.estimateUserAmount) ? (+scope.row.estimateUserAmount).toFixed(2) : '-'
        }
      },
      '_productionStatus': {
        prop: 'productionStatus',
        label: '生产状态',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const obj = {
            0: '待安排'
          }
          return `<div style="color: #FF8900">${obj[scope.row.productionStatus]}</div>`
        }
      }
    }

    let orderInformationDataSource = [
      {
        label: '抽纱',
        // style: { 'color': '#FE4949' },
        permitTag: ['aps-center:grayYarn:addRecord'],
        isShow: (scope) => {
          return !this.isDetail
        },
        handle: params => {
          console.log(params)
          this.popOptions.visible = true
          this.getYarnPlanOrderInfoList({ ids: [params.row.id] })

          this.$nextTick(() => {
            this.popOptions.popFormOptions.formDatas = { yarnCode: params.row.yarnCode }
          })

          this.popsearchFormDatas = { yarnCode: params.row.yarnCode }
          this.getGrayYarnStockList({}) // 获取库存
        }
      },
      {
        label: '查看明细',
        // permitTag: ['aps-center:grayYarn:recordList'],
        isShow: (scope) => {
          return this.isDetail
        },
        handle: params => {
          this.detailPopOptions.visible = true
          this.getDrawingDetails({ ids: [params.row.id] }, false)
        }
      },
      {
        label: '编辑明细',
        permitTag: ['aps-center:grayYarn:addRecord'],
        isShow: (scope) => {
          return !this.isDetail
        },
        handle: params => {
          this.detailPopOptions.visible = true
          this.getDrawingDetails({ ids: [params.row.id] }, true)
        }
      }
    ]
    // 权限过滤
    orderInformationDataSource = this.$filterPermission(orderInformationDataSource)

    // 订单信息表单配置
    const orderInformationData = {
      _tableForm: {
        prop: 'tableForm',
        headerCellStyle: { 'background-color': '#F5F7FA', height: '44px' },
        className: 'pop-table',
        itemType: 'table-form',
        label: '',
        labelWidth: '0',
        dataSource: [],
        columns: orderInformationColumns,
        operates: {
          label: '操作',
          width: '140',
          fixed: 'right',
          // moreOptions: {
          //   maxLength: 2// 最大超过多少个显示more功能，默认为2
          // },
          dataSource: orderInformationDataSource
        },
        tooltipEffect: 'dark'
      }
    }

    // 弹出框搜索内容配置
    const popContent = {
      '_yarnCode': {
        prop: 'yarnCode',
        itemType: 'input',
        label: '纱线编码:',
        itemStyle: { width: '33%' },
        placeholder: '支持多个条件,顿号隔开'
      },
      // '_yarnBranch': {
      //   prop: 'yarnBranch',
      //   itemType: 'input',
      //   label: '纱支:',
      //   itemStyle: { width: '33%' },
      //   placeholder: '支持多个条件,顿号隔开'
      // },
      // '_dyeApplicability': {
      //   prop: 'dyeApplicability',
      //   itemType: 'input',
      //   label: '染色适用性:',
      //   itemStyle: { width: '33%' },
      //   placeholder: '支持多个条件,顿号隔开'
      // },
      // '_yarnMethod': {
      //   prop: 'yarnMethod',
      //   itemType: 'input',
      //   label: '纺纱方法:',
      //   itemStyle: { width: '33%' },
      //   placeholder: '支持多个条件,顿号隔开'
      // },
      // '_cardMethod': {
      //   prop: 'cardMethod',
      //   itemType: 'input',
      //   label: '梳棉方法:',
      //   itemStyle: { width: '33%' },
      //   placeholder: '支持多个条件,顿号隔开'
      // },
      '_yarnName': {
        prop: 'yarnName',
        itemType: 'input',
        label: '纱名:',
        itemStyle: { width: '33%' },
        placeholder: '请输入'
      },
      '_yarnAttr': {
        prop: 'yarnAttr',
        itemType: 'input',
        itemStyle: { width: '33%' },
        label: '纱属性:',
        placeholder: '请输入'
      },
      '_storehouse': {
        prop: 'storehouse',
        itemType: 'input',
        label: '仓库:',
        itemStyle: { width: '33%' },
        placeholder: '请输入'
      },
      '_supplier': {
        prop: 'supplier',
        itemType: 'input',
        label: '供应商:',
        itemStyle: { width: '33%' },
        placeholder: '请输入'
      },
      '_salesTeamName': {
        prop: 'salesTeamName',
        itemType: 'input',
        label: '销售团队:',
        itemStyle: { width: '33%' },
        placeholder: '请输入'
      },
      _operate: {
        itemType: 'operate',
        submitHandle: params => {
          const valuesArr = Object.values(params)
          let valuesFlag = false
          valuesArr.forEach(item => {
            if (item) {
              valuesFlag = true
            }
          })
          if (valuesFlag) {
            this.popsearchFormDatas = params
            this.getGrayYarnStockList(params)
          } else {
            this.$message.warning('未输入任何搜索条件, 无法搜索')
          }
        },
        submitText: '查询',
        resetHandle: (params) => {
          console.log('重置')
          this.popsearchFormDatas = {}
        }
      }
    }
    // 弹出框表格表头内容配置
    const popColumns = {
      '_id': {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: (scope) => {
          // return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
          return scope.$index + 1
        }
      },
      '_yarnCode': {
        prop: 'yarnCode',
        label: '坯纱编码',
        minWidth: '150',
        showOverflowTooltip: true
        // formater: scope => {
        //   const yarnCodeArr = scope.row.yarnCode ? scope.row.yarnCode.split(',') : []
        //   let str = '<span>'
        //   yarnCodeArr.forEach((item, index) => {
        //     if (index !== yarnCodeArr.length) {
        //       str += item + '</br>'
        //     } else {
        //       str += item + '</span>'
        //     }
        //   })
        //   return str
        // }
      },
      '_yarnOrderNo': {
        prop: 'yarnOrderNo',
        label: '备纱单号',
        minWidth: '160',
        showOverflowTooltip: true
      },
      '_sourceOrderNo': {
        prop: 'sourceOrderNo',
        label: '来源数据',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_storehouse': {
        prop: 'storehouse',
        label: '仓库',
        minWidth: '60',
        showOverflowTooltip: true
      },
      '_storeNum': {
        prop: 'storeNum',
        label: '可用库存(KG)',
        align: 'right',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.storeNum) ? (+scope.row.storeNum).toFixed(2) : '-'
        }
      },
      '_supplier': {
        prop: 'supplier',
        label: '供应商',
        minWidth: '70',
        showOverflowTooltip: true
      },
      '_yarnReport': {
        prop: 'yarnReport',
        label: '纱线物测',
        minWidth: '130',
        showOverflowTooltip: true,
        style: { color: '#1890ff', cursor: 'pointer' },
        handle: scope => {
          const { href } = this.$router.resolve({
            name: `quality-yarn-edit`,
            params: { id: scope.row.yarnReport }
          })
          window.open(href, '_blank')
        }
      },
      '_tryOutReport': {
        prop: 'tryOutReport',
        label: '试纱',
        minWidth: '130',
        showOverflowTooltip: true,
        style: { color: '#1890ff', cursor: 'pointer' },
        handle: scope => {
          const { href } = this.$router.resolve({
            name: 'quality-assurance-detail',
            query: {
              id: scope.row.tryOutReport
              // type: 'detail'
            }
          })
          window.open(href, '_blank')
        }
      },
      '_yarnBrand': {
        prop: 'yarnBrand',
        label: '纱牌纱批',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_yarnName': {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '120',
        showOverflowTooltip: true
        // formater: scope => {
        //   const yarnNameArr = scope.row.yarnName ? scope.row.yarnName.split(',') : []
        //   let str = '<span>'
        //   yarnNameArr.forEach((item, index) => {
        //     if (index !== yarnNameArr.length) {
        //       str += item + '</br>'
        //     } else {
        //       str += item + '</span>'
        //     }
        //   })
        //   return str
        // }
      },
      '_yarnAttr': {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '100',
        showOverflowTooltip: true
        // formater: scope => {
        //   const yarnAttrArr = scope.row.yarnAttr ? scope.row.yarnAttr.split(',') : []
        //   let str = '<span>'
        //   yarnAttrArr.forEach((item, index) => {
        //     if (index !== yarnAttrArr.length) {
        //       str += item + '</br>'
        //     } else {
        //       str += item + '</span>'
        //     }
        //   })
        //   return str
        // }
      },
      '_salesTeamName': {
        prop: 'salesTeamName',
        label: '销售团队',
        minWidth: '80',
        showOverflowTooltip: true
      }
    }
    // 带搜索弹出框配置
    const popOptions = {
      visible: false,
      title: '抽纱',
      width: '1240px',
      className: 'drawingPop',

      footerOptions: {
        content: [
          {
            name: '保存',
            type: 'primary',
            handle: (formDatas, form, table) => {
              console.log(formDatas, form, table)
              if (!this.popCurrentRow) {
                this.$message.warning('请先选择库存')
                return false
              }
              if (this.readyDrawing.some(item => !item.lockNum)) {
                this.$message.warning('请输入本次抽纱重量')
                return false
              }
              if (!this.popOptions.footerComponentOption.errFlag) {
                // this.$message.warning('请输入正确的数字')
                return false
              }
              const readyNum = this.readyDrawing.length ? this.readyDrawing.reduce((total, item) => {
                total += item.lockNum * 1
                return total
              }, 0) : 0
              const toBeDrawnNum = +this.popCurrentRow.storeNum
              console.log(readyNum, toBeDrawnNum)
              if (readyNum > toBeDrawnNum) {
                this.$message.error('输入数据总和大于可用库存')
              } else {
                console.log('成功')
                const paramsArr = this.readyDrawing.map(item => {
                  return {
                    ...item,
                    ...this.popCurrentRow,
                    apsYarnPlanOrderDetailId: item.id,
                    type: '1'
                  }
                })
                console.log(paramsArr)
                this.grayYarnAddRecord({ addRecordList: paramsArr })
              }
              // this.popOptions.visible = false
            }
          },
          {
            name: '关闭',
            handle: (formDatas, form, table) => {
              console.log(formDatas, form, table)
              this.popOptions.visible = false
            }
          }
        ]
      },
      popFormOptions: {
        content: popContent,
        formOptions: {
          // layout: true,
          syncDataHandle: (syncData) => {
            console.log(syncData)
            // this.popsearchFormDatas = syncData
          },
          size: 'small',
          inline: true,
          layout: true
          // className: 'popFormOptionsClass'
          // popError: true
        },
        formDatas: {}
      },
      popTableOptions: {
        columns: popColumns,
        rowStyle: { 'background-color': '#fff' },
        maxHeight: '240px',
        headerCellStyle: { 'background-color': '#F5F7FA', 'height': '44px' },
        // highlightCurrentRow: true,
        // currentRowKey: 'id',
        rowClassName: this.currentRowClassName,
        rowClick: (row, column, event) => {
          this.popCurrentRow = row
          // this.secondPopOptions.visible = true
          // const checkedDataSource = this.checkedYarnList.map(item => {
          //   return {
          //     apsGrayyarnReduceId: item.apsGrayyarnReduceId,
          //     apsLossDetailYarnId: item.apsLossDetailYarnId,
          //     orderNo: item.orderNo,
          //     yarnCode: item.yarnCode,
          //     yarnNum: item.yarnNum,
          //     lockNum: '',
          //     edit: true,
          //     lockNumEdit: true
          //   }
          // })
          // console.log('checkedDataSource', checkedDataSource, this.checkedYarnList)
          // this.$set(this.secondPopOptions.content._tableForm, 'dataSource', checkedDataSource)
        },
        dataSource: []
        // pagination
      },
      headerComponent: selectInventoryText,
      footerComponent: dynamicTtable,
      footerComponentOption: {
        dataSource: [],
        handle: data => {
          this.readyDrawing = data
        },
        errFlag: true
      }
    }

    const detailColumns = {
      '_id': {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: (scope) => {
          // return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
          return scope.$index + 1
        }
      },
      '_sourceOrderNo': {
        prop: 'sourceOrderNo',
        label: '订单号',
        minWidth: '100',
        showOverflowTooltip: true
      },
      '_yarnCode': {
        prop: 'yarnCode',
        label: '坯纱编码',
        minWidth: '130',
        showOverflowTooltip: true
      },
      '_storeYarnCode': {
        prop: 'storeYarnCode',
        label: '库存纱线编码',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_yarnName': {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_yarnAttr': {
        prop: 'yarnAttr',
        label: '纱属性',
        minWidth: '100',
        showOverflowTooltip: true
      },
      '_yarnBrand': {
        prop: 'yarnBrand',
        label: '纱牌/批号',
        minWidth: '100',
        showOverflowTooltip: true
      },
      // '_yarnOrderNo': {
      //   prop: 'yarnOrderNo',
      //   label: '备纱单号',
      //   minWidth: '100',
      //   showOverflowTooltip: true
      // },
      '_storeNum': {
        prop: 'storeNum',
        label: '可用库存(KG)',
        align: 'right',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.storeNum) ? (+scope.row.storeNum).toFixed(2) : '-'
        }
      },
      '_storehouse': {
        prop: 'storehouse',
        label: '仓库',
        minWidth: '60',
        showOverflowTooltip: true
      },
      '_supplier': {
        prop: 'supplier',
        label: '供应商',
        minWidth: '70',
        showOverflowTooltip: true
      },
      '_yarnReport': {
        prop: 'yarnReport',
        label: '纱线物测',
        minWidth: '130',
        showOverflowTooltip: true
        // style: { color: '#1890ff', cursor: 'pointer' },
        // handle: scope => {
        //   const { href } = this.$router.resolve({
        //     name: `quality-yarn-edit`,
        //     params: { id: scope.row.yarnReport }
        //   })
        //   window.open(href, '_blank')
        // }
      },
      '_tryOutReport': {
        prop: 'tryOutReport',
        label: '试纱',
        minWidth: '130',
        showOverflowTooltip: true
        // style: { color: '#1890ff', cursor: 'pointer' },
        // handle: scope => {
        //   const { href } = this.$router.resolve({
        //     name: 'quality-assurance-detail',
        //     query: {
        //       id: scope.row.tryOutReport
        //     }
        //   })
        //   window.open(href, '_blank')
        // }
      },
      '_salesTeamName': {
        prop: 'salesTeamName',
        label: '销售团队',
        minWidth: '80',
        showOverflowTooltip: true
      },
      // '_lastLockNum': {
      //   prop: 'lastLockNum',
      //   label: '本次抽用重量(KG)',
      //   align: 'right',
      //   minWidth: '150',
      //   isShow: scope => {
      //     return this.isDetail
      //   },
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return !isNaN(scope.row.lastLockNum) ? (+scope.row.lastLockNum).toFixed(2) : '-'
      //   }
      // },
      '_lockNum': {
        prop: 'lockNum',
        label: '本次抽用重量(KG)',
        // align: 'right',
        minWidth: '150',
        // isShow: scope => {
        //   return !this.isDetail
        // },
        // showOverflowTooltip: true,
        editOptions: {
          size: 'mini',
          labelWidth: '0',
          itemType: 'input',
          // maxlength: 200,
          placeholder: '请输入',
          rules: [numberReg, commonBlurReg]
        }
      }
    }
    // 抽纱明细弹出框
    const detailPopOptions = {
      itemType: 'dialog',
      visible: false,
      className: 'detailPopOptions',
      width: '1240px',
      title: '查看明细',
      okHidden: false,
      cancelText: '取消',
      okText: '保存',
      // saveAndaddText: '保存并继续',
      ok: params => {
        console.log(params)

        // if (!this.$permission(['aps-center:grayYarn:addRecord'])) {
        //   this.$message.error('您没有抽纱权限, 请去用户中心配置权限')
        //   return false
        // }
        // let numFlag = true
        if (params.tableForm.length) {
          const numFlag = params.tableForm.some(item => item.lockNum > item.lastLockNum)
          if (!numFlag) {
            this.grayYarnAddRecord({ addRecordList: params.tableForm || [] })
          } else {
            this.$message.error('输入数值不得大于之前数值')
          }
        } else {
          this.detailPopOptions.visible = false
        }
      },
      cancel: params => {
        this.detailPopOptions.visible = false
      },
      formDatas: {},
      formOptions: { size: 'small', popError: true },
      content: {
        _tableForm: {
          prop: 'tableForm',
          headerCellStyle: { 'background-color': '#F5F7FA', height: '44px' },
          className: 'pop-table',
          itemType: 'table-form',
          label: '',
          labelWidth: '0',
          dataSource: [],
          columns: detailColumns,
          tooltipEffect: 'dark'
        }
      }
    }
    return {
      searchData,
      formOtions: { inline: true, size: 'small' },
      // searchFormDatas: {},
      searchFormDatas: {},

      headerCellStyle: { 'background-color': '#F5F7FA', 'height': '44px' },
      checkedYarnList: [],

      // orderInformationColumns,
      // orderInformationDataSource: [],
      orderInformationDataSourceCopy: [],
      orderInformationData,
      orderInformationFormOtions: {
        popError: true,
        size: 'small',
        syncDataHandle: (syncData) => {
          console.log(syncData)
          this.newDrawnworkFormDatas = syncData
        }
      },
      newDrawnworkFormDatas: {},
      orderInformationFormDatas: {},
      // haveDrawnworkList: false,

      // isDetail: true,

      popOptions,
      popCurrentRow: null,
      popsearchFormDatas: {},
      readyDrawing: [], // 准备抽纱的数据

      // secondPopOptions,

      status: '',

      codeAndVersion: '', // 订单号和版本

      currentRowKey: '',

      detailPopOptions

    }
  },
  computed: {
    // 左侧菜单栏是否折叠
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    isDetail() {
      // debugger
      return this.$route.query.type === 'detail'
    }
  },
  watch: {
    $route: {
      async handler(v) {
        if (v.query.id) {
          this.codeAndVersion = v.query.id
        } else {
          this.codeAndVersion = ''
        }
        this.getYarnPlanInfo()
      },
      deep: true,
      immediate: true
    },
    isDetail: {
      handler(v) {
        console.log(v)
        const orderInformationData = [...this.orderInformationData._tableForm.dataSource]
        orderInformationData.forEach(item => {
          item.edit = !v
          item.lockNumEdit = !v
        })
        this.orderInformationData._tableForm.dataSource = orderInformationData
      },
      immediate: true
    }
  },
  created() {
    // this.getGrayYarnInfo()
  },
  methods: {
    yarnRowClick(row, column, event) {
      console.log(row, column, event)
    },
    // 重新抽纱
    againDrawnwork() {},
    // 弹出框关闭事件
    popsearchClose() {
      console.log(this.popCurrentRow)
      this.popsearchFormDatas = {}
      this.popCurrentRow = null
    },
    currentRowClassName({ row, rowIndex }) {
      // console.log(row, rowIndex)
      if (this.popCurrentRow && this.popCurrentRow.sortIndex === row.sortIndex) {
        return 'currentRowClassName'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .preparing-yarn-single-plans {
    padding: 20px;
    padding-bottom: 57px;

    .base-info {
      background-color: #fff;
      border-bottom: 1px solid #e9eff2;
      font-size: 16px;
      color: #151222;
      line-height: 22px;
      padding: 20px 0 20px 20px;
    }

    .pop-table {
      padding: 5px;
      background-color: #fff;
    }

    .no-order-information {
      font-size: 18px;
      color: #999999;
      padding: 0 20px 20px;
    }

    .order-information {
      background-color: #fff;
      margin-top: 16px;

      .title {
        padding: 20px;
        // border-bottom: 1px solid #EEEFF0;
        // margin: 20px;
        // display: flex;
        // justify-content: space-between;
        // align-items: center;

        // .order-information-title {
        //   flex: 1;
        // }
      }
    }

    .fixed-footer {
        width: calc(100% - 54px) !important;
    }
    .status-button-group {
      width: calc(100% - 210px);
      transition: width 0.28s;
      position: fixed;
      // left:auto;
      right: 0;
      display: block;
      text-align: center;
      bottom: 0px;
      padding: 10px 0px;
      background: #ffffff;
      border-top: 1px solid #ecf0f3;
      z-index: 999;
    }

    .have-order-information {
      padding: 0 20px 10px;
    }

    /deep/th.redStar {
      .cell::before {
        content: '*';
        color: #ff4949;
        margin-right: 4px;
      }
    }
    // /deep/td.redStar .cell {
    //   box-sizing: border-box;
    // }
  }
</style>
<style lang="scss">
  .preparing-yarn-single-plans {
    .drawingPop,.have-order-information {
      .el-form-item {
        margin-bottom: 0;
      }
    }

    .drawingPop {
      .el-table__body tr:hover > td {
        background: transparent;
      }
      .el-table__body tr.currentRowClassName td {
        background-color: transparent;
      }
      .el-table__body .currentRowClassName {
        background-color: #d8eafd!important;
      }
    }

    // .popFormOptionsClass {
    //   margin-top: 20px;
    // }

    .baseInfo {
      padding: 10px 0px 10px 20px;
      .custom-form .el-form .el-form-item {
        margin-right: 0;
        margin-bottom: 0px;
      }
      .el-form-item__content {
        color: #474747;
      }
      .el-form-item__label-wrap label {
        color: #888E9E;
      }
    }

    .detailPopOptions {
      .el-form-item {
            margin-bottom: 0;
      }
    }

  }
</style>
