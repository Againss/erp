<!--
 * @Descripttion:纱线编码弹窗
 * @version:
 * @Author: shujing
 * @Date: 2020-11-17 10:53:03
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-05-13 14:01:59
-->
<template>
  <div ref="popOptionsCode" lass="pop" class="popOptionsCode">
    <cs-custom-popsearch ref="popOpForm" :options="popOptions" @close="popClose" />
  </div>
</template>

<script>
import { countryPage } from '../api/index'
import { PublicCustomer } from '@/views/customer-order/public/index'
export default {
  name: 'CodePop',
  components: {},
  mixins: [PublicCustomer],
  props: {
    tab: {
      type: String
    },
    setParentDataHandle: {
      type: Function
    }
  },
  data() {
    // 纱线编码分页
    const pagination = {
      pageSizes: [10, 20, 50, 100],
      currentChange: val => {
        this.getData({ pageSize: this.popOptions.popTableOptions.pageSize || 10, pageNum: val, currentPage: val })
      },
      sizeChange: val => {
        this.$set(this.popOptions.popTableOptions.pagination, 'currentPage', 1)
        this.getData({ pageNum: 1, pageSize: val, currentPage: 1 })
      }
    }
    const columns = {
      _yarnCode: {
        prop: 'yarnCode',
        label: '纱线编码',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnCode ? scope.row.yarnCode : ''
        }
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnName ? scope.row.yarnName : ''
        }
      },
      _yarnProperty: {
        prop: 'yarnProperty',
        label: '纱属性',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnProperty ? scope.row.yarnProperty : ''
        }
      }
    }
    const coYarnNaturalFiberSearchReq = {// 天然纤维请求参数 ,CoYarnNaturalFiberSearchReq
      _bdYarnCountUuid: {
        prop: 'bdYarnCountUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '纱支',
        valueType: 'object',
        itemStyle: { width: '25%', 'padding-right': '10px;' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.getYarnSelect('yarn')
          }
        },
        dataSource: []
      },
      _bdIngredientsUuid: {
        prop: 'bdIngredientsUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '成份\n组合成份',
        valueType: 'object',
        itemClassName: 'labeClassName labeClassRight',
        itemStyle: { width: '25%', 'padding-right': '0px;' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.getCompositionSelect('naturalFiber')
          }
        },
        dataSource: []
      },
      _ratio: {
        prop: 'ratio',
        itemType: 'input',
        itemStyle: { width: '25%', 'padding-right': '10px;' },
        label: '比例',
        clearable: true
      },
      _bdCardingMethodUuid: {
        prop: 'bdCardingMethodUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '梳棉方法',
        valueType: 'object',
        itemStyle: { width: '25%' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.CardingMethodClick('bdCardingMethodUuid')
          }
        },
        dataSource: []
      },
      _bdSpinningMethodUuid: {
        prop: 'bdSpinningMethodUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '纺纱方法',
        valueType: 'object',
        itemStyle: { width: '25%', 'padding-right': '30px;' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.CardingMethodClick('bdSpinningMethodUuid')
          }
        },
        dataSource: []
      },
      _bdYarnDyeingAdaptabilityUuid: {
        prop: 'bdYarnDyeingAdaptabilityUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        itemClassName: 'labeClassName',
        label: '染色适应性',
        valueType: 'object',
        itemStyle: { width: '25%', 'padding-right': '0px;' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.CardingMethodClick('bdYarnDyeingAdaptabilityUuid')
          }
        },
        dataSource: []
      },
      _bdYarnTypeUuid: {
        prop: 'bdYarnTypeUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '纱类',
        valueType: 'object',
        itemStyle: { width: '25%', 'padding-right': '30px;' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.getYarnTypeSelect('yarn')
          }
        },
        dataSource: []
      },
      _operate: {
        itemType: 'operate',
        submitHandle: params => {
          // 有比例的情况下 成份必填
          if (params.ratio && !this.setUUid(params.bdIngredientsUuid)) {
            this.$message({ type: 'error', message: '请选择成份' })
            return false
          } else {
            this.searchPublic(params)
            this.popsearchFormDatas = params
          }
        },
        submitText: '查询',
        resetHandle: (params) => {
          this.popsearchFormDatas = {}
        }
      }
    }
    const coYarnChemicalFiberSearch = { // 化学纤维请求参数 ,CoYarnChemicalFiberSearchReq
      _bdFinenessUuid: {
        prop: 'bdFinenessUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '细度',
        itemClassName: 'labeClassPadding',
        valueType: 'object',
        itemStyle: { width: '25%' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.getYarnSelect('fineness')
          }
        },
        dataSource: []
      },
      _bdIngredientsUuid: {
        prop: 'bdIngredientsUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '成份\n组合成份',
        valueType: 'object',
        itemClassName: 'labeClassName labeClassRight',
        itemStyle: { width: '25%' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.getCompositionSelect('naturalFiber')
          }
        },
        dataSource: []
      },
      _bdSilkUuid: {
        prop: 'bdSilkUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '丝类',
        itemClassName: 'labeClassPadding',
        valueType: 'object',
        itemStyle: { width: '25%' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.getYarnTypeSelect('silk')
          }
        },
        dataSource: []
      },
      _bdFunctionUuid: {
        prop: 'bdFunctionUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '功能',
        valueType: 'object',
        itemStyle: { width: '25%' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.CardingMethodClick('bdFunctionUuid')
          }
        },
        dataSource: []
      },
      _bdColorUuid: {
        prop: 'bdColorUuid',
        itemType: 'select',
        itemClassName: 'labeClassPadding',
        className: 'commonRemoteSearch',
        label: '颜色',
        valueType: 'object',
        itemStyle: { width: '25%' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.CardingMethodClick('bdColorId')
          }
        },
        dataSource: []
      },
      _operate: {
        itemType: 'operate',
        submitHandle: params => {
          this.popsearchFormDatas = params
          this.searchPublic(params)
        },
        submitText: '查询',
        resetHandle: (params) => {
          this.popsearchFormDatas = {}
        }
      }
    }
    const yarnCompositeSearchReq = { // 组合纤维请求参数 ,CoYarnChemicalFiberSearchReq
      _bdComposeMethodUuid: {
        prop: 'bdComposeMethodUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '组合方式',
        valueType: 'object',
        itemStyle: { width: '25%' },
        itemClassName: 'labeClassPadding',
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.CardingMethodClick('bdComposeMethodUuid')
          }
        },
        dataSource: []
      },
      _bdYarnCountUuid: {
        prop: 'bdYarnCountUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '纱支',
        itemClassName: 'labeClassPadding',
        valueType: 'object',
        itemStyle: { width: '25%', 'padding-right': '30px;' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.getYarnSelect('yarn')
          }
        },
        dataSource: []
      },
      _bdFinenessUuid: {
        prop: 'bdFinenessUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '细度',
        itemClassName: 'labeClassPadding',
        valueType: 'object',
        itemStyle: { width: '25%', 'padding-right': '30px;' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.getYarnSelect('fineness')
          }
        },
        dataSource: []
      },

      _bdIngredientsUuid: {
        prop: 'bdIngredientsUuid',
        itemType: 'select',
        className: 'commonRemoteSearch',
        label: '成份\n组合成份',
        valueType: 'object',
        itemClassName: 'labeClassName labeClassCOM',
        itemStyle: { width: '25%', 'padding-right': '30px;' },
        valueKey: 'value',
        clearable: true,
        filterable: true,
        visibleChange: (value, val) => {
          if (value) {
            this.getCompositionSelect('naturalFiber')
          }
        },
        dataSource: []
      },
      _operate: {
        itemType: 'operate',
        submitHandle: params => {
          this.popsearchFormDatas = params
          this.searchPublic(params)
        },
        submitText: '查询',
        resetHandle: (params) => {
          this.popsearchFormDatas = {}
        }
      }
    }

    // 纱线编码搜索组件
    const popOptions = {
      visible: false,
      title: '搜索功能',
      width: '1235px',
      footerOptions: {
        content: [
          {
            name: '确认',
            handle: (formDatas, form, table) => {
              if (!this.currentRow) {
                this.$message({
                  message: '请选择一条记录',
                  type: 'warning'
                })
                return
              }
              const row = { ...this.currentRow }
              const pm = this.$utils.deepClone(row)
              this.setParentDataHandle('materialInfoPage', pm)
              this.currentRow = null
              this.popHandle()
            }
          },
          {
            name: '取消',
            handle: (formDatas, form, table) => {
              this.popHandle()
            }
          }
        ]
      },
      popFormOptions: {
        content: {},
        formOptions: {
          // layout: true,
          syncDataHandle: (syncData) => {
            // console.log('pm', syncData)
          },
          inline: true,
          layout: true,
          labelWidth: '80px'
        }
      },
      popTableOptions: {
        loading: false,
        columns,
        highlightCurrentRow: true,
        currentRowKey: 'id',
        rowClick: (row, column, event) => {
          this.currentRow = row
        },
        dataSource: [],
        pagination
      }
    }
    return {
      popOptions,
      pagination,
      popsearchFormDatas: {}, // /弹窗搜索组件
      coYarnChemicalFiberSearch, // 化学纤维请求参数 ,CoYarnChemicalFiberSearchReq
      coYarnNaturalFiberSearchReq, // 天然纤维请求参数 ,CoYarnNaturalFiberSearchReq
      yarnCompositeSearchReq
    }
  },
  watch: {
    'popOptions.visible': {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        if (val) {
          this.getData()
        }
      }
    },
    tab: {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.setmaterialInfoPage(val)
      },
      deep: true,
      immediate: true
    }

  },
  created() {
  },
  mounted() {
  },
  methods: {
    popHandle() { // 纱线编码显隐
      this.popsearchFormDatas = {}
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
    },
    async getData(data = {}) {
      //  const params = { ...this.popsearchFormDatas, ...data, type: this.tab }
      const params = { ...data, type: this.tab }
      this.popOptions.popTableOptions.loading = true
      const tableData = await countryPage(params)
      const res = tableData.data
      const list = res.list || []
      const pagination = {
        ...this.popOptions.popTableOptions.pagination,
        ...data,
        dataTotal: res.total,
        currentPage: res.pageNum,
        pageSize: res.pageSize,
        pageNum: res.pageNum
      }
      this.$set(this.popOptions.popTableOptions, 'dataSource', list)
      this.$set(this.popOptions.popTableOptions, 'pagination', pagination)
      this.popOptions.popTableOptions.loading = false
    },
    setmaterialInfoPage(val) { // 根据不同的状态
      const com = this.$utils.deepClone(this.popOptions)
      if (val === '0') {
        com.popFormOptions.content = this.coYarnNaturalFiberSearchReq
      } else if (val === '1') {
        com.popFormOptions.content = this.coYarnChemicalFiberSearch
      } else if (val === '2') {
        com.popFormOptions.content = this.yarnCompositeSearchReq
      }
      this.$nextTick(() => {
        this.popOptions = com
      })
    },
    // 3种不同的类型需要区分显示
    searchPublic(params) {
      const dataCopy = this.$utils.deepClone(params)
      let obj = {}
      if (this.tab === '0') {
        const coYarnNaturalFiberSearchReq = {}
        coYarnNaturalFiberSearchReq.bdYarnCountUuid = this.setUUid(dataCopy.bdYarnCountUuid) // 纱支
        coYarnNaturalFiberSearchReq.bdIngredientsUuid = this.setUUid(dataCopy.bdIngredientsUuid) // 成份
        coYarnNaturalFiberSearchReq.bdCardingMethodUuid = this.setUUid(dataCopy.bdCardingMethodUuid) // 梳棉方法
        coYarnNaturalFiberSearchReq.bdSpinningMethodUuid = this.setUUid(dataCopy.bdSpinningMethodUuid) // 纺纱方法
        coYarnNaturalFiberSearchReq.bdYarnDyeingAdaptabilityUuid = this.setUUid(dataCopy.bdYarnDyeingAdaptabilityUuid) // 染色适应性
        coYarnNaturalFiberSearchReq.bdYarnTypeUuid = this.setUUid(dataCopy.bdYarnTypeUuid) // 纱类
        coYarnNaturalFiberSearchReq.ratio = dataCopy.ratio // 比例
        obj = { coYarnNaturalFiberSearchReq }
      } else if (this.tab === '1') {
        const coYarnChemicalFiberSearchReq = {}
        coYarnChemicalFiberSearchReq.bdFinenessUuid = this.setUUid(dataCopy.bdFinenessUuid) // 细度
        coYarnChemicalFiberSearchReq.bdIngredientsUuid = this.setUUid(dataCopy.bdIngredientsUuid) // 成份
        coYarnChemicalFiberSearchReq.bdSilkUuid = this.setUUid(dataCopy.bdSilkUuid) // 丝类
        coYarnChemicalFiberSearchReq.bdFunctionUuid = this.setUUid(dataCopy.bdFunctionUuid) // 功能
        coYarnChemicalFiberSearchReq.bdColorUuid = this.setUUid(dataCopy.bdColorUuid) // 颜色
        obj = { coYarnChemicalFiberSearchReq }
      } else if (this.tab === '2') {
        const yarnCompositeSearchReq = {}
        yarnCompositeSearchReq.bdComposeMethodUuid = this.setUUid(dataCopy.bdComposeMethodUuid) // 组合方式
        yarnCompositeSearchReq.bdYarnCountUuid = this.setUUid(dataCopy.bdYarnCountUuid) // 纱支
        yarnCompositeSearchReq.bdFinenessUuid = this.setUUid(dataCopy.bdFinenessUuid) // 细度
        yarnCompositeSearchReq.bdIngredientsUuid = this.setUUid(dataCopy.bdIngredientsUuid) // 成份
        obj = { yarnCompositeSearchReq }
      }
      this.getData(obj)
    },
    setlabel(data) {
      const sm = data && data.label ? data.label : ''
      return sm
    },
    setUUid(data) {
      const sm = data && data.value ? data.value : ''
      return sm
    },
    // 纱支、细度下拉 type: yarn纱支 fineness细度 combine组合
    getYarnSelect(type) {
      const com = this.popOptions.popFormOptions.content
      const GenericType = { type, enabled: 'Y' }
      this.getYarn(GenericType).then(res => {
        if (GenericType.type === 'yarn') { // 纱支
          this.$set(com._bdYarnCountUuid, 'dataSource', res)
        } else if (GenericType.type === 'fineness') { // 细度
          this.$set(com._bdFinenessUuid, 'dataSource', res)
        } else if (GenericType.type === 'bdFunctionId') {
          this.$set(com._bdFunctionId, 'dataSource', res) // hun
        }
      })
    },
    // 成份下拉
    getCompositionSelect(type) {
      const com = this.popOptions.popFormOptions.content
      if (type === 'naturalFiber') { // 成份组合成份
        this.getComposition({ enabled: 'Y' }).then(res => {
          this.$set(com._bdIngredientsUuid, 'dataSource', res)
        })
      }
    },
    // 梳棉方法
    CardingMethodClick(types) {
      const com = this.popOptions.popFormOptions.content
      if (types === 'bdCardingMethodUuid') { // 梳棉方法
        this.CardingMethod({ type: '3' }).then(res => {
          this.$set(com._bdCardingMethodUuid, 'dataSource', res)
        })
      } else if (types === 'bdSpinningMethodUuid') { // 纺纱方法
        this.CardingMethod({ type: '2' }).then(res => {
          this.$set(com._bdSpinningMethodUuid, 'dataSource', res)
        })
      } else if (types === 'bdYarnDyeingAdaptabilityUuid') { // 染色适应性
        this.CardingMethod({ type: '6' }).then(res => {
          this.$set(com._bdYarnDyeingAdaptabilityUuid, 'dataSource', res)
        })
      } else if (types === 'bdFunctionUuid') { // 功能
        this.CardingMethod({ type: '14' }).then(res => {
          this.$set(com._bdFunctionUuid, 'dataSource', res)
        })
      } else if (types === 'bdColorId') { // 颜色
        this.CardingMethod({ type: '18' }).then(res => {
          this.$set(com._bdColorUuid, 'dataSource', res)
        })
      } else if (types === 'bdComposeMethodUuid') { // 组合方式
        this.CardingMethod({ type: '21' }).then(res => {
          this.$set(com._bdComposeMethodUuid, 'dataSource', res)
        })
      }
    },
    // 纱类、丝类下拉 type: yarn纱类 silk丝类 combine组合
    getYarnTypeSelect(type) {
      const GenericType = { type, enabled: 'Y' }
      const com = this.popOptions.popFormOptions.content
      this.getYarnType(GenericType).then(res => {
        if (GenericType.type === 'yarn') { // 纱类
          this.$set(com._bdYarnTypeUuid, 'dataSource', res)
        } else if (GenericType.type === 'silk') { // 丝类
          this.$set(com._bdSilkUuid, 'dataSource', res)
        }
      })
    },
    popClose() {
      this.currentRow = null
      this.popsearchFormDatas = {}
    }

  }
}
</script>

<style lang="scss">
.popOptionsCode {
  .labeClassPadding{
    padding-right: 0px !important;
  }
  .labeClassName{
    &.labeClassRight{
      padding-right: 0px !important;
    }
    &.labeClassCOM{
      padding-right: 30px !important;
    }
    label {
      line-height: 18px;
      margin-left: 10px;
      white-space: pre-line;
    }
  }
}
</style>
