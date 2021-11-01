<template>
  <div class="sample-analysis-details-page">
    <div class="sampleAnalysisHeader">
      <span class="sampleAnalysisText">客样分析申请</span>
      <div class="details-button">
        <el-button v-if="sampleAnalysisStaus === 'D'" size="mini" @click="submitApplication">提交申请</el-button>
        <el-button v-if="sampleAnalysisStaus === 'D'" size="mini" @click="detailEdit">编辑</el-button>
        <el-button v-if="sampleAnalysisStaus === 'D'" size="mini" type="danger" plain @click="detailDelete">删除</el-button>
        <el-button v-if="sampleAnalysisStaus === 'A' || sampleAnalysisStaus === 'S'" size="mini" @click="withdraw">取消申请</el-button>
        <el-button size="mini" @click="changeOwnerClick">更改所有人</el-button>
        <!-- <el-button v-if="sampleAnalysisStaus !== 'C' && sampleAnalysisStaus !== 'T'" size="mini" type="primary" plain @click="transform">转化</el-button> -->
        <!-- <changeOwner :ok-click="okClick" :visible="visible" @visibleClick="visiblePopOption" /> -->
        <!-- <el-button @click="$router.back()">返回</el-button> -->
      </div>
    </div>
    <!-- 状态控制 -->
    <div style="margin: 30px 0 0 0;">
      <div v-if="sampleAnalysisStaus !== 'R'" class="sampleAnalysisStatusLine">
        <div class="status" :class="{actived:onGoingStatus > -1}">草稿</div>
        <div class="dottedLine" :class="{actived:onGoingStatus > 0}" />
        <div class="status" :class="{actived:onGoingStatus > 0}">已提交</div>
        <div class="dottedLine" :class="{actived:onGoingStatus > 1}" />
        <div class="status" :class="{actived:onGoingStatus > 1}">分析中</div>
        <div class="dottedLine" :class="{actived:onGoingStatus > 2}" />
        <div class="status" :class="{actived:onGoingStatus > 2}">已完成</div>
        <!-- <div v-if="sampleAnalysisStaus !== 'T'" class="dottedLine" />
        <i v-if="sampleAnalysisStaus !== 'T'" class="el-icon-circle-close close" />
        <div v-if="sampleAnalysisStaus !== 'T'" class="closeTxt" @click="closedStateChange">关闭进度</div> -->
      </div>
      <div v-else class="closeStatus">
        <div class="closeDottedLine" />
        <div class="sampleAnalysisClosed">分析已取消</div>
        <div class="closeDottedLine" />
      </div>
    </div>
    <!-- <div v-if="sampleAnalysisStaus" style="display: flex; justify-content: space-between;">
      <el-steps v-if="sampleAnalysisStaus !== 'C'" :active="onGoingStatus" process-status="success" finish-status="success" align-center simple style="margin: 0px 10px 20px 0; width: 80%; font-size: 14px;">
        <template v-for="(item, index) in sampleAnalysisStatus">
          <el-step :key="index" style="cursor: pointer;" :title="item.label" @click.native="onGoingStatusChange(item)" />
        </template>
      </el-steps>
      <el-steps :active="closedState" process-status="success" finish-status="success" align-center simple style="margin: 0px 0 20px 0;flex: 1;">
        <el-step class="closedState" :title="'关闭'" @click.native="closedStateChange" />
      </el-steps>
    </div> -->
    <el-tabs v-if="sampleAnalysisStaus === 'C'" v-model="activeName" class="commonTabs">
      <el-tab-pane label="详细信息" name="detailed">
        <!-- 搜索表单 -->
        <div class="detailSearch" style="padding: 0 0 20px 0;">
          <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="detailsFormDatas" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="相关" name="relevant" style="padding-bottom: 20px;">
        <relevantTable :relevant-options="relevantModelDevelopOptions" />
      </el-tab-pane>
    </el-tabs>
    <!-- 搜索表单 -->
    <div v-else class="detailSearch">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="detailsFormDatas" />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="sampleAnalysisPopOptions" />
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
// import changeOwner from '@/views/crm/public/components/change-owner.vue'
import relevantTable from '@/views/crm/public/components/relevant-table.vue'
import { SampleAnalysis } from '../components/index'
import { SampleAnalysisRelevant } from '../components/relevantIndex.js'
import { PublicCrm } from '@/views/crm/public/index'
import uploadSlotTrigger from '../components/upload-slot-trigger.vue'
import uploadSlotTip from '../components/upload-slot-tip.vue'
import lineJump from '@/views/crm/public/components/line-jump.vue'
import lineJumpDownload from '@/views/crm/public/components/line-jump-download.vue'
import techDownload from '../components/tech-download.vue'
import status from '@/views/crm/public/config/status.js'

