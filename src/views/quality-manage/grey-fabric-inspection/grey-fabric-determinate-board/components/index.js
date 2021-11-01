import * as api from '../api/index'
export const determinateBoardPage = {
  methods: {
    // 确板分页
    async qaGreySwatchesTaskPage(data = {}) {
      // console.log({ ...this.searchFormDatas, ...data })
      const res = await api.qaGreySwatchesTaskPage({ ...this.searchFormDatas, status: this.activeName, ...data })
      const dataList = res.data.list || []
      this.dataSource = dataList
      console.log('dataList', dataList)
      //   this.$set(this.formDetailsOptions, 'dataSource', dataList)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize
      }
    //   this.$set(this.formDetailsOptions, 'pagination', this.pagination)
    },

    // 获取列表数量
    async getListCount(data = {}) {
      const res = await api.greigeSwatchesTaskStatusCount({ ...this.searchFormDatas, ...data })
      const dataList = res.data || []
      this.statusArr.forEach(statusItem => {
        statusItem.count = 0
        dataList.forEach((item, index) => {
          if (+statusItem.value === +item.status) {
            statusItem.count = item.count
          }
        })
      })
      // dataList.forEach((item, index) => {
      //   this.statusArr.forEach(statusItem => {
      //     if (+item.status === +statusItem.value)statusItem.count = item.count
      //   })
      // })
    },

    // 通过织厂从外勤查确板员
    async getPeopleByFactoryName(data = {}) {
      const res = await api.taskOutworkerConditionList(data)
      const dataList = res.data || []
      const tempData = dataList.map(item => {
        return {
          label: item.realName,
          value: item.sysUserUuid
        }
      })
      this.$set(this.popOptions.content._swatchesUsers, 'dataSource', tempData)
    },

    // 通过织厂获取待处理的织单
    async getKnitCodeByFactoryName(data = {}) {
      const res = await api.pendingKnitOrders(data)
      const dataList = res.data || []
      const tempData = dataList.map(item => {
        return {
          label: item,
          value: item
        }
      })
      // console.log()
      this.$set(this.popOptionsColumnsInfos._knitOrderNo.editOptions, 'dataSource', tempData)
    },

    async getPublishedMachineNoByKnitOrderNo(data = {}) {
      const { knitOrderNo, factoryId, index, formDatas } = data
      const res = await api.getPublishedMachineNoByKnitOrderNo({ knitOrderNo, factoryId })
      const dataInfo = res.data || ''
      // console.log(res)
      console.log(this.popOptions.formDatas, formDatas)
      this.$set(formDatas.knitOrders[index], 'publishedMachineNo', dataInfo)
      // formDatas.knitOrders[index].publishedMachineNo = dataInfo
    },

    // 准备发布任务
    async taskPreparePublish(data = {}) {
      const res = await api.greigeSwatchesTaskPreparePublish(data)
      const dataInfo = res.data
      if (dataInfo) {
        const { knitOrders, factoryId, factoryName } = dataInfo
        knitOrders.forEach(item => {
          item.edit = true
          item.machineCodeEdit = true
          item.knitOrderNoEdit = false
        })
        this.popOptions.formDatas = { factoryId, factoryName, knitOrders }
        this.getPeopleByFactoryName({ factoryId, taskType: 0 })
        this.getKnitCodeByFactoryName({ factoryId })
      }
    },

    // 发布任务弹出框保存事件
    async publishTaskSave(data = {}) {
      const res = await api.qaGreySwatchesTaskAdd(data)
      if (res.data) {
        this.$message.success('发布成功')
        this.popOptions.visible = false

        const api = `/qa/qaGreigeSwatchesTask/cancel`
        const opratorType = `UPDATE`
        const description = { beforeText: `在'质量管理-坯布检测-坯布确板'取消一条任务`, beforeCode: data }
        const appId = 'qa'
        this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api, description, appId })

        this.qaGreySwatchesTaskPage()
        this.getListCount()
      }
    }
  }
}
