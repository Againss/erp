import * as api from '../api/index'
export const Auditing = {
  created() {
    this.pageLoad({})
  },
  methods: {
    pageLoad(params = {}) {
      switch (this.tabActive.toString()) {
        case 'pgbm':
          this.getEvaluationDepartment(params)
          break
        case 'shbm':
          this.getReviewDepartment(params)
          break
      }
    },
    /* 准入供应商评估列表 */
    async getEvaluationDepartment(params = {}) {
      this.loading = true
      const res = await api.getJudgmentDepartmentData(params)
      if (this.$pub.responseValidate(res)) {
        this.loading = false
        const data = res.data
        this.departmentDataSource = data.list || []
        this.departmentPagination = {
          ...this.departmentPagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    },
    /* 清除新增部门数据 */
    closeDialogPopBox(dialogPopBox) {
      this.$set(dialogPopBox, 'formDatas', {})
      this.$set(dialogPopBox, 'visible', false)
      this.$set(this.popOptions, 'visible', false)
    },
    /* 显示弹窗  编辑*/
    async showDialogVisble({ type, data }) {
      this.$set(this.dialogUpdateReviewDepartmentVisble, 'formDatas', {})
      switch (type.toString()) {
        case 'insertJudgment':
          this.$set(this.dialogInsertJudgmentDepartmentVisble, 'content', this.insertEvaluationControls)
          this.$set(this.dialogInsertJudgmentDepartmentVisble, 'title', '新增')
          this.$set(this.dialogInsertJudgmentDepartmentVisble, 'visible', true)
          this.popOptions = this.$utils.deepClone(this.dialogInsertJudgmentDepartmentVisble)
          break
        case 'updateJudgment':
          this.getJudgmentDepartmentInfo(data, type)
          break
        case 'insertReview':
          this.$set(this.dialogInsertReviewDepartmentVisble, 'content', this.insertReviewDepartmentControls)
          this.$set(this.dialogInsertReviewDepartmentVisble, 'title', '新增')
          this.$set(this.dialogInsertReviewDepartmentVisble, 'visible', true)
          this.popOptions = this.$utils.deepClone(this.dialogInsertReviewDepartmentVisble)
          break
        case 'updateReview':
          this.getJudgmentDepartmentInfo(data, type)
          break
      }
    },
    /* 准入供应商评估部门-信息 */
    async getJudgmentDepartmentInfo(params = {}, type) {
      if (type === 'updateJudgment') {
        // 准入供应商
        const res = await api.getJudgmentDepartmentInfoData(params)
        if (this.$pub.responseValidate(res)) {
          this.rowCopy = { ...res.data }
          this.$set(this.dialogUpdateJudgmentDepartmentVisble, 'formDatas', res.data)
          this.$set(this.dialogUpdateJudgmentDepartmentVisble, 'content', this.updateEvaluationControls)
          this.$set(this.dialogUpdateJudgmentDepartmentVisble, 'title', '编辑')
          this.$set(this.dialogUpdateJudgmentDepartmentVisble, 'visible', true)
          this.popOptions = this.$utils.deepClone(this.dialogUpdateJudgmentDepartmentVisble)
        }
      } else {
        // 合格供应商
        const res = await api.getReviewDepartmentByIdData({ id: params.id })
        this.rowCopy = { ...res.data }
        this.$set(this.dialogUpdateReviewDepartmentVisble, 'formDatas', res.data)
        this.$set(this.dialogUpdateReviewDepartmentVisble, 'content', this.updateReviewDepartmentControls)
        this.$set(this.dialogUpdateReviewDepartmentVisble, 'title', '编辑')
        this.$set(this.dialogUpdateReviewDepartmentVisble, 'visible', true)
        this.popOptions = this.$utils.deepClone(this.dialogUpdateReviewDepartmentVisble)
      }
    },
    /* 合格供应商审核部門-增加 */
    async insertReviewDepartment(params = {}) {
      const res = await api.insertReviewDepartmentData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('INSERT', '/srm/reviewDepartment/addBatch'), params, JSON.stringify({ beforeText: `在'供应商采购管理-基础数据-合格供应商审核部門,新增一条记录`, beforeCode: params }))
        const callback = this.pageLoad
        const options = {
          type: 'insert',
          message: '新增成功！',
          api: '/srm/reviewDepartment/addBatch',
          callback,
          logParams: {},
          dialog: this.popOptions
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    /* 准入供应商评估部门-新增 */
    async insertJudgmentDepartment(params = {}) {
      const res = await api.insertJudgmentDepartmentData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('INSERT', '/srm/judgmentDepartment/add'), params, JSON.stringify({ beforeText: `在'供应商采购管理-基础数据-准入供应商评估部门,新增一条记录`, beforeCode: params }))
        const callback = this.pageLoad
        const options = {
          type: 'insert',
          message: '新增成功！',
          api: '/srm/judgmentDepartment/add',
          callback,
          logParams: {},
          dialog: this.popOptions
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    /* 准入供应商评估部门-刪除 */
    async deleteJudgmentDepartment(params = {}) {
      const res = await api.deleteJudgmentDepartmentData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('DEL', '/srm/judgmentDepartment/delete'), params, JSON.stringify({ beforeText: '在供应商采购管理-准入供应商评估部门删除一条数据', beforeCode: params }))
        const callback = this.pageLoad
        const options = {
          type: 'delete',
          message: '删除成功！',
          api: '/srm/judgmentDepartment/delete',
          callback,
          callbackParams: {
            pageNum: this.departmentPagination.currentPage,
            pageSize: this.departmentPagination.pageSize
          },
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    },

    /* tab切换 */
    tabClickHandle(tab, event) {
      this.tabActive = tab['name']
      this.pageLoad({ pageNum: 1, pageSize: 20 })
    },
    /* 获取合格供应商审核部门列表 */
    async getReviewDepartment(params = {}) {
      this.loading = true
      const res = await api.getReviewDepartmentData(params)
      if (this.$pub.responseValidate(res)) {
        this.loading = false
        const data = res.data
        this.reviewDataSource = data.list || []
        this.reviewPagination = {
          ...this.reviewPagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    },
    /* 编辑弹框显示 */
    /* showUpdateAuditingPopbox(params = {}) {
      this.getAuditingUpdateDetails(params).then((res) => {
        Object.assign(this.dialogUpdateJudgmentDepartmentVisble, { content: this.updateEvaluationControls, visible: true })
      })
    }, */
    /* 准入供应商评估部门编辑 */
    async updateJudgmentDepartment(params = {}) {
      const res = await api.updateJudgmentDepartmentData(params)
      if (this.$pub.responseValidate(res)) {
        const { beforeCode, afterCode } = this.compareData(this.rowCopy, params, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplierCertdential/modify'), params, JSON.stringify({ beforeText: `在'供应商采购管理-供应商资格评估,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
        const callback = this.pageLoad
        const options = {
          type: 'update',
          message: '编辑成功！',
          api: '/srm/judgmentDepartment/modify',
          callback,
          callbackParams: {
            pageNum: this.departmentPagination.currentPage,
            pageSize: this.departmentPagination.pageSize
          },
          logParams: {},
          dialog: this.popOptions
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    /* 合格供应商审核部门编辑 */
    async updateReviewDepartment(params = {}) {
      const res = await api.updateReviewDepartmentData(params)
      if (this.$pub.responseValidate(res)) {
        const { beforeCode, afterCode } = this.compareData(this.rowCopy, params, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplierCertdential/modify'), params, JSON.stringify({ beforeText: `在'供应商采购管理-供应商资格评估,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
        const callback = this.pageLoad
        const options = {
          type: 'update',
          message: '编辑成功！',
          api: '/srm/reviewDepartment/edit',
          callback,
          callbackParams: {
            pageNum: this.reviewPagination.currentPage,
            pageSize: this.reviewPagination.pageSize
          },
          logParams: {},
          dialog: this.popOptions
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    /* 删除 */
    async deleteReviewDepartment(params = {}) {
      const res = await api.deleteReviewDepartmentData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('DEL', 'srm/reviewDepartment/delete'), params, JSON.stringify({ beforeText: '在供应商采购管理-供应商资格评估删除一条数据', beforeCode: params }))
        const callback = this.pageLoad
        const options = {
          type: 'delete',
          message: '删除成功！',
          api: 'srm/reviewDepartment/delete',
          callback,
          callbackParams: {
            pageNum: this.reviewPagination.currentPage,
            pageSize: this.reviewPagination.pageSize
          },
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    }
  }
}
