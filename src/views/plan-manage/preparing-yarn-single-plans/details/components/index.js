import * as api from '../api/index'
export const DrawnworkDetails = {
  methods: {
    // 获取备纱单详情
    // async getGrayYarnInfo(data = {}) {
    //   const res = await api.grayYarnInfo({ ...data })
    //   const dataInfo = res.data || {}
    //   console.log(dataInfo)
    //   const dataList = dataInfo.list || [] // 拿到抽纱列表
    //   this.$set(this.popOptions.footerComponentOption, 'dataSource', dataList)
    // const recordList = dataInfo.recordList || [] // 拿到已抽纱列表
    // this.dataSource = dataList
    // this.orderInformationDataSourceCopy = recordList.length ? recordList.map(item => {
    //   return {
    //     ...item,
    //     lastLockNum: item.lockNum
    //   }
    // }) : []
    // },

    // 获取备纱单详情
    async getYarnPlanInfo(data = {}) {
      const [code, version] = this.codeAndVersion.split('-')
      const res = await api.yarnPlanOrderInfo({ code, version, ...data })
      const dataInfo = res.data || {}
      this.status = dataInfo.status || ''
      this.searchFormDatas = dataInfo
      dataInfo.yarnOrderDetailList && dataInfo.yarnOrderDetailList.forEach(item => {
        item.edit = !this.isDetail
        item.lockNumEdit = !this.isDetail
      })
      this.orderInformationData._tableForm.dataSource = dataInfo.yarnOrderDetailList || []
    },

    async getYarnPlanOrderInfoList(data = {}) {
      const res = await api.yarnPlanOrderInfoList(data)
      const dataList = res.data || []
      dataList.forEach(item => {
        item.edit = true
        item.lockNumEdit = true
        item.lockNum = ''
      })
      this.$set(this.popOptions.footerComponentOption, 'dataSource', dataList)
    },

    // 获取抽纱试纱列表
    async getGrayYarnStockList(data = {}) {
      const { code } = this.searchFormDatas
      const res = await api.grayYarnStockList({ ...this.popsearchFormDatas, orderNos: [code], ...data })
      const dataList = res.data || []
      console.log(dataList)
      dataList.forEach((item, index) => {
        item.sortIndex = index
      })
      this.$set(this.popOptions.popTableOptions, 'dataSource', dataList)
    },

    // 获取抽纱明细列表()
    async getDrawingDetails(data = {}, flag) {
      // console.log('获取抽纱明细', data)
      this.detailPopOptions.okHidden = !flag
      this.detailPopOptions.cancelText = flag ? '取消' : '关闭'

      const res = await api.grayYarnRecordList({ type: '1', ...data })
      const dataInfo = res.data || []
      console.log(dataInfo)
      // const dataList = dataInfo.list || [] // 拿到抽纱列表
      // const yarnCodeSearch = dataList.map(item => item.yarnCode).join('、') // 获取纱线编码搜索条件
      // const recordList = dataInfo.recordList || [] // 拿到已抽纱列表
      dataInfo.forEach(item => {
        item.lastLockNum = item.lockNum
        item.lockNumEdit = flag
        item.edit = flag
      })

      // if (type === 'add') {
      //   this.dataSource = dataList
      //   if (yarnCodeSearch) {
      //     this.getGrayYarnStockList({ yarnCode: yarnCodeSearch }) // 获取库存
      //     this.popsearchFormDatas = { yarnCode: yarnCodeSearch }
      //     this.popOptions.popFormOptions.formDatas = { yarnCode: yarnCodeSearch }
      //   } else {
      //     this.$message.warning('该条记录没有抽纱明细')
      //   }
      // } else
      this.detailPopOptions.content._tableForm.dataSource = dataInfo
      // this.detailPopOptions.content._tableForm.dataSource = [{}]
    },

    // 弹出框确认划扣
    async grayYarnAddRecord(data = {}) {
      const res = await api.grayYarnAddRecord(data)
      if (res.data) {
        this.$message.success('划扣成功')

        const api = `/aps/grayYarn/addRecord`
        const opratorType = `SET`
        const description = { beforeText: `在'计划管理-备纱单计划详情'划扣多条记录`, beforeCode: data }
        const appId = 'aps'
        this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api, description, appId })

        this.popOptions.visible = false
        this.detailPopOptions.visible = false
        // this.getGrayYarnStockList()
        await this.getYarnPlanInfo()
        // this.isDetail = true
      } else {
        this.$message.error(res.message)
      }
    },

    // 保存按钮点击事件
    async saveOrderInformation(data = {}) {
      this.judgeAndSubmit({ type: '0' })
    },

    // 编辑按钮点击事件
    editOrderInformation() {
      this.$router.replace({ name: 'preparing-yarn-single-plans-detail', query: { id: this.codeAndVersion, type: 'edit' }})
    },

    // 审核按钮点击事件
    async examineOrderInformation(data = {}) {
      this.judgeAndSubmit({ type: '1' })
    },

    // 判断并提交数据
    async judgeAndSubmit(data = {}) {
      const errorTxt = this.dataVerification()
      console.log(errorTxt)
      if (errorTxt) {
        this.$message.error(errorTxt)
      } else {
        const [code, version] = this.codeAndVersion.split('-')
        const planUseTimeList = this.$refs.orderInformationSearchForm.dynamicValidateFormRuleForm.tableForm
        const res = await api.yarnPlanOrderSave({ code, version, planUseTimeList, ...data })
        if (res.data) {
          // this.$router.push({ name: 'preparing-yarn-single-plans-detail', query: { type: 'detail' }})
          // console.log('审核成功')
          data.type === '1' ? this.$router.back() : this.$router.replace({ name: 'preparing-yarn-single-plans-detail', query: { id: this.codeAndVersion, type: 'detail' }})

          const api = `/asp/yarnOrder/save`
          const opratorType = `UPDATE`
          const description = { beforeText: `在'计划管理-备纱单计划详情'${data.type === '1' ? '审核' : '保存'}成功`, beforeCode: data }
          const appId = 'aps'
          this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api, description, appId })
        }
      }
    },

    // 变更按钮点击事件
    async changeOrderInformation(data = {}) {
      console.log('变更按钮')
      const [code, version] = this.codeAndVersion.split('-')
      const res = await api.yarnPlanOrderAlter({ code, version, ...data })
      // const res = true
      if (res.data) {
        this.$router.replace({ name: 'preparing-yarn-single-plans-detail', query: { id: this.codeAndVersion, type: 'edit' }})
      } else {
        this.$message.error('已有下游单据不能重新抽纱')
      }
    },

    // 返回按钮事件
    back() {
      this.$router.back()
    },

    // 订单信息校验
    dataVerification() {
      // 获取订单信息
      const orderInformationList = this.$refs.orderInformationSearchForm.dynamicValidateFormRuleForm.tableForm
      console.log(orderInformationList)
      let text = ''
      orderInformationList.forEach(item => {
        if (+item.purchaseQty > 0) {
          if (!item.planUseTime) text = '采购数量大于0, 计划采购交期未选择'
        }
      })
      return text
    }

    // 变更前判断是否可以变更
    // async yarnPlanOrderAlter(data = {}) {
    //   const [code, version] = this.codeAndVersion.split('-')
    //   const res = await api.yarnPlanOrderAlter({ code, version, ...data })
    //   return res
    // }

    // 完成抽纱
    // finishDrawnwork() {
    //   if (this.checkedYarnList.length) {
    //     const ids = this.checkedYarnList.map(item => item.id)
    //     this.grayYarnConfirmDone({ grayYarnIds: ids })
    //   } else this.$message.warning('请选择抽纱')
    // },

    // 抽纱详情完成抽纱
    // async grayYarnConfirmDone(data = {}) {
    //   const res = await api.grayYarnConfirmDone(data)
    //   if (res.data) {
    //     this.$message.success('完成抽纱成功')

    //     const api = `/aps/grayYarn/confirmDone`
    //     const opratorType = `SET`
    //     const description = { beforeText: `在'计划管理-抽纱-抽纱详情'完成多条抽纱`, beforeCode: data }
    //     const appId = 'aps'
    //     this.$store.dispatch('app/fetchParamsLog', { data, opratorType, api, description, appId })

    //     this.$router.back()
    //   } else {
    //     this.$message.error(res.message)
    //   }
    // }
  }
}
