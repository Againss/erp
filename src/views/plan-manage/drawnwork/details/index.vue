<template>
  <div class="drawnwork-details">
    <!-- 抽纱详情列表搜索 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" />
    </div>
    <!-- 列表 -->
    <div class="pop-table">
      <cs-custom-table
        ref="yarnTable"
        tooltip-effect="dark"
        :header-cell-style="headerCellStyle"
        max-height="280"
        :columns="columns"
        :data-source="dataSource"
        @selection-change="handleSelectionChange"
      />
    </div>
    <div class="drawnwork-list">
      <div class="title">
        <div class="drawnwork-list-title">已抽纱列表</div>
        <el-button v-if="isDetail && $permission(['aps-center:grayYarn:addRecord'])" size="small" @click="drawnworkEdit">编辑</el-button>
        <el-button v-if="isDetail && $permission(['aps-center:grayYarn:addRecord'])" size="small" type="primary" @click="drawnworkClick">抽纱</el-button>
        <el-button v-if="!isDetail" size="small" @click="drawnworkCancel">取消</el-button>
        <el-button v-if="!isDetail && $permission(['aps-center:grayYarn:addRecord'])" size="small" type="primary" @click="drawnworkSave">保存</el-button>
      </div>
      <!-- 列表 -->
      <div v-if="haveDrawnworkList" class="have-drawnwork-list">
        <cs-custom-form ref="drawnworkSearchForm" :data-source="drawnworkData" :options="drawnworkFormOtions" :form-datas="drawnworkFormDatas" />
        <!-- <cs-custom-table
          tooltip-effect="dark"
          :header-cell-style="headerCellStyle"
          max-height="450"
          :columns="drawnworkColumns"
          :table-scrollx="true"
          :data-source="drawnworkDataSource"
        /> -->
      </div>
      <div v-else class="no-drawnwork-list">还未进行抽纱，请选择库存进行原料划扣</div>
    </div>

    <!-- 底部按钮 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="status-button-group">
      <el-button v-if="$permission(['aps-center:grayYarn:confirmDone'])" type="primary" @click="finishDrawnwork">完成抽纱</el-button>
      <!-- <el-button v-if="reduceId" @click="againDrawnwork">重新抽纱</el-button> -->
    </div>

    <!-- 带搜索弹出框 -->
    <cs-custom-popsearch :options="popOptions" @close="popsearchClose" />
    <!-- 导入pop弹出层 -->
    <!-- <div class="pop">
      <cs-custom-pop ref="popForm" :options="secondPopOptions" />
    </div> -->
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
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 抽用数量正则校验
    // const numberReg = this.$getRules({ pattern: 'number', trigger: ['blur'] })
    const searchData = {
      '_yarnCode': {
        prop: 'yarnCode',
        itemType: 'input',
        label: '纱线编码',
        // itemStyle: { width: '25%' },
        placeholder: '请输入纱线编码'
      },
      '_yarnName': {
        prop: 'yarnName',
        itemType: 'input',
        label: '纱名',
        // itemStyle: { width: '25%' },
        placeholder: '请输入纱名'
      },
      '_yarnAttr': {
        prop: 'yarnAttr',
        itemType: 'input',
        // itemStyle: { width: '25%' },
        label: '纱属性',
        placeholder: '请输入纱属性'
      },
      '_orderNo': {
        prop: 'orderNo',
        itemType: 'input',
        label: '订单号',
        // itemStyle: { width: '25%' },
        placeholder: '请输入订单号'
      },
      '_operate': {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: async params => {
          console.log('查询', params)
          // this.purchaseRequirePage({ ...params, deliveryStartTime, deliveryEndTime })
          const flag = this.drawnworkDataSourceCopy.some(item => +item.status !== 1)
          // debugger
          if (flag) {
            const res = await this.$uiUtils.confirmMsg({ message: '有部分已抽纱列表未完成抽纱, 是否继续搜索', cancelMessage: '已取消' })
            if (res) {
              console.log('确认')
              this.searchFormDatas = params
              this.getGrayYarnInfo()
            } else {
              console.log('取消')
            }
          } else {
            this.searchFormDatas = params
            this.getGrayYarnInfo()
          }
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    const columns = {
      '_select': {
        prop: 'select',
        type: 'selection',
        width: '50'
      },
      // '_id': {
      //   prop: 'id',
      //   label: '序号',
      //   width: '60',
      //   formater: (scope) => {
      // return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
      //     return scope.$index + 1
      //   }
      // },
      '_orderNo': {
        prop: 'orderNo',
        label: '订单号',
        width: '156',
        showOverflowTooltip: true
      },
      '_orderType': {
        prop: 'orderType',
        label: '订单类型',
        width: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const obj = {
            // 1: '备纱单',
            // 2: '备坯单',
            1: '样板订单',
            2: '大货订单',
            3: '备坯单'
          }
          return obj[scope.row.orderType] || '-'
        }
      },
      '_clothType': {
        prop: 'clothType',
        label: '布类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      '_yarnCode': {
        prop: 'yarnCode',
        label: '坯纱编码',
        minWidth: '130',
        showOverflowTooltip: true
      },
      // '_colorYarnCode': {
      //   prop: 'colorYarnCode',
      //   label: '色纱编码',
      //   width: '80',
      //   showOverflowTooltip: true
      // },
      // '_delivery': {
      //   prop: 'delivery',
      //   label: '订单交期',
      //   minWidth: '80',
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return scope.row.delivery ? this.$filters.parseTime(scope.row.delivery, '{y}-{m}-{d}') : '-'
      //   }
      // },
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
      '_whetherDyed': {
        prop: 'whetherDyed',
        label: '是否染色',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const obj = {
            1: '是',
            0: '否'
          }
          return obj[scope.row.whetherDyed] || '-'
        }
      },
      '_yarnColor': {
        prop: 'yarnColor',
        label: '染纱颜色',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_yarnNum': {
        prop: 'yarnNum',
        label: '坯纱重量(KG)',
        align: 'right',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.yarnNum) ? (+scope.row.yarnNum).toFixed(2) : '-'
        }
      },
      // '_lockNum': {
      //   prop: 'lockNum',
      //   label: '抽纱重量(kg)',
      //   minWidth: '110',
      //   showOverflowTooltip: true
      // },
      '_needNum': {
        prop: 'needNum',
        label: '待抽重量(KG)',
        align: 'right',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.needNum) ? (+scope.row.needNum).toFixed(2) : '-'
        }
      },
      '_lockNum': {
        prop: 'lockNum',
        label: '抽纱重量(KG)',
        align: 'right',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.lockNum) ? (+scope.row.lockNum).toFixed(2) : '-'
        }
      },
      '_salesTeamName': {
        prop: 'salesTeamName',
        label: '销售团队',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_needClothNum': {
        prop: 'needClothNum',
        label: '需织坯量(KG)',
        align: 'right',
        minWidth: '110',
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.needClothNum) ? (+scope.row.needClothNum).toFixed(2) : '-'
        }
      },
      '_garmentPartName': {
        prop: 'garmentPartName',
        label: '成衣部位',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_dyeCraft': {
        prop: 'dyeCraft',
        label: '染整工艺',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const dyeCraft = scope.row.dyeCraft ? JSON.parse(scope.row.dyeCraft).join(',') : '-'
          // console.log(JSON.parse(scope.row.dyeCraft))
          return dyeCraft
        }
      },
      '_produceProcess': {
        prop: 'produceProcess',
        label: '生产流程',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_customerName': {
        prop: 'customerName',
        label: '客户',
        minWidth: '80',
        showOverflowTooltip: true
      }
      // '_yarnOrderNo': {
      //   prop: 'yarnOrderNo',
      //   label: '备纱单号',
      //   minWidth: '80',
      //   showOverflowTooltip: true
      // },
      // '_needNum': {
      //   prop: 'needNum',
      //   label: '需采购量(kg)',
      //   minWidth: '110',
      //   showOverflowTooltip: true
      // },
      // '_yarnOrderNum': {
      //   prop: 'yarnOrderNum',
      //   label: '备纱抽用量(kg)',
      //   minWidth: '130',
      //   showOverflowTooltip: true
      // },

    }
    // 已抽纱列表表头
    const drawnworkColumns = {
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
        minWidth: '156',
        showOverflowTooltip: true
      },
      '_yarnCode': {
        prop: 'yarnCode',
        label: '坯纱编码',
        minWidth: '130',
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
        label: '纱牌纱批',
        minWidth: '100',
        showOverflowTooltip: true
      },
      '_yarnOrderNo2': {
        prop: 'yarnOrderNo',
        label: '备纱单号',
        minWidth: '80',
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
      // '_sourceOrderNo': {
      //   prop: 'sourceOrderNo',
      //   label: '来源数据',
      //   minWidth: '80',
      //   showOverflowTooltip: true
      // },
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
      '_salesTeamName': {
        prop: 'salesTeamName',
        label: '销售团队',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_lastLockNum': {
        prop: 'lastLockNum',
        label: '本次抽用重量(KG)',
        align: 'right',
        minWidth: '150',
        isShow: scope => {
          return this.isDetail
        },
        showOverflowTooltip: true,
        formater: scope => {
          return !isNaN(scope.row.lastLockNum) ? (+scope.row.lastLockNum).toFixed(2) : '-'
        }
      },
      '_lockNum': {
        prop: 'lockNum',
        label: '本次抽用重量(KG)',
        // align: 'right',
        minWidth: '150',
        isShow: scope => {
          return !this.isDetail
        },
        showOverflowTooltip: true,
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          // maxlength: 200,
          placeholder: '请输入',
          rules: [numberReg, commonBlurReg]
        }
      },
      '_updatedBy': {
        prop: 'updatedBy',
        label: '操作人',
        minWidth: '70',
        isShow: scope => {
          return this.isDetail
        },
        showOverflowTooltip: true
      },
      '_updatedTime': {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '160',
        isShow: scope => {
          return this.isDetail
        },
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.updatedTime ? this.$filters.parseTime(scope.row.updatedTime, '{y}-{m}-{d} {h}:{i}:{s}') : '-'
        }
      }
    }

    const drawnworkData = {
      _tableForm: {
        prop: 'tableForm',
        headerCellStyle: { 'background-color': '#F5F7FA', height: '44px' },
        className: 'pop-table',
        itemType: 'table-form',
        label: '',
        labelWidth: '0',
        dataSource: [],
        columns: drawnworkColumns,
        tooltipEffect: 'dark'
      }
    }

    // 弹出框搜索内容配置
    const popContent = {
      '_yarnCode': {
        prop: 'yarnCode',
        itemType: 'input',
        label: '坯纱编码:',
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
      // '_yarnOrderNo': {
      //   prop: 'yarnOrderNo',
      //   itemType: 'input',
      //   label: '备纱单号:',
      //   itemStyle: { width: '33%' },
      //   placeholder: '支持多个条件,顿号隔开'
      // },
      // '_sourceOrderNo': {
      //   prop: 'sourceOrderNo',
      //   itemType: 'input',
      //   label: '来源单号:',
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
        minWidth: '130',
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
        minWidth: '80',
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
          // {
          //   name: '确认',
          //   handle: (formDatas, form, table) => {
          //     console.log(formDatas, form, table)
          //     if (!this.popCurrentRow) {
          //       this.$message({
          //         message: '请选择一条记录',
          //         type: 'warning'
          //       })
          //       return
          //     }
          //     const row = { ...this.popCurrentRow }
          //     this.popCurrentRow = null
          //     console.log(row, this.popCurrentRow)
          //     this.popOptions.visible = false
          //   }
          // },
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
                    type: '0'
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
    return {
      searchData,
      formOtions: { inline: true, size: 'small', layout: true },
      searchFormDatas: {},

      headerCellStyle: { 'background-color': '#F5F7FA', 'height': '44px' },
      columns,
      dataSource: [],
      checkedYarnList: [],

      // drawnworkColumns,
      // drawnworkDataSource: [],
      drawnworkDataSourceCopy: [],
      drawnworkData,
      drawnworkFormOtions: {
        popError: true,
        size: 'small',
        syncDataHandle: (syncData) => {
          console.log(syncData)
          this.newDrawnworkFormDatas = syncData
        }
      },
      newDrawnworkFormDatas: {},
      drawnworkFormDatas: {},
      haveDrawnworkList: false,

      isDetail: true,

      popOptions,
      popCurrentRow: null,
      popsearchFormDatas: {},
      readyDrawing: [], // 准备抽纱的数据

      // secondPopOptions,

      reduceId: null, // 查看的id

      currentRowKey: ''

    }
  },
  computed: {
    // 左侧菜单栏是否折叠
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  watch: {
    $route: {
      async handler(v) {
        if (v.query.id) {
          this.reduceId = v.query.id
        } else {
          this.reduceId = null
        }
        this.getGrayYarnInfo()
      },
      deep: true,
      immediate: true
    },
    isDetail: {
      handler(v) {
        console.log(v)
        this.drawnworkDataSourceCopy && this.drawnworkDataSourceCopy.forEach(item => {
          if (+item.status === 1) {
            item.edit = !v
            item.lockNumEdit = !v
          }
        })
        const drawnworkFormDatas = this.$utils.deepClone(this.drawnworkFormDatas.tableForm)
        drawnworkFormDatas.forEach(item => {
          if (+item.status !== 1) {
            item.edit = !v
            item.lockNum = item.lastLockNum
            item.lockNumEdit = !v
          }
        })
        this.drawnworkFormDatas = { tableForm: drawnworkFormDatas }
        // this.drawnworkFormDatas.tableForm.forEach(item => {
        //   if (+item.status !== 1) {
        //     item.edit = !v
        //     item.lockNum = item.lastLockNum
        //     item.lockNumEdit = !v
        //   }
        // })
      }
    }
  },
  created() {
    // this.getGrayYarnInfo()
  },
  methods: {
    yarnRowClick(row, column, event) {
      console.log(row, column, event)
    },
    // 多选事件
    handleSelectionChange(val) {
      console.log(val)
      if (val && val.length) {
        this.checkedYarnList = val
      } else {
        this.checkedYarnList = []
      }
      const ids = val.length ? val.map(item => +item.id) : []
      const checkedYarnList = this.drawnworkDataSourceCopy.filter(item => ids.includes(+item.id))
      this.haveDrawnworkList = checkedYarnList.length > 0
      this.$nextTick(() => {
        this.drawnworkFormDatas = { tableForm: checkedYarnList }
      })

      // console.log(this.drawnworkFormDatas.tableForm && this.drawnworkFormDatas.tableForm.length)
      console.log(ids, checkedYarnList, this.drawnworkDataSourceCopy)
    },

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
  .drawnwork-details {
    padding: 20px;
    padding-bottom: 57px;

    .pop-table {
      padding: 5px;
      background-color: #fff;
    }

    .no-drawnwork-list {
      font-size: 18px;
      color: #999999;
      padding: 0 20px 20px;
    }

    .drawnwork-list {
      background-color: #fff;
      margin-top: 20px;

      .title {
        padding: 10px 20px 10px;
        border-bottom: 1px solid #EEEFF0;
        margin-bottom: 20px;
        display: flex;
        // justify-content: space-between;
        align-items: center;

        .drawnwork-list-title {
          flex: 1;
        }
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

    .have-drawnwork-list {
      padding: 0 20px 10px;
    }
  }
</style>
<style lang="scss">
  .drawnwork-details {
    .drawingPop,.have-drawnwork-list {
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

  }
</style>
