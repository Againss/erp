<!--
 * @Date: 2020-10-14 10:13:52
 * @Author: Againss
 * @LastEditTime: 2021-08-05 20:16:53
 * @LastEditors: zhengjin
 * @Descripttion: 坯布列表详情纱线选择部分跟单一成分比例部分
-->
<template>
  <div>
    <!-- 纱线table -->
    <div class="tableitem">
      <div class="titleitem">
        <div
          class="title"
          :class="{ 'product-is-request': isEdit }"
        >坯布纱线组合</div>
        <div>
          <el-button
            v-if="isEdit && isYarn"
            style="margin-top: 10px"
            type="primary"
            size="mini"
            @click="dialogHandler"
          >添加纱线</el-button>
        </div>
      </div>
      <cs-custom-table
        ref="dataTable"
        row-key="yarnId"
        class="table product-style-table"
        :header-cell-style="{
          background: '#F5F7FA!important',
        }"
        show-summary
        :summary-method="getSummaries"
        :row-drag="isEdit ? rowDrag : null"
        tooltip-effect="dark"
        :columns="yarnColumns"
        :data-source="yarnData"
        :operates="isEdit ? yarnOperates : null"
      />
    </div>
    <!-- <div class="msgee">合计（成份比例%）：<span>{{ counter }}</span></div> -->
    <!-- 纱线成份 -->
    <div class="tableitem">
      <div class="titleitem">
        <div class="title indent">单一成分比例</div>
      </div>
      <cs-custom-table
        class="table"
        size="mini"
        :header-cell-style="{
          background: '#F5F7FA!important',
        }"
        :columns="columnsI"
        :data-source="dataSourceI"
      />
    </div>
    <dialogs :options="dialogOptions" />
    <!-- 设置纱长弹出层 -->
    <dialog-item :pop-options="popOptions" :visible="visible" :order="order" />
  </div>
</template>

<script>
import dialogs from '@/views/product-center/components/dialog'
import dialogItem from './dialog'
import { publicSelectList } from '../../../api'
import {
  naturalList,
  chemicalList,
  compositeList
} from '../../../yarn-management/combination-yarn/api'
import {
  ingredientsList as ingredientsListChe
} from '../../../yarn-management/chemical-fiber/api'
import { ingredientsList } from '../../../yarn-management/natural-fiber/api'

