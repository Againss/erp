import * as api from '../api/index'
export const TypeOfPayTment = {
  created() {
    this.getTypeOfPayment()
  },
  methods: {
    /* 获取供应商列表 */
    async getTypeOfPayment(params = {}) {
      this.loading = true
      const res = await api.getPaymentData(params)
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
    /* 设置新增信息 */
    setInsertPaymentMessage() {
      this.$set(this.dialogPaymentVisible, 'title', '新增')
      this.$set(this.dialogPaymentVisible, 'formDatas', {})
      this.$set(this.dialogPaymentVisible, 'visible', true)
    },
    /* 设置修改信息 */
    async setUpdatePaymentMessage(ids) {
      const res = await api.getPaymentByIdData(ids)
      if (this.$pub.responseValidate(res)) {
        this.rowCopy = { ...res.data }
        this.$set(this.dialogPaymentVisible, 'formDatas', res.data)
        this.$set(this.dialogPaymentVisible, 'title', '修改')
        this.$set(this.dialogPaymentVisible, 'visible', true)
      }
    },
    /* 确定 */
    saveTypeOfPayment(params = {}) {
      switch (this.dialogType.toString()) {
        case 'insert':
          this.insertTypeOfPayment(params)
          break
        case 'update':
          this.updateTypeOfPayment({
            id: params.id,
            payWay: params.payWay
          })
          break
      }
    },
    /* 编辑 */
    async updateTypeOfPayment(params = {}) {
      const res = await api.updateTypeOfPaymentData(params)
      if (this.$pub.responseValidate(res)) {
        const { beforeCode, afterCode } = this.compareData(this.rowCopy, params, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(this.getLogMessages('UPDATE', '/srm/payMode/modify'), params, JSON.stringify({ beforeText: `在'供应商采购管理-付款方式,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
        const options = {
          type: 'update',
          message: '编辑成功！',
          api: '/srm/payMode/modify',
          callback: this.getTypeOfPayment,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          logParams: {},
          dialog: this.dialogPaymentVisible
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    /* 禁用 */
    async disableTypeOfPayment(params = {}) {
      const res = await api.disableTypeOfPaymentData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('UPDATE', '/srm/payMode/operate'), params, JSON.stringify({ beforeText: `在'供应商采购管理-付款方式'${params.status ? '启用' : '禁用'}一条数据`, beforeCode: params }))
        const message = (params.status === 1) ? '已启用！' : '已禁用！'
        const callback = this.getTypeOfPayment
        const options = {
          type: 'disable',
          message,
          api: '/srm/payMode/operate',
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
    /* 新建 */
    async insertTypeOfPayment(params = {}) {
      const res = await api.insertTypeOfPaymentData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('INSERT', '/srm/payMode/add'), params, JSON.stringify({ beforeText: `在'供应商采购管理-基础数据-付款方式,新增一条记录`, beforeCode: params }))
        const callback = this.getTypeOfPayment
        const options = {
          type: 'insert',
          message: '新建成功！',
          api: '/srm/payMode/add',
          callback,
          logParams: {},
          dialog: this.dialogPaymentVisible
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    /* 显示弹出框 */
    showDialogPopbox({ type, ids }) {
      this.dialogType = type
      switch (type.toString()) {
        case 'insert':
          this.setInsertPaymentMessage()
          break
        case 'update':
          this.setUpdatePaymentMessage(ids)
          break
      }
    },
    /* 删除 */
    async deleteTypeOfPaymentById(params = {}) {
      const res = await api.deleteTypeOfPaymentData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('DEL', '/srm/payMode/delete'), params, JSON.stringify({ beforeText: '在供应商采购管理-付款方式删除一条数据', beforeCode: params }))
        const callback = this.getTypeOfPayment
        const options = {
          type: 'delete',
          message: '删除成功',
          api: '/srm/payMode/delete',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    }
  }
}
