import * as api from '../api/index'
import * as apiPublic from '@/views/wms/public/api/index.js'

export const OutboundStatistics = {
  created() {
    const fn = (res) => {
      const index = this.searchData.findIndex((i) => i.prop === 'warehouseCode')
      if (index !== -1) {
        this.searchData[index].dataSource = res
      }
    }
    this.getWarehouseList(fn)
    this.getPageList()
  },
  methods: {
    async getPageList(params = {}) {
      const res = await api.warehouseGetPage(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.list = data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total || 0,
          ...params,
          currentPage: data.pageNum || 1,
          pageSize: data.pageSize || 20
        }
      }
      const totalRes = await api.warehouseTotal(params)
      if (this.$pub.responseValidate(totalRes)) {
        this.sumConfig[0].num = totalRes.data.noTotal || 0
        this.sumConfig[2].num = totalRes.data.stockPcs || 0
        this.sumConfig[3].num = totalRes.data.weightPcs || 0
        this.sumConfig[5].num = totalRes.data.stockRoll || 0
        this.sumConfig[6].num = totalRes.data.weightRoll || 0
      }
    },
    async getDetail(params = {}) {
      const res = await api.warehouseDetail(params)
      res.data.sentOutFact = res.data.sentOutFact ? this.$utils.parseTime(res.data.sentOutFact) : ''
      const data = res.data
      var list = data.list || {}
      if (list.length) {
        list.forEach(n => {
          Object.assign(n, this.otherRes)
        })
      }
      this.popOptions.content[0].dataSource = list
      this.popOptions.visible = true
    },
    async getWarehouseList(fn) {
      const res = await apiPublic.warehouseList({ enable: 1 })
      if (this.$pub.responseValidate(res)) {
        res.data.list.forEach(n => {
          n.value = n.code
          n.label = n.name
        })
        fn(res.data.list)
      }
    },
    async getExportFile(params) {
      const res = await api.exportFile(params)
      if (res) {
        this.$utils.downloadStream(res)
        this.fetchLog(
          this.getLogMessages('EXPORT', '/wms/out/form/report/export'),
          { params },
          JSON.stringify({
            beforeText: `在'仓储管理-报表统计-出库统计'导出成功`,
            beforeCode: { params }
          })
        )
      } else {
        this.$message({
          type: 'info',
          message: '导出错误'
        })
      }
    }
  }
}
