/**
* @Description: 订单要求页签 数据分发及融合
* @author Roman
* @date 2021-04-23 14:25:22
* @edit 2021-04-23 14:25:22
*/
<template>
  <div ref="orderDetailCom" class="order-detail-index">
    <!-- 基本信息 -->
    <baseInfo ref="baseInfoData" :rule="orderData._rule" :status="status" :is-edit="isEdit" :data="baseInfoData" :version-info="orderData.versionInfo" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" />

    <div class="order-info">
      <div class="order-header">
        <span>订单信息</span>
      </div>
      <div class="order-content">
        <div class="info-left">
          <div v-if="isEdit" class="top">
            <el-button size="small" type="primary" @click="addOrderHandle">新增</el-button>
          </div>
          <div class="bottom">
            <!--左侧分录模块-->
            <cs-custom-form
              ref="leftForm"
              :options="leftFormOptions"
              :data-source="dataSource"
            />
            <cs-custom-popsearch :options="popOptions" @close="popClose" />
          </div>
        </div>
        <div class="info-right">
          <!-- 右侧头部 -->
          <code-info :is-edit="getEdit" :row-index="rowIndex" :rule="orderData._rule" :status="status" :data="codeInfoData" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" />
          <!-- 参板信息 -->
          <!--          <reference :is-edit="isEdit" :row-index="rowIndex" :rule="orderData._rule" :status="status" :data="referenceData" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" />-->
          <!-- 产品信息 -->
          <product ref="productData" :is-edit="getEdit" :row-index="rowIndex" :rule="orderData._rule" :status="status" :data="productData" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" />
          <!-- 原料信息 -->
          <material :is-edit="getEdit" :row-index="rowIndex" :rule="orderData._rule" :status="status" :data="materialData" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" />
          <!-- 面料成份比例 -->
          <fabric-composition :is-edit="isEdit" :row-index="rowIndex" :material-data="materialData" :rule="orderData._rule" :status="status" :data="fabricElement" :sync-moudle-data-handle="syncMoudleDataHandle" :set-parent-data-handle="setParentDataHandle" />

          <!-- 数量交期 -->
          <quantityDelivery
            :row-index="rowIndex"
            :rule="orderData._rule"
            :currency-seq="currencySeq"
            :tax-rate="taxRate"
            :suggest-width-unit="suggestWidthUnit"
            :suggest-width="suggestWidth"
            :weight-before="weightBefore"
            :grey-cloth-code="greyClothCode"
            :add-color-quantity-delivery="addColorQuantityDelivery"
            :currency-code="currencyCode"
            :status="status"
            :is-edit="getEdit"
            :data="quantityDeliveryData"
            :sync-moudle-data-handle="syncMoudleDataHandle"
            :get-show-add-btn="getShowAddBtn"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fabricComposition from './fabric-composition'
import baseInfo from './base-info'
import codeInfo from './code-info'
import material from './material'
import product from './product'
import quantityDelivery from './quantity-delivery'
import { querycolorFabricPage } from './api'
import techRquire from '@/components/tech-requireItem/tech-require'
// import preview from '@/views/customer-order/public/components/preview'
import { PublicCustomer } from '@/views/customer-order/public'
import { optionConfigSelect } from '@/views/customer-order/public/api'

