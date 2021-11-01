
import * as api from '../api/index'
import switchStatus from '../../../public/components/switch-status'
export const TypeOfSupplier = {
  created() {
    this.getTypeSupplierList()
    /* 获取供应商类别 */
    // this.getSupplierTypeListData()
  },
  methods: {
    /* 获取列表 */
    async getTypeSupplierList(params = {}) {
      this.loading = true
      const res = await api.getTypeSupplierData({
        ...params,
        supplierCategory: this.supplierCategory || 0
      })
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
    /* 禁用 */
    async disableTypeSupplier(params = {}) {
      const status = params.status ^ 1
      this.$set(params, 'status', status)
      const res = await api.disableTypeSupplierData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplierType/operate'), params, JSON.stringify({ beforeText: `在'供应商采购管理-供应商类别'${status ? '启用' : '禁用'}一条数据`, beforeCode: params }))
        const message = (status === 1) ? '已启用！' : '已禁用！'
        const callback = this.getTypeSupplierList
        const options = {
          type: 'disable',
          message,
          api: '/srm/supplierType/operate',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          }
        }
        this.$pub.handleSuccessfully(options)
      }
    },

    /* 删除 */
    async deleteTypeSupplier(params = {}) {
      const res = await api.deleteTypeSupplierData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('DEL', '/srm/supplierType/delete'), params, JSON.stringify({ beforeText: '在供应商采购管理-供应商类别删除一条数据', beforeCode: params }))
        const callback = this.getTypeSupplierList
        const options = {
          type: 'delete',
          message: '删除成功！',
          api: '/srm/supplierType/delete',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize,
            supplierCategory: this.supplierCategory
          },
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    },

    /* 编辑 */
    async updateTypeOfSupplier(params = {}) {
      const res = await api.updateTypeSupplierData(params)
      if (this.$pub.responseValidate(res)) {
        const { beforeCode, afterCode } = this.compareData(this.rowCopy, params, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(this.getLogMessages('UPDATE', '/srm/supplierCertdential/modify'), params, JSON.stringify({ beforeText: `在'供应商采购管理-供应商类别,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
        const callback = this.getTypeSupplierList
        const options = {
          type: 'update',
          message: '编辑成功！',
          api: '/srm/supplierType/modify',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize,
            supplierCategory: this.supplierCategory
          },
          logParams: {},
          dialog: this.dialogTypeOfSupplierVisable
        }
        this.$pub.handleSuccessfully(options)
      }
    },

    /* 新增 */
    async insertTypeOfSupplier(params = {}) {
      const res = await api.insertTypeSupplierData({
        ...params,
        supplierCategory: this.supplierCategory
      })
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('INSERT', '/srm/supplierType/add'), params, JSON.stringify({ beforeText: `在'供应商采购管理-基础数据-供应商类别,新增一条记录`, beforeCode: { ...params, supplierCategory: this.supplierCategory }}))
        const callback = this.getTypeSupplierList
        const options = {
          type: 'insert',
          message: '新增成功！',
          api: '/srm/supplierType/add',
          callback,
          callbackParams: {
            supplierCategory: this.supplierCategory
          },
          logParams: {},
          dialog: this.dialogTypeOfSupplierVisable
        }
        this.$pub.handleSuccessfully(options)
      }
    },

    /* 确认 */
    saveTypeSupplierOfType(params = {}) {
      switch (this.dialogType.toString()) {
        case 'add':
          this.insertTypeOfSupplier(params)
          break
        case 'update':
          this.updateTypeOfSupplier(params)
          break
      }
    },
    tabClick(tab, event) {
      const active = tab['name']
      if (active) {
        const columns = this.$utils.deepClone(this.columns)
        const item = {
          prop: 'status',
          label: '状态',
          align: 'left',
          minWidth: 160,
          width: 160,
          components: {
            switchStatus
          },
          componentsOptions: {
            formatter: scope => scope.row.status === 1 ? '1' : '0',
            changeHandel: (scope) => {
              const row = scope.row
              this.disableTypeSupplier({
                id: row.id,
                status: row.status
              })
            },
            permission: 'srm:basicData:supplierType:enable' // 供应商类别启/禁用
          }
        }
        if (active !== 'buyer') {
          columns.splice(4, 1)
        } else {
          if (!(columns[4] && columns[4].components)) {
            columns.splice(4, 0, item)
          }
        }
        this.$set(this, 'columns', columns)
        this.supplierCategory = (active === 'buyer') ? 0 : 1
        this.getTypeSupplierList({
          pageNum: 1,
          supplierCategory: this.supplierCategory
        })
      }
    },
    /* 显示弹框 */
    showTypeOfSupplierDialog({ type, ids }) {
      this.dialogType = type
      switch (type.toString()) {
        case 'add':
          this.dialogForInsertSupplierType()
          break
        case 'update':
          this.dialogForUpdateSupplierType(ids)
          break
      }
    },
    /* 设置新增弹框信息 */
    dialogForInsertSupplierType() {
      this.$set(this.dialogTypeOfSupplierVisable, 'formDatas', {})
      this.$set(this.dialogTypeOfSupplierVisable, 'title', '新增')
      this.$set(this.dialogTypeOfSupplierVisable, 'visible', true)
    },
    /* 设置修改弹框信息 */
    async dialogForUpdateSupplierType(ids) {
      const res = await api.getDetailsByIdData(ids)
      if (this.$pub.responseValidate(res)) {
        this.rowCopy = { ...res.data }
        this.$set(this.dialogTypeOfSupplierVisable, 'formDatas', res.data)
        this.$set(this.dialogTypeOfSupplierVisable, 'title', '修改')
        this.$set(this.dialogTypeOfSupplierVisable, 'visible', true)
      }
    }
  }
}
