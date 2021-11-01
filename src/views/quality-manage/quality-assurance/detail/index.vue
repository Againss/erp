<template>
  <div>
    <div class="quality-detail">
      <div v-if="oldForm.yarnUuid" class="info-wrap">
        <div class="yarn-number">试纱编号：{{ oldForm.yarnUuid }}</div>
        <div style="margin-left: auto;">
          <span v-if="oldForm.createdByName">申请人：{{ oldForm.createdByName }}</span>
          <span v-if="oldForm.createdTime">{{ oldForm.createdTime ? this.$filters.parseTime(oldForm.createdTime) : '-' }}</span>
          <span v-if="oldForm.processedByName">处理人：{{ oldForm.processedByName }}</span>
          <span v-if="oldForm.processedTime">{{ oldForm.processedTime ? this.$filters.parseTime(oldForm.processedTime) : '-' }}</span>
          <span v-if="oldForm.reviewUserName">审核人：{{ oldForm.reviewUserName }}</span>
          <span v-if="oldForm.reviewTime"> {{ oldForm.reviewTime ? this.$filters.parseTime(oldForm.reviewTime) : '-' }}</span>

          <span style="margin-left: 20px;" :style="{ 'color': setStatusColor(oldForm.status) }">{{ statusList[oldForm.status] && statusList[oldForm.status].label }}</span>
        </div>
      </div>

      <div class="main-cont">
        <!-- 申请信息 :disabled="status === '-1'?false:true" -->
        <div class="info-form-wrap" :class="status==='-1'?'':'info-form-disable'">
          <div v-if="versionsVal" class="versions-box">
            <el-select
              v-model="versionsVal"
              :disabled="baseStatus !== '3'|| status === '-2'"
              placeholder="请选择"
              style="width: 80px;"
              size="mini"
              @change="versionInfoChange"
            >
              <el-option
                v-for="item in versionsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <cs-custom-form
            ref="infoForm"
            :data-source="infoCommon"
            :options="formOptions"
            :form-datas="infoData"
          />
        </div>

        <div class="yarn-info" :class="status==='-1'?'':'yarn-disable'">
          <div class="quality-table">
            <cs-custom-form
              ref="yarnForm"
              :data-source="yarnCommon"
              :options="formOptions"
              :form-datas="yarnData"
            />
          </div>

        </div>
      </div>
      <!-- 选择产品列表弹框 -->
      <div class="pop">
        <cs-custom-pop :options="productPopOptions" />
      </div>

    </div>
    <!-- 底部操作栏 -->
    <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
      <div class="button-option">
        <el-button v-if="status === '-1'&& $permission(['qa:qaYarnInspectionTesting:add'])" size="small" type="primary" @click="handleOperate('save')">保存</el-button>
        <el-button v-if="$permission(['qa:qaYarnInspectionTesting:add:exchange'])&&status === '-1' " size="small" @click="handleOperate('saveCommit')">保存并提交</el-button>

        <el-button
          v-if="((status === '0'&& createdBy===userId && $permission(['qa:qaYarnInspectionTesting:add:exchange']))||
            (status === '1'&&commissionerId === userId && $permission(['qa:qaYarnInspectionTesting:process:exchange']))||
            (status === '2'&&reviewUserId === userId && $permission(['qa:qaYarnInspectionTesting:audit:process'])))"
          size="small"
          type="primary"
          @click="handleOperate('commit')"
        >
          {{ status==='2'?'审核':'提交' }}
        </el-button>

        <el-button
          v-if="(status==='0' && $permission(['qa:qaYarnInspectionTesting:modify']))||
            (status ==='1' &&commissionerId === userId && $permission(['qa:qaYarnInspectionTesting:process']))||
            (status ==='2'&&reviewUserId === userId) && $permission(['qa:qaYarnInspectionTesting:audit:process'])"
          size="small"
          type="primary"
          @click="handleOperate('edit')"
        >编辑</el-button>
        <el-button v-if="status === '0' && oldForm.inspection.version===1 && $permission(['qa:qaYarnInspectionTesting:delete'])" size="small" @click="handleOperate('delete')">删除</el-button>
        <!-- 撤回按钮显示逻辑 试纱员待提交未编辑状态下可显示，待审核未编辑状态下可显示  （reviewComments 如果编辑过审核意见为必填，作为判断依据）-->
        <el-button
          v-if="(status === '1' && userId===createdBy && reviewUserId==='' && $permission(['qa:qaYarnInspectionTesting:pending:cancel:exchange']))||
            (status==='2' && userId===commissionerId && oldForm.reviewComments==='' && $permission(['qa:qaYarnInspectionTesting:processing:cancel:exchange']))"
          size="small"
          @click="handleOperate('back')"
        >撤回</el-button>

        <el-button v-if="status === '3' && $permission(['qa:qaYarnInspectionTesting:repeat'])" size="small" @click="handleOperate('redo')">复试</el-button>
        <el-button v-if="status === '-1'" size="small" @click="handleOperate('cancel')">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import editColumn from './common/edit-column.vue'
