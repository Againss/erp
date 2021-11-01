<template>
  <div class="stockPumping">
    <div class="header-top">
      <span>库存抽用</span>
      <el-button v-if="isEdit" type="primary" size="mini" @click="addClick">新增</el-button>
    </div>
    <div class="page-table">
      <cs-custom-table
        ref="stockPumping"
        tooltip-effect="dark"
        :header-cell-style="headerCellStyle"
        :columns="columns"
        :data-source="dataSource"
        :operates="operates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 库存抽用弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="stockPumpingPop" :options="stockPumpingPopOptions" />
    </div>
    <!-- 选择弹窗 -->
    <div class="pop">
      <choose-pop
        :loading="loading"
        :title="chooseTitle"
        :form-datas="chooseformDatas"
        :search-data="chooseSearch"
        :pagination="choosePagination"
        :columns="chooseColumns"
        :is-visible.sync="isshowCloth"
        :table-data="tableData"
        @closePop="closePop"
        @savePop="savePop"
        @saveListRow="saveListRow"
      />
    </div>
  </div>
</template>

<script>
import choosePop from '@/views/customer-order/public/components/choosePop'
import techRquire from '@/views/customer-order/public/components/tech-require'
import preview from '@/views/customer-order/public/components/preview'
import { PublicCustomer } from '@/views/customer-order/public/index'
import { queryYarnPage, queryGreyPage, querycolorFabricPage } from '../api/index'
export default {
  name: 'StockPumping',
  components: {
    choosePop
  },
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    orderData: {
      type: Object
    },
    syncDataHandle: {
      type: Function
    }
  },
  data() {
    // table表头颜色
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    const columns = {
      _pumpingTypeInfo: {
        prop: 'pumpingTypeInfo',
        label: '抽用类型',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.pumpingTypeInfo && scope.row.pumpingTypeInfo.label ? scope.row.pumpingTypeInfo.label : ''
        }
      },
      _billNo: {
        prop: 'billNo',
        label: '单据-编号',
        showOverflowTooltip: true
      },
      _remark: {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      }
    }
    const operatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          this.popHandle('编辑库存抽用')
          this.billNo = scope.row.billNo
          this.setFormDatas({ ...scope.row, index: scope.$index })
        }
      },
      {
        label: '刪除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: scope => {
          console.log(scope.$index)
          this.$confirm('确认删除该条库存抽用数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              this.dataSource.splice(scope.$index, 1)
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const operates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      isResetOperateWidth: true,
      dataSource: operatesData
    }
    const pagination = {}
    const stockPumpingContent = {
      _pumpingTypeInfo: {
        prop: 'pumpingTypeInfo',
        itemType: 'select',
        label: '抽用类型',
        clearable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        change: (value, form, formDatas, setFormDatas) => {
          this.$set(this.stockPumpingPopOptions.formDatas, 'pumpingTypeInfo', value)
          if (formDatas.billNo) {
            this.$set(this.stockPumpingPopOptions.formDatas, 'billNo', '')
          }
        },
        dataSource: [
          {
            label: '抽坯',
            value: '抽坯'
          },
          {
            label: '抽纱',
            value: '抽纱'
          },
          {
            label: '抽成品',
            value: '抽成品'
          }
        ]
      },
      _billNo: {
        prop: 'billNo',
        itemType: 'input',
        label: '单据-编号',
        className: 'cursorHandel',
        placeholder: '点击选择单据-编号',
        clearable: true,
        rules: [commonChangeReg],
        clear: (form, formDatas, setFormDatas, scope) => {
          this.$set(this.stockPumpingPopOptions.formDatas, 'billNo', '')
        },
        focus: (value, form, formDatas, setFormDatas) => {
          if (!formDatas.pumpingTypeInfo || !formDatas.pumpingTypeInfo.label) {
            this.$message({ type: 'warning', message: '请先选择抽用类型' })
            return
          }
          if (formDatas.pumpingTypeInfo.label === '抽坯') {
            this.chooseTitle = '选择备坯单'
            this.chooseSearch = {
              _code: {
                prop: 'code',
                itemType: 'input',
                itemStyle: { width: '25%' },
                label: '备坯单号',
                clearable: true
              },
              _greyClothCode: {
                prop: 'greyClothCode',
                itemType: 'input',
                itemStyle: { width: '25%' },
                clearable: true,
                label: '坯布SKU'
              },
              _clothId: {
                prop: 'clothId',
                itemType: 'select',
                itemStyle: { width: '25%' },
                label: '布类',
                filterable: true,
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                clearable: true,
                visibleChange: (value) => {
                  if (value) {
                    this.getClothSelect('grey')
                  }
                }
              },
              _garmentPartId: {
                prop: 'garmentPartId',
                itemType: 'select',
                itemStyle: { width: '25%' },
                label: '成衣部位',
                // valueType: 'object',
                clearable: true,
                visibleChange: (value) => {
                  if (value) {
                    this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '成衣部位' }, 'garmentPart')
                  }
                }
              },
              _customerId: {
                prop: 'customerId',
                itemType: 'select',
                itemStyle: { width: '25%' },
                label: '客户',
                filterable: true,
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                clearable: true,
                visibleChange: (value) => {
                  if (value) {
                    this.getCustomerSelect()
                  }
                }
              },
              _brandId: {
                prop: 'brandId',
                itemType: 'select',
                itemStyle: { width: '25%' },
                clearable: true,
                filterable: true,
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                label: '品牌',
                visibleChange: (value) => {
                  if (value) {
                    this.getBrandSelect()
                  }
                }
              },
              _salesTeamId: {
                prop: 'salesTeamId',
                itemType: 'select',
                itemStyle: { width: '25%' },
                label: '销售团队',
                clearable: true,
                filterable: true,
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                visibleChange: (value) => {
                  if (value) {
                    this.getSellTeamSelect('grey')
                  }
                }
              },
              _operate: {
                itemType: 'operate',
                submitHandle: params => {
                  console.log(params)
                  this.searchFormDatas = params
                  this.getQueryGreyPage(params)
                },
                submitText: '查询',
                resetHandle: () => {
                  this.searchFormDatas = {}
                }
              }
            }
            this.chooseColumns = {
              _code: {
                prop: 'code',
                label: '备坯单号',
                width: '180',
                showOverflowTooltip: true
              },
              _customer: {
                prop: 'customer',
                label: '客户',
                minWidth: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.customer && scope.row.customer.label ? scope.row.customer.label : ''
                }
              },
              _brand: {
                prop: 'brand',
                label: '品牌',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.brand && scope.row.brand.label ? scope.row.brand.label : ''
                }
              },
              _salesTeam: {
                prop: 'salesTeam',
                label: '销售团队',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.salesTeam && scope.row.salesTeam.label ? scope.row.salesTeam.label : ''
                }
              },
              _clothId: {
                prop: 'clothId',
                label: '布类',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.cloth && scope.row.cloth.label ? scope.row.cloth.label : ''
                }
              },
              _garmentPart: {
                prop: 'garmentPart',
                label: '成衣部位',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.garmentPart && scope.row.garmentPart.label ? scope.row.garmentPart.label : ''
                }
              },
              _greyClothCode: {
                prop: 'greyClothCode',
                label: '坯布SKU',
                width: '180',
                showOverflowTooltip: true
              },
              _suggestWidth: {
                prop: 'suggestWidth',
                label: '幅宽(cm)',
                width: '180',
                showOverflowTooltip: true
              },
              _weightBefore: {
                prop: 'weightBefore',
                label: '克重(洗前)',
                width: '180',
                showOverflowTooltip: true
              },
              _dyeCraft: {
                prop: 'dyeCraft',
                label: '染整类型',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  if (scope.row.dyeCraft) {
                    const dataList = JSON.parse(scope.row.dyeCraft)
                    let dyeCraft = ''
                    const arr = []
                    dataList && dataList.length && dataList.forEach(item => {
                      arr.push(item.name)
                    })
                    dyeCraft = arr.join(',')
                    return dyeCraft || ''
                  }
                }
              },
              _printCraft: {
                prop: 'printCraft',
                label: '印花工艺',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  if (scope.row.printTech) {
                    const dataList = JSON.parse(scope.row.printTech)
                    let printTech = ''
                    const arr = []
                    dataList && dataList.length && dataList.forEach(item => {
                      arr.push(item.label)
                    })
                    printTech = arr.join(',')
                    return printTech || ''
                  }
                }
              }
              // _yarnUsed: {
              //   prop: 'yarnUsed',
              //   label: '用纱信息',
              //   width: '180',
              //   showOverflowTooltip: true
              // },
              // _rgb: {
              //   prop: 'rgb',
              //   label: '颜色与预览',
              //   width: '180',
              //   showOverflowTooltip: true,
              //   formater: (scope) => {
              //     if (scope.row.rgb) {
              //       return `<div style="width: 100px; height: 30px;background-color: rgb(${scope.row.rgb})"></div>`
              //     } else {
              //       return ''
              //     }
              //   }
              // }
            }
            this.choosePagination = {
              currentChange: val => {
                this.getQueryGreyPage({ pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
              },
              sizeChange: val => {
                this.$set(this.choosePagination, 'currentPage', 1)
                this.getQueryGreyPage({ pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
              }
            }
            this.getQueryGreyPage()
          } else if (formDatas.pumpingTypeInfo.label === '抽纱') {
            this.chooseTitle = '选择备纱单'
            this.chooseSearch = {
              _code: {
                prop: 'code',
                itemType: 'input',
                itemStyle: { width: '25%' },
                label: '备纱单号',
                clearable: true
              },
              _yarnCode: {
                prop: 'yarnCode',
                itemType: 'input',
                itemStyle: { width: '25%' },
                clearable: true,
                label: '纱线SKU'
              },
              _supplierYarnCode: {
                prop: 'supplierYarnCode',
                itemType: 'input',
                itemStyle: { width: '25%' },
                label: '供应商纱线编码',
                clearable: true
              },
              _certificateId: {
                prop: 'certificateId',
                itemType: 'select',
                itemStyle: { width: '25%' },
                label: '证书要求',
                filterable: true,
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                clearable: true,
                visibleChange: (value) => {
                  if (value) {
                    this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '证书要求' }, 'certificate')
                  }
                }
              },
              _customerId: {
                prop: 'customerId',
                itemType: 'select',
                itemStyle: { width: '25%' },
                label: '客户',
                filterable: true,
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                clearable: true,
                visibleChange: (value) => {
                  if (value) {
                    this.getCustomerSelect()
                  }
                }
              },
              _brandId: {
                prop: 'brandId',
                itemType: 'select',
                itemStyle: { width: '25%' },
                clearable: true,
                filterable: true,
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                label: '品牌',
                visibleChange: (value) => {
                  if (value) {
                    this.getBrandSelect()
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
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                visibleChange: (value) => {
                  if (value) {
                    this.getSellTeamSelect('yarn')
                  }
                }
              },
              _operate: {
                itemType: 'operate',
                submitHandle: params => {
                  this.searchFormDatas = params
                  this.getQueryYarnPage(params)
                },
                submitText: '查询',
                resetHandle: () => {
                  this.searchFormDatas = {}
                }
              }
            }
            this.chooseColumns = {
              _code: {
                prop: 'code',
                label: '备纱单号',
                width: '180',
                showOverflowTooltip: true
              },
              _customer: {
                prop: 'customer',
                label: '客户',
                minWidth: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.customer && scope.row.customer.label ? scope.row.customer.label : ''
                }
              },
              _brand: {
                prop: 'brand',
                label: '品牌',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.brand && scope.row.brand.label ? scope.row.brand.label : ''
                }
              },
              _sellerTeam: {
                prop: 'sellerTeam',
                label: '销售团队',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.sellerTeam && scope.row.sellerTeam.label ? scope.row.sellerTeam.label : ''
                }
              },
              _type: {
                prop: 'type',
                label: '纱类',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  let type = ''
                  if (scope.row.type) {
                    if (parseInt(scope.row.type) === 2) {
                      type = '组合纱线'
                    } else if (parseInt(scope.row.type) === 1) {
                      type = '化学纤维'
                    } else if (parseInt(scope.row.type) === 0) {
                      type = '天然纤维'
                    }
                  }
                  return type
                }
              },
              _yarnCode: {
                prop: 'yarnCode',
                label: '纱线SKU',
                width: '180',
                showOverflowTooltip: true
              },
              _yarnName: {
                prop: 'yarnName',
                label: '纱名',
                width: '180',
                showOverflowTooltip: true
              },
              _yarnProperty: {
                prop: 'yarnProperty',
                label: '纱属性',
                width: '180',
                showOverflowTooltip: true
              },
              _certificate: {
                prop: 'certificate',
                label: '证书要求',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.certificate && scope.row.certificate.label ? scope.row.certificate.label : ''
                }
              },
              _supplier: {
                prop: 'supplier',
                label: '供应商',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.supplier && scope.row.supplier.label ? scope.row.supplier.label : ''
                }
              },
              _supplierYarnCode: {
                prop: 'supplierYarnCode',
                label: '供应商纱线编码',
                width: '180',
                showOverflowTooltip: true
              }
              // _yarnUsed: {
              //   prop: 'yarnUsed',
              //   label: '用纱信息',
              //   width: '180',
              //   showOverflowTooltip: true
              // },
              // _rgb: {
              //   prop: 'rgb',
              //   label: '颜色与预览',
              //   width: '180',
              //   showOverflowTooltip: true,
              //   formater: (scope) => {
              //     if (scope.row.rgb) {
              //       return `<div style="width: 100px; height: 30px;background-color: rgb(${scope.row.rgb})"></div>`
              //     } else {
              //       return ''
              //     }
              //   }
              // }
            }
            this.choosePagination = {
              currentChange: val => {
                this.getQueryYarnPage({ pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
              },
              sizeChange: val => {
                this.$set(this.choosePagination, 'currentPage', 1)
                this.getQueryYarnPage({ pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
              }
            }
            this.getQueryYarnPage()
          } else if (formDatas.pumpingTypeInfo.label === '抽成品') {
            this.chooseTitle = '选择色布/印花编码'
            this.chooseSearch = {
              _code: {
                prop: 'code',
                itemType: 'input',
                itemStyle: { width: '25%' },
                label: '色/花布SKU',
                clearable: true
              },
              _fabrication: {
                prop: 'fabrication',
                itemType: 'select',
                itemStyle: { width: '25%' },
                clearable: true,
                filterable: true,
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                label: '布类',
                visibleChange: (value, val) => {
                  if (value) {
                    this.getClothSelect('colorPrint')
                  }
                },
                dataSource: []
              },
              _printTech: {
                prop: 'printTech',
                itemType: 'select',
                itemStyle: { width: '25%' },
                label: '印花工艺',
                valueType: 'object',
                clearable: true,
                filterable: true,
                multiple: true,
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                visibleChange: (value) => {
                  if (value) {
                    this.getPrintCraftSelect('TechId')
                  }
                }
              },
              _customerColorName: {
                prop: 'customerColorName',
                itemType: 'input',
                itemStyle: { width: '25%' },
                clearable: true,
                label: '客户颜色'
              },
              _fabricWidth: {
                prop: 'fabricWidth',
                itemType: 'input',
                itemStyle: { width: '25%' },
                label: '成品幅宽',
                clearable: true
              },
              _fabricWeight: {
                prop: 'fabricWeight',
                itemType: 'input',
                itemStyle: { width: '25%' },
                label: '成品克重',
                clearable: true
              },
              _yarnCountFineness: {
                prop: 'yarnCountFineness',
                itemType: 'select',
                valueType: 'object',
                itemStyle: { width: '25%' },
                clearable: true,
                filterable: true,
                label: '纱支/细度',
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                visibleChange: (value) => {
                  if (value) {
                    this.getYarnSelect('combine')
                  }
                },
                dataSource: []
              },
              _yarnSilkType: {
                prop: 'yarnSilkType',
                itemType: 'select',
                itemStyle: { width: '25%' },
                label: '纱类/丝类',
                valueType: 'object',
                clearable: true,
                filterable: true,
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                visibleChange: (value) => {
                  if (value) {
                    this.getYarnTypeSelect('combine')
                  }
                }
              },
              _ingredients: {
                prop: 'ingredients',
                itemType: 'select',
                itemStyle: { width: '25%' },
                label: '面料成份',
                valueType: 'object',
                clearable: true,
                filterable: true,
                className: 'commonRemoteSearch',
                placeholder: '输入文字模糊查询',
                visibleChange: (value) => {
                  if (value) {
                    this.getCompositionSelect()
                  }
                }
              },
              _dyeTech: {
                prop: 'dyeTech',
                itemType: 'select',
                itemStyle: { width: '25%' },
                style: { 'width': '82%' },
                label: '染整工艺',
                clearable: true,
                valueType: 'object',
                title: true,
                components: { techRquire },
                componentsOptions: {
                  checkValList: [],
                  ok: (checkValList) => {
                    this.$set(this.chooseSearch._dyeTech.componentsOptions, 'checkValList', checkValList)
                    this.chooseformDatas = { dyeTech: checkValList }
                  }
                }
              },
              _operate: {
                itemType: 'operate',
                submitHandle: params => {
                  if (!params.ingredients) {
                    params.ingredients = null
                  }
                  if (!params.yarnCountFineness) {
                    params.yarnCountFineness = null
                  }
                  if (!params.yarnSilkType) {
                    params.yarnSilkType = null
                  }
                  params.printTechId = []
                  params.printTech && params.printTech.forEach(Pitem => {
                    if (Pitem && Pitem.value) {
                      params.printTechId.push(Pitem.value)
                    }
                  })
                  const newParams = params
                  newParams.dyeTech && newParams.dyeTech.forEach((item, index) => {
                    item.value = item.uuid
                    item.label = item.type
                  })
                  this.searchFormDatas = params
                  this.getcolorFabric(params)
                },
                submitText: '查询',
                resetHandle: () => {
                  this.$set(this.chooseSearch._dyeTech.componentsOptions, 'checkValList', [])
                  this.chooseformDatas = {}
                  this.searchFormDatas = {}
                }
              }
            }
            this.chooseColumns = {
              _colorFabricCode: {
                prop: 'colorFabricCode',
                label: '色布/印花布编码',
                minWidth: '160',
                showOverflowTooltip: true
              },
              _sourceOrder: {
                prop: 'sourceOrder',
                label: '来源单号',
                minWidth: '180',
                showOverflowTooltip: true
              },
              _cloth: {
                prop: 'cloth',
                label: '布类',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.cloth && scope.row.cloth.label ? scope.row.cloth.label : ''
                }
              },
              _ingredient: {
                prop: 'ingredient',
                label: '成份',
                minWidth: '160',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.ingredient && scope.row.ingredient.label ? scope.row.ingredient.label : ''
                }
              },
              _yarnFineness: {
                prop: 'yarnFineness',
                label: '纱支/细度',
                minWidth: '160',
                showOverflowTooltip: true
              },
              _yarnWireCategory: {
                prop: 'yarnWireCategory',
                label: '纱类/丝类',
                minWidth: '160',
                showOverflowTooltip: true
              },
              _fabricWidth: {
                prop: 'fabricWidth',
                label: '成品幅宽',
                width: '180',
                showOverflowTooltip: true
              },
              _fabricWeight: {
                prop: 'fabricWeight',
                label: '成品克重（g/m²）',
                width: '180',
                showOverflowTooltip: true
              },
              _dyeTech: {
                prop: 'dyeTech',
                label: '染整工艺',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  if (scope.row.dyeTech) {
                    const dataList = JSON.parse(scope.row.dyeTech)
                    let dyeTech = ''
                    const arr = []
                    dataList && dataList.length && dataList.forEach(item => {
                      arr.push(item.name)
                    })
                    dyeTech = arr.join(',')
                    return dyeTech || ''
                  }
                }
              },
              _printTech: {
                prop: 'printTech',
                label: '印花工艺',
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  if (scope.row.printTech) {
                    const dataList = JSON.parse(scope.row.printTech)
                    let printTech = ''
                    const arr = []
                    dataList && dataList.length && dataList.forEach(item => {
                      arr.push(item.label)
                    })
                    printTech = arr.join(',')
                    return printTech || ''
                  }
                }
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
              _spacing: {
                prop: 'spacing',
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
                width: '180',
                showOverflowTooltip: true,
                formater: (scope) => {
                  return scope.row.printPic ? `<img class="printPic" src='${scope.row.printPic}' />` : ''
                }
              }
            }
            this.choosePagination = {
              currentChange: val => {
                this.getcolorFabric({ pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
              },
              sizeChange: val => {
                this.$set(this.choosePagination, 'currentPage', 1)
                this.getcolorFabric({ pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
              }
            }
            this.getcolorFabric()
          }
          this.chooseType = '3'
          this.isshowCloth = true
          event.target.blur()
        }
      },
      _remark: {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 100,
        trim: (value) => {
          return value
        }
      }
    }
    const stockPumpingPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增库存抽用',
      okText: '保存',
      ok: params => {
        if (this.stockPumpingPopOptions.title === '新增库存抽用') {
          let repeat = false
          this.dataSource.length && this.dataSource.forEach(item => {
            if (item.billNo === params.billNo && item.pumpingTypeInfo.label === params.pumpingTypeInfo.label) {
              repeat = true
            }
          })
          if (repeat) {
            this.$message.error('库存抽用重复，请重新添加')
            return
          }
          this.dataSource.push(params)
        } else {
          const arr = this.dataSource.length && this.dataSource.filter(item => {
            return item.billNo !== this.billNo
          }) || []
          let repeat = false
          arr.length && arr.forEach(item => {
            if (item.billNo === params.billNo && item.pumpingTypeInfo.label === params.pumpingTypeInfo.label) {
              repeat = true
            }
          })
          if (repeat) {
            this.$message.error('库存抽用重复，请重新添加')
            return
          }
          this.dataSource.splice(params.index, 1, params)
        }
        this.popHandle()
      },
      cancel: params => {
        this.popHandle()
      },
      formDatas: {},
      formOptions: {},
      content: stockPumpingContent
    }
    return {
      loading: false,
      chooseTitle: '', // 选择弹窗标题
      chooseType: '', // 选择弹窗类型 1:智布色号 2:智布花号 3:条纹间距智布色号 4:单据-编号
      chooseSearch: {},
      chooseColumns: {},
      chooseformDatas: { dyeTech: [] },
      choosePagination: {}, // 弹窗页码
      tableData: [],
      isshowCloth: false,
      headerCellStyle,
      columns,
      dataSource: [],
      operatesData,
      operates,
      pagination,
      stockPumpingContent,
      stockPumpingPopOptions,
      billNo: ''
    }
  },
  watch: {
    isEdit: {
      handler(val, oldVal) {
        if (val) {
          this.editChange()
        } else {
          this.changeOptionStatus()
        }
      },
      deep: true,
      immediate: true
    },
    orderData: {
      handler(val, oldVal) {
        if (val !== null && val && Object.keys(val).length) {
          this.dataSource = val.stockPumpingInfo && val.stockPumpingInfo.length ? this.$utils.deepClone(val.stockPumpingInfo) : []
        }
      },
      deep: true,
      immediate: true
    },
    dataSource: {
      handler(val, oldVal) {
        this.syncDataHandle('stockPumping', val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    editChange() {
      this.operates = {
        label: '操作',
        width: '120',
        fixed: 'right',
        isResetOperateWidth: true,
        dataSource: this.operatesData
      }
    },
    changeOptionStatus() {
      this.operates = null
    },
    addClick() {
      this.popHandle('新增库存抽用')
      this.$set(this.stockPumpingPopOptions, 'content', this.stockPumpingContent)
      this.$set(this.stockPumpingPopOptions, 'formDatas', {})
    },
    // 点击编辑返显数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.stockPumpingPopOptions, 'formDatas', params)
      }, 0)
    },
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'certificate') {
          this.$set(this.chooseSearch._certificateId, 'dataSource', res)
        } else if (type === 'garmentPart') {
          this.$set(this.chooseSearch._garmentPartId, 'dataSource', res)
        }
      })
    },
    // 品牌商下拉
    getBrandSelect() {
      this.getBrand().then(res => {
        this.$set(this.chooseSearch._brandId, 'dataSource', res)
        // if (type === 'grey') {
        //   this.$set(this.chooseSearch._brandId, 'dataSource', res)
        // } else if (type === 'yarn') {
        //   this.$set(this.chooseSearch._brandId, 'dataSource', res)
        // }
      })
    },
    // 获取客户下拉
    getCustomerSelect() {
      this.getCustomer().then(res => {
        this.$set(this.chooseSearch._customerId, 'dataSource', res)
      })
    },
    // 获取销售团队下拉
    getSellTeamSelect(type) {
      this.getSellTeam({ functionTag: 'SAL' }).then(res => {
        if (type === 'yarn') {
          this.$set(this.chooseSearch._sellerTeamId, 'dataSource', res)
        } else if (type === 'grey') {
          this.$set(this.chooseSearch._salesTeamId, 'dataSource', res)
        }
      })
    },
    // 获取布类下拉
    getClothSelect(type) {
      this.getCloth().then(res => {
        if (type === 'colorPrint') {
          this.$set(this.chooseSearch._fabrication, 'dataSource', res)
        } else if (type === 'grey') {
          this.$set(this.chooseSearch._clothId, 'dataSource', res)
        }
      })
    },
    // 印花工艺下拉
    getPrintCraftSelect(type) {
      this.getPrintCraft().then(res => {
        this.$set(this.chooseSearch._printTech, 'dataSource', res)
      })
    },
    // 纱支、细度下拉 type: yarn纱支 fineness细度 combine组合
    getYarnSelect(type) {
      const GenericType = { type, enabled: 'Y' }
      this.getYarn(GenericType).then(res => {
        this.$set(this.chooseSearch._yarnCountFineness, 'dataSource', res)
      })
    },
    // 纱类、丝类下拉 type: yarn纱类 silk丝类 combine组合
    getYarnTypeSelect(type) {
      // debugger
      this.getYarnType({ type }).then(res => {
        console.log(res)
        this.$set(this.chooseSearch._yarnSilkType, 'dataSource', res)
      })
    },
    // 成份下拉
    getCompositionSelect() {
      this.getComposition().then(res => {
        this.$set(this.chooseSearch._ingredients, 'dataSource', res)
      })
    },
    // 库存抽用获取备纱单
    async getQueryYarnPage(data = {}) {
      this.loading = true
      const res = await queryYarnPage(data)
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
      this.loading = false
    },
    // 库存抽用获取备坯单
    async getQueryGreyPage(data = {}) {
      this.loading = true
      const res = await queryGreyPage(data)
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
      this.loading = false
    },
    // 获取坯布编码列表数据
    async getcolorFabric(data = {}) {
      this.loading = true
      const res = await querycolorFabricPage(data)
      res.data && res.data.list.map((item) => {
        item.fabrication = item.cloth.label // 布类
        item.ingredients = item.ingredient.label // 成份
        item.ingreradio = item.ingredient.label + ' ' + item.radio // 成份比例
      })
      this.tableData = res.data.list || []
      // }
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
    // 保存色号、花号pop弹窗
    savePop(params) {
      console.log(params)
      if (params) {
        this.$set(this.stockPumpingPopOptions.formDatas, 'billNo', params)
        this.isshowCloth = false
      } else {
        this.$message({
          message: '请选择一条记录',
          type: 'warning'
        })
      }
    },
    // 返回整条数据 不要可以删除
    saveListRow(params) {
      console.log(params)
    },
    // 关闭选择弹窗
    closePop() {
      this.isshowCloth = false
    },
    // 库存抽用显隐
    popHandle(val) {
      this.$set(this.stockPumpingPopOptions, 'visible', !this.stockPumpingPopOptions.visible)
      if (val) {
        this.$set(this.stockPumpingPopOptions, 'title', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .stockPumping {
    background: #ffffff;
    margin: 0 20px;
    .header-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 15px 20px;
    }
    /deep/ .cursorHandel {
      input {
        cursor: pointer;
      }
    }
    /deep/ .table tr {
      background: #ffffff;
    }
    /deep/ .el-table td {
      border-bottom: 1px solid #dfe6ec;
    }
  }
</style>
