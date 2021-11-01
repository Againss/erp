<!--
 * @Date: 2020-09-27 14:29:46
 * @Author: Againss
 * @LastEditTime: 2021-07-26 11:29:32
 * @LastEditors: zhengjin
 * @Descripttion: 组合纱详情
-->
<template>
  <div class="product-detail-content">
    <div v-if="isDetail" class="product-item-top">
      <div class="product-item-codeinfo">
        <div class="code-item">纱线编码：{{ order.code }}</div>
      </div>
      <!-- <div class="description">
        操作人：{{
          (order.updator && order.updator.realName) ||
            (order.creator && order.creator.realName)
        }}
        操作时间：{{
          $filters.parseTime(order.operatedTime || 0, "{y}-{m}-{d} {h}:{i}")
        }}
      </div> -->
    </div>
    <div v-if="isDetail" class="product-item-content">
      <div class="product-content-title">基本信息</div>
      <div class="product-content-info">
        <item
          ref="formTwoPart"
          :is-edit="false"
          :form-data="formDataOnePart"
          :order="order"
        />
      </div>
    </div>
    <!-- <div class="product-item-codeinfo">
      <div v-if="isDetail" class="content-item">
        <span class="label">纱线编码</span>
        <el-input
          v-model.trim="order.code"
          :title="order.code"
          disabled
          placeholder="保存后自动生成"
        />
      </div>
      <div v-if="isDetail" class="content-item">
        <span class="label">更新人</span>
        <el-input
          :value="
            (order.updator && order.updator.realName) ||
              (order.creator && order.creator.realName)
          "
          :title="
            (order.updator && order.updator.realName) ||
              (order.creator && order.creator.realName)
          "
          disabled
        />
      </div>
      <div v-if="isDetail" class="content-item">
        <span class="label">更新时间</span>
        <el-input
          :value="
            $filters.parseTime(order.operatedTime || 0, '{y}-{m}-{d} {h}:{i}')
          "
          disabled
        />
      </div>
    </div> -->
    <div class="product-item-content">
      <div class="product-content-title">组合纱信息</div>
      <div class="product-content-info">
        <item
          ref="formTwoPart"
          :is-edit="isEdit"
          :rules="rulesTwoPart"
          :form-data="formDataTwoPart"
          :order="order"
        />
        <item
          ref="formTwoPartOne"
          :is-edit="isEdit"
          :form-data="dyeCodePart"
          :order="order"
        />
        <!-- 纱线table -->
        <div class="tableitem">
          <div class="titleitem">
            <div
              class="title"
              :class="{ 'product-is-request': isEdit }"
            >纱线组合</div>
            <div>
              <el-button
                v-if="isEdit && !isDetail"
                type="primary"
                size="mini"
                @click="dialogHandler"
              >添加纱线</el-button>
            </div>
          </div>
          <cs-custom-form
            ref="ratioTable"
            class="table product-style-table"
            :reset-errors="isErroes"
            :data-source="dataSource"
            :options="formOptions"
          />
        </div>
      </div>
    </div>
    <div v-if="isEdit" class="product-btn-group">
      <div class="btn-groups">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
    <dialogs :options="dialogOptions" />
    <!-- <el-dialog width="400px" title="色号信息" :visible.sync="dialogTableVisible">
      <div :style="colorstyle" />
    </el-dialog> -->
  </div>
</template>

