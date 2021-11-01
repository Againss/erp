<template>
  <div class="model-develop-details-page">
    <div class="modelDevelopHeader">
      <span class="modelDevelopText">样板开发申请</span>
      <div class="details-button">
        <el-button v-if="modelDevelopStaus === 'D'" size="mini" @click="submitApplication">提交申请</el-button>
        <el-button v-if="modelDevelopStaus === 'D'" size="mini" @click="detailEdit">编辑</el-button>
        <el-button v-if="modelDevelopStaus === 'D'" size="mini" type="danger" plain @click="detailDelete">删除</el-button>
        <el-button v-if="modelDevelopStaus === 'P' || modelDevelopStaus === 'S'" size="mini" @click="withdraw">取消申请</el-button>
        <el-button size="mini" @click="changeOwnerClick">更改所有人</el-button>
      </div>
    </div>
    <!-- 状态控制 -->
    <div style="margin: 30px 0 0 0;">
      <div v-if="modelDevelopStaus !== 'R'" class="modelDevelopStatusLine">
        <div class="status" :class="{actived:onGoingStatus > -1}">草稿</div>
        <div class="dottedLine" :class="{actived:onGoingStatus > 0}" />
        <div class="status" :class="{actived:onGoingStatus > 0}">已提交</div>
        <div class="dottedLine" :class="{actived:onGoingStatus > 1}" />
        <div class="status" :class="{actived:onGoingStatus > 1}">生产中</div>
        <div class="dottedLine" :class="{actived:onGoingStatus > 2}" />
        <div class="status" :class="{actived:onGoingStatus > 2}">已完成</div>
      </div>
      <div v-else class="closeStatus">
        <div class="closeDottedLine" />
        <div class="modelDevelopClosed">样板开发已取消</div>
        <div class="closeDottedLine" />
      </div>
    </div>
    <!-- 搜索表单 -->
    <div class="detailSearch">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="detailsFormDatas" />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="modelDevelopPopOptions" />
    </div>
    <!-- 导入更改所有人pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="OwnerPopOptions" />
    </div>
    <!-- 取消申请pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="withdrawPopOptions" />
    </div>
  </div>
</template>

<script>
import { ModelDevelop } from '../components/index'
import { ModelDevelopRelevant } from '../components/relevantIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
import uploadSlotTrigger from '../components/upload-slot-trigger.vue'
import uploadSlotTip from '../components/upload-slot-tip.vue'
import lineJump from '@/views/crm/public/components/line-jump.vue'
import lineJumpDownload from '@/views/crm/public/components/line-jump-download.vue'

