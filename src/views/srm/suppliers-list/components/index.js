import * as api from '../api/index'
import { fetchLog } from '@/views/srm/public/fetchLog'
export const ListOfSuppliers = {
  mixins: [fetchLog],
  mounted() {
    this.pageLoad()
  },
  computed: {
    userId() {
      return this.$store.state.user.userInfo.userId
      // return 'a68a04d586b945239ceab0b90c7c9d15'
    }
  },
  methods: {
    async pageLoad() {
      this.getApplicationSupplier()
      /* 供应商等级 */
      const rankAssessList = await this.getDropDownRankAssess()
      if (rankAssessList && rankAssessList.length > 0) {
        this.$set(this.searchData[4], 'dataSource', rankAssessList)
      }
    },

    /* 获取列表 */
    async getApplicationSupplier(params = {}) {
      this.loading = true
      const res = await api.getApplicationSupplierData({ ...params, ...this.searchParams })
      if (this.$pub.responseValidate(res)) {
        this.loading = false
        const data = res.data
        this.dataSource = data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    },

    /* 跳转到详情页面 */
    jumpToDetails({ type, id }) {
      switch (type.toString()) {
        case 'insert':
          this.$router.push({
            path: '/srm/suppliers-list/' + type,
            query: { type }
          })
          break
        case 'edit': case 'detail':
          this.$router.push({
            path: '/srm/suppliers-list/' + type,
            query: { id }
          })
          break
      }
    },

    /* 新增 */
    async insertSupplier(params) {
      const res = await api.insertSupplierData(params)
      if (this.$pub.responseValidate(res)) {
        const callback = this.getApplicationList
        const options = {
          type: 'insert',
          message: '新增成功！',
          api: '/srm/supplier/applicant/save',
          callback,
          logParams: {},
          dialog: this.insertApplicationPopBox
        }
        this.$pub.handleSuccessfully(options)
      }
    },

    /* 显示新增弹出框 */
    showInsertSuppliersPopbox() {
      this.$set(this.insertApplicationPopBox, 'visible', true)
    },

    /* 查看考核表详细信息 */
    async getUploadAssessmentInfo(params) {
      const res = await api.getUploadAssessmentInfoData(params)
      if (this.$pub.responseValidate(res)) {
        const arrUrl = []
        const attachmentUrl = res.data.attachmentUrl
        this.$set(this.uploadAssessmentInfoPopBox, 'formDatas', {})
        attachmentUrl && attachmentUrl.split(',').map(value => (arrUrl.push({ url: value })))
        if (arrUrl && arrUrl.length > 0) {
          this.$set(this.uploadAssessmentInfoPopBox.content[3], 'dataSource', arrUrl)
        } else {
          this.$set(this.uploadAssessmentInfoPopBox.content[3], 'dataSource', [])
        }
        this.$set(this.uploadAssessmentInfoPopBox, 'formDatas', res.data)
        this.$set(this.uploadAssessmentInfoPopBox, 'visible', true)
      }
    },
    /* 删除 */
    async deleteSupplier(params = {}) {
      const res = await api.deleteSupplierData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('DEL', '/srm/supplier/delete'), params, JSON.stringify({ beforeText: `在'供应商采购管理-供应商列表删除一条数据`, beforeCode: params }))
        const options = {
          type: 'delete',
          message: '删除成功！',
          api: '/srm/supplier/delete',
          callback: this.getApplicationSupplier,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    /* 禁用 */
    async startApplicationSupplier(params = {}) {
      const enabled = params.enabled ^ 1
      const res = await api.startApplicationSupplierData({ ...params, enabled })
      if (this.$pub.responseValidate(res)) {
        const message = (enabled === 1) ? '已启用！' : '已禁用！'
        const callback = this.getApplicationSupplier
        const options = {
          type: 'disable',
          message,
          api: '/srm/supplier/enabled',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    // 查询供应商评估内容
    async getSupplierJudgmentInfo(params = {}) {
      const res = await api.judgmentSupplierInfoData(params)
      if (this.$pub.responseValidate(res)) {
        const detail = res.data.detail || []
        const assessmentPopBox = this.assessmentPopBox
        const supplierName = '供应商管理部'
        const saveAndaddText = assessmentPopBox.saveAndaddText
        this.$set(assessmentPopBox, 'formDatas', { ...assessmentPopBox.formDatas, ...res.data })
        if (saveAndaddText === '审核' || saveAndaddText === '返回') {
          this.$set(assessmentPopBox, 'content', this.assessContent)
          this.$set(assessmentPopBox, 'okHidden', true)
          this.$set(this.assessContent[13], 'dataSource', detail.filter(item => item.userDepartment !== supplierName))
          this.getRankAssessList({ supplierId: params.supplierId })
          return false
        }
        // 判断是否包含供应商并且供应商的userUuid跟操作人的userId相等
        if (detail.map(item => item.userDepartment).includes(supplierName) && detail.filter(item => item.userDepartment === supplierName)[0].userUuid === this.userId) {
          this.$set(assessmentPopBox, 'content', this.assessContent)
          this.$set(assessmentPopBox, 'okHidden', false)
          this.$set(this.assessContent[13], 'dataSource', detail.filter(item => item.userDepartment !== supplierName))
          this.getRankAssessList({ supplierId: params.supplierId })
        } else { // 否则
          const newDetail = detail.filter(item => item.userDepartment !== supplierName)
          newDetail.forEach(item => { if (item.userUuid === this.userId) { item.edit = true } })
          this.$set(assessmentPopBox, 'content', this.detailContent)
          this.$set(this.assessContent[13], 'dataSource', newDetail)
          this.$set(assessmentPopBox, 'okHidden', true)
        }
      }
    },

    // 获取综合评估评分
    async getRankAssessList(params = {}) {
      const res = await api.srmRankAssessList(params)
      // console.log('综合评估评分', res)
      const dataList = res.data.list ? res.data.list.map(item => {
        return {
          label: item.rank,
          value: item.id,
          isNotPass: item.isNotPass
        }
      }) : []
      this.rankAssessList = dataList
      if (dataList && dataList.length > 0) {
        this.$set(this.assessContent[14], 'dataSource', dataList)
      }
    },

    // 评估保存供应商
    async saveSupplierJudgment(params = {}) {
      const res = await api.srmSupplierJudgment(params)
      // console.log('评估保存供应商', res)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('评估保存供应商成功')
      this.$set(this.assessmentPopBox, 'visible', false)
      this.getApplicationSupplier()
    },

    // 提交评估表
    async submitSupplierJudgment(params = {}) {
      const res = await api.srmSupplierJudgmentSubmit(params)
      //  console.log('提交评估表', res)
      if (res.code !== 200) {
        return false
      }
      // this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplier/judgment/submit'), params, JSON.stringify({ beforeText: `在'供应商采购管理-供应商列表'提交评估表`, beforeCode: params }))
      this.$message.success('提交评估表成功')
      this.$set(this.assessmentPopBox, 'visible', false)
      this.getApplicationSupplier()
    },

    // 根据分数算出考核等级和结果
    async getScoreRank(params = {}) {
      const res = await api.srmSupplierScoreRank(params)
      if (this.$pub.responseValidate(res)) {
        // console.log('考核等级与结果', res)
        const data = res.data
        //   this.$set(this.UploadAssessmentPopBox.formDatas, 'rank', res.data.rank)
        let result = null
        if (res.data.isNotPass === 0) {
          result = '通过'
        } else {
          result = '不合格'
        }
        this.$set(this.UploadAssessmentPopBox, 'formDatas', {
          rank: data.rank,
          result
        })
        // this.$set(this.UploadAssessmentPopBox.formDatas, 'result', result)
      }
    },

    // 限制提示
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },

    // 上传考核
    async uploadAssessment(params = {}) {
      const res = await api.srmSupplierUploadAudit(params)
      // console.log('上传考核', res)
      if (res.code !== 200) {
        return false
      }
      // this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplier/upload/audit'), params, JSON.stringify({ beforeText: `在'供应商采购管理-供应商列表'上传考核`, beforeCode: params }))
      this.$message.success('上传考核成功')
      this.$set(this.UploadAssessmentPopBox, 'formDatas', {})
      this.$set(this.UploadAssessmentPopBox, 'visible', false)
      this.getApplicationSupplier()
    },

    // 导出供应商
    async exportSupplier(params = {}) {
      // console.log(this.$refs.searchForm.dynamicValidateFormRuleForm)
      const data = this.$refs.searchForm.dynamicValidateFormRuleForm
      const createdStartTime = data.dateRange && this.$filters.parseTime(data.dateRange[0] + '', '{y}-{m}-{d} {h}:{i}:{s}')
      const createdEndTime = data.dateRange && this.$filters.parseTime(data.dateRange[1] + '', '{y}-{m}-{d} {h}:{i}:{s}')
      const res = await api.srmSupplierExport({ ...data, createdStartTime, createdEndTime })
      //  console.log('导出供应商', res)
      this.$utils.downloadStream(res)
      this.fetchLog(this.getLogMessages('EXPORT', '/srm/supplier/export'), params, JSON.stringify({ beforeText: `在'供应商采购管理-供应商列表'导出成功`, beforeCode: {}}))
    },

    // 审核供应商
    async auditSuppliers(params = {}) {
      const res = await api.judgmentAuditSupplierData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplier/audit'), params, JSON.stringify({ beforeText: '在供应商采购管理-供应商列表审核一条数据', beforeCode: params }))
        const result = params.status === 5 ? '同意' : '不同意'
        this.$message.success(`${result}审核供应商成功`)
        this.$set(this.assessmentPopBox, 'visible', false)
        this.getApplicationSupplier()
      }
    }
  }
}
