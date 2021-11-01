<template>
  <div class="guest-sample" :class="isEdit === 'detail' ? 'rules-disable' : ''">
    <!-- 头部状态 -->
    <div class="status-info">
      <div class="info-code">申请单号：{{ detailObj.sampleAnalysisApply && detailObj.sampleAnalysisApply.id ? detailObj.sampleAnalysisApply.id : '-' }}</div>
      <div class="info-detail">
        <span>客服：{{ detailObj.sampleAnalysisApply && detailObj.sampleAnalysisApply.customerService ? detailObj.sampleAnalysisApply.customerService.label : '-' }}</span>
        <span>申请时间: {{ detailObj.sampleAnalysisApply && detailObj.sampleAnalysisApply.createdTime ? this.$filters.parseTime(detailObj.sampleAnalysisApply.createdTime) : '-' }}</span>
        <span v-if="detailObj.status !== 0">工艺员: {{ detailObj.analyseBy || '-' }}</span>
        <span v-if="detailObj.status !== 0">分析时间: {{ detailObj.analyseTime ? this.$filters.parseTime(detailObj.analyseTime) : '-' }}</span>
        <span v-if="detailObj.status === 3">驳回人：{{ detailObj.auditBy || '-' }}</span>
        <span v-if="detailObj.status === 3">驳回时间：{{ detailObj.auditTime ? this.$filters.parseTime(detailObj.auditTime) : '-' }}</span>
        <span v-if="detailObj.status === 4">审核人：{{ detailObj.auditBy || '-' }}</span>
        <span v-if="detailObj.status === 4">审核时间: {{ detailObj.auditTime ? this.$filters.parseTime(detailObj.auditTime) : '-' }}</span>
        <span v-if="detailObj.status === 5">取消人：{{ detailObj.cancelBy || '-' }}</span>
        <span v-if="detailObj.status === 5">取消时间: {{ detailObj.cancelTime ? this.$filters.parseTime(detailObj.cancelTime) : '-' }}</span>
        <span :style="{ 'color': setStatusColor(detailObj.status) }">{{ detailObj.status | getState }}</span>
      </div>
    </div>
    <!-- 基本信息 -->
    <a-info ref="info" />
    <!-- 分析结果 产品信息 -->
    <a-product ref="product" :is-edit="isEdit" @getDetail="getDetailFun" @getClothsTypeInfo="getClothsTypeInfo" />
    <!-- 原料要求 -->
    <a-require
      ref="require"
      :is-edit="isEdit"
      :knit-mode-type="knitModeType"
      :natural-datas="detailObj.naturalFibers"
      :chemical-datas="detailObj.chemicalFibers"
      :compose-data="detailObj.composeYarns"
    />
    <!-- 用料实测 -->
    <materials-stripe ref="materialsStripe" :is-edit="isEdit" :data-sources="detailObj.materialMeasurements || []" />
    <!-- 上机工艺 -->
    <computer-technology ref="computerTechnology" :is-edit="isEdit" />
    <!-- 备注、意见 -->
    <remark-option ref="remarkOption" :is-edit="isEdit" />
    <!-- 评审、驳回弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
    <div :class="{ 'fixed-footer': !sidebar }" class="button-group">
      <div v-if="isEdit === 'edit'" class="button-option">
        <el-button type="primary" @click="bindSave(1)">保存</el-button>
        <el-button v-permission="['techManage:sampleAnalysisResult:submit']" type="primary" @click="bindSave(2)">提交</el-button>
        <el-button @click="cancelEdit">取消</el-button>
      </div>
      <div v-else class="button-option">
        <el-button v-if="(detailObj.status === null || detailObj.status === 0 || detailObj.status === 1 || detailObj.status === 3) && $permission(['techManage:sampleAnalysisResult:modify'])" type="primary" @click="editClick">编辑</el-button>
        <el-button v-if="(detailObj.status === 1 || detailObj.status === 3) && $permission(['techManage:sampleAnalysisResult:submit'])" @click="bindDetSubmit">提交</el-button>
        <el-button v-if="detailObj.status === 2 && $permission(['techManage:sampleAnalysisResult:audit'])" type="primary" @click="approveClick">审核</el-button>
        <el-button v-if="detailObj.status === 2 && $permission(['techManage:sampleAnalysisResult:reject'])" type="primary" @click="rejectClick">驳回</el-button>
        <el-button v-if="(detailObj.status!==null && (detailObj.status === 2 || detailObj.status === 4)) && $permission(['techManage:sampleAnalysisResult:preview'])" @click="printPreview">打印预览</el-button>
        <el-button @click="backListClick">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import aProduct from './components/a-product'