export default {
  components: {
    // changeOwner,
    // relevantTable
  },
  mixins: [ModelDevelop, PublicCrm, ModelDevelopRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 金额数字正则
    const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })

    // 公用组件样式
    const style = {
      'width': '100%',
      'font-size': '16px',
      'font-weight': '400',
      'letter-spacing': '2px',
      'color': '#333',
      'border-bottom': '1px #EEEFF0 solid',
      'margin-top': '20px',
      'padding-bottom': '10px',
      'margin-bottom': '10px'
    }

    // pop弹出框配置信息
    const modelDevelopPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        const brandId = params.brandId.value
        const brandName = params.brandId.label
        const sellerTeamId = params.sellerTeamId.value
        const sellerTeamName = params.sellerTeamId.label
        const orderFilePath = (params.orderFilePath && params.orderFilePath[0]) ? params.orderFilePath[0].response ? params.orderFilePath[0].response.data : params.orderFilePath[0].url : null
        const styleFilePath = (params.styleFilePath && params.styleFilePath[0]) ? params.styleFilePath[0].response ? params.styleFilePath[0].response.data : params.styleFilePath[0].url : null
        const otherFilePath = (params.otherFilePath && params.otherFilePath[0]) ? params.otherFilePath[0].response ? params.otherFilePath[0].response.data : params.otherFilePath[0].url : null
        const totalAmount = params.totalAmount && (params.totalAmount * 10000).toFixed()
        this.editModelDevelop({ ...params, brandId, brandName, sellerTeamId, sellerTeamName, orderFilePath, styleFilePath, otherFilePath, totalAmount }, true)
      },
      cancel: params => {
        this.closePopDialogHandle(this.modelDevelopPopOptions)
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'sampleAnalysisId',
          itemType: 'input',
          readonly: true,
          label: '客样分析申请',
          disabled: true,
          focus: params => {
            // this.PopDialogHandle(this.sampleAnalysisPopOptions, '选择客样分析申请')
          },
          rules: [commonChangeReg],
          placeholder: '选择客样分析申请'
        },
        {
          prop: 'developType',
          itemType: 'select',
          label: '样板开发类型',
          rules: [commonChangeReg],
          dataSource: [
            {
              label: '品质办',
              value: 'Q'
            },
            {
              label: 'Fit Sample',
              value: 'F'
            },
            {
              label: 'AD Sample',
              value: 'A'
            },
            {
              label: '试纱办',
              value: 'G'
            },
            {
              label: '试规格办',
              value: 'S'
            },
            {
              label: 'LA Sample',
              value: 'L'
            }
          ]
        },
        {
          prop: 'sellerTeamId',
          itemType: 'select',
          label: '销售部门',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'sellerName',
          itemType: 'input',
          disabled: true,
          label: '销售员',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonBlurReg],
          placeholder: '请输入销售员'
        },
        {
          prop: 'customerName',
          itemType: 'input',
          disabled: true,
          label: '客户',
          rules: [commonBlurReg],
          placeholder: '查找并选择客样分析后自动获取'
        },
        {
          prop: 'brandId',
          itemType: 'select',
          label: '品牌商',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'year',
          itemType: 'select',
          label: '销售年度',
          dataSource: [
            {
              value: '2019',
              label: '2019'
            },
            {
              value: '2020',
              label: '2020'
            },
            {
              value: '2021',
              label: '2021'
            },
            {
              value: '2022',
              label: '2022'
            }
          ]
        },
        {
          prop: 'quarter',
          itemType: 'select',
          label: '销售季度',
          dataSource: [
            {
              value: 'Spr',
              label: 'Spr'
            },
            {
              value: 'Sum',
              label: 'Sum'
            },
            {
              value: 'Fall',
              label: 'Fall'
            },
            {
              value: 'Winter',
              label: 'Winter'
            }
          ]
        },
        {
          prop: 'totalAmount',
          itemType: 'input',
          label: '合计金额',
          maxlength: 12,
          rules: [commonBlurReg, moneyReg],
          placeholder: '请输入数字'
        },
        {
          prop: 'remark',
          itemType: 'input',
          type: 'textarea',
          maxlength: 1000,
          autosize: { minRows: 2, maxRows: 4 },
          label: '注意事项',
          placeholder: '请输入',
          dataSource: []
        },
        {
          prop: 'orderFilePath',
          itemType: 'upload',
          label: '客户订单',
          className: 'upload-demo',
          onSuccess: (res, file) => {
            console.log(res, file)
            this.$message.success('导入成功')
          },
          onError: (res, file) => {
            // console.log(res, file)
          },
          onExceed: (files, fileList) => {
            this.$message.warning(`当前限制选择 1 个文件`)
          },
          beforeRemove: (file, fileList) => {
            return this.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1]) !== -1 ? this.$confirm(`确定移除 ${file.name}？`).then(() => {
              this.$set(this.modelDevelopPopOptions.formDatas, 'orderFilePath', [])
              this.deleteAttachment({ bizType: 'MODEL_DEVELOP_ORDER', url: file.response.data })
            }) : true
          },
          beforeUpload: (file) => {
            // console.log(file.type.split('/')[1])
            const fileName = file.name.split('.')
            const fileType = fileName[fileName.length - 1]
            const regexp = new RegExp(fileType)
            const isXls = regexp.test(this.accept)
            console.log(file, fileType, regexp, isXls)
            const isLt1M = file.size / 1024 / 1024 <= 10
            if (!isXls) {
              this.$message.error('上传文件只能是 pdf/word/excel/ppt/jpg/png 格式!')
            } else if (!isLt1M) {
              this.$message.error('上传文件大小不能超过 10MB!')
            }
            return isXls && isLt1M
          },
          action: `/crm/attachment/upload`,
          data: {
            // bizId: this.routeId,
            // follower: this.follower,
            bizType: 'MODEL_DEVELOP_ORDER'
          },
          accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG',
          showFileList: true,
          fileList: this.fileList,
          limit: 1,
          timeout: 30000,
          content: [
            {
              slot: 'trigger',
              component: uploadSlotTrigger
            },
            {
              slot: 'tip',
              component: uploadSlotTip
            }
          ]
        },
        {
          prop: 'styleFilePath',
          itemType: 'upload',
          label: '成衣款式',
          className: 'upload-demo',
          // showFileList: false,
          onSuccess: (res, file) => {
            console.log(res, file)
            this.$message.success('导入成功')
          },
          onError: (res, file) => {
            // console.log(res, file)
          },
          onExceed: (files, fileList) => {
            this.$message.warning(`当前限制选择 1 个文件`)
          },
          beforeRemove: (file, fileList) => {
            return this.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1]) !== -1 ? this.$confirm(`确定移除 ${file.name}？`).then(() => {
              this.$set(this.modelDevelopPopOptions.formDatas, 'styleFilePath', [])
              this.deleteAttachment({ bizType: 'MODEL_DEVELOP_STYLE', url: file.response.data })
            }) : true
          },
          beforeUpload: (file) => {
            // console.log(file.type.split('/')[1])
            const fileName = file.name.split('.')
            const fileType = fileName[fileName.length - 1]
            const regexp = new RegExp(fileType)
            const isXls = regexp.test(this.accept)
            console.log(file, fileType, regexp, isXls)
            const isLt1M = file.size / 1024 / 1024 <= 10
            if (!isXls) {
              this.$message.error('上传文件只能是 pdf/word/excel/ppt/jpg/png 格式!')
            } else if (!isLt1M) {
              this.$message.error('上传文件大小不能超过 10MB!')
            }
            return isXls && isLt1M
          },
          action: `/crm/attachment/upload`,
          data: {
            // bizId: this.routeId,
            // follower: this.follower,
            bizType: 'MODEL_DEVELOP_STYLE'
          },
          accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG',
          showFileList: true,
          fileList: this.fileList,
          limit: 1,
          timeout: 30000,
          content: [
            {
              slot: 'trigger',
              component: uploadSlotTrigger
            },
            {
              slot: 'tip',
              component: uploadSlotTip
            }
          ]
        },
        {
          prop: 'otherFilePath',
          itemType: 'upload',
          label: '其他',
          className: 'upload-demo',
          // showFileList: false,
          onSuccess: (res, file) => {
            console.log(res, file)
            this.$message.success('导入成功')
          },
          onError: (res, file) => {
            // console.log(res, file)
          },
          onExceed: (files, fileList) => {
            this.$message.warning(`当前限制选择 1 个文件`)
          },
          beforeRemove: (file, fileList) => {
            return this.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1]) !== -1 ? this.$confirm(`确定移除 ${file.name}？`).then(() => {
              this.$set(this.modelDevelopPopOptions.formDatas, 'otherFilePath', [])
              this.deleteAttachment({ bizType: 'MODEL_DEVELOP_OTHER', url: file.response.data })
            }) : true
          },
          beforeUpload: (file) => {
            // console.log(file.type.split('/')[1])
            const fileName = file.name.split('.')
            const fileType = fileName[fileName.length - 1]
            const regexp = new RegExp(fileType)
            const isXls = regexp.test(this.accept)
            console.log(file, fileType, regexp, isXls)
            const isLt1M = file.size / 1024 / 1024 <= 10
            if (!isXls) {
              this.$message.error('上传文件只能是 pdf/word/excel/ppt/jpg/png 格式!')
            } else if (!isLt1M) {
              this.$message.error('上传文件大小不能超过 10MB!')
            }
            return isXls && isLt1M
          },
          action: `/crm/attachment/upload`,
          data: {
            // bizId: this.routeId,
            // follower: this.follower,
            bizType: 'MODEL_DEVELOP_OTHER'
          },
          accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG',
          showFileList: true,
          fileList: this.fileList,
          limit: 1,
          timeout: 30000,
          content: [
            {
              slot: 'trigger',
              component: uploadSlotTrigger
            },
            {
              slot: 'tip',
              component: uploadSlotTip
            }
          ]
        }
      ]
    }

    const baseSearchData = [
      {
        itemType: 'view',
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        text: '基本信息',
        style
      },
      {
        prop: 'customerRequireId',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '样板申请编号:',
        readonly: true
      },
      {
        components: {
          lineJump
        },
        componentsOptions: {
          prop: 'sampleAnalysisId',
          label: '客样分析申请:'
          // text: '深圳市卓色文化艺术有限公司',
          // url: `/crm/business-opportunity/business-opportunity-details-page/${this.detailsFormDatas.businessOpportunityId}`
        }
      },
      {
        prop: 'developType',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '样板开发类型:',
        readonly: true
      },
      {
        prop: 'sellerTeamName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '销售团队:',
        readonly: true
      },
      {
        prop: 'sellerName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '销售员:',
        readonly: true
      },
      {
        components: {
          lineJump
        },
        componentsOptions: {
          prop: 'customerName',
          label: '客户:'
          // text: '深圳市卓色文化艺术有限公司',
          // url: `/crm/customer/customer-details-page/${this.detailsFormDatas.customerId}`
        }
      },
      {
        components: {
          lineJump
        },
        componentsOptions: {
          prop: 'brandName',
          label: '品牌商:'
          // text: '深圳市卓色文化艺术有限公司',
          // url: `/crm/brand-business/brand-business-details-page/${this.detailsFormDatas.brandId}`
        }
      },
      {
        prop: 'year',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '销售年度:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'quarter',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '销售季度:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'totalAmount',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '合计金额:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '注意事项:',
        readonly: true
      },
      {
        components: {
          lineJumpDownload
        },
        componentsOptions: {
          prop: 'orderFileName',
          label: '客户订单:',
          bizType: 'MODEL_DEVELOP_ORDER'
        }
      },
      {
        components: {
          lineJumpDownload
        },
        componentsOptions: {
          prop: 'styleFileName',
          label: '成衣款式:',
          bizType: 'MODEL_DEVELOP_STYLE'
        }
      },
      {
        components: {
          lineJumpDownload
        },
        componentsOptions: {
          prop: 'otherFileName',
          label: '其他:',
          bizType: 'MODEL_DEVELOP_OTHER'
        }
      }
    ]
    const systemSearchData = [
      {
        itemType: 'view',
        text: '系统信息',
        style
      },
      {
        prop: 'follower',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '所有人:',
        readonly: true
      },
      {
        prop: 'createdBy',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '创建人:',
        readonly: true
      },
      {
        prop: 'createdTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '创建日期:',
        readonly: true
      },
      {
        prop: 'updatedBy',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '上次修改人:',
        readonly: true
      },
      {
        prop: 'updatedTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '上次修改日期:',
        readonly: true
      }
    ]
    // 草稿
    const draftSearchData = [
      ...baseSearchData,
      ...systemSearchData
    ]
    // 已提交
    const submittedSearchData = [
      ...baseSearchData,
      {
        prop: 'commitTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '提交日期:',
        readonly: true
      },
      ...systemSearchData
    ]
    // 分析中
    const analysisSearchData = [
      ...baseSearchData,
      {
        prop: 'commitTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '提交日期:',
        readonly: true
      },
      {
        prop: 'customerServiceName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '客服:',
        readonly: true
      },
      ...systemSearchData
    ]
    // 已完成
    const doneSearchData = [
      ...baseSearchData,
      {
        prop: 'commitTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '提交日期:',
        readonly: true
      },
      {
        prop: 'customerServiceName',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '客服:',
        readonly: true
      },
      {
        itemType: 'view',
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        text: '样板开发单',
        style
      },
      {
        prop: 'modelDevelopId',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '样板开发单编号:',
        readonly: true
      },
      ...systemSearchData
    ]
    // 已取消
    const cancelledSearchData = [
      ...baseSearchData,
      {
        prop: 'commitTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '提交日期:',
        readonly: true
      },
      {
        prop: 'cancelTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '取消日期:',
        readonly: true
      },
      {
        prop: 'cancelReason',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '取消原因:',
        readonly: true
      },
      ...systemSearchData
    ]

    // 更改所有人pop弹出框配置信息
    const OwnerPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '更改所有人',
      customClass: 'popOptionsClass',
      ok: this.okClick,
      cancel: params => {
        this.$set(this.OwnerPopOptions, 'visible', false)
      },
      formDatas: {
      },
      formOptions: {
      },
      content: [
        {
          prop: 'follower',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: this.remoteUserSearch,
          loading: false,
          rules: [commonBlurReg],
          label: '用户',
          dataSource: [],
          placeholder: '请查找用户'
        }
      ]
    }

    const withdrawPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '取消申请',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log(params)
        this.modelDevelopModifyStatus({ customerRequireId: this.routeId, status: 'R', ...params }, '取消申请成功')
      },
      cancel: params => {
        this.$set(this.withdrawPopOptions, 'visible', false)
      },
      formDatas: {
      },
      formOptions: {
      },
      content: [
        {
          prop: 'cancelReason',
          itemType: 'input',
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          maxlength: 1000,
          rules: [commonBlurReg],
          label: '取消原因',
          dataSource: [],
          placeholder: '请输入'
        }
      ]
    }

    return {
      formOtions: {
        inline: true
      },
      modelDevelopPopOptions,
      OwnerPopOptions,
      withdrawPopOptions,
      searchData: [],
      baseSearchData,
      draftSearchData,
      submittedSearchData,
      analysisSearchData,
      doneSearchData,
      cancelledSearchData,
      detailsFormDatas: {},
      activeName: 'detailed',
      visible: false,
      // fileTotal: 0,
      follower: null,
      businessOpportunityStage: [],
      onGoingStatus: -1,
      modelDevelopStaus: '',
      accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG'
    }
  },
  computed: {
    routeId() {
      return this.$route.params.id
    },
    customerId() {
      return this.detailsFormDatas.customerId
    },
    sampleAnalysisId() {
      return this.detailsFormDatas.sampleAnalysisId
    },
    brandId() {
      return this.detailsFormDatas.brandId
    }
  },
  watch: {
    customerId(newVal, oldNew) {
      this.$set(this.baseSearchData[6].componentsOptions, 'url', `/crm/customer/customer-details-page/${newVal}`)
    },
    sampleAnalysisId(newVal, oldNew) {
      this.$set(this.baseSearchData[2].componentsOptions, 'url', `/crm/customer-sample-analysis/customer-sample-analysis-details-page/${newVal}`)
    },
    brandId(newVal, oldNew) {
      this.$set(this.baseSearchData[7].componentsOptions, 'url', `/crm/brand-business/brand-business-details-page/${newVal}`)
    }
  },
  created() {
    this.routeId && this.getModelDevelopInfoDisplay({ customerRequireId: this.routeId })
    // this.getfilePage()
  },
  methods: {
    // 编辑
    detailEdit() {
      this.PopDialogHandle(this.modelDevelopPopOptions, '编辑样板开发申请')
      this.getModelDevelopInfo({ customerRequireId: this.routeId })
    },

    // 删除
    detailDelete() {
      this.$confirm(' 你确认要删除该样板开发申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteModelDevelop({ customerRequireId: this.routeId }, true)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },

    // 提交申请点击事件
    submitApplication() {
    //   console.log(111)
      this.$confirm('确定提交申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.modelDevelopModifyStatus({ customerRequireId: this.routeId, status: 'S' }, '提交申请成功')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    // 取消申请
    withdraw() {
      this.PopDialogHandle(this.withdrawPopOptions)
    },

    // 进行状态点击事件
    onGoingStatusChange(value) {
      console.log(value)
      if (this.modelDevelopStaus !== 'T') {
        if (value === 'T') {
          this.$message.warning('请点击右上角转化按钮')
        } else if (this.modelDevelopStaus !== value) {
          this.modelDevelopStausModify({ modelDevelopStaus: value })
        }
      }
    },

    // 点击关闭状态
    closedStateChange() {
      this.$confirm('此操作将关闭线索进度, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.modelDevelopStaus !== 'C') {
          this.modelDevelopStausModify({ modelDevelopStaus: 'C' })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.model-develop-details-page {
    margin:20px;
    background-color: #fff;

    .modelDevelopHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .modelDevelopText {
      font-size: 18px;
      font-weight: 400;
      color: '#151222';
      flex:1;
      margin-left: 20px;
    }

    .details-button {
        display: flex;
        margin-right: 20px;
    }
}
</style>

<style lang="scss">
.model-develop-details-page {
  .detailSearch {
    // padding: 10px;
    padding: 0 40px 20px;

    .el-input__inner,.el-textarea__inner {
      border: 0;
      // border-bottom: 1px;
    }

    .el-form-item__label {
      color: #888E9E
    }

    .el-form-item {
      margin-bottom: 0px;
    }

    .el-input__inner {
      padding: 0 8px;
    }
  }
  .el-textarea__inner { //el_input中的隐藏属性
    resize: none;  //主要是这个样式
  }

  .closedState {
    font-size: 14px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    .el-step__main {
      flex-grow: inherit;
    }
  }
  .el-step__main {
    .el-step__title {
      font-size: 14px;
    }
  }

  // 状态样式
  .modelDevelopStatusLine {
    display: flex;
    align-items: center;
    justify-content: center;
    .dottedLine {
      height: 1px;
      width: 191px;
      border-bottom: 1px dotted  #D3D3D3;
    }
    .dottedLine.actived {
      border-bottom-color: #3ED7D9;
    }
    .status {
      width: 62px;
      line-height: 62px;
      height: 62px;
      font-size: 14px;
      color: #BDBDBD;
      border-radius: 50%;
    //   cursor: pointer;
      background: #ECECEC;
      text-align: center;
    }
    .status.actived {
      background: #3ED7D9;
      color: #fff;
    }
    .close {
      color: #A5AEB7;
      font-size: 16px;
      margin: 0 12px 0 15px;
    }
    .closeTxt {
      cursor: pointer;
      font-size: 14px;
      color: #44494C;
    }
  }
  .closeStatus {
    display: flex;
    align-items: center;
    justify-content: center;
    .closeDottedLine {
      height: 1px;
      width: 380px;
      border-bottom: 1px dotted #B9B9B9;
    }
    .modelDevelopClosed {
      font-size: 14px;
      color: #BBC2D0;
      margin: 0 15px;
    }
  }
}
</style>

