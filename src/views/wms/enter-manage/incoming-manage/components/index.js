import * as api from '../api/index'
export const IncomingManage = {
  methods: {

    /* tab切换 */
    tabClick(tab, event) {
      const tabName = tab.name.toString()
      const formParms = this.$refs.searchForm.dynamicValidateFormRuleForm
      if (tabName) {
        switch (tabName) {
          case 'all':
            this.getStockInFormList({
              status: '',
              ...formParms
            })
            break
          case 'waiting':
            this.getStockInFormList({
              status: 0,
              ...formParms
            })
            break
          case 'beenOn':
            this.getStockInFormList({
              status: 1,
              ...formParms
            })
            break
          default:
            this.getStockInFormList({
              status: '',
              ...formParms
            })
        }
      }
    },

    /* 入库单管理-列表 */
    async getStockInFormList(params = {}) {
      const res = await api.getStockInFormData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.dataSource = []
        if (data.list && data.list.length > 0) {
          data.list.map(item => {
            this.dataSource.push({
              ...item,
              ...item.deliveryInfo
            })
          })
        }
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    },

    /* 入库单管理-详情 */
    async getStockInFormInfo(params) {
      const res = await api.getStockInFormInfoData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.incomingInfoFormDatas = {
          ...data,
          stockInPlan: this.$utils.parseTime(data.stockInPlan),
          stockInFact: this.$utils.parseTime(data.stockInFact)
        }
        this.deliverInfoFormDatas = data.deliveryInfo
        this.deliverInfoFormDatas.shipperModel = data.deliveryInfo.shipperModel.label || ''
        this.deliverInfoFormDatas.supplierModel = data.deliveryInfo.supplierModel.label || ''
        this.remarkFormDatas = { remark: data.remark }
      }
    },

    /* 入库单管理-详情-货物明细 */
    async getStockInFormProductList(params = {}) {
      const res = await api.getStockInFormProductData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.clothDetailDataSource = data.list
        this.gauzeDetailDataSource = data.list
        this.pagination = {
          ...this.pagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    },

    /* 入库单管理-详情-货物明细-明细 */
    async getProductDetailList(params = {}) {
      const res = await api.getProductDetailListData(params)
      if (this.$pub.responseValidate(res)) {
        const data = res.data
        this.dialogDetailsPopUpBoxList = true
        this.dialogDetailsDataSource = data.list
        this.dialogDetailsPagination = {
          ...this.dialogDetailsPagination,
          dataTotal: data.total,
          ...params,
          currentPage: data.pageNum,
          pageSize: data.pageSize
        }
      }
    }
  }
}
