<!--
 * @Date: 2020-09-27 14:29:46
 * @Author: Againss
 * @LastEditTime: 2021-07-26 10:53:29
 * @LastEditors: zhengjin
 * @Descripttion: 天然纤维详情页面
-->
<template>
  <div class="product-detail-content">
    <div v-if="!isDetail" class="product-item-content">
      <div class="product-content-info">
        <div class="content-item">
          <span class="label">坯纱编码</span>
          <el-input
            v-model.trim="order.embryoCode"
            :title="order.embryoCode"
            :disabled="!isEdit || isDetail"
            placeholder="请输入坯纱编码"
          />
          <div>
            <el-button
              v-if="isEdit && !isDetail"
              class="pointer"
              size="small"
              @click="pullHandler"
            >引入</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isDetail" class="product-item-top">
      <div class="product-item-codeinfo">
        <div class="code-item">纱线编码：{{ order.code }}</div>
      </div>
    </div>
    <div v-if="isDetail" class="product-item-content">
      <div class="product-content-title">基本信息</div>
      <div class="product-content-info">
        <item
          ref="formOnePart"
          :is-edit="false"
          :form-data="formDataOnePart"
          :order="order"
        />
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">坯纱信息</div>
      <div class="product-content-info">
        <item
          ref="formTwoPart"
          :is-edit="!isDetail"
          :rules="rulesTwoPart"
          :form-data="formDataTwoPart"
          :order="order"
        />
        <div class="tableitem">
          <div
            class="title title-h"
            :class="{ 'product-is-request': !isDetail }"
          >属性组合
            <el-button
              v-if="!isDetail"
              size="small"
              style="margin-left: 10px"
              @click="dialogHandler"
            >选择</el-button></div>
          <item
            ref="formFourPart"
            :is-edit="false"
            :form-data="formDataFourPart"
            :order="order"
          />
        </div>
        <div class="tableitem">
          <div class="title">比例</div>
          <cs-custom-form
            ref="ratioTable"
            :reset-errors="isErroes"
            :options="formOptions"
            :data-source="ratioDataSource"
            class="table"
          />
        </div>
      </div>
    </div>
    <div v-if="order.type === 2" class="product-item-content">
      <div class="product-content-title">色纱信息</div>
      <div class="product-content-info">
        <item
          ref="formDataThreePart"
          :is-edit="isEdit"
          :form-data="formDataThreePart"
          :order="order"
        />
      </div>
    </div>
    <div v-if="isEdit" class="product-btn-group">
      <div class="btn-groups">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
    <dialogs :options="dialogOptions" />
  </div>
</template>

<script>
import item from '@/views/product-center/components/detaiItem'
import logMethods from '@/views/product-center/mixin/log-methods'
import configData from '@/views/product-center/configDock/index.js'
import { getEmbryoCode, store, show, update, compositePropertiesList } from './api'
import { publicSelectList } from '../../api/index.js'
import dialogs from '@/views/product-center/components/dialog'
import colorShow from '@/views/product-center/product-management/grey-cloth/components/colorShow'

