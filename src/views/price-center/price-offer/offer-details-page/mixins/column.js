/*
 * @Date: 2021-05-25 17:16:37
 * @Author: Againss
 * @LastEditTime: 2021-06-02 14:19:13
 * @LastEditors: Againss
 * @Descripttion:
 */
import recalculation from '../../components/recalculation.vue'
export const viewColumns = {
  data() {
  // 数量表格表头
    const quantityColumns = [
      {
        prop: 'ydweight',
        label: '数量(yd)',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property]
        }
      },
      {
        prop: 'lbweight',
        label: '数量(lb)',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property]
        }
      },
      {
        prop: 'weight',
        label: '数量(kg)',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property]
        }
      },
      {
        prop: 'clothWidth',
        label: '边至边幅宽(in)',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.numRecursion(scope.row[scope.column.property] * 1)
        }
      },
      {
        prop: 'weightPerSquare',
        label: '克重(g/㎡)',
        minWidth: '90',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.numRecursion(scope.row[scope.column.property] * 1)
        }
      }
    ]

    // 短纤基础表头信息
    const spunBaseColumns = [
      {
        prop: 'yarnsBranchName',
        label: '纱支',
        minWidth: '90',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnsTypeName',
        label: '纱类',
        minWidth: '90',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionName',
        label: '成分/组合成份',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionProportionName',
        label: '成分占比',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'spinMethodName',
        label: '纺纱方法',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'cardingMethodName',
        label: '梳棉方法',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'colorFlexibilityName',
        label: '染色适应性',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'colorMarkName',
        label: '色号',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnBrandName',
        label: '品牌',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnPrice',
        label: '纱价格',
        minWidth: '70',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
        }
      }
    ]
    // 长丝基础表头信息
    const filamentBaseColumns = [
      {
        prop: 'finenessName',
        label: '细度',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionName',
        label: '成分/组合成分',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'glossName',
        label: '光泽度',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'functionName',
        label: '功能',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'goodsName',
        label: '丝类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'colorName',
        label: '颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnBrandName',
        label: '品牌',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnPrice',
        label: '纱价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
        }
      }
    ]
    // 纱线操作部分内容
    const yarnOperationColumns = [
      {
        prop: 'yarnCertList',
        label: '纱线证书',
        width: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          return `${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property].map(item => item.yarnCertName).join(';') : ''}`
        }
      },
      {
        prop: 'yarnCertificate',
        label: '纱线证书价格合计',
        width: '150',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.yarnCertList && scope.row.yarnCertList.length !== 0) ? '￥' + scope.row.yarnCertList.map(item => item.yarnCertPrice).reduce((total, item) => total + item) : '￥' + 0
        }
      },
      {
        prop: 'yarnPct',
        label: '纱线占比',
        minWidth: '80',
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      },
      // {
      //   prop: 'isDyeing',
      //   label: '染纱',
      //   minWidth: '80',
      //   formater: scope => {
      //     return scope.row[scope.column.property] === 1 ? '是' : scope.row[scope.column.property] === 0 ? '否' : ''
      //   }
      // },
      {
        prop: 'yarnDyeingList',
        label: '染纱颜色',
        width: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          return `<span>${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property].map(item => item.dyedYarnColorName).join(';') : ''}</span>`
        }
      },
      {
        prop: 'dyedYarnPrice',
        label: '染纱价格',
        width: '150',
        align: 'right',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.yarnDyeingList && scope.row.yarnDyeingList.length !== 0) ? '￥' + scope.row.yarnDyeingList[0].dyedYarnPrice : '￥' + 0
        }
      },
      {
        prop: 'yarnDyeingLossList',
        label: '染纱损耗百分比',
        width: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return `<span >${(scope.row.yarnDyeingList && scope.row.yarnDyeingList.length && scope.row.yarnDyeingList[0][scope.column.property] && scope.row.yarnDyeingList[0][scope.column.property].length !== 0) ? scope.row.yarnDyeingList[0][scope.column.property][0].dyedyarnLossPct + '%' : ''}</span>`
        }
      }
    ]
    // 纱线显示短纤内容
    const yarnSpunColumns = [
      ...spunBaseColumns,
      ...yarnOperationColumns
    ]
    // 纱线显示长丝内容
    const yarnFilamentColumns = [
      ...filamentBaseColumns,
      ...yarnOperationColumns
    ]
    // 染纱短纤弹出框基础表头
    const dyeingYarnSpunBaseColumns = [
      {
        prop: 'yarnsBranchName',
        label: '纱支',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionName',
        label: '成分/组合成分',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'dyedYarnColorName',
        label: '染纱颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricGradeName',
        label: '布类等级',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'dyedYarnPrice',
        label: '染纱价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
        }
      }
    ]
    // 染纱长丝弹出框基础表头
    const dyeingYarnFilamentBaseColumns = [
      {
        prop: 'finenessName',
        label: '细度',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionName',
        label: '成分/组合成分',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'dyedYarnColorName',
        label: '染纱颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricGradeName',
        label: '布类等级',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'dyedYarnPrice',
        label: '染纱价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
        }
      }
    ]
    // 染纱损耗表头内容
    const yarnDyeingLossBaseColumns = [
      {
        prop: 'dyedYarnColorName',
        label: '染纱颜色',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'compositionName',
        label: '成分/组合成分',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'minWeight',
        label: '重量区间（千克）',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minWeight !== null ? scope.row.minWeight : ''}${scope.row.minWeight !== null && scope.row.maxWeight !== null ? '~' : ''}${scope.row.maxWeight !== null ? scope.row.maxWeight : ''}</span>`
        }
      // formater: (scope) => {
      //   return (scope.row['minWeight'] || '') + '~' + (scope.row['maxWeight'] || '')
      // }
      },
      {
        prop: 'dyedyarnLossPct',
        label: '染纱损耗百分比',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      }
    ]

    // 原材料成本织损耗基础表头
    const materialBaseColumns = [
      {
        prop: 'damaskModellingName',
        label: '织花造型',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'wavenLossPct',
        label: '织损耗百分比',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      }
    ]

    // 坯布成本织工基础表头
    const clothBaseColumns = [
      {
        prop: 'fabricName',
        label: '布类',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'yarnsBranchName',
        label: '纱支/细度',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => {
        // return `<span>${scope.row[scope.column.property] || '无纱支'}</span> | <span>${scope.row.finenessName || '无细度'}</span>`
          if (scope.row[scope.column.property] && scope.row.finenessName) {
            return `<span>${scope.row[scope.column.property]}</span> | <span>${scope.row.finenessName}</span>`
          } else if (scope.row[scope.column.property]) {
            return scope.row[scope.column.property]
          } else {
            scope.row.finenessName
          }
        }
      },
      {
        prop: 'wovenTechPrice',
        label: '织工价格',
        minWidth: '120',
        // showOverflowTooltip: true,
        components: {
          recalculation
        },
        componentsOptions: {
          isFlag: false,
          prop: 'wovenTechPrice',
          text: '底磨毛、面磨毛、底刷毛、面刷毛、单染，织工增加'
        }
      // formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]

    // 生产成本染色工艺弹出框基础表头
    const productDyeingBaseColumns = [
      {
        prop: 'dyeingProcess',
        label: '染色工艺',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const dyeingType = {
            'W': '洗水',
            'B': '漂白',
            'H': '半漂',
            'D': '染色'
          }
          // const type = 'W'
          return dyeingType[scope.row.dyeingProcess]
        }
      },
      {
        prop: 'singleDoubleDyeingName',
        label: '单双染',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'colorDepthName',
        label: '颜色深浅',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricGradeName',
        label: '布类等级',
        minWidth: '80',
        showOverflowTooltip: true
      },
      // {
      //   prop: 'dyeingPrice',
      //   label: '染色工艺价格',
      //   minWidth: '120',
      //   showOverflowTooltip: true,
      //   formater: (scope) => {
      //     return scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      //   }
      // }
      {
        prop: 'dyeingPrice',
        label: '染色工艺价格',
        minWidth: '120',
        components: {
          recalculation
        },
        componentsOptions: {
          isFlag: false,
          prop: 'dyeingPrice',
          text: '拔印印花，染色价格增加'
        }
      // showOverflowTooltip: true,
      // formater: scope => scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
      }
    ]
    // 生产成本染色工艺弹出框操作表头
    const productDyeingOperatesColumns = [
      {
        prop: 'dyeingAdditionalList',
        label: '附加内容',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.dyeingProcess === 'D' ? `${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property][0].additionalContent : ''}` : `<span style="color: #666;">染色工艺为染色时才可有数据</span>`
        }
      },
      {
        prop: 'additionalContentPrice',
        label: '附加内容价格',
        width: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.dyeingAdditionalList && scope.row.dyeingAdditionalList.length !== 0) ? '￥' + scope.row.dyeingAdditionalList[0].additionalContentPrice : '￥' + 0
        }
      },
      {
        prop: 'colorPct',
        label: '颜色占比',
        width: '100',
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      },
      {
        prop: 'dyeingLossList',
        label: '染色损耗百分比',
        width: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return `<span>${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property][0].dyeingFinishedLossPct + '%' : ''}</span>`
        }
      }
    ]

    // 生产成本染色工艺页面显示表头
    const productDyeingViewColumns = [
      ...productDyeingBaseColumns,
      ...productDyeingOperatesColumns
    ]
    // 生产成本染色损耗弹出框基础表头
    const productDyeingLossBaseColumns = [
      {
        prop: 'dyeingTechType',
        label: '染色工艺',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const dyeingType = {
            'W': '洗水',
            'B': '漂白',
            'H': '半漂',
            'D': '染色'
          }
          return dyeingType[scope.row.dyeingTechType]
        }
      },
      {
        prop: 'colorDepthName',
        label: '颜色深浅',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'maxWeight',
        label: '重量区间（千克）',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minWeight !== null ? scope.row.minWeight : ''}${scope.row.minWeight !== null && scope.row.maxWeight !== null ? '~' : ''}${scope.row.maxWeight !== null ? scope.row.maxWeight : ''}</span>`
        }
      // formater: scope => {
      //   return `<span>${scope.row.minWeight || ''}~${scope.row.maxWeight || ''}</span>`
      // }
      },
      {
        prop: 'dyeingFinishedLossPct',
        label: '染色损耗百分比',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      }
    ]
    // 生产成本后整/后整损耗弹出框基础表头
    const productPostIntegrationLossBaseColumns = [
      {
        prop: 'afterfinishTechName',
        label: '后整工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'fabricGradeName',
        label: '布类等级',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'afterfinishTechPrice',
        label: '后整工艺价格',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
        }
      },
      {
        prop: 'afterfinishLossPct',
        label: '后整工艺损耗百分比',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'

      }
    ]
    // 生产成本功能/功能损耗弹出框基础表头
    const productFunctionLossBaseColumns = [
      {
        prop: 'functionName',
        label: '功能',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'tagsType',
        label: '吊牌',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const type = { 'N': '无', 'D': '国内吊牌', 'T': '第三方吊牌' }
          return type[scope.row.tagsType]
        }
      },
      {
        prop: 'funTestMiddleInfo',
        label: '测试标准',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] ? scope.row[scope.column.property].map(item => item.testStandardName).join(',') : ''
        }
      },
      {
        prop: 'functionPrice',
        label: '功能价格',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
        }
      },
      {
        prop: 'functionLossPct',
        label: '功能损耗百分比',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      }
    ]
    const otherProductMainPrintingViewColumns = [
      {
        prop: 'printingName',
        label: '印花工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'minPrintingareaPercent',
        label: '印花面积百分比区间',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minPrintingareaPct !== null ? scope.row.minPrintingareaPct + '%' : ''}${scope.row.minPrintingareaPct !== null && scope.row.maxPrintingareaPct !== null ? '~' : ''}${scope.row.maxPrintingareaPct !== null ? scope.row.maxPrintingareaPct + '%' : ''}</span>`
        }
      },
      {
        prop: 'additionalPrice',
        label: '印花颜色数量区间（个）',
        minWidth: '200',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minPrintingNumber !== null ? scope.row.minPrintingNumber : ''}${scope.row.minPrintingNumber !== null && scope.row.maxPrintingNumber !== null ? '~' : ''}${scope.row.maxPrintingNumber !== null ? scope.row.maxPrintingNumber : ''}</span>`
        }
      },
      {
        prop: 'printingPrice',
        label: '印花工艺价格',
        minWidth: '120',
        components: {
          recalculation
        },
        componentsOptions: {
          isFlag: false,
          prop: 'printingPrice',
          text: '克重小于150，印花工艺价格增加'
        }
      },
      {
        prop: 'printingCertList',
        label: '印花证书',
        width: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return `<span>${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property].map(item => item.printingCertName).join(';') : ''}</span>`
        }
      },
      {
        prop: 'yarnCertificate',
        label: '印花证书价格合计',
        width: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (scope.row.printingCertList && scope.row.printingCertList.length !== 0) ? '￥' + scope.row.printingCertList.map(item => item.printingCertPrice).reduce((total, item) => total + item) : '￥' + 0
        }
      },
      {
        prop: 'printingLossList',
        label: '印花损耗百分比',
        width: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return `<span>${(scope.row[scope.column.property] && scope.row[scope.column.property].length !== 0) ? scope.row[scope.column.property][0].printingLossPct + '%' : ''}</span>`
        }
      },
      {
        prop: 'printingAdditionalList',
        label: '闪粉价格',
        width: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          const item = this.majorPrintingTechList[0].printingAdditionalList && this.majorPrintingTechList[0].printingAdditionalList.find(item => {
            return item.printingAdditionalType === 'G'
          })
          return `<span>${item ? '￥' + item.additionalPrice : ''}</span>`
        }
      },
      {
        prop: 'printingAdditionalList1',
        label: '荧光价格',
        width: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          const item = this.majorPrintingTechList[0].printingAdditionalList && this.majorPrintingTechList[0].printingAdditionalList.find(item => {
            return item.printingAdditionalType === 'F'
          })
          return `<span >${item ? '￥' + item.additionalPrice : ''}</span>`
        }
      },
      {
        prop: 'additionalPrice2',
        label: '凸桨价格',
        width: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          const item = this.majorPrintingTechList[0].printingAdditionalList && this.majorPrintingTechList[0].printingAdditionalList.find(item => {
            return item.printingAdditionalType === 'C'
          })
          return `<span >${item ? '￥' + item.additionalPrice : ''}</span>`
        }
      },
      {
        prop: 'additionalPrice3',
        label: '夜光桨价格',
        width: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          const item = this.majorPrintingTechList[0].printingAdditionalList && this.majorPrintingTechList[0].printingAdditionalList.find(item => {
            return item.printingAdditionalType === 'L'
          })
          return `<span>${item ? '￥' + item.additionalPrice : ''}</span>`
        }
      }
    ]
    // 生产成本次要印花基础表头
    const otherProductSecondaryPrintingBaseColumns = [
      {
        prop: 'printingName',
        label: '印花工艺',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'printingPrice',
        label: '印花工艺价格',
        minWidth: '120',
        components: {
          recalculation
        },
        componentsOptions: {
          isFlag: false,
          prop: 'printingPrice',
          text: '克重小于150，印花工艺价格增加'
        }
      }
    ]

    // 财务成本付款条件弹出框基础表头
    const financePaymentBaseColumns = [
      {
        prop: 'paymentMethodName',
        label: '付款条件',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'paymentPct',
        label: '付款条件百分比',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] ? scope.row[scope.column.property] + '%' : 0 + '%'
      }
    ]

    // 运输成本运费弹出框国内基础表头
    const transportFreighDomesticBaseColumns = [
      {
        prop: 'transportWayName',
        label: '运输方式',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'startPlaceName',
        label: '起运地',
        showOverflowTooltip: true
      },
      {
        prop: 'destinationPlaceName',
        label: '目的地',
        showOverflowTooltip: true
      },
      {
        prop: 'minWeight',
        label: '重量区间（千克）',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minWeight !== null ? scope.row.minWeight : ''}${scope.row.minWeight !== null && scope.row.maxWeight !== null ? '~' : ''}${scope.row.maxWeight !== null ? scope.row.maxWeight : ''}</span>`
        }
      // formater: scope => {
      //   return `<span>${scope.row.minWeight || ''}~${scope.row.maxWeight || ''}</span>`
      // }
      },
      {
        prop: 'freightCoefficient',
        label: '运费系数',
        showOverflowTooltip: true
      }
    ]
    // 运输成本运费国内弹出框表头
    const transportFreightDomesticViewColumns = [
      {
        prop: 'freightType',
        label: '运费类型',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => '国内运费'
      },
      ...transportFreighDomesticBaseColumns
    ]
    // 运输成本运费国内弹出框分页
    // const transportFreightDomesticPagination = {
    //   // currentPage: 1,
    //   pageSizes: [5],
    //   layout: 'total, prev, pager, next',
    //   // dataTotal: dataSource.length,
    //   currentChange: val => {
    //     this.getFreightPage({ ...this.$refs.freight.$children[0].formDatas, pageSize: this.transportFreightDomesticPagination.pageSize || 5, pageNum: val })
    //   },
    //   sizeChange: val => {
    //     //
    //     this.$set(this.spunPagination, 'currentPage', 1)
    //     this.getFreightPage({ pageNum: 1, pageSize: val })
    //   }
    // }
    const NexwColumn = [
      {
        prop: 'freightType',
        label: '运费类型',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => '国际运费'
      },
      {
        prop: 'priceClauseName',
        label: '价格条款',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'costBearMethod',
        label: '费用承担方式',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'affordExpense',
        label: '承担费用(RMB)',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'freightCoefficient',
        label: '运费系数',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (this.quantityData && this.quantityData[0].weight && scope.row.affordExpense) {
            console.log(scope.row.affordExpense, this.quantityData && this.quantityData[0].weight)
            return this.$utils.getFloat(scope.row.affordExpense / ((this.quantityData && this.quantityData[0].weight)), 4)
          } else {
            return '自动计算'
          }
        }
        // formater: (scope) => {
        //   if (this.freightCoefficient) {
        //     // const freightCoefficient = 0
        //     // freightCoefficient = this.$utils.getFloat(scope.row.affordExpense/((this.quantityData && this.quantityData[0].weight)),4)
        //     return this.freightCoefficient
        //   } else {
        //     return '自动计算'
        //   }
        // }

      }
    ]
    // 运输成本运费弹出框国际基础表头
    const transportFreighInternationalBaseColumns = [
      {
        prop: 'priceClauseName',
        label: '价格条款',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'transportWayName',
        label: '运输方式',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'startPlaceName',
        label: '起运港',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'destinationPlaceName',
        label: '目的港',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'transitDirectType',
        label: '中转/直航',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] === 'T' ? '中转' : scope.row[scope.column.property] === 'D' ? '直航' : ''
        }
      },
      {
        prop: 'tightnessType',
        label: '松/紧',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] === 'L' ? '松' : scope.row[scope.column.property] === 'T' ? '紧' : ''
        }
      },
      // {
      //   prop: 'minWeight',
      //   label: '重量区间（千克）',
      //   showOverflowTooltip: true,
      //   formater: scope => {
      //     return `<span>${scope.row.minWeight || ''}~${scope.row.maxWeight || ''}</span>`
      //   }
      // },
      // {
      //   prop: 'freightCoefficient',
      //   label: '运费系数',
      //   minWidth: '80',
      //   showOverflowTooltip: true
      // }
      {
        prop: 'freightCoefficient',
        label: '运费系数',
        minWidth: '80',
        // showOverflowTooltip: true
        components: {
          recalculation
        },
        componentsOptions: {
          isFlag: false,
          prop: 'freightCoefficient',
          text: '价格条款为CIF时，运费系数增加',
          productCostSubtotal: 'total',
          targetProfitRate: 0,
          priceClauseName: 'CIF',
          weight: 0
        }
      }
    ]
    // 运输成本运费国际弹出框表头
    const transportFreightInternationalViewColumns = [
      {
        prop: 'freightType',
        label: '运费类型',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => '国际运费'
      },
      ...transportFreighInternationalBaseColumns
    ]
    // 运输成本无运费表头
    const transportNoFreighColumns = [
      {
        prop: 'freightType',
        label: '运费类型',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => '免运费'
      },
      {
        prop: 'freightCoefficient',
        label: '运费系数',
        showOverflowTooltip: true
      }
    ]

    // 测试成本测试方式弹出框基础表头
    const testTestBaseColumns = [
      {
        prop: 'brandName',
        label: '品牌/最终买家',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'notaryIndustryName',
        label: '公证行',
        showOverflowTooltip: true
      },
      {
        prop: 'testWay',
        label: '测试方式',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] === 'F' ? '全套测试' : '附加测试'
        }
      },
      {
        prop: 'colorCount',
        label: '颜色个数',
        showOverflowTooltip: true
      },
      {
        prop: 'testPrice',
        label: '测试价格',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? '￥' + scope.row[scope.column.property] : '￥' + 0
        }
      }
    ]

    return {
      quantityColumns,
      yarnSpunColumns,
      yarnFilamentColumns,
      dyeingYarnSpunBaseColumns,
      dyeingYarnFilamentBaseColumns,
      yarnDyeingLossBaseColumns,
      materialBaseColumns,
      clothBaseColumns,
      productDyeingViewColumns,
      productDyeingLossBaseColumns,
      productPostIntegrationLossBaseColumns,
      productFunctionLossBaseColumns,
      otherProductMainPrintingViewColumns,
      otherProductSecondaryPrintingBaseColumns,
      financePaymentBaseColumns,
      transportFreightDomesticViewColumns,
      transportFreightInternationalViewColumns,
      transportNoFreighColumns,
      testTestBaseColumns,
      NexwColumn
    }
  }
}
