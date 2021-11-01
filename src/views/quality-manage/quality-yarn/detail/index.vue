<template>
  <div class="quality-yarn-detail">
    <div v-if="baseStatus !== '-1'" class="info-wrap">
      <div class="yarn-number">检测编号：{{ $route.params.id }}</div>
      <div style="margin-left: auto;">
        <span>申请人：{{ testInfo.baseInfo.applyByName }}</span>
        <span>{{ testInfo.baseInfo.applyTime ? $filters.parseTime(testInfo.baseInfo.createdTime, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
        <span v-if="baseStatus >= '2'" style="margin-left: 10px;">处理人：{{ testInfo.baseInfo.processedByName }}</span>
        <span v-if="baseStatus >= '2'">{{ testInfo.baseInfo.processedTime ? $filters.parseTime(testInfo.baseInfo.processedTime, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
        <span style="color: #FF4444;margin-left: 20px;" :style="{ color: statusList[baseStatus].color}">{{ statusList[baseStatus].label }}</span>
      </div>
    </div>
    <div class="wrap-content">
      <!-- 申请信息 -->
      <div class="info-form-wrap" :class="ifEdit?'':'info-form-disable'">
        <cs-custom-form
          ref="infoForm"
          :data-source="infoCommon"
          :options="formOptions"
          :form-datas="infoData"
        />
      </div>
      <el-select
        v-model="currentVersion"
        :disabled="baseStatus !== '3' || status === '-2'"
        class="select-version"
        style="width: 80px"
        size="small"
        filterable
        placeholder="请选择"
        @change="versionInfoChange"
      >
        <el-option
          v-for="i in latestVersion"
          :key="i"
          :label="'v'+i"
          :value="i+''"
        />
      </el-select>
    </div>
    <div class="wrap-content">
      <div class="title">检测信息</div>
      <div class="page-tables detail form">
        <!-- <cs-custom-table
        ref="detailTable"
        :columns="columns"
        :data-source="dataSource"
        :form-datas="formDatas"
        edit-type="inline"
      /> -->
        <cs-custom-form
          ref="detailTable"
          :data-source="resContent"
          :form-datas="resFormDatas"
          :options="resFormOptions"
        />
      </div>
      <div class="content2">
        <div style="margin-right: 180px">内测综合等级:<span
          class="content"
          style="color: #FF9214"
        >{{ testInfo.baseInfo.internalGrade || '' }}</span></div>
        <div>供应商综合等级:<span
          class="content"
          style="color: #0986FF"
        >{{ testInfo.baseInfo.supplierGrade || '' }}</span></div>
      </div>
    </div>
    <div v-if="status === '3'" class="wrap-content">
      <div class="title">评论信息</div>
      <div class="page-tables comment">
        <cs-custom-table
          ref="commentTable"
          :columns="commentColumns"
          :data-source="commentDataSource"
        />
      </div>
    </div>
    <!-- 选择产品列表弹框 -->
    <div class="pop">
      <cs-custom-pop :options="productPopOptions" />

    </div>
    <div
      class="button-group"
      :class="{ 'fixed-footer': !sidebar }"
    >
      <!-- <el-button
        size="small"
        @click="save"
      >保存</el-button> -->
      <el-button
        v-if="( (status === '-1' && ($permission(['qa:qaYarnInspectionPhysical:add'])||$permission(['qa:qaYarnInspectionPhysical:modify']))) || status === '-2' && $permission(['qa:qaYarnInspectionPhysical:add']))"
        type="primary"
        size="small"
        @click="handleOperate('save')"
      >保存</el-button>
      <!-- && $permission(['qa:qaYarnInspectionPhysical:exchange'])" -->
      <el-button
        v-if="((status === '-1') || status === '-2' && $permission(['qa:qaYarnInspectionPhysical:add:exchange']))"
        size="small"
        @click="handleOperate('saveAndSubmit')"
      >保存并提交</el-button>
      <!-- 待提交，需要编辑权限 待处理或处理中 需要处理权限 -->
      <!-- &&
          (baseStatus === '0' && $permission(['qa:qaYarnInspectionPhysical:modify']))
          || ((baseStatus === '1' || baseStatus === '2') && $permission(['qa:qaYarnInspectionPhysical:process']))" -->
      <el-button
        v-if="status !== '-1' && createdBy===userId && status !== '3' && $permission(['qa:qaYarnInspectionPhysical:modify'])"

        type="primary"
        size="small"
        @click="handleOperate('edit')"
      >编辑</el-button>
      <!-- && $permission(['qa:qaYarnInspectionPhysical:exchange'])" -->
      <el-button
        v-if="((status === '0' && createdBy===userId && $permission(['qa:qaYarnInspectionPhysical:add:exchange'])) ||
          (status === '2' && $permission(['qa:qaYarnInspectionPhysical:process:exchange'])))"
        size="small"
        @click="handleOperate('submit')"
      >提交</el-button>
      <!-- && $permission(['qa:qaYarnInspectionPhysical:exchange'])" -->
      <el-button
        v-if="status === '1'&&applyBy==='userId' && $permission(['qa:qaYarnInspectionPhysical:cancel:exchange'])"
        size="small"
        @click="handleOperate('back')"
      >撤回</el-button>
      <!-- && $permission(['qa:qaYarnInspectionPhysical:exchange'])" -->
      <el-button
        v-if="status === '0' && createdBy===userId && $permission(['qa:qaYarnInspectionPhysical:finish:exchange'])"
        size="small"
        @click="handleOperate('end')"
      >完结</el-button>
      <!-- && $permission(['qa:qaYarnInspectionPhysical:repeat'])" -->
      <el-button
        v-if="status === '3' && $permission(['qa:qaYarnInspectionPhysical:repeat'])"
        type="primary"
        size="small"
        @click="handleOperate('redo')"
      >重检</el-button>
      <!-- && $permission(['qa:qaYarnInspectionPhysical:delete'])" -->
      <el-button
        v-if="status === '0'&& createdBy===userId && $permission(['qa:qaYarnInspectionPhysical:delete'])"
        :disabled="currentVersion !== '1'"
        size="small"
        @click="handleOperate('delete')"
      >删除</el-button>
      <el-button
        v-if="status === '-1' || status === '-2'"
        size="small"
        @click="handleOperate('cancel')"
      >取消</el-button>
      <!-- && $permission(['qa:qaYarnInspectionPhysical:addComment'])" -->
      <el-button
        v-if="status === '3' && $permission(['qa:qaYarnInspectionPhysical:addComment'])"
        size="small"
        @click="handleOperate('comment')"
      >评价</el-button>
      <el-button
        v-if="status > 0"
        size="small"
        @click="handleOperate('print')"
      >打印预览</el-button>
    </div>
    <div class="pop commentPop">
      <cs-custom-pop
        :options="popOptions2"
      />
    </div>
  </div>
</template>

<script>
import { fetchLog } from '@/views/quality-manage/common/fetchLog'
import editColumn from './components/edit-column.vue'
import { info } from './components/a-info.js'
import { chooseProduct } from '@/views/quality-manage/public/common/choose-product.js'
import * as api from './api/index.js'
import { modifyQaYarnInspectionPhysical } from './api/index.js'
// import merge from 'webpack-merge'
export default {
  mixins: [info, chooseProduct, fetchLog],
  data() { // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    const commonChangeReg = this.$getRules({})
    // const checkNumberReg = this.$getRules({ pattern: /^([0-9]\d{0,5})(\.\d{1,2})?$/, message: '请输入0-999999.99之间的数字,最多保留两位小数', trigger: 'change' })
    const checkNumber = (rule, value, callback) => {
      console.log('value', value)
      if (value !== '' && value !== undefined && !/^([0-9]\d{0,5})(\.\d{1,2})?$/.test(value)) {
        callback(new Error('请输入0-999999.99之间的数字,最多保留两位小数'))
      } else {
        callback()
      }
    }
    const columns = {
      _testItemsName: {
        prop: 'testItemsName',
        label: '检测项目',
        minWidth: 150
      },
      _standardRangeReference: {
        prop: 'standardRangeReference',
        label: '标准范围参考'
      },
      _supplierDetectionResult: {
        prop: 'supplierDetectionResult',
        label: '检测结果（供应商）',
        components: [editColumn],
        componentsOptions: {
          changeIpuqt: (value, scope, formDatas) => {
            const val = scope.row.supplierDetectionResultGroup
            let sum = 0
            if (!val || val.length === 0) return
            const reg = /^[1-9]\d{0,9}?$/
            for (let i = 0; i < val.length; i++) {
              if (val[i] === '') {
                return
              } else {
                if (!reg.test(val[i])) {
                  this.err.msgIdx = 2
                  this.err.show = true
                  return
                }
                sum += parseFloat(val[i])
              }
            }
            if (sum === 100) {
              setTimeout(() => {
                this.yarnCalculationGrade(null, true)
              }, 300)
            }

            // console.log(sum)
          }
        },

        setFormDatas: this.setFormDatas,
        editOptions: {
          placeholder: '请输入',
          // rules: [
          //   commonBlurReg,
          //   { validator: checkNumber, trigger: 'blur' }
          //   // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          // ],
          // rules: [],
          rules: [
            {},
            { validator: checkNumber, trigger: 'change' }
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          // rules: [],
          change: (value, form, formDatas, setFormDatas, scope) => {
            if (value !== '' && value !== undefined && !/^([0-9]\d{0,5})(\.\d{1,2})?$/.test(value)) {
              scope.row.supplierGrade = ''
            } else {
              this.yarnCalculationGrade(null, true)
            }
          }
        },
        minWidth: 150
      },
      _supplierGrade: {
        prop: 'supplierGrade',
        label: '供应商等级',
        width: 120
      },
      _internalDetectionResult: {
        prop: 'internalDetectionResult',
        label: '检测结果（内测）',
        components: [editColumn],
        componentsOptions: {
          changeIpuqt: (value, scope, formDatas, setFormDatas) => {
            const val = scope.row.internalDetectionResultGroup

            let sum = 0
            if (!val || val.length === 0) return
            const reg = /^[1-9]\d{0,9}?$/
            for (let i = 0; i < val.length; i++) {
              if (val[i] === '') {
                return
              } else {
                if (!reg.test(val[i])) {
                  this.err.msgIdx = 2
                  this.err.show = true
                  return
                }
                sum += parseFloat(val[i])
              }
            }
            if (sum === 100) {
              setTimeout(() => {
                this.yarnCalculationGrade(null, true)
              }, 300)
            }
          }
        },
        setFormDatas: this.setFormDatas,
        editOptions: {
          placeholder: '请输入',
          rules: [
            commonBlurReg,
            { validator: checkNumber, trigger: 'blur' }
          ],
          change: (value, form, formDatas, setFormDatas, scope) => {
            // console.log('change', value, form, formDatas, setFormDatas, scope)
            // if (value === '') scope.row.internalGrade = ''
            // else this.yarnCalculationGrade(null, true)
            if (value !== '' && value !== undefined && !/^([0-9]\d{0,5})(\.\d{1,2})?$/.test(value)) {
              scope.row.internalGrade = ''
            } else {
              this.yarnCalculationGrade(null, true)
            }
          }
        },
        minWidth: 150
      },
      _internalGrade: {
        prop: 'internalGrade',
        label: '内测等级',
        width: 120
      }
    }
    const resContent = {
      _tableFormV: {
        prop: 'tableFormV',
        border: true,
        itemStyle: { marginBottom: 0 },
        itemType: 'table-form',
        // label: '表格表单',
        // props: { edit: 'edit' },
        // rowClick: (...rest) => {
        //   console.log(...rest)
        // },
        dataSource: [],
        columns: columns
      }
    }
    // 评价弹窗
    const commentForm = [
      {
        prop: 'commentsContent',
        itemType: 'input',
        type: 'textarea',
        rows: 4,
        // label: "分组名称",
        clearable: true,
        maxlength: 500,
        rules: [commonBlurReg],
        placeholder: '请输入评价意见'
      }
    ]
    const popOptions2 = {
      itemType: 'dialog',
      visible: false,
      title: '评价意见',
      okText: '提交',
      cancelText: '取消',
      // saveAndaddText: "保存并继续",
      ok: (params) => {
        this.submitComment(params)
      },
      cancel: (params) => {
        this.$set(this.popOptions2, 'visible', false)
      },
      formDatas: {},
      formOptions: {},
      content: commentForm
    }
    // 评论表格
    // 表格表头的配置信息
    const commentColumns = [
      {
        prop: 'createdByName',
        label: '评论人',
        showOverflowTooltip: true
      },
      {
        prop: 'createdTime',
        label: '时间',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'commentsContent',
        label: '内容',
        showOverflowTooltip: true
      }
    ]
    return {
      commonBlurReg,
      commonChangeReg,
      checkNumber,
      commentColumns,
      popOptions2,
      commentDataSource: [],
      formDatas: {},
      formOptions: {
        inline: true,
        labelWidth: '150px',
        validate: (flag, res, err) => {
          // console.log(flag, res, err)
        },
        popError: false
      },
      infoCommon: {},
      infoData: {
        attachment: [],
        // reportType: '1', // 1 内部报告 0 供应商报告
        isPurchased: 1 // 1 已采购 0 未采购
      },
      oldForm: {},
      columns,
      resContent,
      resFormDatas: {},
      resFormOptions: {
        validate: (flag, res, err) => {
          // console.log(flag, res, err)
          console.log('validate', flag, res, err)
        },
        popError: true
        // labelWidth: 'auto'
      },
      statusList: {
        '-2': { color: '', value: 'redo', label: '重检' },
        '-1': { color: '', value: 'add', label: '新增' },
        '0': { color: '#FF9214', value: 'submit', label: '待提交' },
        '1': { color: '#FF9214', value: 'deal', label: '待处理' },
        '2': { color: '#FF4444', value: 'process', label: '处理中' },
        '3': { color: '#00BCC5', value: 'end', label: '已处理' }
      },
      currentVersion: '1', // 当前版本
      latestVersion: 1, // 此数据最新版本
      tempStatus: '-1', // 临时状态 修改临时状态 控制显示按钮 -1 时显示保存保存并提交按钮
      testInfo: {
        baseInfo: { status: '-1' },
        info: [], // 检测信息
        config: [{

        }] // 检测项目
      },
      selectData: [], // 保存捻向下拉列表信息
      isSaving: false,
      userId: this.$store.state.user.userInfo.userId, // 当前用户id
      commissionerId: '', // 试纱员id
      applyBy: '', // 审核员id
      createdBy: '', // 申请人、创建人
      wjStatus: '', // 完结状态
      yarnUuid: this.$route.params.id
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    status() { // 用来控制按钮显示 并非实际状态
      return this.tempStatus + ''
    },
    baseStatus() { // 记录原始状态，根据状态判断作何处理
      return this.testInfo.baseInfo.status + ''
    },
    pageType() {
      if (this.$route.path.includes('edit')) {
        return 'edit'
      } else if (this.$route.path.includes('add')) {
        return 'add'
      } else return 'add'
    }
  },
  created() {
    console.log('this.pageType', this.pageType)
    this.getPysicalSurveyConfigList()
    // this.initData()
    // this.getAllSelect()
    this.yarnUuid = this.$route.params.id
    console.log('yarnUuid:', this.yarnUuid)
  },
  methods: {
    editTypeChange() {
      // 申请信息修改状态改变
      this.infoCommon._attachment.isShow = this.ifEdit // 可编辑时上传按钮显示
      this.infoCommon._attachmentName.isShow = !this.ifEdit // 不可编辑时显示附件名
    },
    initData(isPurchased) {
      const tFlag = isPurchased
      // 申请信息
      // 已采购可以编辑
      const enabledKeys = ['_isPurchased', '_skuName', '_executiveStandardName', '_remarks', '_attachment']
      // 未采购不可以编辑
      const disabledKeys = ['_code', '_reportTypeId']
      // 已采购不需要非空判断
      const nullKeys = ['_yarnCount', '_ingredients', '_proportion', '_spinningMethod', '_spinningMethod', '_cardingMethod', '_yarnType', '_supplier', '_yarnBatch']
      // 未采购隐藏
      const hideKeys = ['_skuName', '_batchNo', '_stockInNo', '_stockOutNo', '_relationNo', '_actualStorageWeight', '_address']
      // 重检可编辑字段 执行标准、备注、附件、检测结果（供应商）
      const enabledKeys2 = ['_executiveStandardName', '_supplierDetectionResult', '_remarks', '_attachment']
      console.log('initData', tFlag)
      for (const key in this.infoCommon) {
        if (this.pageType === 'add') this.ifEdit = true
        if (tFlag === 1) { // 已采购
          if (enabledKeys.includes(key)) {
            this.infoCommon[key].disabled = false
          } else {
            this.infoCommon[key].disabled = true
            this.infoCommon[key].placeholder = ''
          }
          if (nullKeys.includes(key)) {
            this.infoCommon[key].rules = []
          }
          if (hideKeys.includes(key)) {
            this.infoCommon[key].isShow = true
          }
        } else {
          if (disabledKeys.includes(key)) {
            this.infoCommon[key].disabled = true
          } else {
            this.infoCommon[key].disabled = false

            if (key === '_remarks' || key === '_yarnBatch') {
              this.infoCommon[key].placeholder = '请输入'
            } else {
              this.infoCommon[key].placeholder = '请选择'
            }
          }
          if (nullKeys.includes(key)) {
            this.infoCommon[key].rules = [this.commonChangeReg]
          }
          if (hideKeys.includes(key)) {
            this.infoCommon[key].isShow = false
          }
        }
        if (this.status === '-2' || this.latestVersion > 1) {
          if (!enabledKeys2.includes(key)) {
            this.infoCommon[key].disabled = true
          }
        }
      }
      this.editTypeChange()
      console.log('this.infoCommon', this.infoCommon)
    },
    save(isCommit) {
      // this.$set(this.$refs.detailTable.form.model.tableFormV[1], 'error', '')
      this.isSaving = true
      let res = ''
      this.$refs.infoForm.form.validate(valid => {
        console.log('infoForm', this.$refs.infoForm.form.model)
        if (valid) {
          console.log('pass')
          res += 'pass1'
        } else {
          res += 'faile1'
          console.log('faile')
        }
      })
      this.$refs.detailTable.form.validate(valid => {
        if (valid) {
          res += 'pass2'
        } else {
          res += 'faile2'
          this.$message({
            message: '请检查检测信息，正确输入检测信息',
            type: 'error',
            duration: 3 * 1000
          })
        }
      })
      console.log('res', res)
      if (res === 'pass1pass2') {
        this.handleAddOrEditOrRedo(this.$refs.infoForm.form.model, this.$refs.detailTable.form.model.tableFormV, isCommit)
      } else this.isSaving = false
    },
    // 保存新增或修改数据或重检
    async handleAddOrEditOrRedo(params, params2, isCommit) {
      let tempReportType = params.reportTypeId || ''
      if (!tempReportType) {
        if (this.baseStatus === '3') {
          //  没有报告类型，且状态为已处理，则是直接完结，报告类型为供应商报告
          tempReportType = {
            label: '供应商报告',
            value: '2'
          }
        } else if (this.baseStatus === '1') {
          // 待处理，则是保存数据，并且状态改为已处理，已经不能撤回，报告类型为内部报告
          tempReportType = {
            label: '内部报告',
            value: '1'
          }
        }
      }
      let executiveStandardName = this.$utils.deepClone(params.executiveStandardName || [])
      executiveStandardName = executiveStandardName && executiveStandardName.length ? JSON.stringify(executiveStandardName) : ''
      let submitData = {
        qaYarnInspection: { ...params },
        reportType: tempReportType,
        executiveStandardName: executiveStandardName || '',
        qaYarnInspectionPhysicalInformations: params2,
        isCommit: isCommit,
        remarks: params.remarks,
        attachmentName: params.attachmentName || '',
        attachmentPath: params.attachmentPath || ''
      }

      delete submitData.qaYarnInspection.attachment
      if (Object.prototype.toString.call(submitData.qaYarnInspection.proportion) === '[object Array]') {
        submitData.qaYarnInspection.proportion = submitData.qaYarnInspection.proportion.join('/')
      }
      if (submitData.qaYarnInspection.skuName) {
        submitData.qaYarnInspection.sku = {
          value: submitData.qaYarnInspection.skuName,
          label: submitData.qaYarnInspection.skuName
        }
      }
      if (this.pageType === 'add') {
        this.handleAdd(submitData)
        // this.yarnCalculationGrade(submitData)
        // await api.addQaYarnInspectionPhysical(submitData)
        // this.$router.back()
      } else {
        submitData = Object.assign({}, this.oldForm, submitData)

        delete submitData.inspection

        delete submitData.inspectionPhysicalInformations

        let res = ''
        if (this.status === '-2') { // 重检
          // 删除等级数据
          submitData.supplierGrade = ''
          submitData.internalGrade = ''
          res = await api.qaYarnInspectionPhysicalRepeat(submitData)
        } else if (this.baseStatus === '0') { // 未提交调修改接口
          res = await modifyQaYarnInspectionPhysical(submitData)
          const { beforeCode, afterCode } = this.compareData(this.oldForm, submitData, 'yarnUuid')
          this.fetchLog(this.getLogMessages('UPDATE', '/qa/qaYarnInspectionTesting/modify'), submitData, JSON.stringify({ beforeText: `在'质量管理-纱线检测-纱线物测,将${JSON.stringify({ 'yarnUuid': submitData.yarnUuid })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
        } else { // 已经提交的调处理接口
          // delete submitData.inspection
          // if (!submitData.address) submitData.address = '/'
          res = await api.processQaYarnInspectionPhysical(submitData)
          this.fetchLog(this.getLogMessages('UPDATE', '/qa/qaYarnInspectionTesting/process'), submitData, JSON.stringify({ beforeText: `在'质量管理-纱线检测-纱线物测处理一条数据`, beforeCode: submitData }))
        }

        this.isSaving = false
        this.showResult(res)
        // this.initData()
        this.getInfo()
        this.handleNotEdit()
      }
    },
    handleOperate(type) {
      console.log(this.status)
      // this.$set(this.columns._supplierDetectionResult.editOptions, 'rules', [])
      switch (type) {
        case 'save':
          this.wjStatus = '3'
          if (this.baseStatus === '1' || this.baseStatus === '2') { // 待处理提交要判断内测结果
            if (this.checkTestResult('internalDetectionResult')) {
              this.save(false)
            } else {
              return this.$message({
                message: '提交时检测结果（内测）至少填写一项检测项目',
                type: 'error',
                duration: 3 * 1000
              })
            }
          }

          this.save(false)
          // this.testInfo.baseInfo.status = '0'
          // this.exchange()
          break
        case 'saveAndSubmit':
          if (this.baseStatus === '1' || this.baseStatus === '2') { // 待处理提交要判断内测结果
            if (this.checkTestResult('internalDetectionResult')) {
              this.save(true)
            } else {
              return this.$message({
                message: '提交时检测结果（内测）至少填写一项检测项目',
                type: 'error',
                duration: 3 * 1000
              })
            }
          } else this.save(true)
          break
        case 'edit':
          this.wjStatus = ''
          if (this.baseStatus === '0') {
            if (this.oldForm.inspection.version > 1) {
              // this.handleRedo()
              // 重检备注必填
              this.$set(this.columns._supplierDetectionResult, 'className', 'editing')
              for (let i = 0; i < this.resContent._tableFormV.dataSource.length; i++) {
                const item = this.resContent._tableFormV.dataSource[i]
                if (item.supplierDetectionResultGroup && item.supplierDetectionResultGroup.length > 0) {
                  const newArr = []
                  for (let k = 0; k < item.supplierDetectionResultGroup.length; k++) {
                    newArr.push('')
                  }
                  item.supplierDetectionResultGroup = newArr
                  console.log(item.supplierDetectionResultGroup)
                }

                item.supplierDetectionResultEdit = true
              }
              this.tempStatus = '-1'
              this.ifEdit = true
              this.infoCommon._remarks.rules = [this.commonChangeReg]
              this.editTypeChange()
              this.initData()
            } else {
              // 待提交则将申请信息和供应商检测结果改为编辑状态
              this.ifEdit = true
              this.handleEdit()
            }
            // this.handleEdit()
          } else {
            // 否则就是待处理或者处理中状态，将检测结果内测结果改为编辑状态
            this.handleEdit()
          }

          break
        case 'submit':
          // this.handleSubmit()
          if (this.baseStatus === '0') {
            // 待提交
            this.testInfo.baseInfo.status = '1'
            this.exchange()
          } else if (this.baseStatus === '2') {
            if (this.checkTestResult('internalDetectionResult')) {
              this.testInfo.baseInfo.status = '3'
              this.exchange()
            } else {
              this.$message({
                message: '提交时检测结果（内测，关联纱线等级）至少填写一项检测项目',
                type: 'error',
                duration: 3 * 1000
              })
            }
          }
          this.handleButton()
          break
        case 'print':
          this.$router.push(`../quality-yarn-print/${this.yarnUuid}/${this.currentVersion}`)
          break
        case 'end': {
          // this.$set(this.columns._supplierDetectionResult.editOptions, 'rules', [this.commonBlurReg])
          // if ()
          // console.log(this.resContent._tableFormV.dataSource.filter(item => item.testItemsName === '捻向'))
          const testItemsArr = this.resContent._tableFormV.dataSource.filter(item => item.testItemsName === '捻向')
          if (testItemsArr.length && !testItemsArr[0].supplierDetectionResult) {
            this.$message.error('完结时检测结果捻向未填写')
            return
          }

          if (this.checkTestResult('supplierDetectionResult', true)) {
            this.testInfo.baseInfo.status = '3'

            this.exchange()
          } else {
            this.$message({
              message: '完结时检测结果（供应商，关联纱线等级）至少填写一项检测项目',
              type: 'error',
              duration: 3 * 1000
            })
          }
          // this.exchange()
          break
        }
        case 'cancel':
          if (this.pageType === 'add') {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.back()
            break
          }
          this.handleNotEdit()
          this.getInfo(null, true)
          if (this.state === '-2') { // 取消重检则将此状态恢复
            this.tempStatus === this.testInfo.baseInfo.status
            // 将备注改为非必填
            this.infoCommon._remarks.rules = []
          }
          break
        case 'back':
          this.testInfo.baseInfo.status = '0'
          this.exchange()
          this.handleNotEdit()
          // this.handleButton()
          break
        case 'redo':
          this.handleRedo()
          break
        case 'comment': // 评价
          this.$set(this.popOptions2, 'visible', true)
          break
        case 'delete':
          this.handleDelete()
          break
      }
    },
    async handleRedo() {
      // 进入可编辑状态，可以保存和取消，保存即调重检接口
      this.tempStatus = '-2'
      this.ifEdit = true
      // 清空检测信息数据
      // debugger
      this.resContent._tableFormV.dataSource.forEach(item => {
        for (const key in this.resContent._tableFormV.columns) {
          if (key !== '_testItemsName' && key !== '_standardRangeReference') item[this.resContent._tableFormV.columns[key].prop] = ''
        }
      })
      this.$set(this.columns._supplierDetectionResult, 'className', 'editing')

      for (let i = 0; i < this.resContent._tableFormV.dataSource.length; i++) {
        const item = this.resContent._tableFormV.dataSource[i]
        if (item.supplierDetectionResultGroup && item.supplierDetectionResultGroup.length > 0) {
          const newArr = []
          for (let k = 0; k < item.supplierDetectionResultGroup.length; k++) {
            newArr.push('')
          }
          item.supplierDetectionResultGroup = newArr
          console.log(item.supplierDetectionResultGroup)
        }

        item.supplierDetectionResultEdit = true
      }
      // debugger
      this.testInfo.baseInfo.supplierGrade = ''
      this.testInfo.baseInfo.internalGrade = ''
      // 重检备注必填
      this.infoCommon._remarks.rules = [this.commonChangeReg]
      this.editTypeChange()
      this.initData()
    },
    handleEdit() {
      if (this.baseStatus === '0' || this.pageType === 'add') {
        // 待提交可编辑供应商检测结果
        this.tempStatus = '-1'
        this.$set(this.columns._supplierDetectionResult, 'className', 'editing')
        for (let i = 0; i < this.resContent._tableFormV.dataSource.length; i++) {
          this.resContent._tableFormV.dataSource[i].supplierDetectionResultEdit = true
        }
        this.editTypeChange()
      } else if (this.baseStatus === '1' || this.baseStatus === '2') {
        // 处理中可编辑内测检测结果
        this.tempStatus = '-1'
        this.$set(this.columns._internalDetectionResult, 'className', 'editing')
        for (let i = 0; i < this.resContent._tableFormV.dataSource.length; i++) {
          this.resContent._tableFormV.dataSource[i].internalDetectionResultEdit = true
        }
      }
      // else if (this.baseStatus === '1') { // 不改变状态，保存时后端改变状态
      // 待处理 编辑则改为处理中
      // this.testInfo.baseInfo.status = '2'
      // this.handleEdit()
      // this.exchange() // 保存后再改变状态 因为待处理允许撤回
      // }
    },
    handleNotEdit() {
      this.tempStatus = this.baseStatus
      this.ifEdit = false
      this.$set(this.columns._supplierDetectionResult, 'className', '')
      this.$set(this.columns._internalDetectionResult, 'className', '')
      for (let i = 0; i < this.resContent._tableFormV.dataSource.length; i++) {
        this.resContent._tableFormV.dataSource[i].supplierDetectionResultEdit = false
        this.resContent._tableFormV.dataSource[i].internalDetectionResultEdit = false
      }
      this.editTypeChange()
      this.initTestInfo()
    },
    // 提交或者撤回时，改变tempStatus, 改变按钮显示
    handleButton() {
      this.tempStatus = this.baseStatus
    },
    // 完结和处理中提交，检测结果至少填写一项
    checkTestResult(key, wanjie) {
      const temp = this.$refs.detailTable.form.model.tableFormV
      let res = false
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].testItemsName !== '捻向') {
          if (wanjie) {
            if (temp[i].hasOwnProperty(key) && temp[i][key] !== '') {
              if (temp[i].supplierDetectionResult && this.baseStatus === '0') {
                res = true
                break
              } else if (temp[i].internalDetectionResult && this.baseStatus === '1' || this.baseStatus === '2') {
                res = true
                break
              }
            }
          } else {
            if (temp[i].hasOwnProperty(key) && temp[i][key] !== '' && temp[i].isRelationYarnGrade || temp[i].internalDetectionResult) {
              if (temp[i].supplierDetectionResult && this.baseStatus === '0') {
                res = true
                break
              } else if (temp[i].internalDetectionResult && this.baseStatus === '1' || this.baseStatus === '2') {
                res = true
                break
              }
            }
          }
        }
      }
      return res
    },
    versionInfoChange(version) {
      this.getInfo(version)
    },
    // 获取下拉选数据
    async getAllSelect() {
      if (this.pageType === 'add') return
      const obj = { ...this.infoCommon }
      // for (const key in obj) {
      //   const item = obj[key]
      //   if (item.select && !item.dataSource.length) {
      //     const res = await item.select[0](item.select[1])
      //     this.$set(this.infoCommon[key], 'dataSource', res)
      //   }
      // }
      for (const key in obj) {
        const item = obj[key]
        if (item.select && !item.dataSource.length) {
          if (this.infoData[item.prop] && this.infoData[item.prop].value) {
            console.log('this.infoData[item.prop]', this.infoData[item.prop], item.prop)
            this.$set(this.infoCommon[key], 'dataSource', [this.infoData[item.prop]])
          }
        }
      }
    },
    // 获取详情 reset 表示取消，须重置数据
    async getInfo(version, reset) {
      const params = {
        yarnUuid: this.yarnUuid,
        version: version || ''
      }
      let resData = null
      if (reset) {
        // 此处重复了一步initTestInfo，修改已采购未采购重复了一次initData，暂不修改
        resData = this.$utils.deepClone(this.oldForm || {})
      } else {
        const res = await api.qaYarnInspectionPhysicalInfo(params)
        resData = res.data
        this.testInfo.baseInfo = resData
        this.tempStatus = this.testInfo.baseInfo.status
        this.oldForm = this.$utils.deepClone(resData || {})
        // 试纱员和审核员id
        this.createdBy = this.oldForm.createdBy || ''
        this.applyBy = this.oldForm.applyBy || ''
        // debugger
      }
      this.$set(this.infoCommon._executiveStandardName, 'dataSource', resData.executiveStandardName && JSON.parse(resData.executiveStandardName) || '')

      const inspection = resData.inspection // 申请信息
      this.latestVersion = inspection.version
      this.currentVersion = resData.version !== 9999 ? resData.version + '' : inspection.version + ''

      inspection.executiveStandardName = resData.executiveStandardName ? JSON.parse(resData.executiveStandardName) : []
      inspection.reportType = resData.reportType
      inspection.remarks = resData.remarks
      inspection.skuName = inspection.sku && inspection.sku.value || ''
      this.infoData = inspection
      // console.log('this.infoData = inspection', this.infoData)
      if (resData.attachmentName) {
        this.infoCommon._attachment.className = 'upload-a-info hideButton'
        this.infoData.attachmentName = resData.attachmentName
        this.infoData.attachmentPath = resData.attachmentPath
        this.infoData.attachment = [{
          name: this.infoData.attachmentName,
          url: this.infoData.attachmentPath
        }]
      } else this.infoData.attachment = []
      this.infoData.reportTypeId = resData.reportTypeId
      const inspectionPhysicalInformations = resData.inspectionPhysicalInformations // 检测结果
      this.testInfo.info = inspectionPhysicalInformations
      this.commentDataSource = this.testInfo.baseInfo.inspectionComments
      this.getAllSelect()
      this.initData(this.infoData.isPurchased)
      this.initTestInfo()

      // 编辑过后就不从基础数据获取动态列
      const dataList = resData.supplierDetectionResult || []
      let sFlag = false
      for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i]
        if (item.supplierDetectionResult) {
          sFlag = true
          break
        }
      }
      if (resData.status === 0 && !sFlag) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.yarnCalculationGrade(resData.inspection, null, true)
          }, 500)
        })
      }
    },
    // 获取检测项目
    async getPysicalSurveyConfigList() {
      const res = await api.pysicalSurveyConfigList()
      this.testInfo.config = res.data || []
      this.testInfo.config.push({
        gradeRule: true, // 等级规则
        id: 10,
        isRelationYarnGrade: false, // 是否关联纱线等级
        name: '捻向', // 名称
        orders: 10, // 排序
        uuid: 'wistDirection'
      })
      // categoryId 10
      // console.log('获取检测项目', this.testInfo.config)
      if (this.pageType !== 'add') {
        this.ifEdit = false
        this.editTypeChange()
        this.getInfo()
      } else {
        this.initTestInfo()
        this.initData(this.infoData.isPurchased)
      }
    },
    // 装载检测信息
    async initTestInfo() {
      // this.resContent._tableFormV.dataSource = []
      for (let i = 0; i < this.testInfo.config.length; i++) {
        const item = this.testInfo.config[i]
        const temp = {
          isRelationYarnGrade: item.isRelationYarnGrade,
          testItemsId: item.uuid,
          edit: true,
          supplierDetectionResultEdit: false, // 检测结果（供应商）待提交时可以编辑，只能由申请人编辑
          internalDetectionResultEdit: false // 检测结果（内测）待处理/处理中时可以编辑（权限控制）
        }
        temp.testItemsName = item.name
        let ifRes = false // 是否存在该检测项目的检测信息
        for (let i = 0; i < this.testInfo.info.length; i++) {
          if (this.testInfo.info[i].testItemsId === item.uuid) {
            ifRes = true
            Object.assign(temp, this.testInfo.info[i], { testItemsName: temp.testItemsName }) // 物测项目改名后使用新名字
            // for (const key in this.columns) {
            //   if (key !== '_testItemsName') {
            //     temp[this.columns[key].prop] = this.testInfo.info[i][this.columns[key].prop]
            //   }
            //   temp.id = this.testInfo.info[i].id
            //   version
            // }
            break
          }
        }
        if (!ifRes) {
          for (const key in this.columns) {
            if (key !== '_testItemsName') {
              temp[this.columns[key].prop] = ''
            }
          }
        }
        if (temp.testItemsName === '实际含量') {
          temp.itemType = 'children'
          if (temp.supplierDetectionResult) {
            temp.supplierDetectionResultGroup = temp.supplierDetectionResult.split('/')
          } else {
            temp.supplierDetectionResultGroup = []
            if (this.infoData.proportion && this.infoData.proportion) {
              for (let i = 0; i < this.infoData.proportion.split('/').length; i++) {
                temp.supplierDetectionResultGroup.push('')
              }
            }
          }

          if (temp.internalDetectionResult) {
            temp.internalDetectionResultGroup = temp.internalDetectionResult.split('/')
          } else {
            temp.internalDetectionResultGroup = []
            if (this.infoData.proportion) {
              for (let i = 0; i < this.infoData.proportion.split('/').length; i++) {
                temp.internalDetectionResultGroup.push('')
              }
            }
          }
        } else if (temp.testItemsId === 'wistDirection'/* temp.name === '捻向' */) {
          temp.itemType = 'select'
          if (this.selectData.length === 0) {
            const res = await api.getSelectData({ categoryId: 10, enabled: 'Y' })
            this.selectData = res.map(e => ({
              label: e.label,
              value: e.value

            }))
          }
          temp.dataSource = this.selectData
        }
        // this.resContent._tableFormV.dataSource.push(temp)
        if (this.resContent._tableFormV.dataSource.length <= i) {
          // 提交后不能增加检测项目
          if (temp.id || (this.pageType === 'add' || this.baseStatus === '0')) this.resContent._tableFormV.dataSource.push(temp)
        } else Object.assign(this.resContent._tableFormV.dataSource[i], temp)
      }
      // this.testInfo.config.forEach(item => { // 遍历检测项目

      // })
    },
    // 检测信息改变时将其更新到tableForm里
    setFormDatas(v) {
      for (const k in v) {
        this.resContent._tableFormV.dataSource[k] = Object.assign(this.resContent._tableFormV.dataSource[k], v[k])
      }
    },
    // 改变状态 commitStatus	string	目标状态  0：待提交  1：待处理 3：已处理
    async exchange() {
      const res = await api.exchange({
        yarnUuid: this.yarnUuid,
        commitStatus: this.baseStatus
      })
      this.getInfo()
      this.showResult(res)
      this.fetchLog(this.getLogMessages('UPDATE', '/qa/qaYarnInspectionTesting/exchange'), { ...this.oldForm, stauts: this.baseStatus }, JSON.stringify({ beforeText: `在'质量管理-纱线检测-纱线将一条数据改变状态`, beforeCode: this.oldForm }))
    },
    // 成份改变时，检测信息的实际含量重置
    changeProportion(value) {
      // console.log(value)
      // if (this.pageType === 'add') return
      for (let i = 0; i < this.resContent._tableFormV.dataSource.length; i++) {
        if (this.resContent._tableFormV.dataSource[i].testItemsName === '实际含量') {
          this.resContent._tableFormV.dataSource[i].supplierDetectionResultGroup = value
        }
      }
    },
    showResult(res) {
      if (res && res.code === 200) {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 3 * 1000
        })
      } else {
        this.$message({
          message: res && res.message || '操作失败',
          type: 'error',
          duration: 3 * 1000
        })
      }
    },
    // 提交评价
    async submitComment(data) {
      const res = await api.addComment({
        yarnUuid: this.yarnUuid,
        ...data
      })
      this.showResult(res)
      this.$set(this.popOptions2, 'visible', false)
      this.getInfo(this.currentVersion)
    },
    // 信息修改的时候调用，新增或保存的时候不再调用
    async yarnCalculationGrade(data, notReset, edit) {
      // this.$refs.detailTable.form.validate(async valid => {

      // if (valid) {
      if (!data) data = this.$refs.infoForm.form.model
      // const data1 = this.$refs.infoForm.form.model
      // const data2 = this.$refs.detailTable.form.model.tableFormV
      const data2 = this.resContent._tableFormV.dataSource
      let proportion = ''

      if (Object.prototype.toString.call(data.proportion) === '[object Array]') {
        proportion = data.proportion.join('/')
      } else proportion = data.proportion || 100
      const submitData1 = {
        ingredients: data.ingredients || {}, // 成分
        spinningMethod: data.spinningMethod || {}, // 纺纱方法
        cardingMethod: data.cardingMethod || {}, // 梳棉方法
        proportion: proportion,
        yarnCount: data.yarnCount || {},
        yarnGradeAttrConfig: []
      }

      data2.forEach(item => {
        // if (item.isRelationYarnGrade) { // 不论是否关联纱线等级都传
        submitData1.yarnGradeAttrConfig.push({
          pysical: {
            value: item.testItemsId,
            label: item.testItemsName
          },
          supplierValue: item.supplierDetectionResult,
          internalValue: item.internalDetectionResult

        })
        // }
      })
      const res = await api.yarnCalculation(submitData1)
      const tempData = res.data || []
      if (res.code === 200 && res.data) {
        tempData.forEach(item => {
          for (let i = 0; i < data2.length; i++) {
            if (item.pysicalId === data2[i].testItemsId) {
              data2[i].standardRangeReference = item.standardRangeReference || ''
              data2[i].supplierGrade = item.supplierGrade || ''
              data2[i].internalGrade = item.internalGrade || ''
              break
            }
          }
        })
      } else {
        if (!notReset) {
          // 只在改变申请信息的时候提示，填写测试信息的时候不再提示
          this.$message({
            message: '基础试纱项目数据为空',
            type: 'warning'
          })
          for (let i = 0; i < data2.length; i++) {
            data2[i].standardRangeReference = ''
            data2[i].supplierGrade = ''
            data2[i].internalGrade = ''
            data2[i].supplierDetectionResult = ''
            data2[i].internalDetectionResult = ''
          }
        }
      }
      if (!edit) {
        this.handleEdit()
      }

      console.log('yarnCalculation')
      console.log(res, data2)
      // }
      // })
    },
    async handleAdd(submitData) {
      const res = await api.addQaYarnInspectionPhysical(submitData)
      if (res.code === 200) {
        this.yarnUuid = res.data
        this.ifEdit = false
        this.$router.push(`./quality-yarn-edit/${res.data}`)
        // this.$router.push({ params: merge(this.$route.params, res.data) })
        this.getInfo()
      }

      this.fetchLog(this.getLogMessages('INSERT', '/qa/qaYarnInspectionTesting/add'), submitData, JSON.stringify({ beforeText: `在'质量管理-纱线检测-纱线物测,新增一条记录`, beforeCode: submitData }))
      // this.$store.dispatch('tagsView/delView', this.$route)
      // this.$router.back()
    },
    async handleDelete() {
      this.$confirm('确认删除当前数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'customClass'
      }).then(async() => {
        const res = await api.deleteQaYarnInspectionPhysical({ yarnUuid: this.yarnUuid })
        this.showResult(res)
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang='scss' scoped>
.quality-yarn-detail {
  padding: 20px;
  margin-bottom: 20px;
  /deep/ .el-table--border{
    border-bottom: 1px solid #dfe6ec;
  }
}
.button-group {
  width: calc(100% - 210px);
  transition: width 0.28s;
  position: fixed;
  text-align: center;
  bottom: 0;
  padding: 10px;
  background: #ffffff;
  border-top: 1px solid #ecf0f3;
  z-index: 999;
  right: 0;
  .button {
    margin-right: 12px;
  }
}
.fixed-footer {
  width: calc(100% - 54px) !important;
}
.wrap-content {
  position: relative;
  background: #fff;
  margin-bottom: 20px;
  .title {
    color: #151222;
    font-size: 16px;
    padding: 20px 0 15px 20px;
  }
  .content2 {
    display: flex;
    font-size: 14px;
    padding: 10px 20px 20px;
    .content {
      font-size: 18px;
      padding-left: 10px;
      vertical-align: middle;
    }
  }
  .select-version {
    position: absolute;
    left: 100px;
    top: 12px;
  }
}
.info-wrap {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-bottom: 20px;
  color: #666666;
  span {
    margin-right: 5px;
  }
  .yarn-number {
    font-size: 18px;
    color: #151222;
  }
}
</style>

<style lang="scss">
.quality-yarn-detail {
  .page-tables.comment {
    .el-table {
      .el-table__body-wrapper {
        background-color: #fff;
      }
    }
  }
  .page-tables {
    padding: 0 20px 10px;
    .el-table {
      background-color: #f5f7fa;
      .cell {
        padding: 0;
        > span {
          padding: 0 12px;
        }
      }
    }
    .el-table th.is-leaf .cell {
      padding: 0 12px;
    }
    .el-table__row td {
      padding: 0;
    }
    tbody .el-table__row td {
      border-bottom-width: 1px;
      height: 41px;
      .el-form-item {
        height: 40px;
      }
      .is-error {
        border: 1px solid #ff4949;
      }
    }
    .el-table th.is-leaf,
    .el-table td {
      border-color: #d0d8e0;
    }
    .el-table--group::after,
    .el-table--border::after,
    .el-table::before {
      background-color: #d0d8e0;
    }
    .el-table tr,
    .el-table th {
      background-color: transparent;
      td {
        .el-input__inner {
          border: none;
          background-color: transparent;
          height: 40px;
        }
        &.editing {
          background-color: #fff;
        }
      }
    }
  }

  .info-form-wrap {
    .el-form-item__label {
      color: #474747;
    }
    .el-textarea__inner {
      height: 36px;
    }
  }
  //产品编号单独处理input css
  .choose-product {
    .el-input__inner {
      border: 1px solid #1890ff;
    }
    *::-webkit-input-placeholder {
      color: #0986ff;
      text-align: center;
    }
    *:-moz-placeholder {
      color: #0986ff;
      text-align: center;
    }
    *::-moz-placeholder {
      color: #0986ff;
      text-align: center;
    }
    *:-ms-input-placeholder {
      color: #0986ff;
      text-align: center;
    }
  }
  .commentPop .el-dialog__body {
    padding-bottom: 0;
  }
  .yarn-batch{
    height: 36px;
      .el-form-item__content{
        div{
          overflow: hidden;/*超出部分隐藏*/
          white-space: nowrap;/*不换行*/
          text-overflow:ellipsis;/*超出部分文字以...显示*/
        }

      }
    }

  .el-upload-list {
    width: 230px;
  }
  .el-form-item__label{
    flex-shrink: 0 !important;
  }
}
.quality-manage{
    .el-form-item__content{
      width: 100% !important;
    }

  }
  .quality-yarn-detail{
    .info-form-disable{
      padding-bottom: 20px;
      .el-form.el-form--inline .el-form-item{
        margin-bottom: 0 !important;
      }
      .el-form-item__label::before{
        content: "" !important;
      }
      .el-form-item__label{
        color: #888E9E !important;
      }
      .el-form-item__content{
        color: #474747 !important;
      }
    }
  }

</style>