export default {
  name: 'OrderIndex',
  components: {
    codeInfo, // 编码信息
    baseInfo, // 基本信息
    material, // 原料信息
    product, // 产品信息
    quantityDelivery, // 颜色数量交期
    fabricComposition
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
    },
    currentVersionChange: {
      type: Function
    }
  },
  data() {
    // 左侧表格列
    const columns = {
      _seq: {
        prop: 'seq',
        label: '产品序号',
        width: '80'
      },
      _garmentPart: {
        prop: 'garmentPart',
        label: '成衣部位',
        // className: 'ruleTip',
        // itemType: 'table-form',
        editOptions: {
          labelWidth: '0',
          itemType: 'select',
          className: 'commonRemoteSearch',
          valueType: 'object',
          valueKey: 'value',
          placeholder: '输入文字模糊查询',
          // clearable: true,
          filterable: true,
          rules: [
            {
              required: true,
              message: '成衣部位不能为空',
              trigger: ['change']
            }
          ],
          change: (value, form, formDatas, setFormDatas, scope) => {
            this.dataSource._tableForm.dataSource[scope.$index].garmentPart = value
            this.$nextTick(() => {
              this.dataSource._tableForm.currentRowKey = scope.$index + 1
            })
          },
          focus: (e, scope) => {
            this.setDetaiDatas(this.getLeftDataSource, scope.$index)
          },
          dataSource: []
        },
        formater: (scope) => {
          return scope.row.garmentPart ? scope.row.garmentPart.label : ''
        }
      },
      _colorType: {
        prop: 'colorType',
        label: '颜色分类',
        // className: 'ruleTip',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.colorType ? scope.row.colorType.label : ''
        }
      },
      _cloth: {
        prop: 'cloth',
        label: '布类',
        // className: 'ruleTip',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cloth ? `<div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${scope.row.cloth.label}</div>` : ''
        }
      }

    }
    const operates = {
      label: '操作',
      width: '50',
      isShow: () => {
        return this.isEdit
      },
      // fixed: 'right',
      dataSource: [
        {
          label: '删除',
          isShow: true,
          style: { 'color': '#FE4949' },
          handle: (scope, form, formDatas, setFormDatas) => {
            event.stopPropagation()
            if (this.getLeftDataSource && this.getLeftDataSource.length <= 1) {
              this.$message({ type: 'warning', message: '至少保留一条' })
            } else {
              this.$confirm('确认删除该条订单信息数据？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', cancelButtonClass: 'btn-cancel' })
                .then(() => {
                  if (this.$route.query.rowIndex) {
                    this.$router.push({ path: this.$route.path, query: { }})
                  }
                  const dataSource = this.getLeftDataSource.filter((v, index) => index !== scope.$index)
                  this.dataSource._tableForm.dataSource = dataSource
                  this.resetSeqCode(dataSource)
                  // console.log(dataSource)
                  // debugger
                  this.setDetaiDatas(dataSource, dataSource.length - 1)
                  this.$nextTick(() => {
                    this.$refs.leftForm.form.clearValidate()
                  })
                })
                .catch(() => {
                  this.$message({ type: 'info', message: '已取消删除' })
                })
            }
          }
        }
      ]
    }
    const dataSource = {
      _tableForm: {
        prop: 'tableForm',
        itemType: 'table-form',
        tooltipEffect: 'dark',
        dataSource: [],
        className: 'leftTableForm',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: columns,
        operates: operates,
        rowKey: 'code',
        currentRowKey: 0,
        highlightCurrentRow: true,
        rowClassName: 'heightRow',
        rowClick: (scope) => {
          this.setDetaiDatas(this.getLeftDataSource, scope.code - 1)
        }
      }
    }
    const pagination = {
      pageSizes: [10, 20, 50, 100],
      currentChange: val => {
        this.getcolorFabric({ pageSize: this.popOptions.popTableOptions.pageSize || 10, pageNum: val, currentPage: val })
      },
      sizeChange: val => {
        this.$set(this.popOptions.popTableOptions.pagination, 'currentPage', 1)
        this.getcolorFabric({ pageNum: 1, pageSize: val, currentPage: 1 })
      }
    }
    // 新增弹窗列
    const popColumns = {
      _colorFabricCode: {
        prop: 'colorFabricCode',
        label: '色布/印花布编码',
        minWidth: '180'
      },
      _cloth: {
        prop: 'cloth',
        label: '布类',
        width: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.cloth ? scope.row.cloth.label : ''
        }
      },
      _ingredient: {
        prop: 'ingredient',
        label: '成份',
        width: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.ingredient ? scope.row.ingredient.label : ''
        }
      },
      _yarnFineness: {
        prop: 'yarnFineness',
        label: '纱支/细度',
        width: '180',
        showOverflowTooltip: true
      },
      _yarnWireCategory: {
        prop: 'yarnWireCategory',
        label: '纱类/丝类',
        width: '180',
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
      _printPic: {
        prop: 'colorType',
        label: '颜色分类',
        width: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.colorType ? scope.row.colorType.label : ''
        }
      }
      // _colorPreview: {
      //   prop: 'colorPreview',
      //   label: '颜色预览',
      //   width: '180',
      //   showOverflowTooltip: true,
      //   formater: (scope) => {
      //     if (scope.row.colorPreview) {
      //       return `<div style="width: 100px; height: 30px;background-color: rgb(${scope.row.colorPreview})"></div>`
      //     } else {
      //       return ''
      //     }
      //   }
      // },
      // _spacing: {
      //   prop: 'spacing',
      //   label: '条纹间距',
      //   width: '180',
      //   showOverflowTooltip: true,
      //   components: {
      //     preview
      //   },
      //   componentsOptions: {
      //     propName: 'spacing'
      //   },
      //   formater: (scope) => {
      //     let spacing = ''
      //     const arr = []
      //     scope.row.spacing && scope.row.spacing.length && scope.row.spacing.forEach(item => {
      //       arr.push(item.colorName + item.height + 'cm')
      //     })
      //     spacing = arr.join(',')
      //     return spacing || ''
      //   },
      //   style: {
      //     color: 'rgb(24, 144, 255)',
      //     cursor: 'pointer'
      //   }
      // },
      // _printPic: {
      //   prop: 'printPic',
      //   label: '印花图案',
      //   width: '180',
      //   showOverflowTooltip: true,
      //   formater: (scope) => {
      //     return scope.row.printPic ? `<img class="printPic" src='${scope.row.printPic}' />` : ''
      //   }
      // }
    }
    const popOptions = {
      visible: false,
      width: '1200px',
      title: '搜索功能',
      footerOptions: {
        content: [
          {
            name: '确认',
            handle: (formDatas, form, table) => {
              // console.log(formDatas, form, table)
              // console.log(this.getLeftDataSource)
              let flag = false
              this.getLeftDataSource.forEach(v => {
                // console.log(v.greyClothCode, this.currentRow.greyClothCode)
                if (v.greyClothCode === this.currentRow.greyClothCode) {
                  flag = true
                }
              })
              if (flag) {
                flag = false
                this.$message({
                  message: '存在相同编码，请重新选择',
                  type: 'warning'
                })
                return
              }
              if (!this.currentRow) {
                this.$message({
                  message: '请选择一条记录',
                  type: 'warning'
                })
                return
              }
              const { colorFabricCode, greyClothCode, dyeTech, printTech, fabricWidth, fabricWeight } = this.currentRow
              const garmentPart = this.dataSource._tableForm.columns._garmentPart.editOptions.dataSource[0]
              const row = { ...this.currentRow, garmentPart, colorClothCode: colorFabricCode, greyClothCode, printCraft: printTech, dyeCraft: dyeTech, suggestWidth: fabricWidth, weightBefore: fabricWeight, weightBeforeUnit: 'g/m²', suggestWidthUnit: '"' }

              // console.log(row, this.getLeftDataSource)
              const dataSource = this.$utils.deepClone(this.getLeftDataSource)
              dataSource.push(row)
              // console.log(dataSource)
              this.resetSeqCode(dataSource)
              this.dataSource._tableForm.dataSource = dataSource
              // console.log(dataSource)
              // debugger
              this.setDetaiDatas(dataSource, dataSource.length - 1)
              this.popHandle()
            }
          },
          {
            name: '取消',
            handle: (formDatas, form, table) => {
              // console.log(formDatas, form, table)
              this.popHandle()
            }
          }
        ]
      },
      popFormOptions: {
        content: {
          _fabrication: {
            prop: 'fabrication',
            itemType: 'select',
            itemStyle: { width: '25%' },
            label: '布类',
            rules: [
              {
                required: true,
                message: '成衣部位不能为空',
                trigger: ['change']
              }
            ],
            // valueType: 'object',
            // clearable: true,
            filterable: true,
            className: 'commonRemoteSearch',
            placeholder: '输入文字模糊查询',
            visibleChange: (value, val) => {
              if (value) {
                this.getClothSelect()
              }
            },
            dataSource: []
          },
          _ingredients: {
            prop: 'ingredients',
            itemType: 'select',
            itemStyle: { width: '25%' },
            label: '成份',
            valueType: 'object',
            clearable: true,
            filterable: true,
            className: 'commonRemoteSearch',
            placeholder: '输入文字模糊查询',
            visibleChange: (value, val) => {
              if (value) {
                this.getCompositionSelect()
              }
            },
            dataSource: []
          },
          _yarnCountFineness: {
            prop: 'yarnCountFineness',
            itemType: 'select',
            valueType: 'object',
            itemStyle: { width: '25%' },
            label: '纱支/细度',
            clearable: true,
            filterable: true,
            className: 'commonRemoteSearch',
            placeholder: '输入文字模糊查询',
            visibleChange: (value, val) => {
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
            visibleChange: (value, val) => {
              if (value) {
                this.getYarnTypeSelect('combine')
              }
            },
            dataSource: []
          },
          _fabricWidth: {
            prop: 'fabricWidth',
            itemType: 'input',
            itemStyle: { width: '25%' },
            clearable: true,
            label: '成品幅宽'
          },
          _fabricWeight: {
            prop: 'fabricWeight',
            itemType: 'input',
            itemStyle: { width: '25%' },
            clearable: true,
            label: '成品克重'
          },
          _dyeTech: {
            prop: 'dyeTech',
            itemType: 'select',
            itemStyle: { width: '25%' },
            style: { 'width': '82%' },
            clearable: true,
            label: '染整工艺',
            valueType: 'object',
            // disabled: true,
            title: true,
            components: { techRquire },
            componentsOptions: {
              checkValList: [],
              ok: (checkValList) => {
                this.popOptions.popFormOptions.content._dyeTech.componentsOptions.checkValList = checkValList
                this.popsearchFormDatas = { dyeTech: checkValList }
              }
            }
          },
          _printTechId: {
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
            visibleChange: (value, val) => {
              if (value) {
                this.getPrintCraftSelect('TechId')
              }
            },
            dataSource: []
          },
          // _customerColorName: {
          //   prop: 'customerColorName',
          //   itemType: 'input',
          //   itemStyle: { width: '25%' },
          //   clearable: true,
          //   label: '客户颜色'
          // },
          _operate: {
            itemType: 'operate',
            submitHandle: params => {
              // console.log('查询', params, this.popsearchFormDatas)
              if (!params.ingredients) {
                params.ingredients = null
              }
              if (!params.yarnCountFineness) {
                params.yarnCountFineness = null
              }
              if (!params.yarnSilkType) {
                params.yarnSilkType = null
              }
              // if (params.printTech && params.printTech.value) {
              //   params.printTechId = params.printTech.value || ''
              // }
              params.printTechId = []
              params.printTech && params.printTech.forEach(Pitem => {
                if (Pitem && Pitem.value) {
                  params.printTechId.push(Pitem.value)
                }
              })
              params.dyeTech = this.popsearchFormDatas.dyeTech
              params.dyeTech && params.dyeTech.forEach((item, index) => {
                item.value = item.uuid
                item.label = item.type
              })
              this.popsearchFormDatas = params
              this.getcolorFabric(params)
            },
            submitText: '查询',
            resetHandle: () => {
              this.popOptions.popFormOptions.content._dyeTech.componentsOptions.checkValList = []
              this.popsearchFormDatas = {}
            }
          }
        },
        formOptions: {
          layout: true,
          isShrink: true,
          syncDataHandle: (syncData) => {
            // console.log(syncData)
            // this.popsearchFormDatas = syncData
          },
          inline: true
          // popError: true
        }
      },
      popTableOptions: {
        loading: false,
        columns: popColumns,
        highlightCurrentRow: true,
        // currentRowKey: 'id',
        rowClick: (row, column, event) => {
          this.currentRow = row
          // console.log(row, column, event)
        },
        dataSource: [],
        pagination
      }
    }
    return {
      popOptions,
      hasDetail: false,
      popsearchFormDatas: { dyeTech: [] },
      freshData: {},
      rowIndex: 0,
      taxRate: 0,
      currencyCode: '',
      suggestWidthUnit: '',
      suggestWidth: '',
      weightBefore: '',
      greyClothCode: '',
      addColorQuantityDelivery: {},
      maxDetailSeq: 0,
      currencySeq: 1,
      codeInfoData: {},
      dataSource, // 左侧配置,
      leftFormOptions: {// 左侧表单数据修改同步
        syncDataHandle: (formDatas) => {
          // console.log(formDatas)
        }
      },
      status: '0', // 订单状态
      materialData: [], // 原料信息数据
      fabricElement: [], // 面料成份比例
      referenceData: [], // 参板信息数据
      quantityDeliveryData: {}, // 颜色数量交期数据
      productData: {}, // 产品信息数据
      baseInfoData: {}, // 基础信息数据
      getShowAddBtn: false
    }
  },
  computed: {
    getLeftDataSource() {
      return this.dataSource._tableForm.dataSource
    },
    getEdit() {
      return this.isEdit && this.hasDetail
    }
  },
  watch: {
    freshData: {
      handler(val, oldVal) {
        // console.log(val)
        this.syncDataHandle('orderIndexData', val)
      },
      deep: true,
      immediate: true
    },
    orderData: {
      handler(val, oldVal) {
        const index = this.$route.query.rowIndex ? this.$route.query.rowIndex * 1 - 1 : 0
        // console.log(index)
        this.setOrderData(val, index)// 设置页面数据
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.resetSeqCode(this.getLeftDataSource)
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.init()// 初始化加载
  },
  methods: {
    init() {
      this.getGarmentPart()// 获取成衣部位下拉框列表
      // this.getCloth()// 获取布类下拉框列表
    },
    popHandle() {
      this.popOptions.visible = !this.popOptions.visible
    },
    setOrderData(obj, index = 0) { // 设置订单要求页签下所有模块数据
      const freshData = this.$utils.deepClone(obj)
      delete freshData.extraInfo
      this.freshData = freshData
      // console.log(obj)
      this.baseInfoData = this.$utils.deepClone(obj.baseInfo || {})// 基础信息数据
      if (obj.detail) {
        this.hasDetail = true
        this.getShowAddBtn = true
        if (obj.baseInfo && obj.baseInfo.status) {
          this.status = obj.baseInfo.status
        }
        this.resetSeqCode(obj.detail)
        if (obj.detail[index]) {
          this.suggestWidthUnit = obj.detail[index].suggestWidthUnit
          this.suggestWidth = obj.detail[index].suggestWidth
          this.weightBefore = obj.detail[index].weightBefore
        }
        this.dataSource._tableForm.dataSource = this.$utils.deepClone(obj.detail)
        this.setDetaiDatas(obj.detail, index)// 右侧模块数据
        if (obj.baseInfo && obj.baseInfo.maxDetailSeq) {
          this.maxDetailSeq = obj.baseInfo.maxDetailSeq
        }
      } else {
        this.hasDetail = false
        this.getShowAddBtn = false
        // this.addOrderHandle()
      }
    },
    setDetaiDatas(detailArr, index, empty = false) { // 设置右侧模块数据
      this.hasDetail = true

      if (this.$route.query.rowIndex) {
        this.$router.push({ path: this.$route.path, query: { }})
      }
      this.getShowAddBtn = detailArr.length > 0
      this.currencySeq = detailArr[index] && detailArr[index].seq
      // console.log(detailArr[index].seq)
      this.freshData = { ...this.freshData, detail: detailArr }
      this.rowIndex = index + 1
      this.dataSource._tableForm.currentRowKey = index + 1
      if (detailArr[index]) {
        const data = this.$utils.deepClone(detailArr[index])
        if (empty) {
          // console.log()
        }
        this.codeInfoData = data
      }
      this.materialData = this.$utils.deepClone(detailArr[index] && detailArr[index].materialInfo || [])
      this.fabricElement = this.$utils.deepClone(detailArr[index].fabricElement || [])
      this.quantityDeliveryData = this.$utils.deepClone(detailArr[index] && detailArr[index].quantityDelivery || {})
      if (detailArr[index]) {
        let data = this.$utils.deepClone(detailArr[index])
        if (empty) {
          data = {}
        }
        this.productData = data
      }
    },
    async getGarmentPart() { // 获取成衣部位下拉框列表
      const data = await optionConfigSelect({ pageName: '备坯单', fieldName: '成衣部位' })
      let list = data.data || []
      list = list.map(item => ({ value: '' + item.fieldValueId, label: item.fieldValue }))
      // console.log(list)
      this.dataSource._tableForm.columns._garmentPart.editOptions.dataSource = list
    },
    syncMoudleDataHandle(key, data) { // 同步右侧各个模块的全量表单数据
      // console.log(key, data)
      this.$nextTick(() => {
        const index = this.rowIndex - 1
        if (key === 'baseInfoData') { // 同步基本信息模块数据
          this.freshData.baseInfo = this.freshData.baseInfo || {}
          this.freshData = { ...this.freshData, baseInfo: { ...this.freshData.baseInfo, ...data }}
        }
        if (this.dataSource._tableForm.dataSource[index]) {
          if (key === 'productData') { // 同步产品信息模块数据
            if (this.dataSource._tableForm.dataSource) {
              for (const i in data) {
                this.dataSource._tableForm.dataSource[index][i] = data[i]
              }
            }
          }
          if (key === 'materialData') { // 同步原料信息模块数据
            const tempData = data || []
            tempData.forEach(item => {
              item.orderId = this.$route.params.id || 0
            })
            this.dataSource._tableForm.dataSource[index].materialInfo = tempData
          }
          if (key === 'fabricElement') { // 同步面料成份比例
            this.dataSource._tableForm.dataSource[index].fabricElement = data
          }
          if (key === 'quantityDelivery') { // 同步数量交期数据
            if (this.dataSource._tableForm.dataSource[index]) {
              this.dataSource._tableForm.dataSource[index].quantityDelivery = data
            }
          }
          this.freshData = { ...this.freshData, detail: this.dataSource._tableForm.dataSource }
        }
      })
    },
    setParentDataHandle(key, data) { // 同步右侧各个模块的部分字段数据
      // console.log(key, data)
      if (key === 'currentVersion') {
        this.currentVersionChange(data)
      } else {
        this[key] = data
      }
    },
    resetSeqCode(dataList) {
      let newNum = 0
      dataList.forEach((v, index) => {
        if (!v.orderId) {
          newNum += 1
          v.seq = this.maxDetailSeq + newNum
          // console.log(v, this.maxDetailSeq, newNum)
        }
        // console.log(this.isEdit)
        v.edit = this.isEdit
        v.code = index + 1
      })
    },
    addOrderHandle() { // 增加分录事件
      if (this.getLeftDataSource.length >= 100) {
        this.$message({ type: 'error', message: '最多可以增加到100行!' })
        return false
      }
      this.popOptions.visible = true
      // this.getcolorFabric()
      // const dataSource = this.$utils.deepClone(this.getLeftDataSource)
      // dataSource.push({})
      // this.resetSeqCode(dataSource)
      // this.dataSource._tableForm.dataSource = dataSource
      // this.setDetaiDatas(dataSource, dataSource.length - 1, true)
    },
    popClose() {
      // console.log(123)
      this.popOptions.popFormOptions.formOptions.isShrink = true
      this.currentRow = null
      this.popsearchFormDatas = {}
      this.popOptions.popTableOptions.dataSource = []
      this.popOptions.popTableOptions.pagination.dataTotal = 0
      this.popOptions.popFormOptions.content._dyeTech.componentsOptions.checkValList = []
    },
    // 获取布类下拉
    getClothSelect() {
      this.getCloth({ enabled: 'Y' }).then(res => {
        // console.log(res, this.clothSearch, this.clothSearch._cloth)
        this.popOptions.popFormOptions.content._fabrication.dataSource = res
      })
    },
    // 成份下拉
    getCompositionSelect() {
      this.getComposition().then(res => {
        this.popOptions.popFormOptions.content._ingredients.dataSource = res
      })
    },
    // 纱支、细度下拉 type: yarn纱支 fineness细度 combine组合
    getYarnSelect(type) {
      const GenericType = { type, enabled: 'Y' }
      this.getYarn(GenericType).then(res => {
        // console.log(res)
        this.popOptions.popFormOptions.content._yarnCountFineness.dataSource = res
      })
    },
    // 纱类、丝类下拉 type: yarn纱类 silk丝类 combine组合
    getYarnTypeSelect(type) {
      // debugger
      this.getYarnType({ type }).then(res => {
        // console.log(res)
        this.popOptions.popFormOptions.content._yarnSilkType.dataSource = res
      })
    },
    // 印花工艺下拉
    getPrintCraftSelect(type) {
      this.getPrintCraft().then(res => {
        this.popOptions.popFormOptions.content._printTechId.dataSource = res
      })
    },
    async getcolorFabric(data = {}) {
      this.popOptions.popTableOptions.loading = true
      const params = { ...this.popsearchFormDatas, ...data }
      const tableData = await querycolorFabricPage(params)
      const res = tableData.data
      const list = res.list || []
      // console.log(list)
      const pagination = {
        ...this.popOptions.popTableOptions.pagination,
        ...data,
        dataTotal: res.total,
        currentPage: res.pageNum,
        pageNum: res.pageNum,
        pageSize: res.pageSize,
        page: res.page
      }
      this.popOptions.popTableOptions.dataSource = list
      this.popOptions.popTableOptions.pagination = pagination
      this.popOptions.popTableOptions.loading = false
    }
  }
}
</script>

<style lang="scss">
.order-detail-index {
    .table-item {
        background: #ffffff;
        margin: 20px 20px 0;
        margin-bottom: 20px;
        .header-top {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 20px 20px 15px 20px;
            span {
                font-size: 16px;
                display: flex;
                // font-weight: 500;
            }
            .el-button {
                display: flex;
                span {
                    font-size: 14px;
                }
            }
        }
        .basic-top {
            border-bottom: 1px solid #EEEFF0;
            margin-bottom: 20px;
        }
    }
    .el-input.is-disabled .el-input__inner {
        color: #666666;
    }
    .el-form--inline .el-form-item {
        margin-right: 0;
    }
    .detailClass .el-input__inner {
        padding: 0;
        border: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        background: #fff;
        font-size: 14px;
    }
    .detailClass .el-form-item {
        margin-bottom: 14px;
    }
    .editClass .el-form-item {
        margin-bottom: 20px;
    }
    .detailClass .el-input__icon {
        display: none;
    }
    .basic-data .el-input.is-disabled .el-input__suffix {
        display: none;
    }
    .basic-data {
        margin-top: 0;
        padding-bottom: 20px;
        .custom-form {
            margin: 0 20px;
        }
    }
    .order-info {
        display: flex;
        flex-direction: column;
        margin: 0 20px;
        .order-header {
            background: #ffffff;
            padding: 20px;
            border-bottom: 1px solid #EEEFF0;
        }
        .order-content {
            display: flex;
            flex-direction: row;
            .info-left {
                width: 400px;
                display: flex;
                flex-direction: column;
                background: #ffffff;
                border-right: 1px solid #EEEFF0;
                .top {
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;
                    padding: 15px;
                }
                .bottom {
                    padding-left: 10px;
                    font-size: 14px !important;
                    .el-table .cell {
                      font-size: 14px !important;
                      span{
                        font-size: 14px !important;
                      }
                    }
                    .custom-form {
                        margin: 0;
                    }
                }
            }
            .info-right {
                display: flex;
                flex: 1;
                width: calc(100% - 350px);
                // min-width: 880px;
                flex-direction: column;
                .top {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    .left {
                        display: flex;
                        span {
                            font-size: 15px;
                            color: #151222;
                        }
                    }
                    .right {
                        display: flex;
                        .el-form-item {
                            margin-bottom: 0;
                        }
                    }
                }
                .order-item {
                    background: #ffffff;
                    .header-top {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        padding: 20px 20px 15px 20px;
                        span {
                            font-size: 16px;
                            display: flex;
                            font-weight: 500;
                        }
                        .el-button {
                            display: flex;
                            span {
                                font-size: 14px;
                            }
                        }
                        .left {
                            display: flex;
                            align-items: center;
                            .title {
                                margin-right: 40px;
                            }
                            .date-title {
                                position: relative;
                                .item-title::before {
                                    display: block;
                                    content: '*';
                                    position: absolute;
                                    left: -8px;
                                    color: #FF4444;
                                }
                            }
                        }
                        .right {
                            display: flex;
                            align-items: center;
                            .total {
                                margin: 0 80px;
                            }
                        }
                    }
                    .page-table {
                        height: auto;
                        border-bottom-width: 1px;
                    }
                }
                .product-item {
                    .custom-form {
                        margin: 0 20px;
                    }
                }
            }
        }
    }
    .addButton {
        display: block;
        width: 60px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        border-radius: 3px;
        color: #FFFFFF;
        background: #1890ff;
        text-align: center;
        outline: none;
        margin: 0;
        cursor: pointer;
    }
    .titleView {
        width: 28%;
        font-size: 14px;
        font-weight: 600;
        display: inline-block;
        background: #F5F5F5;
        padding: 5px 0 5px 13px;
        margin-bottom: 20px;
        position: relative;
        margin-top: 15px;
    }
    .titleView::before {
        display: block;
        content: '*';
        position: absolute;
        left: 6px;
        color: #FF4444;
    }
    .ViewHide::before {
        display: none;
    }
    .lableStyle::before {
        content: "*";
        margin-right: 4px;
        color: #FF4444;
    }
    .noLableStyle::before{
        display: none;
    }
    .noBefore::before {
        display: none;
    }
    .date-title{
        display: inline-block;
        .el-input--medium .el-input__inner{
            height: 32px;
            line-height: 32px;
        }
    }
    .data-font{
        font-size: 14px !important;
        color: #606266;
    }
    .table .el-table .el-table__row.heightRow {
        cursor: pointer;
    }
    .table .el-table .el-table__row.current-row.heightRow {
        > td {
            color: #666;
            background-color: #d8eafd !important;
        }
    }
    .table tr:nth-child(even) {
        background: #ffffff;
    }
    .leftTableForm {
        .el-table--medium td {
            padding: 10px 0 0;
        }
        .el-table__body-wrapper .cell {
            padding: 7px 10px;
            // height: 50px;
        }
        .el-table__header .ruleTip .cell::before {
            display: block;
            content: '*';
            position: absolute;
            left: 4px;
            color: #FE4949;
        }
    }
    .leftTableForm th.is-leaf {
      border-bottom: 1px solid #dfe6ec!important;
      padding: 0;
      height: 44px;
    }
    .detailClass {
        .el-input-group__append {
            background: #ffffff;
            border: 0;
        }
    }
    .cursorHandel {
        input {
            cursor: pointer;
        }
    }
    .printColorDesign {
        width: 36px;
        height: 36px;
    }
}

.page-table-border{
    tbody {
        color: #666;
        /deep/  .el-table__row td {
            border-bottom-width: 1px;

        }
    }
}
.printPic {
    width: 36px;
    height: 36px;
}
</style>

<style lang="scss" scoped>
/deep/ .quantity-delivery .el-form {
    display: flex;
    flex-wrap: wrap;
}
.versionClass{
    margin-left: 20px;
    width: 80px;
    display: flex;
}
</style>
