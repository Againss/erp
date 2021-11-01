import * as api from '../api/index'
import * as priceApi from '../api/price-index'
import { sysUserInfo, countriesIndex } from '../../public/api/index'
// import { get } from 'sortablejs'
export const Offer = {
  data: () => {
    return {
      firstSelect: '',
      BusinessListPageNum: 1// 商机下拉分页
    }
  },
  methods: {
    // 新建状态根据当前用户返现数据
    addDisplayInfo() {
      const userInfo = this.userInfo
      const saleOrgs = (userInfo.orgs && userInfo.orgs.length !== 0) ? userInfo.orgs.filter(item => item.functionTag === 'SAL').map(item => {
        return {
          label: item.name,
          value: item.orgId
        }
      }) : []
      this.$set(this.searchData[5], 'dataSource', [{ label: userInfo.realName, value: userInfo.userId }])
      this.$set(this.briefFormDatas, 'seller', { label: userInfo.realName, value: userInfo.userId })
      this.$set(this.searchData[3], 'dataSource', saleOrgs)
      // 1.0.4如果用户关联的部门只有一个则默认带出
      if (saleOrgs.length === 1) {
        this.briefFormDatas.sellerTeam = saleOrgs[0]
      }
      this.$set(this.searchData[3], 'dataSource', saleOrgs)
    },

    // 上一步
    previousStep() {
      this.stepFlag = true
    },

    // 查询商机
    async OfferRemoteBusinessPage(data = {}, num, popOptions) {
      //
      const res = await api.businessOpportunityPage(data)
      //
      let newArray = []
      if (res.data.list && res.data.list.length > 5) {
        newArray = res.data.list.slice(0, 5)
      } else {
        newArray = res.data.list || []
      }
      newArray = newArray.map(item => {
        return {
          value: item.id,
          label: item.name,
          customerName: item.customerName,
          customerId: item.customerId
        }
      })

      this.$set(popOptions[num], 'dataSource', newArray)
    },

    // 根据客户查询品牌
    async getBrandBusiness(data = {}) {
      const res = await api.customerBrandBrandPage({ dataTag: 'ALL', ...data })
      const dataList = res.data.list ? res.data.list.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      }) : []
      this.$set(this.searchData[9], 'dataSource', dataList)
    },

    // 关闭tab栏对应的
    closeTab(item, num) {
      this.$confirm('此操作将删除该布类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.totalDataList.length === 1) {
          this.$message.warning('布类最少要有一条')
          return false
        } else {
          // const tabs = this.totalDataList
          // let activeName = this.editableTabsValue
          // if (activeName === num) {
          //   tabs.forEach((tab, index) => {
          //     if (index === num) {
          //       // const nextTab = tabs[index + 1] ? index + 1 : index - 1
          //       // if (nextTab) {
          //       activeName = tabs[index + 1] ? index : index - 1
          //       // }
          //     }
          //   })
          // }
          // activeName = activeName > num ? activeName - 1 : activeName
          //
          // this.editableTabsValue = activeName
          // this.totalDataList = tabs.filter((tab, index) => index !== num)
          if (this.editableTabsValue === num) {
            if (this.editableTabsValue === this.totalDataList.length - 1) {
              this.editableTabsValue -= this.editableTabsValue
            }
          } else {
            this.editableTabsValue = this.editableTabsValue > num ? this.editableTabsValue - 1 : this.editableTabsValue
          }
          this.totalDataList.splice(num, 1)
          if (this.totalDataList[this.editableTabsValue].weight) {
            const { weight, clothWidth, weightPerSquare, unit } = this.totalDataList[this.editableTabsValue]
            this.quantityData = [this.getQuantityWeight({ weight, clothWidth, weightPerSquare, unit })]
          } else {
            this.quantityData = []
          }
          window.scrollTo(0, 0)
          this.sellingPrice = this.totalDataList[this.editableTabsValue].salePrice || 0
          const newArray = ['yarnList', 'wovenLossList', 'wovenTechList', 'dyeingTechList', 'afterfinishLossList', 'functionLossList', 'majorPrintingTechList', 'paymentMethodList', 'freightList', 'testCostList']
          newArray.forEach(item => {
            this[item] = []
            this[item] && this[item].splice(0, this[item].length)
            this.totalDataList[this.editableTabsValue][item] && this[item].push(...this.totalDataList[this.editableTabsValue][item])
          })
          this.yarnListS = this.getYarnList('S')
          this.yarnListF = this.getYarnList('F')
          this.taxRebateMark = this.totalDataList[this.editableTabsValue].taxRebateMark
          this.notes = this.totalDataList[this.editableTabsValue].notes
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },

    // 添加tab栏对应的
    addTab() {
      console.log(this.$refs.scrollbar)
      const newTabName = this.totalDataList.length

      //
      // const lastNum = this.totalDataList[newTabName - 1].value
      if (newTabName >= 10) {
        this.$message.warning('布类最多10条')
        return false
      }
      this.totalDataList.push({
        // title: 'New Tab',
        fabricName: '布类' + (newTabName + 1),
        value: newTabName,
        flag: false,
        paymentMethodList: this.PublicPaymant,
        taxRebateMark: /crm/.test(this.branch) ? 0 : 1,
        notes: ''
      })
      // this.editableTabsValue = newTabName + 1
      //
      // setTimeout(() => {
      //   this.$refs.input[newTabName].focus()
      // }, 0)
    },

    // 锚点点击事件
    anchorPoint(index, id) {
      //
      // const anchor = this.$el.querySelector(id)
      // const father = document.querySelector('.offer-add-edit')
      // window.scrollTo({ top: anchor.offsetTop - 280, behavior: 'smooth' })
      // window.scrollTo(0, anchor.offsetTop - 280)
      // father.scrollTop = anchor.offsetTop
      // father.scrollTop = 0
      this.anchorPointIndex = index
    },

    // 销售价格blur事件
    priceBlur() {
      const pattern = /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/
      if (pattern.test(this.sellingPrice)) {
        this.priceErrorMessage = ''
      } else {
        this.priceErrorMessage = '数字且最大九位整数,最多两位小数'
      }
    },

    // 保存为草稿接口
    async saveAsDraft(data = {}) {
      const res = await api.quotationSheetDraft({ id: this.id, quotationId: this.quotationId, ...data })
      if (res.code !== 200) {
        return false
      }
      const branchFlag = /crm/.test(this.branch)
      if (this.routeId) {
        const { beforeCode, afterCode } = this.compareData(this.rowInfoMessages, { quotationId: this.quotationId, ...data }, 'quotationId')
        const flagLog = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flagLog && this.fetchLog(this.getLogMessages('UPDATE', `/${branchFlag ? 'crm' : 'priceCenter'}/quotationSheet/draft`), data, JSON.stringify({ beforeText: `在${branchFlag ? '销售管理系统-报价' : '价格中心-销售报价'}将${JSON.stringify({ 'quotationId': this.quotationId })}`, afterText: '草稿修改为', ...{ beforeCode, afterCode }}))
      } else {
        this.fetchLog(this.getLogMessages('INSERT', `/${branchFlag ? 'crm' : 'priceCenter'}/quotationSheet/draft`), data, JSON.stringify({ beforeText: `在${branchFlag ? '销售管理系统-报价' : '价格中心-销售报价'}保存一条草稿`, beforeCode: data }))
      }
      const params = res.data || {}
      this.id = res.data.id || ''
      this.setDetailData(params)
      // 保存为草稿不做跳转 后端返回了详情数据 再一次赋值
      this.$message.success('保存为草稿成功')
      // this.$store.dispatch('tagsView/delView', this.$route)
    },
    // 设置详情数据
    setDetailData(params) {
      const dataList = params
      this.rowInfoMessages = dataList
      // debugger
      this.quotationId = params.quotationId

      const countryCode = params.countryCode
      // this.countryCode = res.data.countryCode
      if (!params.countryCode) {
        this.getCountryCodeByName({ name: params.countryName })
      }
      // 这是给上一步返现用的
      const branchFlag = /crm/.test(this.branch) // 判断是否为crm系统
      const { quotationName, businessOpportunity, sellerTeam, seller, customer, brand, year, quarter, periodOfValidity } = dataList // crm报价或者值
      const { profitId, countryName, sellerTeamName, sellerName } = dataList // 价格中心或者值
      const targetProfitRate = params.targetProfitRate ? (params.targetProfitRate * 1).toFixed(2) : '0.00' // 价格中心获取值
      if (branchFlag) {
        const businessOpportunityName = dataList.businessOpportunity.label || null
        const customerNameCRM = dataList.customer.label || null
        // this.$set(this.searchData[2], 'dataSource', [dataList.sellerTeam])
        dataList.seller.value ? this.$set(this.searchData[5], 'dataSource', [dataList.seller]) : delete dataList.seller

        dataList.customer.value && this.getBrandBusiness({ customerId: dataList.customer.value })
        dataList.customer.value ? this.$set(this.searchData[7], 'dataSource', [dataList.customer]) : delete dataList.customer

        dataList.seller.value && this.getOrgs({ userId: dataList.seller.value })
        dataList.sellerTeam.value ? '' : delete dataList.sellerTeam
        dataList.brand.value ? '' : delete dataList.brand
        // const { quotationName, businessOpportunity, sellerTeam, seller, customer, brand, year, quarter, periodOfValidity } = dataList
        this.briefFormDatas = { businessOpportunityName, quotationName, businessOpportunity, sellerTeam, seller, customer, brand, year, quarter, periodOfValidity, countryCode, customerName: customerNameCRM, countryName }

        dataList.fabricList.forEach((item, index) => {
          item.flag = false
          item.value = index
          item.status = dataList.status
        })
        this.totalDataList = dataList.fabricList
        dataList.paymentMethod.value && this.getPublicPaymant({ paymentMethod: { value: dataList.paymentMethod.value }})
      } else {
        // const { profitId, countryName, quotationName, sellerTeamName, sellerName, customerName, brandName, year, quarter } = params

        this.briefFormDatas = { profitId, targetProfitRate, countryName, quotationName, sellerTeamName, sellerName, year, quarter, countryCode, customer, brand }
        // this.totalDataList.push(...dataList.fabricList)
        this.totalDataList = dataList.fabricList
      }

      // 这是给数量返现用的
      if (dataList.fabricList[this.editableTabsValue] && dataList.fabricList[this.editableTabsValue].weight) {
        const { weight, clothWidth, weightPerSquare, unit } = dataList.fabricList[this.editableTabsValue]
        this.quantityData = [this.getQuantityWeight({ weight, clothWidth, weightPerSquare, unit })]
      }

      this.sellingPrice = dataList.fabricList[this.editableTabsValue].salePrice

      this.dollarExchangeRate = dataList.rmbToUsd
      this.HongKongDollarExchangeRate = dataList.rmbToHkd

      // const { countryName, targetProfitRate } = dataList
      this.areaData = { countryName, targetProfitRate, profitId }
      this.areaList && this.areaList.map((item, index) => {
        if (this.areaData.countryName === item.countryName) {
          // ;
          this.areaData.targetProfitRate = item.profitRate
          this.briefFormDatas.targetProfitRate = item.profitRate
        }
      })

      //
      const newArray = ['yarnList', 'wovenLossList', 'wovenTechList', 'dyeingTechList', 'afterfinishLossList', 'functionLossList', 'majorPrintingTechList', 'paymentMethodList', 'freightList', 'testCostList']
      newArray.forEach(item => {
        this[item].splice(0, this[item].length)
        dataList.fabricList[this.editableTabsValue][item] && this[item].push(...dataList.fabricList[this.editableTabsValue][item])
      })
      this.yarnListS = this.getYarnList('S')
      this.yarnListF = this.getYarnList('F')
      this.taxRebateMark = dataList.fabricList[this.editableTabsValue].taxRebateMark
      this.notes = dataList.fabricList[this.editableTabsValue].notes
      // if (dataList && dataList.fabricList[this.editableTabsValue] && dataList.fabricList[this.editableTabsValue].freightList[0].affordExpense) {
      //   this.freightCoefficient = this.$utils.getFloat(dataList.fabricList[this.editableTabsValue].freightList[0].affordExpense / (dataList.fabricList[this.editableTabsValue] && dataList.fabricList[this.editableTabsValue].weight), 4)
      // }
      // this.freightList = dataList.fabricList[this.editableTabsValue]['freightList'] || []
    },
    // 保存为草稿点击事件, 数据处理
    saveDraft() {
      //
      // 上一步数据
      const briefData = this.$refs.detailsForm.dynamicValidateFormRuleForm
      this.processingCostData()
      let result = ''
      this.totalDataList.forEach((item) => {
        if (item.freightCost && Math.abs(item.freightCost) >= 100000) {
          result += `${item.fabricName}的运输成本小计超出范围,`
        }
        const pattern = /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/
        if (item.salePrice && !pattern.test(item.salePrice)) {
          result += `${item.fabricName}的销售价格格式不正确,`
        }
        if (Math.abs(item.actualProfitRate) >= 1000) {
          result += `${item.fabricName}的实际利润率超出范围,`
        }
      })
      if (result) {
        this.$message.error(result)
        return
      }
      if (this.countryCode) {
        this.saveAsDraft({ ...briefData, ...this.areaData, rmbToUsd: this.dollarExchangeRate, rmbToHkd: this.HongKongDollarExchangeRate, fabricList: this.totalDataList, countryCode: this.countryCode })
      } else {
        this.saveAsDraft({ countryCode: this.countryCode, ...briefData, ...this.areaData, rmbToUsd: this.dollarExchangeRate, rmbToHkd: this.HongKongDollarExchangeRate, fabricList: this.totalDataList })
      }
    },

    // 提交审批点击事件, 数据处理
    submitApproval() {
      const briefData = this.$refs.detailsForm.dynamicValidateFormRuleForm
      this.processingCostData()

      const pattern = /^(([1-9]{1}\d{0,1})|(100)|(0{1}))(\.\d{1,2})?$/
      let result = ''
      this.totalDataList.forEach((item) => {
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
        if (!item.freightList || item.freightList.length === 0) {
          result += `${item.fabricName}的运费未添加,`
        }
        if (Math.abs(item.freightCost) >= 100000) {
          result += `${item.fabricName}的运输成本小计超出范围,`
        }

        if (item.testCostList && item.testCostList.length) {
          item.testCostList.forEach((itema, indexa) => {
            if (!itema.colorCount || isNaN(itema.colorCount) || itema.colorCount - 0 <= 0) {
              result += `${item.fabricName}的测试方式${indexa + 1}的颜色个数未输入或者不符合规范,`
            }
          })
        }
        const pattern1 = /^(([1-9]\d{0,8})|0)(\.\d{1,2})?$/
        if (!pattern1.test(item.salePrice)) {
          result += `${item.fabricName}的销售价格格式不正确,`
        }
        if (Math.abs(item.actualProfitRate) >= 1000) {
          result += `${item.fabricName}的实际利润率超出范围,`
        }
      })

      if (result) {
        this.$message.error(result)
      } else {
        if (this.countryCode) {
          this.submitQuotation({ ...briefData, ...this.areaData, rmbToUsd: this.dollarExchangeRate, rmbToHkd: this.HongKongDollarExchangeRate, fabricList: this.totalDataList, countryCode: this.countryCode })
        } else {
          this.submitQuotation({ countryCode: this.countryCode, ...briefData, ...this.areaData, rmbToUsd: this.dollarExchangeRate, rmbToHkd: this.HongKongDollarExchangeRate, fabricList: this.totalDataList })
        }
      }
    },
    // 提交报价
    async submitQuotation(data = {}) {
      const res = await api.quotationSheetAdd({ id: this.id, quotationId: this.quotationId, ...data })
      if (res.code !== 200) {
        return false
      }
      const branchFlag = /crm/.test(this.branch)
      this.fetchLog(this.getLogMessages('SET', `/${branchFlag ? 'crm' : 'priceCenter'}/quotationSheet/draft`), data, JSON.stringify({ beforeText: `在${branchFlag ? '销售管理系统-报价' : '价格中心-销售报价'}提交一条报价`, beforeCode: data }))
      this.$message.success('保存成功')
      if (/crm/.test(this.branch)) {
        this.PopDialogHandle(this.submitPopOptions, '提交审批')
        this.$set(this.submitPopOptions.formDatas, 'applicantName', this.userInfo.name)
      } else {
        this.$router.back()
      }
      // this.PopDialogHandle(this.submitPopOptions, '提交审批')
      // this.$set(this.submitPopOptions.formDatas, 'applicantName', this.userInfo.name)
      this.quotationId = res.data.quotationId
    },
    // 发起审批
    async quotationSheetSubmit(data = {}) {
      const res = await api.quotationSheetSubmit(data)
      if (res.code !== 200) {
        return false
      }
      const branchFlag = /crm/.test(this.branch)
      this.fetchLog(this.getLogMessages('SET', `/${branchFlag ? 'crm' : 'priceCenter'}/quotationSheet/submit`), data, JSON.stringify({ beforeText: `在${branchFlag ? 'crm' : 'priceCenter'}审批一条报价`, beforeCode: data }))
      this.closePopDialogHandle(this.submitPopOptions)
      this.$message.success('提交审批成功')
      this.$router.back()
    },

    // 获取所有数据详情
    async getQuotationSheetInfo(data = {}) {
      const res = await api.quotationSheetInfo(data);
      (!/crm/.test(this.branch)) && await this.whetherSaler()
      this.id = res.data.id || ''
      const params = res.data || {}
      // 如果是不是草稿状态进入编辑页 将跳到详情页
      if (/crm/.test(this.branch) && res.data.status !== 'D') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push(`/offer/offer-details-page/${res.data.quotationId}`)
        return
      }
      // 如果进入crm  将用fristSelect来区分是先选商机还是客户  从来换上对应的组件
      // if (/crm/.test(this.branch)) {
      //   const commonChangeReg = this.$getRules({})
      //   this.firstSelect = params.firstSelect || 'customer'
      //   if (this.firstSelect === 'customer') {
      //     this.searchData.splice(1, 1,
      //       {
      //         isShow: () => {
      //           return /crm/.test(this.branch)
      //         },
      //         prop: 'businessOpportunity',
      //         itemType: 'select',
      //         readonly: true,
      //         itemStyle: { 'width': '50%', 'marginRight': '0px' },
      //         label: '商机',
      //         valueType: 'object',
      //         valueKey: 'value',
      //         placeholder: '请选择商机',
      //         dataSource: []
      //       }
      //     )
      //     // 根据客户查询商机
      //     this.getBusinessList({ customerId: params.customer.value })
      //   } else if (this.firstSelect === 'business') {
      //     this.searchData.splice(7, 1,
      //       {
      //         isShow: () => {
      //           return /crm/.test(this.branch)
      //         },
      //         prop: 'customer',
      //         itemType: 'select',
      //         readonly: true,
      //         itemStyle: { 'width': '50%', 'marginRight': '0px' },
      //         label: '客户',
      //         valueType: 'object',
      //         valueKey: 'value',
      //         rules: [commonChangeReg],
      //         placeholder: '查找并选择商机后自动获取',
      //         dataSource: []
      //       },
      //     )
      //   }
      // }
      this.setDetailData(params)
    },

    // 点击编辑根据销售员查销售部门
    async getOrgs(data = {}) {
      const res = await sysUserInfo(data)

      const dataList = (res.data.orgs && res.data.orgs.length !== 0) ? res.data.orgs.filter(item => item.functionTag === 'SAL').map(item => {
        return {
          label: item.name,
          value: item.orgId
        }
      }) : []
      this.$set(this.searchData[3], 'dataSource', dataList)
    },

    // 一个补全所有下拉框的方法
    completionData(data, popContent) {
      data && Object.keys(data).forEach((item) => {
        popContent.forEach((content, index) => {
          if (content.prop === item) {
            this.$set(popContent[index], 'dataSource', [{ value: null, label: '全部' }, ...data[item].filter(item => item.label)])
          }
        })
      })
    },

    // 获取汇率配置参数
    async getExchangeRateList(data = {}) {
      const res = await priceApi.exchangeRateList(data)

      const dataList = res.data || []
      dataList.forEach(item => {
        if (item.sourceCurrencyEname === 'RMB' && item.targetCurrencyEname === 'HKD') {
          this.HongKongDollarExchangeRate = item.exchangeRate
        }
        if (item.sourceCurrencyEname === 'RMB' && item.targetCurrencyEname === 'USD') {
          this.dollarExchangeRate = item.exchangeRate
        }
      })
    },

    // 移除操作方法
    removeOperatesFun(formDatas, scope) {
      const { index, flag } = formDatas
      if (!index) {
        this[flag[0]].splice(scope.$index, 1)
        if (flag[0].includes('yarnList')) {
          this.yarnList = [...this.yarnListF, ...this.yarnListS]
          this.totalDataList[this.editableTabsValue].yarnList = this.yarnList
        } else {
          this.totalDataList[this.editableTabsValue][flag[0]] = this[flag[0]]
        }
        return
      }
      switch (flag.length) {
        case 1:
          // this.totalDataList[this.editableTabsValue][flag[0]].splice(index[0], 1)
          this[flag[0]].splice(index[0], 1)
          this.totalDataList[this.editableTabsValue][flag[0]] = this[flag[0]]
          break
        case 2:
          if (flag[1] === 'printingAdditionalList') {
            this.totalDataList[this.editableTabsValue][flag[0]][index[0]][flag[1]] = this.totalDataList[this.editableTabsValue][flag[0]][index[0]][flag[1]].filter(item => item.printingAdditionalType !== index[1])
            this[flag[0]][index[0]][flag[1]] = this[flag[0]][index[0]][flag[1]].filter(item => item.printingAdditionalType !== index[1])
          } else {
            // this.totalDataList[this.editableTabsValue][flag[0]][index[0]][flag[1]].splice(index[1], 1)
            this[flag[0]][index[0]][flag[1]].splice(index[1], 1)
          }
          break
        case 3:
          // this.totalDataList[this.editableTabsValue][flag[0]][index[0]][flag[1]][index[1]][flag[2]].splice(index[2], 1)
          this[flag[0]][index[0]][flag[1]][index[1]][flag[2]].splice(index[2], 1)
          break

        default:
          break
      }
    },
    // 更换操作方法
    changeOperatesFun(params, formDatas) {
      const { flag, form } = formDatas
      if (flag.length && flag[0].includes('yarnList') && flag.length === 1) {
        this.yarnPop(params.row)
      } else if (flag.length && flag[0] === 'wovenLossList' && flag.length === 1) {
        this.materialPop()
      } else if (flag.length && flag[0] === 'dyeingTechList' && flag.length === 1) {
        this.productDyeingPop()
      } else if (flag.length && flag[0] === 'dyeingTechList' && flag.length === 2) {
        this.productDyeingLossPop(params.$index)
      } else if (flag.length && flag[0] === 'afterfinishLossList' && flag.length === 1) {
        this.productPostIntegrationLossPop('replace')
      } else if (flag.length && flag[0] === 'functionLossList' && flag.length === 1) {
        this.productFunctionLossPop('replace')
      } else if (flag.length && flag[0] === 'majorPrintingTechList' && flag.length === 1) {
        this.productMainPrintingPop()
      } else if (form && form === 'addFlashPowder') {
        this.productPrintingFlashPowderPop()
      } else if (form && form === 'addFluorescence') {
        this.productPrintingFluorescencePop()
      } else if (form && form === 'addProtuberance') {
        this.productPrintingBumpPop()
      } else if (form && form === 'addLuminous') {
        this.productPrintingNightGlowPulpPop()
      } else if (flag.length && flag[1] === 'minorPrintingTechList' && flag.length === 2) {
        this.productSecondaryPrintingPop()
      } else if (flag.length && flag[1] === 'printingLossList' && flag.length === 2) {
        this.productPrintingLossPop()
      } else if (flag.length && flag[0] === 'paymentMethodList' && flag.length === 1) {
        this.financePaymentPop()
      } else if (flag.length && flag[0] === 'freightList' && flag.length === 1) {
        this.transportFreightPop('D')
      } else if (flag.length && flag[0] === 'testCostList' && flag.length === 1) {
        this.testTestPop()
      } else if (flag.length && flag[0] === 'wovenTechList' && flag.length === 1) {
        this.clothPop()
      }
    },
    // 检查当前用户是否设置区域与销售
    async whetherSaler(data = { status: 1 }) {
      const branchFlag = /crm/.test(this.branch)
      if (branchFlag) {
        const res = await api.crmRegionSalesRelate(data)
        if (res.data) {
          const { countryName, profitRate: targetProfitRate, abbr } = res.data
          this.areaData = { countryName, targetProfitRate }
          this.briefFormDatas.countryName = countryName
          this.countryCode = abbr
        } else {
        // this.$router.push({ name: 'offer-index' })
          this.$message.error('请到销售与区域设置当前用户的区域与销售')
          this.$router.back()
        }
      } else {
        const res = await api.regionSalesRelate(data)
        const listData = res.data || []
        this.areaList = listData
        const listRes = listData.map(e => {
          return {
            value: e.id,
            label: e.countryName,
            profitRate: e.profitRate
          }
        })
        this.$set(this.searchData[13], 'dataSource', listRes)
      }
    },

    // 根据区域名字查countryCode
    async getCountryCodeByName(data = {}) {
      const res = await countriesIndex(data)
      if (res.code !== 200) {
        return false
      }
      const dataList = res.data ? res.data.list : []
      dataList.forEach(item => {
        if (data.name === item.name) {
          this.countryCode = item.abbr || ''
        }
      })
    },
    // 绑定销售价格 退税 备注
    sellingPriceChange(val, type) {
      this.totalDataList[this.editableTabsValue][type] = val
    },
    // 处理成本数据销售价格以及实际利率
    async processingCostData() {
      // for (let index = 0; index < this.totalDataList.length; index++) {
      //   this.totalDataList[index].yarnCost = this.getYarnCostSubtotal(index)
      //   this.totalDataList[index].materialCost = this.getMaterialCostSubtotal(index)
      //   this.totalDataList[index].fabricCost = this.getFabricCostSubtotal(index)
      //   this.totalDataList[index].productionCost = this.getProductCostSubtotal(index)
      //   this.totalDataList[index].financialCost = this.getFinanceCostSubtotal(index)
      //   this.totalDataList[index].freightCost = this.getTransportSubtotal(index)
      //   this.totalDataList[index].testCost = this.getTestCostSubtotal(index)
      //   this.totalDataList[index].totalCost = this.getTotalCost(index)
      //   this.totalDataList[index].actualProfitRate = this.getActualProfitRate(index)
      // }

      this.totalDataList.forEach((item, index) => {
        item.yarnCost = this.getYarnCostSubtotal(index)
        item.materialCost = this.getMaterialCostSubtotal(index)
        item.fabricCost = this.getFabricCostSubtotal(index)
        item.productionCost = this.getProductCostSubtotal(index)
        item.financialCost = this.getFinanceCostSubtotal(index)
        item.freightCost = this.getTransportSubtotal(index)
        item.testCost = this.getTestCostSubtotal(index)
        item.totalCost = this.getTotalCost(index)
        item.actualProfitRate = this.getActualProfitRate(index)
        item.taxRebateAmount = this.getTaxRebateAmount(index)
      })
    },

    // 根据商机id查详情
    async getBusinessDetailById(id) {
      const res = await api.businessOpportunityInfo({ id: id })
      const data = res.data
      this.$set(this.briefFormDatas, 'businessOpportunity', { label: data.name, value: data.id })
      this.$set(this.searchData[7], 'dataSource', [{ label: data.customerName, value: data.customerId }])
      this.$set(this.briefFormDatas, 'customer', { label: data.customerName, value: data.customerId })
      this.getBrandBusiness({ customerId: data.customerId })
    },
    // 根据客户查找到商机下拉数据
    async getBusinessList(data) {
      const res = await api.businessOpportunityPage({ pageNum: this.BusinessListPageNum, dataTag: 'ALL', customerId: this.briefFormDatas.customer && this.briefFormDatas.customer.value || '', ...data })
      const list = res.data.list && res.data.list.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      }) || []
      this.searchData[1].dataSource.push(...list)
      this.BusinessListPageNum++
    },
    // 快捷添加弹窗
    costGroupAdd(item) {
      switch (item) {
        case '数量':
          this.quantityPop()
          break
        case '纱成本':
          this.yarnPop()
          break
        case '原材料成本':
          this.materialPop()
          break
        case '坯布成本':
          this.clothPop()
          break
        case '财务成本':
          this.financePaymentPop()
          break
        case '运输成本':
          this.transportFreightPop('D')
          break
        case '测试成本':
          this.testTestPop()
          break
        default:
          break
      }
    },
    // 获取短纤长丝
    getYarnList(type) {
      return this.yarnList && this.yarnList.filter(item => item.yarnType === type) || []
    },
    // 预览
    preView() {
      this.processingCostData()
      const obj = {
        areaData: this.areaData,
        dollarExchangeRate: this.dollarExchangeRate,
        HongKongDollarExchangeRate: this.HongKongDollarExchangeRate,
        totalDataList: this.totalDataList
      }
      window.localStorage.setItem('dataList', JSON.stringify(obj))
      this.isPreView = true
    },
    setPreView(flag) {
      this.isPreView = flag
    },
    // 根据客户带出付款条件
    async getPublicPaymant(data) {
      const res = await priceApi.paymentMethodPage({ ...data, status: 1 })
      if (res.data && res.data.list && res.data.list.length) {
        this.PublicPaymant = [res.data.list[0]]
      }
    },
    // 1.0.4客户可选择 获取客户下拉数据
    async getCustomerList(params) {
      const res = await priceApi.getCustomerList({ ...params })
      const data = res.data
      const list = data && data.map(item => {
        return {
          label: item.name,
          value: item.customerId
        }
      }) || []
      return list
    },
    // 新增客户
    async addCustomer(params) {
      const res = await priceApi.addCustomer({ ...params })
      console.log(res)
    },
    // 新增品牌
    async addBrand(params) {
      const res = await priceApi.addBrand({ ...params })
      console.log(res)
    },
    // 获取品牌下拉数据
    async getBrandList(params) {
      const res = await priceApi.getBrandList({ ...params })
      const data = res.data
      const list = data && data.map(item => {
        return {
          label: item.name,
          value: String(item.id)
        }
      }) || []
      return list
    }
  }
}
