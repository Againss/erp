<!--
 * @Descripttion: 客样分析申请详情
 * @version:
 * @Author: shujing
 * @Date: 2020-11-16 14:58:13
-->
<template>
  <div class="guest-application-detail">
    <!--状态栏信息 -->
    <div class="guest-application-top">
      <div class="guest-item-codeinfo">
        <div class="code-item">申请单号：{{ formDatas.id }}</div>
      </div>
      <div v-show="formDatas.status === 1" class="descripte">
        <div style="margin-right: 6px">申请人：{{ formDatas.createdBy }}</div>
        <div style="margin-right: 6px">
          申请时间: {{ formDatas.createdTime }}
        </div>
        <div>状态：</div>
        <span style="color: #888e9e">{{ getStatus(formDatas.status) }}</span>
      </div>
      <div
        v-show="formDatas.status === 2 || formDatas.status === 3"
        class="descripte"
      >
        <div style="margin-right: 6px">申请人：{{ formDatas.createdBy }}</div>
        <div style="margin-right: 6px">
          申请时间: {{ formDatas.createdTime }}
        </div>
        <div style="margin-right: 6px">提交人：{{ formDatas.submitBy }}</div>
        <div style="margin-right: 6px">
          提交时间: {{ formDatas.submitTime }}
        </div>
        <div>状态：</div>
        <span v-show="formDatas.status === 2" style="color: #ff3333">{{
          getStatus(formDatas.status)
        }}</span>
        <div v-show="formDatas.status === 3">
          {{ getStatus(formDatas.status) }}
        </div>
      </div>
      <div v-show="formDatas.status === 4" class="descripte">
        <div style="margin-right: 6px">申请人：{{ formDatas.createdBy }}</div>
        <div style="margin-right: 6px">
          申请时间: {{ formDatas.createdTime }}
        </div>
        <div style="margin-right: 6px">提交人：{{ formDatas.submitBy }}</div>
        <div style="margin-right: 6px">
          提交时间: {{ formDatas.submitTime }}
        </div>
        <div style="margin-right: 6px">取消人：{{ formDatas.cancelBy }}</div>
        <div style="margin-right: 6px">
          取消时间: {{ formDatas.submitTime }}
        </div>
        <div>状态：</div>
        <span style="color: #666666">{{ getStatus(formDatas.status) }}</span>
      </div>
    </div>
    <div class="guest-application-content">
      <!-- <div class="guest-application-title">基本信息</div> -->
      <!-- 详情信息-展示 -->
      <div v-if="edit === 'show'" class="guest-application-info">
        <cs-custom-form
          ref="showData"
          :class="getEditClasse"
          :data-source="showInfoData"
          :options="formOtions"
          :form-datas="formDatas"
        />
      </div>
      <!-- 详情信息-编辑 -->
      <div v-if="edit === 'edit'" class="guest-application-edit">
        <cs-custom-form
          ref="eidtData"
          :data-source="editInfoData"
          :options="formOtions"
          :form-datas="formDatas"
        />
      </div>
    </div>
    <!-- 操作信息 -->
    <div class="guest-application-foot">
      <div
        v-show="edit !== 'edit' && formDatas.status === 1"
        class="btn-groups"
      >
        <el-button
          v-permission="['customerOrder:sampleAnalysisApply:modify']"
          type="primary"
          @click="guestEdit"
        >编辑</el-button>
        <el-button
          v-permission="['customerOrder:sampleAnalysisApply:submit']"
          @click="guestCommit"
        >提交</el-button>
        <el-button
          v-permission="['customerOrder:sampleAnalysisApply:add']"
          @click="guestCopy"
        >复制</el-button>
        <el-button
          v-permission="['customerOrder:sampleAnalysisApply:delete']"
          @click="guestDelete"
        >删除</el-button>
        <el-button @click="guestBack">返回</el-button>
      </div>
      <div
        v-show="edit !== 'edit' && formDatas.status === 2"
        class="btn-groups"
      >
        <el-button
          v-permission="['customerOrder:sampleAnalysisApply:cancel']"
          type="primary"
          @click="guestCancel"
        >取消</el-button>
        <el-button
          v-permission="['customerOrder:sampleAnalysisApply:add']"
          @click="guestCopy"
        >复制</el-button>
        <el-button
          v-permission="['customerOrder:sampleAnalysisApply:preview']"
          @click="guestPrint"
        >打印预览</el-button>
        <el-button @click="guestBack">返回</el-button>
      </div>
      <div
        v-show="
          edit !== 'edit' && (formDatas.status === 3 || formDatas.status === 4)
        "
        class="btn-groups"
      >
        <el-button
          v-permission="['customerOrder:sampleAnalysisApply:add']"
          @click="guestCopy"
        >复制</el-button>
        <el-button @click="guestBack">返回</el-button>
      </div>
      <div v-show="edit === 'edit'" class="btn-groups">
        <el-button @click="editCancel">取消</el-button>
        <el-button type="primary" @click="guestSave">保存</el-button>
      </div>
    </div>
    <!-- 操作信息 -->
    <!-- <div class="button-top">
      <div v-show="edit !== 'edit' && formDatas.status === 1" class="button-option">
        <el-button v-permission="['customerOrder:sampleAnalysisApply:modify']" size="small" type="primary" @click="guestEdit">编辑</el-button>
        <el-button v-permission="['customerOrder:sampleAnalysisApply:submit']" size="small" @click="guestCommit">提交</el-button>
        <el-button v-permission="['customerOrder:sampleAnalysisApply:add']" size="small" @click="guestCopy">复制</el-button>
        <el-button v-permission="['customerOrder:sampleAnalysisApply:delete']" size="small" @click="guestDelete">删除</el-button>
        <el-button size="small" @click="guestBack">返回</el-button>
      </div>
      <div v-show="edit !== 'edit' && formDatas.status === 2" class="button-option">
        <el-button v-permission="['customerOrder:sampleAnalysisApply:cancel']" size="small" type="primary" @click="guestCancel">取消</el-button>
        <el-button v-permission="['customerOrder:sampleAnalysisApply:add']" size="small" @click="guestCopy">复制</el-button>
        <el-button v-permission="['customerOrder:sampleAnalysisApply:preview']" size="small" @click="guestPrint">打印预览</el-button>
        <el-button size="small" @click="guestBack">返回</el-button>
      </div>
      <div v-show="edit !== 'edit' && (formDatas.status === 3 || formDatas.status === 4)" class="button-option">
        <el-button v-permission="['customerOrder:sampleAnalysisApply:add']" size="small" @click="guestCopy">复制</el-button>
        <el-button size="small" @click="guestBack">返回</el-button>
      </div>
      <div v-show="edit === 'edit'" class="button-option">
        <el-button size="small" @click="editCancel">取消</el-button>
        <el-button size="small" type="primary" @click="guestSave">保存</el-button>
      </div>

    </div> -->
  </div>
