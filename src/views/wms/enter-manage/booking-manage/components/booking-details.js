import * as api from '../api/index'
export const BookingDetails = BookingDetails || {
  data() {
    return {
      detailCopy: {},
      listCopy: []
    }
  },
  created() {
    this.reservationNo = this.$route.query['reservationNo']
    this.init()
    if (this.reservationNo) {
      this.getReservationInfo({
        reservationNo: this.reservationNo
      })
    }
  },
  methods: {
    comeBack() {
      this.$router.push('/wms/enter-manage/booking-manage')
    },
    init() {
      // this.reservationNo = this.$route.query['reservationNo']
      this.pageType = this.$route.query['type'].toString()
      // this.status = this.$route.query['status'].toString()
      if (this.reservationNo) {
        // this.getReservationInfo({
        //   reservationNo: this.reservationNo
        // })
        this.getSysUserList({
          realName: '',
          isEnabled: 1
        }).then(data => {
          if (data && data.length > 0) {
            this.$set(this.startReceivingDataSource[10], 'dataSource', data)
          }
        })
        this.getReservationProductList({
          reservationNo: this.reservationNo
        })
      }
    },
    /* tab切换 */
    tabClick(tab, event) { },
    /* 预约单管理-详情-货物明细*/
    async getReservationProductList(params = {}) {
      const res = await api.getReservationProductData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.cargoDetailDataSource = data.list || []
        this.productDetailTotal = data.total
        this.cargoDetailPagination = {
          ...this.cargoDetailPagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    },
    startReceving() {
      if (this.reservationNo) {
        this.$router.push({
          path: '/wms/enter-manage/booking-manage/booking-details',
          query: { reservationNo: this.reservationNo, type: 'start', status: this.status, timestamp: new Date().getTime() }
        })
      }
    },
    // 打印收货单
    printOrder() {
      if (this.reservationNo) {
        this.$router.push({
          path: '/wms/enter-manage/booking-manage/print-sign-order',
          query: { reservationNo: this.reservationNo, timestamp: new Date().getTime() }
        })
      }
    },
    // 打印签收单
    printSign() {
      if (this.reservationNo) {
        this.$router.push({
          path: '/wms/enter-manage/booking-manage/print-receiving-order',
          query: { reservationNo: this.reservationNo, timestamp: new Date().getTime() }
        })
      }
    },
    // 通过、不通过
    async signPass() {
      const data = {
        reservationNo: this.reservationNo,
        status: 'P'
      }
      const res = await api.passList(data)
      if (res.code !== 200) {
        return false
      }
      this.$router.push('/wms/enter-manage/booking-manage')
    },
    async signNoPass() {
      const data = {
        reservationNo: this.reservationNo,
        status: 'R'
      }
      const res = await api.passList(data)
      if (res.code !== 200) {
        return false
      }
      this.$router.push('/wms/enter-manage/booking-manage')
    },
    // 打印条码单
    printCode() {
      if (this.reservationNo) {
        this.$router.push({
          path: '/wms/enter-manage/booking-manage/print-post-code',
          query: {
            reservationNo: this.reservationNo,
            productType: this.status,
            timestamp: new Date().getTime()
          }
        })
      }
    },
    /* 预约单管理-详情 */
    async getReservationInfo(params) {
      const res = await api.getReservationInfoData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        console.log('预约单详情', data)
        // 跳转到详情页面返回的状态
        this.status = res.data.status.toString()
        console.log('预约单状态', this.status)
        let filelist = []
        this.detailsInfoFormData = {
          ...data,
          sentInFact: data.sentInFact && this.$utils.parseTime(data.sentInFact),
          sentInPlan: data.sentInPlan && this.$utils.parseTime(data.sentInPlan),
          numberInPlan: data.numberInPlan.toString(),
          weightInPlan: data.weightInPlan.toString(),
          consigneeName: data.consignee.label
        }
        this.paginationInfoData = {
          numberInFact: data.numberInFact,
          weightInFact: data.weightInFact,
          numberInPlan: data.numberInPlan,
          weightInPlan: data.weightInPlan
        }
        data.deliveryInfo.shipper = data.deliveryInfo.shipperModel.label
        data.deliveryInfo.supplier = data.deliveryInfo.supplierModel.label
        this.deliverInfoFormDatas = data.deliveryInfo
        /*   if (data.attachment) {
            filelist = data.attachment.split(',').map(value => ({ url: value, name: value }))
          } */
        if (data.attachmentArray && data.attachmentArray.length > 0) {
          filelist = data.attachmentArray
        }
        this.fileList = filelist
        this.$set(this.remarkDataSource[1].componentsOptions, 'filelist', filelist)
        this.$set(this.remarkDataSource[1].componentsOptions, 'type', this.pageType)
        this.remarkFormDatas = {
          remark: data.remark,
          rejectReason: data.rejectReason,
          attachment: data.attachment
        }
        this.consigneeObj = {
          consigneeId: data.consignee.value,
          consigneeName: data.consignee.label
        }
        // 修改 日志的beforcode
        this.detailCopy = {
          reservationNo: this.reservationNo,
          consignee: data.consignee,
          attachment: JSON.parse(JSON.stringify(data.attachment))
        }
        if (this.pageType === 'details' && data.status === 2) {
          this.$set(this.startReceivingDataSource[10], 'disabled', true)
        }
        if (this.pageType === 'start' && data.status === 1) {
          this.$set(this.startReceivingDataSource[10], 'disabled', false)
        }
        console.log('this.pageType', this.pageType)
        console.log('rejectReasonDataSource', this.rejectReasonDataSource)
        if (this.pageType !== 'details') {
          this.$set(this.remarkDataSource[0], 'disabled', false)
        }
        this.loadingFinishid = true
      }
    },
    /* 拆分确定 */
    async getSpllitCargoDetailInfo(params = {}) {
      const res = await api.getSpllitCargoDetailInfoData(params)
      if (this.$pub.responseValidate(res)) {
        this.fetchLog(this.getLogMessages('UPDATE', '/wms/stockIn/reservation/product/modify'), params, JSON.stringify({ beforeText: `仓储管理-入库预约单管理-货物明细,将${JSON.stringify({ 'parentProductId': params.parentProductId })}`, afterText: '拆分' }))
        const options = {
          type: 'update',
          message: '确定成功！',
          api: '/wms/stockIn/reservation/product/{productId}/pound/add',
          callback: () => {
            this.$set(this.dialogSpllitPopUpVisable, 'visible', false)
            this.getReservationProductList({
              reservationNo: this.reservationNo
            })
          },
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    },

    /* 拆分弹框显示 */
    showSplitPopUpBox(params = {}) {
      this.$set(this.dialogSpllitPopUpVisable, 'formDatas', {
        ...params.row,
        isFull: 0,
        numberInPlan: 1,
        numberInFact: 1,
        weightInPlan: '',
        weightInFact: '',
        ballCount: ''
      })
      this.$set(this.dialogSpllitPopUpVisable, 'visible', true)
    },

    /* 预约单管理-详情-货物明细-抽磅记录 */
    async getReservationProductPoundList(params = {}) {
      const res = await api.getReservationProductPoundData({ productId: params.row.id })
      if (this.$pub.responseValidate(res)) {
        this.dialogPoundListVisible = true
        const data = res.data
        if (data.weights) {
          //  console.log('params.row', params.row)
          this.poundListDataSource = data.weights.split(',').map(value => ({
            ...params.row,
            weights: value,
            weightInPlan: Number(params.row.weightInPlan / params.row.numberInPlan).toFixed(2)
          }))
        }
        this.poundEntity.poundNumber = Number(data.number)
        this.poundEntity.actualWeight = Number(data.weightInFact)
      }
    },

    /* 抽榜 */
    async smokePoundsCargoDetails(params = {}) {
      if (params.row && params.row.id) {
        this.productId = params.row.id
        this.dialogDrawSmokePoundsRows = { ...params.row, edit: true }
        this.dialogDrawEntity.numberInFact = params.row.numberInFact
        this.dialogDrawEntity.weightInFact = params.row.weightInFact
        this.$set(this.dialogDrawListDataSource[0], 'dataSource', [])
        if (this.detailsInfoFormData.productType === 1) {
          this.$set(this.dialogDrawListDataSource[0], 'columns', this.drawListClothColumns)
        } else if (this.detailsInfoFormData.productType === 2) {
          this.$set(this.dialogDrawListDataSource[0], 'columns', this.drawListGauzeColumns)
        }
        this.dialogDrawListPopUpBoxList = true
      }
    },

    /*  预约单管理-详情-货物明细-修改-弹出框 */
    showUpdateReservationProduct(params = {}) {
      if (params.row) {
        this.listCopy = { ...params.row }
        this.$set(this.dialogUpdateReservationProductVisible, 'formDatas', params.row)
        this.$set(this.dialogUpdateReservationProductVisible, 'visible', true)
      }
    },

    /* 更新数据 */
    async updateReservationInfo(params) {
      const res = await api.getReservationInfoData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.paginationInfoData = {
          numberInFact: data.numberInFact,
          weightInFact: data.weightInFact,
          numberInPlan: data.numberInPlan,
          weightInPlan: data.weightInPlan
        }
      }
    },

    /* 预约单管理-详情-货物明细-修改-确定 */
    async updatePoundsDetailsInfo(params = {}) {
      const detail = {
        productId: params.id,
        numberInFact: params.numberInFact,
        weightInFact: params.weightInFact
      }
      const res = await api.updateReservationProductInfoData(detail)
      if (this.$pub.responseValidate(res)) {
        const { beforeCode, afterCode } = this.compareData(this.listCopy, detail, 'productId')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(this.getLogMessages('UPDATE', '/wms/stockIn/reservation/product/modify'), detail, JSON.stringify({ beforeText: `仓储管理-入库预约单管理-货物明细,将${JSON.stringify({ 'productId': detail.productId })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
        const options = {
          type: 'update',
          message: '修改成功！',
          api: '/wms/stockIn/reservation/product/modify',
          callback: () => {
            this.$set(this.dialogUpdateReservationProductVisible, 'visible', false)
            this.getReservationProductList({
              reservationNo: this.reservationNo
            })
            this.updateReservationInfo({
              reservationNo: this.reservationNo
            })
          },
          logParams: {}
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    handleClose() {
      this.dialogPoundListVisible = false
      this.resetOfPound()
    },
    resetOfPound() {
      this.poundEntity = {
        poundNumber: 0,
        actualWeight: 0,
        boundDate: new Date()
      }
    },

    /* 取消 */
    cancelDrawListPopBox() {
      this.dialogDrawListPopUpBoxList = false
      this.resetOfPound()
      this.$refs.dialogDrawListForm1.form.resetFields()
      this.$refs.dialogDrawListTable.form.resetFields()
    },

    /* 抽榜确定 */
    saveDrawListFormDatas() {
      this.$refs.dialogDrawListTable.form.validate(async(valid) => {
        if (valid) {
          const weightsArr = this.$refs.dialogDrawListTable.dynamicValidateFormRuleForm.tableForm.map(item => item.weights)
          const detail = {
            weights: weightsArr,
            productId: this.productId,
            number: this.poundEntity.poundNumber
          }
          const res = await api.getReservationProductPoundAddData(detail)
          if (this.$pub.responseValidate(res)) {
            this.fetchLog(this.getLogMessages('UPDATE', '/wms/stockIn/reservation/product/modify'), detail, JSON.stringify({ beforeText: `仓储管理-入库预约单管理-货物明细,将${JSON.stringify({ 'productId': detail.productId })}`, afterText: '抽磅' }))
            const options = {
              type: 'update',
              message: '确定成功！',
              api: '/wms/stockIn/reservation/product/{productId}/pound/add',
              callback: () => {
                this.dialogDrawListPopUpBoxList = false
                this.getReservationProductList({
                  reservationNo: this.reservationNo
                })
                this.updateReservationInfo({
                  reservationNo: this.reservationNo
                })
                this.$refs.dialogDrawListForm1.form.resetFields()
                this.$refs.dialogDrawListTable.form.resetFields()
                this.resetOfPound()
              },
              logParams: {}
            }
            this.$pub.handleSuccessfully(options)
          }
        } else {
          console.log('error!')
          return false
        }
      })
    },
    /* 完成收货 */
    saveFinishDelivery() {
      const consigneeName = this.consigneeObj.consigneeName
      const consigneeId = this.consigneeObj.consigneeId
      const reservationNo = this.reservationNo
      const remark = this.$refs.remarkForm.dynamicValidateFormRuleForm['remark']
      let attachment = ''
      if (this.fileList.length > 0) {
        attachment = this.fileList.map(item => {
          return item.url
        }).join(',')
      }
      if (!reservationNo) {
        this.$message({
          message: '预约单号不能为空！',
          type: 'error'
        })
        return false
      }
      if (!consigneeName && !consigneeId) {
        this.$message(
          {
            message: '请选择收货员！',
            type: 'error'
          })
        return false
      }
      /* if (!remark) {
         this.$message({
           message: '备注为必填项！',
           type: 'error'
         })
         return false
       }
       if (!attachment) {
         this.$message({
           message: '附件不能为空！',
           type: 'error'
         })
         return false
       } */
      const detail = {
        reservationNo,
        consignee: { label: consigneeName, value: consigneeId },
        // consigneeName,
        // consigneeId,
        remark,
        attachment
      }
      api.saveReservationCompleteData(detail).then(res => {
        if (this.$pub.responseValidate(res)) {
          const { beforeCode, afterCode } = this.compareData(this.detailCopy, detail, 'reservationNo')
          const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
          flag && this.fetchLog(this.getLogMessages('UPDATE', '/wms/stockIn/reservation/complete'), detail, JSON.stringify({ beforeText: `仓储管理-入库预约单管理,将${JSON.stringify({ 'reservationNo': detail.reservationNo })}`, afterText: '完成收货', ...{ beforeCode, afterCode }}))
          const options = {
            type: 'update',
            message: '收货成功！',
            api: '/wms/stockIn/reservation/complete',
            callback: () => {
              this.$router.push({
                path: '/wms/enter-manage/booking-manage'
              })
            },
            logParams: {}
          }
          this.$pub.handleSuccessfully(options)
        }
      })
    },

    /* 暂停收货 */
    stopReservationSave() {
      const consigneeName = this.consigneeObj.consigneeName
      const consigneeId = this.consigneeObj.consigneeId
      const reservationNo = this.reservationNo
      const remark = this.$refs.remarkForm.dynamicValidateFormRuleForm['remark']
      let attachment = ''
      if (this.fileList.length > 0) {
        attachment = this.fileList.map(item => {
          return item.url
        }).join(',')
      }
      if (!reservationNo) {
        this.$message({
          message: '预约单号不能为空！',
          type: 'error'
        })
        return false
      }
      if (!consigneeName && !consigneeId) {
        this.$message({
          message: '请选择收货员！',
          type: 'error'
        })
        return false
      }
      const detail = {
        reservationNo,
        // consigneeName,
        // consigneeId,
        consignee: { label: consigneeName, value: consigneeId },
        remark,
        attachment
      }
      api.stopReservationSaveData(detail).then(res => {
        if (this.$pub.responseValidate(res)) {
          const { beforeCode, afterCode } = this.compareData(this.detailCopy, detail, 'reservationNo')
          const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
          flag && this.fetchLog(this.getLogMessages('UPDATE', '/wms/stockIn/reservation/save'), detail, JSON.stringify({ beforeText: `仓储管理-入库预约单管理,将${JSON.stringify({ 'reservationNo': detail.reservationNo })}`, afterText: '暂停收货', ...{ beforeCode, afterCode }}))
          const options = {
            type: 'update',
            message: '暂停收货成功！',
            api: '/wms/stockIn/reservation/save',
            callback: () => {
              this.$router.push({
                path: '/wms/enter-manage/booking-manage'
              })
            },
            logParams: {}
          }
          this.$pub.handleSuccessfully(options)
        }
      })
    }
  }
}