import { fetchLog } from '@/views/quality-manage/common/fetchLog'
import { addYarn, yarnDelete, yarnExchange, yarnProcess, detailsData, yarnModify, yarnRepeat, yarnProcessAudit } from './api/index.js'
import { info } from './components/a-info.js'
import { chooseProduct } from '@/views/quality-manage/public/common/choose-product'
import { yarnInfo } from './components/yarn-info.js'
import * as api from '@/views/quality-manage/common/basisApi.js'
import inputItem from '@/views/quality-manage/public/components/input-item.vue'
// import merge from 'webpack-merge'
// 单据状态 status 0：待提交，1：待处理，2：处理中，3：已处理
export default {
  name: 'AnalyseDetail',
  mixins: [info, chooseProduct, yarnInfo, fetchLog],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    return {
      yarnIfEdit: false, // 试纱信息
      commonChangeReg,
      commonBlurReg,
      formOptions: {
        inline: true,
        labelWidth: '150px',
        validate: (flag, res, err) => {
          // console.log(flag, res, err)
        }
        // popError: true
      },
      accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG',
      fileList: [],
      infoData: {
        // attachmentName: 'zanting.png',
        attachment: [],
        proportion: '',
        isPurchased: 1
      },
      productionData: {},
      versionsOptions: [],
      versionsVal: '',
      id: this.$route.query.id,
      isDetail: this.$route.query.show,
      yarnUuid: '',
      xmlc: [],
      colorArr: [],
      detailData: {},
      status: '-1', // 用来控制按钮显示 并非实际状态
      baseStatus: '-1', // 记录原始状态，根据状态判断作何处理
      oldForm: {}, // 初始详情数据
      isRedo: false, // 复试
      statusList: {
        '-1': { value: 'add', label: '新增' },
        '0': { value: 'submit', label: '待提交' },
        '1': { value: 'deal', label: '进行中' },
        '2': { value: 'process', label: '待审核' },
        '3': { value: 'end', label: '已处理' }
      },
      yarnData: {},
      yarnList: [], // 保存检测项目信息 数据重组保存时要用
      colorList: [],
      testIdList: [], // 保存检测信息的id，编辑检测信息后保存需要传id
      userId: this.$store.state.user.userInfo.userId, // 当前用户id
      commissionerId: '', // 试纱员id
      reviewUserId: '', // 审核员id
      createdBy: '', // 申请人、创建人
      processedBy: ''// 处理人id
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    },
    pageType() {
      return this.id ? 'detail' : 'add'
    }
  },
  watch: {
  },
  mounted() {
    this.ifEdit = this.pageType === 'add'
    // this.$route.query.id || sessionStorage.getItem('yarnUuid') || ''
    // if (this.$route.query.id) {
    //   this.getDetailsData()
    // }
    // 获取所有下拉框数据
    this.getAllSelect()
    // this.initData(this.isPurchased)
    // 获取详情
    this.getYarnTestConfig()// 初始化试纱信息
  },
  methods: {
    versionInfoChange(version) {
      this.getDetailsData({ version: this.versionsVal || '' })
    },
    // 获取详情数据
    async getDetailsData(data) {
      let res = await detailsData({ yarnUuid: this.id, ...data })
      res = res.data || {}
      this.oldForm = this.$utils.deepClone(res || {})

      // 试纱员和审核员id
      this.commissionerId = this.oldForm.commissioner && this.oldForm.commissioner.value || ''// 试纱员id
      this.processedBy = this.oldForm.processedBy || ''// 试纱员id
      this.reviewUserId = this.oldForm.reviewUser && this.oldForm.reviewUser.value || ''// 审核人id
      this.createdBy = this.oldForm.createdBy || ''
      // 处理版本号
      if (!data) {
        this.versionsOptions = []
        const version = res.inspection.version
        if (version) {
          this.versionsVal = version
          for (let i = 0; i < version; i++) {
            this.versionsOptions.push({
              value: i + 1, label: 'v' + (i + 1)
            })
          }
        }
      }

      this.status = this.baseStatus = res.status + ''
      // 申请信息详情
      this.yarnUuid = res.yarnUuid
      this.infoData = {
        ...res.inspection,
        dyeingFactory: res.dyeingFactory,
        commissioner: res.commissioner,
        colorName: res.colorName && JSON.parse(res.colorName) || [],
        isPurchased: res.inspection.isPurchased,
        yarnUuid: res.yarnUuid,
        remarks: res.remarks
      }

      this.infoData.skuName = this.infoData.sku && this.infoData.sku.value || ''
      if (res.attachmentName) {
        this.infoCommon._attachment.className = 'upload-a-info hideButton'
        this.infoData.attachmentName = res.attachmentName
        this.infoData.attachmentPath = res.attachmentPath
        this.infoData.attachment = [{
          name: this.infoData.attachmentName,
          url: this.infoData.attachmentPath
        }]
      } else this.infoData.attachment = []
      // console.log('this.infoData', this.infoData)
      const dataSourceKey = [
        '_reviewUser', '_yarnCount', '_ingredients', '_spinningMethod',
        '_cardingMethod', '_yarnType', '_supplier'
      ]
      // 处理下拉框回显数据
      for (const key in this.infoCommon) {
        if (dataSourceKey.includes(key)) {
          if (res.inspection[key.split('_')[1]].label) {
            this.$set(this.infoCommon[key], 'dataSource', [{
              label: res.inspection[key.split('_')[1]].label,
              value: res.inspection[key.split('_')[1]].value
            }])
          } else {
            this.$set(this.infoCommon[key], 'dataSource', '')
          }
        }
      }
      this.$set(this.infoCommon._dyeingFactory, 'dataSource', res.dyeingFactory && res.dyeingFactory.label ? [res.dyeingFactory] : '')
      this.$set(this.infoCommon._commissioner, 'dataSource', res.commissioner && res.commissioner.label ? [res.commissioner] : '')
      this.$set(this.infoCommon._colorName, 'dataSource', res.colorName && JSON.parse(res.colorName) || '')
      this.$set(this.yarnCommon._noPermutableClothName, 'dataSource', res.noPermutableClothName && JSON.parse(res.noPermutableClothName) || '')
      this.$set(this.yarnCommon._nonPermutableColorName, 'dataSource', res.nonPermutableColorName && JSON.parse(res.nonPermutableColorName) || '')

      this.yarnData = {
        nonPermutableColorName: res.nonPermutableColorName && JSON.parse(res.nonPermutableColorName) || [],
        noPermutableClothName: res.noPermutableClothName && JSON.parse(res.noPermutableClothName) || [],
        dyeingAdaptabiy: res.dyeingAdaptabiy && res.dyeingAdaptabiy.label || '',
        productStatus: res.productStatus && res.productStatus.label || '',
        reviewTime: res.reviewTime || '',
        reviewUser: res.reviewUser && res.reviewUser.label || '',
        reviewComments: res.reviewComments || '',
        reviewUserId: this.reviewUserId,
        status: res.status
      }
      if (this.baseStatus === '0') { // 如果还没提交 则放弃已保存的测试详情数据，取新的
        this.getYarnTestConfig()
        return
      }
      // 将测试详情数据组装成表格数据

      const tempData = res.inspectionTestingInformations
      const columns = ['name', 'grey']
      this.$set(this.yarnCommon._tableForm, 'columns', [
        {
          prop: 'name',
          label: '疵点项目/流程',
          showOverflowTooltip: true,
          className: '',
          minWidth: 100
        },
        {
          prop: 'grey',
          label: '坯布',
          showOverflowTooltip: true,
          minWidth: 100,
          editOptions: {
            disabled: true,
            readonly: true
          },
          components: { inputItem },
          componentsOptions: {
            changeStatus: (e, scope, formDatas, setFormDatas) => {
              formDatas.tableForm[scope.$index].grey = e
            }
          }
        }
      ])
      let tempItem
      this.testIdList = []
      for (let i = 0; i < tempData.length; i++) {
        this.testIdList.push(tempData[i].id)
        if (!columns.includes(tempData[i].attrId)) {
          columns.push(tempData[i].attrId)
          tempItem = {
            prop: tempData[i].attrId,
            label: tempData[i].attrName,
            showOverflowTooltip: true,
            id: tempData[i].id || '',
            editOptions: {
              itemType: 'select',
              readonly: true,
              disabled: true,
              dataSource: [
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
                { value: 'C', label: 'C' }
              ]
            }
          }
          this.yarnCommon._tableForm.columns.push(tempItem)
        }
      }

      console.log(this.testIdList)
      const dataSource = []
      const yarnTestIdList = [] // yarnTestId相同的为同一个检测项目，将其分组 为了顺序不乱，用数组
      const idList = []
      this.yarnList = []
      for (let i = 0; i < tempData.length; i++) {
        if (!idList.includes(tempData[i].yarnTestId)) {
          idList.push(tempData[i].yarnTestId)
          yarnTestIdList.push({
            key: tempData[i].yarnTestId,
            dataList: [],
            id: tempData[i].id
          })
        }
        yarnTestIdList[idList.indexOf(tempData[i].yarnTestId)].dataList.push(tempData[i])
      }
      yarnTestIdList.forEach(item => {
        const tList = item.dataList
        const tempItem = { name: tList[0].yarnTestName } // 第一列 测试项目
        for (let i = 1; i < this.yarnCommon._tableForm.columns.length; i++) {
          for (let j = 0; j < tList.length; j++) {
            if (tList[j].attrId === this.yarnCommon._tableForm.columns[i].prop) {
              tempItem[tList[j].attrId] = tList[j].attrValue

              if (tList[j].attrId === 'grey') { // 坯布 的单位（下拉列表 个 次）
                tempItem.greyDatasoure = tList[j].grey
              }
              break
            }
          }
        }
        dataSource.push(tempItem)
        this.yarnList.push({ // 数据重组只需要 name 和 uuid
          name: tempItem.name,
          uuid: item.key

        })
      })
      this.$set(this.yarnCommon._tableForm, 'dataSource', dataSource)
      this.initData(this.infoData.isPurchased)
      this.initTestData()
      // 清除校验
      this.$refs.yarnForm.form.clearValidate()
      this.$refs.infoForm.form.clearValidate()
    },
    // 获取试纱信息，表格初始化信息
    async getYarnTestConfig(redo) {
      const columns = []
      columns.push({
        prop: 'name',
        label: '疵点项目/流程',
        showOverflowTooltip: true,
        className: '',
        minWidth: 100

      })
      columns.push({
        prop: 'grey',
        label: '坯布',
        showOverflowTooltip: true,
        minWidth: 100,
        editOptions: {
          disabled: true,
          readonly: true
        },
        components: { inputItem },
        componentsOptions: {
          changeStatus: (e, scope, formDatas, setFormDatas) => {
            formDatas.tableForm[scope.$index].grey = e
          }
        }
      })

      if (this.pageType === 'add' || this.baseStatus === '0') {
        // 第一次新增试纱信息去基础数据请求表格框架
        const yarn = await api.yarnTestConfig()
        this.yarnList = yarn.data || []
        this.yarnList.forEach(v => {
          if (v.unit === '1') {
            v.unit = '轻微/明显/严重'
          } else if (v.unit === '2') {
            v.unit = '次'
          } else if (v.unit === '3') {
            v.unit = '个'
          }
        })
        this.colorList = await api.dyeColorTestConfig()
        // console.log('表格框架', this.yarnList, this.colorList)
      } else {
        // 疵点项目\流程 坯布两列先加上
        this.$set(this.yarnCommon._tableForm, 'columns', columns)
        this.getDetailsData()
        return
      }
      this.colorList.forEach((v, i) => {
        columns.push({
          prop: v.value,
          label: v.label

        })
      })
      const yarnArr = []
      this.yarnList.forEach(v => {
        const tempItem = {}
        tempItem.name = v.name
        tempItem.grey = ''
        tempItem.greyDatasoure = v.unit
        this.colorList.forEach(v2 => {
          tempItem[v2.value] = ''
        })
        yarnArr.push(tempItem)
      })
      this.$set(this.yarnCommon._tableForm, 'dataSource', yarnArr)

      this.$set(this.yarnCommon._tableForm, 'columns', columns)
      if (!redo) {
        this.initData(this.infoData.isPurchased)
      } else {
        this.yarnData = {}
      }
    },
    // 删除整条记录
    deleteFn() {
      if (this.versionsVal !== 1) {
        return this.$message.error('只有版本号为v1才能删除')
      }
      this.$confirm('确认删除当前数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'customClass'
      }).then(async() => {
        const res = await yarnDelete({ yarnUuid: this.yarnUuid })
        if (res.code !== 200) {
          return false
        }
        this.$router.go(-1)

        this.$store.dispatch('tagsView/delView', this.$route)
        return this.$message.success('删除成功!')
      }).catch(() => {

      })
    },
    editTypeChange() {
      // 申请信息修改状态改变
      this.infoCommon._attachment.isShow = this.ifEdit // 可编辑时上传按钮显示
      this.infoCommon._attachmentName.isShow = !this.ifEdit // 不可编辑时显示附件名
    },
    // 重检数据初始化
    intiRedoFn() {
      // 重检可以编辑
      const enabledKeys = ['_dyeingFactory', '_commissioner', '_colorName', '_attachment', '_remarks']
      for (const key in this.infoCommon) {
        if (enabledKeys.includes(key)) {
          this.infoCommon[key].disabled = false
        } else {
          this.infoCommon[key].disabled = true
        }
      }
      if (this.isRedo) {
        // 重检备注必填
        this.infoCommon._remarks.disabled = false
        this.infoCommon._remarks.rules = [this.commonChangeReg]
      }

      this.editTypeChange()
      this.getYarnTestConfig(true)
    },
    initData(isPurchased) {
      // 申请信息
      // 已采购新增可编辑
      // 检测类型 产品编号 染厂 试纱专员 试染颜色 附件
      const tFlag = isPurchased
      // 申请信息
      // 已采购可以编辑
      const enabledKeys = ['_isPurchased', '_skuName', '_dyeingFactory', '_commissioner', '_colorName', '_remarks', '_attachment']
      // 未采购不可以编辑
      const disabledKeys = ['_yarnUuid']
      // 已采购不需要非空判断
      const nullKeys = ['_yarnCount', '_ingredients', '_proportion', '_spinningMethod', '_cardingMethod', '_yarnType', '_supplier', '_yarnBatch', '_batchNo', '_stockInNo', '_stockOutNo', '_relationNo', '_actualStorageWeight', '_address']
      // 未采购隐藏
      const hideKeys = ['_skuName', '_batchNo', '_stockInNo', '_stockOutNo', '_relationNo', '_actualStorageWeight', '_address']
      for (const key in this.infoCommon) {
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
      }
      this.editTypeChange()
    },
    initTestData() {
      // 试纱信息 只有试纱专员、审核人才可以编辑
      for (const key in this.yarnCommon) {
        // // 状态为1试纱员可选 审核人
        if ((this.status === '-1' && this.baseStatus === '1' && key === '_reviewUser') || (this.status === '-1' && this.baseStatus === '1' && key === '_productStatus')) {
          this.yarnCommon[key].disabled = false
          this.yarnCommon[key].readonly = false
          this.yarnCommon[key].itemClassName = 'yarn-info-item'
          this.yarnCommon[key].placeholder = '请选择' + this.yarnCommon[key].label
          this.yarnCommon[key].rules = [this.commonChangeReg]
        } else if (this.status === '-1' && this.baseStatus === '2') {
          if ((key === '_reviewUser' || key === '_productStatus')) {
            this.yarnCommon[key].disabled = true
            this.yarnCommon[key].readonly = true
            this.yarnCommon[key].itemClassName = 'yarn-info-item info-item-disabled'
            this.yarnCommon[key].placeholder = ''
            this.yarnCommon[key].rules = []
          } else {
            this.yarnCommon[key].disabled = false
            this.yarnCommon[key].readonly = false
            this.yarnCommon[key].itemClassName = 'yarn-info-item'
            this.yarnCommon[key].placeholder = '请选择' + this.yarnCommon[key].label
            if (key === '_reviewUser' || key === '_reviewComments' || key === '_dyeingAdaptabiy') {
              this.yarnCommon[key].rules = [this.commonBlurReg]
            }
          }
        } else {
          this.yarnCommon[key].disabled = true
          this.yarnCommon[key].readonly = true
          this.yarnCommon[key].itemClassName = 'yarn-info-item info-item-disabled'
          this.yarnCommon[key].placeholder = ''
          if (key !== '_tableForm' || key !== 'yarnUuid') {
            this.yarnCommon[key].rules = []
          }
        }
      }
      // 表格内 select 表格说明：只有试纱专员、审核人才可以编辑
      const datas = this.yarnCommon._tableForm.columns
      for (let i = 0; i < datas.length; i++) {
        if (i !== 0) {
          if (datas[i].editOptions) datas[i].editOptions.disabled = this.status !== '-1'
          if (datas[i].editOptions) datas[i].editOptions.readonly = this.status !== '-1'
        } else {
          datas[i].className = this.status === '-1' ? 'item-name' : ''
        }
        if ((this.status === '1' && this.baseStatus === '1')) {
          if (i > 1) {
            if (datas[i].editOptions) datas[i].editOptions.disabled = this.status === '-1'
            if (datas[i].editOptions) datas[i].editOptions.readonly = this.status === '-1'
            datas[i].className = 'item-disabled'
          }
        }
      }

      const tabList = this.yarnCommon['_tableForm'].dataSource
      if ((this.status === '-1' && this.baseStatus === '1') || (this.status === '-1' && this.baseStatus === '2')) {
        tabList.forEach((v, i) => {
          this.yarnCommon['_tableForm'].dataSource[i].edit = true
        })
      } else {
        tabList.forEach((v, i) => {
          this.yarnCommon['_tableForm'].dataSource[i].edit = this.status === '-1'
        })
      }
    },
    // 事件
    handleOperate(type) {
      // 待审核 校验染色适应性和审核意见不得为空
      const yarnData = this.$refs.yarnForm.dynamicValidateFormRuleForm
      switch (type) {
        case 'save':
          if (this.baseStatus === '1') {
            const s = this.changeProportion()
            if (s) {
              this.commitData(false)
            } else {
              return this.$message.error('审核人不能为空，胚布疵点项目至少填写一项!')
            }
          } else {
            this.commitData(false)
          }
          break
        case 'saveCommit':
          if (this.baseStatus === '2') {
            // 待审核 校验染色适应性和审核意见不得为空
            if (yarnData.dyeingAdaptabiy && yarnData.reviewComments) {
              this.commitData(true)
            } else {
              return this.$message.error('染色适应性或评审意见不能为空！')
            }
          } else if (this.baseStatus === '1') {
            const s = this.changeProportion()
            if (s) {
              this.commitData(true)
            } else {
              return this.$message.error('审核人不能为空，胚布疵点项目至少填写一项!')
            }
          } else {
            this.commitData(true)
          }

          break
        case 'edit':
          if (this.baseStatus === '0') {
            if (this.oldForm.inspection.version > 1) {
              this.baseStatus = '0'
              this.ifEdit = true
              this.status = '-1'
              this.$set(this.yarnCommon._tableForm, 'dataSource', [])
              this.intiRedoFn()
            } else {
              this.ifEdit = true
              // 待提交则将申请信息改为编辑状态
              this.handleEdit()
            }
          } else if (this.baseStatus === '1') {
            this.handleEdit()
          } else {
            this.handleEdit()
          }
          break
        case 'commit':
          // this.handleSubmit()
          if (this.baseStatus === '0') {
            // 待提交
            this.baseStatus = '1'
            this.exchange()
          } else if (this.baseStatus === '2') {
            // 待审核 校验染色适应性和审核意见不得为空
            const yarnData = this.$refs.yarnForm.dynamicValidateFormRuleForm
            if (yarnData.dyeingAdaptabiy && yarnData.reviewUserId) {
              // this.baseStatus = '3'
              // this.exchange()
              this.commitData(true)
            } else {
              return this.$message.error('染色适应性或评审意见不能为空！')
            }
          } else if (this.baseStatus === '1') {
            // 待处理 进行中
            // 校验染色适应性和审核意见不得为空
            const yarnData = this.$refs.yarnForm.dynamicValidateFormRuleForm
            if (!this.changeProportion() && !yarnData.reviewUserId) {
              return this.$message.error('审核人不能为空，胚布疵点项目至少填写一项!')
            } else {
              this.baseStatus = '2'
              this.exchange()
            }
          }
          break

        case 'end':
          if (this.checkTestResult('supplierDetectionResult')) {
            this.baseStatus = '3'
            this.exchange()
          } else {
            this.$message({
              message: ' 完结时检测结果（供应商）至少填写一项检测项目',
              type: 'error',
              duration: 3 * 1000
            })
          }
          break
        case 'delete':
          this.ifEdit = false
          this.deleteFn()
          break
        case 'cancel':
          this.ifEdit = false
          if (this.pageType === 'add') {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.go(-1)
          } else {
            this.status = this.baseStatus
            this.handleNotEdit()
            this.editTypeChange()
          }
          break
        case 'back':
        // 撤回
          this.$confirm('是否确认撤回？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          }).then(async() => {
            if (this.status === '2') {
              this.baseStatus = '1'
            } else {
              this.baseStatus = '0'
            }
            this.exchange()
            this.ifEdit = false
            this.handleNotEdit()
          })

          break
        case 'redo':
          // 复试
          this.baseStatus = '0'
          this.ifEdit = true
          this.isRedo = true
          this.status = '-1'
          this.$set(this.yarnCommon._tableForm, 'dataSource', [])
          this.intiRedoFn()
          break
      }
    },
    handleEdit() {
      if (this.baseStatus === '0') {
        // 待提交可编辑申请信息
        this.status = '-1'
        this.editTypeChange()
      } else if (this.baseStatus === '1' || this.baseStatus === '2') {
        // 处理中可编辑试纱信息
        this.status = '-1'
        this.initTestData()
      }
    },
    handleNotEdit() {
      this.status = this.baseStatus
      this.initTestData()
    },
    async commitData(isCommit) {
      const infoData = this.$refs.infoForm.dynamicValidateFormRuleForm
      const yarnData = this.$refs.yarnForm.dynamicValidateFormRuleForm

      const qaYarnInspection = { ...infoData }
      delete qaYarnInspection.dyeingFactory
      delete qaYarnInspection.commissioner
      delete qaYarnInspection.color
      delete qaYarnInspection.ieEdit
      if (Object.prototype.toString.call(qaYarnInspection.proportion) === '[object Array]') {
        qaYarnInspection.proportion = qaYarnInspection.proportion.join('/')
      }

      // 根据表头和检测项目重组数据，新增/待提交 传空值
      console.log(this.testIdList)
      const itemList = []
      for (let i = 0; i < this.yarnList.length; i++) {
        for (let j = 1; j < this.yarnCommon._tableForm.columns.length; j++) {
          const tempItem = {
            yarnTestId: this.yarnList[i].uuid, // 试纱项目ID
            yarnTestName: this.yarnList[i].name // 试纱项目NAME

          }
          Object.assign(tempItem, {
            attrId: this.yarnCommon._tableForm.columns[j].prop, // 属性ID
            attrName: this.yarnCommon._tableForm.columns[j].label, // 属性NAME
            attrValue: yarnData.tableForm[i][this.yarnCommon._tableForm.columns[j].prop], // 属性值
            grey: j === 1 ? yarnData.tableForm[i].greyDatasoure || '' : '', // 记录坯布unit 在组件里叫greyDatasoure
            id: this.yarnCommon._tableForm.columns[j].id
          })
          // 检测数据编辑需要传id
          if (this.pageType !== 'add' && this.baseStatus !== '0') {
            tempItem.id = this.testIdList[i * (this.yarnCommon._tableForm.columns.length - 1) + j - 1]
          }

          itemList.push(tempItem)
        }
      }
      const colorName = this.$utils.deepClone(infoData.colorName || [])
      const formDatas = {
        isCommit: isCommit,
        qaYarnInspection: { ...qaYarnInspection },
        remarks: qaYarnInspection.remarks,
        dyeingFactory: infoData.dyeingFactory,
        commissioner: infoData.commissioner,
        colorName: colorName ? JSON.stringify(colorName) : '',
        qaYarnInspectionTestingInformations: itemList,
        attachmentName: qaYarnInspection.attachmentName || '',
        attachmentPath: qaYarnInspection.attachmentPath || ''
      }
      if (formDatas.qaYarnInspection.skuName) {
        formDatas.qaYarnInspection.sku = {
          value: formDatas.qaYarnInspection.skuName,
          label: formDatas.qaYarnInspection.skuName
        }
      }
      // 校验表单
      await this.verificationFun()
      if (this.pageType === 'add' && this.baseStatus === '-1') {
        delete formDatas.qaYarnInspection.attachment
        const res = await addYarn(formDatas)
        if (res.code === 200) {
          this.id = res.data
          this.ifEdit = false
          this.$router.push(`./detail?id=${res.data}&show=detail`)
          // this.$router.push({ query: merge(this.$route.query, { 'id': res.data }) })
          this.getDetailsData()
        }
        this.fetchLog(this.getLogMessages('INSERT', '/qa/qaYarnInspectionTesting/add'), formDatas, JSON.stringify({ beforeText: `在'质量管理-纱线检测-试纱,新增一条记录`, beforeCode: formDatas }))
        // this.$router.back()
      } else {
        let nonPermutableColorName, noPermutableClothName
        if (this.baseStatus === '2') {
          nonPermutableColorName = this.$utils.deepClone(yarnData.nonPermutableColorName || [])
          noPermutableClothName = this.$utils.deepClone(yarnData.noPermutableClothName || [])
        } else {
          nonPermutableColorName = this.$utils.deepClone(infoData.nonPermutableColorName || [])
          noPermutableClothName = this.$utils.deepClone(infoData.noPermutableClothName || [])
        }

        this.modifyOrProcess({
          yarnUuid: this.id,
          isCommit: isCommit,
          qaYarnInspection: formDatas.qaYarnInspection,
          qaYarnInspectionTestingInformations: itemList,
          nonPermutableColorName: nonPermutableColorName ? JSON.stringify(nonPermutableColorName) : '',
          noPermutableClothName: noPermutableClothName ? JSON.stringify(noPermutableClothName) : '',
          dyeingAdaptabiy: yarnData.dyeingAdaptabiy || '',
          productStatus: yarnData.productStatus || '',
          reviewComments: yarnData.reviewComments || '',
          colorName: colorName ? JSON.stringify(colorName) : '', // 试染颜色
          dyeingFactory: formDatas.dyeingFactory || '', // 染厂
          commissioner: formDatas.commissioner || '', // 试纱专员
          reviewUser: yarnData.reviewUser || '', // 审核人
          attachmentName: formDatas.attachmentName || '',
          attachmentPath: formDatas.attachmentPath || '',
          remarks: formDatas.qaYarnInspection.remarks || ''

        })
      }
    },
    // 编辑或者处理
    async modifyOrProcess(data) {
      if (this.baseStatus === '0') { // 待提交
        if (this.isRedo) {
          await yarnRepeat(data)
          this.versionsVal = 0
          this.fetchLog(this.getLogMessages('UPDATE', '/qa/qaYarnInspectionTesting/repeat'), data, JSON.stringify({ beforeText: `在'质量管理-纱线检测-试纱-重检一条数据`, beforeCode: data }))
        } else {
          await yarnModify(data)
          const { beforeCode, afterCode } = this.compareData(this.oldForm, data, 'yarnUuid')
          const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
          flag && this.fetchLog(this.getLogMessages('UPDATE', '/qa/qaYarnInspectionTesting/modify'), data, JSON.stringify({ beforeText: `在'质量管理-纱线检测-试纱,将${JSON.stringify({ 'yarnUuid': data.yarnUuid })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
        }
      } else {
        if (this.baseStatus === '2') {
          // 审核
          await yarnProcessAudit(data)
        } else {
          // 处理
          await yarnProcess(data)
        }

        const { beforeCode, afterCode } = this.compareData(this.oldForm, data, 'yarnUuid')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(this.getLogMessages('UPDATE', '/qa/qaYarnInspectionTesting/process'), data, JSON.stringify({ beforeText: `在'质量管理-纱线检测-试纱处理一条数据,将${JSON.stringify({ 'yarnUuid': data.yarnUuid })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))

        // this.fetchLog(this.getLogMessages('UPDATE', '/qa/qaYarnInspectionTesting/process'), data, JSON.stringify({ beforeText: `在'质量管理-纱线检测-试纱处理一条数据`, beforeCode: data }))
      }

      this.getDetailsData()
      this.ifEdit = false
      this.isRedo = false
      this.handleNotEdit()
    },
    // 获取下拉选数据
    async getAllSelect(formDatas) {
      // const obj = { ...this.infoCommon }
      // for (const key in obj) {
      //   const item = obj[key]
      //   if (item.select && item.dataSource && !item.dataSource.length) {
      //     const res = await item.select[0](item.select[1])
      //     this.$set(this.infoCommon[key], 'dataSource', res)
      //   }
      // }
      // const obj1 = { ...this.yarnCommon }
      // for (const key in obj1) {
      //   const item = obj1[key]
      //   if (item.select && item.dataSource && !item.dataSource.length) {
      //     const res = await item.select[0](item.select[1])
      //     this.$set(this.yarnCommon[key], 'dataSource', res)
      //   }
      // }

      // 有禁用了的数据就push一条禁用数据
      // if (formDatas) {
      //   Object.keys(formDatas).forEach(ele => {
      //     if (formDatas[ele] && Object.prototype.toString.call(formDatas[ele]) === '[object Object]') {
      //       const i = obj.findIndex(e => e.prop === ele)
      //       const has = obj[i].dataSource.find(e => formDatas[ele].value === e.value)
      //       if (!has) {
      //         obj[i].dataSource.push({
      //           value: formDatas[ele].value,
      //           label: formDatas[ele].label,
      //           disabled: true
      //         })
      //       }
      //     }
      //   })
      // }
      // this.$set(this.naturalPopOptions, 'content', arr)
    },
    // 表单验证 fun
    verificationFun() {
      return new Promise((res, rej) => {
        Promise.all([
          new Promise((resolve, reject) => {
            this.$refs.infoForm.form.validate((valid, obj) => {
              if (valid) {
                resolve()
              } else {
                reject(obj)
              }
            })
          }),
          new Promise((resolve, reject) => {
            this.$refs.yarnForm.form.validate((valid, obj) => {
              if (valid) {
                resolve()
              } else {
                reject(obj)
              }
            })
          })
        ]).then(e => {
          res()
        })
      })
    },
    setStatusColor(status) {
      let statusColor = ''
      status = status + ''

      switch (status) {
        case '0':
          statusColor = '#00BCC5'
          break
        case '1':
          statusColor = '#FF9214'
          break
        case '2':
          statusColor = '#00BCC5'
          break
        case '3':
          statusColor = '#00BCC5'
          break
        default:
          statusColor = ''
          break
      }
      return statusColor
    },
    // 改变状态 commitStatus	string	目标状态  0：待提交  1：待处理 3：已处理
    async exchange() {
      const data = {
        yarnUuid: this.id,
        commitStatus: this.baseStatus,
        reviewComments: this.yarnData.reviewComments
      }
      await yarnExchange(data)
      this.fetchLog(this.getLogMessages('UPDATE', '/qa/qaYarnInspectionTesting/exchange'), data, JSON.stringify({ beforeText: `在'质量管理-纱线检测-试纱提交一条数据`, beforeCode: data }))
      this.getDetailsData()
    },
    // 试纱员提交时 检验胚布疵点项目至少有一项为能为空
    changeProportion(value) {
      const val = []
      for (let i = 0; i < this.yarnCommon._tableForm.dataSource.length; i++) {
        const item = this.yarnCommon._tableForm.dataSource[i]
        if (item.grey) {
          val.push(item)
        }
      }
      return val.length !== 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .yarn-info-form{
    font-size: 14px;
    color: #151222;
    .th-wrap{
      border: 1px solid #DCDFE6;
      background: #F5F7FA;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      .th-item{
        display: flex;
        align-items: center;
        height: 100%;
        width: 20%;
        border-left: 1px solid #DCDFE6;
        padding-left: 12px;
        &:first-child{
           border-left: none;
           width: 140px;
           flex-shrink: 0;
        }
      }
    }
    .td-item{
      display: flex;
      border: 1px solid #DCDFE6;
      margin-top: -1px;
      align-items: center;
      color: #606266;
      .left-div{
        width: 140px;
        flex-shrink: 0;
        .left-anem{
          margin-left: 10px;
          font-size: 14px;
        }
      }
      .td{
        width: 30%;
        border-left: 1px solid #DCDFE6;
      }
    }

  }
  .info-form-wrap{
    background-color: #FFFFFF;
    padding-bottom: 20px;
    position: relative;
    .versions-box{
      position: absolute;
      left: 100px;
      top: 12px;
      z-index: 1;
      /deep/.el-input{
        .el-input__inner{
          height: 32px !important;
          line-height: 32px !important;
        }
      }

    }
  }
  .info-wrap{
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-bottom: 20px;
    color: #666666;
    span{
      margin-right: 5px;
    }
    .yarn-number{
      font-size: 18px;
      color: #151222;
    }
  }
  .quality-detail{
    padding: 20px;
    background-color: #EEF5F9;
  }
  .main-cont{
    // background-color: #FFFFFF;
    margin-bottom: 80px;
  }
  .table-title{
    border-top: 16px solid #EEF5F9;
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: rgb(21, 18, 34);
    margin-right: auto;
    height: 74px;
    padding: 0px 30px;
    border-bottom: 1px solid rgb(238, 239, 240);
    margin-bottom: 20px;
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
  }
  .fixed-footer {
    width: calc(100% - 54px)!important;
  }

</style>
<style lang="scss">
    //查看状态
  .quality-detail{
    .upload-a-info,.upload-demo{
      position: relative;
      .el-upload-list{
        position: absolute;
        top: -4px;
        left: 100px;
      }
    }
    .item-name{
      .el-input.is-disabled .el-input__inner{
        background-color: transparent;
        border-color: #ffffff;
        color: #474747;
        border: none;
      }
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td{
      background-color: #FFFFFF;
    }

  }

  .info-form-disable{
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
  .yarn-info-item{
    .el-form-item__label{
      text-align: left;
      padding-left: 12px;
    }

  }
.yarn-info .page-table .el-table .cell > span{
  padding: 0 10px;
}
  // 默认样式
  .yarn-info{
    background-color: #FFFFFF;
    margin-top: 15px;
    .el-table--medium th, .el-table--medium td{
      padding: 0;
      margin: 0;
    }
    .el-form-item{
      margin: 0;
      padding: 0;
    }
    .cell{
      padding: 0;
      margin: 0;
      background-color: #f5f7fa;
      height: 39px;
      line-height: 39px;
      overflow: inherit;
    }
    .el-input__inner{
      border: none;
      border-radius: 0;
    }
    .input-item .el-input--medium .el-input__inner{
      line-height: 38px;
      height: 38px;
    }
    .el-input__inner{
      line-height: 38px;
      height: 38px;
    }
    .el-form-item__label{
      height: 100%;
      min-height: 39px;
      line-height: 39px;
      border-right: 1px solid #e6ebf5;
      background-color: #f5f7fa;
    }
    .el-table--border td:first-child .cell{
      padding: 0 !important;
      span{
         padding-left: 12px !important;
      }

    }
  }
  .yarn-disable{
    .cell {
      span{
        padding-left: 10px;
      }
    }
  }
  .info-item-disabled{
      .el-input__suffix{
        display: none;
      }
  }
  .quality-table{
    padding: 20px;
    padding-top: 0;
    .el-form-item__content{
      width: 100%;
    }
  }
  .yarn-quality-detail{
    padding: 0 10px;
  }
    //定自义错误气泡
    .quality-table .el-form-item__error{
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: -36px;
      left: 0;
      background: #FFF2F0;
      color: #FE4949;
      padding:6px 13px;
      border-radius: 2px;
      border: 1xp s#000;
      border: 1px solid #FFBBB5;
      z-index: 1;

      &:before {
       content: '';
       border-left: 5px solid transparent;
       border-right: 5px solid transparent;
       border-top: 5px solid #fff2f0;
       position: absolute;
       top: 100%;
       left: 50%;
       transform:translateX(-50%);
       z-index: 1;
      }

      &:after {
        content: '';
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #ffafa8;
        position: absolute;
        top: 100%;
        left: 50%;
        transform:translateX(-50%);
      }
    }

  //产品编号单独处理input css
  .choose-product{
    .el-input__inner{
      border: 1px solid #1890ff;
    }
    *::-webkit-input-placeholder {
        color: #0986FF;
        text-align: center;
    }
    *:-moz-placeholder {
        color: #0986FF;
        text-align: center;
    }
    *::-moz-placeholder {
        color: #0986FF;
        text-align: center;
    }
    *:-ms-input-placeholder {
        color: #0986FF;
        text-align: center;
    }
  }
  .item-disabled{
    .el-form-item__content{
      display: block;
    }
  }
.quality-manage {

  .el-table__body tr.current-row > td{
    background-color: #f5f7fa;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #f5f7fa;
  }
}

.yarn-batch{
    .el-form-item__content{
      div{
        overflow: hidden;/*超出部分隐藏*/
        white-space: nowrap;/*不换行*/
        text-overflow:ellipsis;/*超出部分文字以...显示*/
      }

    }
  }
  .quality-manage{
    .el-form-item__content{
      width: 100% !important;
    }
  }
.quality-detail{
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
