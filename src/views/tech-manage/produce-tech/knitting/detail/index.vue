<template>
  <div class="guest-sample knitting-wrap" :class="isEdit === 'detail' ? 'rules-disable' : ''" style="height: calc(100vh - 90px);">
    <!-- 头部状态 -->
    <div class="status-info">
      <div class="info-code" @click="clickOrderNo(orderInfo.orderId)">订单号：<span style="color: #0986FF;">{{ orderInfo.orderNo ? orderInfo.orderNo : '-' }}</span></div>
      <div class="info-detail">
        <!-- 状态：W-待处理，P-待提交，A-待审核，Y-已审核，B-已驳回 -->
        <template v-if="techerName">
          <span>工艺员：{{ techerName }}</span>
          <span>{{ updatedTime }}</span>
        </template>
        <template v-if="approverName">
          <span>审核人：{{ approverName }}</span>
          <span>{{ approveTime }}</span>
        </template>
        <!-- 状态 -->
        <span v-if="activeName==='1'" :style="{ 'color': setStatusColor(orderInfo.status) }">{{ orderInfo.status | getStatus }}</span>
        <span v-if="activeName==='2'" :style="{ 'color': setStatusColor(orderInfo.dyeStatus) }">{{ orderInfo.dyeStatus | getStatus }}</span>
        <!-- 状态流转 按钮 -->
        <el-button v-if="submit_isShow" style="margin-left: 20px" size="small" type="primary" @click="statusSubmit()">提交</el-button>
        <el-button v-if="audit_isShow" style="margin-left: 20px" size="small" type="primary" @click="ToExamine()">审核</el-button>
        <el-button v-if="withdraw_isShow" style="margin-left: 20px" size="small" @click="withdrawClick()">撤回</el-button>
      </div>

    </div>
    <div class="top-info-box">
      <el-tabs v-model="activeName" style="" @tab-click="handleClick">
        <el-tab-pane label="织造工艺" name="1" />
        <el-tab-pane v-if="orderInfo.orderType!=='R'" label="染整工艺" name="2" />
      </el-tabs>

      <div class="top-info-wrap">
        <div class="top-info-item">
          <span class="label">订单类型：</span>
          <span class="text">{{ orderType[orderInfo.orderType] }}</span>
        </div>
        <div v-if="orderInfo.orderType==='C'" class="top-info-item">
          <span class="label">来源单号：</span>
          <span class="text">{{ orderInfo.reissueSourceCode }}</span>
        </div>
        <div class="top-info-item">
          <span class="label">销售团队：</span>
          <span class="text">{{ orderInfo.salesTeamName||'' }}</span>
        </div>
        <div class="top-info-item">
          <span class="label">客服：</span>
          <span class="text">{{ orderInfo.customerServiceName||'' }}</span>
        </div>
        <el-button
          v-if="getOrderType && $permission(['techManage:tmKnitTech:tmKnitTechDetail:batchModify'])"
          style="margin-left: auto;"
          size="small"
          type="primary"
          :disabled="multipleSelection.length>1?false:true"
          @click="batchModify('edit','all')"
        >批量编辑</el-button>
      </div>
    </div>

    <div class="main-wrap">
      <div v-if="showRight" class="close-right" @click="closeRight">
        <i class="el-icon-arrow-right" />
      </div>
      <div class="left-list knitting-left-list" :class="showRight?'knitting-left':''">
        <!-- 织造工艺 -->
        <div v-show="activeName==='1'" class="page-table" style="padding: 0;">
          <cs-custom-table
            tooltip-effect="dark"
            :cell-style="{background:'#fff'}"
            :highlight-current-row="true"
            :selection="selection"
            :header-cell-style="headerCellStyle"
            :columns="columns"
            :data-source="dataSource"
            :operates="popOperates"
            edit-type="pop"
            :row-key="(row)=>row.id"
            :current-row-key="currentId"
            @selection-change="handleSelectionChange"
            @row-click="rowclick"
          />
        </div>
        <!-- 染整工艺 -->
        <div v-show="activeName==='2'" class="page-table" style="padding: 0;">
          <cs-custom-table
            tooltip-effect="dark"
            :cell-style="{background:'#fff'}"
            :highlight-current-row="true"
            :selection="selection"
            :header-cell-style="headerCellStyle"
            :columns="columnsRan"
            :data-source="dataSource1"
            :operates="popOperates"
            edit-type="pop"
            :row-key="(row)=>row.id"
            :current-row-key="currentId"
            @selection-change="handleSelectionChange"
            @row-click="rowclick"
          />
        </div>
        <div
          v-if="isEdit==='edit'"
          :style="{height: 55+(dataSource.length*50-12)+'px'}"
          class="left-mask"
          @click="rowclick"
        />
      </div>
      <div class="right-detail-box" :class="showRight?'isShowRight':''">
        <div>
          <!-- 织造工艺 -->
          <div v-show="activeName==='1'" class="zhizao">
            <!-- 基本信息 -->
            <a-info
              ref="info"
              :order-type="orderInfo.orderType"
              :is-edit="isEdit"
              :order-detail-id="orderDetailId"
              :list-data="aInfoData"
              :data="detailObj"
              @radioClick="radioClick"
            />
            <!-- 分析结果 产品信息 -->
            <a-product ref="product" :order-type="orderInfo.orderType" :is-edit="isEdit" @getDetail="getDetailFun" @showRequire="showRequire" />
            <!-- 原料要求 -->
            <a-require
              ref="require"
              :is-edit="isEdit"
              :knit-mode-type="knitModeType"
              :natural-datas="detailObj.tmKnitMaterialInfoInfoResp ? detailObj.tmKnitMaterialInfoInfoResp.naturalFibers : []"
              :chemical-datas="detailObj.tmKnitMaterialInfoInfoResp ? detailObj.tmKnitMaterialInfoInfoResp.chemicalFibers : []"
              :compose-data="detailObj.tmKnitMaterialInfoInfoResp ? detailObj.tmKnitMaterialInfoInfoResp.composeYarns : []"
              :design-datas="detailObj.tmKnitMaterialInfoInfoResp ? detailObj.tmKnitMaterialInfoInfoResp.tmKnitIntervalDesignInfoRespList : null"
              :raw-material-datas="detailObj.tmKnitMaterialInfoInfoResp ? detailObj.tmKnitMaterialInfoInfoResp.tmKnitDyeInfoInfoResponseList : null"
              :stripe-spacing-datas="detailObj.tmKnitMaterialInfoInfoResp ? detailObj.tmKnitMaterialInfoInfoResp.tmKnitStripeSpacingInfoRespList : null"
            />
            <!-- 用料实测 -->
            <!-- <materials-stripe ref="materialsStripe" :is-edit="isEdit" :data-sources="detailObj.materialMeasurements || []" /> -->
            <!-- 上机工艺 -->
            <computer-technology ref="computerTechnology" :is-edit="isEdit" />
            <!-- 备注、意见 -->
            <remark-option ref="remarkOption" :is-edit="isEdit" />
            <!-- 评审、驳回弹出层 -->
            <div class="pop">
              <cs-custom-pop :options="popOptions" />
            </div>

          </div>

          <!-- 染整工艺 -->
          <div v-show="activeName==='2'" class="dyeing-technology" :class="isEdit === 'detail' ? 'dyeing-disable' : ''">
            <!-- <div class="title-text">{{ isEdit==='detail'?'查看染整工艺':'编辑染整工艺' }}</div> -->
            <div class="dyeing-product" style="margin-bottom: 50px;">
              <cs-custom-form
                ref="dyeingProduct"
                :data-source="dyeingProduct"
                :options="formOtions"
                :form-datas="ranDetail"
              />
            </div>
          </div>
        </div>
        <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
          <div v-if="isEdit==='edit'">
            <el-button type="primary" @click="bindSave(1)">保存</el-button>
            <el-button @click="cancelEdit">取消</el-button>
          </div>
          <div v-else>
            <el-button v-if="getOrderType && $permission(['techManage:tmKnitTech:tmKnitTechDetail:modify'])" type="primary" @click="editClick">编辑</el-button>
            <el-button @click="backListClick">返回</el-button>
          </div>
        </div>

      </div>
    </div>
    <approve
      v-if="config.visible"
      :config="config"
      @close="config.visible = false"
    />
  </div>
</template>

<script>
import approve from '@/components/approve/index'
import aProduct from './components/a-product'
import aInfo from './components/a-info'
import aRequire from './components/a-require'
// import materialsStripe from './components/materials-stripe'
import computerTechnology from './components/computer-technology'
import remarkOption from './components/remark-option'
// import { tmKnitTechPage, tmDyeTechDetail, getRanDetail, tmWeavingTechList, getDetail, detailModify, detailRanModify, ranBatchModify, atchBatchModify, statusWithdraw, statusApprove, statusReject, getClothClassDetail, getKnitDyeDetail, statusSubmit, tmKnitTechInfo, newTechKnitMangerAuditFallBack } from './api/index.js' // printPreview detailSubmit, saveSubmit,
import * as api from './api/index.js'
import { deepClone } from '@/utils'
import { isArray } from '@/utils/validate'
import logMethods from '@/views/product-center/mixin/log-methods'
import { dyeingTechnology } from './mixins/dyeingTechnology.js'

