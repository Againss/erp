<!--
 * @Description: 弹窗
 * @Autor: zhengjin
 * @Date: 2021-06-26 17:39:07
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-08-06 17:04:24
-->
<template>
  <div>
    <el-drawer
      :title="options.title"
      :visible.sync="options.visible"
      :modal="true"
      :custom-class="options.customClass?options.customClass+' customDrawerclass':'customDrawerclass'"
      :wrapper-closable="options.wrapperClosable||false"
      :size="options.size||'480px'"
    >
      <div class="drawerBody">
        <div class="content customScrollbar">
          <cs-custom-form
            ref="customform"
            :data-source="options.content"
            :form-datas="options.formDatas"
            :pop-visible="options.visible"
          />
          <div class="yarn-btn">
            <div class="title">纱线组合</div>
            <div>
              <el-button
                style="margin-top: 11px"
                type="primary"
                size="mini"
                @click="OpenDialog"
              >添加</el-button>
            </div>
          </div>
          <cs-custom-table
            ref="singleTable"
            tooltip-effect="dark"
            border
            :columns="tabelColumns"
            :data-source="yarnData"
            :operates="tabelOperates"
          />
        </div>
        <div class="footer">
          <el-button @click="options.cancel()">取 消</el-button>
          <el-button type="primary" @click="ok">确 定</el-button>
        </div>
      </div>
    </el-drawer>
    <dialogs :options="dialogOptions" />
  </div>
</template>

