/*
 * @Author: xj
 * @Description: 分录公共方法
 * @Date: 2021-06-28 09:20:50
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-19 16:52:30
 * @FilePath: d:\erp\src\views\customer-order\goods-orders\detail\api\detailFun.js
 */
import { queryColorNoPage, queryFlowerNoPage, ColorCodePage, FlowerCodePpage, querycolorFabricPage } from '../api/index'
import preview from '@/views/customer-order/public/components/preview'
import moreShow from '@/views/customer-order/public/components/moreShow.vue'
export const detailFun = detailFun || {
  props: {
    orderData: {
      type: Object,
      default: () => ({ detail: [] })
    }
  },
  methods: {
    getFabricColorNoCom(type) { // 选择智布色号
      console.log('omnb', type)
      this.chooseType = type || '3'
      this.chooseTitle = '选择智布色号'
      this.chooseSearch = {
        _customerId: {
          prop: 'customerId',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '客户',
          clearable: true,
          filterable: true,
          visibleChange: (value) => {
            if (value) {
              this.getCustomerSelect('stripeSpacing')
            }
          }
        },
        _factoryColorCode: {
          prop: 'factoryColorCode',
          itemType: 'input',
          itemStyle: { width: '25%' },
          label: '工厂色号',
          filterable: true,
          clearable: true
        },
        _sellYear: {
          prop: 'sellYear',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '销售年度',
          clearable: true,
          visibleChange: (value) => {
            if (value) {
              this.getYearSelect('stripeSpacing')
            }
          }
        },
        _sellQuarterly: {
          prop: 'sellQuarterly',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '销售季度',
          clearable: true,
          visibleChange: (value) => {
            if (value) {
              this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '销售季度' }, 'chooseSearch')
            }
          }
        },
        _id: {
          prop: 'id',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '色板单号',
          clearable: true,
          filterable: true,
          visibleChange: (value) => {
            if (value) {
              this.getSwatchesNoSelect()
            }
          }
        },
        _fabricColorNo: { // pm
          prop: 'fabricColorNo',
          itemType: 'input',
          itemStyle: { width: '25%' },
          clearable: true,
          filterable: true,
          label: '智布色号'
        },
        _customerColorName: {
          prop: 'customerColorName',
          itemType: 'input',
          itemStyle: { width: '25%' },
          clearable: true,
          label: '客户颜色'
        },
        _operate: {
          itemType: 'operate',
          submitHandle: params => {
            const data = this.$utils.deepClone(params)
            if (data.id) {
              data.colorPlateOrderCodes = []
              data.colorPlateOrderCodes.push(data.id)
              delete data.id
            }
            this.searchFormDatas = data
            this.getFabricColorNo(data)
          },
          submitText: '查询',
          resetHandle: () => {
            this.searchFormDatas = {}
          }
        }
      }
      this.chooseColumns = {
        _customerName: {
          prop: 'customerName',
          label: '客户',
          minWidth: '180'
        },
        _colorModelTypeName: {
          prop: 'colorModelTypeName',
          label: '色板类型',
          width: '180',
          showOverflowTooltip: true
        },
        _fabricColorNo: {
          prop: 'fabricColorNo',
          label: '智布色号',
          width: '180',
          showOverflowTooltip: true
        },
        _customerColorName: {
          prop: 'customerColorName',
          label: '客户颜色',
          width: '180',
          showOverflowTooltip: true
        },
        _odDyeName: {
          prop: 'odDyeName',
          label: '单双染',
          width: '180',
          showOverflowTooltip: true
        },
        _sellYearss: {
          prop: 'sellYearss',
          label: '年份-季度',
          width: '180',
          showOverflowTooltip: true,
          formater: (scope) => {
            const om = scope.row.sellYear ? scope.row.sellYear + '年' : ''
            const op = scope.row.sellQuarterly ? scope.row.sellQuarterly + '季度' : ''
            return om + '' + op
          }
        },
        _endProductWeight: {
          prop: 'endProductWeight',
          label: '成品克重（g/m²）',
          width: '180',
          showOverflowTooltip: true
        },
        _lstLightSourceName: {
          prop: 'lstLightSourceName',
          label: '1st对色光源',
          width: '180',
          showOverflowTooltip: true
        },
        _twondLightSourceName: {
          prop: 'twondLightSourceName',
          label: '2nd对色光源',
          width: '180',
          showOverflowTooltip: true
        },
        _threerdLightSourceName: {
          prop: 'threerdLightSourceName',
          label: '3rd对色光源',
          width: '180',
          showOverflowTooltip: true
        },
        _yarnInfos: {
          prop: 'yarnInfos',
          label: '用纱信息',
          width: '180',
          showOverflowTooltip: true,
          components: {
            moreShow
          },
          componentsOptions: {
            type: 'yarnInfos'
          }
        },
        _yarnSupplier: {
          prop: 'yarnSupplier',
          label: '纱供应商',
          width: '180',
          showOverflowTooltip: true
        },
        _factoryColorCode: {
          prop: 'factoryColorCode',
          label: '工厂色号',
          width: '180',
          showOverflowTooltip: true
        },
        _rgb: {
          prop: 'rgb',
          label: '颜色与预览',
          width: '180',
          showOverflowTooltip: true,
          formater: (scope) => {
            if (scope.row.rgb) {
              return `<div style="width: 100px; height: 30px;background-color: rgb(${scope.row.rgb})"></div>`
            } else {
              return ''
            }
          }
        }
      }
      this.isshowCloth = true
      this.choosePagination = {
        currentChange: val => {
          this.getFabricColorNo({ pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
        },
        sizeChange: val => {
          this.$set(this.choosePagination, 'currentPage', 1)
          this.getFabricColorNo({ pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
        }
      }
      this.getFabricColorNo()
    },
    // 智布色号列表
    async getFabricColorNo(data = {}) {
      this.loading = true
      const res = await ColorCodePage(data)
      if (this.$pub.responseValidate(res)) {
        res.data.list.forEach((it) => {
          if (it.yarnInfos && it.yarnInfos.length) {
            it.yarnInfos = it.yarnInfos.join(',')
          } else {
            it.yarnInfos = ''
          }
        })
        this.tableData = res.data.list || []
      }
      this.choosePagination = {
        ...this.choosePagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageSizes: [10, 20, 30, 40, 50, 100]
      }
      this.loading = false
    },
    // 智布花号
    getFlowerNoCom() {
      this.tableData = []
      this.chooseType = '2'
      this.chooseTitle = '选择智布花号'
      this.chooseSearch = {
        _customerId: {
          prop: 'customerId',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '客户',
          clearable: true,
          filterable: true,
          visibleChange: (value) => {
            if (value) {
              this.getCustomerSelect('allContent')
            }
          }
        },
        _orgId: {
          prop: 'orgId',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '销售团队',
          clearable: true,
          filterable: true,
          visibleChange: (value) => {
            if (value) {
              this.getSellTeamSelect('allContent')
            }
          }
        },
        _brandId: { // pm
          prop: 'brandId',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '品牌',
          clearable: true,
          filterable: true,
          visibleChange: (value, val) => {
            if (value) {
              this.getBrandSelect()
            }
          }
        },
        _id: {
          prop: 'id',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '印花单号',
          clearable: true,
          filterable: true,
          visibleChange: (value) => {
            if (value) {
              this.getPrintApplyNoSelect()
            }
          }
        },
        _fabricFlowerNo: {
          prop: 'fabricFlowerNo',
          itemType: 'input',
          itemStyle: { width: '25%' },
          clearable: true,
          label: '智布花号'
        },
        _printColorName: {
          prop: 'printColorName',
          itemType: 'input',
          itemStyle: { width: '25%' },
          clearable: true,
          label: '印花颜色名'
        },
        _operate: {
          itemType: 'operate',
          submitHandle: params => {
            const data = this.$utils.deepClone(params)
            if (data.id) {
              data.soOrderCodes = []
              data.soOrderCodes.push(data.id)
              delete data.id
            }
            this.searchFormDatas = data
            this.getFlowerNo(data)
          },
          submitText: '查询',
          resetHandle: () => {
            this.searchFormDatas = {}
          }
        }
      }
      this.chooseColumns = {
        _customerName: {
          prop: 'customerName',
          label: '客户',
          minWidth: '180'
        },
        _sellerTeamName: {
          prop: 'sellerTeamName',
          label: '销售团队',
          width: '180',
          showOverflowTooltip: true
        },
        _fabricFlowerNo: {
          prop: 'fabricFlowerNo',
          label: '智布花号',
          width: '180',
          showOverflowTooltip: true
        },
        _brandName: {
          prop: 'brandName',
          label: '品牌',
          width: '180',
          showOverflowTooltip: true
        },
        _compositionName: {
          prop: 'compositionName',
          label: '成份',
          width: '180',
          showOverflowTooltip: true
        },
        _printColorName: {
          prop: 'printColorName',
          label: '印花颜色名',
          width: '180',
          showOverflowTooltip: true
        },
        _printCraftName: {
          prop: 'printCraftName',
          label: '印花工艺',
          width: '180',
          showOverflowTooltip: true
        },
        _lstLightSourceName: {
          prop: 'lstLightSourceName',
          label: '1st对色光源',
          width: '180',
          showOverflowTooltip: true
        },
        _twondLightSourceName: {
          prop: 'twondLightSourceName',
          label: '2nd对色光源',
          width: '180',
          showOverflowTooltip: true
        },
        _printColorDesign: {
          prop: 'printColorDesign',
          label: '印花图案',
          width: '180',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.printColorDesign ? `<img  style="width:auto;height: 36px;" src='${scope.row.printColorDesign}' />` : ''
          }
        }
      }
      this.isshowCloth = true
      this.choosePagination = {
        currentChange: val => {
          this.getFlowerNo({ pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
        },
        sizeChange: val => {
          this.$set(this.choosePagination, 'currentPage', 1)
          this.getFlowerNo({ pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
        }
      }
      this.getFlowerNo()
    },
    // 智布花号列表
    async getFlowerNo(data = {}) {
      const res = await FlowerCodePpage(data)
      if (this.$pub.responseValidate(res)) {
        this.tableData = res.data.list || []
      }
      this.choosePagination = {
        ...this.choosePagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageSizes: [10, 20, 30, 40, 50, 100]
      }
    },
    // LED申请
    getLDFromData() {
      this.tableData = []
      this.chooseType = '4'
      this.chooseTitle = 'LD申请'
      this.chooseSearch = {
        _customerId: {
          prop: 'customerId',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '客户',
          clearable: true,
          filterable: true,
          visibleChange: (value) => {
            if (value) {
              this.getCustomerSelect('allContent')
            }
          }
        },
        _sellerTeamId: {
          prop: 'sellerTeamId',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '销售团队',
          clearable: true,
          filterable: true,
          visibleChange: (value) => {
            if (value) {
              this.getSellTeamSelect('sellerTeamId')
            }
          }
        },
        _sellYear: {
          prop: 'sellYear',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '销售年度',
          clearable: true,
          visibleChange: (value) => {
            if (value) {
              this.getYearSelect('allContent')
            }
          }
        },
        _sellQuarterly: {
          prop: 'sellQuarterly',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '销售季度',
          clearable: true,
          visibleChange: (value, val) => {
            if (value) {
              this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '销售季度' }, 'chooseSearch')
            }
          }
        },
        _odDyeId: { // pm
          prop: 'odDyeId',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '单双染',
          clearable: true,
          filterable: true,
          visibleChange: (value) => {
            if (value) {
              this.singleDoubleDyeDataUp()
            }
          }
        },
        _id: {// pm
          prop: 'id',
          itemType: 'input',
          itemStyle: { width: '25%' },
          label: '色板单号',
          clearable: true
        },
        _customerColorName: {
          prop: 'customerColorName',
          itemType: 'input',
          itemStyle: { width: '25%' },
          clearable: true,
          label: '客户颜色'
        },
        _operate: {
          itemType: 'operate',
          submitHandle: params => {
            this.searchFormDatas = params
            this.getLDList(params)
          },
          submitText: '查询',
          resetHandle: () => {
            this.searchFormDatas = {}
          }
        }
      }
      this.chooseColumns = {
        _id: {
          prop: 'id',
          label: 'LD单号',
          minWidth: '180'
        },
        _customerColorName: {
          prop: 'customerColorName',
          label: '客户颜色',
          minWidth: '180'
        },
        _customerName: {
          prop: 'customerName',
          label: '客户',
          minWidth: '180'
        },
        _sellerTeamName: {
          prop: 'sellerTeamName',
          label: '销售团队',
          width: '180',
          showOverflowTooltip: true
        },
        _odDyeName: {
          prop: 'odDyeName',
          label: '单双染',
          width: '180',
          showOverflowTooltip: true
        },
        _orgName3: {
          prop: 'orgName3',
          label: '年份-季度',
          width: '180',
          showOverflowTooltip: true,
          formater: (scope) => {
            const om = scope.row.sellYear ? scope.row.sellYear + '年' : ''
            const op = scope.row.sellQuarterly ? scope.row.sellQuarterly + '季度' : ''
            return om + '' + op
          }
        },
        _endProductWeight: {
          prop: 'endProductWeight',
          label: '成品克重(g/m²)',
          width: '180',
          showOverflowTooltip: true
        },
        _rgb: {
          prop: 'rgb',
          label: '颜色与预览',
          width: '180',
          showOverflowTooltip: true,
          formater: (scope) => {
            if (scope.row.rgb) {
              return `<div style="width: 100px; height: 30px;background-color: rgb(${scope.row.rgb})"></div>`
            } else {
              return ''
            }
          }
        }

      }
      this.isshowCloth = true
      this.choosePagination = {
        currentChange: val => {
          this.getLDList({ pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
        },
        sizeChange: val => {
          this.$set(this.choosePagination, 'currentPage', 1)
          this.getLDList({ pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
        }
      }
      this.getLDList()
    },
    // LED申请列表
    async getLDList(data = {}) {
      const res = await queryColorNoPage(data)
      if (this.$pub.responseValidate(res)) {
        this.tableData = res.data.list || []
      }
      this.choosePagination = {
        ...this.choosePagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageSizes: [10, 20, 30, 40, 50, 100]
      }
    },
    // 印花SO
    getPrintingSo() {
      this.tableData = []
      this.chooseType = '5'
      this.chooseTitle = '印花SO'
      this.chooseSearch = {
        _customerId: {
          prop: 'customerId',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '客户',
          clearable: true,
          filterable: true,
          visibleChange: (value) => {
            if (value) {
              this.getCustomerSelect('allContent')
            }
          }
        },
        _orgId: {
          prop: 'orgId',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '销售团队',
          clearable: true,
          filterable: true,
          visibleChange: (value) => {
            if (value) {
              this.getSellTeamSelect('allContent')
            }
          }
        },
        _brandId: { // pm
          prop: 'brandId',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '品牌',
          clearable: true,
          filterable: true,
          visibleChange: (value, val) => {
            if (value) {
              this.getBrandSelect()
            }
          }
        },
        _id: {// pm
          prop: 'id',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '印花单号',
          clearable: true,
          filterable: true,
          visibleChange: (value) => {
            if (value) {
              this.getPrintApplyNoSelect()
            }
          }
        },
        _printColorName: {
          prop: 'printColorName',
          itemType: 'input',
          itemStyle: { width: '25%' },
          clearable: true,
          label: '印花颜色'
        },
        _printCraftId: {
          prop: 'printCraftId',
          itemType: 'select',
          itemStyle: { width: '25%' },
          label: '印花工艺',
          clearable: true,
          valueType: 'object',
          filterable: true,
          visibleChange: (value) => {
            if (value) {
              this.getPrintCraftSelect('chooseSearch')
            }
          }
        },
        _operate: {
          itemType: 'operate',
          submitHandle: params => {
            const data = this.$utils.deepClone(params)
            if (data.printCraftId) {
              data.printCraftId = data.printCraftId.id
            }
            this.searchFormDatas = data
            this.getPrintingList(data)
          },
          submitText: '查询',
          resetHandle: () => {
            this.searchFormDatas = {}
          }
        }
      }
      this.chooseColumns = {
        _id: {
          prop: 'id',
          label: '印花申请单号',
          minWidth: '180'
        },
        _printColorName: {
          prop: 'printColorName',
          label: '印花颜色名',
          minWidth: '180'
        },
        _customerName: {
          prop: 'customerName',
          label: '客户',
          minWidth: '180'
        },
        _orgName: {
          prop: 'orgName',
          label: '销售团队',
          width: '180',
          showOverflowTooltip: true
        },
        _brandName: {
          prop: 'brandName',
          label: '品牌',
          width: '180',
          showOverflowTooltip: true
        },
        _printCraftName: {
          prop: 'printCraftName',
          label: '印花工艺',
          width: '180',
          showOverflowTooltip: true
        },
        _lstLightSourceName2: {
          prop: 'lstLightSourceName',
          label: '成品克重(g/m²)',
          width: '180',
          showOverflowTooltip: true
        },
        _printColorDesign: {
          prop: 'printColorDesign',
          label: '颜色与预览',
          width: '180',
          showOverflowTooltip: true,
          formater: (scope) => {
            if (scope.row.printColorDesign) {
              return `<div style="width: 100px; height: 30px;background-color: rgb(${scope.row.printColorDesign})"></div>`
            } else {
              return ''
            }
          }
        }

      }
      this.isshowCloth = true
      this.choosePagination = {
        currentChange: val => {
          this.getPrintingList({ pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
        },
        sizeChange: val => {
          this.$set(this.choosePagination, 'currentPage', 1)
          this.getPrintingList({ pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
        }
      }
      this.getPrintingList()
    },
    // 印花SO
    async getPrintingList(data = {}) {
      const res = await queryFlowerNoPage(data)
      if (this.$pub.responseValidate(res)) {
        this.tableData = res.data.list || []
      }
      this.choosePagination = {
        ...this.choosePagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageSizes: [10, 20, 30, 40, 50, 100]
      }
    },
    // 大货SKU V2.02

    // SKU列表 V2.02
    getSKUOne(com = []) {
      this.chooseTitle = '选择色布/印花布编码'
      this.chooseType = '8'
      this.chooseSearch = {
        _customerColorName: {
          prop: 'customerColorName',
          itemType: 'input',
          clearable: true,
          label: '客户颜色'
        },
        _operate: {
          style: { 'margin': '0 0 0 15px' },
          itemType: 'operate',
          submitHandle: params => {
            let data = this.$utils.deepClone(params)
            data = { ...data, ...com }
            this.chooseParams = data
            this.getcolorFabric2(data)
          },
          submitText: '查询',
          resetHandle: () => {}
        }
      }
      this.chooseColumns = {
        _colorFabricCode: {
          prop: 'colorFabricCode',
          label: '色布/印花布编码',
          minWidth: '90'
        },
        _customerColorName: {
          prop: 'customerColorName',
          label: '客户颜色',
          width: '180',
          showOverflowTooltip: true
        },
        _colorPreview: {
          prop: 'colorPreview',
          label: '颜色预览',
          width: '180',
          showOverflowTooltip: true,
          formater: (scope) => {
            if (scope.row.colorPreview) {
              return `<div style="width: 100px; height: 30px;background-color: rgb(${scope.row.colorPreview})"></div>`
            } else {
              return ''
            }
          }
        },
        _space: {
          prop: 'space',
          label: '条纹间距',
          width: '180',
          showOverflowTooltip: true,
          components: {
            preview
          },
          componentsOptions: {
            propName: 'spacing'
          },
          formater: (scope) => {
            let spacing = ''
            const arr = []
            scope.row.spacing && scope.row.spacing.length && scope.row.spacing.forEach(item => {
              arr.push(item.colorName + item.height + 'cm')
            })
            spacing = arr.join(',')
            return spacing || ''
          },
          style: {
            color: 'rgb(24, 144, 255)',
            cursor: 'pointer'
          }
        },
        _printPic: {
          prop: 'printPic',
          label: '印花图案',
          width: '400',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.printPic ? `<img style="width:auto;height: 36px;" class="printPic" src='${scope.row.printPic}' />` : ''
          }
        }
      }
      this.isshowCloth = true
      this.choosePagination = {
        currentChange: val => {
          this.getcolorFabric2({ ...this.chooseParams, pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
        },
        sizeChange: val => {
          this.$set(this.choosePagination, 'currentPage', 1)
          this.getcolorFabric2({ ...this.chooseParams, pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
        }
      }
      this.getcolorFabric2(com)
    },

    // 获取坯布编码列表数据
    async getcolorFabric2(data = {}) {
      this.loading = true
      const res = await querycolorFabricPage({ ...data })
      console.log('omnnsssss', res)
      if (this.$pub.responseValidate(res)) {
        res.data && res.data.list.map(item => {
          item.fabrication = item.cloth.label // 布类
          item.ingredients = item.ingredient.label // 成份
          item.ingreradio = item.ingredient.label + ' ' + item.radio // 成份比例
        })
        console.log('omnnsssss22222', res.data.list)
        this.tableData = res.data.list || []
      }
      this.choosePagination = {
        ...this.choosePagination,
        dataTotal: res.data.total || 0,
        currentPage: res.data.pageNum,
        pageNum: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageSizes: [10, 20, 30, 40, 50, 100]
      }
      this.loading = false
    },

    // 判断有无印花工艺  1:智布色号 2:LD申请 3:TBA 4 指定花灰
    isShowIsPrintCraft(data, index, iserror = true) {
      console.log('xiaoji74444', data, index, iserror)
      let pm = true
      if (data && data.length && data.length > index) {
        const printCraft = data[index].printCraft
        if (printCraft && printCraft.indexOf('[') !== -1) {
          const printCraftArr = JSON.parse(printCraft)
          if (printCraftArr.length === 0) { pm = false }
        } else if (!printCraft) { pm = false }
      } else { pm = false }
      return pm
    },
    // 颜色信息类型
    iscolorInfoType(data) {
      if (['智布色号', '色板申请'].includes(data.colorInfoType.label)) {
        return data.colorNo
      } else if (['TBA'].includes(data.colorInfoType.label)) {
        return data.colorLevel ? data.colorLevel.value : ''
      } else if (['指定花灰'].includes(data.colorInfoType.label)) {
        return data.supplie ? data.supplie.value + data.colorNo2 : ''
      }
    },
    // 条纹信息
    isstripeSpacing(data) {
      let stripeSpacing = ''
      const cm = data.stripeSpacing || []
      cm.length && cm.forEach((it, index) => {
        stripeSpacing += it.height + '-' + it.colorNo + it.colorValue
      })
      return stripeSpacing
    },
    // 添加或保存颜色交期数据 设置文字唯一值
    // 说明
    // 1  根据客户布号+客户单号+客户款号+客户颜色（中英）+
    // 2  颜色信息
    // 3  印花信息
    // 4  条纹信息
    getTextCode(data) {
      const codeText = data.customerClothNumber + '-' + data.customerOrderCode + '-' + data.styleNumber + data.customerColor + '-' + data.customerColorEn
      const codecolor = data.colorInfoType && data.colorInfoType.label ? this.iscolorInfoType(data) : ''
      const info = data.flowerInfoType && data.flowerInfoType.label ? (data.flowerInfoType.label + '-' + data.flowerNo) : ''
      const stripeSpacingText = this.isstripeSpacing(data)
      return codeText + codecolor + info + stripeSpacingText
    },
    // 侧边栏保存
    sidebarOk(it) {
      let om = true
      if (!it.quantityDelivery.length) {
        this.$message({ type: 'error', message: '请至少添加一条数量交期' })
        om = false
      }
      return om
    },

    // 当前页所有的分录
    isShowFrom(data, it) {
      const Tim = this.getTextCode(it)
      const FromIndex = []
      // const FromLin = data.colorQuantityDeliverySummary
      // const cm = FromLin && FromLin.colorInfo || ''
      data && data.length && data.forEach((im, ic) => {
        if (Tim === this.getTextCode(im)) { FromIndex.push(ic) }
      })
      if (FromIndex.length) {
        this.$message({ type: 'error', message: `第${FromIndex[0] + 1}分录有重复,不能添加相同的客户单号，款号，客户布号，客户颜色，客户颜色(英文)，智布色号，智布花号，条纹间距` })
        return false
      } else {
        return true
      }
    },
    // 下拉单位涮选
    getUnitsSel(res) {
      const resIndex1 = res.filter((v, index) => ['码', '磅', '米'].includes(v.label))
      const resIndex2 = res.filter((v, index) => ['千克'].includes(v.label))
      const ck = [...resIndex2, ...resIndex1]
      return ck
    },

    // 加密字段formater处理 样板
    encryptedFieldFormater(field, currencyCode) {
      let tempField
      if ((field + '').indexOf('***') !== -1) {
        tempField = currencyCode + field
      } else {
        tempField = field ? currencyCode + this.$utils.priceFormat(this.$utils.getFloat(field, 2)) : ''
      }
      return tempField
    },

    // 是否结算
    isShowSettlement(data = '') {
      return data && data.isSettlement
    },
    // 字段隐藏 是否包含间 提花
    infoText(type, data) {
      const pu = []
      type.forEach((it) => { if (it.indexOf(data) !== -1) { pu.push('im') } })
      return !pu.length
    },
    // getPrintingSo
    // 字段是否展示
    getShow(tim, type) {
      if (type === '色布/印花布编码') {
        // return !!this.editAll.greyClothCode
      }
      if (type === '所属衫身' || type === '配色要求') {
        // 该字段只有在，当前产品列表中，同时存在款号相同的衫身和下栏两种成衣部位，且当前产品序号所对应的产品成衣部位为下栏时，才显示
        // const data = this.orderData.detail.find(item => { item.garmentPart.label === '衫身' })
        // return (this.orderData.detail[this.rowIndex - 1].garmentPart.label === '下栏') && (data && data.styleNumber === this.orderData.detail[this.rowIndex - 1].styleNumber)
      }
      if (type === '条纹间距') {
        return tim.includes('间')
      }
      if (type === '颜色信息') { // 织造花型 不包含 提花 且 不包含 间 时，才显示
        return (!tim.includes('提花') && !tim.includes('间'))
      }
    }

  }

}
