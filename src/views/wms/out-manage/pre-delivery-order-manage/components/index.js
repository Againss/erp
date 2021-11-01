import * as api from '../api/index'
import { PRODUCT_TYPE, STOCK_TYPE } from '@/views/wms/public/constants.js'
export const preDeliveryOrder = {
  methods: {
    async getPageList(params = {}) {
      const res = await api.reservationGetPage(params)
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
    },
    async getDetailBase(params = {}) {
      const res = await api.reservationGetDetailBase(params)
      if (this.$pub.responseValidate(res)) {
        // 货物类型
        const productType = res.data.productType
        const index = PRODUCT_TYPE.findIndex(n => n.value === productType)
        index !== -1 ? res.data.productType = PRODUCT_TYPE[index].label : ''
        // 出库类型
        const stockType = res.data.stockType
        const index1 = STOCK_TYPE.findIndex(n => n.value === stockType)
        index1 !== -1 ? res.data.stockType = STOCK_TYPE[index1].label : ''
        this.formDatasBaseInfo = res.data
        this.sumConfig[0].num = this.formDatasBaseInfo.stockOutPlan || 0
        this.sumConfig[1].num = this.formDatasBaseInfo.weightOutPlan || 0
      }
    },
    async getDetailPage(params = {}) {
      const res = await api.reservationGetDetailPage(params)
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
    async confirm(params = {}) {
      // 拣货状态非已拣货状态：提示“还未拣货，无法出库”；
      // 已出库状态：提示“已确认出库，请勿重复出库”；
      // 8400103, "还未拣货，无法出库"
      // 8400104, "已确认出库，请勿重复出库"
      const fnNo = () => {
        this.$confirm('还未拣货，无法出库', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel',
          showCancelButton: false
        })
      }
      const fnHas = () => {
        this.$confirm('已确认出库，请勿重复出库', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel',
          showCancelButton: false
        })
      }
      if (this.confirmStatus === 1) {
        fnNo()
      } else if (this.confirmStatus === 0) {
        fnHas()
      } else if (!this.confirmStatus && this.confirmStatus !== 0) {
        this.$confirm('请选择出库数据', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel',
          showCancelButton: false
        })
      } else {
        const res = await api.reservationConfirm({ outReservationNo: this.confirmId })
        if (res.code === 8400103) { fnNo() } else if (res.code === 8400104) { fnHas() } else {
          this.$pub.handleSuccessfully({
            showClose: true,
            message: res.code === 200 ? '出库成功' : '出库失败',
            type: res.code === 200 ? 'success' : 'error'
          })
          // 操作日志
          this.fetchLog(this.getLogMessages('UPDATE', '/wms/out/reservation/confirm'),
            { outReservationNo: this.confirmId },
            JSON.stringify({
              beforeText: `在'出库管理-预出库单管理'将${JSON.stringify({ 'outReservationNo': this.confirmId })}`,
              afterText: '确认出库',
              afterCode: JSON.stringify({ 'outReservationNo': this.confirmId }) }))
          this.getPageList({
            pageNum: this.pagination.pageNum || 1,
            pageSize: this.pagination.pageSize || 20
          })
        }
      }
    },
    async getWarehouseList(fn) {
      const res = await api.warehouseList({ enable: 1 })
      if (this.$pub.responseValidate(res)) {
        res.data.list.forEach(n => {
          n.value = n.code
          n.label = n.name
        })
        fn(res.data.list)
      }
    },
    async getShipperList(fn) {
      const res = await api.shipperList()
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
    }

  }
}
