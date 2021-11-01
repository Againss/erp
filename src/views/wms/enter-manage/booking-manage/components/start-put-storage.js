import * as api from '../api/index'
import * as apiPublic from '@/views/wms/public/api/index.js'
export const start = {
  data() {
    const findObj = (arr, property, props) => {
      const i = arr.findIndex((i) => (props ? i[props] : i['prop']) === property)
      if (i !== -1) {
        return arr[i]
      } else {
        return
      }
    }
    return {
      findObj,
      sellList: [], // 销售
      consigneeList: [], // 收货人
      suppList: [], // 供应商
      shipperList: [] // 货主
    }
  },
  created() {
    // 售货员
    this.getCustomerList()// 货主
    this.getSupplierList()// 供应商
    this.getSysUserList({ isEnabled: 1 })// 收货人
    this.getWarehouseList({ enable: 1 })// 入库仓库
  },
  methods: {
    async getCustomerList() {
      const customerRes = await api.customerList()
      if (this.$pub.responseValidate(customerRes)) {
        const data = customerRes.data || []
        data.forEach(item => {
          item.label = item.name
          item.value = item.customerId
        })
        const obj = this.findObj(this.deliverInfoDataSource, 'shipperId')
        obj.dataSource = data || []
        this.shipperList = data || []
      }
    },
    async getSupplierList() {
      const supplierRes = await api.supplierList({ supplierCategory: 1, status: 1 })
      if (this.$pub.responseValidate(supplierRes)) {
        const data = supplierRes.data || []
        data.forEach(item => {
          item.label = item.supplierName
          item.value = item.id
        })
        const obj = this.findObj(this.deliverInfoDataSource, 'supplierId')
        obj.dataSource = data || []
        this.suppList = data || []
      }
    },
    /* 预约单管理-详情-货物明细-抽磅 */
    async getReservationProductPoundAdd(params) {
      const res = await api.getReservationProductPoundAddData(params)
      if (this.$pub.responseValidate(res)) {
        const callback = this.getBookingManageList
        const options = {
          type: 'insert',
          message: '抽磅成功！',
          api: '/wms/stockIn/reservation/audit/{reservationNo}',
          callback,
          logParams: {},
          dialog: this.dialogCheckBookingManageVisable
        }
        this.$pub.handleSuccessfully(options)
      }
    },
    async getSysUserList(params = {}) {
      const res = await apiPublic.getSysUserListData(params)
      let userList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data.list || []
        if (list && list.length > 0) {
          userList = list.map(item => ({
            value: item.id,
            label: item.realName
          }))
        }
      }
      this.putStorageInfoDataSource[this.putStorageInfoDataSource.length - 1].dataSource = userList
      this.consigneeList = userList
    },
    async getWarehouseList(params = {}) {
      const warehouseListRes = await apiPublic.warehouseList(params)
      if (this.$pub.responseValidate(warehouseListRes)) {
        var data = warehouseListRes.data ? warehouseListRes.data.list : []
        data.forEach((n) => {
          n.label = n.name
          n.value = n.code
        })
        const obj = this.findObj(this.putStorageInfoDataSource, 'warehouseCode')
        obj.dataSource = data || []
      }
    },
    // 销售组织
    async getSell(params = {}) {
      const res = await apiPublic.sellTeamselet({ functionTag: 'SAL' })
      if (this.$pub.responseValidate(res)) {
        const data = res.data || []
        data.forEach(i => {
          i.label = i.name
          i.value = i.orgId
        })
        const obj = this.findObj(this.infoPopOptions.content, 'sellerTeamId')
        obj.dataSource = data || []
        this.sellList = data
      }
    },
    // 库位
    async getWarehouseLocation(params = {}) {
      const res = await apiPublic.getWarehouseLocationData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data.list || []
        const locationList = data.filter(it => it.isDefault === false && it.isLock === 'E' && it.enable === 1).map(item => ({ value: item.path, label: item.path }))
        const obj = this.findObj(this.infoPopOptions.content, 'locationCode')
        obj.dataSource = locationList || []
      }
    },
    async submitForm() {
      var pass = true
      this.$refs['putStorageInfo'].$refs.dynamicValidateForm.validate((valid) => {
        if (!valid) { pass = false }
      })
      this.$refs['deliverInformation'].$refs.dynamicValidateForm.validate((valid) => {
        if (!valid) { pass = false }
      })
      if (!pass) { return }
      // 校验送货信息
      if (!this.list.length) {
        this.$confirm('请添加送货信息', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning',
          center: true
        })
        return
      }
      // code materielType? clothColor/ yarnColor
      this.list.forEach(el => {
        el.materiel = el.code
        el.color = this.productType === 1 ? el.clothColor : el.yarnColor
      })
      // const pub = ['materiel', 'materielType', 'sellerTeamId', 'property', 'dyelot', 'color', 'numberInPlan', 'weightInPlan', 'locationCode']
      const pub = ['materiel', 'materielType', 'sellerTeamId', 'property', 'dyelot', 'numberInPlan', 'weightInPlan', 'locationCode']
      // const spe_1 = ['printing']
      const spe_1 = []
      const spe_2 = ['yarnCard', 'ballCount', 'isFull']
      var tip = false
      const arr = this.productType === 1 ? spe_1 : spe_2
      const validArr = [...pub, ...arr]
      for (var i = 0; i < this.list.length; i++) {
        for (var j = 0; j < validArr.length; j++) {
          if (!this.list[i][validArr[j]]) {
            tip = true
            const msg = '送货信息第' + (i + 1) + '条待完善'
            this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning',
              center: true
            })
            break
          }
        }
        if (tip) return
      }
      const putForm = this.$refs.putStorageInfo.dynamicValidateFormRuleForm
      const deliveryInfoForm = this.$refs.deliverInformation.dynamicValidateFormRuleForm
      // 货主label
      const shipper = this.findObj(this.shipperList, deliveryInfoForm.shipperId, 'value')
      deliveryInfoForm.shipperModel = { label: shipper.label, value: deliveryInfoForm.shipperId }
      // 供应商label
      const supplier = this.findObj(this.suppList, deliveryInfoForm.supplierId, 'value')
      deliveryInfoForm.supplierModel = { label: supplier.label, value: deliveryInfoForm.supplierId }
      const consigneeNameLabel = this.findObj(this.consigneeList, putForm.consigneeId, 'value')
      // 收货员
      this.list.forEach(i => {
        const sellerTeamName = this.findObj(this.sellList, i.sellerTeamId, 'value')
        i.sellerTeamName = sellerTeamName.label
        i.sellerTeam = {
          label: i.sellerTeamName,
          value: i.sellerTeamId
        }
      })
      // sellerTeamName
      const form = {
        stockType: putForm.stockType,
        productType: putForm.productType,
        sentInPlan: putForm.sentInPlan,
        // consigneeId: putForm.consigneeId,
        // consigneeName: consigneeNameLabel.label,
        consignee: {
          value: putForm.consigneeId,
          label: consigneeNameLabel.label
        },
        warehouseCode: putForm.warehouseCode
      }
      const remark = this.$refs.remarkForm.dynamicValidateFormRuleForm
      let attachment = ''
      if (this.fileList && this.fileList.length > 0) {
        attachment = this.fileList.map(item => {
          return item.url
        }).join(',')
      }
      var params = {
        products: this.list, // 产品
        deliveryInfo: deliveryInfoForm,
        remark: remark.remark, // 备注
        attachment: attachment // 附件
      }
      params = { ...params, ...form }
      const res = await api.submit(params)
      if (res.code === 200) {
        this.fetchLog(this.getLogMessages('INSERT', '/wms/stockIn/reservation/other/submit'), params, JSON.stringify({ beforeText: '仓储管理-入库预约单管理-其他入库, 生成了一条入库单', beforeCode: params }))
        this.$pub.handleSuccessfully({
          showClose: true,
          message: res.code === 200 ? '生成入库单成功' : '生成入库单失败',
          type: res.code === 200 ? 'success' : 'error'
        })
      }
      if (this.$pub.responseValidate(res)) {
        this.$router.go(-1)
      }
    }
  }
}