</template>
<script>
// import uploadSlotTip from './component/upload-slot-tip'
import { applyDetail, addSave, modifySave, guestapplyCommit, guestapplyDelete, guestapplyCancel, userSelet, sellTeamselet, brandSelet, yearSelet, downFile } from './api/index.js'
import uploadSlotTrigger from './component/upload-slot-trigger'
import uploadFile from './component/uploa-file'
import { isArray } from '@/utils/validate'
import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  mixins: [logMethods],
  data() {
    // 基本信息样式
    const basisstyle = {
      'width': '100%',
      'font-size': '16px',
      'color': '#151222',
      'border-bottom': '1px solid #efefef',
      'padding': '16px 0',
      // 'font-weight': 'bolder',
      // 'margin-top': '20px',
      // 'padding': '10px',
      'margin-bottom': '20px',
      'padding-left': '20px',
      'padding-top': ' 20px'
    }

    // 小标题样式
    const titlestyle = {
      'width': '46%',
      'font-size': '16px',
      'color': '#151222',
      // 'font-weight': 'bolder',
      'margin-top': '20px',
      'padding-left': '20px'
      // 'margin': '10px',

    }
    // 小标题样式
    const titlestyleOther = {
      'width': '50%',
      'font-size': '16px',
      'color': '#151222',
      // 'font-weight': 'bolder',
      'margin-top': '20px',
      'padding-left': '20px'
      // 'margin': '10px',

    }
    // 分割线
    const lineStyle = {
      'width': '100%',
      'height': '15px',
      'background': '#EEF5F9'
    }
    // 详情展示数据信息
    const showInfoData = [
      {
        itemType: 'view',
        text: '基本信息',
        style: basisstyle
      },
      {
        prop: 'id',
        itemType: 'input',
        itemStyle: { 'width': '29%', 'margin': '10px 2%', 'display': 'none' },
        label: '申请单号:',
        readonly: true
      },
      {
        // prop: 'customerServiceName',
        // itemType: 'input',
        prop: 'customerService',
        itemType: 'select',
        valueType: 'object',
        valueKey: 'value',
        filterable: true,
        itemStyle: { 'width': '29%', 'margin': '0px 2%' },
        label: '客服:',
        disabled: true,
        showMessage: false,
        placeholder: '',
        rules: [{ message: '', trigger: 'blur' }]
        // readonly: true
      },
      {
        // prop: 'sellerName',
        // itemType: 'input',
        prop: 'seller',
        itemType: 'select',
        valueType: 'object',
        valueKey: 'value',
        filterable: true,
        itemStyle: { 'width': '29%', 'margin': '0px 2%' },
        label: '销售员:',
        disabled: true,
        rules: [{ message: '', trigger: 'blur' }],
        placeholder: '',
        showMessage: false
        // valueType: 'object',
        // readonly: true
      },
      {
        // prop: 'sellerTeamName
        // itemType: 'input',
        prop: 'sellerTeam',
        itemType: 'select',
        valueType: 'object',
        valueKey: 'value',
        itemStyle: { 'width': '29%', 'margin': '0px 2%' },
        label: '销售团队:',
        rules: [{ message: '', trigger: 'blur' }],
        showMessage: false,
        placeholder: '',
        disabled: true
      },
      {
        prop: 'brand',
        itemType: 'select',
        itemStyle: { 'width': '29%', 'margin': '0px 2%' },
        label: '品牌商:',
        filterable: true,
        valueType: 'object',
        valueKey: 'value', //
        rules: [{ message: '', trigger: 'blur' }],
        showMessage: false,
        placeholder: '',
        disabled: true
      },
      {
        prop: 'year',
        itemType: 'input',
        itemStyle: { 'width': '29%', 'margin': '0px 2%' },
        label: '销售年度:',
        readonly: true
      },
      {
        prop: 'quarter',
        itemType: 'input',
        itemStyle: { 'width': '29%', 'margin': '0px 2%' },
        label: '销售季度:',
        readonly: true
      },
      {
        prop: 'analysisTarget',
        itemType: 'input',
        itemStyle: { 'width': '29%', 'margin': '0px 2%' },
        label: '分析目的:',
        rules: [{ message: '', trigger: 'blur' }],
        showMessage: false,
        readonly: true
      },
      {
        prop: 'targetCompletedTime',
        itemType: 'input',
        itemStyle: { 'width': '29%', 'margin': '0px 2%' },
        label: '要求完成时间:',
        rules: [{ message: '', trigger: 'blur' }],
        showMessage: false,
        readonly: true
        // formater: (scope) => {
        //   return scope.row.targetCompletedTime ? this.$filters.parseTime(scope.row.targetCompletedTime + '', '{y}-{m}-{d} {h}:{i}') : ''
        // }
      },
      {
        prop: 'isExistSample',
        itemType: 'input',
        itemStyle: { 'width': '29%', 'margin': '0px 2%' },
        label: '是否有客样:',
        rules: [{ message: '', trigger: 'blur' }],
        showMessage: false,
        readonly: true
      },
      {
        prop: 'sampleId',
        itemType: 'input',
        type: 'textarea',
        itemStyle: { 'width': '29%', 'margin': '0px 2%' },
        label: '客来板编号:',
        className: 'sampleIdStyle',
        readonly: true
      },
      {
        prop: 'analysisId',
        itemType: 'input',
        itemStyle: { 'width': '29%', 'margin': '0px 2%' },
        label: '分析编号:',
        className: 'analycodeStyle',
        focus: (e) => {
          e.target.blur()
          const showformObj = this.$refs.showData.dynamicValidateFormRuleForm || {}
          // console.log(showformObj)
          if (showformObj.status === 3) {
            this.jumpAnalysis(showformObj.id)
          }
        },
        readonly: true
      },
      {
        itemType: 'view',
        text: '',
        // style: { 'width': '46%', 'margin': '10px 2%' , 'font-size': '16px',},
        style: lineStyle
      },
      {
        itemType: 'view',
        text: '客户要求',
        // style: { 'width': '46%', 'margin': '10px 2%' , 'font-size': '16px',},
        style: titlestyle
      },
      {
        itemType: 'view',
        text: '附件信息',
        // style: { 'width': '46%', 'margin': '10px 2%', 'font-size': '16px', },
        style: titlestyle
      },
      {
        prop: 'requirement',
        itemType: 'input',
        type: 'textarea',
        itemStyle: { 'width': '46%', 'margin-left': '6px' },
        label: '',
        autosize: { minRows: 1, maxRows: 5 },
        readonly: true,
        className: 'requireStyle'
      },
      {
        prop: 'attachmentName',
        itemType: 'input',
        itemStyle: { 'width': '46%', 'margin': '10px 2%' },
        label: '',
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'attachmentName',
          url: 'attachment'
          // url: `/crm/customer/customer-details-page/${this.$route.params.id}`
        }
      }
    ]
    const pickerOptions = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 3600 * 1000 * 24
      },
      selectableRange: []
    }
    // 详情编辑数据信息
    const editInfoData = [
      {
        itemType: 'view',
        text: '基本信息',
        style: basisstyle
      },
      {
        prop: 'id',
        itemType: 'input',
        itemStyle: { 'width': '29%', 'margin': '10px 2%', 'display': 'none' },
        label: '申请单号:',
        placeholder: '保存后自动生成',
        disabled: true
      },
      {
        prop: 'customerService',
        itemType: 'select',
        itemStyle: { 'width': '29%', 'margin': '0px 2%', 'margin-bottom': '16px', 'margin-top': '6px' },
        label: '客服:',
        clearable: true,
        filterable: true,
        valueType: 'object',
        valueKey: 'value',
        rules: [{ required: true, message: '', trigger: 'blur' }],
        showMessage: false,
        visibleChange: (value) => {
          if (value) {
            this.getdown()
          }
        },
        dataSource: []
      },
      {
        prop: 'seller',
        itemType: 'select',
        valueType: 'object',
        valueKey: 'value',
        itemStyle: { 'width': '29%', 'margin': '0px 2%', 'margin-bottom': '16px', 'margin-top': '6px' },
        label: '销售员:',
        clearable: true,
        filterable: true,
        rules: [{ required: true, message: '', trigger: 'blur' }],
        showMessage: false,
        visibleChange: (value) => {
          if (value) {
            this.getdown()
          }
        },
        dataSource: []
      },
      {
        prop: 'sellerTeam',
        itemType: 'select',
        valueType: 'object',
        valueKey: 'value',
        itemStyle: { 'width': '29%', 'margin': '0px 2%', 'margin-bottom': '16px', 'margin-top': '6px' },
        label: '销售团队:',
        clearable: true,
        filterable: true,
        rules: [{ required: true, message: '', trigger: 'blur' }],
        showMessage: false,
        visibleChange: (value) => {
          if (value) {
            this.sellTeamdown()
          }
        },
        dataSource: []
      },
      {
        prop: 'brand',
        itemType: 'select',
        valueType: 'object',
        valueKey: 'value',
        itemStyle: { 'width': '29%', 'margin': '0px 2%', 'margin-bottom': '16px', 'margin-top': '6px' },
        label: '品牌商:',
        clearable: true,
        filterable: true,
        rules: [{ required: true, message: '', trigger: 'blur' }],
        showMessage: false,
        visibleChange: (value) => {
          if (value) {
            this.brandown()
          }
        },
        dataSource: []
      },

      {
        prop: 'year',
        itemType: 'select',
        itemStyle: { 'width': '29%', 'margin': '0px 2%', 'margin-bottom': '16px' },
        label: '销售年度:',
        clearable: true,
        visibleChange: (value) => {
          if (value) {
            this.yeardown()
          }
        },
        dataSource: []
      },
      {
        prop: 'quarter',
        itemType: 'select',
        itemStyle: { 'width': '29%', 'margin': '0px 2%', 'margin-bottom': '16px' },
        label: '销售季度:',
        clearable: true,
        dataSource: [
          {
            label: 'Spr',
            value: 'Spr'
          },
          {
            label: 'Sum',
            value: 'Sum'
          },
          {
            label: ' Fall',
            value: 'Fall'
          },
          {
            label: 'Winter',
            value: 'Winter'
          }
        ]
      },
      {
        prop: 'analysisTarget',
        itemType: 'select',
        itemStyle: { 'width': '29%', 'margin': '0px 2%', 'margin-bottom': '16px' },
        label: '分析目的:',
        clearable: true,
        filterable: true,
        multiple: true,
        rules: [{ required: true, message: '', trigger: 'blur' }],
        showMessage: false,
        dataSource: [
          {
            label: '报价',
            value: 'O'
          },
          {
            label: '样板',
            value: 'D'
          },
          {
            label: '大货',
            value: 'S'
          }
        ]
      },
      {
        prop: 'targetCompletedTime',
        itemType: 'date',
        type: 'datetime',
        popperClass: 'datePicker',
        itemStyle: { 'width': '29%', 'margin': '0px 2%', 'margin-bottom': '16px' },
        label: '要求完成时间:',
        format: 'yyyy-MM-dd HH:mm',
        placeholder: '请选择日期时间',
        rules: [{ required: true, message: '', trigger: 'blur' }],
        showMessage: false,
        valueFormat: 'yyyy-MM-dd HH:mm',
        focus: () => {
          pickerOptions.selectableRange = []
          const myDate = new Date()
          const timeer = `${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
          const newTime = `${timeer} - 23:59:59`
          pickerOptions.selectableRange.push(newTime)
        },
        pickerOptions
      },
      {
        prop: 'isExistSample',
        itemType: 'select',
        itemStyle: { 'width': '29%', 'margin': '0px 2%', 'margin-bottom': '16px' },
        label: '是否有客样:',
        clearable: true,
        filterable: true,
        rules: [{ required: true, message: '', trigger: 'blur' }],
        showMessage: false,
        dataSource: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }

        ]
      },
      {
        prop: 'sampleId',
        itemType: 'input',
        itemStyle: { 'width': '29%', 'margin': '0px 2%', 'margin-bottom': '30px' },
        label: '客来板编号:',
        maxlength: 20
        // readonly: true
      },
      {
        prop: 'analysisId',
        itemType: 'input',
        itemStyle: { 'width': '29%', 'margin': '0px 2%', 'margin-bottom': '30px' },
        label: '分析编号:',
        placeholder: '分析完成后自动显示',
        disabled: true
      },
      {
        itemType: 'view',
        text: '',
        // style: { 'width': '46%', 'margin': '10px 2%' , 'font-size': '16px',},
        style: lineStyle
      },
      {
        itemType: 'view',
        text: '客户要求',
        // style: { 'width': '46%', 'margin': '10px 2%' , 'font-size': '16px',},
        style: titlestyleOther
      },
      {
        itemType: 'view',
        text: '附件信息',
        // style: { 'width': '46%', 'margin': '10px 2%', 'font-size': '16px', },
        style: titlestyle
      },
      {
        prop: 'requirement',
        itemType: 'input',
        type: 'textarea',
        itemStyle: { 'width': '46%', 'margin': '0px 2%', 'margin-left': '20px' },
        // className: 'requestinput',
        label: '',
        maxlength: 500,
        className: 'requiretext',
        trim: (value) => {
          return value
        }
        // readonly: true
      },
      {
        prop: 'attachment',
        itemType: 'upload',
        // autoUpload: false,
        drag: true,
        itemStyle: { 'width': '46%', 'margin': '20px 2%' },
        className: 'uploadfile',
        label: '',
        action: '/customerOrder/upload/type/1',
        limit: 19,
        beforeRemove: (file, fileList) => {
          const editformObj = this.$refs.eidtData.dynamicValidateFormRuleForm || {}
          this.formDatas = editformObj
          this.formDatas.attachment && this.formDatas.attachment.forEach((item, index) => {
            if (item.uid === file.uid) {
              this.formDatas.attachment.splice(index, 1)
            }
          })
        },
        onPreview: (file) => {
          let loadurl = ''
          if (file.url) {
            loadurl = file.url
            // window.open(file.url)
          } else {
            const openlink = file.response.data
            loadurl = openlink
            // window.open(openlink)
          }
          this.uploadDown(loadurl)
        },
        beforeUpload: (file) => {
          const fileName = file.name.split('.')
          const fileType = fileName[fileName.length - 1]
          const regexp = new RegExp(fileType)
          const isXls = regexp.test(this.accept)
          const isLt1M = file.size / 1024 / 1024 <= 10
          if (!isXls) {
            this.$message.error('上传文件只能是 JPG/JPEG/PNG/BMP/PDF/EXCEL/WORD 格式!')
          } else if (!isLt1M) {
            this.$message.error('上传文件大小不能超过 10MB!')
          }
          return isXls && isLt1M
        },
        onExceed: (files) => {
          this.$message.error('上传文件个数不能超过19个!')
        },
        accept: '.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG,.bmp',
        content: [
          // {
          //   slot: 'tip',
          //   component: uploadSlotTip
          // },
          {
            slot: 'trigger',
            component: uploadSlotTrigger
          }
        ]
      }
    ]
    return {
      // newTime: '',
      status: 1,
      edit: '',
      formOtions: {
        inline: true
      },
      showInfoData,
      editInfoData,
      formDatas: {},
      userData: [],
      sellTeamData: [],
      brandData: [],
      yearData: [],
      originAnaly: '',
      accept: '.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG,.bmp',
      formDatasCopy: {}
    }
  },
  computed: {
    getEditClasse() {
      if (this.edit && this.edit === 'show') {
        return 'detailClass'
      } else {
        return 'detail98'
      }
    }
  },
  watch: {
    // edit: (val) => {
    //   let editObj = this.$refs.eidtData.dynamicValidateFormRuleForm || {}
    //   if (val === 'edit') {
    //     editObj.analysisTarget = editObj.analysisTarget && editObj.analysisTarget.split('|') || []
    //   }
    // }
  },
  created() {
    this.init()
    if (this.$route.params.edit) {
      this.edit = this.$route.params.edit
    } else {
      // 新建时客服显示用户名
      const userObj = JSON.parse(window.localStorage.getItem('tokenObj'))
      // console.log(userObj);
      // this.formDatas.customerService = userObj.userUuid
      // this.formDatas.customerServiceName = userObj.realname
      this.formDatas.customerService.value = userObj.userUuid
      this.formDatas.customerService.label = userObj.realname
      this.edit = 'edit'
    }
    if (this.$route.params.id) {
      this.getDetail({ id: this.$route.params.id })
    }
    this.getdown()
    this.sellTeamdown()
    this.brandown()
    this.yeardown()
  },
  methods: {
    // 初始化数据
    init() {
      this.formDatas = {
        id: '',
        // customerServiceId: null,
        // customerServiceName: '',
        customerService: { // 客服
          value: '',
          label: ''
        },
        // sellerId: null,
        seller: { // 销售员
          value: '',
          label: ''
        },
        // sellerName: '',
        sellerTeam: { // 销售团队
          value: '',
          label: ''
        },
        // sellerTeamId: null,
        // sellerTeamName: '',
        brand: {// 品牌商
          value: '',
          label: ''
        },
        // brandId: null,
        quarter: '',
        year: '',
        analysisTarget: '',
        targetCompletedTime: '',
        isExistSample: null,
        sampleId: null,
        requirement: '',
        attachment: ''
      }
    },
    // 编辑
    guestEdit() {
      this.edit = 'edit'
      this.formDatas.analysisTarget = this.originAnaly && this.originAnaly.split('|') || []

      this.formDatas.sellerTeamId = this.formDatas.sellerTeamId && (+this.formDatas.sellerTeamId)
      this.formDatas.brandId = this.formDatas.brandId && (+this.formDatas.brandId)
      // 处理上传附近数据问题
      if (this.formDatas.attachment) {
        const attachArr = this.formDatas.attachment && this.formDatas.attachment.split(',')
        // const attachnameArr = this.formDatas.attachmentName && this.formDatas.attachmentName.split(',')
        const attachnameArr = this.formDatas && this.formDatas.attachmentName
        const fileArr = attachArr.map((item, index) => {
          return {
            name: attachnameArr[index],
            url: item
          }
        })

        this.formDatas.attachment = fileArr
      }
      // console.log(this.edit);
      // this.formDatas.analysisTarget = this.formDatas.analysisTarget && this.formDatas.analysisTarget.split('|') || []
    },
    // 保存
    async guestSave() {
      const obj = this.$refs.eidtData.dynamicValidateFormRuleForm || {}
      obj.isExistSample = obj.isExistSample === '是' ? 1 : obj.isExistSample === '否' ? 0 : obj.isExistSample
      // console.log(obj);
      obj.analysisTarget = obj.analysisTarget && obj.analysisTarget.join('|')
      const files = Object.freeze(obj.attachment)
      let attachment
      if (isArray(obj.attachment)) {
        let attachStr = ''
        obj.attachment && obj.attachment.forEach((item, index) => {
          if (item.url) {
            attachStr = attachStr + item.url + ','
          } else if (item.response.data) {
            attachStr = attachStr + item.response.data + ','
          }
        })
        attachment = attachStr.substring(0, attachStr.lastIndexOf(','))
      }
      if (obj.customerService === '') {
        obj.customerService = {
          label: '',
          value: ''
        }
      }
      if (obj.seller === '') {
        obj.seller = {
          label: '',
          value: ''
        }
      }
      if (obj.sellerTeam === '') {
        obj.sellerTeam = {
          label: '',
          value: ''
        }
      }
      if (obj.brand === '') {
        obj.brand = {
          label: '',
          value: ''
        }
      }
      if (obj.id) {
        // console.log(obj)
        // obj.isExistSample = obj.isExistSample === '是' ? 1 : obj.isExistSample === '否' ? 0 : null
        await modifySave({ ...obj, attachment })
          .then(() => {
            // this.$refs.eidtData.form.resetFields()
            // this.$set(this.formDatas, 'attachment', [])
            this.edit = 'show'
            const dataArray = { ...obj, attachment }
            const { beforeCode, afterCode } = this.compareData(this.formDatasCopy, dataArray, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(
              this.getLogMessages('UPDATE', '/customerOrder/sampleAnalysisApply/modify', 'customerOrder'),
              { data: dataArray },
              JSON.stringify({
                beforeText: `在'客户订单-客样分析申请'修改一条记录`,
                afterText: '修改为',
                ...{ beforeCode, afterCode }
              })
            )
            this.getDetail({ id: obj.id })
          })
          .catch(() => {
            obj.attachment = files
            obj.analysisTarget = obj.analysisTarget && obj.analysisTarget.split('|')
            obj.isExistSample = obj.isExistSample === 0 ? '否' : obj.isExistSample === 1 ? '是' : ''
          })
      } else {
        await addSave({ ...obj, attachment })
          .then((res) => {
            const guestid = res.data.id || null
            this.edit = 'show'
            // this.getDetail({ id: guestid })
            const dataArray = { ...obj, attachment }
            this.fetchLog(
              this.getLogMessages('INSERT', '/customerOrder/sampleAnalysisApply/add', 'customerOrder'),
              { data: dataArray },
              JSON.stringify({
                beforeText: `在'客户订单-客样分析申请'新增一条记录`,
                beforeCode: dataArray
              })
            )
            this.$router.push({
              name: 'guestApplicationDetail',
              params: { id: guestid, edit: 'show' }
            })
          })
          .catch(() => {
            obj.attachment = files
            obj.analysisTarget = obj.analysisTarget && obj.analysisTarget.split('|')
            obj.isExistSample = obj.isExistSample === 0 ? '否' : obj.isExistSample === 1 ? '是' : ''
          })
      }
    },
    // 提交
    async guestCommit(data = {}) {
      // console.log(this.formDatas.id);
      if (!this.formDatas.requirement && !this.formDatas.attachment) {
        this.$message({
          message: '客户要求和附件信息不可同时为空！',
          type: 'warning'
        })
      } else {
        this.$confirm('提交后将不可撤回，请确认是否提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(async() => {
            await guestapplyCommit({ id: this.formDatas.id })
            this.getDetail({ id: this.formDatas.id })
          })
      }
    },
    // 复制
    guestCopy() {
      const userObj = JSON.parse(window.localStorage.getItem('tokenObj'))
      this.formDatas.id = null
      this.formDatas.customerServiceId = userObj.userUuid
      this.formDatas.customerServiceName = userObj.realname
      this.formDatas.analysisId = ''
      this.formDatas.status = null
      this.guestEdit()
    },
    // 打印
    guestPrint() {
      // this.$router.push({
      //   path: `../print?id=${this.$route.params.id}`
      // })
      window.open(`../print?id=${this.$route.params.id}`)
    },
    // 删除
    async guestDelete(data = {}) {
      if (this.formDatas.id) {
        await guestapplyDelete({ id: this.formDatas.id })
          .then(() => {
            this.fetchLog(
              this.getLogMessages('DEL', '/customerOrder/sampleAnalysisApply/delete', 'customerOrder'),
              { id: this.formDatas.id },
              JSON.stringify({
                beforeText: `在'客户订单-客样分析申请'删除一条记录`,
                beforeCode: { id: this.formDatas.id }
              })
            )
            // this.$router.replace({ name: 'guestApplicationList' })
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push({ path: '/customer-order/analysis-application/guest-application' })
          })
      } else {
        return false
      }
    },
    // 返回
    async guestBack(data = {}) {
      // this.$router.replace({ name: 'guestApplicationList' })
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/customer-order/analysis-application/guest-application' })
    },
    // 取消
    async guestCancel(data = {}) {
      this.$confirm('取消后将不可撤回，请确认是否取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async() => {
          await guestapplyCancel({ id: this.$route.params.id })
          this.getDetail({ id: this.$route.params.id })
        })
    },
    // 取消编辑
    editCancel() {
      // console.log(this.formDatas.analysisTarget)
      if (isArray(this.formDatas.analysisTarget)) {
        this.formDatas.analysisTarget = this.formDatas.analysisTarget.join('|')
      }
      this.edit = 'show'
      if ((this.$route.params.id && !this.formDatas.id) || this.$route.params.edit === 'show') {
        // console.log(this.formDatas.analysisTarget)
        this.getDetail({ id: this.$route.params.id })
      } else {
        this.$router.go(-1)
      }
    },
    // 处理状态数据
    getStatus(data) {
      let str = ''
      switch (data) {
        case 1:
          // str = `<span style="color:#999933">草稿</span>`
          str = '草稿'
          break
        case 2:
          // str = `<span style="color:#FF3333">进行中</span>`
          str = '进行中'
          break
        case 3:
          str = '已完结'
          break
        case 4:
          // str = `<span style="color:#666666">已取消</span>`
          str = '已取消'
          break
        default:
          break
      }
      return str
    },
    async getDetail(data = {}) {
      const res = await applyDetail({ ...data })
      this.formDatas = res.data
      this.formDatas.isExistSample = this.formDatas.isExistSample === 0 ? '否' : this.formDatas.isExistSample === 1 ? '是' : ''
      this.formDatas.targetCompletedTime = this.formDatas.targetCompletedTime ? this.$filters.parseTime(this.formDatas.targetCompletedTime + '', '{y}-{m}-{d} {h}:{i}') : ''
      this.formDatas.createdTime = this.formDatas.createdTime ? this.$filters.parseTime(this.formDatas.createdTime + '', '{y}-{m}-{d} {h}:{i}') : ''
      this.formDatas.submitTime = this.formDatas.submitTime ? this.$filters.parseTime(this.formDatas.submitTime + '', '{y}-{m}-{d} {h}:{i}') : ''
      this.formDatas.cancelTime = this.formDatas.cancelTime ? this.$filters.parseTime(this.formDatas.cancelTime + '', '{y}-{m}-{d} {h}:{i}') : ''
      this.originAnaly = this.formDatas.analysisTarget

      if (this.edit === 'edit') {
        this.formDatas.analysisTarget = this.formDatas.analysisTarget && this.formDatas.analysisTarget.split('|') || []
        this.formDatas.sellerTeamId = this.formDatas.sellerTeamId && (+this.formDatas.sellerTeamId)
        this.formDatas.brandId = this.formDatas.brandId && (+this.formDatas.brandId)
        // 处理上传附件数据问题
        if (this.formDatas.attachment) {
          const attachArr = this.formDatas.attachment && this.formDatas.attachment.split(',')
          // const attachnameArr = this.formDatas.attachmentName && this.formDatas.attachmentName.split(',')
          const attachnameArr = this.formDatas && this.formDatas.attachmentName
          const fileArr = attachArr.map((item, index) => {
            return {
              name: attachnameArr[index],
              url: item
            }
          })
          this.formDatas.attachment = fileArr
        }
      }
      if (this.edit === 'show') {
        // let analyArr = ''
        // console.log(this.formDatas.analysisTarget);
        // if(isArray(this.formDatas.analysisTarget)){
        //    analyArr = this.formDatas.analysisTarget
        // }else{
        const analyArr = this.formDatas.analysisTarget && this.formDatas.analysisTarget.split('|') || []
        // }
        // const analyArr = this.formDatas.analysisTarget && this.formDatas.analysisTarget.split('|') || []
        let analyStr = ''
        analyArr && analyArr.forEach((item, index) => {
          if (item === 'O') {
            analyStr = analyStr + '报价' + ','
          } else if (item === 'D') {
            analyStr = analyStr + '样板' + ','
          } else if (item === 'S') {
            analyStr = analyStr + '大货' + ','
          }
        })
        this.formDatas.analysisTarget = analyStr.substring(0, analyStr.lastIndexOf(','))
      }
      const dataArray = JSON.parse(JSON.stringify(this.formDatas))
      dataArray.brand = {// 品牌商
        value: dataArray.brand && (dataArray.brand.value - 0) || '',
        label: dataArray.brand && (dataArray.brand.label) || ''
      }
      dataArray.sellerTeam = {// 销售团队
        value: dataArray.sellerTeam && (dataArray.sellerTeam.value - 0) || '',
        label: dataArray.sellerTeam && (dataArray.sellerTeam.label) || ''
      }
      this.formDatas = dataArray
      this.formDatasCopy = this.formDatas
    },
    // 客服，销售员下拉数据
    async getdown() {
      const res = await userSelet({ isEnabled: 1 })
      if (res.code !== 200) {
        return false
      }
      const pu = []
      const cm = res.data.list || []
      cm.forEach((item, index) => {
        if (item.realName && item.userId) {
          pu.push({
            label: item.realName,
            value: item.userId
          })
        }
      })
      this.userData = pu
      // this.userData = res.data.list || []
      // this.userData.map((item, index) => {
      //   // console.log("comssssss",item)
      //   //  if(item.realName&&item.userId){
      //     item.label = item.realName
      //     item.value = item.userId
      //   // }
      // })

      this.$set(this.editInfoData[2], 'dataSource', this.userData)
      this.$set(this.editInfoData[3], 'dataSource', this.userData)
      this.$set(this.showInfoData[2], 'dataSource', this.userData)
      this.$set(this.showInfoData[3], 'dataSource', this.userData)
    },
    // 销售团队下拉
    async sellTeamdown() {
      const res = await sellTeamselet({ functionTag: 'SAL' })
      if (res.code !== 200) {
        return false
      }
      this.sellTeamData = res.data || []
      this.sellTeamData.map((item, index) => {
        item.label = item.name
        item.value = item.orgId
      })
      this.$set(this.editInfoData[4], 'dataSource', this.sellTeamData)
      this.$set(this.showInfoData[4], 'dataSource', this.sellTeamData)
    },
    // 品牌商下拉
    async brandown() {
      const res = await brandSelet({})
      if (res.code !== 200) {
        return false
      }
      this.brandData = res.data || []
      this.brandData.forEach((item, index) => {
        item.label = item.name
        item.value = item.id - 0
      })
      this.$set(this.editInfoData[5], 'dataSource', this.brandData)
      this.$set(this.showInfoData[5], 'dataSource', this.brandData)
    },

    // 销售年度下拉
    async yeardown() {
      const res = await yearSelet({})
      if (res.code !== 200) {
        return false
      }
      this.yearData = res.data || []
      this.$set(this.editInfoData[6], 'dataSource', this.yearData)
      this.$set(this.showInfoData[6], 'dataSource', this.yearData)
    },

    // 文件下载
    async uploadDown(link) {
      const res = await downFile({ url: link })
      // console.log(res);
      this.$utils.downloadStream(res)
    },
    // 分析编号跳转客样分析工艺单
    async jumpAnalysis(analysisid) {
      this.$router.push(`/customer-order/analysis-application/guest-application/weaveTechPrint?id=${analysisid}`)
      // const res = await jumpcrmAnalysis({ sampleAnalysisApplyId: analysisid })
      // if (res.status !== 200) {
      //   return false
      // }

      // this.$confirm('文件已下载，确认打开？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      //   center: true,
      //   customClass: 'customClass'
      // })
      //   .then(() => {
      //     // window.open(url)
      //     window.open(this.$utils.getStreamUrl(res))
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消打开'
      //     })
      //   })
    }
  }

}
</script>
<style lang="scss" scope>
// .guest-application-detail{
//   min-width: 1280px;
//   padding: 16px;
//   .button-top {
//     text-align: right;
//     .option-info {
//       margin-top: 10px;
//       span {
//         font-size: 12px;
//         color: #888e9e;
//         margin: 0 5px;
//       }
//       .order-status {
//         margin-left: 20px;
//         color: red;
//       }
//     }
//   }
// }
.guest-application-detail {
  margin-bottom: 60px;
  .guest-application-top {
    padding-top: 19px;
    display: flex;
    justify-content: space-between;
    .guest-item-codeinfo {
      padding: 0 19px;
      display: flex;
      .code-item {
        font-size: 18px;
        color: #151222;
        line-height: 26px;
        height: 26px;
        // padding: 0 10px;
      }
    }
    .descripte {
      // margin-top: 19px;
      display: flex;
      justify-content: flex-end;
      line-height: 26px;
      height: 26px;
      padding: 0 30px;
      font-size: 12px;
      color: #777777;
    }
  }
  .guest-application-content {
    margin: 15px 20px;
    color: #606266;
    background-color: #fff;
    .guest-application-title {
      display: flex;
      justify-content: space-between;
      // line-height: 60px;
      padding-top: 20px;
      height: 59px;
      margin: 0 20px;
      border-bottom: 1px solid #efefef;
      font-size: 16px;
      color: #3c4043;
    }
    // .guest-application-info{
    //   padding: 20px;
    // }
    // .guest-application-edit{
    //   padding: 20px;
    // }
  }
  .guest-application-foot {
    width: calc(100% - 210px);
    text-align: center;
    bottom: 0;
    z-index: 2000;
    padding: 10px;
    // width: 100%;
    // width: calc(100% - 210px);
    background: #fff;
    border-top: 1px solid #ecf0f3;
    position: fixed;
    // .btn-groups {
    //   position: relative;
    //   left: 34%;
    // }
  }
}
</style>
<style lang='scss'>
.datePicker .el-button--text {
  display: none;
}
.guest-application-detail {
  .guest-application-info {
    // padding: 16px;
    // margin-top: 14px;
    // margin-bottom: 20px;
    // background-color: #fff;
    // .el-form-item__label-wrap {
    //   margin-left: 0!important;
    // }
    .el-input__inner,
    .el-textarea__inner {
      border: 0;
    }

    .el-form--inline .el-form-item {
      margin-right: 0px;
    }

    .requireStyle {
      .el-textarea__inner {
        //el_input中的隐藏属性
        resize: none; //主要是这个样式
      }
    }
    .sampleIdStyle {
      .el-textarea__inner {
        //el_input中的隐藏属性
        resize: none; //主要是这个样式
      }
    }
    .analycodeStyle {
      .el-input__inner {
        color: #1890ff;
        cursor: pointer;
      }
    }
  }

  .guest-application-edit {
    // padding: 16px;
    // margin-top: 14px;
    // margin-bottom: 20px;
    // background-color: #fff;
    .el-form--inline .el-form-item {
      margin-right: 0px;
    }

    .requestinput .el-input__inner {
      height: 120px;
      margin-top: 16px;
    }
    .uploadfile .el-upload-dragger {
      width: 100%;
      height: 139px;
    }
    .uploadfile .el-icon-upload {
      font-size: 36px;
      margin: 10px 0 0 0;
    }
    .uploadfile .el-upload {
      width: 100% !important;
    }
    .requiretext {
      margin-top: 20px;
      .el-textarea__inner {
        min-height: 139px !important;
      }
    }
  }

  .detailClass .el-input__inner {
    padding: 0;
    border: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #fff;
    font-size: 14px;
  }
  .detailClass .el-form-item {
    margin-bottom: 14px;
  }
  .detailClass .el-input__icon {
    display: none;
  }
  .el-input.is-disabled .el-input__inner {
    color: #666666;
  }
}
</style>
