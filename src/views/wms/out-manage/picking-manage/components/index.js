import * as api from '../api/index'
import * as apiPublic from '@/views/wms/public/api/index.js'

export const picking = {
  computed: {
    productType() {
      return this.$route.query.productType
    },
    id() {
      return this.$route.params.id
    },
    status() {
      return this.$route.query.status
    }
  },
  methods: {
    async getPageList(params = {}) {
      console.log('状态', params)
      const res = await api.pickGetPage(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data || {}
        this.dataSource = data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total || 0,
          ...params,
          currentPage: data.pageNum || 1,
          pageSize: data.pageSize || 20
        }
      }
      var params1 = {}
      for (var i in params) {
        console.log(i, 'i')
        if (i !== 'status') {
          params1[i] = params[i]
        }
      }
      const countRes = await api.count(params1)
      if (countRes.code === 200) {
        const arr = ['all', 'noPick', 'picked']
        this.tabs.forEach((i, index) => {
          i.num = countRes.data[arr[index]]
        })
      }
    },
    async getDetailBase(params = {}, fn) {
      const res = await api.pickGetDetailBase(params)
      if (this.$pub.responseValidate(res)) {
        fn(res)
      }
    },
    async getDetailPage(params = {}, callback) {
      var res = {}
      const fun = ['pickGetDetailPageNo', 'pickGetDetailPage']
      res = await api[fun[this.status - 1]](params)
      if (this.$pub.responseValidate(res)) {
        callback(res, params)
      }
    },
    async getConfirmDetailPage(params = {}) {
      var res = {}
      res = await api.pickGetDetailPageNo(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data || {}
        this.dataList = data.list || []
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total || 0,
          ...params,
          currentPage: data.pageNum || 1,
          pageSize: data.pageSize || 20
        }
      }
    },
    async getShipperList(params = {}) {
      const res = await apiPublic.shipperList()
      if (this.$pub.responseValidate(res)) {
        res.data.list.forEach(n => {
          n.value = n.shipperId
          n.label = n.shipperName
        })
        const index = this.searchData.findIndex(
          (i) => i.prop === 'shipperId'
        )
        if (index !== -1) {
          this.searchData[index].dataSource = res.data.list
        }
      }
    },
    async printInfo(params = {}) {
      // 此处用待拣货分页明细
      const res = await api.pickGetDetailPageNo(params)
      if (this.$pub.responseValidate(res)) {
        const list = res.data.list || []
        // 根据拣货件数复制多条
        var arr = []
        list && list.length && list.forEach(i => {
          const each = (new Array(i.stockOutPlan)).fill(i)
          arr = [...arr, ...each]
        })
        this.dataSource = arr
      }
    },
    // 拣货员
    async getSysUserList(params = {}) {
      const res = await api.sysUserList({ isEnabled: 1 })
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        var list = []
        data.list && data.list.forEach(el => {
          list.push({
            value: el.id,
            label: el.realName
          })
        })
        this.pickerList = res.data.list || []
        this.dataSourceBaseInfo[this.dataSourceBaseInfo.length - 1].dataSource = list
      }
    },
    async getStockManageList(params = {}) {
      const res = await api.stockManage(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data.list || []
        this.dataSourceAll = data
      }
    },
    async getWarehouseLocationList(params = {}) {
      const res = await apiPublic.getWarehouseLocationData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data.list || []
        const formaterList = data.filter(it => it.isDefault === false && it.isLock === 'E').map(item => ({ value: item.path, label: item.path }))
        this.searchData[0].dataSource = formaterList
      }
    },
    async confirmSubmit(params = {}) {
      try {
        const res = await api.pickConfirm(params)
        this.$message({
          type: res.code === 200 ? 'success' : 'error',
          message: res.code === 200 ? '拣货成功' : '拣货失败'
        })
        if (this.$pub.responseValidate(res)) {
          // 操作日志
          this.fetchLog(this.getLogMessages('UPDATE', '/wms/out/pick/add'),
            params,
            JSON.stringify({
              beforeText: `在'出库管理-拣货单管理-确认拣货'将${JSON.stringify({ 'outPickSubNo': params.outPickSubNo, 'picker': params.picker })}`,
              afterText: '确认拣货',
              afterCode: JSON.stringify(params)
            }))
          this.$router.go(-1)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getGoodsDetail(params = {}) {
      const res = await apiPublic.goodsDetail(params)
      if (this.$pub.responseValidate(res)) {
        res.data.pickCompleteTime = res.data.pickCompleteTime ? this.$utils.parseTime(res.data.pickCompleteTime) : ''
        const data = res.data
        this.popOptions.content[0].dataSource = data.list || []
      }
      this.popOptions.visible = true
    },
    async getSplitDetail(params = {}, callback) {
      const res = await api.splitDetail(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data || {}
        callback ? callback(data) : this.dataSource = data.list || []
      }
    },
    async add(params) {
      try {
        const res = await api.addMateriel(params)
        if (this.$pub.responseValidate(res)) {
          this.$message({
            type: res.code === 200 ? 'success' : 'error',
            message: res.code === 200 ? '添加成功' : '添加失败'
          })
          this.getPage((res) => { this.$set(this.tableData[0], 'dataSource', res) })
        }
      } catch (e) {
        this.getPage((res) => { this.$set(this.tableData[0], 'dataSource', res) })
      }
    },
    async getPage(callback) {
      const res = await api.getPickedPage({ outPickSubNo: this.id, pageSize: 999999, pageNum: 1 })
      if (this.$pub.responseValidate(res)) {
        // 两个接口不统一，字段转换
        !res.data.list ? res.data.list = [] : ''
        res.data.list.forEach(el => {
          el.path = el.locationName
          el.leftWeight = el.weightOutFact
          el.ballCount = el.ballCountFact
          el.edit = el.false
        })
        callback ? callback(res.data.list || []) : ''
      }
    },
    async delMateriel(params) {
      const res = await api.deleteMateriel(params)
      try {
        if (this.$pub.responseValidate(res)) {
          this.$message({
            type: res.code === 200 ? 'success' : 'error',
            message: res.code === 200 ? '删除成功' : '删除失败'
          })
          this.getPage((res) => { this.$set(this.tableData[0], 'dataSource', res) })
        }
      } catch (e) {
        this.getPage((res) => { this.$set(this.tableData[0], 'dataSource', res) })
      }
    },
    async split(params) {
      try {
        const res = await api.splitMateriel(params)
        if (this.$pub.responseValidate(res)) {
          this.$message({
            type: res.code === 200 ? 'success' : 'error',
            message: res.code === 200 ? '拆散成功' : '拆散失败'
          })
          this.getPage((res) => { this.$set(this.tableData[0], 'dataSource', res) })
        }
      } catch (e) {
        this.getPage((res) => { this.$set(this.tableData[0], 'dataSource', res) })
      }
    }
  }
}