<script>
import item from '@/views/product-center/components/detaiItem'
import configData from '@/views/product-center/configDock/index.js'
// import inputNum from '../../product-management/grey-cloth/components/input'
import dialogs from '@/views/product-center/components/dialog'
import logMethods from '@/views/product-center/mixin/log-methods'
import { naturalList, chemicalList, store, show, update } from './api'
import colorShow from '@/views/product-center/product-management/grey-cloth/components/colorShow'
import { publicSelectList } from '../../api'
import { ingredientsList } from '../natural-fiber/api'
import {
  ingredientsList as ingredientsListChe
} from '../chemical-fiber/api'
export default {
  components: {
    item,
    dialogs
  },
  mixins: [logMethods],
  data() {
    const checkedRatio = (rule, value, callback) => {
      // var reg = /^(((\\d{1,2})[.]((\\d{1,2})?))|100|(?:0|[1-9][0-9]?)|100.00|100.0|0.0)$/
      // var reg = /^((^[0-9]\d{0,1})|(([0]\.\d{1,2}|(^[0-9]\d{0,1})*\.\d{1,2}))|100.00|100.0|100)$/
      var reg = /^(([1-9][0-9]|[1-9])(\.\d{1})?|0\.\d{1}|100|100.0)$/
      if ((!reg.test(value) && value) || value - 0 === 0) {
        callback(new Error('请输入大于0且小于等于100的数字，最多带一位小数'))
      } else {
        callback()
      }
    }
    // 纱线类型下拉数据
    // const yarnTypeOptions = [
    //   {
    //     id: 1,
    //     name: '包覆纱'
    //   },
    //   {
    //     id: 2,
    //     name: '合捻纱'
    //   }
    // ]
    const operates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: [
        {
          label: '删除',
          style: { 'color': '#FF4444' },
          permitTag: ['userCenter:sysPermit:modify'],
          isShow: true,
          handle: async(params) => {
            this.$confirm(' 你确认要删除该数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async() => {
              this.dataSource[0].dataSource.splice(params.$index, 1)
              this.order.resilience = this.dataSource.find((item) => {
                return item.yarnClass === 2
              }) ? 1 : 0
              this.$refs['formTwoPart'].resetData({
                resilience: this.order.resilience
              })
              this.isErroes = false
              this.$refs['ratioTable'].form.resetFields()
            })
          }
        }
      ]
    }
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
        minWidth: '120'
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
        minWidth: '120',
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
        formater: (scope) => {
          return scope.row.yarnDyeingAdaptability &&
            scope.row.yarnDyeingAdaptability.name
            ? scope.row.yarnDyeingAdaptability.name
            : ''
        }
      }
      // {
      //   prop: 'yarnLevel',
      //   label: '纱线等级',
      //   minWidth: '100'
      // }
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
      // {
      //   prop: 'bdYarnLevel',
      //   label: '纱线等级',
      //   minWidth: '80',
      //   showOverflowTooltip: true
      // }
    ]
    // 搜索
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
        filterable: true,
        loading: true,
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
        clearable: true,
        filterable: true,
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
        itemType: 'select',
        clearable: true,
        filterable: true,
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
        clearable: true,
        filterable: true,
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
        clearable: true,
        filterable: true,
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
          console.log('查询', params)
          // const orgIds = params.orgIds ? params.orgIds[0] ? params.orgIds : [] : []
          // this.getUserList({ ...params, orgIds })
          // this.searchFormDatas = { ...params, orgIds }
          this.getList(params, '天然纤维')
          this.dialogOptions.searchFormDatas = params
        },
        resetHandle: () => {
          this.dialogOptions.searchFormDatas = {}
          // console.log('重置', this.pagination)
          // this.getList({}, '天然纤维')
        }
      }
    ]
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
        loading: true,
        filterable: true,
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
        loading: true,
        filterable: true,
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
    // 分页配置信息
    const dialogOptions = {
      visible: false,
      title: '添加纱线',
      loading: true,
      okText: '提交',
      activeTab: '天然纤维',
      cancelText: '取消',
      closed: (params) => {
        this.dialogHandle(params)
      }, // 关闭选择
      ok: (params) => {
        if (!params) {
          this.$message({
            type: 'warning',
            message: '请选择数据'
          })
          return
        }
        this.addYarn(params)
        this.dialogHandle(false)
      }, // 确定选择
      tab: [{ name: '天然纤维' }, { name: '化学纤维' }],
      tabHandleClick: (params) => {
        if (params === '天然纤维') {
          this.dialogOptions.searchFormDatas = {}
          this.dialogOptions.activeTab = '天然纤维'
          this.dialogOptions.columns = columnsNatural
          this.dialogOptions.searchData = searchDataNatural
          this.getList({}, '天然纤维')
        } else {
          this.dialogOptions.searchFormDatas = {}
          this.getList({}, '化学纤维')
          this.dialogOptions.activeTab = '化学纤维'
          this.dialogOptions.columns = columnsChe
          this.dialogOptions.searchData = searchDataChe
        }
      },
      searchFormDatas: {}, // 搜索默认参数
      searchData: searchDataNatural, // 搜索字段
      dataSource: [], // table数据
      columns: columnsNatural,
      maxHeight: '370',
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

    // 验证字段
    const rulesTwoPart = {
      bdComposeMethodValue: [
        { message: '请选择包合方式', required: true, trigger: ['change'] }
      ],
      bdCoatMethodValue: [
        { message: '请选择包覆方式', required: true, trigger: 'change' }
      ],
      bdTwistDirectionValue: [
        { message: '请选择捻向', required: true, trigger: 'change' }
      ],
      yarnType: [
        { message: '请选择纱线类型', required: true, trigger: 'change' }
      ]
    }
    // 字段信息 （根据页面结构需分段）
    const formDataOnePart = [
      {
        name: 'dataSource',
        notEdit: 'true',
        type: 'input',
        label: '数据来源'
      },
      {
        showValue: 'sourceOrderTypeName',
        notEdit: 'true',
        type: 'input',
        label: '来源订单类型'
      },
      {
        name: 'sourceOrder',
        notEdit: 'true',
        type: 'input',
        label: '来源单号'
      },
      {
        name: 'creater',
        notEdit: 'true',
        type: 'input',
        label: '创建人'
      },
      {
        name: 'creaTime',
        notEdit: 'true',
        type: 'input',
        label: '创建时间'
      },
      {
        name: 'updator',
        notEdit: 'true',
        type: 'input',
        label: '更新人'
      },
      {
        name: 'operatedTime',
        notEdit: 'true',
        type: 'input',
        label: '更新时间'
      },
      {
        name: 'skuStatusName',
        notEdit: 'true',
        type: 'input',
        label: '状态'
      }
    ]
    const dyeCodePart = [
      {
        name: 'colorYarnColorCode',
        type: 'select-search',
        label: '染纱色号',
        placeholder: '请选择染纱色号',
        showComponent: {
          colorShow
        },
        notEdit: false,
        valueKey: 'code',
        searchValue: 'code', // 搜索比如name='智布'
        apiUrl: `color/api/color/droplist`,
        optionsLabel: 'code',
        requestFormat: 'list',
        clearable: true,
        requestMode: 'post',
        requestParam: { type: 1 },
        changeSelectVal: (e) => {
          this.order.colorYarnColorCode = e.data ? e.data.code : ''
          this.$refs['formTwoPartOne'].resetData({
            colorYarnColorCode: e.data ? e.data.code : ''
          })
          this.order.colorYarnColorUuid = e.data ? e.data.uuid : ''
          if (e.data) {
            this.dyeCodePart[1].disabled = false
          } else {
            this.dyeCodePart[1].disabled = true
            this.order.techYarnTechCode = ''
            this.order.techYarnTechUuid = ''
            this.$refs['formTwoPartOne'].resetData({
              techYarnTechCode: ''
            })
          }
        }
      },
      {
        name: 'techYarnTechCode',
        type: 'select-search',
        label: '染纱工艺编码',
        placeholder: '请选择染纱工艺编码',
        searchValue: 'name', // 搜索比如name='智布'
        valueKey: 'name',
        disabled: true,
        apiUrl: `${configData.productRequestPrefix}/api/tech/yarnTechnologyCode/all`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        clearable: true,
        changeSelectVal: (e) => {
          this.order.techYarnTechCode = e.data ? e.data.name : ''
          this.$refs['formTwoPartOne'].resetData({
            techYarnTechCode: e.data ? e.data.name : ''
          })
          this.order.techYarnTechUuid = e.data ? e.data.uuid : 0
        }
      }
    ]
    const formDataTwoPart = [
      // {
      //   name: 'yarnType',
      //   type: 'select',
      //   label: '纱线类型',
      //   // showValue: 'yarnTypeValue',
      //   placeholder: '请选择纱线类型',
      //   notEdit: false,
      //   options: yarnTypeOptions,
      //   optionsValue: 'id',
      //   changeHandler: (data) => {
      //     this.order.yarnType = data
      //   }
      // },
      {
        name: 'bdComposeMethodValue',
        type: 'select-search',
        label: '组合方式',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择组合方式',
        requestParam: { categoryId: 21 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.$refs['formTwoPart'].resetData({
            bdComposeMethodValue: e.data.name
          })
          this.order.bdComposeMethodValue = e.data.name
          // this.order.bdComposeMethodAbbr = e.data.abbr
          this.order.bdComposeMethodUuid = e.data.uuid
        }
      },
      {
        name: 'bdCoatMethodValue',
        type: 'select-search',
        label: '包覆方式',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择包覆方式',
        requestParam: { categoryId: 20 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.$refs['formTwoPart'].resetData({
            bdCoatMethodValue: e.data.name
          })
          this.order.bdCoatMethodValue = e.data.name
          // this.order.bdCoatMethodAbbr = e.data.abbr
          this.order.bdCoatMethodUuid = e.data.uuid
        }
      },
      {
        name: 'bdTwistDirectionValue',
        type: 'select-search',
        label: '捻向',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择捻向',
        requestParam: { categoryId: 10 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.bdTwistDirectionValue = e.data.name
          this.$refs['formTwoPart'].resetData({
            bdTwistDirectionValue: e.data.name
          })
          // this.order.bdCardingMethodAbbr = e.data.abbr
          this.order.bdTwistDirectionUuid = e.data.uuid
        }
      },
      {
        name: 'resilience',
        type: 'select',
        label: '是否弹力',
        showValue: 'resilienceValue',
        placeholder: '请选择是否弹力',
        disabled: true,
        options: [
          {
            id: 1,
            name: '是'
          },
          {
            id: 0,
            name: '否'
          }
        ],
        optionsValue: 'id'
        // changeHandler: (e) => {
        //   // this.order.resilience = e
        //   // this.$refs['formTwoPart'].resetData({
        //   //   resilience: e
        //   // })
        // }
      }
    ]
    // 比例数据
    const columns = [
      {
        prop: 'id',
        label: '序号',
        minWidth: '50',
        formater: (scope) => {
          return (
            scope.$index + 1
          )
        }
      },
      {
        prop: 'yarnType',
        label: '坯纱/色纱',
        formater: (scope) => {
          return scope.row.yarnType === 1 ? '坯纱' : '色纱'
        }
      },
      {
        prop: 'yarnClass',
        label: '纱线种类',
        formater: (scope) => {
          return scope.row.yarnClass === 1
            ? '天然纤维'
            : scope.row.yarnClass === 2
              ? '化学纤维'
              : '组合纱'
        }
      },
      {
        prop: 'yarnCode',
        label: '纱线编码'
      },
      {
        prop: 'ratio',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        label: '纱线比例/%',
        minWidth: '160',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          rules: [
            {
              required: true,
              message: '纱线比例不能为空',
              trigger: ['change']
            },
            {
              required: true,
              validator: checkedRatio,
              trigger: ['change']
            }
            // { type: 'number', message: '纱线比例必须为正整数' }
          ],
          change: (value, v1, v2, v3, scope) => {
            let str = value
            var arr = value.toString().split('.') // .3 arr=["","3"]   18.6 arr=["18","6"]  8 arr=["8"]
            var reg = /^(([1-9][0-9]|[1-9])(\.\d)|0\.\d)$/
            if (reg.test(value)) {
              // 0.3-0.7 = 0.5，小于0.3=0，大于0.7=1
              if (arr[1] >= 3 && arr[1] <= 7) {
                str = arr[0] - 0 + 0.5
              } else if (arr[1] < 3) {
                str = arr[0]
              } else if (arr[1] > 7) {
                str = arr[0] - 0 + 1
              }
            }
            this.$set(
              this.dataSource[0].dataSource[scope.$index],
              'ratio',
              str
              // isNaN(value) ? '' : value - 0 || ''
            )
            this.$refs.ratioTable.setDynamicValidateFormRuleForm({
              tableForm: this.dataSource[0].dataSource
            })
          }
        }
      }
    ]
    // 纱线组合
    const dataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        columns: columns,
        size: 'mini',
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        operates: operates,
        // 合计
        showSummary: true,
        summaryMethod: this.getSummaries
      }
    ]
    return {
      order: {},
      isEdit: true,
      rulesTwoPart,
      formDataTwoPart,
      dyeCodePart,
      dataSource,
      dialogOptions,
      isDetail: false,
      beforeCode: {},
      formDataOnePart,
      dialogTableVisible: false,
      colorstyle: {
        display: 'none'
      },
      formOptions: {
        popError: true
      },
      isErroes: true
    }
  },
  // computed: {
  //   listData() {
  //     return this.dataSource[0].dataSource
  //   }
  // },
  created() {
    if (this.$route.params.id) {
      this.dataSource[0].showSummary = false
    }
    this.initOrder()
    if (this.$route.params.id && this.$route.query.isShow) {
      this.isEdit = false
    }
    if (this.$route.params.id) {
      this.isDetail = true
      this.getOrder(this.$route.params.id)
      this.formDataTwoPart.forEach((item) => {
        item.notEdit = true
      })
      this.dataSource[0].operates = null
      this.dyeCodePart[0].notEdit = true
      this.dyeCodePart[1].notEdit = false
    }
  },
  methods: {
    // 初始化
    initOrder() {
      this.order = {
        code: '', // 坯布编码
        dataSource: 1, // 数据来源
        sourceOrderTypeName: '-', // 来源订单类型 查看时的值
        sourceOrder: '', // 来源单号
        creater: '', // 创建人
        creaTime: '', // 创建时间
        updator: '', // 操作人
        operatedTime: '', // 操作时间
        bdComposeMethodUuid: '', // 组合方式
        bdComposeMethodValue: '', // 组合方式
        bdCoatMethodUuid: '', // 包覆方式
        bdCoatMethodValue: '',
        bdTwistDirectionUuid: '', // 捻向
        bdTwistDirectionValue: '',
        resilience: 0, // 是否弹力 0 否 1 是
        yarnType: '', // 纱线类型 1 包裹纱 2 合捻纱
        colorYarnColorUuid: '', // 色号库：纱线色号ID
        colorYarnColorCode: '', // 色号库：纱线色号
        techYarnTechUuid: '', // 工艺库：染纱工艺编码ID
        techYarnTechCode: '', // 工艺库：染纱工艺编码
        yarnCombinationData: [] // 纱线组合   yarnClass 纱线种类 1天然纤维 2化学纤维 3组合纱      yarnId ID       ratio 整数
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
        if (res.data && res.data.list) {
          data = res.data.list.map((item) => {
            item.label = item.name
            item.value = item.uuid + '-' + item.type
            return item
          })
        } else {
          if (res.data.length > 0) {
            data = res.data.map((item) => {
              item.label = item.name
              item.value = item.uuid
              return item
            })
          }
        }
        this.$set(this.dialogOptions.searchData[index], 'dataSource', data)
        this.$set(this.dialogOptions.searchData[index], 'loading', false)
      }
    },
    // 设置搜索数据
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
          if (res.data.length > 0) {
            data = res.data.map((item) => {
              item.label = item.name
              item.value = item.uuid
              return item
            })
          }
        }
        this.$set(this.dialogOptions.searchData[index], 'dataSource', data)
        this.$set(this.dialogOptions.searchData[index], 'loading', false)
      }
      [{ id: 1 }, { id: 2 }, { id: 3 }].reduce((item, pre) => {

      }, [])
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
    async getOrder(id) {
      const res = await show({ id })
      this.order = Object.assign(this.order, res.data)
      this.beforeCode = {
        id: this.order.id,
        code: this.order.code,
        techYarnTechCode:
          this.order.yarnTechnologyCode && this.order.yarnTechnologyCode.name
      }
      this.setOrder(this.order)
    },
    // 取消
    cancel() {
      this.isEdit = false
      this.$router.go(-1)
    },
    setOrder(order) {
      this.order.bdComposeMethodValue =
        (order.composeMethod && order.composeMethod.name) || ''
      this.order.bdCoatMethodValue =
        (order.coatMethod && order.coatMethod.name) || ''
      this.order.bdTwistDirectionValue =
        (order.longWistDirection && order.longWistDirection.name) || ''
      this.order.colorYarnColorCode =
        order.yarnColorNumber && (order.yarnColorNumber.code + (order.colorName ? '-' + order.colorName : '')) // 色号拼接颜色
      this.order.techYarnTechCode =
        order.yarnTechnologyCode && order.yarnTechnologyCode.name
      this.order.resilienceValue = order.resilience === 1 ? '是' : '否'
      this.order.yarnType = order.yarnType === 1 ? '包覆纱' : '合捻纱'
      this.order.sourceOrder = order.sourceOrder || '' // 来源单号
      this.order.skuStatusName = order.skuStatus === 1 ? '正式' : (order.skuStatus === 2 ? '临时' : '')
      // 数据来源
      switch (order.dataSource) {
        case 1:
          this.order.dataSource = '产品目录库'
          break
        case 2:
          this.order.dataSource = '样板开发'
          break
        case 3:
          this.order.dataSource = '客户订单'
          break
        case 4:
          this.order.dataSource = '采购订单'
          break
        case 5:
          this.order.dataSource = '工艺总结'
          break
        default:
          this.order.dataSource = ''
      }
      order.sourceOrderType = order.sourceOrderType || 0
      let sourceOrderTypeName = '-'
      switch ((order.sourceOrderType - 0)) {
        case 0:
          sourceOrderTypeName = '-'
          break
        case 1:
          sourceOrderTypeName = '大货订单'
          break
        case 2:
          sourceOrderTypeName = '样板订单'
          break
        case 3:
          sourceOrderTypeName = '备坯单'
          break
        case 4:
          sourceOrderTypeName = '备纱单'
          break
        case 5:
          sourceOrderTypeName = '采购单'
          break
        case 6:
          sourceOrderTypeName = '补布单'
          break
        default:
          sourceOrderTypeName = '-'
      }
      this.order.sourceOrderTypeName = sourceOrderTypeName // 来源订单类型
      // 创建时间
      this.order.creaTime = this.$filters.parseTime(
        order.createdTime,
        '{y}-{m}-{d} {h}:{i}'
      ) || ''
      // 更新时间
      this.order.operatedTime = order.updatedTime ? this.$filters.parseTime(order.updatedTime, '{y}-{m}-{d} {h}:{i}') : ''
      // 创建人
      this.order.creater = order.creator
        ? order.creator.name
          ? order.creator.name + '/' + order.creator.realName
          : order.creator.realName
        : ''
      // 更新人
      this.order.updator = order.updator
        ? order.updator.name
          ? order.updator.name + '/' + order.updator.realName
          : order.updator.realName
        : ''
      if (order.combination) {
        this.dataSource[0].dataSource = order.combination.map((item) => {
          item.edit = this.isDetail ? false : this.isEdit
          item.ratio = item.proportion
          return item
        })
      }
      if (this.order.colorYarnColorCode) {
        this.dyeCodePart[1].disabled = false
      }
    },
    // 提交
    submitForm() {
      if (this.isDetail) {
        // 编辑
        this.EditUpdata()
      } else {
        // 新增
        this.AddStore()
      }
    },
    EditUpdata() {
      this.$confirm(' 请确认提交该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await update({
          id: this.order.id,
          techYarnTechUuid: this.order.techYarnTechUuid,
          techYarnTechCode: this.order.techYarnTechCode
        })
        if (res.code !== 200) return
        this.isEdit = false
        this.$message({ type: 'success', message: '提交成功' })
        const { beforeCode, afterCode } = this.compareData(
          this.beforeCode,
          {
            id: this.order.id,
            code: this.order.code,
            techYarnTechCode: this.order.techYarnTechCode
          },
          'id'
        )
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(
          this.getLogMessages(
            'UPDATE',
            `${configData.productRequestPrefix}/api/yarn/composite/update`
          ),
          afterCode,
          JSON.stringify({
            beforeText: `在'产品目录库-纱线管理-组合纱'将纱线编码:${this.order.code}`,
            afterText: '修改为',
            ...{ beforeCode, afterCode }
          })
        )
        this.$router.push({ name: 'CombinationList' })
      }).catch(() => {})
    },
    AddStore() {
      let pass = false
      this.$refs.formTwoPart.$refs.form.validate(async(valid) => {
        if (valid) {
          pass = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
      if (!pass) return
      this.order.yarnCombinationData = this.dataSource[0].dataSource
      if (!this.order.yarnCombinationData.length) {
        this.$message({
          message: '请添加纱线组合',
          type: 'warning'
        })
        return
      }
      this.$refs.ratioTable.form.validate(async(valid) => {
        if (valid) {
          console.log('success')
          pass = true
        } else {
          pass = false
        }
      })
      if (!pass) return
      if (this.order.yarnCombinationData.reduce((sum, cru) => {
        return sum + (cru.ratio * 100 - 0)
      }, 0) - 10000 !== 0) {
        this.$message({
          message: '纱线组合中比例总值必须等于100!',
          type: 'warning'
        })
        return
      }
      this.order = Object.assign(this.order, this.$refs.formTwoPart.form)
      if (this.dataSource[0].dataSource.length < 2) {
        this.$message({
          message: '纱线组合中的纱线必须大于等于2条!',
          type: 'warning'
        })
        return
      }
      this.$confirm(' 请确认提交该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await store(this.order)
        if (res.code !== 200) {
          return
        }
        this.isEdit = false
        this.$message({ type: 'success', message: '提交成功' })
        this.fetchLog(
          this.getLogMessages(
            'INSERT',
            `${configData.productRequestPrefix}/api/yarn/composite/store`
          ),
          this.order,
          JSON.stringify({
            beforeText: `在'产品目录库-纱线管理-组合纱'新增一条记录`,
            beforeCode: this.order
          })
        )
        this.$router.push({ name: 'CombinationList' })
      }).catch(() => {})
    },
    // 添加纱线弹窗
    dialogHandle(flag) {
      this.$set(this.dialogOptions, 'visible', flag)
    },
    // 添加纱线组合
    addYarn(params) {
      // 纱支截取/
      const shazhi = params.yarnCount && params.yarnCount.name.split('/')
      // 只比较纱支的第一个值，取出数组部分
      const shazhiValue = shazhi && shazhi[0].replace(/[^0-9]/ig, '')
      // 细度截取/
      const xidu = params.fineness && params.fineness.name.split('/')
      // 只比较细度的第一个值，取出数组部分
      const xiduValue = xidu && xidu[0].replace(/[^0-9]/ig, '')
      const obj = {
        yarnCode: params.code, // 纱线编码
        yarnType: params.type, // 纱线类型1坯纱2色纱
        resilience: params.resilience, // 是否弹力
        yarnClass:
          this.dialogOptions.activeTab === '天然纤维'
            ? 1
            : this.dialogOptions.activeTab === '化学纤维'
              ? 2
              : 3, // 纱线类型 1天然纤维 2化学纤维 3组合纤维
        yarnId: params.id, // 纱线的id
        ratio: '', // 比例
        edit: true,
        shazhi: shazhiValue || '', // 纱支
        xidu: xiduValue || '', // 细度
        createdTime: params.createdTime // 创建时间
      }
      this.dataSource[0].dataSource.push(obj)
      this.order.resilience = this.dataSource[0].dataSource.find((item) => {
        return item.resilience === 1
      })
        ? 1
        : 0
        // 按纱线类型，纱支or 细度排序 只比/第一个，一样的则按照创建时间升序排序
      this.dataSource[0].dataSource.sort((a, b) => {
        if (a.yarnClass !== b.yarnClass) {
          return a.yarnClass - b.yarnClass
        }
        if (a.xidu && b.xidu && a.xidu !== b.xidu) {
          return b.xidu - a.xidu
        }

        if (a.shazhi && b.shazhi && a.shazhi !== b.shazhi) {
          return b.shazhi - a.shazhi
        }
        return a.createdTime - b.createdTime
      })
      this.$refs['formTwoPart'].resetData({
        resilience: this.order.resilience
      })
    },
    // 纱线弹窗获取列表
    async getList(data = {}, type) {
      let res
      if (type === '天然纤维') {
        res = await naturalList({
          ...this.dialogOptions.searchFormDatas,
          ...data,
          pageSize: 10
        })
      } else {
        res = await chemicalList({
          ...this.dialogOptions.searchFormDatas,
          ...data,
          pageSize: 10
        })
      }
      if (res.code === 200) {
        this.$set(this.dialogOptions, 'loading', false)
      }
      const list = res.data.list || []
      this.$set(this.dialogOptions, 'dataSource', list)
      this.$set(this.dialogOptions, 'pagination', {
        ...this.dialogOptions.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.page,
        pageSize: res.data.pageSize
      })
    },
    // 比例
    getRatio(ratio) {
      if (ratio && ratio.length) {
        return ratio.reduce((str, item) => {
          return str ? str + '/' + item.ratio + '%' : str + item.ratio + '%'
        }, '')
      }
      return ''
    },
    // 添加纱线弹窗
    dialogHandler() {
      this.getList({}, this.dialogOptions.activeTab)
      this.$set(this.dialogOptions, 'visible', true)
      this.isErroes = true
    }
  }
}
</script>

<style lang="scss" scoped>
.tableitem {
  width: 100%;
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
.content-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  .label {
    width: 130px;
    padding-right: 12px;
    text-align: right;
    box-sizing: border-box;
  }
  .el-input {
    width: 170px;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    color: #777474;
  }
}
/deep/.table tr:nth-child(even) {
  background-color: #ffffff;
}
/deep/.product-style-table .el-table--mini {
  font-size: 14px;
}
/deep/.el-table__footer {
  .product-is-request::before {
  display: none;
}
}
</style>
