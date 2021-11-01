/*
 * @Date: 2021-05-15 10:54:48
 * @Author: Againss
 * @LastEditTime: 2021-08-04 15:20:58
 * @LastEditors: Againss
 * @Descripttion:
 */
export const getTotol = {
  methods: {
    getQuantityData(currentFabric) {
      if (this.totalDataList[currentFabric].weight) {
        const { weight, clothWidth, weightPerSquare, unit } = this.totalDataList[currentFabric]
        return [this.getQuantityWeight({ weight, clothWidth, weightPerSquare, unit })]
      } else {
        return []
      }
    },

    // 纱成本小计
    getYarnCostSubtotal(currentFabric) {
      let totalPrice = 0
      this.totalDataList[currentFabric].yarnList && this.totalDataList[currentFabric].yarnList.forEach(item => {
        const certPrice = (item.yarnCertList && item.yarnCertList.length) ? this.$utils.getFloat(item.yarnCertList.map(item => item.yarnCertPrice || 0).reduce((total, item) => total + item), 4) : 0
        let yarnPrice = this.$utils.getFloat((item.yarnPrice + certPrice) * (isNaN(item.yarnPct) ? 0 : item.yarnPct) / 100, 4)
        let dyedYarnPrice = 0
        let dyedyarnLossPct = 0
        if (item.yarnDyeingList && item.yarnDyeingList.length) {
          dyedYarnPrice = item.yarnDyeingList[0].dyedYarnPrice || 0
          dyedyarnLossPct = (item.yarnDyeingList[0].yarnDyeingLossList && item.yarnDyeingList[0].yarnDyeingLossList.length) ? item.yarnDyeingList[0].yarnDyeingLossList[0].dyedyarnLossPct : 0

          yarnPrice = this.$utils.getFloat(this.$utils.getFloat((item.yarnPrice + certPrice + dyedYarnPrice) / (1 - dyedyarnLossPct / 100), 4) * (isNaN(item.yarnPct) ? 0 : item.yarnPct) / 100, 4)
        } else {
          dyedYarnPrice = 0
          dyedyarnLossPct = 0
        }
        totalPrice += yarnPrice
      })
      return this.$utils.getFloat(totalPrice, 4)
    },
    // 原材料成本小计
    getMaterialCostSubtotal(currentFabric) {
      let totalPrice = 0
      this.totalDataList[currentFabric].wovenLossList && this.totalDataList[currentFabric].wovenLossList.forEach(item => {
        totalPrice += item.wavenLossPct * 1 === 100 ? 0 : this.$utils.getFloat(this.getYarnCostSubtotal(currentFabric) / (1 - (item.wavenLossPct || 0) / 100), 4)
      })
      return this.$utils.getFloat(totalPrice, 4)
    },
    // 坯布成本小计
    getFabricCostSubtotal(currentFabric) {
      let totalPrice = 0
      this.totalDataList[currentFabric].wovenTechList && this.totalDataList[currentFabric].wovenTechList.forEach(item => {
        totalPrice += this.$utils.getFloat(this.getMaterialCostSubtotal(currentFabric) * 1 + (item.wovenTechPrice || 0), 4)
      })
      // 判断染色工艺中是否包含单染
      const df = this.totalDataList[currentFabric].dyeingTechList && this.totalDataList[currentFabric].dyeingTechList.find(item => {
        return item.singleDoubleDyeingName === '单染'
      })
      // 判断后整/后整损耗中是否包含底磨毛，面磨毛，底刷毛，面刷毛
      const af = this.totalDataList[currentFabric].afterfinishLossList && this.totalDataList[currentFabric].afterfinishLossList.find(item => {
        return item.afterfinishTechName && (item.afterfinishTechName.includes('底磨毛') || item.afterfinishTechName.includes('面磨毛') || item.afterfinishTechName.includes('底刷毛') || item.afterfinishTechName.includes('面刷毛'))
      });
      (af || df) && (totalPrice = totalPrice + 0.2)
      return this.$utils.getFloat(totalPrice, 4) || 0
    },
    // 生产成本小计
    getProductCostSubtotal(currentFabric) {
      let totalPrice = 0
      let dyeingPrice = 0
      let dyeingPct = 0
      let afterPrice = 0
      let afterPct = 0
      let functionPrice = 0
      let functionPct = 0
      let printingPrice = 0
      let printingPct = 0
      let isMinorPrint = false // 次要印花是否是拔印印花
      let isWeight = false
      let isPrint = false
      // 判断当前布类克重是否小于150
      if (this.getQuantityData(currentFabric).length && this.getQuantityData(currentFabric)[0].weightPerSquare < 150) {
        isWeight = true
      }
      this.totalDataList[currentFabric].afterfinishLossList && this.totalDataList[currentFabric].afterfinishLossList.forEach(item => {
        afterPrice += (item.afterfinishTechPrice || 0)
        afterPct += (item.afterfinishLossPct || 0) / 100
      })
      this.totalDataList[currentFabric].functionLossList && this.totalDataList[currentFabric].functionLossList.forEach(item => {
        functionPrice += (item.functionPrice || 0)
        functionPct += (item.functionLossPct || 0) / 100
      })

      this.totalDataList[currentFabric].majorPrintingTechList && this.totalDataList[currentFabric].majorPrintingTechList.forEach(item => {
        const printingCertPrice = (item.printingCertList && item.printingCertList.length) ? item.printingCertList.map(item => item.printingCertPrice || 0).reduce((total, item) => total + item) : 0

        const additionalPrice = (item.printingAdditionalList && item.printingAdditionalList.length) ? item.printingAdditionalList.map(item => item.additionalPrice || 0).reduce((total, item) => total + item) : 0
        if (isWeight) {
          const printPrice = item.printingPrice * (1 + 0.15)

          const minorPrice = (item.minorPrintingTechList && item.minorPrintingTechList.length) ? item.minorPrintingTechList.map(item => item.printingPrice * (1 + 0.15) || 0).reduce((total, item) => total + item) : 0
          printingPrice = this.$utils.getFloat((printPrice || 0) + additionalPrice + minorPrice + printingCertPrice, 4)
        } else {
          const minorPrice = (item.minorPrintingTechList && item.minorPrintingTechList.length) ? item.minorPrintingTechList.map(item => item.printingPrice || 0).reduce((total, item) => total + item) : 0
          printingPrice = this.$utils.getFloat((item.printingPrice || 0) + additionalPrice + minorPrice + printingCertPrice, 4)
        }

        printingPct = (item.printingLossList && item.printingLossList.length) ? (item.printingLossList[0].printingLossPct || 0) / 100 : 0
      })
      // 主要/次要印花工艺是拔印印花  染色工艺价格加2
      this.totalDataList[currentFabric].majorPrintingTechList && this.totalDataList[currentFabric].majorPrintingTechList.map(item => {
        item.minorPrintingTechList && item.minorPrintingTechList.map(mitem => {
          if (mitem.printingName === '拔印印花') {
            isMinorPrint = true
          }
        })
        if (item.printingName === '拔印印花' || isMinorPrint) {
          isPrint = true
        }
      })
      // 计算染色工艺的成本
      this.totalDataList[currentFabric].dyeingTechList && this.totalDataList[currentFabric].dyeingTechList.forEach(item => {
        const additionalPrice = (item.dyeingAdditionalList && item.dyeingAdditionalList.length) ? this.$utils.getFloat(item.dyeingAdditionalList.map(item => item.additionalContentPrice || 0).reduce((total, item) => total + item), 4) : 0
        if (isPrint) {
          dyeingPrice += this.$utils.getFloat((((item.dyeingPrice + 2) || 0) + additionalPrice) * (isNaN(item.colorPct) ? 0 : item.colorPct / 100), 4)
        } else {
          dyeingPrice += this.$utils.getFloat(((item.dyeingPrice || 0) + additionalPrice) * (isNaN(item.colorPct) ? 0 : item.colorPct / 100), 4)
        }

        dyeingPct += (item.dyeingLossList && item.dyeingLossList.length) ? this.$utils.getFloat((item.dyeingLossList[0].dyeingFinishedLossPct || 0) * (isNaN(item.colorPct) ? 0 : item.colorPct) / 10000, 4) : 0
      })
      if ((dyeingPct + afterPct + functionPct + printingPct) !== 1) {
        totalPrice += this.$utils.getFloat(this.getFabricCostSubtotal(currentFabric) * 1 + dyeingPrice + afterPrice + functionPrice + printingPrice, 4) / this.$utils.getFloat((1 - (dyeingPct + afterPct + functionPct + printingPct)), 4)
      }

      return this.$utils.getFloat(totalPrice, 4)
    },
    // 财务成本小计
    getFinanceCostSubtotal(currentFabric) {
      let totalPrice = 0
      this.totalDataList[currentFabric].paymentMethodList && this.totalDataList[currentFabric].paymentMethodList.forEach(item => {
        totalPrice += this.$utils.getFloat(this.$utils.getFloat(this.getProductCostSubtotal(currentFabric) * (1 + (this.areaData.targetProfitRate || 0) / 100), 4) * (item.paymentPct ? item.paymentPct / 100 : 0), 4)
      })
      return this.$utils.getFloat(totalPrice, 4)
    },
    // 运输成本小计
    getTransportSubtotal(currentFabric) {
      let totalPrice = 0
      this.totalDataList[currentFabric].freightList && this.totalDataList[currentFabric].freightList.forEach(item => {
        if (item.priceClauseName === 'CIF') {
          totalPrice += this.$utils.getFloat(item.freightCoefficient * 2 + this.$utils.getFloat(this.$utils.getFloat(0.5 / 100 * this.getProductCostSubtotal(currentFabric), 4) * this.$utils.getFloat((1 + this.areaData.targetProfitRate / 100), 4), 4), 4)
        } else if (item.priceClauseName === 'EXW') {
          if (this.getQuantityData(currentFabric)[0] && this.getQuantityData(currentFabric)[0].weight && item.affordExpense) {
            totalPrice += (item.affordExpense / this.getQuantityData(currentFabric)[0].weight)
          }
        } else {
          totalPrice += (item.freightCoefficient || 0)
        }
      })
      return this.$utils.getFloat(totalPrice, 4)
    },
    // 测试成本小计
    getTestCostSubtotal(currentFabric) {
      let totalPrice = 0
      let countTotalPrice = 0
      this.totalDataList[currentFabric].testCostList && this.totalDataList[currentFabric].testCostList.forEach(item => {
        totalPrice += (item.testPrice || 0) * (item.colorCount || 0)
      })
      if (this.getQuantityData(currentFabric).length && this.getQuantityData(currentFabric)[0].weight) {
        countTotalPrice = totalPrice / this.getQuantityData(currentFabric)[0].weight
      }
      return this.$utils.getFloat(countTotalPrice, 4)
    },
    // 成本合计
    getTotalCost(currentFabric) {
      return this.$utils.getFloat(this.getProductCostSubtotal(currentFabric) * 1 + this.getFinanceCostSubtotal(currentFabric) * 1 + this.getTransportSubtotal(currentFabric) * 1 + this.getTestCostSubtotal(currentFabric) * 1, 4)
    },
    // 实际销售利润率
    getActualProfitRate(currentFabric) {
      let price = this.totalDataList[currentFabric].salePrice
      // 是否退税
      if (this.totalDataList[currentFabric].taxRebateMark) {
        price = this.$utils.getFloat(price - 0 + this.getTaxRebateAmount(currentFabric), 4)
      }
      return (this.totalDataList[currentFabric].salePrice ? this.$utils.getFloat((this.$utils.getFloat((this.$utils.getFloat((price - this.getTotalCost(currentFabric)), 4) / this.totalDataList[currentFabric].salePrice), 4) * 100), 2) : '0.00')
    },
    // 退税价格
    getTaxRebateAmount(currentFabric) {
      return this.totalDataList[currentFabric].taxRebateMark && this.getProductCostSubtotal(currentFabric) && this.$utils.getFloat((this.getProductCostSubtotal(currentFabric) - this.$utils.getFloat(this.getProductCostSubtotal(currentFabric) / 1.115, 4)), 4) || 0.00
    }
  }
}
