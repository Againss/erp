import * as api from '../api/index'
import { businessOpportunityPage } from '../../business-opportunity/api/index'
export const ContractRelevant = {
  methods: {
    // 获取合同分页列表
    async getContractPage(data = {}) {
      const res = await api.contractPage({ ...this.formDatas, ...this.searchFormDatas, ...data })
      console.log('合同', res)
      const userList = res.data.list || []
      //   this.dataSource = userList
      this.contractDataSource = userList
      this.contractTotal = res.data.total
      this.relevantContractOptions && this.$set(this.relevantContractOptions, 'dataSource', userList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    },

    // 添加或者编辑合同
    addOrEditContract(data) {
      if (this.type === 'add') {
        this.addContract(data)
      } else if (this.type === 'edit') {
        this.editContract(data)
      }
    },

    // 添加合同
    async addContract(data = {}) {
      const res = await api.contractAdd(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.contractPopOptions, 'visible', false)
      this.closePopDialogHandle(this.contractPopOptions)
      this.$message.success('添加成功')
      this.getContractPage()
    },

    // 编辑合同
    async editContract(data = {}, flag) {
      const res = await api.contractModify(data)
      if (res.code !== 200) {
        return false
      }
      //   this.$set(this.contractPopOptions, 'visible', false)
      this.closePopDialogHandle(this.contractPopOptions)
      this.$message.success('编辑成功')
      if (flag) {
        this.getContractInfoDisplay({ id: this.routeId })
      } else {
        this.getContractPage()
      }
    },

    // 删除合同
    async deleteContract(data = {}, flag) {
      const res = await api.contractDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      if (flag) {
        this.$router.back()
      } else {
        this.getContractPage()
      }
    },

    // 获取合同详情
    async getContractInfo(data = {}) {
      const res = await api.contractInfo(data)
      console.log('详情', res)
      const contractDate = this.$filters.parseTime(res.data.contractDate + '', '{y}-{m}-{d}')
      const startTime = this.$filters.parseTime(res.data.startTime + '', '{y}-{m}-{d}')
      const endTime = this.$filters.parseTime(res.data.endTime + '', '{y}-{m}-{d}')
      this.$set(this.contractPopOptions.content[1], 'dataSource', [{ label: res.data.customerName, value: res.data.customerId }])
      // this.$set(this.contractPopOptions.content[2], 'dataSource', [{ label: res.data.businessOpportunityName, value: res.data.businessOpportunityId }])
      this.customerChange(res.data.customerId)
      this.$set(this.contractPopOptions.content[9], 'dataSource', [{ label: res.data.ourSignatoryName, value: res.data.ourSignatory }])
      const totalAmount = res.data.totalAmount && res.data.totalAmount / 10000
      this.setFormDatas(this.contractPopOptions, { ...res.data, contractDate, startTime, endTime, totalAmount })
    },

    // 客户change事件
    async customerChange(value, form, formDatas, setFormDatas) {
      // console.log(value)
      // setFormDatas({ businessOpportunityId: '' })
      const res = await businessOpportunityPage({ dataTag: 'ALL', customerId: value })
      console.log(res)
      if (res.data.list) {
        this.$set(this.contractPopOptions.content[2], 'placeholder', '请选择')
        // setFormDatas({ businessOpportunityId: '请选择' })
        this.$set(this.contractPopOptions.content[2], 'dataSource', res.data.list.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        }))
      } else {
        this.$set(this.contractPopOptions.content[2], 'dataSource', [])
        this.$set(this.contractPopOptions.content[2], 'placeholder', '该客户暂无商机')
      }
    }

  }
}