import aInfo from './components/a-info'
import aRequire from './components/a-require'
import materialsStripe from './components/materials-stripe'
import computerTechnology from './components/computer-technology'
import remarkOption from './components/remark-option'
import { getDetail, detailModify, statusApprove, statusReject, detailSubmit, getClothClassDetail, getKnitDyeDetail, getIngredient, getIngredientZh } from './api/index.js' // printPreview detailSubmit, saveSubmit,
import { deepClone } from '@/utils'
import { isArray } from '@/utils/validate'
import logMethods from '@/views/product-center/mixin/log-methods'

export default {
  name: 'AnalyseDetail',
  filters: {
    getState(val) {
      switch (val) {
        case 0:
          return '待分析'
        case 1:
          return '分析中'
        case 2:
          return '待审核'
        case 3:
          return '已驳回'
        case 4:
          return '已完成'
        case 5:
          return '已取消'
        case null:
          return '待分析'
        default:
          return ''
      }
    }
  },
  components: {
    aProduct,
    aInfo,
    aRequire,
    materialsStripe,
    computerTechnology,
    remarkOption
  },
  mixins: [logMethods],
  data() {
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
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
      id: '',
      sampleAnalysisResultId: '',
      csSampleAnalysisApplayId: '',
      popOptions,
      content,
      computerTechnologyValid: false,
      // isEdit: this.$route.query.isEdit || 'detail',
      isEdit: 'detail',
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
      knitModeType: 0// 是否是电脑提花
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  async mounted() {
    this.pinTopList.unshift('上针')
    this.pinBottomList.unshift('下针')
    this.stitchMap.push(this.pinTopList, this.pinBottomList)
    if (this.$route.query.status && this.$route.query.status === '1') {
      this.isEdit = 'edit'
    } else {
      this.isEdit = 'detail'
    }
    this.csSampleAnalysisApplayId = this.$route.params.id

    // await this.$refs.require.getCombinationSelectList().then(res => {
    //   new Array(3).fill(3).forEach((ele, i) => {
    //     this.$set(this.$refs.require.combinationData[i + 1], 'dataSource', res[i])
    //   })
    // })
    // await this.$refs.require.getIngredient().then(res => {
    //   this.$set(this.$refs.require.mainData[1], 'dataSource', res)
    // })
    // debugger
    this.getDetailFun(this.$route.params.id)
    // await this.$refs.product.getData()
    await this.$refs.require.getData()
  },
  methods: {
    // 判断当前布类是否中电脑提花 获取布类下拉
    async getClothsTypeInfo(obj) {
      this.knitModeType = 0
      if (obj && obj.label) {
        // 布类详情
        const res = (await getClothClassDetail({ uuid: obj.value })).data || {}
        if (res && res.knitDye) {
          const res1 = (await getKnitDyeDetail({ id: res.knitDye.id })).data || {}
          if (res1 && res1.knitMode && res1.knitMode.name === '电脑提花') {
            this.knitModeType = 1
          } else {
            this.knitModeType = 0
          }
        }
      }
    },
    // 获取面料成份/比例下拉
    async getIngredient(val) {
      const data1 = await getIngredient({ enabled: 'Y', name: val })
      const data2 = await getIngredientZh({ enabled: 'Y', name: val })
      const res = [...data1.data, ...data2.data].map(e => ({
        value: e.uuid,
        label: e.name,
        type: e.ids ? 1 : 0,
        names: e.ids ? e.names : e.name
      }))
      return res
      // this.$set(this.mainData[1], 'dataSource', res)
    },
    // 获取详情
    async getDetailFun(id, type = 'edit') {
      if (type === 'edit') {
        this.detailObj = (await getDetail({ csSampleAnalysisApplayId: id })).data || {}
        this.detailObjCopy = deepClone(this.detailObj)
        // 判断是否是电脑提花
        this.detailObj.sampleAnalysisApply = {
          ...this.detailObj.sampleAnalysisApply,
          brandName: this.detailObj.sampleAnalysisApply && this.detailObj.sampleAnalysisApply.brand ? this.detailObj.sampleAnalysisApply.brand.label : '',
          sellerName: this.detailObj.sampleAnalysisApply && this.detailObj.sampleAnalysisApply.seller ? this.detailObj.sampleAnalysisApply.seller.label : '',
          sellerTeamName: this.detailObj.sampleAnalysisApply && this.detailObj.sampleAnalysisApply.sellerTeam ? this.detailObj.sampleAnalysisApply.sellerTeam.label : ''
        }
        this.detailObj.materialMeasurements && this.detailObj.materialMeasurements.length && this.detailObj.materialMeasurements.forEach(item => {
          item.element = item.element ? JSON.parse(item.element) : ''
        })
        this.sampleAnalysisResultId = this.detailObj.productInfo ? this.detailObj.productInfo.sampleAnalysisResultId : ''
        // this.sampleAnalysisResultId = this.detailObj.productInfo.sampleAnalysisResultId
        if (this.detailObj.sampleAnalysisApply && this.detailObj.sampleAnalysisApply.attachment) {
          const attachArr = this.detailObj.sampleAnalysisApply.attachment && this.detailObj.sampleAnalysisApply.attachment.split(',')
          const attachnameArr = this.detailObj.sampleAnalysisApply && this.detailObj.sampleAnalysisApply.attachmentName
          const fileArr = attachArr.map((item, index) => {
            return {
              name: attachnameArr[index],
              url: item
            }
          })
          this.detailObj.sampleAnalysisApply.attachment = fileArr
        }
        this.infoData = { sampleAnalysisApply: this.detailObj.sampleAnalysisApply, materialMeasurements: this.detailObj.materialMeasurements || [], reviewOpinion: this.detailObj.reviewOpinion || '' }
      } else {
        let data = (await getDetail({ csSampleAnalysisApplayId: id })).data || {}
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
        reviewOpinion: this.detailObj.reviewOpinion || '',
        attachment: this.detailObj.attachment || [],
        attachmentName: this.detailObj.attachmentName,
        flag: true
      }
      this.$set(this.$refs.remarkOption, 'formDatas', remarkParams)
      this.id = this.detailObj.id
      if (this.detailObj.sampleAnalysisApply) {
        const v = this.detailObj.sampleAnalysisApply
        let muDi = ''
        if (v.analysisTarget) {
          v.analysisTarget.split('|').forEach(ele => {
            muDi += ele === 'O' ? '报价、' : (ele === 'D' ? '样板、' : (ele === 'S' ? '大货、' : ''))
          })
        }
        // const [attachmentName] = v.attachmentName || ''
        const isExistSample = v.isExistSample === 0 ? '否' : '是'
        this.$set(this.$refs.info, 'formDatas',
          {
            ...v,
            analysisTarget: muDi ? muDi.slice(0, -1) : muDi,
            // attachmentName,
            isExistSample,
            targetCompletedTime: (v.targetCompletedTime && this.$filters.parseTime(v.targetCompletedTime, '{y}-{m}-{d} {h}:{i}') || '')
          }
        )
      }

      // const data = { ...this.detailObj.productInfo, csSampleAnalysisApplayId: this.detailObj.csSampleAnalysisApplayId, guestSample: this.detailObj.guestSample || '', analyzeReferencesNo: this.detailObj.analyzeReferencesNo || '' }
      // this.$refs.product.setProDataBili(data)
      if (this.detailObj.productInfo) {
        this.$refs.product.setProDataBiliSelect(this.detailObj.productInfo.fabricCategoryInfo, 5)
        this.$refs.product.setProDataBiliSelect(this.detailObj.productInfo.clothsTypeInfo, 6)
        this.$refs.product.setProDataBiliSelect(this.detailObj.productInfo.printDeyTypeInfo, 7)
        this.$refs.product.setProDataBiliSelect(this.detailObj.productInfo.terryInfo, 8)
        this.$refs.product.setProDataBiliSelect(this.detailObj.productInfo.hairinessInfo, 9)
        this.$refs.product.setProDataBiliSelect(this.detailObj.productInfo.processFlowInfo, 20)
      }

      this.$refs.product.setProDataBili({ ...this.detailObj.productInfo, guestSample: this.detailObj.guestSample || '', analyzeReferencesNo: this.detailObj.analyzeReferencesNo || '' })

      // 判断组合纱线是否存在, 存在即把后端返回的set到select里的dataSource里面
      if (this.detailObj.composeYarns) {
        const composeWayArr = [...new Set(this.detailObj.composeYarns.filter(item => item.composeWayInfo).map(item => { return JSON.stringify(item.composeWayInfo) }))].map(item => JSON.parse(item))
        const coastWayArr = [...new Set(this.detailObj.composeYarns.filter(item => item.coatedWayInfo).map(item => { return JSON.stringify(item.coatedWayInfo) }))].map(item => JSON.parse(item))
        const twistDirectionArr = [...new Set(this.detailObj.composeYarns.filter(item => item.twistDirectionInfo).map(item => { return JSON.stringify(item.twistDirectionInfo) }))].map(item => JSON.parse(item))
        this.$set(this.$refs.require.combinationData[1], 'dataSource', composeWayArr)
        this.$set(this.$refs.require.combinationData[2], 'dataSource', coastWayArr)
        this.$set(this.$refs.require.combinationData[3], 'dataSource', twistDirectionArr)
      }

      // this.$refs.require.setProDataBiliSelect(this.detailObj.productInfo.terryInfo, 1)
      // this.$refs.require.setProDataBiliSelect(this.detailObj.productInfo.hairinessInfo, 2)
      // this.$refs.require.setProDataBiliSelect(this.detailObj.productInfo.processFlowInfo, 3)

      let checkboxs = [
        this.detailObj.naturalFibers && this.detailObj.naturalFibers.length && 1 || '',
        this.detailObj.chemicalFibers && this.detailObj.chemicalFibers.length && 2 || '',
        this.detailObj.composeYarns && this.detailObj.composeYarns.length && 3 || ''
      ]
      checkboxs = checkboxs.find(e => e > 0) ? checkboxs : [1, 2]
      this.$set(this.$refs.require, 'ylFormDatas', { checkboxs })
      this.$refs.require.mainFormDatas = this.detailObj.materialRequirement || {}
      this.$nextTick(() => {
        this.$refs.require.$refs.mainYarnFineness.form.clearValidate()
      })
      let computerTechnologyParams = {}
      if (this.isEdit === 'detail') {
        computerTechnologyParams = {
          id: this.detailObj.machineTechnology && this.detailObj.machineTechnology.id ? this.detailObj.machineTechnology.id : '',
          stitchNum: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.stitchNum) >= 0) ? this.detailObj.machineTechnology.stitchNum + 'G' : '',
          inch: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.inch) >= 0) ? this.detailObj.machineTechnology.inch + '"' : '',
          totalStitchNum: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.totalStitchNum) >= 0) ? this.detailObj.machineTechnology.totalStitchNum + 'N' : '',
          cpi: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.cpi) >= 0) ? this.detailObj.machineTechnology.cpi : '',
          wpi: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.wpi) >= 0) ? this.detailObj.machineTechnology.wpi : '',
          flag: true
        }
      } else if (this.isEdit === 'edit') {
        computerTechnologyParams = {
          id: this.detailObj.machineTechnology && this.detailObj.machineTechnology.id ? this.detailObj.machineTechnology.id : '',
          stitchNum: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.stitchNum) >= 0) ? this.detailObj.machineTechnology.stitchNum : '',
          inch: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.inch) >= 0) ? this.detailObj.machineTechnology.inch : '',
          totalStitchNum: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.totalStitchNum) >= 0) ? this.detailObj.machineTechnology.totalStitchNum : '',
          cpi: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.cpi) >= 0) ? this.detailObj.machineTechnology.cpi : '',
          wpi: this.detailObj.machineTechnology && (parseInt(this.detailObj.machineTechnology.wpi) >= 0) ? this.detailObj.machineTechnology.wpi : '',
          flag: true
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
      // 判断是否是电脑提花
      this.getClothsTypeInfo(this.detailObj.productInfo && this.detailObj.productInfo.clothsTypeInfo || '')

      // 获取面料成份/比例下拉
      const ingredient = await this.getIngredient()
      // 判断面料成分比例是否存在, 存在即把后端返回的set到select里的dataSource里面
      debugger
      if (this.detailObj.materialRequirement) {
        const valusId = this.detailObj.materialRequirement.elementInfo
        const items = ingredient.find(v => v.value === valusId.value)
        this.detailObj.materialRequirement.elementInfo = items
        this.$set(this.$refs.require.mainData[1], 'dataSource', this.detailObj.materialRequirement.elementInfo ? [items] : [])
        this.$set(this.$refs.require.mainData[0], 'dataSource', this.detailObj.materialRequirement.elementInfo ? [items] : [])
      }
      console.log(ingredient)
    },
    editClick() {
      this.isEdit = 'edit'
      const computerTechnologyParams = {
        id: this.detailObj.machineTechnology && this.detailObj.machineTechnology.id ? this.detailObj.machineTechnology.id : '',
        stitchNum: this.detailObj.machineTechnology && ('' + this.detailObj.machineTechnology.stitchNum) ? this.detailObj.machineTechnology.stitchNum : '',
        inch: this.detailObj.machineTechnology && ('' + this.detailObj.machineTechnology.inch) ? this.detailObj.machineTechnology.inch : '',
        totalStitchNum: this.detailObj.machineTechnology && ('' + this.detailObj.machineTechnology.totalStitchNum) ? this.detailObj.machineTechnology.totalStitchNum : '',
        cpi: this.detailObj.machineTechnology && ('' + this.detailObj.machineTechnology.cpi) ? this.detailObj.machineTechnology.cpi : '',
        wpi: this.detailObj.machineTechnology && ('' + this.detailObj.machineTechnology.wpi) ? this.detailObj.machineTechnology.wpi : '',
        flag: true
      }
      this.$set(this.$refs.computerTechnology, 'formDatas', { ...computerTechnologyParams })
    },
    async cancelEdit() {
      this.$refs.product.$refs.proForm.form.clearValidate()
      this.$refs.computerTechnology.$refs.computerTechnologyForm.form.clearValidate()
      this.isEdit = 'detail'
      if (this.$route.query.status && this.$route.query.status === '1') {
        this.$router.push(`/tech-manage/weave-tech/detail/${this.csSampleAnalysisApplayId}`)
      }
      await this.getDetailFun(this.csSampleAnalysisApplayId)
    },
    // 点击审核按钮
    approveClick() {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      this.optionStatus = 'approve'
    },
    // 审核客样分析状态
    async approveSampleAnalysis(data) {
      const res = await statusApprove({ id: this.id, reviewOpinion: data })
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
          beforeText: `在'工艺管理-客样分析-客样分析详情'审核一条记录`,
          beforeCode: { id: this.detailObj.id }
        })
      )
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.$route.query.status && this.$route.query.status === '1') {
        this.$router.push(`/tech-manage/weave-tech/detail/${this.csSampleAnalysisApplayId}`)
      }
      this.getDetailFun(this.csSampleAnalysisApplayId)
    },
    // 点击驳回按钮
    rejectClick() {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      this.optionStatus = 'reject'
    },
    // 驳回客样分析状态
    async rejectSampleAnalysis(data) {
      const res = await statusReject({ id: this.id, reviewOpinion: data })
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
          beforeText: `在'工艺管理-客样分析-客样分析详情'驳回一条记录`,
          beforeCode: { id: this.detailObj.id }
        })
      )
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.$route.query.status && this.$route.query.status === '1') {
        this.$router.push(`/tech-manage/weave-tech/detail/${this.csSampleAnalysisApplayId}`)
      }
      this.getDetailFun(this.csSampleAnalysisApplayId)
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
      this.$router.push(`../list`)
    },
    // 详情状态下点击提交
    async bindDetSubmit() {
      await this.verificationFun()
      this.setDetail(this.detailObjCopy, 3)
    },
    // 编辑状态下点击提交
    async bindSave(val) {
      // const flag = false
      // const product = this.$refs.product
      if (val === 2) {
        // 表单验证 方法
        await this.verificationFun()
      }
      const productParams = this.$refs.product.$refs.proForm.dynamicValidateFormRuleForm
      const productInfo = {
        fabricCategoryInfo: productParams.fabricCategoryInfo,
        clothsTypeInfo: productParams.clothsTypeInfo,
        printDeyTypeInfo: productParams.printDeyTypeInfo,
        terryInfo: productParams.terryInfo,
        hairinessInfo: productParams.hairinessInfo,
        dryWayInfo: productParams.dryWayInfo,
        shrinkL: productParams.shrinkL,
        shrinkW: productParams.shrinkW,
        suggestWidth: productParams.suggestWidth,
        suggestWidthUnit: productParams.suggestWidthUnit,
        suggestWeight: productParams.suggestWeight,
        measuredWeight: productParams.measuredWeight,
        twist: productParams.twist,
        slope: productParams.slope,
        craftRequire: JSON.stringify(productParams.craftRequire),
        processFlowInfo: productParams.processFlowInfo
      }
      const meterialsParams = this.$refs.materialsStripe.$refs.meterialsTable.dataSource
      meterialsParams && meterialsParams.length && meterialsParams.forEach(item => {
        if (item.element && typeof (item.element) === 'object') {
          item.element = item.element ? JSON.stringify(item.element) : ''
        }
      })
      const require = this.$refs.require
      const chemicalFibers = require.chemicalData
      const naturalFibers = require.naturalData
      const composeYarns = require.composeYarns
      const materialRequirement = require.$refs.mainYarnFineness.dynamicValidateFormRuleForm
      // 上机工艺
      const machineTechnologyFormData = this.$refs.computerTechnology.$refs.computerTechnologyForm.dynamicValidateFormRuleForm
      // // 备注、意见、附件数据
      const remarkOptionData = this.$refs.remarkOption.$refs.remarkOptionForm.dynamicValidateFormRuleForm
      // // 上机工艺排针图数据
      const stitchMap = this.$refs.computerTechnology.stitchMap
      // // 上机工艺排三角图数据
      const triangleMap = this.$refs.computerTechnology.triangleMap

      const data = {
        optTYpe: val,
        csSampleAnalysisApplayId: this.csSampleAnalysisApplayId,
        analyzeReferencesNo: productParams.analyzeReferencesNo || '',
        guestSample: productParams.guestSample,
        productInfo: productInfo,
        naturalFibers,
        chemicalFibers,
        composeYarns,
        materialMeasurements: meterialsParams,
        materialRequirement,
        machineTechnology: {
          id: machineTechnologyFormData.id,
          stitchNum: machineTechnologyFormData.stitchNum,
          inch: machineTechnologyFormData.inch,
          totalStitchNum: machineTechnologyFormData.totalStitchNum,
          cpi: machineTechnologyFormData.cpi,
          wpi: machineTechnologyFormData.wpi,
          stitchMap: JSON.stringify(this.setStitchMap(stitchMap)),
          triangleMap: JSON.stringify(triangleMap)
        }, // 上机工艺
        remark: remarkOptionData.remark, // 备注
        reviewOpinion: remarkOptionData.reviewOpinion, // 意见
        attachment: this.setUploadData(remarkOptionData.attachment) // 附件
      }
      this.setDetail(data, val)
    },
    async setDetail(data, val) {
      const arr = deepClone(data)
      arr.materialMeasurements && arr.materialMeasurements.length && arr.materialMeasurements.forEach(item => {
        if (item.element && typeof (item.element) === 'object') {
          item.element = item.element ? JSON.stringify(item.element) : ''
        }
      })
      // data.materialMeasurements = arr

      if (val === 1) {
        let num = 0
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
          await detailModify(arr)
          this.fetchLog(
            this.getLogMessages('UPDATE', 'techManage/sampleAnalysisResult/modify', 'techManage'),
            { id: this.detailObj.id },
            JSON.stringify({
              beforeText: `在'工艺管理-客样分析-客样分析详情'编辑一条记录`,
              beforeCode: { id: this.detailObj.id }
            })
          )
        } else {
          return
        }
        this.$refs.product.$refs.proForm.form.clearValidate()
        this.$refs.require.$refs.ylForm.form.clearValidate()
        // await detailModify(data) { ...data, optTYpe: val }
      } else if (val === 2) {
        // debugger
        await detailModify({ ...arr, optTYpe: val })
        this.fetchLog(
          this.getLogMessages('UPDATE', 'techManage/sampleAnalysisResult/modify', 'techManage'),
          { id: this.detailObj.id },
          JSON.stringify({
            beforeText: `在'工艺管理-客样分析-客样分析详情'提交一条记录`,
            beforeCode: { id: this.detailObj.id }
          })
        )
      //   await saveSubmit(data, data.id)
      } else if (val === 3) {
        await detailSubmit(arr, data.id)
        this.fetchLog(
          this.getLogMessages('UPDATE', 'techManage/sampleAnalysisResult/submit', 'techManage'),
          { id: data.id },
          JSON.stringify({
            beforeText: `在'工艺管理-客样分析-客样分析详情'提交一条记录`,
            beforeCode: { id: data.id }
          })
        )
      }
      this.$message({
        message: val === 1 ? '保存成功' : '提交成功',
        type: 'success'
      })

      this.isEdit = 'detail'
      if (this.$route.query.status && this.$route.query.status === '1') {
        this.$router.push(`/tech-manage/weave-tech/detail/${this.csSampleAnalysisApplayId}`)
      }
      await this.getDetailFun(this.csSampleAnalysisApplayId)
    },
    setStatusColor(status) {
      let statusColor = ''
      switch (status) {
        case 0:
          statusColor = '#FF9214'
          break
        case 1:
          statusColor = '#FF9214'
          break
        case 2:
          statusColor = '#FF9214'
          break
        case 3:
          statusColor = '#888E9E'
          break
        case 4:
          statusColor = '#00BCC5'
          break
        case 5:
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
.guest-sample {
  min-width: 1200px;
  padding: 20px 0 60px;
  .status-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 0 20px;
    .info-code {
      font-size: 18px;
      color: #151222;
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
}
</style>

<style lang="scss">
// .guest-sample {
//   .el-form-item__label-wrap {
//     margin-left: 0 !important;
//   }
// }
.rules-disable {
  .product-box {
    .is-required .el-form-item__label::before {
      content: '';
    }
    .techRequire::before {
      content: '';
    }
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
</style>
