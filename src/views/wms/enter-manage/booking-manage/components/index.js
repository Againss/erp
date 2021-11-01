import * as api from '../api/index'
export const BookingManage = {
  created() {
    this.getBookingManageList()
  },
  /*   computed: {
      getStorageType () {
        return
      }
    }, */
  methods: {
    /* 预约单管理-列表 */
    async getBookingManageList(params = {}) {
      const res = await api.getBookingManageData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.dataSource = data.list || []
        /*  this.dataSource.sort((a, b) => {
           return b.deliveryInfo.deliveryman.localeCompare(a.deliveryman)
         }) */
        // console.log('params.status', params.status)
        this.getMapStatus(params.status)
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
        this.clearHightCurrent()
      }
      const paramsCount = { ...params }
      if (paramsCount) {
        this.$delete(paramsCount, 'status')
      }
      // 总数量接口--把状态去掉
      const numRes = await api.bookCount(paramsCount)
      this.totalNum = numRes.data || {}
    },
    getMapStatus(status = '') {
      const actions = new Map(
        [
          ['', () => { this.active = 'all' }],
          ['0', () => { this.active = 'toAudit' }],
          ['1', () => { this.active = 'waitReceiving' }],
          ['2', () => { this.active = 'received' }],
          ['3', () => { this.active = 'rejected' }],
          ['4', () => { this.active = 'signed' }]
        ])
      const getMap = (value) => {
        return actions.get(value.toString())
      }
      getMap && getMap(status || '')
    },
    async valitateStatus(params = {}) {
      const res = await api.getReservationInfoData(params)
      if (this.$pub.responseValidate(res)) {
        if (res.data.status === 1) {
          return true
        } else {
          this.$message({
            message: '关联单号必须为待收货状态！',
            type: 'warning'
          })
          return false
        }
      }
      return false
    },
    /* 预约单管理-审核 */
    async getReservationAudit(params) {
      const res = await api.getReservationAuditData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('UPDATE', '/wms/stockIn/reservation/audit/{reservationNo}'), params, JSON.stringify({ beforeText: '仓储管理-入库预约单管理, 审核了一条数据', beforeCode: params }))
        const callback = this.getBookingManageList
        const options = {
          type: 'insert',
          message: '审核成功！',
          api: '/wms/stockIn/reservation/audit/{reservationNo}',
          callback,
          logParams: {},
          dialog: this.dialogCheckBookingManageVisable
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    highlightCurrentRow(currentRow) {
      if (currentRow) {
        const reservationNo = currentRow.reservationNo
        const status = currentRow.status
        if (reservationNo) {
          this.checkStatus = status
          this.checkDereservationNo = reservationNo
        }
      }
    },
    clearHightCurrent() {
      this.checkStatus = ''
      this.checkDereservationNo = ''
    },
    /* tab切换 */
    tabClick(tab, event) {
      const tabName = tab.name.toString()
      const formParms = this.$refs.searchForm.dynamicValidateFormRuleForm
      this.clearHightCurrent()
      if (tabName) {
        switch (tabName) {
          case 'toAudit':
            this.status = 0
            this.getBookingManageList({
              ...formParms,
              status: 0
            })
            break
          case 'waitReceiving':
            this.status = 1
            this.getBookingManageList({
              ...formParms,
              status: 1
            })
            break
          case 'received':
            this.status = 2
            this.getBookingManageList({
              ...formParms,
              status: 2
            })
            break
          case 'rejected':
            this.status = 3
            this.getBookingManageList({
              ...formParms,
              status: 3
            })
            break
          case 'signed':
            this.status = 4
            this.getBookingManageList({
              ...formParms,
              status: 4
            })
            break
          default:
            this.status = ''
            this.getBookingManageList({
              ...formParms,
              status: ''
            })
        }
      }
    },
    /* 开始收货 */
    startReceving() {
      // console.log(this.checkDereservationNo)
      if (this.checkDereservationNo) {
        switch (this.checkStatus.toString()) {
          case '1':
            this.$router.push({
              path: '/wms/enter-manage/booking-manage/booking-details',
              query: { reservationNo: this.checkDereservationNo, type: 'start', status: this.checkStatus }
            })
            break
          case '0':
            this.$message({
              message: '预约单未审核，无法收货！',
              type: 'warning',
              duration: 3000
            })
            break
          case '2':
            this.$message({
              message: '预约单已收货，请勿重复收货！',
              type: 'warning',
              duration: 3000
            })
            break
          case '3':
            this.$message({
              message: '已取消预约单，无法收货！',
              type: 'warning',
              duration: 3000
            })
            break
        }
      } else {
        this.$set(this.dialogStartReceivingVisable, 'visible', true)
      }
    },
    // 通过接口
    async signPass(data) {
      console.log('通过', data)
      const res = await api.passList(data)
      if (res.code !== 200) {
        return false
      }
      this.getBookingManageList({
        status: 4,
        pageNum: this.pagination.pageNum || 1,
        pageSize: this.pagination.pageSize || 20
      })
      if (data.status === 'P') {
        this.$message({
          type: 'success',
          message: '数据通过!'
        })
      } else {
        this.$message({
          type: 'success',
          message: '数据不通过!'
        })
      }
      this.fetchLog(
        this.getLogMessages('UPDATE', '/wms/stockIn/reservation/audit/signed'),
        data,
        JSON.stringify({
          beforeText: `在'入库管理-预约单管理', ${data.status === 'P' ? '通过' : '不通过'}了一条记录`,
          beforeCode: { data: data }
        })
      )
    },
    /* 其它入库 */
    otherPutStorage() {
      this.$router.push({
        path: '/wms/enter-manage/booking-manage/start-put-storage/',
        query: { stockType: 6, type: 'other' }
      })
      // this.$router.push(
      //   {
      //     path: '/wms/enter-manage/booking-manage/start-put-storage?type=other&stockType=6'
      //   })
    },
    // 生产入库入口
    productStorage() {
      this.$router.push({
        path: '/wms/enter-manage/booking-manage/product-storage/',
        query: { stockType: 2, timestamp: new Date().getTime() }
      })
    }
  }
}
