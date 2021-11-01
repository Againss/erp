import * as api from '../api/index'
// import DetailsFooter from './details-footer'
export const ApplicationSupplier = {
  created() {
    this.getApplicationList()
  },
  methods: {
    /* 获取考核周期列表 */
    async getApplicationList(params = {}) {
      this.loading = true
      const res = await api.getApplicationData({ ...params, ...this.searchParams })
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
    /* 新增 */
    async insertApplicationSupplier(params) {
      const res = await api.insertApplicationSupplierData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('INSERT', '/srm/supplier/applicant/save'), params, JSON.stringify({ beforeText: `在'供应商采购管理-申请新供应商,新增一条记录`, beforeCode: params }))
        const callback = this.getApplicationList
        const options = {
          type: 'insert',
          message: '新增成功！',
          api: '/srm/supplier/applicant/save',
          callback,
          logParams: {},
          dialog: this.popOptions
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    changeSupplierType(value, form, formDatsas, setFormDatas) {
      if (value) {
        this.getSupplierNameList(value).then((data) => {
          setFormDatas({ supplierId: '' })
          if (data && data.length > 0) {
            this.$set(this.allocationApplicationPopBox.content[1], 'dataSource', data)
          }
        })
      }
    },
    /* 获取当前日期 */
    filterDate() {
      const date = new Date()
      return (date.getFullYear() + '-' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`) + '-' + (date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`))
    },
    /* 显示新增弹出框 */
    async showInsertApplicationPopbox() {
      const orgsList = await this.getOrgsList(this.$store.state.user.userInfo.orgs)
      if (orgsList && orgsList.length > 0) {
        this.$set(this.insertApplicationPopBox.content[0], 'dataSource', orgsList)
      }
      this.$set(this.insertApplicationPopBox, 'formDatas', {
        formTime: this.filterDate(new Date())
        // applicantDepartmentId: this.insertApplicationPopBox.content[0].dataSource[0].value || ''
      })
      this.$set(this.insertApplicationPopBox, 'visible', true)
      this.popOptions = this.$utils.deepClone(this.insertApplicationPopBox)
    },
    /* 显示修改弹出框 */
    async showUpdateApplicationPopbox({ row, type }) {
      const data = (await api.getApplicationInfoData({ id: row.id })).data || {}
      if (type === 'edit') {
        this.rowCopy = { ...data }
        this.$set(this.editApplicationPopBox, 'formOptions', { 'disabled': false })
        this.$set(this.editApplicationPopBox, 'title', '编辑')
        this.$set(this.editApplicationPopBox, 'okHidden', false)
        const userInfo = await this.getSysUserInfo({ userId: data.applicantUuid })
        const orgsList = this.getOrgsList(userInfo.orgs)
        if (orgsList && orgsList.length > 0) {
          // 如果当前值不在下拉数据中， push一条禁用数据
          if (data.department && data.department.value) {
            if (!orgsList.find(e => e.value === data.department.value)) {
              orgsList.push({ ...data.department, disabled: true })
            }
          }
          this.$set(this.editApplicationPopBox.content[0], 'dataSource', orgsList)
          this.$set(this.popOptions.content[0], 'dataSource', orgsList)
        }
      }
      if (type === 'detail') {
        this.$set(this.editApplicationPopBox, 'title', '查看')
        this.$set(this.editApplicationPopBox, 'okHidden', true)
        this.$set(this.editApplicationPopBox, 'formOptions', { 'disabled': true })
        this.$set(this.editApplicationPopBox.content[0], 'dataSource', [data.department] || [])
      }
      this.$set(this.editApplicationPopBox, 'visible', true)
      this.getSupplierTypeList({ supplierCategory: data.supplierCategory }).then((list) => {
        const supplierTypeList = this.converSupplierTypeList(list)
        if (supplierTypeList && supplierTypeList.length > 0) {
          this.$set(this.editApplicationPopBox.content[2], 'dataSource', supplierTypeList)
          this.$set(this.popOptions.content[2], 'dataSource', supplierTypeList)
        }
      })
      this.$set(this.editApplicationPopBox, 'formDatas', { ...data, supplierType: data.supplierType.toString() })
      this.popOptions = this.$utils.deepClone(this.editApplicationPopBox)
    },
    getOrgsList(list) {
      const newArr = []
      if (list && list.length > 0) {
        list.forEach(item => (newArr.push({ value: item.orgId, label: item.name })))
      }
      return newArr
    },
    /* 编辑 */
    async updateApplicationSupplier(params = {}) {
      const res = await api.updateApplicationData(params)
      if (this.$pub.responseValidate(res)) {
        const { beforeCode, afterCode } = this.compareData(this.rowCopy, params, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplierCertdential/modify'), params, JSON.stringify({ beforeText: `在'供应商采购管理-申请新供应商,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
        const callback = this.getApplicationList
        const options = {
          type: 'insert',
          message: '编辑成功！',
          api: '/srm/supplier/applicant/modify',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          logParams: {},
          dialog: this.popOptions
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    /* 删除 */
    async deleteAuditing(params = {}) {
      const res = await api.deleteAuditingData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('DEL', '/srm/supplier/applicant/delete'), params, JSON.stringify({ beforeText: '在供应商采购管理-申请新供应商删除一条数据', beforeCode: params }))
        const callback = this.getApplicationList
        const options = {
          type: 'delete',
          message: '删除成功',
          api: '/srm/supplier/applicant/delete',
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
    /* 审批 */
    async auditApplication(params = {}) {
      const res = await api.auditApplicationData({ ...params, 'id': this.approvalId })
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplier/applicant/audit'), params, JSON.stringify({ beforeText: '在供应商采购管理-申请新供应商审批一条数据', beforeCode: params }))
        const callback = this.getApplicationList
        const options = {
          type: 'audit',
          message: '审批成功！',
          api: '/srm/supplier/applicant/audit',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          dialog: this.approvalApplicationPopBox,
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    /* 分配 */
    async distributionApplication(params = {}) {
      const res = await api.distributionApplicationData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplier/applicant/modify/distribution'), params, JSON.stringify({ beforeText: '在供应商采购管理-申请新供应商分配一条数据', beforeCode: params }))
        const callback = this.getApplicationList
        const options = {
          type: 'distribution',
          message: '分配成功！',
          api: '/srm/supplier/applicant/modify/distribution',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          dialog: this.allocationApplicationPopBox,
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    }
  }
}
