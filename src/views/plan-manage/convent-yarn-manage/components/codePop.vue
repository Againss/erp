<template>
  <div class="convent-yarn-codePop pop">
    <cs-custom-popsearch ref="multipleTable" :options="popOptions" />
  </div>
</template>

<script>
import { materialInfoPage, generalYarnAdd, ingredients, yarnTypes } from '../api/index.js'
export default {
  name: 'CodePop',
  props: {
    addType: {
      type: Number,
      default: 0
    },
    parentData: {
      type: Array
    }
  },
  data() {
    const itemStyle = { width: '33%' }
    // 新建窗体列表
    const publicOneColumns = {
      _yarnCode: {
        prop: 'yarnCode',
        label: '纱线编码',
        minWidth: '150'
      },
      _yarnName: {
        prop: 'yarnName',
        label: '纱名',
        minWidth: '200',
        showOverflowTooltip: true,
        isShow: scope => {
          return this.addType !== 2
        }
      },
      _yarnProperty: {
        prop: 'yarnProperty',
        label: '纱属性',
        minWidth: '180',
        showOverflowTooltip: true,
        isShow: scope => {
          return this.addType !== 2
        }
      }
    }
    // 天然纤维搜索项
    const naturalContent = {
      _code: {
        prop: 'code',
        itemType: 'input',
        label: '纱线编码',
        clearable: true,
        placeholder: '请输入',
        itemStyle
      },
      _bdIngredientsUuid: {
        prop: 'bdIngredientsUuid',
        itemType: 'select',
        label: '成份',
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        itemStyle,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.ingredients('naturalContent')
          }
        }
      },
      _bdYarnCountUuid: {
        prop: 'bdYarnCountUuid',
        itemType: 'select',
        label: '纱支',
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        itemStyle,
        visibleChange: value => {
          if (value) {
            this.yarnTypes('9', '_bdYarnCountUuid', 'naturalContent')
          }
        }
      },

      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const postData = this.$utils.deepClone(params)
          postData.bdIngredientsUuid = postData.bdIngredientsUuid ? postData.bdIngredientsUuid.value : ''
          postData.bdYarnCountUuid = postData.bdYarnCountUuid ? postData.bdYarnCountUuid.value : ''
          postData.bdSpinningMethodUuid = postData.bdSpinningMethodUuid ? postData.bdSpinningMethodUuid.value : ''
          postData.bdCardingMethodUuid = postData.bdCardingMethodUuid ? postData.bdCardingMethodUuid.value : ''
          postData.bdYarnDyeingAdaptabilityUuid = postData.bdYarnDyeingAdaptabilityUuid ? postData.bdYarnDyeingAdaptabilityUuid.value : ''
          postData.bdYarnTypeUuid = postData.bdYarnTypeUuid ? postData.bdYarnTypeUuid.value : ''
          this.searFormData = { ...params, ...postData }
          this.searchPublic()
        },
        style: {
          display: 'inline-block'
        },
        resetHandle: () => {}
      },
      _ratio: {
        prop: 'ratio',
        itemType: 'input',
        label: '比例',
        clearable: true,
        placeholder: '请输入',
        itemStyle
      },
      _bdSpinningMethodUuid: {
        prop: 'bdSpinningMethodUuid',
        itemType: 'select',
        label: '纺纱方法',
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        itemStyle,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.yarnTypes('2', '_bdSpinningMethodUuid', 'naturalContent')
          }
        }
      },
      _bdCardingMethodUuid: {
        prop: 'bdCardingMethodUuid',
        itemType: 'select',
        label: '梳棉方法',
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        itemStyle,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.yarnTypes('3', '_bdCardingMethodUuid', 'naturalContent')
          }
        }
      },
      _bdYarnDyeingAdaptabilityUuid: {
        prop: 'bdYarnDyeingAdaptabilityUuid',
        itemType: 'select',
        label: '染纱适应性',
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        itemStyle,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.yarnTypes('6', '_bdYarnDyeingAdaptabilityUuid', 'naturalContent')
          }
        }
      },
      _bdYarnTypeUuid: {
        prop: 'bdYarnTypeUuid',
        itemType: 'select',
        label: '纱类',
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        itemStyle,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.yarnTypes('1', '_bdYarnTypeUuid', 'naturalContent')
          }
        }
      }
    }
    // 化学纤维搜索项、
    const chemicalContent = {
      _code: {
        prop: 'code',
        itemType: 'input',
        label: '纱线编码',
        clearable: true,
        placeholder: '请输入',
        itemStyle
      },
      _bdIngredientsUuid: {
        prop: 'bdIngredientsUuid',
        itemType: 'select',
        label: '成份',
        itemStyle,
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.ingredients('chemicalContent')
          }
        }
      },
      _bdProductNameUuid: {
        prop: 'bdProductNameUuid',
        itemType: 'select',
        label: '丝类',
        itemStyle,
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.yarnTypes('4', '_bdProductNameUuid', 'chemicalContent')
          }
        }
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const postData = this.$utils.deepClone(params)
          postData.bdIngredientsUuid = postData.bdIngredientsUuid ? postData.bdIngredientsUuid.value : ''
          postData.bdProductNameUuid = postData.bdProductNameUuid ? postData.bdProductNameUuid.value : ''
          postData.bdSectionShapeUuid = postData.bdSectionShapeUuid ? postData.bdSectionShapeUuid.value : ''
          postData.bdNetworkDegreeUuid = postData.bdNetworkDegreeUuid ? postData.bdNetworkDegreeUuid.value : ''
          postData.bdWistDirectionUuid = postData.bdWistDirectionUuid ? postData.bdWistDirectionUuid.value : ''
          postData.bdSilkUuid = postData.bdSilkUuid ? postData.bdSilkUuid.value : ''
          postData.bdStretchUuid = postData.bdStretchUuid ? postData.bdStretchUuid.value : ''
          postData.bdGlossUuid = postData.bdGlossUuid ? postData.bdGlossUuid.value : ''
          this.searFormData = { ...params, ...postData }
          this.searchPublic()
        },
        style: {
          display: 'inline-block'
        },
        resetHandle: () => {}
      },
      _bdSectionShapeUuid: {
        prop: 'bdSectionShapeUuid',
        itemType: 'select',
        label: '截面形状',
        itemStyle,
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.yarnTypes(16, '_bdSectionShapeUuid', 'chemicalContent')
          }
        }
      },
      _bdNetworkDegreeUuid: {
        prop: 'bdNetworkDegreeUuid',
        itemType: 'select',
        label: '网络度',
        itemStyle,
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.yarnTypes(15, '_bdNetworkDegreeUuid', 'chemicalContent')
          }
        }
      },
      _bdWistDirectionUuid: {
        prop: 'bdWistDirectionUuid',
        itemType: 'select',
        label: '捻向',
        itemStyle,
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.yarnTypes(17, '_bdWistDirectionUuid', 'chemicalContent')
          }
        }
      },
      _bdSilkUuid: {
        prop: 'bdSilkUuid',
        itemType: 'select',
        label: '特殊丝',
        itemStyle,
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.yarnTypes(13, '_bdSilkUuid', 'chemicalContent')
          }
        }
      },
      _bdStretchUuid: {
        prop: 'bdStretchUuid',
        itemType: 'select',
        label: '弹力程度',
        itemStyle,
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.yarnTypes(19, '_bdStretchUuid', 'chemicalContent')
          }
        }
      },
      _bdGlossUuid: {
        prop: 'bdGlossUuid',
        itemType: 'select',
        label: '光泽度',
        itemStyle,
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.yarnTypes(5, '_bdGlossUuid', 'chemicalContent')
          }
        }
      }
    }
    // 组合纤维搜索项
    const compositeContent = {
      _code: {
        prop: 'code',
        itemType: 'input',
        label: '纱线编码',
        clearable: true,
        placeholder: '请输入',
        itemStyle
      },
      _bbdComposeMethodUuid: {
        prop: 'bdComposeMethodUuid',
        itemType: 'select',
        label: '组合方式',
        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        itemStyle,
        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.yarnTypes('21', '_bbdComposeMethodUuid', 'compositeContent')
          }
        }
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const postData = this.$utils.deepClone(params)
          postData.bdComposeMethodUuid = postData.bdComposeMethodUuid ? postData.bdComposeMethodUuid.value : ''
          this.searFormData = { ...params, ...postData }
          this.searchPublic()
        },
        style: {
          display: 'inline-block'
        },
        resetHandle: () => {}
      }
    }
    // const copyContent = this.addType === 0 ? naturalContent : (this.addType === 1 ? chemicalContent : compositeContent)
    // 新建常规纱弹出层用的配置信息
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      className: 'conventDialog',
      title: '新建',
      // okText: '确定',
      footerOptions: {
        content: [
          {
            name: '设为常规纱',
            style: { background: '#0986FF', color: '#fff' },
            handle: (formDatas, form, table) => {
              console.log(formDatas, form, table)
              this.handleAdd()
            }
          },
          {
            name: '取消',
            handle: (formDatas, form, table) => {
              console.log(formDatas, form, table)
              this.popOptions.visible = false
            }
          }
        ]
      },
      popFormOptions: {
        content: {},
        formOptions: {
          // layout: true,
          syncDataHandle: syncData => {
            // this.popsearchFormDatas = syncData
          },
          size: 'small',
          inline: true,
          layout: true
        },
        formDatas: { }
      },
      popTableOptions: {
        headerCellStyle: { 'background-color': '#F5F7FA', 'height': '40px', 'padding': '0' },
        className: 'pop-table',
        itemType: 'table-form',
        rowStyle: { 'background-color': '#fff' },
        layout: true,
        prop: 'noteDialogTable',
        selectionChange: (val) => {
          this.selectionDialog = val
        //   this.selectNote(val)
        },
        columns: {
          _selection: {
            prop: 'id',
            type: 'selection',
            // fixed: 'left',
            selectable: (scope) => {
              return !scope.dialogDisabled
            }
          },
          _index: {
            prop: 'index',
            label: '序号',
            formater: scope => {
              return scope.$index + 1
            },
            minWidth: '50'
          },
          ...publicOneColumns
        },
        dataSource: [],
        pagination
      }
    }

    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getData({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: val => {
        this.getData({ pageNum: 1, pageSize: val })
      }
    }
    return {
      popOptions,
      selectionDialog: [],
      pagination,
      naturalContent,
      chemicalContent,
      compositeContent,
      searFormData: {}
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
    addType: {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.setmaterialInfoPage(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async getData(data = {}) {
      data.type = this.addType
      const obj = { 0: 'naturalReq', 1: 'chemicalReq', 2: 'compositeReq' }
      const params = {}
      params[obj[this.addType]] = this.searFormData

      const res = await materialInfoPage({ ...data, ...params })
      res.data.list &&
        res.data.list.map((item, index) => {
          item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1
        })

      const listData = res.data.list ? res.data.list : []
      this.dataSource = listData || []

      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageNum: res.data.pageNum
      }
      // this.$set(this.popOptions.popTableOptions, 'dataSource', this.dataSource)
      this.$set(this.popOptions.popTableOptions, 'pagination', this.pagination)

      for (let i = 0; i < this.parentData.length; i++) {
        for (let j = 0; j < this.dataSource.length; j++) {
          if (this.parentData[i].yarnCode === this.dataSource[j].yarnCode) {
            this.$nextTick(() => {
              this.dataSource[j].dialogDisabled = true
              // this.$refs.multipleTable.$refs.poptable.$refs.table.toggleRowSelection(this.dataSource[j], true)
            })
          } else {
            this.dataSource[j].dialogDisabled = false
          }
        }
      }
      setTimeout(() => {
        const tempArr = []
        for (let i = 0; i < this.dataSource.length; i++) {
          if (this.dataSource[i].dialogDisabled) {
            tempArr.push(this.dataSource[i])
          } else {
            tempArr.unshift(this.dataSource[i])
          }
        }
        this.dataSource = tempArr
        this.$set(this.popOptions.popTableOptions, 'dataSource', this.dataSource)
        this.$nextTick(() => {
          this.dataSource.forEach((i) => {
            if (i.dialogDisabled) {
              this.$refs.multipleTable.$refs.poptable.$refs.table.toggleRowSelection(i, true)
            }
          })
        })
      }, 0)
    },
    searchPublic(params) {
      this.getData(params)
    },
    setmaterialInfoPage(val) { // 根据不同类型设置不同弹框配置
      const com = this.$utils.deepClone(this.popOptions)
      const obj = { 0: 'naturalContent', 1: 'chemicalContent', 2: 'compositeContent' }
      com.popFormOptions.content = this[obj[val]]
      this.$nextTick(() => {
        this.popOptions = com
      })
    },
    // 新建
    async handleAdd() {
      if (this.selectionDialog.length === 0) {
        this.$message.error('请先选择记录!')
      } else {
        const apsGeneralYarnAddReqs = []
        for (let i = 0; i < this.selectionDialog.length; i++) {
          if (!this.selectionDialog[i].dialogDisabled) { // 过滤掉已经设为常规纱的编码
            apsGeneralYarnAddReqs.push({
              yarnCode: this.selectionDialog[i].yarnCode,
              yarnName: this.selectionDialog[i].yarnName,
              yarnAttributes: this.selectionDialog[i].yarnProperty,
              yarnType: this.addType
            })
          }
        }
        if (apsGeneralYarnAddReqs.length === 0) {
          this.$message.error('请先选择记录!')
          return false
        }
        const params = {
          apsGeneralYarnAddReqs: apsGeneralYarnAddReqs
        }
        const res = await generalYarnAdd(params)
        if (!res || res.code !== 200) {
          return false
        }
        this.$message.success('设置成功')
        this.popOptions.visible = false
        this.$emit('searchData')
      }
    },
    // 获取成份下拉框
    async ingredients(key) {
      const res = await ingredients({ enabled: 'Y' })
      const data = (res.data || []).map(item => {
        return { value: item.uuid, label: item.name }
      })
      this.$set(this[key]._bdIngredientsUuid, 'dataSource', data)
    },
    // 获取梳棉方法/纺纱方法/染色适应性/纱类...下拉框
    async yarnTypes(categoryId, key, contentKey) {
      const res = await yarnTypes({ enabled: 'Y', categoryId: categoryId })
      const data = (res.data || []).map(item => {
        return { value: item.uuid, label: item.name }
      })
      this.$set(this[contentKey][key], 'dataSource', data)
    }

  }
}
</script>

<style lang="scss" scoped>
    .conventDialog {
    /deep/.el-dialog {
      width: 1185px !important;
    }
  }
</style>
