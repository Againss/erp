<!--
 * @Author: xj
 * @Description: 参板信息数据
 * @Date: 2021-04-18 09:48:43
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-16 15:28:10
-->
<template>
  <!-- 参板信息 -->
  <div class="order-item">
    <div class="header-top">
      <span :class="{ require: isEdit}">参板信息</span>
      <el-button v-if="isEdit && versionData.length >= 1" type="primary" size="mini" @click="addReferenceVersionInfo">新增</el-button>
    </div>
    <div class="page-table page-table-border" style="padding: 0 20px;">
      <cs-custom-table
        ref="versionData"
        tooltip-effect="light"
        :header-cell-style="headerCellStyle"
        :columns="versionColumns"
        :data-source="versionData"
        :operates="versionOperates"
        :pagination="pagination"
        edit-type="pop"
      />
      <div v-if="versionData&&versionData.length===0" style="border-bottom: 1px solid #eeeff0;margin: 10px;" />
    </div>
    <!-- 参板信息弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="versionPop" :options="versionPopOptions" />
    </div>
    <!-- 坯布编码弹窗 -->
    <div class="cloth-pop">
      <!-- <cloth-pop :is-visible.sync="isshowCloth" @closepop="closepop" @clothsavePop="clothsavePop" /> -->
      <cloth-pop :loading="loading" :title="clothTitle" :form-datas="clothformDatas" :search-data="clothSearch" :pagination="choosePagination" :columns="clothColumns" :is-visible.sync="isshowCloth" :table-data="colorFabricData" :save-pop="clothsavePop" @closePop="closepop" />
    </div>
  </div>
</template>

