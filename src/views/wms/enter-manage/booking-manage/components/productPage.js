import * as api from '../api/index'
import * as apiPublic from '@/views/wms/public/api/index.js'
export const ProductPage = {
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
      warehouse: [], // 仓库--生产工厂
      shipperList: [] // 货主
    }
  },
  created() {
    this.getSupplierList()// 供应商
    this.getSysUserList({ isEnabled: 1 })// 收货人
  },
  methods: {
    // 导入弹框
    dialogDown() {
      this.importDialog.visible = true
    },
    // 生产单号的下拉内容
    async getProduct() {
      const res = await api.productList()
      if (res.code !== 200) {
        return false
      }
      const productList = res.data.map(item => ({ value: item.orderNo, label: item.orderNo }))
      this.$set(this.putStorageInfoDataSource[2], 'dataSource', productList)
    },
    // 根据生产单号，查询详情细节
    async productDetail(data) {
      const res = await api.productDetail(data)
      if (res.code !== 200) {
        return false
      }
      this.detailData = res.data ? res.data : {}
      // 根据生产单号--获取仓库资料
      this.storeList(parseInt(this.detailData.supplier.value))
      // 把销售组织填充进去
      this.$set(this.putStorageInfoFormDatas, 'sellerTeam', this.detailData.sellerTeam.label)
      // 把货主填充进去
      this.$set(this.deliverInfoFormDatas, 'shipper', this.detailData.shipper.label)
      // 把电话填充进去
      this.$set(this.deliverInfoFormDatas, 'phone', this.detailData.phoneNum)
      // 把布行填充进去
      this.$set(this.deliverInfoFormDatas, 'fabricStore', this.detailData.fabricStore)
      this.columnList = this.detailData.products || []
      // 根据详情的订单类型，返回到下载模板
      if (this.detailData.orderType === 1) {
        this.importDialog.content[1].componentsOptions.orderType = 'knit'
      } else if (this.detailData.orderType === 2) {
        this.importDialog.content[1].componentsOptions.orderType = 'dye'
      } else if (this.detailData.orderType === 3) {
        this.importDialog.content[1].componentsOptions.orderType = 'print'
      }
      // 导入时添加字段
      if (this.detailData.orderNo) {
        this.importDialog.content[0].data.orderNo = this.detailData.orderNo
      }
    },
    // 根据获取的服务供应商名称，，获得仓库名称--生产工厂
    async storeList(val) {
      // 只有有工厂的时候，才能查到工厂
      if (val) {
        const res = await api.storePage({ enable: 1, supplierId: val })
        if (res.code === 200) {
          this.warehouse = (res.data.list || []).map(item => {
            return { value: item.code,
              label: item.name }
          })
          if (this.warehouse && this.warehouse.length === 1) {
            this.$set(this.putStorageInfoFormDatas, 'warehouse', this.warehouse[0].value)
          } else {
            this.$set(this.putStorageInfoFormDatas, 'warehouse', '')
          }
          this.$set(this.putStorageInfoDataSource[4], 'dataSource', this.warehouse)
        }
      } else {
        // 把工厂清空
        this.warehouse = []
        this.$set(this.putStorageInfoDataSource[4], 'dataSource', [])
        this.$set(this.putStorageInfoFormDatas, 'warehouse', '')
      }
    },
    // 供应商的内容
    async getSupplierList() {
      const supplierRes = await api.supplierList({ supplierCategory: 1, status: 1 })
      if (this.$pub.responseValidate(supplierRes)) {
        this.suppList = supplierRes.data.map(item => ({
          value: item.id,
          label: item.supplierName
        }))
        this.$set(this.deliverInfoDataSource[2], 'dataSource', this.suppList)
      }
    },
    // 收货员的下拉
    async getSysUserList(params = {}) {
      const res = await apiPublic.getSysUserListData(params)
      if (this.$pub.responseValidate(res)) {
        const list = res.data.list || []
        if (list && list.length > 0) {
          this.consigneeList = list.map(item => ({
            value: item.userId,
            label: item.realName
          }))
        }
      }
      this.$set(this.deliverInfoDataSource[4], 'dataSource', this.consigneeList)
    },
    // 点击编辑的内容
    async editList(data) {
      this.dataIndex = data.$index
      const parmas = this.columnList[data.$index] && this.columnList[data.$index].details
      const arr = ((Array.isArray(parmas) && parmas.length > 0 ? Array.isArray(parmas) && parmas : [{ weightIn: '' }]) || [{ weightIn: '' }]).map(e => ({ ...e, edit: true }))
      // console.log('点编辑', parmas, arr)
      this.editPopOptions.content._tableData.dataSource = [...arr]
      // 把从表格中拿到的数据反写到弹框中去
      this.editPopOptions.formDatas = { ...data.row, rowIndex: data.$index }
      // 如果是没值，，就需要把它为空；如果有值，就直接赋值
      if (!data.row.hasOwnProperty('machineNo') || !data.row.hasOwnProperty('dyelot')) {
        this.editPopOptions.formDatas.machineNo = ''
        this.editPopOptions.formDatas.dyelot = ''
      }
      this.editPopOptions.formDatas.packingUnit = '卷'
      // 编辑时计算重量和件数
      this.comp(arr)
      this.editPopOptions.visible = true
    },
    // 货物明细表格--点击复制的内容
    async copyList(data) {
      this.columnList.push({
        materiel: data.row.materiel,
        productInfo: data.row.productInfo,
        yarnName: data.row.yarnName,
        yarnProperty: data.row.yarnProperty,
        // machineNo: data.row.machineNo,
        stitchNum: data.row.stitchNum,
        inchNum: data.row.inchNum,
        // dyelot: data.row.dyelot,
        packingUnit: data.row.packingUnit,
        copyBool: true // 区分是否是复制的数据
      })
    },
    // 弹框中细码明细--点击复制的内容
    async copyDetail(data, row) {
      const arr = [
        ...data,
        { ...row, copyDe: true }
      ]
      this.comp(arr)
    },
    // 计算卷数、重量
    comp(data) {
      this.$set(this.editPopOptions.content._tableData, 'dataSource', data)
      const weightInFact = data.reduce((w, s) => {
        w += s.weightIn * 1
        return w
      }, 0)
      this.$set(this.editPopOptions.formDatas, 'numberInFact', data.length)
      this.$set(this.editPopOptions.formDatas, 'weightInFact', this.$utils.getFloat(weightInFact, 2))
    },
    // 生成生产单
    async productBtn() {
      var pass = true
      this.$refs['putStorageInfo'].$refs.dynamicValidateForm.validate((valid) => {
        if (!valid) { pass = false }
      })
      this.$refs['deliverInformation'].$refs.dynamicValidateForm.validate((valid) => {
        if (!valid) { pass = false }
      })
      if (!pass) { return }
      // 判断弹框明细有没有值，如果没有就返回提示
      this.columnList.forEach(val => {
        if (!val.hasOwnProperty('details') || !val.hasOwnProperty('weightInFact') || !val.hasOwnProperty('numberInFact')) {
          val.detailBool = true
        } else {
          val.detailBool = false
        }
      })
      if (this.columnList.find(val => val.detailBool === true)) {
        this.$message({
          type: 'info',
          message: '请补充全货物明细！'
        })
        return false
      }
      const deliveryInfoForm = this.$refs.deliverInformation.dynamicValidateFormRuleForm
      const putInfo = this.$refs.putStorageInfo.dynamicValidateFormRuleForm
      // 生产工厂
      const warehouseLabel = this.findObj(this.warehouse, putInfo.warehouse, 'value')
      const warehouse = {
        label: warehouseLabel.label,
        value: putInfo.warehouse
      }
      // 供应商label
      const supplier = this.findObj(this.suppList, deliveryInfoForm.supplier, 'value')
      const supplierModel = { label: supplier.label, value: deliveryInfoForm.supplier }
      // 收货员
      const consign = this.findObj(this.consigneeList, deliveryInfoForm.consignee, 'value')
      const consigner = { label: consign.label, value: deliveryInfoForm.consignee }
      // 备注和附件
      const remark = this.$refs.remarkForm.dynamicValidateFormRuleForm
      let attachment = ''
      if (this.fileList && this.fileList.length > 0) {
        attachment = this.fileList.map(item => {
          return item.url
        }).join(',')
      }
      const obj = {
        stockType: 2, // 默认是生产入库
        productType: 1, // 默认是布
        orderNo: this.detailData.orderNo,
        stockInTime: this.$refs.putStorageInfo.dynamicValidateFormRuleForm.stockInTime,
        warehouse: warehouse, // 生产工厂
        deliveryInfo: {
          supplierModel: supplierModel, // 供应商
          phoneNum: deliveryInfoForm.phone,
          fabricStore: deliveryInfoForm.fabricStore,
          shipperModel: this.detailData.shipper // 货主
        },
        consignee: consigner, // 收货员
        detailCodeSourceType: deliveryInfoForm.detailCodeSourceType,
        products: this.columnList,
        numberInFact: putInfo.customNum,
        weightInFact: putInfo.customWeight,
        sellerTeam: this.detailData.sellerTeam,
        remark: remark.remark, // 备注
        attachment: attachment // 附件
      }
      const res = await api.productAdd({ ...obj })
      if (res.code === 200) {
        this.fetchLog(this.getLogMessages('INSERT', '/wms/stockIn/reservation/production/submit'), obj, JSON.stringify({ beforeText: '仓储管理-入库预约单管理-生产入库, 生成了一条入库单', beforeCode: obj }))
        this.$pub.handleSuccessfully({
          showClose: true,
          message: res.code === 200 ? '生成入库单成功' : '生成入库单失败',
          type: res.code === 200 ? 'success' : 'error'
        })
        this.$router.push({ path: '/wms/enter-manage/booking-manage' })
      }
    },
    /* 返回列表 */
    backListPage() {
      this.$confirm('确认要离开当前页面吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'customClass'
      })
        .then(() => {
          this.$router.push({ path: '/wms/enter-manage/booking-manage' })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