export default {
  components: {
    // changeOwner,
    relevantTable
  },
  mixins: [SampleAnalysis, PublicCrm, SampleAnalysisRelevant],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 手机验证正则
    // const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 数字验证
    // const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    // 邮箱验证正则
    // const emailReg = this.$getRules({ type: 'email', trigger: ['blur'] })
    // const emailReg2 = this.$getRules({ type: 'email2', trigger: ['blur'] })
    // 金额数字正则
    // const moneyReg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/, message: '请输入最多9位整数或保留1到2位小数', trigger: ['blur'] })

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
    // const popStyle = {
    //   'font-size': '14px',
    //   'color': '#333',
    //   'width': '100%',
    //   'background-color': '#eee',
    //   'padding': '10px',
    //   'border-radius': '2px',
    //   'margin-bottom': '15px'
    // }
    // const unrepeatStyle = {
    //   'width': '100%',
    //   'font-size': '12px',
    //   'color': '#009900',
    //   'background-color': '#eee',
    //   'textAlign': 'center',
    //   'padding': '5px',
    //   'margin-bottom': '15px'
    // }
    // 商机搜索
    const businessSearch = value => {
      if (value === '') {
        this.$set(this.sampleAnalysisPopOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData2) {
          this.getData2 = this.$utils.debounce(this.remoteBusinessPage, 300)
        }
        this.getData2({ name: value, dataTag: 'ALL' }, 0, this.sampleAnalysisPopOptions)
      }
    }

    // 商机change事件
    const businessChange = value => {
      console.log(value)
    }

    // pop弹出框配置信息
    const sampleAnalysisPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        const analysisTarget = params.analysisTarget.join('|')
        const brandId = params.brandId.value
        const brandName = params.brandId.label
        const businessOpportunityId = params.businessOpportunityId.value
        const businessOpportunityName = params.businessOpportunityId.label
        const customerId = params.businessOpportunityId.customerId
        const sellerTeamId = params.sellerTeamId.value
        const sellerTeamName = params.sellerTeamId.label
        const endTime = params.endTime ? new Date(params.endTime).getTime() : null
        const filePath = (params.filePath && params.filePath[0]) ? params.filePath[0].response ? params.filePath[0].response.data : params.filePath[0].url : null
        this.editSampleAnalysis({ ...params, analysisTarget, brandId, brandName, businessOpportunityId, businessOpportunityName, customerId, sellerTeamId, sellerTeamName, filePath, endTime }, true)
      },
      cancel: params => {
        this.closePopDialogHandle(this.sampleAnalysisPopOptions)
        // console.log(params)
      },
      formDatas: {
        filePath: null,
        analysisTarget: []
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'businessOpportunityId',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: businessSearch,
          // itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '商机',
          change: businessChange,
          valueType: 'object',
          valueKey: 'value',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '查找商机'
        },
        {
          prop: 'customerName',
          itemType: 'input',
          // labelWidth: '121px',
          disabled: true,
          // itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '客户',
          rules: [commonBlurReg],
          placeholder: '查找并选择商机后自动获取'
        },
        {
          prop: 'sellerTeamId',
          itemType: 'select',
          // itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '销售部门',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'sellerName',
          itemType: 'input',
          // labelWidth: '121px',
          disabled: true,
          // itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '销售员',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonBlurReg],
          placeholder: '请输入销售员'
        },
        {
          prop: 'brandId',
          itemType: 'select',
          // itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '品牌商',
          valueType: 'object',
          valueKey: 'value',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'year',
          itemType: 'select',
          // labelWidth: '121px',
          // itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '销售年度',
          // rules: [commonChangeReg],
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
          // itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '销售季度',
          // rules: [commonChangeReg],
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
          prop: 'endTime',
          itemType: 'date',
          type: 'datetime',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm',
          // labelWidth: '121px',
          // itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '完成日期',
          rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'hasSample',
          itemType: 'select',
          // itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '是否有客样',
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 'true',
              label: '是'
            },
            {
              value: 'false',
              label: '否'
            }
          ]
        },
        {
          prop: 'sampleId',
          itemType: 'input',
          // labelWidth: '121px',
          maxlength: 20,
          // itemStyle: { 'width': '53%', 'marginRight': '0px' },
          label: '客来板编号',
          // rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'analysisTarget',
          itemType: 'select',
          // itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '分析目的',
          multiple: true,
          collapseTags: true,
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 'O',
              label: '报价'
            },
            {
              value: 'D',
              label: '样板开发'
            },
            {
              value: 'S',
              label: '大货'
            }
          ]
        },
        {
          prop: 'customerRequirement',
          itemType: 'input',
          type: 'textarea',
          maxlength: 1000,
          autosize: { minRows: 2, maxRows: 4 },
          // itemStyle: { 'width': '100%', 'marginRight': '0px' },
          label: '客户要求',
          // rules: [commonChangeReg],
          dataSource: []
        },
        {
          prop: 'filePath',
          itemType: 'upload',
          label: '文件上传',
          className: 'upload-demo',
          // showFileList: false,
          onSuccess: (res, file) => {
            console.log(res, file)
            this.$message.success('导入成功')
            // this.$set(this.sampleAnalysisPopOptions.formDatas, 'filePath', res.data)
            // this.fetchLog(this.getLogMessages('IMPORT', '/userCenter/sysUser/batch/add'), file, JSON.stringify({ beforeText: `在'用户中心-员工管理'批量导入成功` }))
            // this.importPopDialogHandle()
            // this.closePopDialogHandle(this.enclosurePopOptions)
            // this.getfilePage()
          },
          onError: (res, file) => {
            // console.log(res, file)
          },
          onExceed: (files, fileList) => {
            this.$message.warning(`当前限制选择 1 个文件`)
          },
          beforeRemove: (file, fileList) => {
            return this.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1]) !== -1 ? this.$confirm(`确定移除 ${file.name}？`).then(() => {
              this.$set(this.sampleAnalysisPopOptions.formDatas, 'filePath', [])
              this.deleteAttachment({ bizType: 'SAMPLE_ANALYSIS', url: file.response.data })
            }) : true
          },
          beforeUpload: (file) => {
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
            bizType: 'SAMPLE_ANALYSIS'
          },
          accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX',
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
        label: '申请编号:',
        readonly: true
      },
      {
        components: {
          lineJump
        },
        componentsOptions: {
          prop: 'businessOpportunityName',
          label: '商机:'
          // text: '深圳市卓色文化艺术有限公司',
          // url: `/crm/business-opportunity/business-opportunity-details-page/${this.detailsFormDatas.businessOpportunityId}`
        }
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
        // disabled: true
        readonly: true
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
        prop: 'hasSample',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '是否有客样:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'endTime',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '完成日期:',
        // disabled: true
        readonly: true
      },
      {
        prop: 'analysisTarget',
        itemType: 'input',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '分析目的:',
        readonly: true
      },
      {
        prop: 'sampleId',
        itemType: 'input',
        // type: 'textarea',
        itemStyle: { 'width': '50%', 'marginRight': 0 },
        label: '客来板编号:',
        readonly: true
      },
      {
        components: {
          lineJumpDownload
        },
        componentsOptions: {
          prop: 'fileName',
          label: '文件名称:',
          bizType: 'SAMPLE_ANALYSIS'
          // text: '深圳市卓色文化艺术有限公司',
        //   url: `/crm/customer/customer-details-page/${this.$route.params.id}`
        }
      },
      {
        prop: 'customerRequirement',
        itemType: 'input',
        type: 'textarea',
        autosize: true,
        itemStyle: { 'width': '100%', 'marginRight': 0 },
        label: '客户要求:',
        readonly: true
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
        text: '分析工艺单信息',
        style
      },
      {
        components: {
          techDownload
        },
        componentsOptions: {
          prop: 'techAnalysisId',
          label: '工艺单编号:'
          // bizType: 'SAMPLE_ANALYSIS'
          // text: '深圳市卓色文化艺术有限公司',
        //   url: `/crm/customer/customer-details-page/${this.$route.params.id}`
        }
      },
      // {
      //   prop: 'techAnalysisId',
      //   itemType: 'input',
      //   itemStyle: { 'width': '50%', 'marginRight': 0 },
      //   label: '工艺单编号:',
      //   readonly: true
      // },
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
      // close: () => { this.$emit('visibleClick', false) },
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: this.okClick,
      cancel: params => {
        // this.PopDialogHandle()
        // this.$emit('visibleClick', false)
        this.$set(this.OwnerPopOptions, 'visible', false)
        // console.log(params)
      },
      formDatas: {
        // areaNum: 86
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
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
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '用户',
          dataSource: [],
          placeholder: '请查找用户'
        }
      ]
    }

    // 取消申请弹出框
    const withdrawPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '取消申请',
      // close: () => { this.$emit('visibleClick', false) },
      //   width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log(params)
        this.sampleAnalysisModifyStatus({ customerRequireId: this.routeId, status: 'R', ...params }, '取消申请成功')
      },
      cancel: params => {
        // this.PopDialogHandle()
        // this.$emit('visibleClick', false)
        this.$set(this.withdrawPopOptions, 'visible', false)
        // console.log(params)
      },
      formDatas: {
        // areaNum: 86
      },
      formOptions: {
        // inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'cancelReason',
          itemType: 'input',
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          maxlength: 1000,
          rules: [commonBlurReg],
          // itemStyle: { 'width': '50%', 'marginRight': 0 },
          label: '取消原因',
          dataSource: [],
          placeholder: '请输入'
        }
      ]
    }

    // 客样分析表格表头配置信息
    const modelDevelopColumns = [
      {
        prop: 'id',
        label: '序号',
        width: '60',
        formater: scope => {
          // console.log('scope', scope, this.pagination)
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        // return scope.$index + 1
        }
      },
      {
        prop: 'customerRequireId',
        label: '样板开发申请编号',
        minWidth: '160',
        showOverflowTooltip: true,
        handle: scope => {
          console.log('scope', scope)
          this.$router.push(`/crm/model-develop/model-develop-details-page/${scope.row.customerRequireId}`)
        },
        style: {
          color: '#1890ff',
          cursor: 'pointer'
        }
      },
      {
        prop: 'status',
        label: '样板开发申请状态',
        minWidth: '160',
        formater: scope => {
          // console.log('scope', scope, this.pagination)
          return scope.row[scope.column.property] ? status[scope.row[scope.column.property]] : ''
        // return scope.$index + 1
        }
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        }
      },
      {
        prop: 'follower',
        label: '所有人',
        showOverflowTooltip: true,
        minWidth: '80'
      }
    ]
    // relevantContractOptions表格弹框配置信息
    const relevantModelDevelopOptions = {
      relevantAddText: '关联',
      title: '样板开发申请',
      tip: 0,
      isTwo: true,
      hiddenAddButton: true,
      viewAll: () => {
        this.$router.push(`/crm/customer-sample-analysis/customer-sample-analysis-model-develop-index-page/${this.$route.params.id}`)
      },
      relevantAdd: () => {
        this.type = 'add'
      },
      dataSource: [],
      columns: modelDevelopColumns
    }

    return {
      formOtions: {
        inline: true
      },
      sampleAnalysisPopOptions,
      relevantModelDevelopOptions,
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
      modelDevelopTotal: 0,
      follower: null,
      businessOpportunityStage: [],
      //   closedState: -1,
      onGoingStatus: -1,
      sampleAnalysisStaus: '',
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
    businessOpportunityId() {
      return this.detailsFormDatas.businessOpportunityId
    },
    brandId() {
      return this.detailsFormDatas.brandId
    },
    sampleAnalysisApplyId() {
      return this.detailsFormDatas.sampleAnalysisApplyId
    }
  },
  watch: {
    modelDevelopTotal() {
      this.$set(this.relevantModelDevelopOptions, 'tip', this.modelDevelopTotal || 0)
    },
    customerId(newVal, oldNew) {
      this.$set(this.baseSearchData[3].componentsOptions, 'url', `/crm/customer/customer-details-page/${newVal}`)
    },
    businessOpportunityId(newVal, oldNew) {
      this.$set(this.baseSearchData[2].componentsOptions, 'url', `/crm/business-opportunity/business-opportunity-details-page/${newVal}`)
    },
    brandId(newVal, oldNew) {
      this.$set(this.baseSearchData[6].componentsOptions, 'url', `/crm/brand-business/brand-business-details-page/${newVal}`)
    },
    sampleAnalysisApplyId(newVal, oldNew) {
      this.$set(this.doneSearchData[18].componentsOptions, 'sampleAnalysisApplyId', newVal)
    }
  },
  created() {
    // this.getSampleAnalysisSourceOptions()
    // this.getCustomerLeveList()
    // this.getCustomerTypeList()
    // this.getBusinessOpportunityStage()
    this.routeId && this.getSampleAnalysisInfoDisplay({ customerRequireId: this.routeId })
    // this.getfilePage()
  },
  methods: {
    // 编辑
    detailEdit() {
      this.PopDialogHandle(this.sampleAnalysisPopOptions, '编辑客样分析申请')
      this.getSampleAnalysisInfo({ customerRequireId: this.routeId })
    },

    // 删除
    detailDelete() {
      this.$confirm(' 你确认要删除该客样分析申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.deleteSampleAnalysis({ customerRequireId: this.routeId }, true)
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
        this.sampleAnalysisModifyStatus({ customerRequireId: this.routeId, status: 'S' }, '提交申请成功')
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
      if (this.sampleAnalysisStaus !== 'T') {
        if (value === 'T') {
          this.$message.warning('请点击右上角转化按钮')
        } else if (this.sampleAnalysisStaus !== value) {
          this.sampleAnalysisStausModify({ sampleAnalysisStaus: value })
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
        if (this.sampleAnalysisStaus !== 'C') {
          this.sampleAnalysisStausModify({ sampleAnalysisStaus: 'C' })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }

    // visiblePopOption(data) {
    //   this.vis
    // }
  }
}
</script>

<style lang='scss' scoped>
.sample-analysis-details-page {
    margin:20px;
    background-color: #fff;

    .sampleAnalysisHeader {
        height: 60px;
        border-bottom: 1px solid #E9EFF2;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .sampleAnalysisText {
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
.sample-analysis-details-page {
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

  .commonTabs {
    padding: 20px 40px 0;
    .el-tabs__item {
      line-height: 20px;
      font-size: 14px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
    // .el-tabs__content {
    //   margin: 0 -40px;
    // }
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
  .sampleAnalysisStatusLine {
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
    .sampleAnalysisClosed {
      font-size: 14px;
      color: #BBC2D0;
      margin: 0 15px;
    }
  }
}
</style>