<script>
import clothPop from './clothPop'
import { PublicCustomer } from '@/views/customer-order/public/index'
import { querycolorFabricPage } from '../../api2-bak/index.js'
import techRquire from '@/views/customer-order/public/components/tech-require'
import preview from '@/views/customer-order/public/components/preview'
export default {
  name: 'References',
  components: { clothPop },
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    data: {
      type: [Object, Array]
    },
    syncMoudleDataHandle: {
      type: Function
    },
    setParentDataHandle: {
      type: Function
    },
    rule: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // table表头颜色
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 参板信息
    const versionColumns = {
      _referenceOrder: {
        prop: 'referenceOrder',
        label: '参考单号',
        formater: (scope) => {
          if (scope.row.referenceOrder && scope.row.referenceOrder.label) {
            return scope.row.referenceOrder.label
          }
        }
      },
      _greyClothCode: {
        prop: 'greyClothCode',
        label: '色布/印花布编码',
        minWidth: '160',
        showOverflowTooltip: true
      },
      _referenceContent: {
        prop: 'referenceContent',
        label: '参考内容',
        showOverflowTooltip: true,
        formater: (scope) => {
          if (scope.row.referenceContent && scope.row.referenceContent.label) {
            return scope.row.referenceContent.label
          }
        }
      },
      _remark: {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      }
    }
    const versionOperatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          this.isFirstSelect = false
          // this.greyClothCode = scope.row.greyClothCode
          this.$set(this.versionContent._referenceOrder, 'dataSource', scope.row.referenceOrder && scope.row.referenceOrder.value ? [scope.row.referenceOrder] : '')
          this.$set(this.versionContent._referenceContent, 'dataSource', scope.row.referenceContent && scope.row.referenceContent.value ? [scope.row.referenceContent] : '')
          // 字段加密--弹框编辑
          this.encryptFn(this.versionContent, this.rule, 'edit')
          // this.getcolorFabric()
          this.versionPopHandle('编辑参板信息')
          this.setFormDatas({ ...scope.row, index: scope.$index }, 'version')
        }
      },
      {
        label: '删除',
        isShow: (scope) => {
          return scope.$index > 0
        },
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.$confirm('确认删除该条参板信息数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              this.versionData.splice(scope.$index, 1)
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const versionOperates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: versionOperatesData
    }
    // 参板信息弹框内容
    const versionContent = {
      _greyClothCode: {
        prop: 'greyClothCode',
        itemType: 'input',
        label: '色布/印花布编码',
        placeholder: '点击选择色布/印花布编码',
        // rules: [commonBlurReg],
        rules: [{ required: true, message: '色布/印花布编码不能为空', trigger: 'change' }],
        // valueType: 'object',
        readonly: true,
        focus: (params) => {
          if (params === 'add') {
            this.currentAction = 'add'
          } else {
            this.currentAction = ''
          }
          this.clothTitle = '选择色布/印花布编码'
          this.clothSearch = {
            _fabrication: {
              prop: 'fabrication',
              itemType: 'select',
              itemStyle: { width: '25%' },
              label: '布类',
              // valueType: 'object',
              clearable: true,
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
            _sourceOrder: {
              prop: 'sourceOrder',
              itemType: 'input',
              itemStyle: { width: '25%' },
              clearable: true,
              label: '来源单号'
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
                  this.$set(this.clothSearch._dyeTech.componentsOptions, 'checkValList', checkValList)
                  this.clothformDatas = { dyeTech: checkValList }
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
                const newParams = params
                newParams.dyeTech && newParams.dyeTech.forEach((item, index) => {
                  item.value = item.uuid
                  item.label = item.type
                })
                this.clothParams = params
                this.getcolorFabric(params)
              },
              submitText: '查询',
              resetHandle: () => {
                this.clothParams = {}
                this.$set(this.clothSearch._dyeTech.componentsOptions, 'checkValList', [])
                this.clothformDatas = {}
              }
            }
          }
          this.clothColumns = {
            _colorFabricCode: {
              prop: 'colorFabricCode',
              label: '色布/印花布编码',
              minWidth: '160',
              showOverflowTooltip: true
            },
            _sourceOrder: {
              prop: 'sourceOrder',
              label: '来源单号',
              width: '180',
              showOverflowTooltip: true
            },
            _fabrication: {
              prop: 'fabrication',
              label: '布类',
              width: '180',
              showOverflowTooltip: true
            },
            _ingredients: {
              prop: 'ingredients',
              label: '成份',
              minWidth: '160',
              showOverflowTooltip: true
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
          this.isshowCloth = true
          this.choosePagination = {
            currentChange: val => {
              this.getcolorFabric({ ...this.clothParams, pageSize: this.choosePagination.pageSize || 10, pageNum: val, pageSizes: [10, 20, 30, 40, 50, 100] })
            },
            sizeChange: val => {
              this.$set(this.choosePagination, 'currentPage', 1)
              this.getcolorFabric({ ...this.clothParams, pageNum: this.choosePagination.pageNum, pageSize: val, pageSizes: [10, 20, 30, 40, 50, 100] })
            }
          }
          this.getcolorFabric()
        }
      },
      _referenceOrder: {
        prop: 'referenceOrder',
        itemType: 'select',
        label: '参考单号',
        className: 'commonRemoteSearch',
        placeholder: '输入文字模糊查询',
        clearable: true,
        filterable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: (value, scope, form, formDatas, setFormDatas) => {
          if (value && formDatas.colorFabricCode) {
            this.getOrderNoSelect()
          }
        },
        focus: (e, scope, form, formDatas, setFormDatas) => {
          if (!formDatas.colorFabricCode) {
            this.$message({ type: 'warning', message: '请先选择色布/印花布编码' })
            return
          }
        },
        dataSource: []
      },
      _referenceContent: {
        prop: 'referenceContent',
        itemType: 'select',
        label: '参考内容',
        clearable: true,
        valueType: 'object',
        rules: [commonBlurReg],
        visibleChange: value => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '参考内容' }, 'referenceContent')
          }
        },
        dataSource: [
          // {
          //   value: '参考内容',
          //   label: '1'
          // }
        ]
      },
      _remark: {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        clearable: true,
        maxlength: 50,
        trim: (value) => {
          return value
        }
      }
    }
    // 参板信息弹框配置
    const versionPopOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增参板信息',
      okText: '保存',
      ok: params => {
        console.log(params)
        // debugger
        // const { suggestWidth, weightBefore, suggestWidthUnit } = this.colorFabricRow
        params.greyClothCode = params.colorFabricCode
        if (this.versionPopOptions.title === '新增参板信息') {
          console.log(this.colorFabricRow)
          this.versionData.push(params)
          this.syncMoudleDataHandle('referenceData', { referenceVersionInfo: this.versionData })
          // this.setParentDataHandle('addColorQuantityDelivery', this.colorFabricRow.addColorQuantityDelivery)
          // this.setParentDataHandle('referenceData', this.versionData)
          // this.syncMoudleDataHandle('referenceData', [params])
          // this.syncMoudleDataHandle('materialData', this.colorFabricRow.materialInfo)
          // this.setParentDataHandle('productData', { suggestWidth, weightBefore, suggestWidthUnit })
        } else {
          this.versionData.splice(params.index, 1, params)
          // if (params.index === 0 && this.data[0].greyClothCode !== params.greyClothCode) {
          if (params.index === 0) {
            this.syncMoudleDataHandle('referenceData', { referenceVersionInfo: this.versionData, ...this.colorFabricRow })
            this.setParentDataHandle('addColorQuantityDelivery', this.colorFabricRow.addColorQuantityDelivery)
            this.setParentDataHandle('greyClothCodes', params.greyClothCode)

            this.setParentDataHandle('fabricTypes', params.fabricType)
            console.log('omnbs77777ssss', params)
            // this.syncMoudleDataHandle('referenceData', [params])
            // this.syncMoudleDataHandle('materialData', this.colorFabricRow.materialInfo)
            // this.setParentDataHandle('productData', { suggestWidth, weightBefore, suggestWidthUnit })
            // for (const v in this.colorFabricRow.productData) {
            //   this.setParentDataHandle(v, this.colorFabricRow.productData[v])
            // }
          } else {
            this.syncMoudleDataHandle('referenceData', { referenceVersionInfo: this.versionData })
          }
        }
        this.versionPopHandle()
      },
      cancel: params => {
        this.versionPopHandle()
      },
      formDatas: {},
      formOptions: {},
      content: versionContent
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getListData({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getListData({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    return {
      loading: false,
      currentAction: '', // 标识 是从新增按钮 还是从编辑进入  add: 新增
      versionData: [],
      versionColumns,
      versionOperatesData,
      versionOperates,
      versionPopOptions,
      versionContent,
      formDatas: {},
      formOptions: {
        size: 'small',
        inline: true
        // disabled: true
      },
      headerCellStyle,
      pagination,

      clothTitle: '',
      isshowCloth: false, // 是否显示坯布编码弹窗
      colorFabricData: [],
      clothColumns: {},
      clothformDatas: { dyeTech: [] },
      clothSearch: {},
      choosePagination: {}, // 参板信息坯布编码列表分页

      colorFabricRow: {},

      clothParams: {}
    }
  },
  watch: {
    isEdit: {
      handler(val) {
        if (val) {
          this.editChange()
        } else {
          this.changeOptionStatus()
        }
      },
      deep: true,
      immediate: true
    },
    // versionData: {
    //   handler(val) {
    //     if (val) {
    //       this.syncMoudleDataHandle('referenceData', val)
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    data: {
      handler(v) {
        if (v) {
          this.versionData = []
          this.versionData = v
        }
      },
      deep: true,
      immediate: true
    },
    rule: {
      handler(v) {

      },
      deep: true
    }
  },
  mounted() {
    this.getOrderNoSelect()
    this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '参考内容' }, 'referenceContent')
  },
  methods: {
    // 关闭坯布编码弹窗
    closepop() {
      this.isshowCloth = false
    },
    // 保存坯布编码弹窗选中信息
    clothsavePop(params) {
      if (params && params.colorFabricCode) {
        // this.colorFabricRow = params
        const colorFabricRow = this.colorFabricRow
        params.greyClothCode = params.colorFabricCode
        // 赋值原材料信息
        colorFabricRow.materialInfo = params.materialInfo

        // 赋值产品信息
        // colorFabricRow.productData = {
        // newingredient: params.ingreradio,
        colorFabricRow.cloth = params.cloth
        colorFabricRow.ingredient = params.ingredient
        colorFabricRow.ratio = params.radio
        colorFabricRow.printCraft = params.printTech
        colorFabricRow.dyeCraft = params.dyeTech
        colorFabricRow.suggestWidth = params.fabricWidth || ''
        colorFabricRow.weightBefore = params.fabricWeight || ''
        colorFabricRow.suggestWidthUnit = params.suggestWidthUnit || 'cm'
        colorFabricRow.weightBeforeUnit = params.weightBeforeUnit || 'g/m²'
        // }
        colorFabricRow.addColorQuantityDelivery = {
          colorFabricCode: params.colorFabricCode,
          spacing: (params.spacing && params.spacing.length) ? params.spacing : [],
          colorCode: params.colorCode || '',
          flowerCode: params.flowerCode || ''
        }

        this.$set(this.versionPopOptions.formDatas, 'referenceOrder', '')
        // 设置参板信息弹窗色布/印花布编码值
        this.$set(this.versionPopOptions.formDatas, 'greyClothCode', params.greyClothCode)
        this.clothCodeData = params
        this.isshowCloth = false
      } else {
        this.$message({
          message: '请选择一条记录',
          type: 'warning'
        })
      }
      if (this.currentAction === 'add') { // 新增分录的时候
        // 拿单号反查列表取出对象（因为后端给了字符串）
        const datas = this.$utils.deepClone(params || {})
        const sourceOrderList = this.versionContent._referenceOrder.dataSource
        const referenceContentList = this.versionContent._referenceContent.dataSource // 参考内容下拉框的内容
        datas.referenceOrder = sourceOrderList.filter(v => v.label === params.sourceOrder)[0] || null
        datas.referenceContent = referenceContentList.filter(v => v.label === '所有')[0] || null // 默认设置参考内容为 所有
        this.versionData.push(datas)
        console.log(this.versionData)
        console.log(this.colorFabricRow)
        this.syncMoudleDataHandle('referenceData', { referenceVersionInfo: [datas], ...this.colorFabricRow, setDefaultColorInfo: true })
        // this.syncMoudleDataHandle('referenceData', [params])
        // this.syncMoudleDataHandle('materialData', this.colorFabricRow.materialInfo)
        this.setParentDataHandle('addColorQuantityDelivery', this.colorFabricRow.addColorQuantityDelivery)
        // this.setParentDataHandle('productData', { suggestWidth, weightBefore, suggestWidthUnit })
        this.setParentDataHandle('greyClothCodes', datas.colorFabricCode)
        this.setParentDataHandle('fabricTypes', params.fabricType)
        this.$emit('addOrder')
      }
    },
    addReferenceVersionInfo() {
      // if (this.versionData && this.versionData.length > 0) {
      //   this.$message({
      //     message: '参板只允许添加一条记录！',
      //     type: 'warning'
      //   })
      //   return false
      // } else {
      //   this.isFirstSelect = true
      //   this.versionPopHandle('新增参板信息')
      //   // 新增的字段
      //   this.encryptFn(this.versionContent, this.rule, 'add')
      //   this.$set(this.versionPopOptions, 'content', this.versionContent)
      //   this.$set(this.versionPopOptions, 'formDatas', {})
      // }
      this.isFirstSelect = true
      this.versionPopHandle('新增参板信息')
      // 新增的字段
      this.encryptFn(this.versionContent, this.rule, 'add')
      this.$set(this.versionPopOptions, 'content', this.versionContent)
      this.$set(this.versionPopOptions, 'formDatas', {})
    },
    editChange() {
      this.versionOperates = {
        label: '操作',
        width: '120',
        fixed: 'right',
        dataSource: this.versionOperatesData
      }
    },
    changeOptionStatus() {
      this.versionOperates = null
    },
    // 数组格式
    funscope(data, type = '1') {
      if (data && data.value) {
        return type === '1' ? [data] : data
      } else {
        return type === '1' ? [] : ''
      }
    },
    // 参板信息弹窗显隐
    versionPopHandle(val) {
      this.$set(this.versionPopOptions, 'visible', !this.versionPopOptions.visible)
      if (val) {
        this.$set(this.versionPopOptions, 'title', val)
      }
    },
    // 坯布编码下拉
    getGreyClothCodesSelect(data) {
      this.getGreyClothCodes(data).then(res => {
        this.$set(this.versionContent._greyClothCode, 'dataSource', res)
      })
    },
    // 点击编辑时处理数据
    setFormDatas(params, type) {
      setTimeout(() => {
        if (type === 'version') {
          this.$set(this.versionPopOptions, 'formDatas', params)
        }
      }, 0)
    },
    // 订单号下拉
    getOrderNoSelect() {
      this.getOrderNo().then(res => {
        this.$set(this.versionContent._referenceOrder, 'dataSource', res)
      })
    },
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'referenceContent') { // 参考内容
          this.$set(this.versionContent._referenceContent, 'dataSource', res)
        }
      })
    },

    // 获取布类下拉
    getClothSelect() {
      this.getCloth().then(res => {
        this.$set(this.clothSearch._fabrication, 'dataSource', res)
      })
    },
    // 成份下拉
    getCompositionSelect() {
      this.getComposition().then(res => {
        this.$set(this.clothSearch._ingredients, 'dataSource', res)
      })
    },
    // 纱支、细度下拉 type: yarn纱支 fineness细度 combine组合
    getYarnSelect(type) {
      const GenericType = { type, enabled: 'Y' }
      this.getYarn(GenericType).then(res => {
        this.$set(this.clothSearch._yarnCountFineness, 'dataSource', res)
      })
    },
    // 纱类、丝类下拉 type: yarn纱类 silk丝类 combine组合
    getYarnTypeSelect(type) {
      // debugger
      this.getYarnType({ type }).then(res => {
        this.$set(this.clothSearch._yarnSilkType, 'dataSource', res)
      })
    },
    // 印花工艺下拉
    getPrintCraftSelect(type) {
      this.getPrintCraft().then(res => {
        this.$set(this.clothSearch._printTechId, 'dataSource', res)
      })
    },

    // 获取坯布编码列表数据
    async getcolorFabric(data = {}) {
      this.loading = true
      const res = await querycolorFabricPage(data)
      res.data && res.data.list.map((item, index) => {
        item.fabrication = item.cloth.label // 布类
        item.ingredients = item.ingredient.label // 成份
        item.ingreradio = item.ingredient.label + ' ' + item.radio // 成份比例
      })
      this.colorFabricData = res.data.list || []
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
    }

  }
}
</script>

<style lang="scss" scoped>
.order-item {
  background: #ffffff;
  .header-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 15px 20px;

    .require::before {
      content: '*';
      color: #ff4444;
    }
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
          color: #ff4444;
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
  .page-table-border{
    /deep/tbody .el-table__row td{
      border-bottom-width: 1px!important;
    }
  }

}
</style>

<style lang="scss">
.order-item {
  .printPic {
    width: 36px;
    height: 36px;
  }
}
.material-datainfo {
  .el-form-item--small.el-form-item{
    margin-bottom: 0 !important;
  }
}
</style>
