import * as api from '../api/index'
export const OfferDetails = {
  methods: {
    // 获取联系人详情并显示
    async getOfferInfoDisplay(data = {}) {
      let res = null
      if (!/crm/.test(this.branch)) {
        res = await api.quotationSheetBriefInfo({ ...data, id: this.$route.params.codeid })
      } else {
        res = await api.quotationSheetBriefInfo(data)
      }

      this.offerStatus = res.data.status
      if (/crm/.test(this.branch)) {
        switch (res.data.status) {
          case 'D':
            this.onGoingStatus = 0
            this.searchData = this.draftData
            break
          case 'W':
            this.onGoingStatus = 1
            this.searchData = this.approvalData
            break
          case 'C':
            this.onGoingStatus = 2
            this.searchData = this.agreeData
            break
          case 'U':
            this.onGoingStatus = 3
            this.searchData = this.useData
            break
          case 'A':
            this.onGoingStatus = 4
            this.searchData = this.acceptData
            break
          case 'V':
            this.onGoingStatus = 4
            this.searchData = this.vetoData
            break
          case 'R':
            this.onGoingStatus = 2
            this.searchData = this.refuseData
            break
          case 'E':
            this.onGoingStatus = -1
            this.searchData = this.acceptData
            break
          default:
            break
        }
      } else {
        this.searchData = this.draftData
      }
      //   res.data.status === 'C' && this.getModelDevelopPage()

      const season = { 'Spr': '第一季度', 'Sum': '第二季度', 'Fall': '第三季度', 'Winter': '第四季度' }
      let businessOpportunityName, periodOfValidity, customerName, sellerTeamName, sellerName, brandName
      if (/crm/.test(this.branch)) {
        businessOpportunityName = res.data.businessOpportunity.label
        customerName = res.data.customer.label
        sellerTeamName = res.data.sellerTeam.label
        sellerName = res.data.seller.label
        brandName = res.data.brand.label
        periodOfValidity = res.data.periodOfValidity + '天'
      } else {
        businessOpportunityName = null
        customerName = res.data.customerName
        sellerTeamName = res.data.sellerTeamName
        sellerName = res.data.sellerName
        brandName = res.data.brandName
        periodOfValidity = null
      }

      const quarter = res.data.quarter && season[res.data.quarter]
      const createdTime = res.data.createdTime && this.$filters.parseTime(res.data.createdTime + '', '{y}-{m}-{d} {h}:{i}:{s}')
      const updatedTime = res.data.updatedTime && this.$filters.parseTime(res.data.updatedTime + '', '{y}-{m}-{d} {h}:{i}:{s}')
      const firstUseTime = res.data.firstUseTime && this.$filters.parseTime(res.data.firstUseTime + '', '{y}-{m}-{d}')
      const expirationTime = res.data.expirationTime && this.$filters.parseTime(res.data.expirationTime + '', '{y}-{m}-{d}')
      const acceptTime = res.data.acceptTime && this.$filters.parseTime(res.data.acceptTime + '', '{y}-{m}-{d} {h}:{i}')
      const vetoTime = res.data.vetoTime && this.$filters.parseTime(res.data.vetoTime + '', '{y}-{m}-{d} {h}:{i}:{s}')
      const message = (res.data.sheetApprove && res.data.sheetApprove.message) ? res.data.sheetApprove.message : ''
      const submitTime = (res.data.sheetApprove && res.data.sheetApprove.submitTime) ? this.$filters.parseTime(res.data.sheetApprove.submitTime + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
      const approvalTime = (res.data.sheetApprove && res.data.sheetApprove.approvalTime) ? this.$filters.parseTime(res.data.sheetApprove.approvalTime + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
      const rejectionTime = (res.data.sheetApprove && res.data.sheetApprove.rejectionTime) ? this.$filters.parseTime(res.data.sheetApprove.rejectionTime + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
      const rejectionReason = (res.data.sheetApprove && res.data.sheetApprove.rejectionReason) ? res.data.sheetApprove.rejectionReason : ''
      const targetProfitRate = res.data.targetProfitRate ? res.data.targetProfitRate + '%' : ''
      const overallProfitMargin = (res.data.status !== 'D' && res.data.overallProfitMargin) ? res.data.overallProfitMargin + '%' : '-'
      if (res.data.status) {
        this.effectiveDate = res.data.expirationTime ? Math.ceil((res.data.expirationTime - new Date().getTime()) / 3600 / 1000 / 24) : ''
      }
      this.detailsFormDatas = { ...res.data, targetProfitRate, overallProfitMargin, createdTime, updatedTime, quarter, firstUseTime, expirationTime, acceptTime, vetoTime, submitTime, approvalTime, rejectionTime, customerName, sellerTeamName, sellerName, brandName, message, rejectionReason, businessOpportunityName, periodOfValidity }
      //   this.$set(this.baseSearchData[13].componentsOptions, 'url', res.data.filePath)
    },

    // 获取所有数据详情
    async getQuotationSheetInfo(data = {}) {
      const res = await api.quotationSheetInfo(data)

      const dataList = res.data || {}

      dataList.fabricList.forEach((item, index) => {
        item.value = index
        item.flag = false
      })
      this.fullDataList = dataList

      const approvalId = (dataList.sheetApprove && dataList.sheetApprove.status !== 'B') ? dataList.sheetApprove.approver : ''
      if (approvalId === this.userInfo.userId) {
        this.$set(this.baseSearchData[2].componentsOptions, 'notUse', true)
        this.$set(this.baseSearchData[4].componentsOptions, 'notUse', true)
        this.$set(this.baseSearchData[8].componentsOptions, 'notUse', true)
      }

      // 这是给数量返现用的
      if (dataList.fabricList[0].weight) {
        const { weight, clothWidth, weightPerSquare, unit } = dataList.fabricList[0]
        this.quantityData = [this.getQuantityWeight({ weight, clothWidth, weightPerSquare, unit })]
      }
      // if (this.freightList && this.freightList[0] && this.freightList[0].affordExpense) {
      //   this.freightCoefficient = this.$utils.getFloat(this.freightList[0].affordExpense / (this.quantityData && this.quantityData[0].weight), 4)
      // }
      //
      this.dollarExchangeRate = dataList.rmbToUsd
      this.HongKongDollarExchangeRate = dataList.rmbToHkd
      // this.areaList && this.areaList.map((item, index) => {
      //   if (this.areaData.countryName === item.countryName) {
      //
      //     // ;
      //     this.areaData.targetProfitRate = item.profitRate
      //     this.briefFormDatas.targetProfitRate = item.profitRate
      //   }
      // })
      const newArray = ['yarnList', 'wovenLossList', 'wovenTechList', 'dyeingTechList', 'afterfinishLossList', 'functionLossList', 'majorPrintingTechList', 'paymentMethodList', 'freightList', 'testCostList']
      newArray.forEach(item => {
        this[item] = dataList.fabricList[0][item] || []
      })
      this.taxRebateMark = this.fullDataList.fabricList[0].taxRebateMark
      this.notes = this.fullDataList.fabricList[0].notes
      if (this.fullDataList.fabricList && this.fullDataList.fabricList[0].weight && this.fullDataList.fabricList[0].weightPerSquare < 150) {
        this.$set(this.otherProductMainPrintingViewColumns[3].componentsOptions, 'isFlag', true)
        this.$set(this.otherProductSecondaryPrintingBaseColumns[1].componentsOptions, 'isFlag', true)
      }
      if (this.fullDataList.fabricList && this.fullDataList.fabricList[0].freightList && this.fullDataList.fabricList[0].freightList.length && this.fullDataList.fabricList[0].freightList[0].priceClauseName === 'CIF') {
        this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'isFlag', true)
      }
      this.fullDataList.fabricList && this.fullDataList.fabricList[0].majorPrintingTechList && this.fullDataList.fabricList[0].majorPrintingTechList.map(item => {
        if (item.printingName === '拔印印花') {
          this.$set(this.productDyeingViewColumns[4].componentsOptions, 'isFlag', true)
        }
        item.minorPrintingTechList && item.minorPrintingTechList.map(mitem => {
          if (mitem.printingName === '拔印印花') {
            this.$set(this.productDyeingViewColumns[4].componentsOptions, 'isFlag', true)
          }
        })
      })

      this.fullDataList.fabricList && this.fullDataList.fabricList[0].afterfinishLossList && this.fullDataList.fabricList[0].afterfinishLossList.map(item => {
        if (item.afterfinishTechName && item.afterfinishTechName.includes('底磨毛') || item.afterfinishTechName.includes('面磨毛') || item.afterfinishTechName.includes('底刷毛') || item.afterfinishTechName.includes('面刷毛')) {
          // afterPrice = afterPrice + 0.2
          this.$set(this.clothBaseColumns[2].componentsOptions, 'isFlag', true)
        }
      })
      this.fullDataList.fabricList && this.fullDataList.fabricList[0].dyeingTechList && this.fullDataList.fabricList[0].dyeingTechList.map(item => {
        if (item.singleDoubleDyeingName === '单染') {
          this.$set(this.clothBaseColumns[2].componentsOptions, 'isFlag', true)
        }
      })

      if (this.fullDataList.fabricList && this.fullDataList.fabricList[0].affordExpense) {
        this.freightCoefficient = this.$utils.getFloat(this.fullDataList.fabricList[0].affordExpense / (this.quantityData && this.quantityData[0].weight), 4)
      }
      this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'productCostSubtotal', this.fullDataList && this.fullDataList.fabricList && this.fullDataList.fabricList[0].productionCost)
      this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'targetProfitRate', this.fullDataList && this.fullDataList.fabricList && this.fullDataList.fabricList[0].targetProfitRate)
      this.$set(this.transportFreightInternationalViewColumns[7].componentsOptions, 'weight', this.fullDataList && this.fullDataList.fabricList && this.fullDataList.fabricList[0].weight)

      //
    },

    // 点击更改所有人
    async okClick(params) {
      //
      const res = await api.quotationSheetModifyFollower({ ...params, quotationId: this.routeId })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('UPDATE', '/crm/quotationSheet/modify/follower'), params, JSON.stringify({ beforeText: `在'销售管理系统-线索中'将${JSON.stringify({ 'quotationId': this.routeId })}的所有人修改为`, afterCode: { ...params, quotationId: this.routeId }}))
      this.$message.success('更改所有人成功')
      // this.$emit('visibleClick', false)
      this.$set(this.OwnerPopOptions, 'visible', false)
      //
      this.getOfferInfoDisplay({ quotationId: this.routeId })
    },

    // 提交审批
    submitForApproval() {
      const pattern = /^(([1-9]{1}\d{0,1})|(100)|(0{1}))(\.\d{1,2})?$/
      let result = ''
      this.fullDataList.fabricList.forEach((item) => {
        if (!item.weight) {
          result += `${item.fabricName}的数量未添加,`
        }

        if (!item.yarnList || item.yarnList.length === 0) {
          result += `${item.fabricName}的纱线未添加,`
        } else {
          // 短纤
          const yarnListS = item.yarnList && item.yarnList.filter(item => item.yarnType === 'S') || []
          // 长纤
          const yarnListF = item.yarnList && item.yarnList.filter(item => item.yarnType === 'F') || []
          console.log(yarnListS)
          yarnListS.forEach((itemValue, index) => {
            if (itemValue.yarnDyeingList && itemValue.yarnDyeingList.length && (!itemValue.yarnDyeingList[0].yarnDyeingLossList || itemValue.yarnDyeingList[0].yarnDyeingLossList.length === 0)) {
              result += `${item.fabricName}的纱线中短纤${index + 1}染纱损耗未添加,`
            }
            if (!pattern.test(itemValue.yarnPct)) {
              result += `${item.fabricName}的纱线中短纤${index + 1}的纱线占比不符合规范,`
            }
          })
          yarnListF.forEach((itemValue, index) => {
            if (itemValue.yarnDyeingList && itemValue.yarnDyeingList.length && (!itemValue.yarnDyeingList[0].yarnDyeingLossList || itemValue.yarnDyeingList[0].yarnDyeingLossList.length === 0)) {
              result += `${item.fabricName}的纱线中长纤${index + 1}染纱损耗未添加,`
            }
            if (!pattern.test(itemValue.yarnPct)) {
              result += `${item.fabricName}的纱线中长纤${index + 1}的纱线占比不符合规范,`
            }
          })
          if (this.$utils.getFloat(item.yarnList.map(item => item.yarnPct ? item.yarnPct * 1 : 0).reduce((total, item) => total + item)) !== 100) {
            result += `${item.fabricName}的纱线占比相加不等于100,`
          }
        }

        if (!item.wovenLossList || item.wovenLossList.length === 0) {
          result += `${item.fabricName}的织损耗未添加,`
        }

        if (!item.wovenTechList || item.wovenTechList.length === 0) {
          result += `${item.fabricName}的织工未添加,`
        }

        if (item.dyeingTechList && item.dyeingTechList.length !== 0) {
          item.dyeingTechList.forEach((itemValue, index) => {
            if (!itemValue.dyeingLossList || itemValue.dyeingLossList.length === 0) {
              result += `${item.fabricName}的第${index + 1}个染色工艺填写则染色损耗要添加,`
            }

            if (!pattern.test(itemValue.colorPct)) {
              result += `${item.fabricName}的染色工艺${index + 1}的颜色占比不符合规范,`
            }
          })
          if (this.$utils.getFloat(item.dyeingTechList.map(itemValue => itemValue.colorPct ? itemValue.colorPct * 1 : 0).reduce((total, itemValue) => total + itemValue)) !== 100) {
            result += `${item.fabricName}的染色工艺颜色占比相加不等于100,`
          }
        }

        if (item.majorPrintingTechList && item.majorPrintingTechList.length !== 0) {
          if (!item.majorPrintingTechList[0].printingLossList || item.majorPrintingTechList[0].printingLossList.length === 0) {
            result += `${item.fabricName}的印花工艺的印花损耗未添加,`
          }
        }

        if (!item.paymentMethodList || item.paymentMethodList.length === 0) {
          result += `${item.fabricName}的付款条件未添加,`
        }

        if (!item.freightList || item.freightList.length === 0) {
          result += `${item.fabricName}的运费未添加,`
        }

        if (!item.salePrice) {
          result += `${item.fabricName}的销售价格未输入,`
        }
        if (item.testCostList && item.testCostList.length) {
          item.testCostList.forEach((itema, indexa) => {
            if (!itema.colorCount || isNaN(itema.colorCount) || itema.colorCount - 0 <= 0) {
              result += `${item.fabricName}的测试方式${indexa}的颜色个数未输入或者不符合规范,`
            }
          })
        }

        if (this.priceErrorMessage) {
          result += `${item.fabricName}的销售价格格式不正确,`
        }
      })

      if (result) {
        this.$message.error(result + ' 请点击编辑按钮到编辑页面编辑')
      } else {
        if (this.fullDataList.customer.value && this.fullDataList.seller.value && this.fullDataList.sellerTeam.value) {
          this.submitQuotation(this.fullDataList)
        } else {
          this.$message.warning('详细信息里基本信息不全, 请点击编辑按钮补全信息')
        }
      }
    },
    // 提交报价
    async submitQuotation(data = {}) {
      const res = await api.quotationSheetAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('SET', '/crm/quotationSheet/draft'), data, JSON.stringify({ beforeText: `在'销售管理系统-报价'提交一条草稿`, beforeCode: data }))
      this.$message.success('后端校验成功')
      this.PopDialogHandle(this.submitPopOptions, '提交审批')
      this.$set(this.submitPopOptions.formDatas, 'applicantName', this.userInfo.name)
      this.quotationId = res.data.quotationId
    },
    // 发起审批
    async quotationSheetSubmit(data = {}) {
      const res = await api.quotationSheetSubmit(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('SET', '/crm/quotationSheet/submit'), data, JSON.stringify({ beforeText: `在'销售管理系统-报价'审批一条报价`, beforeCode: data }))
      this.closePopDialogHandle(this.submitPopOptions)
      this.$message.success('提交审批成功')
      this.getOfferInfoDisplay({ quotationId: this.routeId })
      if (/crm/.test(this.branch)) {
        this.queryData()
      }
      // this.$router.back()
    },

    // 同意报价
    agreeQuotation() {
      this.$confirm('您确定要同意该报价吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sheetApprove({ redirectUrl: `${this.needUri}/approval/my-submission`, quotationId: this.routeId, status: 'C' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    // 拒绝按钮
    refuseQuotation() {
      this.PopDialogHandle(this.refusePopOptions, '拒绝报价')
    },
    // 审批同意/拒绝
    async sheetApprove(data = {}) {
      const res = await api.quotationSheetApprove(data)
      if (res.code !== 200) {
        return false
      }
      let message = ''
      data.status === 'C' ? message = '同意' : data.status === 'R' ? '拒绝' : ''
      this.fetchLog(this.getLogMessages('SET', '/crm/quotationSheet/approve'), data, JSON.stringify({ beforeText: `在'销售管理系统-报价'${message}一条报价`, beforeCode: data }))
      this.$message.success(`${message}成功`)
      this.closePopDialogHandle(this.refusePopOptions)
      this.getOfferInfoDisplay({ quotationId: this.routeId })
    },

    // 撤回审批
    withdrawalOfApproval() {
      this.$confirm('您确定要撤回该审批吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.quotationSheetWithdrawSubmit({ quotationId: this.routeId })
        this.activeName = 'detailed'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 撤回审批接口
    async quotationSheetWithdrawSubmit(data = {}) {
      const res = await api.quotationSheetWithdrawSubmit(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('SET', '/crm/quotationSheet/withdraw/submit'), data, JSON.stringify({ beforeText: `在'销售管理系统-报价'撤回审批一条报价`, beforeCode: data }))
      this.$message.success('撤回审批成功')
      this.getOfferInfoDisplay({ quotationId: this.routeId })
    },

    // 使用报价
    useQuotation() {
      this.$confirm('您确定要使用该报价吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.quotationSheetUse({ quotationId: this.routeId })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 使用报价接口
    async quotationSheetUse(data = {}) {
      const res = await api.quotationSheetUse(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('SET', '/crm/quotationSheet/use'), data, JSON.stringify({ beforeText: `在'销售管理系统-报价'使用一条报价`, beforeCode: data }))
      this.$message.success('使用报价成功')
      this.getOfferInfoDisplay({ quotationId: this.routeId })
    },

    // 接受报价
    acceptQuotation() {
      this.$confirm('您确定要接受该报价吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.quotationSheetAccept({ quotationId: this.routeId })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 接受报价接口
    async quotationSheetAccept(data = {}) {
      const res = await api.quotationSheetAccept(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLogMessages('SET', '/crm/quotationSheet/accept'), data, JSON.stringify({ beforeText: `在'销售管理系统-报价'接受一条报价`, beforeCode: data }))
      this.$message.success('接受报价成功')
      this.getOfferInfoDisplay({ quotationId: this.routeId })
    },

    // 否决报价
    vetoQuotation() {
      this.$confirm('您确定要否决该报价吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.quotationSheetVeto({ quotationId: this.routeId })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 否决报价接口
    async quotationSheetVeto(data = {}) {
      const res = await api.quotationSheetVeto(data)
      if (res.code !== 200) {
        return false
      }
      const branchFlag = /crm/.test(this.branch)
      this.fetchLog(this.getLogMessages('SET', branchFlag ? '/crm/quotationSheet/veto' : '/priceCenter/quotationSheet/veto'), data, JSON.stringify({ beforeText: `在${branchFlag ? '销售管理系统-报价' : '价格中心-销售报价'}否决一条报价`, beforeCode: data }))
      this.$message.success('否决报价成功')
      this.getOfferInfoDisplay({ quotationId: this.routeId })
    },

    // 撤回接受
    withdrawalAcceptance() {
      this.$confirm('您确定要撤回接受吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.quotationSheetWithdrawAcceptance({ quotationId: this.routeId })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 撤回接受接口
    async quotationSheetWithdrawAcceptance(data = {}) {
      const res = await api.quotationSheetWithdrawAcceptance(data)
      if (res.code !== 200) {
        return false
      }
      const branchFlag = /crm/.test(this.branch)
      this.fetchLog(this.getLogMessages('SET', `/${branchFlag ? 'crm' : 'priceCenter'}/quotationSheet/withdraw/acceptance`), data, JSON.stringify({ beforeText: `在${branchFlag ? '销售管理系统-报价' : '价格中心-销售报价'}撤回接受一条报价`, beforeCode: data }))
      this.$message.success('撤回接受成功')
      this.getOfferInfoDisplay({ quotationId: this.routeId })
    },

    // 撤回否决
    withdrawalTheVeto() {
      this.$confirm('您确定要撤回否决吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.quotationSheetWithdrawVeto({ quotationId: this.routeId })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 撤回否决接口
    async quotationSheetWithdrawVeto(data = {}) {
      const res = await api.quotationSheetWithdrawVeto(data)
      if (res.code !== 200) {
        return false
      }
      const branchFlag = /crm/.test(this.branch)
      this.fetchLog(this.getLogMessages('SET', `/${branchFlag ? 'crm' : 'priceCenter'}/quotationSheet/withdraw/veto`), data, JSON.stringify({ beforeText: `在${branchFlag ? '销售管理系统-报价' : '价格中心-销售报价'}撤回否决一条报价`, beforeCode: data }))
      this.$message.success('撤回否决成功')
      this.getOfferInfoDisplay({ quotationId: this.routeId })
    },

    // 复制为草稿
    copyAsDraft() {
      this.whetherSaler({ salesId: this.userInfo.userId, userId: this.userInfo.userId })
    },
    // 复制为草稿接口
    async quotationSheetCopy(data = {}) {
      const res = await api.quotationSheetCopy(data)
      if (res.code !== 200) {
        return false
      }
      const branchFlag = /crm/.test(this.branch)
      this.fetchLog(this.getLogMessages('SET', `/${branchFlag ? 'crm' : 'priceCenter'}/quotationSheet/copy`), data, JSON.stringify({ beforeText: `在${branchFlag ? '销售管理系统-报价' : '价格中心-销售报价'}复制一条报价为草稿`, beforeCode: data }))
      this.$message.success('复制为草稿成功')
    },
    // 1.0.4根据数量单位 换算
    getQuantityWeight(data) {
      const obj = { ...data }
      // 这里后端存的数量 weight字段 是跟随单位的  弹窗里面的数据数量字段weight是跟随单位的 这里为了让其他用到数量计算的地方不动  所以将后端存的跟随单位的weight字段 换成kg的weight
      // 如果存了单位就是新数据  没有存单位的旧数据按照 kg算  以前是kg
      switch (data.unit) {
        case 'lb':
          obj.lbweight = data.weight
          obj.weight = this.$utils.getFloat(data.weight / 2.2046, 4)
          obj.ydweight = this.$utils.getFloat(this.$utils.getFloat(data.weight / data.clothWidth / data.weightPerSquare / 0.00081925, 4) * 16, 4)
          break
        case 'yd':
          obj.ydweight = data.weight
          obj.weight = this.$utils.getFloat(this.$utils.getFloat(this.$utils.getFloat(this.$utils.getFloat(data.weight * data.clothWidth * data.weightPerSquare, 4) * 0.00081925, 4) / 16, 4) / 2.2046, 4)
          obj.lbweight = this.$utils.getFloat(this.$utils.getFloat(this.$utils.getFloat(data.weight * data.clothWidth * data.weightPerSquare, 4) * 0.00081925, 4) / 16, 4)
          break
        default:
          obj.weight = data.weight
          obj.ydweight = this.$utils.getFloat(this.$utils.getFloat(data.weight / data.clothWidth / data.weightPerSquare / 0.00081925, 4) * 16 * 2.2046, 4)
          obj.lbweight = this.$utils.getFloat(data.weight * 2.2046, 4)
          break
      }
      return obj
    },
    // 预览
    preView() {
      const obj = {
        areaData: {
          countryName: this.countryName,
          targetProfitRate: this.targetProfitRate
        },
        dollarExchangeRate: this.dollarExchangeRate,
        HongKongDollarExchangeRate: this.HongKongDollarExchangeRate,
        totalDataList: this.fullDataList.fabricList
      }
      window.localStorage.setItem('dataList', JSON.stringify(obj))
      this.isPreView = true
    },
    setPreView(flag) {
      this.isPreView = flag
    }
  }
}