<script>
import dialogs from '@/views/product-center/components/dialog'
import {
  naturalList,
  chemicalList,
  compositeList
} from '../../../yarn-management/combination-yarn/api'
export default {
  components: {
    dialogs
  },
  props: {
    options: {
      type: Object
    },
    order: {
      type: Object
    }
  },
  data() {
    // 纱线tabel
    const tabelColumns = [
      {
        prop: 'id',
        label: '序号',
        width: '80',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'code',
        label: '纱线SKU编码',
        labelClassName: 'product-is-request',
        className: 'product-no-request'
      }
    ]
    let tabelList = [
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        isShow: true,
        handle: async(params) => {
          this.$confirm(' 你确认要删除该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            this.yarnData.splice(params.$index, 1)
          }).catch(() => {})
        }
      }
    ]
    tabelList = this.$filterPermission(tabelList)
    const tabelOperates = {
      label: '操作',
      width: '100',
      dataSource: tabelList
    }
    // 天然纤维搜索
    const searchDataNatural = [
      {
        prop: 'code',
        itemType: 'input',
        label: '纱线编码:',
        itemStyle: { width: '50%' },
        placeholder: '请输入色纱/坯纱编码'
      },
      {
        prop: 'bdIngredientsUuid',
        label: '成分:',
        itemStyle: { width: '50%' },
        placeholder: '请选择成分',
        itemType: 'select',
        clearable: true,
        loading: true,
        filterable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('成分', 1)
          } else {
            this.setSelectData('成分', 1, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdYarnCountUuid',
        label: '纱支:',
        itemStyle: { width: '50%' },
        placeholder: '请选择纱支',
        itemType: 'select',
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('纱支', 2)
          } else {
            this.setSelectData('纱支', 2, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdYarnTypeUuid',
        label: '纱类:',
        itemStyle: { width: '50%' },
        placeholder: '请选择纱类',
        filterable: true,
        itemType: 'select',
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('纱类', 3)
          } else {
            this.setSelectData('纱类', 3, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdSpinningMethodUuid',
        label: '纺纱方法:',
        itemStyle: { width: '50%' },
        placeholder: '请选择纺纱方法',
        itemType: 'select',
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('纺纱方法', 4)
          } else {
            this.setSelectData('纺纱方法', 4, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdCardingMethodUuid',
        label: '梳棉方法:',
        itemStyle: { width: '50%' },
        placeholder: '请选择梳棉方法',
        itemType: 'select',
        filterable: true,
        clearable: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectData('梳棉方法', 5)
          } else {
            this.setSelectData('梳棉方法', 5, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'colorYarnColorCode',
        itemType: 'input',
        itemStyle: { width: '50%' },
        label: '染纱色号:',
        placeholder: '请输入染纱色号'
      },
      {
        prop: 'type',
        label: '类型:',
        itemStyle: { width: '50%' },
        placeholder: '请选择类型',
        itemType: 'select',
        clearable: true,
        dataSource: [
          {
            label: '全部',
            value: null
          },
          {
            label: '色纱',
            value: 2
          },
          {
            label: '坯纱',
            value: 1
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getList(params, '天然纤维')
          this.dialogOptions.searchFormDatas = params
        },
        resetHandle: () => {
          this.dialogOptions.searchFormDatas = {}
        }
      }
    ]
    const columnsNatural = [
      {
        prop: 'code',
        label: '纱线编码',
        minWidth: '180',
        fixed: true
      },
      {
        prop: 'embryoCode',
        label: '所属坯纱',
        minWidth: '180'
      },
      {
        prop: 'colorYarnColorCode',
        label: '染纱色号',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'ingredients',
        label: '成分',
        minWidth: '180',
        formater: (scope) => {
          return scope.row.ingredients && scope.row.ingredients.name
            ? scope.row.ingredients.name
            : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'ratio',
        label: '比例',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getRatio(scope.row.ratio)
        }
      },
      {
        prop: 'yarnCount',
        label: '纱支',
        minWidth: '180',
        formater: (scope) => {
          return scope.row.yarnCount && scope.row.yarnCount.name
            ? scope.row.yarnCount.name
            : ''
        }
      },
      {
        prop: 'yarnType',
        label: '纱类',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.yarnType && scope.row.yarnType.name
            ? scope.row.yarnType.name
            : ''
        }
      },
      {
        prop: 'spinningMethod',
        label: '纺纱方法',
        minWidth: '180',
        formater: (scope) => {
          return scope.row.spinningMethod && scope.row.spinningMethod.name
            ? scope.row.spinningMethod.name
            : ''
        }
      },
      {
        prop: 'cardingMethod',
        label: '梳棉方法',
        minWidth: '180',
        formater: (scope) => {
          return scope.row.cardingMethod && scope.row.cardingMethod.name
            ? scope.row.cardingMethod.name
            : ''
        }
      },
      {
        prop: 'shortWistDirection',
        label: '捻向',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.shortWistDirection &&
            scope.row.shortWistDirection.name
            ? scope.row.shortWistDirection.name
            : ''
        }
      },
      {
        prop: 'yarnDyeingAdaptability',
        label: '染色适应性',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnDyeingAdaptability &&
            scope.row.yarnDyeingAdaptability.name
            ? scope.row.yarnDyeingAdaptability.name
            : ''
        }
      }
    ]
    // 化学纤维搜索
    const searchDataChe = [
      {
        prop: 'code',
        itemType: 'input',
        itemStyle: { width: '50%' },
        label: '纱线编码:',
        placeholder: '请输入色纱/坯纱编码'
      },
      {
        prop: 'colorYarnColorCode',
        itemType: 'input',
        itemStyle: { width: '50%' },
        label: '染纱色号:',
        placeholder: '请输入染纱色号'
      },
      {
        prop: 'composeMethod',
        itemType: 'input',
        itemStyle: { width: '50%' },
        label: '组合方式:',
        placeholder: '请输入组合方式'
      },
      {
        prop: 'bdIngredientsUuid',
        itemStyle: { width: '50%' },
        label: '成分:',
        placeholder: '请选择成分',
        itemType: 'select',
        clearable: true,
        filterable: true,
        loading: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectDataChe('成分', 3)
          } else {
            this.setSelectDataChe('成分', 3, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdSilkUuid',
        itemStyle: { width: '50%' },
        label: '丝类:',
        placeholder: '请选择丝类',
        itemType: 'select',
        clearable: true,
        filterable: true,
        loading: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectDataChe('丝类', 4)
          } else {
            this.setSelectDataChe('丝类', 4, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdProductNameUuid',
        itemStyle: { width: '50%' },
        label: '品名:',
        placeholder: '请选择品名',
        itemType: 'select',
        clearable: true,
        filterable: true,
        loading: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectDataChe('品名', 5)
          } else {
            this.setSelectDataChe('品名', 5, true)
          }
        },
        dataSource: []
      },
      {
        prop: 'bdNetworkDegreeUuid',
        itemStyle: { width: '50%' },
        label: '网络度:',
        placeholder: '请选择网络度',
        itemType: 'select',
        clearable: true,
        filterable: true,
        loading: true,
        visibleChange: (flag) => {
          if (flag) {
            this.setSelectDataChe('网络度', 6)
          } else {
            this.setSelectDataChe('网络度', 6, true)
          }
        },
        dataSource: []
      },

      {
        prop: 'type',
        itemStyle: { width: '50%' },
        label: '类型:',
        placeholder: '请选择类型',
        itemType: 'select',
        clearable: true,
        dataSource: [
          {
            label: '全部',
            value: null
          },
          {
            label: '色纱',
            value: '2'
          },
          {
            label: '坯纱',
            value: '1'
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getList(params, '化学纤维')
          this.dialogOptions.searchFormDatas = params
        },
        resetHandle: () => {
          this.dialogOptions.searchFormDatas = {}
        }
      }
    ]
    const columnsChe = [
      {
        prop: 'code',
        label: '纱线编码',
        minWidth: '180',
        fixed: true,
        showOverflowTooltip: true
      },
      {
        prop: 'embryoCode',
        label: '坯纱编码',
        minWidth: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'colorYarnColorCode',
        label: '染纱色号',
        minWidth: '120',
        showOverflowTooltip: true
      },

      {
        prop: 'fineness',
        label: '细度',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row && scope.row.fineness && scope.row.fineness.name) || ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'ingredients',
        label: '成分',
        minWidth: '180',
        formater: (scope) => {
          return scope.row.ingredients && scope.row.ingredients.name
            ? scope.row.ingredients.name
            : ''
        }
      },
      {
        prop: 'productName',
        label: '品名',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row &&
              scope.row.productName &&
              scope.row.productName.name) ||
            ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'networkDegree',
        label: '网络度',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row &&
              scope.row.networkDegree &&
              scope.row.networkDegree.name) ||
            ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'gloss',
        label: '光泽度',
        minWidth: '120',
        formater: (scope) => {
          return (scope.row && scope.row.gloss && scope.row.gloss.name) || ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'sectionShape',
        label: '截面形状',
        minWidth: '180',
        formater: (scope) => {
          return (
            (scope.row &&
              scope.row.sectionShape &&
              scope.row.sectionShape.name) ||
            ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'silk',
        label: '丝类',
        minWidth: '120',
        formater: (scope) => {
          return (scope.row && scope.row.silk && scope.row.silk.name) || ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'functions',
        label: '功能',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row && scope.row.functions && scope.row.functions.name) || ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'longWistDirection',
        label: '捻向',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row &&
              scope.row.longWistDirection &&
              scope.row.longWistDirection.name) ||
            ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'colorMethod',
        label: '颜色',
        minWidth: '180',
        formater: (scope) => {
          return (
            (scope.row &&
              scope.row.colorMethod &&
              scope.row.colorMethod.name) ||
            ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'stretch',
        label: '弹力程度',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row && scope.row.stretch && scope.row.stretch.name) || ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'composeMethod',
        label: '组合方式',
        minWidth: '180',
        showOverflowTooltip: true
      }
    ]
    // 组合纱搜索
    const searchDataCom = [
      {
        prop: 'code',
        itemType: 'input',
        label: '纱线编码:',
        itemStyle: { width: '50%' },
        placeholder: '请输入色纱/坯纱编码'
      },
      {
        prop: 'codes',
        itemType: 'input',
        label: '组合编码:',
        itemStyle: { width: '50%' },
        placeholder: '请输入组合编码'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getList(params, '组合纱')
          this.dialogOptions.searchFormDatas = params
        },
        resetHandle: () => {
          this.dialogOptions.searchFormDatas = {}
        }
      }
    ]
    const columnsCom = [
      {
        prop: 'code',
        label: '纱线编码',
        minWidth: '180',
        fixed: true
      },
      {
        prop: 'colorYarnColorCode',
        label: '染纱色号',
        minWidth: '180'
      },
      {
        prop: 'composeMethod',
        label: '包合方式',
        minWidth: '180',
        formater: (scope) => {
          return scope.row.composeMethod ? scope.row.composeMethod.name : ''
        }
      },
      {
        prop: 'resilience',
        label: '是否弹力',
        minWidth: '100',
        formater: (scope) => {
          return scope.row.resilience === 1 ? '是' : '否'
        }
      },
      {
        prop: 'longWistDirection',
        label: '捻向',
        minWidth: '120',
        formater: (scope) => {
          return (
            (scope.row &&
              scope.row.longWistDirection &&
              scope.row.longWistDirection.name) ||
            ''
          )
        },
        showOverflowTooltip: true
      },
      {
        prop: 'combination',
        label: '纱线组合',
        minWidth: '300',
        formater: (scope) => {
          return (
            (scope.row.combination &&
              scope.row.combination.reduce((str, red) => {
                return (
                  str +
                  `${red.yarnClass === 1 ? '天然纤维' : '化学纤维'}-${red.yarnCode
                  }/${red.proportion}%<br>`
                )
              }, '')) ||
            ''
          )
        }
      },
      {
        prop: 'dataSource',
        label: '数据来源',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.dataSource === 1 ? '产品目录库' : '样板'
        }
      },
      {
        prop: 'productSource',
        label: '产品来源',
        minWidth: '120',
        formater: (scope) => {
          return scope.row.productSource === 1 ? '自有' : '外来'
        }
      }
    ]
    // 弹窗信息
    const dialogOptions = {
      visible: false,
      loading: true,
      title: '添加纱线',
      okText: '提交',
      activeTab: '天然纤维',
      cancelText: '取消',
      maxHeight: '370',
      closed: (params) => {
        this.dialogHandle(params) // 关闭选择
      },
      ok: (params) => {
        if (!params) {
          this.$message({
            type: 'warning',
            message: '请选择数据'
          })
          return
        }
        // console.log('type', this.yarnTypes)
        params.yarnTypes = this.yarnTypes
        this.yarnData.push(params)
        const res = new Map()
        this.yarnData = this.yarnData.filter((item) => !res.has(item.id) && res.set(item.id, 1))
        // console.log('去重选择纱线', this.yarnData)
        this.dialogHandle(false)
      }, // 确定选择
      tab: [{ name: '天然纤维' }, { name: '化学纤维' }, { name: '组合纱' }],
      tabHandleClick: (params) => {
        if (params === '天然纤维') {
          this.yarnTypes = 1
          this.dialogOptions.searchFormDatas = {}
          this.dialogOptions.activeTab = '天然纤维'
          this.dialogOptions.columns = columnsNatural
          this.dialogOptions.searchData = searchDataNatural
          this.getList({}, '天然纤维')
        } else if (params === '化学纤维') {
          this.yarnTypes = 2
          this.dialogOptions.searchFormDatas = {}
          this.getList({}, '化学纤维')
          this.dialogOptions.activeTab = '化学纤维'
          this.dialogOptions.columns = columnsChe
          this.dialogOptions.searchData = searchDataChe
        } else {
          this.dialogOptions.searchFormDatas = {}
          this.getList({}, '组合纱')
          this.yarnTypes = 3
          this.dialogOptions.activeTab = '组合纱'
          this.dialogOptions.columns = columnsCom
          this.dialogOptions.searchData = searchDataCom
        }
      },
      searchFormDatas: {}, // 搜索默认参数
      searchData: searchDataNatural, // 搜索字段
      dataSource: [], // table数据
      columns: columnsNatural,
      pagination: {
        pageSizes: [10],
        currentChange: (val) => {
          // 切换页数
          this.getList(
            {
              pageSize: 10,
              page: val
            },
            this.dialogOptions.activeTab
          )
        },
        sizeChange: (val) => {
          // 切换条数
          this.getList(
            {
              pageSize: val,
              page: this.dialogOptions.pagination.page || 1
            },
            this.dialogOptions.activeTab
          )
        }
      }
    }
    return {
      yarnTypes: 1,
      dialogOptions,
      tabelColumns,
      yarnData: [],
      tabelOperates
    }
  },
  computed: {
    form() {
      if (this.options.components && this.options.components.length || this.options.component) {
        return this.$refs.customform
      }
      return this.$refs.customform.form
    },
    formDatas() {
      if (this.options.components && this.options.components.length || this.options.component) {
        return this.$refs.customform
      }
      return this.$refs.customform.dynamicValidateFormRuleForm
    }
  },
  watch: {
    'options.visible'(val) {
      if (val && Object.keys(this.options.formDatas).length !== 0) {
        this.yarnData = this.options.formDatas.yarnData
      } else {
        this.yarnData = []
      }
    }
  },
  methods: {
    ok() {
      if (this.form.validate) {
        this.form.validate((valid) => {
          if (valid) {
            if (!this.yarnData.length) {
              this.$message({ type: 'warning', message: '请添加纱线' })
              return false
            }
            this.$confirm('请确认添加该数据吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.formDatas.yarnData = this.yarnData
              this.formDatas.yarnCode = this.getTextByJs(this.yarnData)
              this.options.ok(this.formDatas)
            }).catch(() => {})
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    // Dialog弹窗
    OpenDialog() {
      this.getList({}, this.dialogOptions.activeTab)
      this.$set(this.dialogOptions, 'visible', true)
    },
    dialogHandle(flag) {
      this.$set(this.dialogOptions, 'visible', flag)
    },
    // 比例
    getRatio(ratio) {
      if (ratio && ratio.length) {
        return ratio.reduce((str, item) => {
          return str ? str + '/' + item.ratio : str + item.ratio
        }, '')
      }
      return ''
    },
    // 纱线弹窗获取列表
    async getList(data = {}, type) {
      let res
      this.dialogOptions['loading'] = true
      if (type === '天然纤维') {
        res = await naturalList({
          ...this.dialogOptions.searchFormDatas,
          ...data,
          pageSize: 10
        })
      } else if (type === '化学纤维') {
        res = await chemicalList({
          ...this.dialogOptions.searchFormDatas,
          ...data,
          pageSize: 10
        })
      } else {
        res = await compositeList({
          ...this.dialogOptions.searchFormDatas,
          ...data,
          pageSize: 10
        })
      }
      // console.log('用户列表', res)
      res.code === 200 ? this.dialogOptions['loading'] = false : null
      const userList = res.data.list || []
      this.$set(this.dialogOptions, 'dataSource', userList)
      this.$set(this.dialogOptions, 'pagination', {
        ...this.dialogOptions.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.page,
        pageSize: res.data.pageSize
      })
    },
    // 纱线数据处理 拼接字符串
    getTextByJs(arr) {
      var str = ''
      for (var i = 0; i < arr.length; i++) {
        str += arr[i].code + ','
      }
      // 去掉最后一个逗号(如果不需要去掉，就不用写)
      if (str.length > 0) {
        str = str.substr(0, str.length - 1)
      }
      return str
    }
  }
}
</script>

<style lang="scss" scoped>
.drawerBody {
  .customScrollbar {
    padding-bottom: 20px;
  }
  .yarn-btn {
    display: flex;
    justify-content: space-between;
    .title {
      color: #606266;
      font-size: 15px;
      line-height: 50px;
    }
  }
  .footer {
    text-align: center;
  }
}
</style>
