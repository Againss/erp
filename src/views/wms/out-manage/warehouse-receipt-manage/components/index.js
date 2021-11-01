import * as api from '../api/index'
import * as apiPublic from '@/views/wms/public/api/index.js'
import { PRODUCT_TYPE, STOCK_TYPE } from '@/views/wms/public/constants.js'

export const warehouseReceipt = {
  methods: {
    async getPageList(params = {}) {
      const res = await api.warehouseGetPage(params)
      const data = res.data
      this.dataSource = data.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: data.total || 0,
        ...params,
        currentPage: data.pageNum || 1,
        pageSize: data.pageSize || 20
      }
    },
    async getDetailBase(params = {}) {
      const res = await api.warehouseGetDetailBase(params)
      if (this.$pub.responseValidate(res)) {
        res.data.sentOutFact = res.data.sentOutFact ? this.$utils.parseTime(res.data.sentOutFact) : ''
        // 货物类型
        const productType = res.data.productType
        const index = PRODUCT_TYPE.findIndex(n => n.value === productType)
        index !== -1 ? res.data.productType = PRODUCT_TYPE[index].label : ''
        // 出库类型
        const stockType = res.data.stockType
        const index1 = STOCK_TYPE.findIndex(n => n.value === stockType)
        index1 !== -1 ? res.data.stockType = STOCK_TYPE[index1].label : ''
        this.formRes = res.data || {}
        this.sumConfig[0].num = this.formRes.stockOutFact || 0
        this.sumConfig[1].num = this.formRes.weightOutFact || 0
      }
    },
    async getDetailPage(params = {}) {
      const res = await api.warehouseGetDetailPage(params)
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
    async getWarehouseList(params = {}) {
      const res = await apiPublic.warehouseList()
      if (this.$pub.responseValidate(res)) {
        res.data.list.forEach(n => {
          n.value = n.code
          n.label = n.name
        })
        const index = this.searchData.findIndex(
          (i) => i.prop === 'warehouseCode'
        )
        if (index !== -1) {
          this.searchData[index].dataSource = res.data.list
        }
      }
    },
    async getGoodsDetail(params = {}) {
      const res = await apiPublic.goodsDetail(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.popOptions.content[0].dataSource = data.list || []
      }
      this.popOptions.visible = true
    }
  }
}