export default {
  components: { item, dialogs },
  mixins: [logMethods],
  data() {
    const dialogOptions = {
      visible: false,
      loading: true,
      title: '属性组合',
      okText: '提交',
      cancelText: '取消',
      closed: (params) => {
        this.dialogHandle(params)
      }, // 关闭选择
      ok: (params) => {
        if (!params) {
          this.$message.error('请选择数据！')
          return false
        }
        this.dialogHandle(false)
        this.order.bdCardingMethodUuid = params.cottonCarding.uuid// 梳棉方法id
        this.order.bdCardingMethodValue = params.cottonCarding.name// 梳棉方法id
        this.order.bdSpinningMethodUuid = params.spinning.uuid// 纺纱方法Uuid
        this.order.bdSpinningMethodValue = params.spinning.name// 纺纱方法Uuid
        this.order.bdYarnTypeUuid = params.yarnFabric.uuid// 纱类id
        this.order.bdYarnTypeValue = params.yarnFabric.name// 纱类id
        this.order.yarnTypeAttrAbbr = params.abbr// 组合简称
        // 处理选择
      }, // 确定选择
      maxHeight: '370',
      searchFormDatas: {}, // 搜索默认参数
      searchData: [
        {
          prop: 'abbr',
          itemType: 'select',
          label: '组合简称',
          itemStyle: { width: '50%' },
          placeholder: '请选择组合简称',
          clearable: true,
          loading: true,
          visibleChange: (flag) => {
            if (flag) {
              this.setSelectData('组合简称', 0, false)
            } else {
              this.setSelectData('组合简称', 0, true)
            }
          },
          filterable: true,
          dataSource: []
        },
        {
          prop: 'yarnFabricUuid',
          itemType: 'select',
          label: '纱类',
          itemStyle: { width: '50%' },
          placeholder: '请选择纱类',
          clearable: true,
          loading: true,
          visibleChange: (flag) => {
            if (flag) {
              this.setSelectData('纱类', 1, false)
            } else {
              this.setSelectData('纱类', 1, true)
            }
          },
          dataSource: []
        },
        {
          prop: 'cottonCardingUuid',
          itemType: 'select',
          itemStyle: { width: '50%' },
          label: '梳棉方法',
          placeholder: '请选择梳棉方法',
          clearable: true,
          loading: true,
          visibleChange: (flag) => {
            if (flag) {
              this.setSelectData('梳棉方法', 2, false)
            } else {
              this.setSelectData('梳棉方法', 2, true)
            }
          },
          dataSource: []
        },
        {
          prop: 'spinningUuid',
          itemType: 'select',
          label: '纺纱方法',
          itemStyle: { width: '50%' },
          placeholder: '请选择纺纱方法',
          clearable: true,
          loading: true,
          visibleChange: (flag) => {
            if (flag) {
              this.setSelectData('纺纱方法', 3, false)
            } else {
              this.setSelectData('纺纱方法', 3, true)
            }
          },
          dataSource: []
        },
        {
          itemType: 'operate',
          submitHandle: (params) => {
            this.dialogOptions.searchFormDatas = params
            this.getCompositePropertiesList(params)
          },
          submitText: '查询',
          resetHandle: () => {
            console.log('重置')
            this.dialogOptions.searchFormDatas = {}
          }
        }
      ], // 搜索字段
      dataSource: [], // table数据
      columns: [
        {
          prop: 'abbr',
          label: '组合简称',
          minWidth: '120',
          fixed: true,
          showOverflowTooltip: true
        },
        {
          prop: 'yarnFabric',
          label: '纱类',
          minWidth: '100',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.yarnFabric && scope.row.yarnFabric.name || ''
          }
        },
        {
          prop: 'techTypeName',
          label: '梳棉方法',
          minWidth: '120',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.cottonCarding && scope.row.cottonCarding.name || ''
          }
        },
        {
          prop: 'techTypeName1',
          label: '纺纱方法',
          minWidth: '120',
          showOverflowTooltip: true,
          formater: (scope) => {
            return scope.row.spinning && scope.row.spinning.name || ''
          }
        }
      ],
      pagination: {
        currentChange: (val) => {
          // 切换页数
          this.getCompositePropertiesList({
            pageSize: this.dialogOptions.pagination.pageSize || 20,
            page: val
          })
        },
        sizeChange: (val) => {
          // 切换条数
          this.getCompositePropertiesList({
            pageSize: val,
            page: this.dialogOptions.pagination.page || 1
          })
        }
      }
    }
    // 验证字段
    const rulesTwoPart = {
      bdYarnCountValue: [
        { message: '请选择纱支', required: true, trigger: ['change'] }
      ],
      bdIngredientsValue: [
        { message: '请选择成分', required: true, trigger: 'change' }
      ],

      bdWistDirectionValue: [
        { message: '请选择捻向', required: true, trigger: 'change' }
      ],

      bdYarnDyeingAdaptabilityValue: [
        { message: '请选择染色适应性', required: true, trigger: 'change' }
      ],
      yarnLevel: [
        { message: '请选择纱线等级', required: true, trigger: 'change' }
      ]
    }
    // 字段信息 （根据页面结构需分段）
    const formDataOnePart = [
      {
        name: 'embryoCode',
        notEdit: 'true',
        type: 'input',
        label: '坯纱编码'
      },
      {
        name: 'dataSourceValue',
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
        name: 'creatorRealName',
        notEdit: 'true',
        type: 'input',
        label: '创建人'
      },
      {
        name: 'createdTime',
        notEdit: 'true',
        type: 'input',
        label: '创建时间'
      },
      {
        name: 'updatorRealName',
        notEdit: 'true',
        type: 'input',
        label: '更新人'
      },
      {
        name: 'updatedTime',
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
    const formDataTwoPart = [
      {
        name: 'bdYarnCountValue',
        type: 'select-search',
        label: '纱支',
        searchValue: 'name',
        clearable: true,
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择纱支',
        requestParam: { categoryId: 9 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.bdYarnCountAbbr = e.data.abbr || ''
          this.order.bdYarnCountValue = e.data.name || ''
          this.order.bdYarnCountUuid = e.data.uuid || ''
          this.$refs['formTwoPart'].resetData({
            bdYarnCountValue: e.data.name || ''
          })
        }
      },
      {
        name: 'bdIngredientsValue',
        type: 'select-search',
        label: '成分',
        searchValue: 'name',
        clearable: true,
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择成分',
        apiUrl: `${configData.productRequestPrefix}/api/bd/allIngredients/all`,
        optionsLabel: 'name',
        optionsKey: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          e.data && (e.data.edit = true)
          e.data && (e.data.seq = 1)
          e.data && (e.data.bdIngredientsUuid = e.data.uuid)
          this.order.bdIngredientsUuid = e.data ? e.data.uuid : ''
          if (e.data) {
            delete e.data.id
            this.ratioDataSource[0].dataSource = e.data.child
              ? e.data.child.map((item, index) => {
                item.seq = index + 1
                item.edit = true
                item.bdIngredientsUuid = item.uuid
                delete item.id
                item.ratio = ''
                return item
              }) : [e.data]
            this.isErroes = false
            this.$refs['ratioTable'].form.resetFields()
          } else {
            this.ratioDataSource[0].dataSource = []
          }
          this.order.ingredientsType = e.data ? e.data.type : ''
          this.order.bdIngredientsValue = e.data ? e.data.name : ''
          this.order.bdIngredientsAbbr = e.data ? e.data.abbr : ''
          this.$refs['formTwoPart'].resetData({
            bdIngredientsValue: e.data ? e.data.name : ''
          })
        },
        visibleChange: (e) => {
          if (e) {
            this.isErroes = true
          }
          // console.log(e, 'visibleChange')
        }
      },
      {
        name: 'bdWistDirectionValue',
        type: 'select-search',
        searchValue: 'name',
        valueKey: 'name',
        clearable: true,
        notEdit: false,
        label: '捻向',
        placeholder: '请选择捻向',
        requestParam: { categoryId: 10 },
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.bdWistDirectionValue = e.data.name || ''
          this.order.bdWistDirectionAbbr = e.data.abbr || ''
          this.order.bdWistDirectionUuid = e.data.uuid || ''
          this.$refs['formTwoPart'].resetData({
            bdWistDirectionValue: e.data.name || ''
          })
        }
      },
      {
        name: 'bdYarnDyeingAdaptabilityValue',
        type: 'select-search',
        searchValue: 'name',
        valueKey: 'name',
        label: '染色适应性',
        notEdit: false,
        clearable: true,
        requestParam: { categoryId: 6 },
        placeholder: '请选择染色适应性',
        apiUrl: `basis/api/yarnTypes/option`,
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.bdYarnDyeingAdaptabilityValue = e.data.name || ''
          this.order.bdYarnDyeingAdaptabilityAbbr = e.data.abbr || ''
          this.order.bdYarnDyeingAdaptabilityUuid = e.data.uuid || ''
          this.$refs['formTwoPart'].resetData({
            bdYarnDyeingAdaptabilityValue: e.data.name || ''
          })
        }
      }
    ]
    const formDataFourPart = [
      {
        name: 'yarnTypeAttrAbbr',
        notEdit: 'true',
        type: 'input',
        label: '组合简称'
      },
      {
        name: 'bdYarnTypeValue',
        notEdit: 'true',
        type: 'input',
        label: '纱类'
      },
      {
        name: 'bdCardingMethodValue',
        notEdit: 'true',
        type: 'input',
        label: '梳棉方法'
      },
      {
        name: 'bdSpinningMethodValue',
        notEdit: 'true',
        type: 'input',
        label: '纺纱方法'
      }
    ]
    const formDataThreePart = [
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
        clearable: true,
        searchValue: 'code', // 搜索比如name='智布'
        apiUrl: `color/api/color/droplist`,
        optionsLabel: 'code',
        requestFormat: 'list',
        requestMode: 'post',
        requestParam: { type: 1 },
        changeSelectVal: (e) => {
          this.order.colorYarnColorCode = e.data ? e.data.code : ''
          this.$refs['formDataThreePart'].resetData({
            colorYarnColorCode: e.data ? e.data.code : ''
          })
          if (e.data) {
            this.formDataThreePart[1].disabled = false
          } else {
            this.formDataThreePart[1].disabled = true
            this.order.techYarnTechCode = ''
            this.order.techYarnTechUuid = ''
            this.$refs['formDataThreePart'].resetData({
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
        clearable: true,
        apiUrl: `${configData.productRequestPrefix}/api/tech/yarnTechnologyCode/all`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.techYarnTechCode = e.data ? e.data.name : ''
          this.order.techYarnTechUuid = e.data ? e.data.uuid : ''
          this.$refs['formDataThreePart'].resetData({
            techYarnTechCode: e.data ? e.data.name : ''
          })
        }
      }
    ]
    const validatePass = async(rule, value, callback) => {
      const res = /^(([1-9][0-9]|[1-9])(\.\d{1,2})?|0\.[1-9](\d)?|0\.(\d)?[1-9]|100|100.0|100.00)$/g
      //  /^(\d|([1-9]\d))(\.\d{1,2})?$/g
      if (!res.test(value)) {
        callback(new Error('至多两位小数且大于0小于等于100'))
      } else {
        callback()
      }
    }
    // 比例数据
    const columns = [
      {
        prop: 'seq',
        label: '序号',
        width: '80'
      },
      {
        prop: 'name',
        label: '成分名称'
      },
      {
        prop: 'ratio',
        label: '比例（请由大至小填写）',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        editOptions: {
          itemType: 'input',
          rules: [
            { required: true, message: '比例不能为空', trigger: ['change'] },
            { validator: validatePass, trigger: 'blur' }
          ],
          change: (value, v1, v2, v3, scope) => {
            this.$set(
              this.ratioDataSource[0].dataSource[scope.$index],
              'ratio',
              value
            )
            this.$refs.ratioTable.setDynamicValidateFormRuleForm({
              tableForm: this.ratioDataSource[0].dataSource
            })
          }
        }
      }
    ]
    // 比例数据
    const ratioDataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        size: 'mini',
        columns: columns,
        headerCellStyle: {
          background: '#F5F7FA!important'
        }
      }
    ]

    return {
      order: {},
      isEdit: true,
      dialogOptions,
      isDetail: false,
      rulesTwoPart,
      formDataOnePart,
      formDataTwoPart,
      formDataThreePart,
      formDataFourPart,
      columns,
      beforeCode: {},
      ratioDataSource,
      colorstyle: {
        display: 'none'
      },
      isErroes: true,
      formOptions: {
        popError: true
      }
    }
  },
  async created() {
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
      this.formDataThreePart[0].notEdit = true
    }
  },
  methods: {
    // 初始化
    initOrder() {
      this.order = {
        code: '',
        embryoCode: '', // 坯布编码
        bdYarnCountUuid: '', // 纱支id
        bdYarnCountValue: '', // 纱支值
        bdIngredientsUuid: '', // 成分id
        bdIngredientsAbbr: '', // 成分简称
        ingredientsType: 1, // 成分类型 1单一成分2组合成分
        dataSource: 1, // 数据来源
        sourceOrderTypeName: '-', // 来源订单类型 查看时的值
        sourceOrder: '', // 来源单号
        bdCardingMethodUuid: '', // 梳棉方法id
        bdCardingMethodAbbr: '', // 梳棉方法简称
        bdSpinningMethodUuid: '', // 纺纱方法id
        bdSpinningMethodAbbr: '', // 纺纱方法id
        bdWistDirectionUuid: '', // 捻向id
        bdWistDirectionAbbr: '', // 捻向简称
        yarnTypeAttrAbbr: '', // 组合属性简称
        bdYarnTypeUuid: '', // 纱类id
        bdYarnTypeAbbr: '', // 纱类简称
        bdYarnDyeingAdaptabilityUuid: '', // 染色适应新id
        bdYarnDyeingAdaptabilityAbbr: '', // 染色适应性简称
        // yarnLevel: '', // 纱线等级
        colorYarnColorCode: '', // 色号编码
        techYarnTechUuid: '', // 工艺编码id
        techYarnTechCode: '', // 工艺编码
        ratio: [], // 比例,
        type: 2,
        bdIngredientsValue: '',
        bdCardingMethodValue: '',
        bdSpinningMethodValue: '',
        bdWistDirectionValue: '',
        bdYarnDyeingAdaptabilityValue: ''
      }
    },
    async getOrder(id) {
      const res = await show({ id })
      this.order = Object.assign(this.order, res.data)
      this.beforeCode = {
        uuid: this.order.uuid,
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
      this.order.creatorRealName = order.creator && (order.creator.name + '/' + order.creator.realName) || ''
      this.order.updatorRealName = order.updator && (order.updator.name + '/' + order.updator.realName) || ''
      this.order.skuStatusName = order.skuStatus === 1 ? '正式' : (order.skuStatus === 2 ? '临时' : '')
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
      this.order.updatedTime = order.updatedTime ? this.$filters.parseTime(order.updatedTime, '{y}-{m}-{d} {h}:{i}') : ''
      this.order.createdTime = this.$filters.parseTime(order.createdTime || 0, '{y}-{m}-{d} {h}:{i}')
      this.order.dataSourceValue = this.getDataFrom(order.dataSource)
      this.order.yarnTypeAttrAbbr = order.yarnTypeAttr && order.yarnTypeAttr.abbr || ''
      this.order.bdYarnCountValue =
        (order.yarnCount && order.yarnCount.name) || ''
      this.order.bdIngredientsValue =
        (order.ingredients && order.ingredients.name) || ''
      this.order.bdIngredientsAbbr =
        order.ingredients && order.ingredients.abbr
      this.order.bdCardingMethodValue =
        (order.cardingMethod && order.cardingMethod.name) || ''
      this.order.bdCardingMethodAbbr =
        order.cardingMethod && order.cardingMethod.abbr
      this.order.bdSpinningMethodValue =
        (order.spinningMethod && order.spinningMethod.name) || ''
      this.order.bdSpinningMethodAbbr =
        order.spinningMethod && order.spinningMethod.abbr
      this.order.bdYarnTypeValue =
        (order.yarnType && order.yarnType.name) || ''
      this.order.bdYarnTypeAbbr = order.yarnType && order.yarnType.abbr
      this.order.bdWistDirectionValue =
        (order.shortWistDirection && order.shortWistDirection.name) || ''
      this.order.bdWistDirectionAbbr =
        order.shortWistDirection && order.shortWistDirection.abbr
      this.order.bdYarnDyeingAdaptabilityValue =
        (order.yarnDyeingAdaptability && order.yarnDyeingAdaptability.name) ||
        ''
      this.order.bdYarnDyeingAdaptabilityAbbr =
        order.yarnDyeingAdaptability && order.yarnDyeingAdaptability.abbr
      this.order.colorYarnColorCode =
        order.yarnColorNumber && (order.yarnColorNumber.code + (order.colorName ? '-' + order.colorName : '')) // 色号拼接颜色
      this.order.techYarnTechCode =
        order.yarnTechnologyCode && order.yarnTechnologyCode.name
      if (order.ratio) {
        this.ratioDataSource[0].dataSource = order.ratio.map((item) => {
          item.name = item.ingredients && item.ingredients.name
          item.edit = this.isDetail ? false : this.isEdit
          return item
        })
      }
      if (this.order.colorYarnColorCode) {
        this.formDataThreePart[1].disabled = false
      }
    },
    /**
     * @description 属性组合选择
     */
    dialogHandler() {
      this.getCompositePropertiesList()
      this.$set(this.dialogOptions, 'visible', true)
    },
    dialogHandle(flag) {
      this.$set(this.dialogOptions, 'visible', flag)
    },
    // 获取属性列表
    async getCompositePropertiesList(data = {}) {
      const res = await compositePropertiesList({
        ...this.dialogOptions.searchFormDatas,
        ...data
      })
      if (res.code === 200) {
        this.$set(this.dialogOptions, 'loading', false)
      }
      const userList = res.data.list || []
      this.$set(this.dialogOptions, 'dataSource', userList)
      this.$set(this.dialogOptions, 'pagination', {
        ...this.dialogOptions.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        page: res.data.page,
        pageSize: res.data.pageSize
      })
    },
    // 引入
    async pullHandler() {
      if (!this.order.embryoCode) {
        this.$message({
          type: 'warning',
          message: '请输入坯纱编码'
        })
        return
      }
      const res = await getEmbryoCode({ code: this.order.embryoCode })
      delete res.data.uuid
      delete res.data.id
      delete res.data.creator
      delete res.data.updator
      this.order = Object.assign(this.order, res.data)
      this.order.embryoCode = ''
      this.order.type = 2
      this.setOrder(this.order)
      this.$refs.formTwoPart.resetData(this.order)
    },
    // 数据来源
    getDataFrom(dataSource) {
      let str = '产品目录库'
      switch (dataSource) {
        case 1:
          str = '产品目录库'
          break
        case 2:
          str = '样板开发'
          break
        case 3:
          str = '客户订单'
          break
        case 4:
          str = '采购订单'
          break
        case 5:
          str = '工艺总结'
          break
        default:
          break
      }
      return str
    },
    // 搜索数据源
    async setSelectData(typeName, index, init = false) {
      if (init) {
        this.$set(this.dialogOptions.searchData[index], 'dataSource', [])
        this.$set(this.dialogOptions.searchData[index], 'loading', true)
      } else {
        let res = null
        switch (typeName) {
          case '组合简称':
            res = await publicSelectList({ 'categoryId': 22 })
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
        if (typeName === '组合简称') {
          data = res.data.map((item) => {
            item.label = item.abbr
            item.value = item.abbr
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
    // 提交
    submitForm() {
      let pass = false
      this.$refs.ratioTable.form.validate(async(valid) => {
        if (valid) {
          pass = true
        } else {
          pass = false
        }
      })
      this.$refs.formTwoPart.$refs.form.validate(async(valid) => {
        if (valid && pass) {
          // 编辑
          if (this.isDetail) {
            this.$confirm(' 请确认提交该数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async() => {
              const res = await update({
                id: this.order.id,
                techYarnTechUuid: this.order.techYarnTechUuid || 0,
                techYarnTechCode: this.order.techYarnTechCode
              })
              if (res.code !== 200) {
                return
              }
              this.isEdit = false
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              const { beforeCode, afterCode } = this.compareData(
                this.beforeCode,
                {
                  uuid: this.order.uuid,
                  code: this.order.code,
                  techYarnTechCode: this.order.techYarnTechCode
                },
                'uuid'
              )
              const flag =
                JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
              flag &&
                this.fetchLog(
                  this.getLogMessages(
                    'UPDATE',
                    `${configData.productRequestPrefix}/api/naturalFiber/update`
                  ),
                  afterCode,
                  JSON.stringify({
                    beforeText: `在'产品目录库-纱线管理-天然纤维'将纱线编码:${this.order.code}`,
                    afterText: '修改为',
                    ...{ beforeCode, afterCode }
                  })
                )
              this.$router.push({ name: 'NaturalFiberList' })
            })
            return
          }
          // 新增
          if (!this.order.yarnTypeAttrAbbr) {
            this.$message({
              message: '请添加属性组合！',
              type: 'warning'
            })
            return
          }
          this.order.ratio = this.ratioDataSource[0].dataSource
          for (let i = 0; i < this.order.ratio.length - 1; i++) {
            if (this.order.ratio[i].ratio - this.order.ratio[i + 1].ratio < 0) {
              this.$message({
                message: '成分比例应由大至小填写！',
                type: 'warning'
              })
              return
            }
          }
          if (
            this.order.ratio.reduce((sum, cru) => {
              return sum + (cru.ratio * 100 - 0)
            }, 0) -
            10000 !==
            0
          ) {
            this.$message({
              message: '比例总值必须等于100!',
              type: 'warning'
            })
            return
          }
          this.$confirm(' 请确认提交该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            this.order.techYarnTechUuid = this.order.techYarnTechUuid || 0
            const res = await store(this.order)
            if (res.code !== 200) {
              return
            }
            this.isEdit = false
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            res.data.code.forEach(async(item) => {
              await this.fetchLog(
                this.getLogMessages('INSERT', `${configData.productRequestPrefix}/api/naturalFiber/store`),
                this.order,
                JSON.stringify({
                  beforeText: `在'产品目录库-纱线管理-天然纤维'新增一条记录编码：${item}`,
                  beforeCode: { ...this.order, code: item }
                })
              )
            })
            if (res.data.embryoYarn) {
              // 新建一条正式状态的色纱时，其关联的坯纱状态如果为临时，状态也改为正式
              await this.fetchLog(
                this.getLogMessages(
                  'UPDATE',
                  `${configData.productRequestPrefix}/api/naturalFiber/update`
                ),
                { skuStatus: res.data.embryoYarn.oldStatus },
                JSON.stringify({
                  beforeText: `在'产品目录库-纱线管理-天然纤维'将纱线编码：${res.data.embryoYarn.code}`,
                  afterText: '修改为',
                  ...{ beforeCode: { skuStatus: res.data.embryoYarn.oldStatus }, afterCode: { skuStatus: res.data.embryoYarn.newStatus }}
                })
              )
            }
            this.$router.push({ name: 'NaturalFiberList' })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tableitem {
  /deep/ .el-table--mini {
    font-size: 14px;
  }
  width: 100%;
  .title {
    font-size: 16px;
    color: #151222;
    padding-right: 12px;
    line-height: 52px;
  }
  .title-h {
    border-bottom: 1px solid #efefef;
    margin-bottom: 20px;
  }
  .table {
    flex: 1;
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
.pointer {
  height: 32px;
  cursor: pointer;
  margin-left: 5px;
}
/deep/.el-form-item {
  margin-bottom: 0px;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #777474;
}
/deep/.table tr:nth-child(even) {
  background-color: #ffffff;
}
</style>