export default {
  name: 'AnalyseDetail',
  filters: {
    getStatus(val) {
      switch (val) {
        case 'W':
          return '待处理'
        case 'P':
          return `待提交`
        case 'A':
          return `待审核`
        case 'Y':
          return `已审核`
        case 'B':
          return `已驳回`
        default:
          return ''
      }
    }

  },
  components: {
    aProduct,
    aInfo,
    aRequire,
    // materialsStripe,
    computerTechnology,
    remarkOption,
    approve
  },
  mixins: [logMethods, dyeingTechnology],
  data() {
    const commonChangeReg = this.$getRules({})
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '0~999.99', trigger: ['blur'] })
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    const selection = {
      selection: true,
      selectionLabel: '全部'
    }
    // 表格表头的配置信息 织造工艺
    const columns = [
      {
        prop: 'seq',
        label: '序号',
        width: '56'
        // formater: scope => scope.$index + 1
      },
      {
        prop: 'knitNo',
        label: '坯布编码',
        width: '150',
        showOverflowTooltip: true,
        style: {
          // color: '#1890ff',
          cursor: 'pointer'
        }

      },
      {
        prop: 'clothName',
        label: '布类',
        width: '180',
        sortable: true,
        showOverflowTooltip: true
      },
      {
        prop: 'suggestWidth',
        label: '成品规格',
        width: '140',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.suggestWidth || scope.row.weightBefore) {
            return scope.row.suggestWidth + scope.row.suggestWidthUnit + '-' + scope.row.weightBefore + scope.row.weightBeforeUnit
          }
        }
      },
      {
        prop: 'yarnFineness',
        label: '纱支/细度',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => this.assemblyData(scope.row[scope.column.property])

      },
      {
        prop: 'elementRatio',
        label: '成份/比例',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => this.assemblyData(scope.row[scope.column.property])
      },
      {
        prop: 'yarnRatio',
        label: '纱比',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => this.assemblyData(scope.row[scope.column.property], '%')
      },
      {
        prop: 'spinningMethods',
        label: '纺纱方法',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => this.assemblyData(scope.row[scope.column.property])
      },
      {
        prop: 'machineYarnLength',
        label: '上机纱长',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => this.assemblyData(scope.row[scope.column.property])
      },
      {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: '150',
        showOverflowTooltip: true,
        isShow: (scope) => {
          if (this.orderInfo.orderType === 'R') {
            return false
          } else {
            return true
          }
        }
      },
      {
        prop: 'colorLevel',
        label: '色级',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => {
          const color = {
            '1': '深',
            '2': '中',
            '3': '浅',
            '4': '白'
          }
          return color[scope.row.colorLevel]
        }
      },
      {
        prop: 'stitchNum',
        label: '针寸数',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => scope.row.stitchNum && scope.row.inch ? scope.row.stitchNum + 'G' + '-' + scope.row.inch + '"' : ''
      },
      {
        prop: 'totalStitchNum',
        label: '总针数',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '工艺状态',
        minWidth: '150',
        sortable: true,
        fixed: 'right',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.status === 'N') {
            return `<span style="color:#FF9214">待处理</span>`
          } else {
            return `<span style="color:#00BCC5">已处理</span>`
          }
        }
      }
    ]
    const columnsRan = [
      {
        prop: 'seq',
        label: '序号',
        width: '56'
        // formater: scope => scope.$index + 1
      },
      {
        prop: 'knitNo',
        label: '成品编码',
        width: '180',
        showOverflowTooltip: true,
        style: {
          // color: '#1890ff',
          cursor: 'pointer'
        },
        formater: scope => {
          return scope.row.flowerNo || scope.row.colorNo
        }
        // handle: (scope) => {
        //   this.orderDetailId = scope.row.id
        //   this.batchModify('detail')
        // }
      },
      {
        prop: 'clothName',
        label: '布类',
        width: '180',
        sortable: true,
        showOverflowTooltip: true
      },
      {
        prop: 'suggestWidth',
        label: '成品规格',
        width: '140',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.suggestWidth || scope.row.weightBefore) {
            return scope.row.suggestWidth + scope.row.suggestWidthUnit + '-' + scope.row.weightBefore + scope.row.weightBeforeUnit
          }
        }

      },
      {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => this.assemblyData(scope.row[scope.column.property])

      },
      {
        prop: 'elementRatio',
        label: '成份比例',
        minWidth: '150',
        showOverflowTooltip: true,
        // formater: scope => this.assemblyData(scope.row[scope.column.property])
        formater: scope => {
          const vaule = scope.row.elementRatio
          let elementName = ''
          let ratio = ''
          if (vaule && vaule.indexOf('[') !== -1) {
            const arr = JSON.parse(vaule)
            arr.forEach((v, i) => {
              elementName += `${v.elementName}/`
              ratio += `${v.ratio}/`
            })
            elementName = elementName.substring(0, elementName.length - 1)
            ratio = ratio.substring(0, ratio.length - 1)
          } else {
            elementName = ''
            ratio = ''
          }
          return `<div>${elementName} ${ratio}</div>`
        }
      },
      {
        prop: 'customerColor',
        label: '客户颜色',
        minWidth: '150',
        showOverflowTooltip: true
      },
      {
        prop: 'dyeCraftList',
        label: '染整工艺',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => this.assemblyData(scope.row[scope.column.property])
      },
      {
        prop: 'printCraftList',
        label: '印花工艺',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => this.assemblyData(scope.row[scope.column.property])
      },
      {
        prop: 'dyeStatus',
        label: '工艺状态',
        minWidth: '150',
        sortable: true,
        fixed: 'right',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.dyeStatus === 'N') {
            return `<span style="color:#FF9214">待处理</span>`
          } else if (scope.row.dyeStatus === 'Y') {
            return `<span style="color:#00BCC5">已处理</span>`
          } else {
            return ''
          }
        }
      }
    ]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['techManage:tmKnitTech:tmKnitTechDetail:modify'],
        isShow: scope => {
          return this.getOrderType
        },
        handle: scope => {
          event.stopPropagation()
          this.type = 'edit'
          this.orderDetailId = scope.row.id
          this.currentId = scope.row.id
          this.batchModify('edit')
        }
      },
      {
        label: '查看',
        isShow: true,
        permitTag: ['techManage:tmKnitTech:tmKnitTechDetail:info'],
        handle: scope => {
          this.orderDetailId = scope.row.id
          this.currentId = scope.row.id
          this.batchModify('detail')
          event.stopPropagation()
        }
      }]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    const content = [
      {
        prop: 'reviewOpinion',
        itemType: 'input',
        type: 'textarea',
        label: '审核意见',
        maxlength: 100,
        trim: (value) => {
          return value
        },
        rules: [commonBlurReg, { min: 1, max: 100, message: '长度在1 到100 个字符', trigger: 'blur' }]
      }
    ]
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '审核意见',
      okText: '保存',
      ok: params => {
        if (this.optionStatus === 'approve') {
          this.approveSampleAnalysis(params.reviewOpinion)
        } else if (this.optionStatus === 'reject') {
          this.rejectSampleAnalysis(params.reviewOpinion)
        }
      },
      cancel: (params) => {
        this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      },
      formDatas: {},
      formOptions: {},
      content: content
    }
    return {
      max999Reg,
      commonChangeReg,
      formOtions: {
        inline: true,
        labelWidth: '200px',
        syncDataHandle: (syncData) => {
          // console.log(syncData)
          // this.syncMoudleDataHandle('productData', syncData)
        }
      },
      activeName: '1',
      id: '',
      orderDetailId: '', // 单条编辑
      sampleAnalysisResultId: '',
      techId: '',
      popOptions,
      content,
      computerTechnologyValid: false,
      isEdit: 'detail',
      orderInfo: {},
      detailObj: {},
      detailObjCopy: {},
      stitchMap: [],
      infoData: {},
      triangleMap: {
        'plateTop': new Array(2).fill(new Array(30).fill('')),
        'plateBottom': new Array(4).fill(new Array(30).fill('')),
        'yarnRow': new Array(1).fill(new Array(30).fill('')),
        'cycles': new Array(1).fill(new Array(30).fill(''))
        // 'cycles': new Array(1).fill(new Array(30).fill({ key: '', value: '' }))
      },
      pinTableList: new Array(30).fill(''),
      triangleTableList: new Array(30).fill(''),
      pinTopList: new Array(30).fill(''),
      pinBottomList: new Array(30).fill(''),
      popOperates,
      columns,
      columnsRan,
      dataSource: [],
      dataSource1: [],
      headerCellStyle,
      isShowRight: false,
      showRightDyeing: false,
      selection,
      multipleSelection: [], // 当前选中的数据
      aInfoData: [],
      orderType: {
        'B': '大货',
        'S': '样板',
        'R': '备坯',
        'C': '补布'
      },
      status: {
        'W': '待处理',
        'P': '提交',
        'A': '审核',
        'Y': '已审核',
        'B': '已驳回'
      },
      isBatch: false, // 是否批量修改
      sorts: ['approveTime', 'updatedTime'], // 自定义表格内排序
      knitModeType: 0, // 是否是电脑提花
      detailQuote: {}, // 存放引用工艺数据
      currentId: '',
      dyeingFormDatas: {}, // 染整工艺产品信息
      quoteTechnology: false,
      config: { // 审核流程
        visible: false,
        workflowId: '',
        procInstId: '',
        pass: (res) => {
          // 回调成功刷新列表和info
          console.log(res)
          this.getTmKnitTechInfo()
        },
        refuse: (res) => {
          console.log(res)
          this.getTmKnitTechInfo()
          // this.GoBackOrder()
        },
        back: (res) => {
          this.getTmKnitTechInfo()
          console.log(res)
          // this.GoBackOrder()
        }
      },
      ranDetail: {}, // 染整详情
      ranDetailCopy: {}// 染整详情
    }
  },
  computed: {

    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    showRight() {
      return this.isShowRight
    },
    getOrderType() {
      if (this.activeName === '1' && ['W', 'P', 'B'].includes(this.orderInfo.status)) {
        return true
      } else if (this.activeName === '2' && ['W', 'P', 'B'].includes(this.orderInfo.dyeStatus)) {
        return true
      } else {
        return false
      }
    },
    showProp() {
      return this.orderInfo.orderType !== 'R'
    },
    submit_isShow() { // 提交
      if (this.activeName === '1') {
        return this.isEdit === 'detail' && ['P', 'B'].includes(this.orderInfo.status)
      } else if (this.activeName === '2') {
        return this.isEdit === 'detail' && ['P', 'B'].includes(this.orderInfo.dyeStatus)
      }
      return false
    },
    withdraw_isShow() {
      if (this.activeName === '1') {
        return this.isEdit === 'detail' && ['A'].includes(this.orderInfo.status)
      } else if (this.activeName === '2') {
        return this.isEdit === 'detail' && ['A'].includes(this.orderInfo.dyeStatus)
      }
      return false// 撤回
    },
    audit_isShow() { // 审核
      if (this.activeName === '1') {
        return this.isEdit === 'detail' && ['A'].includes(this.orderInfo.status)
      } else if (this.activeName === '2') {
        return this.isEdit === 'detail' && ['A'].includes(this.orderInfo.dyeStatus)
      }
      return false
    },
    // 工艺员
    techerName() {
      if (this.activeName === '1') {
        return this.orderDetailId.status !== 'W' ? this.orderInfo.techerName : ''
      } else if (this.activeName === '2') {
        return this.orderDetailId.dyeStatus !== 'W' ? this.orderInfo.dyeTecherName : ''
      }
      return ''
    },
    // 更新时间
    updatedTime() {
      if (this.activeName === '1' && this.orderInfo && this.orderInfo.knitOperateTime) {
        return this.$filters.parseTime(this.orderInfo.knitOperateTime)
      } else if (this.activeName === '2' && this.orderInfo && this.orderInfo.knitOperateTime) {
        return this.$filters.parseTime(this.orderInfo.knitOperateTime)
      }
      return ''
    },
    // 审核人
    approverName() {
      if (this.activeName === '1' && this.orderInfo.status === 'Y') {
        return this.orderInfo.approverName
      } else if (this.activeName === '2' && this.orderInfo.dyeStatus === 'Y') {
        return this.orderInfo.dyeApproverName
      }
      return ''
    },
    // 审核时间
    approveTime() {
      if (this.activeName === '1' && this.orderInfo && this.orderInfo.knitApproveTime) {
        return this.$filters.parseTime(this.orderInfo.knitApproveTime)
      } else if (this.activeName === '2' && this.orderInfo && this.orderInfo.dyeApproverTime) {
        return this.$filters.parseTime(this.orderInfo.dyeApproverTime)
      }
      return ''
    }

  },
  async mounted() {
    this.stitchMap.push(this.pinTopList, this.pinBottomList)

    this.getTmWeavingTechList()// 获取工艺板块下拉数据
    this.getTmKnitTechInfo()// 获取工艺信息

    if (this.$refs.product) {
      await this.$refs.product.getData()
    }
    if (this.$refs.require) {
      await this.$refs.require.getData()
    }
  },
  methods: {
    showRequire() {
      this.$refs.require.showDyeing()
    },
    // 订单审核
    async ToExamine() {
      this.config.workflowId = this.orderInfo.uuid // 订单id
      this.config.visible = true
    },
    // tab 切换
    handleClick(e) {
      if (this.techId) {
        if (e.name === '1') {
          this.config.procInstId = this.orderInfo.knitProcInstId// 默认织造实例id
          // 织造
          this.getDetailPage()
        } else {
          // 染整
          this.config.procInstId = this.orderInfo.dyeProcInstId// 默认织造实例id
          this.getRDetailPage()
        }
      }
      this.closeRight()
    },
    // 点击提交操作
    statusSubmit(status) {
      if (this.isEdit === 'edit') {
        return this.$message.warning('处于编辑状态不能操作')
      } else {
        this.$confirm('确认要提交吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.statusSubmitHandle()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 撤回
    async withdrawClick() {
      await api.statusWithdraw({ type: this.activeName, id: this.$route.params.id || '' })
      this.$message.success('已撤回')
      this.getTmKnitTechInfo()
    },
    // 提交申请
    async statusSubmitHandle(type) {
      await api.statusSubmit({ type: this.activeName, id: this.$route.params.id || '' })
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.fetchLog(
        this.getLogMessages('UPDATE', '/techManage/tmKnitTech/info', 'techManage'),
        { id: this.activeName === '1' ? this.detailObj.id : this.ranDetailCopy.id },
        JSON.stringify({
          beforeText: `在'工艺管理-针织工艺详情'提交一条记录`,
          beforeCode: { id: this.detailObj.id }
        })
      )
      this.getTmKnitTechInfo()
    },
    // 点击订单编号查看订单
    clickOrderNo(orderId) {
      const obj = {
        'S': `/customer-order/sample-orders/detail/${orderId}/show`, // 样板
        'B': `/customer-order/goods-orders/detail/${orderId}/show`, // 大货
        'C': `/customer-order/patching-orders/detail/${orderId}/show`, // 补布
        'R': `/customer-order/preform-preparation-orders/${orderId}`// 备坯
      }
      this.$router.push(obj[this.orderInfo.orderType])
    },
    // 点击整行查看详情信息
    rowclick(scope) {
      if (this.isEdit === 'edit') {
        return this.$message.warning('处于编辑状态不能切换')
      } else {
        if (scope) {
          this.orderDetailId = scope.id
          this.batchModify('detail')
        }
      }
    },
    // 染整工艺点击行
    ranRowclick(scope) {
      this.showRightDyeing = false
    },
    // 多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 关闭右测编辑框
    closeRight() {
      this.isShowRight = false
      this.isEdit = 'detail'
      // this.$set(this.popOperates, 'fixed', 'right')
      this.popOperates.fixed = 'right'
      this.$set(this.columns[13], 'fixed', 'right')
      this.$set(this.columnsRan[9], 'fixed', 'right')
    },

    // 批量编辑
    async batchModify(type, all) {
      // 点击编辑查询工艺状态
      if (this.activeName === '2' && type === 'edit') {
        const res = (await api.tmKnitTechInfo({ id: this.$route.params.id })).data || {}
        if (res.status !== 'Y') {
          return this.$message.warning('请先审核织造工艺才可编辑')
        }
      }
      this.isBatch = false
      if (all) {
        this.isBatch = true
        if (this.multipleSelection.length < 2) {
          return this.$message.warning('请选择一条以上的数据')
        }
        if (this.multipleSelection.length === 0) {
          return this.$message.warning('请选择要编辑的数据')
        }
        // 批量编辑条件【布类、纱支/细度相同】，如果勾选不符合条件点击了批量编辑提示【批量编辑必须布类、纱支/细度相同】
        const ch = this.multipleSelection
        for (let i = 0; i < ch.length; i++) {
          if (ch[i].clothYarnFinenessHash) {
            if (ch[0].clothYarnFinenessHash !== ch[i].clothYarnFinenessHash) {
              return this.$message.warning('批量编辑必须布类、纱支/细度（比例）、成份相同')
            }
          }
        }

        this.activeName === '1' ? this.getDetailFun(this.multipleSelection[0].id) : this.getRanDetailFun(this.multipleSelection[0].id)
        this.orderDetailId = this.multipleSelection[0].id
      } else {
        this.activeName === '1' ? this.getDetailFun(this.orderDetailId) : this.getRanDetailFun(this.orderDetailId)
      }
      this.isShowRight = true
      this.$set(this.popOperates, 'fixed', 'none')
      this.$set(this.columns[13], 'fixed', 'none')
      this.$set(this.columnsRan[9], 'fixed', 'none')
      delete this.popOperates.fixed // true
      delete this.columns[13].fixed // true
      delete this.columnsRan[9].fixed // true

      this.isEdit = type
      if (type === 'edit') {
        this.editClick()
      }
    },
    // 点击引用工艺选择 调用info接口复盖当前数据
    radioClick(id) {
      if (id) {
        this.quoteTechnology = true
        this.detailQuote = { ...this.detailObjCopy }
        this.getDetailFun(id)
      }
    },
    // 表格数据字段重组
    assemblyData(scope, unit) {
      if (!scope) return ''
      let str = ''
      if (scope && scope.length > 0 && Array.isArray(scope)) {
        scope.forEach((v, i) => {
          // str += `<p style="margin: 0;">${v}${unit || ''}</p>`
          str += `${v}${unit || ''};`
        })
        str = str.substring(0, str.length - 1)
      } else {
        str = Array.isArray(scope) ? '' : scope
      }

      return str
    },
    // 获取织造工艺 分录列表
    async getDetailPage() {
      this.dataSource = (await api.tmKnitTechPage({ techId: this.techId })).data || {}
    },
    // 获取染整工艺 分录列表
    async getRDetailPage() {
      this.dataSource1 = (await api.tmDyeTechDetail({ techId: this.techId })).data || {}
      this.getProcessFlowData()
    },

    // 获取下拉
    async getTmWeavingTechList() {
      const res = (await api.tmWeavingTechList({ techId: this.techId })).data || {}
      const dataSource = this.$refs.computerTechnology.infoDataSource
      const dataObj = {
        'C': [],
        'K': [],
        'R': [],
        'P': []
      }
      res.forEach((v, index) => {
        dataObj[v.type].push({ value: v.id + '', label: v.name })
      })
      this.$set(dataSource._typeInfo, 'dataSource', dataObj['C'])
      this.$set(dataSource._packageWayInfo, 'dataSource', dataObj['P'])
      this.$set(dataSource._loomTypeInfo, 'dataSource', dataObj['K'])
      this.$set(dataSource._loomTurnInfo, 'dataSource', dataObj['R'])
    },
    async getTmKnitTechInfo() {
      this.orderInfo = (await api.tmKnitTechInfo({ id: this.$route.params.id })).data || {}
      this.config.procInstId = this.orderInfo.knitProcInstId// 默认织造实例id
      this.techId = this.orderInfo && this.orderInfo.id
      if (this.activeName === '1') {
        this.getDetailPage()
      } else {
        this.getRDetailPage()
      }
    },
    // 判断当前布类是否中电脑提花 获取布类下拉
    async getClothsTypeInfo(obj) {
      this.knitModeType = 0
      if (obj && obj.label) {
        // 布类详情
        const res = (await api.getClothClassDetail({ uuid: obj.value })).data || {}
        if (res && res.knitDye) {
          // debugger
          const res1 = (await api.getKnitDyeDetail({ id: res.knitDye.id })).data || {}
          if (res1 && res1.knitMode && res1.knitMode.name === '电脑提花') {
            this.knitModeType = 1
          } else {
            this.knitModeType = 0
          }
        }
      }
    },
    // 通过 智布色号取色级
    async getColorManageList(data = { 'sWhere': { 'eq': ['code'] }, 'code': 'FM21DD0001' }) {
      const res = await api.getColorManageList(data)
      console.log(res)
    },
    // 染整工艺详情
    async getRanDetailFun(id, type = 'edit') {
      let data = (await api.getRanDetail({ id: id })).data || {}
      this.ranDetailCopy = deepClone(data)
      const objKey = ['clothsTypeInfo', 'garmentPartInfo', 'weightBeforeRangeInfo', 'weightAfterRangeInfo', 'suggestWidthRangeInfo'] // 处理下不可编辑数据
      const keyProp = ['flowCode', 'dyeType', 'dyeStyle', 'dyeHandfeel', 'selvage', 'design', 'softMethod', 'dyeCraftCombination']
      // 处理染整工艺和工序流程下拉回显数据
      data = { ...data, ...data.tmDyeProcessFlowInfoResp, ...data.tmDyeCraftInfoResp }
      for (const key in data) {
        if (objKey.includes(key)) {
          data[key] = data[key].label || ''
        }
        // 印花工艺
        if (key === 'printCraft' && data[key] && data[key].indexOf('[') !== -1) {
          const printCraft = JSON.parse(data[key])
          let printStr = ''
          for (let i = 0; i < printCraft.length; i++) {
            printStr += printCraft[i].label + '；'
          }
          printStr = printStr.substring(0, printStr.length - 1)
          data[key] = printStr
        }
        // 染整工艺 dyeCraft
        if (key === 'dyeCraft' && data[key] && data[key].indexOf('[') !== -1) {
          const dyeCraft = JSON.parse(data[key])
          let dyeCraftStr = ''
          if (dyeCraft && dyeCraft.length > 0) {
            dyeCraft.forEach(v => {
              dyeCraftStr += v.parent && v.parent.name ? v.parent.name + '-' + v.name + ',' : v.name + ','
            })
            dyeCraftStr = dyeCraftStr.substr(0, dyeCraftStr.length - 1)
          } else {
            // dyeCraftStr = this.detailObj.dyeCraft || ''
          }
          data[key] = dyeCraftStr
        }
        // 处理纱名
        if (key === 'yarnName' && data[key].length > 0 && Array.isArray(data[key])) {
          let yarnNameStr = ''
          const yarnArr = data[key]
          yarnArr.forEach(v => {
            yarnNameStr += v + '；'
          })
          yarnNameStr = yarnNameStr.substring(0, yarnNameStr.length - 1)
          data[key] = yarnNameStr
        }
        // 处理比例
        if (key === 'elementRatio' && data[key] && data[key].indexOf('[') !== -1) {
          const elementRatio = JSON.parse(data[key])
          let elementName = ''
          let ratio = ''
          elementRatio.forEach((v, i) => {
            elementName += `${v.elementName}/`
            ratio += `${v.ratio}/`
          })
          elementName = elementName.substring(0, elementName.length - 1)
          ratio = ratio.substring(0, ratio.length - 1)
          data[key] = elementName + ' ' + ratio
        }

        // 下拉dataSource回显数据
        if (keyProp.includes(key)) {
          if (data[key] && data[key].label) {
            this.$set(this.dyeingProduct['_' + key], 'dataSource', [{
              label: data[key].label,
              value: data[key].value
            }])
          } else {
            this.$set(this.dyeingProduct['_' + key], 'dataSource', '')
          }
        }
        // 功能性整理（后台要uuid和name） 需要转换
        if (key === 'dyeFuntion' || key === 'processFlow' || key === 'dyeIngredient') {
          if (data[key] && data[key].indexOf('[') !== -1) {
            const arr = JSON.parse(data[key]).map(v => {
              return {
                label: v.name,
                value: v.uuid,
                parentUuid: v.parentUuid || ''
              }
            })
            this.$set(this.dyeingProduct['_' + key], 'dataSource', arr)
            data[key] = arr
          }
        }
      }
      if (data.dyeCraftCombination) {
        this.getRequirementCombination(data.dyeCraftCombination && data.dyeCraftCombination.value)
      }
      // debugger
      data.dyeHandfeel = {
        ...data.dyeHandfeel,
        parentUuid: data.dyeHandfeelPid || ''
      }
      data.dyeStyle = {
        ...data.dyeStyle,
        parentUuid: data.dyeStylePid || ''
      }
      this.ranDetail = data
      this.ranDetail.colorSuggestWeightUnit = data.colorSuggestWeightUnit || 'g/m²'// 默认显示单位
      this.ranDetail.colorSuggestWidthUnit = data.colorSuggestWidthUnit || '"'
      this.ranDetail.shrinkL = (data.shrinkL || '') + 'X' + (data.shrinkW || '')
      this.ranDetail.weightBefore = this.ranDetail.weightBefore + this.ranDetail.weightBeforeUnit + '/' + this.ranDetail.weightBeforeRangeInfo || ''
      this.ranDetail.weightAfter = (this.ranDetail.weightAfter || '') + (this.ranDetail.weightAfterUnit || '') + '/' + this.ranDetail.weightAfterRangeInfo || ''
      this.ranDetail.suggestWidth = (this.ranDetail.suggestWidth || '') + (this.ranDetail.suggestWidthUnit || '') + '/' + this.ranDetail.suggestWidthRangeInfo || ''

      this.ranDetail.colorInfoType = (this.ranDetail.colorInfoType ? this.ranDetail.colorInfoType.label + '/' : '') + this.ranDetail.colorCode
      this.ranDetail.flowerInfoType = (this.ranDetail.flowerInfoType ? this.ranDetail.flowerInfoType.label + '/' : '') + this.ranDetail.flowerCode
      this.ranDetail.weightAcceptanceCriteria = this.ranDetail.weightAcceptanceCriteria ? this.ranDetail.weightAcceptanceCriteria.label : ''
      let craftElementRatio = this.ranDetail.craftElementRatio
      // 处理工艺成份比例
      // debugger
      let craftElementName = ''
      let craftRatio = ''
      let craftElementStr = ''
      if (craftElementRatio && craftElementRatio.indexOf('[') !== -1) {
        craftElementRatio = JSON.parse(this.ranDetail.craftElementRatio)
        craftElementRatio.forEach((v, i) => {
          craftElementName += `${v.elementName}/`
          craftRatio += `${v.ratio}/`
        })
        craftElementName = craftElementName.substring(0, craftElementName.length - 1)
        craftRatio = craftRatio.substring(0, craftRatio.length - 1)
        craftElementStr = craftElementName + ' ' + craftRatio
      }

      this.ranDetail.craftElementRatio = craftElementStr
      if (this.activeName === '2') {
        // 染整工艺编辑
        // 印花工艺不为空的时候可编辑 色布克重和色布幅宽
        if (this.ranDetail.printCraft) {
          this.dyeingProduct._colorSuggestWidth.disabled = false
          this.dyeingProduct._colorSuggestWidth.rlues = [this.commonChangeReg, this.max999Reg]
          // this.dyeingProduct._colorSuggestWidthUnit.disabled = false
          this.dyeingProduct._colorSuggestWeight.disabled = false
          this.dyeingProduct._colorSuggestWeight.rlues = [this.commonChangeReg, this.max999Reg]
        }
      }
    },
    // 织造工艺详情
    async getDetailFun(id, type = 'edit') {
      if (type === 'edit') {
        this.detailObj = (await api.getDetail({ id: id })).data || {}
        this.detailObjCopy = deepClone(this.detailObj)
        if (this.orderDetailId) {
          this.detailObjCopy.id = this.orderDetailId
        }
        // 工艺引用 筛选id之后赋值
        // 判断是否是电脑提花
        this.getClothsTypeInfo(this.detailObj.clothsTypeInfo)

        // 产品信息赋值
        // 染整工艺
        const dyeCraft = this.detailObj.dyeCraft && this.detailObj.dyeCraft.indexOf('{') !== -1 ? JSON.parse(this.detailObj.dyeCraft) : ''
        let dyeCraftStr = ''
        if (dyeCraft && dyeCraft.length > 0) {
          dyeCraft.forEach(v => {
            dyeCraftStr += v.parent && v.parent.name ? v.parent.name + '-' + v.name + ',' : v.name + ','
          })
          dyeCraftStr = dyeCraftStr.substr(0, dyeCraftStr.length - 1)
        } else {
          // dyeCraftStr = this.detailObj.dyeCraft || ''
        }
        // 印花工艺
        const printCraft = this.detailObj.printCraft && this.detailObj.printCraft.indexOf('{') !== -1 ? JSON.parse(this.detailObj.printCraft) : ''
        let printCraftStr = ''
        if (printCraft && printCraft.length > 0) {
          printCraft.forEach(v => {
            printCraftStr += v.label ? v.label + ',' : ''
          })
          printCraftStr = printCraftStr.substr(0, printCraftStr.length - 1)
        } else {
          printCraftStr = this.detailObj.printCraft || ''
        }
        const elementRatio = this.detailObj.elementRatio && this.detailObj.elementRatio.indexOf('[') !== -1 ? JSON.parse(this.detailObj.elementRatio) : []
        let elementStr = ''
        let elementName = ''
        let ratio = ''
        // 处理比例
        if (elementRatio) {
          elementRatio.forEach((v, i) => {
            elementName += `${v.elementName}/`
            ratio += `${v.ratio}/`
          })
          elementName = elementName.substring(0, elementName.length - 1)
          ratio = ratio.substring(0, ratio.length - 1)
          elementStr = elementName + ' ' + ratio
        }
        let craftElementRatio = this.detailObj.craftElementRatio
        let craftElementName = ''
        let craftRatio = ''
        let craftElementStr = ''
        if (craftElementRatio && craftElementRatio.indexOf('[') !== -1) {
          craftElementRatio = JSON.parse(craftElementRatio)
          craftElementRatio.forEach((v, i) => {
            craftElementName += `${v.elementName}/`
            craftRatio += `${v.ratio}/`
          })
          craftElementName = craftElementName.substring(0, craftElementName.length - 1)
          craftRatio = craftRatio.substring(0, craftRatio.length - 1)
          craftElementStr = craftElementName + ' ' + craftRatio
        }

        // 引用工艺基础信息不赋值
        if (!this.quoteTechnology) {
          const productInfo = {
            cloth: this.detailObj.clothsTypeInfo ? this.detailObj.clothsTypeInfo.label : '', // 布类
            garmentPartInfo: this.detailObj.garmentPartInfo ? this.detailObj.garmentPartInfo.label : '', // 成衣部位
            suggestWeight: this.detailObj.suggestWeight + '-' + this.detailObj.suggestWidth, // 成品布封 成品规格（成品布封+成品克重）
            elementRatio: elementStr, // 成分比例客户
            craftElementRatio: craftElementStr, // 成分比例工艺
            customerColor: this.detailObj.customerColor, // 客户颜色
            fabricColorNo: this.detailObj.fabricColorNo, // 智布色号
            colorLevel: this.detailObj.colorLevel ? this.detailObj.colorLevel.label : '', // 色级：1-深、2-中、3-浅、4-白
            cpi: this.detailObj.cpi || '',
            wpi: this.detailObj.wpi || '',
            shrinkL: this.detailObj.shrinkL + 'X' + this.detailObj.shrinkW || '',
            dryWayInfo: this.detailObj.dryWayInfo ? this.detailObj.dryWayInfo.label : '', // 干燥方式
            isSoft: this.detailObj.isSoft || '', // 是否制软
            isPique: this.detailObj.isPique || '', // 是否珠地边
            cutGummed: this.detailObj.cutGummed || '', // 浆切边
            oilFeel: this.detailObj.oilFeel || '', // 硅油手感
            dyeCraft: dyeCraftStr || '', // 染整工艺
            printCraft: printCraftStr || '', // 印花工艺
            productProcedure: this.detailObj.productProcedure || '', // 生产流程
            sampleAnalysisResultId: this.detailObj.sampleAnalysisResultId || '', // 客样分析单
            processFlow: this.detailObj.processFlow || '', // 工作流程
            knitNo: this.detailObj.knitNo || '',
            weightBefore: this.detailObj.weightBefore + this.detailObj.weightBeforeUnit + '/' + (this.detailObj.weightBeforeRangeInfo && this.detailObj.weightBeforeRangeInfo.label || ''),
            weightAfter: (this.detailObj.weightAfter || '') + (this.detailObj.weightAfterUnit || '') + '/' + (this.detailObj.weightAfterRangeInfo && this.detailObj.weightAfterRangeInfo.label || ''),
            suggestWidth: (this.detailObj.suggestWidth || '') + (this.detailObj.suggestWidthUnit || '') + '/' + (this.detailObj.suggestWidthRangeInfo && this.detailObj.suggestWidthRangeInfo.label || ''),
            fabricFlowerNo: this.detailObj.fabricFlowerNo,
            // colorInfoType: this.detailObj.colorInfoType ? this.detailObj.colorInfoType.label : '',
            // colorCode: this.detailObj.colorCode,
            // flowerInfoType: this.detailObj.flowerInfoType ? this.detailObj.flowerInfoType.label : '',
            // flowerCode: this.detailObj.flowerCode
            colorInfoType: (this.detailObj.colorInfoType ? this.detailObj.colorInfoType.label + '/' : '') + this.detailObj.colorCode,
            flowerInfoType: (this.detailObj.flowerInfoType ? this.detailObj.flowerInfoType.label + '/' : '') + this.detailObj.flowerCode,
            weightAcceptanceCriteria: this.detailObj.weightAcceptanceCriteria ? this.detailObj.weightAcceptanceCriteria.label : ''

          }
          this.aInfoData = this.detailObj.tmKnitReferenceVersionInfoInfoResp || []
          this.$refs.product.setProDataBiliSelect(productInfo)
        }
        this.quoteTechnology = false
      } else {
        let data = (await api.getDetail({ techId: id })).data || {}
        data = { ...data, ...this.infoData, productInfo: { ...data.productInfo, sampleAnalysisResultId: this.sampleAnalysisResultId }}
        this.detailObj = data
      }

      if (this.detailObj.attachment) {
        const attachArr = this.detailObj.attachment && this.detailObj.attachment.split(',')
        const attachnameArr = this.detailObj && this.detailObj.attachmentName
        const fileArr = attachArr.map((item, index) => {
          return {
            name: attachnameArr[index],
            url: item
          }
        })
        this.detailObj.attachment = fileArr
      }

      const remarkParams = {
        remark: this.detailObj.remark || '',
        flag: true
      }
      this.$set(this.$refs.remarkOption, 'formDatas', remarkParams)
      this.id = this.detailObj.id
      // 判断组合纱线是否存在, 存在即把后端返回的set到select里的dataSource里面
      const shaxian = this.detailObj.tmKnitMaterialInfoInfoResp

      if (shaxian.composeYarns) {
        const composeWayArr = [...new Set(shaxian.composeYarns.filter(item => item.composeWayInfo).map(item => { return JSON.stringify(item.composeWayInfo) }))].map(item => JSON.parse(item))
        const coastWayArr = [...new Set(shaxian.composeYarns.filter(item => item.coatedWayInfo).map(item => { return JSON.stringify(item.coatedWayInfo) }))].map(item => JSON.parse(item))
        const twistDirectionArr = [...new Set(shaxian.composeYarns.filter(item => item.twistDirectionInfo).map(item => { return JSON.stringify(item.twistDirectionInfo) }))].map(item => JSON.parse(item))
        this.$set(this.$refs.require.combinationData[0], 'dataSource', composeWayArr)
        this.$set(this.$refs.require.combinationData[1], 'dataSource', coastWayArr)
        this.$set(this.$refs.require.combinationData[2], 'dataSource', twistDirectionArr)
      }
      // 判断面料成分比例是否存在, 存在即把后端返回的set到select里的dataSource里面

      if (this.detailObj.tmKnitMaterialInfoInfoResp) {
        if (this.isEdit === 'detail') {
          // this.$set(this.$refs.require.mainData[1], 'isShow', false)
          this.$set(this.$refs.require.mainFormDatas, 'yarnLength', this.detailObj.tmKnitMaterialInfoInfoResp.yarnLength ? this.detailObj.tmKnitMaterialInfoInfoResp.yarnLength + 'G' : '')
        } else {
          this.$set(this.$refs.require.mainFormDatas, 'yarnLength', this.detailObj.tmKnitMaterialInfoInfoResp.yarnLength ? this.detailObj.tmKnitMaterialInfoInfoResp.yarnLength : '')
        }
        this.detailObj.tmKnitMaterialInfoInfoResp.chemicalFibers && this.detailObj.tmKnitMaterialInfoInfoResp.chemicalFibers.forEach(v => {
          v.yarnLengthType = '1'
        })
        this.detailObj.tmKnitMaterialInfoInfoResp.naturalFibers && this.detailObj.tmKnitMaterialInfoInfoResp.naturalFibers.forEach(v => {
          v.yarnLengthType = '1'
        })
        if (this.detailObj.tmKnitMaterialInfoInfoResp.composeYarns && this.detailObj.tmKnitMaterialInfoInfoResp.composeYarns.length > 0) {
          this.detailObj.tmKnitMaterialInfoInfoResp.composeYarns && this.detailObj.tmKnitMaterialInfoInfoResp.composeYarns.forEach((v, i) => {
            let str = ''
            if (v.machineYarnLength && v.machineYarnLength.indexOf('[') !== -1) {
              const item = JSON.parse(v.machineYarnLength)

              item.forEach((o, a) => {
                str += o.desc + ':' + o.len + 'CM' + '|'
              })
              str = str.substr(0, str.length - 1)
            }
            v.machineYarnLengthView = str
          })
        }
      }

      let computerTechnologyParams = {}
      if (this.detailObj.machineTechnology) {
        if (this.isEdit === 'detail') {
          computerTechnologyParams = {
            id: this.detailObj.machineTechnology && this.detailObj.machineTechnology.id ? this.detailObj.machineTechnology.id : '',
            stitchNum: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.stitchNum) >= 0) ? this.detailObj.machineTechnology.stitchNum + 'G' : '',
            inch: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.inch) >= 0) ? this.detailObj.machineTechnology.inch + '"' : '',
            totalStitchNum: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.totalStitchNum) >= 0) ? this.detailObj.machineTechnology.totalStitchNum + 'N' : '',
            typeInfo: this.detailObj.machineTechnology.typeInfo && this.detailObj.machineTechnology.typeInfo.value ? this.detailObj.machineTechnology.typeInfo : '',
            packageWayInfo: this.detailObj.machineTechnology.packageWayInfo && this.detailObj.machineTechnology.packageWayInfo.value ? this.detailObj.machineTechnology.packageWayInfo : '',
            loomTypeInfo: this.detailObj.machineTechnology.loomTypeInfo && this.detailObj.machineTechnology.loomTypeInfo.value ? this.detailObj.machineTechnology.loomTypeInfo : '',
            loomTurnInfo: this.detailObj.machineTechnology.loomTurnInfo && this.detailObj.machineTechnology.loomTurnInfo.value ? this.detailObj.machineTechnology.loomTurnInfo : '',
            stitchType: this.detailObj.machineTechnology.stitchType && this.detailObj.machineTechnology.stitchType.value ? this.detailObj.machineTechnology.stitchType : '',
            module: this.detailObj.machineTechnology.module,
            flag: true
          }
          // this.$set(this.$refs.computerTechnology.$refs.computerTechnologyForm.dataSource._G1, 'isShow', false)
          // this.$set(this.$refs.computerTechnology.$refs.computerTechnologyForm.dataSource._G, 'isShow', false)
        } else if (this.isEdit === 'edit') {
          computerTechnologyParams = {
            id: this.detailObj.machineTechnology && this.detailObj.machineTechnology.id ? this.detailObj.machineTechnology.id : '',
            stitchNum: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.stitchNum) >= 0) ? this.detailObj.machineTechnology.stitchNum : '',
            inch: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.inch) >= 0) ? this.detailObj.machineTechnology.inch : '',
            totalStitchNum: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.totalStitchNum) >= 0) ? this.detailObj.machineTechnology.totalStitchNum : '',
            typeInfo: this.detailObj.machineTechnology.typeInfo && this.detailObj.machineTechnology.typeInfo.value ? this.detailObj.machineTechnology.typeInfo : '',
            packageWayInfo: this.detailObj.machineTechnology.packageWayInfo && this.detailObj.machineTechnology.packageWayInfo.value ? this.detailObj.machineTechnology.packageWayInfo : '',
            loomTypeInfo: this.detailObj.machineTechnology.loomTypeInfo && this.detailObj.machineTechnology.loomTypeInfo.value ? this.detailObj.machineTechnology.loomTypeInfo : '',
            loomTurnInfo: this.detailObj.machineTechnology.loomTurnInfo && this.detailObj.machineTechnology.loomTurnInfo.value ? this.detailObj.machineTechnology.loomTurnInfo : '',
            stitchType: this.detailObj.machineTechnology.stitchType && this.detailObj.machineTechnology.stitchType.value ? this.detailObj.machineTechnology.stitchType : '',
            module: this.detailObj.machineTechnology.module,
            flag: true
          }
        }
      }

      // 详情排针图数据处理
      const pinTopList = new Array(30).fill('')
      const pinBottomList = new Array(30).fill('')
      let stitchMap = []
      if (this.detailObj.machineTechnology && this.detailObj.machineTechnology.stitchMap) {
        stitchMap = JSON.parse(this.detailObj.machineTechnology.stitchMap)
        if (isArray(stitchMap) && stitchMap.length) {
          stitchMap[0].unshift('上针')
          stitchMap[1].unshift('下针')
        } else {
          stitchMap = [['上针', ...pinTopList], ['下针', ...pinBottomList]]
        }
      } else {
        stitchMap = [['上针', ...pinTopList], ['下针', ...pinBottomList]]
      }
      // 详情排三角图数据处理
      let triangleMap = {}
      if (this.detailObj.machineTechnology && this.detailObj.machineTechnology.triangleMap) {
        triangleMap = JSON.parse(this.detailObj.machineTechnology.triangleMap) || {}
      } else {
        triangleMap = { ...this.triangleMap, cycles: new Array(1).fill(new Array(30).fill('')), cyclesDetails: new Array(1).fill(new Array(30).fill('')) }
      }
      this.$set(this.$refs.computerTechnology, 'stitchMap', stitchMap)
      this.$set(this.$refs.computerTechnology, 'pinTableList', new Array(stitchMap[0].length - 1).fill(''))
      this.$set(this.$refs.computerTechnology, 'triangleTableList', new Array(triangleMap.plateTop[0].length).fill(''))
      this.$set(this.$refs.computerTechnology, 'triangleMap', triangleMap)
      this.$set(this.$refs.computerTechnology, 'formDatas', { ...computerTechnologyParams })
      this.$set(this.$refs.computerTechnology.order, 'stitchType', this.detailObj.machineTechnology ? this.detailObj.machineTechnology.stitchType : '')
      this.$nextTick(() => {
        this.$refs.require.$refs.mainYarnFineness.form.clearValidate()
        this.$refs.computerTechnology.$refs.computerTechnologyForm.form.clearValidate()
      })
    },
    async editClick() {
      // 点击编辑查询工艺状态
      if (this.activeName === '2') {
        const res = (await api.tmKnitTechInfo({ id: this.$route.params.id })).data || {}
        if (res.status !== 'Y') {
          return this.$message.warning('请先审核织造工艺才可编辑')
        }
      }
      this.isEdit = 'edit'
      // 织造工艺编辑
      if (this.activeName === '1') {
        const computerTechnologyParams = {
          id: this.detailObj.machineTechnology && this.detailObj.machineTechnology.id ? this.detailObj.machineTechnology.id : '',
          stitchNum: this.detailObj.machineTechnology && ('' + this.detailObj.machineTechnology.stitchNum) ? this.detailObj.machineTechnology.stitchNum : '',
          inch: this.detailObj.machineTechnology && ('' + this.detailObj.machineTechnology.inch) ? this.detailObj.machineTechnology.inch : '',
          totalStitchNum: this.detailObj.machineTechnology && ('' + this.detailObj.machineTechnology.totalStitchNum) ? this.detailObj.machineTechnology.totalStitchNum : '',
          cpi: this.detailObj.machineTechnology && ('' + this.detailObj.machineTechnology.cpi) ? this.detailObj.machineTechnology.cpi : '',
          wpi: this.detailObj.machineTechnology && ('' + this.detailObj.machineTechnology.wpi) ? this.detailObj.machineTechnology.wpi : '',
          flag: true
        }
        // 关于色布幅宽、色布克重的取值与填写，色布幅宽取成品幅宽（印花工艺不为空：可编辑，否则不可编辑）
        this.$set(this.$refs.computerTechnology, 'formDatas', { ...computerTechnologyParams })
        this.$set(this.$refs.require.mainFormDatas, 'unit', this.detailObj.tmKnitMaterialInfoInfoResp ? this.detailObj.tmKnitMaterialInfoInfoResp.unit : '')
      } else if (this.activeName === '2') {
        // 染整工艺编辑
        // 印花工艺不为空的时候可编辑 色布克重和色布幅宽
        if (this.ranDetail.printCraft) {
          this.dyeingProduct._colorSuggestWidth.disabled = false
          this.dyeingProduct._colorSuggestWidth.rlues = [this.commonChangeReg]
          // this.dyeingProduct._colorSuggestWidthUnit.disabled = false
          this.dyeingProduct._colorSuggestWeight.disabled = false
          this.dyeingProduct._colorSuggestWeight.rlues = [this.commonChangeReg]
        }
      }
    },
    async cancelEdit() {
      this.$refs.product.$refs.proForm.form.clearValidate()
      this.$refs.computerTechnology.$refs.computerTechnologyForm.form.clearValidate()
      this.$refs.dyeingProduct.form.clearValidate()
      this.isEdit = 'detail'
      await this.getDetailFun(this.orderDetailId)
      await this.getRanDetailFun(this.orderDetailId)
      if (this.$route.query.status && this.$route.query.status === '1') {
        this.$router.push(`/tech-manage/weave-tech/detail/${this.techId}`)
      }
      await this.getDetailFun(this.orderDetailId)
      await this.getRanDetailFun(this.orderDetailId)
    },
    // 点击审核按钮
    approveClick() {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      this.optionStatus = 'approve'
    },
    // 审核客样分析状态
    async approveSampleAnalysis(data) {
      const res = await api.statusApprove({ id: this.id, reviewOpinion: data })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.fetchLog(
        this.getLogMessages('UPDATE', '/techManage/sampleAnalysisResult/audit', 'techManage'),
        { id: this.detailObj.id },
        JSON.stringify({
          beforeText: `在'工艺管理-针织工艺详情'审核一条记录`,
          beforeCode: { id: this.detailObj.id }
        })
      )
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.$route.query.status && this.$route.query.status === '1') {
        this.$router.push(`/tech-manage/weave-tech/detail/${this.techId}`)
      }
      this.getDetailFun(this.techId)
    },
    // 点击驳回按钮
    rejectClick() {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      this.optionStatus = 'reject'
    },
    // 驳回客样分析状态
    async rejectSampleAnalysis(data) {
      const res = await api.statusReject({ id: this.id, reviewOpinion: data })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '驳回成功!'
      })
      this.fetchLog(
        this.getLogMessages('UPDATE', '/techManage/sampleAnalysisResult/reject', 'techManage'),
        { id: this.detailObj.id },
        JSON.stringify({
          beforeText: `在'工艺管理-针织工艺详情'驳回一条记录`,
          beforeCode: { id: this.detailObj.id }
        })
      )
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.$route.query.status && this.$route.query.status === '1') {
        this.$router.push(`/tech-manage/weave-tech/detail/${this.techId}`)
      }
      this.getDetailFun(this.techId)
    },
    // 打印预览
    async printPreview() {
      if (this.$route.params && this.$route.params.id) {
        const sk = this.$route.params.id
        // const sk = 'SAR20120003'
        this.$router.push(`/tech-manage/weave-tech/print?id=${sk}`)
      }
    },
    // 返回
    backListClick() {
      // this.$router.push(`../list`)
      this.closeRight()
    },
    // 详情状态下点击提交
    async bindDetSubmit() {
      await this.verificationFun()
      this.setDetail(this.detailObj, 2)
    },
    // 染整工艺提交参数组装
    async dyeingParamsData() {
      const dyeingProduct = this.$refs.dyeingProduct.dynamicValidateFormRuleForm
      const datas = deepClone(dyeingProduct || {})
      // 工序流程

      var dyeIngredient = deepClone(datas.dyeIngredient || []) // 后端需要 结构[{"uuid":"aa1","name":"xxx","parentUuid":""},{"uuid":"bb2","name":"xxx3","parentUuid":""}]
      var dyeFuntion = deepClone(datas.dyeFuntion || []) // 后端需要 结构[{"uuid":"aa1","name":"xxx","parentUuid":""},{"uuid":"bb2","name":"xxx3","parentUuid":""}]
      var processFlow = deepClone(datas.processFlow || []) // 后端需要 结构[{"uuid":"aa1","name":"xxx","parentUuid":""},{"uuid":"bb2","name":"xxx3","parentUuid":""}]
      const dataObj = { dyeIngredient, dyeFuntion, processFlow }
      for (const key in dataObj) {
        dataObj[key] = dataObj[key].map(v => {
          return {
            uuid: v.value,
            name: v.label,
            parentUuid: v.parentUuid || ''
          }
        })
      }

      const tmDyeProcessFlowInfoUpdateReq = {
        dyeType: datas.dyeType, // 染整类型
        dyeIngredient: dataObj.dyeIngredient && JSON.stringify(dataObj.dyeIngredient), // 染色成份json
        dyeCraftCombination: datas.dyeCraftCombination && datas.dyeCraftCombination.value ? { value: datas.dyeCraftCombination.value, label: datas.dyeCraftCombination.label } : {}, // 染整工艺组合
        processFlow: dataObj.processFlow && JSON.stringify(dataObj.processFlow), // 工序流程json
        flowCode: {
          label: dyeingProduct.flowCode && dyeingProduct.flowCode.label || '',
          value: dyeingProduct.flowCode && dyeingProduct.flowCode.uuid || ''
        }
      }
      // 染整工艺
      const tmDyeCraftInfoUpdateReq = {
        dyeStyle: datas.dyeStyle, // 风格整理类型
        dyeStylePid: datas.dyeStyle && datas.dyeStyle.parentUuid || '', // 风格整理父级id
        dyeFuntion: dataObj.dyeFuntion && JSON.stringify(dataObj.dyeFuntion), // 功能性整理json
        dyeHandfeel: datas.dyeHandfeel, // 手感整理
        dyeHandfeelPid: datas.dyeHandfeel && datas.dyeHandfeel.parentUuid || '', // 手感整理父级id
        selvage: datas.selvage, // 布边要求
        design: datas.design, // 款式要求
        softMethod: datas.softMethod // 制软要求

      }
      const params = {
        id: this.ranDetailCopy.id,
        colorSuggestWeight: datas.colorSuggestWeight || '', // 色布克重
        colorSuggestWeightUnit: datas.colorSuggestWeightUnit || '', // 色布克重单位{固定选项："和CM}
        colorSuggestWidth: datas.colorSuggestWidth || '', // 色布幅宽
        colorSuggestWidthUnit: datas.colorSuggestWidthUnit || '', // 色布幅宽单位{固定选项："和CM}
        tmDyeProcessFlowInfoUpdateReq,
        tmDyeCraftInfoUpdateReq
      }

      this.$refs.dyeingProduct.form.validate(async valid => {
        if (valid) {
          this.isBatch ? await api.atchBatchModify(params) : await api.detailRanModify(params)
          this.isEdit = 'detail'
          this.$message.success('保存成功')
          this.getTmKnitTechInfo()
          await this.getRanDetailFun(this.orderDetailId)
          this.fetchLog(
            this.getLogMessages('UPDATE', '/techManage/tmDyeTechDetail/modify', 'techManage'),
            { id: this.ranDetailCopy.id },
            JSON.stringify({
              beforeText: `在'工艺管理-针织工艺详情'编辑一条记录`,
              beforeCode: { id: this.ranDetailCopy.id }
            })
          )
        }
      })
    },
    // 编辑状态下点击提交
    async bindSave(val) {
      // const flag = false
      // const product = this.$refs.product

      // 提交染整参数
      if (this.activeName === '2') {
        this.dyeingParamsData()
        return
      }
      // 织造工艺参数
      if (val === 2) {
        // 表单验证 方法
        await this.verificationFun()
      }
      await this.verificationFun()
      // 产品信息参数
      const productParams = this.$refs.product.$refs.proForm.dynamicValidateFormRuleForm
      const stitchType = this.$refs.computerTechnology.order
      const productInfo = {
        customerColor: productParams.customerColor, // 客户颜色
        colorLevel: productParams.colorLevel, // 色级：1-深、2-中、3-浅、4-白
        cpi: productParams.cpi,
        wpi: productParams.wpi,
        shrinkL: productParams.shrinkL,
        shrinkW: productParams.shrinkW,
        // dryWayInfo: productParams.dryWayInfo,
        isSoft: productParams.isSoft,
        isPique: productParams.isPique,
        cutGummed: productParams.cutGummed, // 浆切边
        oilFeel: productParams.oilFeel

      }

      const require = this.$refs.require
      // const chemicalFibers = require.chemicalData
      const naturalFibers = require.naturalData
      const chemicalFibers = require.chemicalData

      const composeYarns = require.composeYarns
      const fringeSpacing = require.fringeSpacing // 条文间距

      // 生产流程包含染纱：原料的纱线至少有一行数据选了是否染色=是
      const procedure = this.detailObj.productProcedure
      if (procedure && procedure.indexOf('染纱') !== -1) {
        const rawMaterialTable = fringeSpacing && fringeSpacing.rawMaterialTable || []
        // if (rawMaterialTable || rawMaterialTable.length === 0) {
        //   return this.$message.error('原料的纱线至少有一行数据选了是否染色=是')
        // }
        const itemError = rawMaterialTable.filter(v => v.isDyed === 1)
        if (!itemError) return this.$message.error('原料的纱线至少有一行数据选了是否染色=是')
      }

      const materialRequirement = require.$refs.mainYarnFineness.dynamicValidateFormRuleForm
      // 上机工艺 this.$refs.computerTechnology.infoDataSource
      const machineTechnologyFormData = this.$refs.computerTechnology.$refs.computerTechnologyForm.dynamicValidateFormRuleForm
      // // 备注、意见、附件数据
      const remarkOptionData = this.$refs.remarkOption.$refs.remarkOptionForm.dynamicValidateFormRuleForm
      // // 上机工艺排针图数据
      const stitchMap = this.$refs.computerTechnology.stitchMap
      // 上机工艺排三角图数据
      const triangleMap = this.$refs.computerTechnology.triangleMap
      const data = {
        optTYpe: val,
        techId: this.techId,
        analyzeReferencesNo: productParams.analyzeReferencesNo || '',
        guestSample: productParams.guestSample,
        ...productInfo, // 产品信息

        tmKnitMaterialInfoInfoResp: {
          id: this.detailObj.tmKnitMaterialInfoInfoResp ? this.detailObj.tmKnitMaterialInfoInfoResp.id : '',
          yarnLength: materialRequirement.yarnLength, // 纱长
          unit: materialRequirement.unit, // 纱长单位
          naturalFibers, // 天然纤维
          chemicalFibers, // 化学纤维
          composeYarns, // 组合纱线
          tmKnitIntervalDesignInfoRespList: require.designData, // 间条设计信息
          tmKnitDyeInfoInfoResponseList: fringeSpacing.rawMaterialTable, // 原料信息
          tmKnitStripeSpacingInfoRespList: fringeSpacing.intervalStripTable// 条纹间距,
        },
        // 上机工艺

        machineTechnology: {
          id: this.detailObj.machineTechnology ? this.detailObj.machineTechnology.id : '',
          stitchNum: machineTechnologyFormData.stitchNum || '', // 针数
          inch: machineTechnologyFormData.inch || '', // 寸数
          totalStitchNum: machineTechnologyFormData.totalStitchNum || '', // 总针数
          typeInfo: machineTechnologyFormData.typeInfo, // 类型
          packageWayInfo: machineTechnologyFormData.packageWayInfo, // 打包方式
          loomTypeInfo: machineTechnologyFormData.loomTypeInfo, // 织机种类
          loomTurnInfo: machineTechnologyFormData.loomTurnInfo, // 织机转向
          module: machineTechnologyFormData.module, // 模数
          stitchType: stitchType.stitchType, // 排针图类型
          stitchMap: JSON.stringify(this.setStitchMap(stitchMap)), // 排针图
          triangleMap: JSON.stringify(triangleMap)// 排三角
        },
        remark: remarkOptionData.remark // 备注

      }
      if (this.isBatch) {
        data.ids = this.multipleSelection.map(v => v.id) || []
      } else {
        data.id = this.orderDetailId
      }
      this.setDetail(data, val)
    },
    async setDetail(data, val) {
      if (val === 1) {
        let num = 0
        this.$refs.computerTechnology.$refs.computerTechnologyForm.form.validateField(['stitchNum', 'packageWayInfo', 'inch', 'totalStitchNum', 'cpi', 'wpi'], (validateField) => {
          if (validateField && validateField !== '必填项不能为空') {
            this.$message.error(validateField)
            num++
          }
          if (num > 0) {
            this.computerTechnologyValid = true
          } else {
            this.computerTechnologyValid = false
          }
        })

        this.$refs.computerTechnology.$refs.computerTechnologyForm.form.validateField(['stitchNum', 'inch', 'totalStitchNum', 'cpi', 'wpi'], (validateField) => {
          if (validateField && validateField !== '必填项不能为空') {
            this.$message.error(validateField)
            num++
          }
          if (num > 0) {
            this.computerTechnologyValid = true
          } else {
            this.computerTechnologyValid = false
          }
        })

        if (!this.computerTechnologyValid) {
          this.$refs.computerTechnology.$refs.computerTechnologyForm.form.clearValidate()
          if (this.activeName === '1') {
            this.isBatch ? await api.atchBatchModify({ ...data }) : await api.detailModify(data)
          } else {
            this.isBatch ? await api.ranBatchModify({ ...data }) : await api.detailRanModify(data)
          }

          // await detailModify(data)// 单个提交
          // await atchBatchModify({ ...data }) // 批量提交个修改
          this.fetchLog(
            this.getLogMessages('UPDATE', 'techManage/sampleAnalysisResult/modify', 'techManage'),
            { id: this.detailObj.id },
            JSON.stringify({
              beforeText: `在'工艺管理-针织工艺详情'编辑一条记录`,
              beforeCode: { id: this.detailObj.id }
            })
          )
        } else {
          return
        }
        this.$refs.product.$refs.proForm.form.clearValidate()
        this.$refs.require.$refs.ylForm.form.clearValidate()
        // await detailModify(data) { ...data, optTYpe: val }
      } else {
        await api.detailModify({ ...data, optTYpe: val })
        await api.atchBatchModify({ ...data }) // 批量提交个修改
        this.fetchLog(
          this.getLogMessages('UPDATE', 'techManage/sampleAnalysisResult/modify', 'techManage'),
          { id: this.detailObj.id },
          JSON.stringify({
            beforeText: `在'工艺管理-针织工艺详情'提交一条记录`,
            beforeCode: { id: this.detailObj.id }
          })
        )
      }
      this.$message({
        message: val === 1 ? '保存成功' : '提交成功',
        type: 'success'
      })
      // 保存成功之后更新头部工艺人及时间
      const userInfo = localStorage.getItem('userInfo')
      this.orderInfo.techerName = userInfo ? JSON.parse(userInfo).realName : ''// 从缓存拿当前用户名
      this.orderInfo.updatedTime = (new Date()).getTime()// 当前时间

      this.isEdit = 'detail'
      if (this.$route.query.status && this.$route.query.status === '1') {
        this.$router.push(`/tech-manage/weave-tech/detail/${this.techId}`)
      }
      this.detailQuote = {}
      this.getTmKnitTechInfo()
      await this.getDetailFun(this.orderDetailId)
    },
    setStatusColor(status) {
      let statusColor = ''
      // 状态：W-待处理，P-待提交，A-待审核，Y-已审核，B-已驳回
      switch (status) {
        case 'W':
          statusColor = '#FF9214'
          break
        case 'P':
          statusColor = '#FF9214'
          break
        case 'A':
          statusColor = '#FF9214'
          break
        case 'Y':
          statusColor = '#00BCC5'
          break
        case 'B':
          statusColor = '#888E9E'
          break
        case '':
          statusColor = '#888E9E'
          break
        default:
          statusColor = ''
          break
      }
      return statusColor
    },
    setStitchMap(data) {
      let stitchMapArr = []
      if (data && data.length) {
        stitchMapArr = JSON.parse(JSON.stringify(data))
        stitchMapArr.forEach((item) => {
          item = item.shift()
        })
      }
      return stitchMapArr
    },
    setUploadData(data) {
      if (data && isArray(data)) {
        let attachStr = ''
        data.forEach((item, index) => {
          if (item.url) {
            attachStr = attachStr + item.url + ','
          } else if (item.response.data) {
            attachStr = attachStr + item.response.data + ','
          }
        })
        return attachStr.substring(0, attachStr.lastIndexOf(','))
      } else {
        return ''
      }
    },

    // 判断数组中是否全部为空
    validEmptyVal(data) {
      return data.length && data.every((val) => {
        return val === ''
      })
    },
    // 表单验证 fun
    verificationFun() {
      return new Promise((res, rej) => {
        Promise.all([
          new Promise((resolve, reject) => {
            this.$refs.product.$refs.proForm.form.validate((valid, obj) => {
              if (valid) {
                resolve()
              } else {
                reject(obj)
              }
            })
          }),
          new Promise((resolve, reject) => {
            this.$refs.require.$refs.ylForm.form.validate((valid, obj) => {
              if (valid) {
                resolve()
              } else {
                reject(obj)
              }
            })
          }),
          new Promise((resolve, reject) => {
            this.$refs.require.$refs.mainYarnFineness.form.validate((valid, obj) => {
              if (valid) {
                resolve()
              } else {
                reject(obj)
              }
            })
          }),
          new Promise((resolve, reject) => {
            this.$refs.computerTechnology.$refs.computerTechnologyForm.form.validate((valid, obj) => {
              if (valid) {
                resolve()
              } else {
                reject(obj)
              }
            })
          })
        ]).then(e => {
          const _this = this
          const numRes = this.$refs.require.checkComposeContent()
          if (numRes) {
            _this.$message.error(numRes)
            return
          }
          // 排针图不全为空的验证
          const stitchMap = this.setStitchMap(this.$refs.computerTechnology.stitchMap)
          if (this.validEmptyVal(stitchMap[0]) && this.validEmptyVal(stitchMap[1])) {
            _this.$message({
              message: '上针和下针不可以同时全部为空',
              type: 'error'
            })
            return
          }
          // 排三角图的验证
          const triangleMap = this.$refs.computerTechnology.triangleMap
          if (this.validEmptyVal(triangleMap.plateTop[0]) && this.validEmptyVal(triangleMap.plateTop[1]) && this.validEmptyVal(triangleMap.plateBottom[0]) && this.validEmptyVal(triangleMap.plateBottom[1]) && this.validEmptyVal(triangleMap.plateBottom[2]) && this.validEmptyVal(triangleMap.plateBottom[3])) {
            _this.$message({
              message: '上盘和下盘不可以同时全部为空',
              type: 'error'
            })
            return
          }
          if (this.validEmptyVal(triangleMap.yarnRow[0])) {
            _this.$message({
              message: '排纱不可全部为空',
              type: 'error'
            })
            return
          }
          res()
        }).catch(err => {
          this.$message({
            message: err[Object.keys(err)[0]][0].message && err[Object.keys(err)[0]][0].message !== '此项不能为空' ? err[Object.keys(err)[0]][0].message : '必填项不能为空',
            // message: '必填项不能为空',
            type: 'error'
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-wrap{
    display: flex;
    position: relative;
    transition: all .3s;
    width: 100%;
  }
  .right-detail-box{
    display: none;
    width: 0;
    transition: width 0.3s;
    height: calc(100vh - 280px);
    overflow-y: auto;
    background-color: #FFFFFF;
  }
  .isShowRight{
    display: block;
    width: calc(100% - 370px);
    transition: all .3s;
  }
  .left-list{
    width: 100%;
    flex-shrink: 0;
    margin-right: 1px;
    height: calc(100vh - 199px);
    background: #999;
    overflow-y: auto;
    transition: all .3s;
  }
  .knitting-left{
    width: 370px;
    transition: all .3s;
  }
.guest-sample {
  min-width: 1200px;
  // padding: 20px 0 60px;
  padding: 15px;
  padding-bottom: 0;
  .status-info {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    height: 45px;
    margin-bottom: 15px;
    padding-left: 0;
    .info-code {
      font-size: 18px;
      color: #151222;
      cursor: pointer;
    }
    .copy-code {
      font-size: 12px;
      color: #777777;
    }
    .info-detail {
      font-size: 12px;
      color: #666666;
      span {
        margin-left: 5px;
      }
    }
  }
  .button-top {
    text-align: right;
    .option-info {
      margin-top: 10px;
      span {
        font-size: 12px;
        color: #888e9e;
        margin: 0 5px;
      }
      .order-status {
        margin-left: 20px;
        color: red;
      }
    }
  }
  .button-group {
    width: calc(100% - 500px);
    transition: width 0.28s;
    position: fixed;
    text-align: center;
    bottom: 0;
    padding: 10px;
    background: #ffffff;
    border-top: 1px solid #ecf0f3;
    z-index: 999;
  }
  .fixed-footer {
    width: calc(100% - 54px)!important;
  }
}
  .title-text{
    padding: 0 20px;
    height: 65px;
    line-height: 65px;
    font-size: 18px;
    // font-weight: 600;
    color: #151226;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
  }

.top-info-wrap{
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  height: 60px;
  font-size: 14px;
  background-color: #FFFFFF;
  padding: 0 15px;
  padding-left: 30px;
  border-bottom: 1px solid #eeeff0;
  .top-info-item{
    display: flex;
    align-items: center;
    padding-right: 50px;
    .label{
      font-size: 14px;
      color: #888E9E;
    }
    .text{
      display: flex;
      font-size: 14px;
      color: #474747;
      min-width: 80px;
    }
  }

}
.close-right{
  position: absolute;
  left: 348px;
  top: -40px;
  width: 22px;
  height: 22px;
  z-index: 2;
  background: #fff;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7c7c7c;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #afafaf;
}
.left-mask{
  position: absolute;
  top: 0;
  left: 0;
  width: 370px;
  height: 100%;
  z-index: 77;
}
</style>

<style lang="scss">
  .knitting-wrap.rules-disable .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .el-table__body tr.current-row > td {
    background-color: #f5f7fa !important;

  }
  .knitting-wrap .el-table th>.cell .el-checkbox{
    padding-left: 4px;
  }
  .knitting-wrap .table tr:nth-child(even){
    background: #FFFFFF;
  }
  .knitting-wrap .page-table tbody .el-table__row td{
    border-bottom: 1px solid #dfe6ec;
  }
  .knitting-wrap .el-form-item__label{
    color: #474747;
  }
  .knitting-wrap .compose-yarns-item .el-input.is-disabled .el-input__inner{
    color: #474747 !important;
  }
  .knitting-wrap .el-tabs__nav-wrap::after{
    height: 1px !important;
    z-index: 5;
  }
  .knitting-wrap{
    .dyeing-technology{
      .el-form-item__label{
        flex-shrink: 0;
      }
      .el-form-item__content>div{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }
    }
  }

.rules-disable {
  .product-box {
    .is-required .el-form-item__label::before {
      content: '';
    }
    .techRequire::before {
      content: '';
    }
    .el-form-item{
      margin-bottom: 0 !important;
    }
  }
  .product-box  .el-input.is-disabled .el-input__inner{
    color: #474747;
  }
  .info-box .el-input.is-disabled .el-input__inner{
    color: #474747;
  }
  .el-form-item__label{
    color: #888E9E;
  }
  .require {
    .mainYarn {
      .is-required .el-form-item__label::before {
        content: '';
      }
    }
    .table-item {
      .is-required .el-form-item__label::before {
        content: '';
      }
    }
  }
  .computer-technology {
    .technology-box {
      .is-required .el-form-item__label::before {
        content: '';
      }
    }
    .pin-number .pin-info i {
      display: none;
    }
  }
}
.knitting-wrap{
  .dyeing-technology{
    .el-form-item__label{
      padding-right: 20px;
    }
  }
  .product-box{
    .el-form-item__label{
      padding-right: 20px;
    }
  }
  .top-info-box{
    background-color: #fff;
    position: relative;

    .el-tabs__item{
      height: 60px;
      line-height: 60px;

    }

   .el-tabs--top .el-tabs__item.is-top:nth-child(2){
     padding-left: 15px;
   }
  }
  .el-tabs__header{
    margin: 0;
  }
  .dyeing-product{
    .el-form-item__content>div{
        // position: relative;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }
      .el-form-item__content{
        // line-height: 0;
      }
  }
  .dyeing-disable{
    .el-form-item{
      margin-bottom: 0 !important;
    }
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar{
    width: 7px;
    height: 7px;
    background-color: #F5F5F5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb{
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    background-color: #c8c8c8;
    &:hover{
      background-color: #888;
    }
  }
}

</style>
