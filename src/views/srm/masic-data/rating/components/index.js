import * as api from '../api/index'
export const Rating = Rating || {
  created() {
    this.getRatingList()
  },
  methods: {
    /* 列表 */
    async getRatingList(params = {}) {
      this.loading = true
      const res = await api.getRatingData(params)
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
    /* 显示弹框 */
    showRatingDialog({ type, data }) {
      if (type === 'insert') {
        this.$set(this.addRatingVisible, 'formDatas', {})
        this.$set(this.addRatingVisible, 'visible', true)
      }
      if (type === 'update') {
        this.rowCopy = { ...data }
        this.$set(this.editRatingPopBox, 'formDatas', {})
        this.$set(this.editRatingPopBox, 'formDatas', data)
        this.$set(this.editRatingPopBox, 'visible', true)
      }
    },
    /* 新增 */
    async insertRating(params = {}) {
      const res = await api.insertRatingData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('INSERT', '/srm/rankAssess/add'), params, JSON.stringify({ beforeText: `在'供应商采购管理-基础数据-等级评定,新增一条记录`, beforeCode: params }))
        const callback = this.getRatingList
        const options = {
          type: 'insert',
          message: '新增成功！',
          api: '/srm/rankAssess/add',
          callback,
          logParams: {},
          dialog: this.addRatingVisible
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    /* 编辑 */
    async updateRating(params = {}) {
      const res = await api.updateRatingData(params)
      if (this.$pub.responseValidate(res)) {
        const { beforeCode, afterCode } = this.compareData(this.rowCopy, params, 'id')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(this.getLogMessages('UPDATE', '/srm/rankAssess/modify'), params, JSON.stringify({ beforeText: `在'供应商采购管理-等级评定,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
        const callback = this.getRatingList
        const options = {
          type: 'update',
          message: '编辑成功！',
          api: '/srm/rankAssess/modify',
          callback,
          callbackParams: {
            pageNum: this.pagination.currentPage,
            pageSize: this.pagination.pageSize
          },
          logParams: {},
          dialog: this.editRatingPopBox
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    /* 禁用 */
    async disableRating(params = {}) {
      const status = params.status ^ 1
      this.$set(params, 'status', status)
      const res = await api.disableRatingData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('UPDATE', '/srm/rankAssess/operat'), params, JSON.stringify({ beforeText: `在'供应商采购管理-等级评定'${status ? '启用' : '禁用'}一条数据`, beforeCode: params }))
        const message = (status === 1) ? '已启用！' : '已禁用！'
        const callback = this.getRatingList
        const options = {
          type: 'disable',
          message,
          api: '/srm/rankAssess/operat',
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
    async deleteRatingListById(params = {}) {
      const res = await api.deleteRatingData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('DEL', '/srm/rankAssess/delete'), params, JSON.stringify({ beforeText: '在供应商采购管理-等级评定删除一条数据', beforeCode: params }))
        const options = {
          type: 'delete',
          message: '删除成功！',
          api: '/srm/rankAssess/delete',
          callback: this.getRatingList,
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
