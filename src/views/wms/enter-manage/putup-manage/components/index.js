import * as api from '../api/index'
export const PutupManage = {
  methods: {
    highlightCurrentRow(currentRow) {
      const shelfNo = currentRow && currentRow.shelfNo
      const status = currentRow && currentRow.status
      if (shelfNo) {
        this.checkStatus = status
        this.checkShelfNo = shelfNo
      }
    },

    /* 上架确认 */
    async confirmForPutup() {
      if (this.checkShelfNo) {
        switch (this.checkStatus.toString()) {
          case '0':
            this.$router.push({
              path: '/wms/enter-manage/putup-manage/putup-confirm',
              query: {
                shelfNo: this.checkShelfNo
              }
            })
            break
          case '1':
            this.$message({
              message: '已上架，请勿重复上架！',
              type: 'error',
              duration: 3000
            })
            break
        }
      } else {
        this.$set(this.dialogPutUpConfirmVisable, 'visible', true)
      }
    },

    /* 上架单管理-列表 */
    async getPutupManageList(params = {}) {
      const res = await api.getPutupManageData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.dataSource = data.list || []
        this.activeStatus(params.status)
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
      const paramsCount = { ...params }
      if (paramsCount) {
        this.$delete(paramsCount, 'status')
      }
      // 总数量接口--把状态去掉
      const numRes = await api.putupCount(paramsCount)
      this.totalNum = numRes.data || {}
    },
    activeStatus(status = '') {
      switch (status.toString()) {
        case '0':
          this.active = 'waiting'
          break
        case '1':
          this.active = 'beenOn'
          break
        default:
          this.active = 'all'
      }
    },
    /* tab切换 */
    tabClick(tab, event) {
      const tabName = tab.name.toString()
      const formParms = this.$refs.searchForm.dynamicValidateFormRuleForm
      this.checkStatus = ''
      this.checkShelfNo = ''
      if (tabName) {
        switch (tabName) {
          case 'all':
            this.getPutupManageList({
              status: '',
              ...formParms
            })
            break
          case 'waiting':
            this.getPutupManageList({
              status: 0,
              ...formParms
            })
            break
          case 'beenOn':
            this.getPutupManageList({
              status: 1,
              ...formParms
            })
            break
          default:
            this.getPutupManageList()
        }
      }
    },
    /* 上架单管理-详情 */
    async getStockInShelfInfo(params) {
      const res = await api.getStockInShelfInfoData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.putStorageInfoFormDatas = {
          ...data,
          ...data.deliveryInfo,
          createdTime: data.createdTime && this.$utils.parseTime(data.createdTime)
        }
        this.shelfDetail = res.data
        console.log('打印data', data)
        // 货主
        this.putStorageInfoFormDatas.shipperModel = data.deliveryInfo.shipperModel.label || ''
        // 两种写法：input和select，select中dataSource为数组
        // this.putStorageInfoFormDatas.shelfMan = data.shelfMan.label || ''
        if (this.putStorageInfoData && this.putStorageInfoData[7]) {
          this.$set(this.putStorageInfoData[7], 'dataSource', [data.shelfMan])
        }
        /*      if (this.pageType === 'confirm') {
               this.$set(this.putStorageInfoData[7], "disabled", false)
             } */
      }
    },

    /* 上架明细tab切换 */
    detailTabClick(tab, event) {
      const tabName = tab.name.toString()
      if (tabName) {
        switch (tabName) {
          case 'waiting':
            /* 待上架列表 */
            this.getWaitingShelfProductList({ shelfNo: this.shelfNo })
            break
          case 'already':
            /* 已上架列表 */
            this.getAlreadyShelfProductList({})
            break
        }
      }
    },
    /* 上架单管理-详情-待上架货物明细列表 */
    async getWaitingShelfProductList(params = {}) {
      const res = await api.getWaitingShelfProductData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.detailsDataSource = data.list || []
        this.watingDetailPagination = {
          ...this.watingDetailPagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    },

    /* 上架单管理-详情-已上架货物明细列表 */
    async getAlreadyShelfProductList(params = {}) {
      const res = await api.getAlreadyShelfProductData(
        {
          status: 1,
          shelfProductId: this.shelfProductId,
          shelfNo: this.shelfNo || '',
          ...params
        })
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.alreadyDetailDataSource = data.list || []
        this.detailInfoPagination = {
          ...this.detailInfoPagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
        this.alreadyDetailPagination = {
          ...this.alreadyDetailPagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    },

    /* 完成上架确认 */
    async confirmFinishPutAway() {
      const copyShelfMan = this.$refs.putStorageInfo.dynamicValidateFormRuleForm.shelfMan
      if (copyShelfMan && copyShelfMan.value === null) {
        this.$message({
          message: '请选择上架员！',
          type: 'error'
        })
        return false
      }
      if (!this.shelfNo) {
        this.$message({
          message: '上架单号不能为空！',
          type: 'error'
        })
        return false
      }
      const data = {
        shelfNo: this.shelfNo,
        shelfMan: copyShelfMan
      }
      const res = await api.confirmFinishPutAwayData(data)
      this.fetchLog(this.getLogMessages('UPDATE', '/wms/stockIn/shelf/complete'), data, JSON.stringify({
        beforeText: `在'仓储管理-入库上架单管理,'将${JSON.stringify({ 'shelfNo': data.shelfNo })}`,
        afterText: '完成上架', afterCode: data
      }))
      if (this.$pub.responseValidate(res)) {
        const options = {
          type: 'confirm',
          message: '确定成功！',
          api: '/wms/stockIn/shelf/complete',
          callback: () => {
            this.$router.push({
              path: '/wms/enter-manage/putup-manage'
            })
          },
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    },

    /* 上架单管理-上架确认-添加上架明细查询 */
    async getProductDetails(params = {}) {
      /* if (!this.detailInfoDataSource.map(it => it.serialNo).includes(params.serialNo)) { */
      const response = await api.getProductDetailsData(params)
      const res = response
      if (this.$pub.responseValidate(res, false)) {
        const data = res.data
        if (data) {
          const newDataSource = this.$utils.deepClone(this.detailInfoDataSource)
          newDataSource.push({ ...data, locationCode: '', locationName: '' })
          const newData = newDataSource.reduce((all, next) => all.some((item) => item['serialNo'] === next['serialNo']) ? all : [...all, next], [])
          this.detailInfoDataSource = newData
          //  this.detailInfoDataSource = newData.map(item => ({ ...item, locationCode: "", locationName: "" }))
          this.$refs.bindDetailInfo.dynamicValidateFormRuleForm.serialNo = ''
        }
      }
    },

    /* 上架单管理-上架确认-添加上架明细-提交 */
    async savedetailInfo() {
      if (this.detailInfoDataSource.length > 0) {
        const isLocationCode = this.detailInfoDataSource.some(item => !item.locationCode)
        if (isLocationCode) {
          this.$message({
            message: '库位号不能为空！',
            type: 'error'
          })
          return false
        }
        const res = await api.savedetailInfoData({
          shelfNo: this.shelfNo,
          products: this.detailInfoDataSource
        })
        if (this.$pub.responseValidate(res)) {
          const options = {
            type: 'confirm',
            message: '确定成功！',
            api: '/wms/stockIn/shelf/product/up',
            callback: () => {
              this.getAlreadyShelfProductList({})
              this.detailInfoDataSource = []
              this.$refs.bindDetailInfo.form.resetFields()
              this.dialogDetailInfoVisible = false
            },
            logParams: {}
          }
          this.$pub.handleSuccessfully(options)
        }
      } else {
        this.$message({
          message: `请先添加上架明细！`,
          type: 'error'
        })
        return false
      }
    },

    /* 刪除 */
    delProductDetails(item) {
      if (!item) return
      const index = this.detailInfoDataSource.indexOf(item);
      (index !== -1) && this.detailInfoDataSource.splice(index, 1)
    },

    /* 绑定库位号 */
    bindLocationCode() {
      // let detailInfoList = []
      const params = this.$refs.bindDetailInfo.dynamicValidateFormRuleForm
      if (this.detailInfoDataSource.length > 0) {
        if (!params.locationCode) {
          this.$message({
            message: '请选择上架库位！',
            type: 'error'
          })
          return false
        }
        const detailInfoList = []
        if (this.detailInfoDataSource.length > 0) {
          this.detailInfoDataSource.map(item => {
            if (!item.locationCode && !item.locationName) {
              detailInfoList.push({
                ...item,
                locationCode: params.locationCode,
                locationName: params.locationCode
              })
            } else {
              detailInfoList.push(item)
            }
          })
        }
        this.detailInfoDataSource = detailInfoList
      } else {
        this.$message({
          message: '请添加上架明细！',
          type: 'error'
        })
        return false
      }
      // return detailInfoList
    },
    /* 关闭 */
    closeDetailDialog() {
      this.$refs.bindDetailInfo.form.resetFields()
      this.detailInfoDataSource = []
      this.dialogDetailInfoVisible = false
    },

    showDetailInfoDialog() {
      if (this.putStorageInfoFormDatas.warehouseCode) {
        this.getWarehouseLocationList({
          enable: 1,
          isDefault: false,
          isLock: 'E',
          warehouseCode: this.putStorageInfoFormDatas.warehouseCode
        }).then(data => {
          this.$set(this.detailInfoData[1], 'dataSource', data)
          this.dialogDetailInfoVisible = true
        })
      }
    },

    /* 上架单管理-上架确认- 上架明细 列表 */
    async getProductDetailsList(params = {}) {
      // this.fullscreenLoading = true
      const res = await api.getProductDetailsListData(params)
      if (this.$pub.responseValidate(res)) {
        const list = res.data.list
        if (list && list.length > 0) {
          this.productDetailsListDataSource = list
          // this.fullscreenLoading = false
        }
      }
    }
  }
}