export default {
  components: { dialogs, dialogItem },
  props: {
    order: {
      type: Object
    },
    isEdit: {
      type: Boolean
    }
  },
  data() {
    // 纱线组合tabel
    const yarnColumns = [
      {
        prop: 'yarnId',
        label: '序号',
        width: '100',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'yarnType',
        label: '纱线类型',
        width: '150',
        formater: (scope) => {
          return scope.row.yarnType === 1 ? '天然纤维' : scope.row.yarnType === 2 ? '化学纤维' : '组合纱'
        }
      },
      {
        prop: 'code',
        label: '纱线编码',
        minWidth: '150'
      },
      {
        prop: 'ingredientsValue',
        label: '成分',
        showOverflowTooltip: true,
        minWidth: '200',
        formater: (scope) => {
          return scope.row.ingredientsValue || scope.row.ingredientsName
        }
      },
      {
        prop: 'ratio',
        label: '比例%',
        width: '100',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        formater: (scope) => {
          return scope.row.ratio || scope.row.ratio
        }
      },
      {
        prop: 'length',
        label: '纱长/cm',
        minWidth: '200',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.getYarnVelue(scope.row)
        }
      }
    ]
    let yarnList = [
      {
        label: '编辑',
        isShow: true,
        handle: async(params) => {
          // 记录当前编辑行
          this.curIndex = params.$index
          this.popOptions['data'] = this.$utils.deepClone(params.row)
          this.PopDialogHandle(true)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        isShow: false,
        handle: async(params) => {
          this.$confirm(' 你确认要删除该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            this.yarnData.splice(params.$index, 1)
            this.$emit('setYarn', this.yarnData)
          })
        }
      }
    ]
    yarnList = this.$filterPermission(yarnList)
    const yarnOperates = {
      label: '操作',
      width: '150',
      dataSource: yarnList
    }
    // 单一成分数据
    const columnsI = [
      {
        prop: 'raito',
        label: '序号',
        width: '100',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'ingredients',
        label: '成分'
      },
      {
        prop: 'ratio',
        label: '比例/%'
      }
    ]
    // 设置纱长
    const popOptions = {
      title: '设置纱长',
      ok: (params) => {
        this.yarnData[this.curIndex].ratio = params.ratio
        this.yarnData[this.curIndex].holeType = params.holeType
        this.yarnData[this.curIndex].holeNumber = params.holeNumber
        this.yarnData[this.curIndex].length = params.length
        this.PopDialogHandle(false)
      },
      cancel: () => {
        this.PopDialogHandle(false)
      },
      data: {},
      popDialogHandle: () => {
        this.PopDialogHandle(false)
      }
    }
    // pop组合纱tabel
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
    // 搜索组合纱
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
    // pop天然纤维tabel
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
        }
      },
      {
        prop: 'ratio',
        label: '比例',
        minWidth: '100',
        formater: (scope) => {
          return this.getRatio(scope.row.ratio)
        }
      },
      {
        prop: 'yarnCount',
        label: '纱支',
        minWidth: '100',
        formater: (scope) => {
          return scope.row.yarnCount && scope.row.yarnCount.name
            ? scope.row.yarnCount.name
            : ''
        }
      },
      {
        prop: 'yarnType',
        label: '纱类',
        minWidth: '180',
        formater: (scope) => {
          return scope.row.yarnType && scope.row.yarnType.name
            ? scope.row.yarnType.name
            : ''
        }
      },
      {
        prop: 'spinningMethod',
        label: '纺纱方法',
        minWidth: '100',
        formater: (scope) => {
          return scope.row.spinningMethod && scope.row.spinningMethod.name
            ? scope.row.spinningMethod.name
            : ''
        }
      },
      {
        prop: 'cardingMethod',
        label: '梳棉方法',
        minWidth: '120',
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
        minWidth: '200',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.yarnDyeingAdaptability &&
            scope.row.yarnDyeingAdaptability.name
            ? scope.row.yarnDyeingAdaptability.name
            : ''
        }
      }
    ]
    // pop化学纤维tabel
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
        minWidth: '180',
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
        minWidth: '200',
        formater: (scope) => {
          return scope.row.ingredients && scope.row.ingredients.name
            ? scope.row.ingredients.name
            : ''
        }
      },
      {
        prop: 'productName',
        label: '品名',
        minWidth: '150',
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
        minWidth: '120',
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
        minWidth: '150',
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
        minWidth: '120',
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
        minWidth: '120',
        // formater: (scope) => {
        //   return (
        //     (scope.row &&
        //       scope.row.ingredients &&
        //       scope.row.ingredients.name) ||
        //     ""
        //   );
        // },
        showOverflowTooltip: true
      }
      // {
      //   prop: 'bdYarnLevel',
      //   label: '纱线等级',
      //   minWidth: '80',
      //   showOverflowTooltip: true
      // }
    ]
    // 搜索天然纤维
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
    // 搜索化学纤维
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
          // this.getList({}, '化学纤维')
        }
      }
    ]
    // 弹窗dialog信息
    const dialogOptions = {
      visible: false,
      loading: true,
      title: '添加纱线',
      okText: '提交',
      activeTab: '天然纤维',
      cancelText: '取消',
      Height: '400px',
      closed: (params) => {
        this.dialogHandle(params) // 关闭选择
      },
      ok: (params) => { // 确定选择
        if (!params) {
          this.$message({
            type: 'warning',
            message: '请选择数据'
          })
          return
        }
        this.addYarn(params)
        // 去重
        this.yarnData = this.setRemoval(this.yarnData)
        this.dialogHandle(false)
        this.$emit('setYarn', this.yarnData)
        this.$emit('UpData', this.yarnData)
      },
      tab: [{ name: '天然纤维' }, { name: '化学纤维' }, { name: '组合纱' }],
      tabHandleClick: (params) => {
        if (params === '天然纤维') {
          this.dialogOptions.searchFormDatas = {}
          this.dialogOptions.activeTab = '天然纤维'
          this.dialogOptions.columns = columnsNatural
          this.dialogOptions.searchData = searchDataNatural
          this.getList({}, '天然纤维')
        } else if (params === '化学纤维') {
          this.dialogOptions.searchFormDatas = {}
          this.getList({}, '化学纤维')
          this.dialogOptions.activeTab = '化学纤维'
          this.dialogOptions.columns = columnsChe
          this.dialogOptions.searchData = searchDataChe
        } else {
          this.dialogOptions.searchFormDatas = {}
          this.getList({}, '组合纱')
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
    // const popOperates = {
    //   label: '操作',
    //   width: '140',
    //   fixed: 'right',
    //   dataSource: [
    //     {
    //       label: '删除',
    //       permitTag: ['userCenter:sysPermit:modify'],
    //       isShow: true,
    //       style: { 'color': '#FE4949' },
    //       handle: async(params) => {
    //         this.$confirm(' 你确认要删除该数据吗？', '提示', {
    //           confirmButtonText: '确定',
    //           cancelButtonText: '取消',
    //           type: 'warning'
    //         }).then(async() => {
    //           this.dataSourceY[0].dataSource.splice(params.$index, 1)
    //           this.dataSourceY[0].dataSource.forEach((item, index) => {
    //             item.seq = index + 1
    //           })
    //           this.$emit('setYarn', this.dataSourceY[0].dataSource)
    //         })
    //       }
    //     }
    //   ]
    // }
    // 纱线组合
    const rowDrag = {
      onEnd: (evt, newDataSource) => {
        this.$nextTick(() => {
          this.yarnData = newDataSource
        })
      }
    }
    // const dataSourceY = [
    //   {
    //     prop: 'tableForm',
    //     itemType: 'table-form',
    //     dataSource: [],
    //     size: 'mini',
    //     showSummary: true,
    //     summaryMethod: this.getSummaries,
    //     headerCellStyle: {
    //       background: '#F5F7FA!important'
    //     },
    //     operates: null
    //   }
    // ]
    return {
      // 组合纱按钮
      isYarn: false,
      // dialog弹窗
      dialogOptions,
      // pop纱长
      visible: false,
      popOptions,
      // 纱长
      length: [],
      // dataSourceY,
      // popOperates,
      curIndex: -1,
      isComputerJacquard: 0,
      // 纱线组合
      rowDrag,
      yarnColumns,
      yarnData: [],
      yarnList,
      yarnOperates,
      columnsI,
      counter: 0
    }
  },
  computed: {
    dataSourceI() {
      // console.log('成份', this.order, this.yarnData)
      if (!this.isEdit) {
        return this.order.ratio.map((item) => {
          item.ingredients = item.ingredients && item.ingredients.name
          return item
        })
      }
      const arr = this.yarnData.map((item1) => {
        return (
          item1.ingredientsArr && item1.ingredientsArr.map((item2) => {
            const s = (((item2.ratio * 100 || 0) * (Number(item1.ratio) * 100)) / 1000000).toFixed(2)
            return {
              ingredients: item2.ingredients,
              bdIngredientsUuid: item2.bdIngredientsUuid,
              ratio: s
            }
          })
        )
      })
      // console.log(arr, '成份')
      const a = arr && arr.flat().sort(function(a, b) {
        return b.ratio - a.ratio
      })
      return (a && a.reduce((prev, item, index) => {
        const sameNameItem = prev.find(
          (v) => v.bdIngredientsUuid === item.bdIngredientsUuid
        )
        if (sameNameItem) {
          sameNameItem.ratio =
            ((sameNameItem.ratio * 1000000 + item.ratio * 1000000) / 1000000).toFixed(2)
        } else {
          prev.push(item)
        }
        return prev
      }, []))
    }
  },
  watch: {
    'order.bdFabricationProduceModeKnitValue': {
      handler(newObj, old) {
        if (newObj === '净色') {
          this.isYarn = true
          this.$set(this.yarnList[1], 'isShow', true)
        } else {
          this.isYarn = false
          this.$set(this.yarnList[1], 'isShow', false)
        }
      }
    },
    'order.combination': {
      handler(combination) {
        combination.forEach((item) => {
          item.isEdit = this.isEdit
        })
        var list = (combination.length && combination) || []
        // console.log(list, 'combination更新了')
        this.yarnData = list
        // this.getSummation()
      },
      deep: true
    }
  },
  created() {
    // if (this.$route.params.id) {
    //   this.dataSourceY[0].showSummary = false
    // }
  },
  methods: {
    // 化学纤维
    async setSelectDataChe(typeName, index, init = false) {
      if (init) {
        this.$set(this.dialogOptions.searchData[index], 'dataSource', [])
        this.$set(this.dialogOptions.searchData[index], 'loading', true)
      } else {
        let res = null
        switch (typeName) {
          case '成分':
            res = await ingredientsListChe()
            break
          case '丝类':
            res = await publicSelectList({ 'categoryId': 13 })
            break
          case '品名':
            res = await publicSelectList({ 'categoryId': 4 })
            break
          case '网络度':
            res = await publicSelectList({ 'categoryId': 15 })
            break
        }
        let data = []
        if (res.data && res.data.list) {
          data = res.data.list.map((item) => {
            item.label = item.name
            item.value = item.uuid
            return item
          })
        } else {
          data = res.data.map((item) => {
            item.label = item.name
            item.value = item.uuid
            return item
          })
        }
        this.$set(this.dialogOptions.searchData[index], 'dataSource', data)
        this.$set(this.dialogOptions.searchData[index], 'loading', false)
      }
    },
    // 搜索数据源
    async setSelectData(typeName, index, init = false) {
      if (init) {
        this.$set(this.dialogOptions.searchData[index], 'dataSource', [])
        this.$set(this.dialogOptions.searchData[index], 'loading', true)
      } else {
        let res = null
        switch (typeName) {
          case '成分':
            res = await ingredientsList()
            break
          case '纱支':
            res = await publicSelectList({ 'categoryId': 9 })
            break
          case '纱类':
            res = await publicSelectList({ 'categoryId': 1 })
            break
          case '纺纱方法':
            res = await publicSelectList({ 'categoryId': 2 })
            break
          case '梳棉方法':
            res = await publicSelectList({ 'categoryId': 3 })
            break
        }
        let data = []
        if (typeName === '成分') {
          if (res.data && res.data.list.length) {
            data = res.data.list.map((item) => {
              item.label = item.name
              item.value = item.uuid + '-' + item.type
              return item
            })
          }
        } else {
          data = res.data.map((item) => {
            item.label = item.name
            item.value = item.uuid
            return item
          })
        }
        this.$set(this.dialogOptions.searchData[index], 'dataSource', data)
        this.$set(this.dialogOptions.searchData[index], 'loading', false)
      }
    },
    // 手动设置纱线组合
    setCombination(data) {
      this.yarnData = data
    },
    // 添加纱线弹窗
    dialogHandler() {
      this.getList({}, this.dialogOptions.activeTab)
      this.$set(this.dialogOptions, 'visible', true)
    },
    // 添加纱线弹窗
    dialogHandle(flag) {
      this.$set(this.dialogOptions, 'visible', flag)
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
    // 修改pop弹出层的判断
    PopDialogHandle(val) {
      this.visible = val
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
    // 合计行
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index === 4) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    getSummation() {
      if (this.yarnData.length === 0) return
      const count = this.yarnData.reduce((counter, obj) => {
        counter += Number(obj.ratio)
        return counter
      }, 0)
      this.counter = count
    },
    // 添加纱线组合
    addYarn(params) {
      const arr = []
      if (this.dialogOptions.activeTab === '组合纱') {
        params && params.combination && params.combination.forEach((item) => {
          item.combinationList && item.combinationList.forEach((val) => {
            arr.push({
              ingredients: (val.ingredients && val.ingredients.name) || '',
              bdIngredientsUuid: (val.ingredients && val.ingredients.uuid) || '',
              ratio: (val.ratio * item.proportion) / 100
            })
          })
        })
      } else if (this.dialogOptions.activeTab === '天然纤维') {
        params.ratio.forEach((item) => {
          arr.push({
            ingredients: item.ingredients && item.ingredients.name,
            bdIngredientsUuid: item.ingredients && item.ingredients.uuid,
            ratio: item.ratio
          })
        })
      } else {
        arr.push({
          ingredients: params.ingredients && params.ingredients.name,
          bdIngredientsUuid: params.ingredients && params.ingredients.uuid,
          ratio: 100
        })
      }
      const nameArr =
        params &&
        params.combination &&
        params.combination.map((item) => {
          return (
            item.combinationIngredients &&
            item.combinationIngredients.ingredientsInfo &&
            item.combinationIngredients.ingredientsInfo.name
          )
        })
      const str =
        this.dialogOptions.activeTab !== '组合纱'
          ? params.ingredients && params.ingredients.name
          : nameArr.join('-')
      const obj = {
        code: params.code, // 纱线编码
        yarnType: this.dialogOptions.activeTab === '天然纤维' ? 1 : this.dialogOptions.activeTab === '化学纤维' ? 2 : 3, // 纱线类型 1天然纤维 2化学纤维 3组合纤维
        yarnId: params.id, // 纱线的id
        ratio: '', // 比例
        edit: true,
        ingredientsValue: str,
        ingredientsArr: arr,
        holeNumber: 100, // 坑数（在纱长设置页面）
        holeType: 'G', // 坑的类型  G：G坑  R：R坑
        resilience: params.resilience, // 是否弹力 1是 0否
        length: [] // 长度表
      }
      this.yarnData.push(obj)
    },
    setRemoval(params) {
      const res = new Map()
      return params.filter((item) => !res.has(item.yarnId) && res.set(item.yarnId, 1))
    },
    // 纱长转换
    getYarnVelue(row) {
      const strs = row.length.reduce((str, item) => {
        return `${str}${str ? '-' : ''}${item.descUuid && item.descUuid !== '0' ? item.descObj.name : item.desc}/${item.length}cm`
      }, '')
      return strs ? `${strs}--${row.holeNumber}/${row.holeType}` : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.tableitem {
  width: 100%;
  /deep/ .el-table--mini {
    font-size: 14px;
  }
  .titleitem {
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 16px;
      color: #151222;
      padding-right: 12px;
      line-height: 52px;
    }
  }
}
.msgee {
  line-height: 50px;
  height: 50px;
  color: #515151;
  font-size: 14px;
  // flex: 1;
  // text-align: end;
  margin-left: 20px;
  font-weight: 500;
  span {
    line-height: 50px;
    height: 50px;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #FF9200;
    font-weight: 500;
    vertical-align: middle;
    display: inline-block;
  }
}
/deep/.table tr:nth-child(even) {
  background-color: #ffffff;
}

/deep/.el-table__footer {
  .product-is-request::before {
  display: none;
}
}
</style>
