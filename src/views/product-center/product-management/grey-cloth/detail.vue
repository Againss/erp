<!--
 * @Date: 2020-09-29 17:14:01
 * @Author: Againss
 * @LastEditTime: 2021-07-20 11:51:07
 * @LastEditors: zhengjin
 * @Descripttion: 坯布详情
-->
<template>
  <div class="product-detail-content">
    <div v-show="isDetail" class="product-item-top">
      <div class="product-item-codeinfo">
        <div class="code-item">坯布编码：{{ order.code }}</div>
      </div>
    </div>
    <div v-show="isDetail" class="product-item-content">
      <div class="product-content-title">基本信息</div>
      <div class="product-content-info">
        <item
          ref="formPart"
          :is-edit="false"
          :form-data="formDataPart"
          :order="order"
        />
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">坯布参数</div>
      <div class="product-content-info">
        <item
          ref="formTwoPart"
          :is-edit="!isDetail"
          :rules="rulesTwoPart"
          :form-data="formDataTwoPart"
          :order="order"
        />
        <item
          ref="formOnePart"
          :is-edit="isEdit"
          :rules="rulesOnePart"
          :form-data="formDataOnePart"
          :order="order"
        />
      </div>
    </div>
    <div v-show="isStripe" class="product-item-content">
      <div class="titleitem product-content-title">
        <div
          class="title"
          :class="{ 'product-is-request': isEdit }"
        >条纹间距</div>
        <div>
          <el-button
            v-if="!isDetail"
            style="margin-top: 10px"
            type="primary"
            size="mini"
            @click="getYarn(1)"
          >添加</el-button>
        </div>
      </div>
      <div class="product-content-info" style="padding-top: 0">
        <cs-custom-table
          ref="singleTable"
          class="product-style-table"
          :header-cell-style="{
            background: '#F5F7FA!important',
          }"
          tooltip-effect="dark"
          :columns="stripeColumns"
          :data-source="stripeData"
          :operates="stripeOperates"
        />
      </div>
    </div>
    <div v-show="isJacquard" class="product-item-content jacquard">
      <div class="titleitem product-content-title">
        <div
          class="title"
          :class="{ 'product-is-request': isEdit }"
        >提花组合</div>
      </div>
      <div class="product-content-info">
        <div class="title">
          <div
            :class="{ 'product-is-request': isEdit }"
          >非提花纱线组合</div>
          <div>
            <el-button
              v-if="!isDetail"
              style="margin-top: 10px"
              type="primary"
              size="mini"
              @click="getYarn(2)"
            >设置</el-button>
          </div>
        </div>
        <item
          ref="formPart"
          :is-edit="false"
          :form-data="formJacquard"
          :order="order"
        />
      </div>
      <div class="product-content-info">
        <div class="title">
          <div
            :class="{ 'product-is-request': isEdit }"
          >提花组合</div>
          <div>
            <el-button
              v-if="!isDetail"
              style="margin-top: 10px"
              type="primary"
              size="mini"
              @click="getYarn(3)"
            >添加</el-button>
          </div>
        </div>
        <cs-custom-table
          ref="singleTable"
          class="product-style-table"
          :header-cell-style="{
            background: '#F5F7FA!important',
          }"
          tooltip-effect="dark"
          :columns="jacquardColumns"
          :data-source="jacquardData"
          :operates="jacquardOperates"
        />
      </div>
    </div>
    <!-- 纱线组合 -->
    <div class="product-item-content" style="padding: 0 20px;">
      <yarn-table
        ref="yarnTable"
        style="width: 100%"
        :order="order"
        :is-edit="isEdit && !isDetail"
        @setYarn="setYarn"
        @UpData="yarnUpData"
      />
    </div>
    <div class="product-item-content">
      <div class="product-content-title">工艺信息</div>
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
    <!-- 导入pop弹出层 -->
    <dialog-item :options="popOptions" :order="order" />
  </div>
</template>

<script>
import item from '@/views/product-center/components/detaiItem'
import colorItem from './components/color'
import { store, show, update, jacquardCodeAll, clothList } from './api'
import yarnTable from './components/table'
import dialogItem from './components/popDailog.vue'
import logMethods from '@/views/product-center/mixin/log-methods'
import { yarnColorCodeAll } from '../../yarn-management/chemical-fiber/api'
import configData from '@/views/product-center/configDock/index.js'
export default {
  name: 'GreyClothCreate',
  components: { item, yarnTable, dialogItem },
  mixins: [logMethods],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const validatePass = (rule, value, callback) => {
      const res = /^([1-9]\d*|0)(\.\d{1,2})?$/g
      if (!res.test(value)) {
        callback(new Error('请输入至多两位小数的数字'))
      } else {
        callback()
      }
    }
    // 非提花
    const formJacquard = [
      {
        name: 'jacquardNonColorCode',
        notEdit: 'true',
        isJac: true,
        type: 'input',
        label: '色号'
      },
      {
        name: 'jacquardNonYarnCode',
        notEdit: 'true',
        type: 'input',
        label: '纱线组合',
        style: { width: '600px' },
        showStyle: { 'max-width': '500px' }
      }
    ]
    // 条纹间距tabel
    const stripeColumns = [
      {
        prop: 'yarnId',
        label: '序号',
        width: '80',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'height',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        label: '高度/cm',
        minWidth: '100'
      },
      {
        prop: 'colorYarnColorCode',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        label: '色号',
        minWidth: '200',
        formater: (scope) => {
          return scope.row.colorYarnColorCode + (scope.row.colorName !== '' ? '-' : '') + scope.row.colorName
        }
      },
      {
        prop: 'yarnCode',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        label: '纱线组合',
        minWidth: '200'
      }
    ]
    let stripeList = [
      {
        label: '编辑',
        isShow: true,
        handle: async(params) => {
          // 记录当前编辑行
          this.curIndex = params.$index
          this.$set(this.popOptions, 'formDatas', params.row)
          this.popOptions['title'] = '编辑条纹'
          this.ownDepartment[0].isShow = true
          this.ownDepartment[1].isShow = true
          this.ownDepartment[2].isShow = false
          this.popUpStatus(true)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        isShow: true,
        handle: async(params) => {
          this.$confirm(' 你确认要删除该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.stripeData.splice(params.$index, 1)
            this.upData(1)
          }).catch(() => {})
        }
      }
    ]
    stripeList = this.$filterPermission(stripeList)
    const stripeOperates = {
      label: '操作',
      width: '150',
      dataSource: stripeList
    }
    // 提花tabel
    const jacquardColumns = [
      {
        prop: 'seq',
        label: '序号',
        width: '80',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'jacquardCode',
        label: '提花花号',
        minWidth: '100',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        components: {
          colorItem
        }
      },
      {
        prop: 'yarnCode',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        label: '纱线组合',
        minWidth: '300'
      }
    ]
    const jacquardList = [
      {
        label: '编辑',
        isShow: true,
        handle: async(params) => {
          // 记录当前编辑行
          this.curIndex = params.$index
          this.$set(this.popOptions, 'formDatas', params.row)
          this.popOptions['title'] = '编辑提花'
          this.ownDepartment[0].isShow = false
          this.ownDepartment[1].isShow = false
          this.ownDepartment[2].isShow = true
          this.popUpStatus(true)
        }
      },
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
            this.jacquardData.splice(params.$index, 1)
            this.upData(2)
          }).catch(() => {})
        }
      }
    ]
    const jacquardOperates = {
      label: '操作',
      width: '150',
      dataSource: jacquardList
    }
    // 验证字段
    const rulesOnePart = {
      bdFabricationProduceModeKnitValue: [
        { message: '请选择织造花型', required: true, trigger: 'change' }
      ]
      // isComputerJacquard: [
      //   { message: '请选择是否电脑提花', required: true, trigger: 'change' }
      // ]
    }
    const rulesTwoPart = {
      bdFabricationsValue: [
        { message: '请选择布种', required: true, trigger: 'change' }
      ],
      bdFabricationProduceModeDyedValue: [
        { message: '请选择染方式', required: true, trigger: 'change' }
      ],
      totalNeedleNumber: [
        { message: '请输入总针数', required: true, trigger: 'change' },
        { type: 'number', message: '总针数必须为数字值' }
      ]
    }
    // 字段信息 （根据页面结构需分段）
    const formDataOnePart = [
      {
        name: 'bdFabricationProduceModeKnitValue',
        type: 'select-search',
        label: '织造花型',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择织造花型',
        requestParam: { 'mode': 'K' },
        apiUrl: `basis/api/fabricationProduceModes/option`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.$refs['formOnePart'].resetData({
            bdFabricationProduceModeKnitValue: e.data.name || ''
          })
          this.order.bdFabricationProduceModeKnitValue = e.data.name || ''
          this.order.bdFabricationProduceModeKnitAbbr = e.data.abbr || ''
          this.order.bdFabricationProduceModeKnitUuid = e.data.uuid || ''
          const name = e.data.name
          if (e.data && e.data.name) {
            name === '电脑提花' ? this.handlerComputer(1) : this.handlerComputer(0)
            name.search('提花') === -1 ? this.isJacquard = false : this.isJacquard = true
            name.search('间') === -1 ? this.isStripe = false : this.isStripe = true
            // name.search('净色') === -1 ? this.isYarn = false : this.isYarn = true
          } else {
            this.handlerComputer()
            this.isJacquard = false
            this.isStripe = false
          }
          this.$refs['formOnePart'].resetData({
            isComputerJacquardValue: this.order.isComputerJacquardValue,
            isComputerJacquard: this.order.isComputerJacquard
          })
          this.getBdCloth()
        }
      },
      {
        name: 'isComputerJacquard',
        type: 'select',
        label: '是否电脑提花',
        disabled: true,
        showValue: 'isComputerJacquardValue',
        placeholder: '',
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
      },
      {
        name: 'resilience',
        type: 'select',
        label: '是否弹力',
        disabled: true,
        showValue: 'resilienceValue',
        placeholder: '',
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
      }
    ]
    const formDataTwoPart = [
      {
        name: 'bdFabricationsValue',
        type: 'select-search',
        label: '布种',
        searchValue: 'name',
        valueKey: 'name',
        clearable: true,
        notEdit: false,
        placeholder: '请选择布种',
        apiUrl: `basis/api/fabrications/option`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.$refs['formTwoPart'].resetData({
            bdFabricationsValue: e.data.name || ''
          })
          this.order.bdFabricationsValue = e.data.name || ''
          this.order.bdFabricationsAbbr = e.data.abbr || ''
          this.order.bdFabricationsUuid = e.data.uuid || ''
          this.getBdCloth()
        }
      },
      {
        name: 'bdFabricationProduceModeDyedValue',
        type: 'select-search',
        clearable: true,
        label: '染方式',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择染方式',
        requestParam: { 'mode': 'D' },
        apiUrl: `basis/api/fabricationProduceModes/option`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.$refs['formTwoPart'].resetData({
            bdFabricationProduceModeDyedValue: e.data.name || ''
          })
          this.order.bdFabricationProduceModeDyedValue = e.data.name || ''
          this.order.bdFabricationProduceModeDyedAbbr = e.data.abbr || ''
          this.order.bdFabricationProduceModeDyedUuid = e.data.uuid || ''
          this.getBdCloth()
        }
      },
      {
        name: 'totalNeedleNumber',
        type: 'input',
        label: '总针数',
        placeholder: '请输入总针数',
        changeHandler: (value) => {
          this.$refs['formTwoPart'].resetData({
            totalNeedleNumber: isNaN(value)
              ? ''
              : value > 10000
                ? 10000
                : (value && value - 0) || ''
          })
          this.order.totalNeedleNumber = isNaN(value)
            ? ''
            : value > 10000
              ? 10000
              : (value && value - 0) || ''
        }
      },
      {
        name: 'bdClothName',
        type: 'input',
        label: '布类',
        disabled: true,
        placeholder: ''
      }
    ]
    const formDataThreePart = [
      {
        name: 'techWeavingTechCode',
        type: 'select-search',
        clearable: true,
        label: '织工艺编码',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        placeholder: '请选择织工艺编码',
        apiUrl: `${configData.productRequestPrefix}/api/tech/weavingTech/all`,
        optionsLabel: 'name',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.$refs['formDataThreePart'].resetData({
            techWeavingTechCode: e.data.name || ''
          })
          this.order.techWeavingTechCode = e.data.name || ''
        }
      }
    ]
    // 字段信息 （根据页面结构需分段）
    const formDataPart = [
      {
        name: 'productFromValue',
        notEdit: 'true',
        type: 'input',
        label: '成品来源'
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
    // pop弹窗
    const ownDepartment = [
      {
        prop: 'height',
        itemType: 'input',
        label: '高度(cm)',
        isShow: true,
        rules: [
          { required: true, message: '高度不能为空', trigger: ['blur'] },
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      {
        prop: 'colorYarnColorCode',
        itemType: 'select',
        placeholder: '',
        label: '色号',
        rules: [
          { required: true, message: '色号不能为空', trigger: ['blur'] },
          { validator: commonBlurReg, trigger: 'blur' }
        ],
        isShow: true,
        filterable: true,
        dataSource: [],
        visibleChange: (flag) => {
          flag && this.getColorData()
        }
      },
      {
        prop: 'jacquardCode',
        itemType: 'select',
        label: '提花号',
        rules: [
          { required: true, message: '提花号不能为空', trigger: ['blur'] },
          { validator: commonBlurReg, trigger: 'blur' }
        ],
        isShow: false,
        filterable: true,
        dataSource: [],
        visibleChange: (flag) => {
          flag && this.getJacquardData()
        }
      }
    ]
    const popOptions = {
      visible: false,
      title: '设置条纹',
      okText: '确定',
      ok: (params) => {
        const dataList = this.$utils.deepClone(params)
        const title = this.popOptions['title']
        // console.log(dataList, '条纹or提花', title, this.curIndex)
        // 通过curIndex判断新增or编辑
        if (this.curIndex >= 0) {
          switch (title) {
            case '编辑条纹':
              this.stripeData.splice(this.curIndex, 1, dataList)
              this.upData(1)
              break
            case '编辑提花':
              this.jacquardData.splice(this.curIndex, 1, dataList)
              this.upData(2)
              break
            default:
              break
          }
        } else {
          switch (title) {
            case '设置条纹':
              // console.log(this.curIndex, '当前索引')
              this.stripeData.push(dataList)
              this.order['spacing'] = this.stripeData
              // console.log('设置条纹', this.stripeData)
              this.stripeColorCode()
              this.upData(1)
              break
            case '设置提花':
              this.jacquardData.push(dataList)
              this.order['jacquard'] = this.jacquardData
              // console.log('设置提花', this.jacquardData)
              this.jacquardColorCode()
              this.upData(2)
              break
            default:
              this.order['jacquardNonColorCode'] = dataList.colorYarnColorCode
              this.order['jacquardNonYarnCode'] = dataList.yarnCode
              this.order['jacquardNonColorName'] = this.colorDataList.find((items) => {
                return items.code === dataList.colorYarnColorCode
              }).customerColor
              this.nJacquard = dataList
              // console.log(this.nJacquard, '设置非提花')
              this.upData(2)
              break
          }
        }
        this.popUpStatus(false)
      },
      cancel: (params) => {
        this.popUpStatus(false)
      },
      formDatas: {}, // pop数据来源
      content: ownDepartment
    }
    return {
      order: {},
      isJacquard: false,
      isStripe: false,
      isDetail: false, // 是否详情
      isEdit: true, // 是否可编辑
      // 字段验证
      rulesOnePart,
      rulesTwoPart,
      formDataPart,
      formDataOnePart,
      formDataTwoPart,
      formDataThreePart,
      beforeCode: {},
      curIndex: -1, // 记录编辑的行
      // 条纹
      stripeData: [],
      stripeList,
      stripeColumns,
      stripeOperates,
      // 非提花
      formJacquard,
      nJacquard: {},
      // 提花
      jacquardData: [],
      jacquardColumns,
      jacquardOperates,
      // 弹窗
      popOptions,
      ownDepartment,
      // 色号下拉数据
      colorDataList: [],
      // 提花号下拉数据
      jacquardDataList: []
    }
  },
  watch: {
    'order.resilience': {
      handler(val, newVal) {
        // console.log(val, newVal, '弹力', this.isDetail)
        if (!this.isDetail) {
          this.getBdCloth()
        }
      }
    }
  },
  created() {
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
      this.formDataOnePart.forEach((item) => {
        item.notEdit = true
      })
    }
  },
  methods: {
    // 初始化
    initOrder() {
      this.order = {
        code: '',
        dataSource: 1, // 数据来源
        sourceOrderTypeName: '-', // 来源订单类型 查看时的值
        sourceOrder: '', // 来源单号
        productFrom: 1, // 产品来源
        bdFabricationsUuid: '', // 布种id
        bdFabricationsValue: '',
        bdFabricationsAbbr: '', // 布种简称
        bdFabricationProduceModeDyedUuid: '', // 染方式id
        bdFabricationProduceModeDyedAbbr: '', // 染方式简称
        bdFabricationProduceModeDyedValue: '',
        bdFabricationProduceModeKnitUuid: '', // 织造花型id
        bdFabricationProduceModeKnitAbbr: '', // 织造花型简称
        bdFabricationProduceModeKnitValue: '',
        totalNeedleNumber: '', // 总针数
        resilience: '', // 是否弹力
        resilienceValue: '',
        isComputerJacquard: '', // 是否电脑提花 1是 0否
        bdClothName: '', // 布类
        bdClothUuid: '',
        isComputerJacquardValue: '',
        // techWeavingTechId: '', // 织工艺编码id
        techWeavingTechCode: '', // 织工艺编码
        jacquardNonColorCode: '', // 非提花色号
        jacquardNonYarnCode: '', // 非提花纱线组合编码
        jacquardNonColorName: '', // 非提花纱线颜色
        ratio: [], // 比例表
        spacing: [], // 间距表
        jacquard: [], // 提花表
        combination: [] // 组合表
      }
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
    // 添加纱线
    getYarn(type) {
      this.curIndex = -1
      switch (type) {
        case 1:
          this.popOptions['title'] = '设置条纹'
          this.ownDepartment[0].isShow = true
          this.ownDepartment[1].isShow = true
          this.ownDepartment[2].isShow = false
          break
        case 2:
          this.popOptions['title'] = '设置非提花'
          this.$set(this.popOptions, 'formDatas', this.nJacquard)
          this.ownDepartment[0].isShow = false
          this.ownDepartment[1].isShow = true
          this.ownDepartment[2].isShow = false
          break
        case 3:
          this.popOptions['title'] = '设置提花'
          this.ownDepartment[0].isShow = false
          this.ownDepartment[1].isShow = false
          this.ownDepartment[2].isShow = true
          break
        default:
          break
      }
      this.popUpStatus(true)
    },
    // 弹窗操作
    popUpStatus(val) {
      if (!val) {
        this.$set(this.popOptions, 'formDatas', {})
      }
      this.popOptions['visible'] = val
    },
    // 色号
    async getColorData() {
      const res = await yarnColorCodeAll()
      if (res.code !== 200) {
        return
      }
      let data = []
      data = res.data.map((item) => {
        item.label = item.code
        item.value = item.code
        return item
      })
      this.colorDataList = data
      this.$set(this.popOptions.content[1], 'dataSource', data)
    },
    // 提花号
    async getJacquardData() {
      const res = await jacquardCodeAll()
      if (res.code !== 200) {
        return
      }
      let data = []
      data = res.data.map((item) => {
        item.label = item.code
        item.value = item.code
        return item
      })
      this.jacquardDataList = data
      this.$set(this.popOptions.content[2], 'dataSource', data)
    },
    async getOrder(id) {
      const res = await show({ id })
      this.order = Object.assign(this.order, res.data)
      // console.log(this.order, '------------详情', this.isDetail)
      this.beforeCode = {
        uuid: this.order.uuid,
        code: this.order.code,
        techWeavingTechCode:
          this.order.weavingTech && this.order.weavingTech.name
      }
      this.setOrder(this.order)
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
      this.order.productFromValue = order.productFrom === 1 ? '自有' : '外来'
      this.order.isComputerJacquardValue = this.order.isComputerJacquard === 1 ? '是' : '否'
      this.order.resilienceValue = this.order.resilience === 1 ? '是' : '否'
      this.order.bdFabricationsAbbr =
        order.fabrication && order.fabrication.abbr
      this.order.bdFabricationsValue =
        (order.fabrication && order.fabrication.name) || ''
      this.order.bdFabricationProduceModeDyedValue =
        (order.fabricationDyed && order.fabricationDyed.name) || ''
      this.order.bdFabricationProduceModeDyedAbbr =
        order.fabricationDyed && order.fabricationDyed.abbr
      this.order.bdFabricationProduceModeKnitValue =
        (order.fabricationKnit && order.fabricationKnit.name) || ''
      this.order.bdFabricationProduceModeKnitAbbr =
        order.fabricationKnit && order.fabricationKnit.abbr
      this.order.techWeavingTechCode =
        order.weavingTech && order.weavingTech.name
      if (order.spacing.length && order.spacing.length > 0) {
        this.isStripe = true
        this.stripeOperates = null
        this.stripeData = order.spacing
      }
      this.order.jacquardNonColorCode = order.jacquardNonColorCode || ''
      this.order.jacquardNonYarnCode = order.jacquardNonYarnCode || ''
      if (order.jacquard.length && order.jacquard.length > 0) {
        this.isJacquard = true
        this.jacquardOperates = null
        this.jacquardData = order.jacquard
      }
      this.order.bdClothName = !order.cloth ? '-' : order.cloth.name
    },
    // 设置纱线时候  判断是否弹力
    setYarn(data) {
      const flag = data.find(item => {
        return item.resilience
      })
      if (flag) {
        this.order.resilience = 1
        this.order.resilienceValue = '是'
      } else {
        this.order.resilience = 0
        this.order.resilienceValue = '否'
      }
      if (!data.length) {
        this.order.resilience = ''
        this.order.resilienceValue = ''
      }
      this.$refs['formOnePart'].resetData({
        resilienceValue: this.order.resilienceValue,
        resilience: this.order.resilience
      })
    },
    // 切换织花花型 清空纱线组合
    handlerComputer(val) {
      this.nJacquard = {}
      this.order['jacquardNonColorCode'] = ''
      this.order['jacquardNonYarnCode'] = ''
      this.order['colorYarnColorCode'] = ''
      this.order['jacquardNonColorName'] = ''
      this.stripeData = []
      this.jacquardData = []
      this.order['combination'] = []
      if (this.order.isComputerJacquard !== val) {
        this.$refs.yarnTable.setCombination([])
      }
      this.order.isComputerJacquard = val
      this.order.isComputerJacquardValue = val === 1 ? '是' : (val === 0 ? '否' : '')
    },
    // 取消
    cancel() {
      this.isEdit = false
      this.$router.push({ name: 'GreyClothList' })
    },
    // 提交
    submitForm() {
      if (this.isDetail) {
        // 编辑
        this.yarnEnid()
      } else {
        // 新增
        this.order.ratio = this.$refs.yarnTable.dataSourceI
        let pass = false
        this.$refs.formTwoPart.$refs.form.validate(async(valid) => {
          if (valid) {
            pass = true
          } else {
            pass = false
          }
        })
        this.$refs.formOnePart.$refs.form.validate(async(valid) => {
          if (valid && pass) {
            pass = true
          } else {
            pass = false
          }
        })
        if (!pass) return
        if (this.isStripe && !this.order.spacing.length) {
          this.$message({ type: 'warning', message: '请添加纱线' })
          return false
        }
        if (this.isJacquard && this.order.jacquardNonColorCode === '') {
          this.$message({ type: 'warning', message: '请设置非提花组合数据' })
          return false
        }
        if (this.isJacquard && !this.order.jacquard.length) {
          this.$message({ type: 'warning', message: '请添加提花' })
          return false
        }
        if (!this.order.combination.length) {
          this.$message({ type: 'warning', message: '请添加纱线' })
          return false
        }
        if (this.order.combination.find((item) => !item.ratio || !item.length.length)) {
          this.$message({
            message: '纱线组合纱长不能为空',
            type: 'warning'
          })
          return false
        }
        if (this.$refs.yarnTable.yarnData.reduce((sum, cru) => {
          return sum + (cru.ratio * 10 - 0)
        }, 0) - 1000 !== 0) {
          this.$message({
            message: '纱线组合比例总值必须等于100!',
            type: 'warning'
          })
          return false
        }
        if (!this.order.bdClothUuid) {
          this.$message({
            message: '布类为空, 重新选择布种、染方式、织花花型',
            type: 'warning'
          })
          return false
        }
        this.addYarn()
        // this.$refs.formTwoPart.$refs.form.validate(async(valid, object) => {
        //   if (valid) {
        //     this.addYarn()
        //   } else {
        //     return false
        //   }
        // })
      }
    },
    yarnEnid() {
      this.$confirm(' 请确认提交该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await update({
          id: this.order.id,
          techWeavingTechCode: this.order.techWeavingTechCode
        })
        if (res.code !== 200) {
          return
        }
        this.isEdit = false
        this.$message({ type: 'success', message: '提交成功' })
        const { beforeCode, afterCode } = this.compareData(
          this.beforeCode,
          {
            uuid: this.order.uuid,
            code: this.order.code,
            techWeavingTechCode: this.order.techWeavingTechCode
          },
          'uuid')
        const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
        flag && this.fetchLog(
          this.getLogMessages('UPDATE', `${configData.productRequestPrefix}/api/embryo/update`),
          afterCode,
          JSON.stringify({
            beforeText: `在'产品目录库-产品管理-坯布'将坯布编码:${this.order.code}`,
            afterText: '修改为',
            ...{ beforeCode, afterCode }
          })
        )
        this.$router.push({ name: 'GreyClothList' })
      }).catch(() => {})
    },
    addYarn() {
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
        this.isDetail = true
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.fetchLog(
          this.getLogMessages('INSERT', `${configData.productRequestPrefix}/api/embryo/store`),
          this.order,
          JSON.stringify({
            beforeText: `在'产品目录库-产品管理-坯布'新增一条记录坯布编码：${res.data.code}`,
            beforeCode: this.order
          })
        )
        this.$router.push({ name: 'GreyClothList' })
      }).catch(() => {})
    },
    // 纱线组合数据合并
    getConversion(data) {
      let arr = []
      for (let i = 0; i < data.length; i++) {
        arr = [...arr, ...data[i].yarnData]
      }
      return arr
    },
    yarnUpData(params) {
      this.order['combination'] = params
    },
    // 获取纱线组合数据
    upData(type) {
      // console.log(type, '纱线来源1-条纹,2-提花')
      // console.log(this.order['combination'])
      const res = new Map()
      let str, jacquard
      if (type === 1) {
        // console.log('条纹纱线', this.stripeData)
        str = this.getConversion(this.stripeData)
        // 去重
        str = str.filter((item) => !res.has(item.id) && res.set(item.id, 1))
        // console.log('条纹纱线组合去重', str)
        this.setYarn(str) // 弹力
        // 纱线数据过滤
        this.yarnListFilter(str)
        this.order['combination'] = this.intersection(this.order['combination'], str, 'id')
      } else {
        // console.log(!this.nJacquard.yarnData, '判断非提花是否有数据', this.nJacquard)
        str = this.getConversion(this.jacquardData)
        if (!this.nJacquard.yarnData) {
          jacquard = [...str]
        } else {
          jacquard = [...this.nJacquard['yarnData'], ...str]
        }
        // 纱线组合id去重
        jacquard = jacquard.filter((item) => !res.has(item.id) && res.set(item.id, 1))
        this.setYarn(jacquard) // 弹力
        this.yarnListFilter(jacquard)
        this.order['combination'] = this.intersection(this.order['combination'], jacquard, 'id')
      }
    },
    yarnListFilter(param) {
      // console.log(param, '所有纱线组合数据')
      // console.log(this.order['combination'], '已添加纱线组合数据')
      // 数据过滤
      for (let i = 0; i < param.length; i++) {
        this.yarnFilter(param[i])
      }
    },
    // 条纹及提花纱线数据来源
    yarnFilter(params) {
      const arr = []
      switch (params.yarnTypes) {
        case 1:
          params.ratio.forEach((item) => {
            arr.push({
              ingredients: item.ingredients && item.ingredients.name,
              bdIngredientsUuid: item.ingredients && item.ingredients.uuid,
              ratio: item.ratio
            })
          })
          break
        case 2:
          arr.push({
            ingredients: params.ingredients && params.ingredients.name,
            bdIngredientsUuid: params.ingredients && params.ingredients.uuid,
            ratio: 100
          })
          break
        case 3:
          params && params.combination && params.combination.forEach((item) => {
            item.combinationList && item.combinationList.forEach((val) => {
              arr.push({
                ingredients: (val.ingredients && val.ingredients.name) || '',
                bdIngredientsUuid: (val.ingredients && val.ingredients.uuid) || '',
                ratio: (val.ratio * item.proportion) / 100
              })
            })
          })
          break
        default:
          break
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
        params.yarnTypes !== 3
          ? params.ingredients && params.ingredients.name
          : nameArr.join('-')
      const obj = {
        code: params.code, // 纱线编码
        yarnType: params.yarnTypes, // 纱线类型 1天然纤维 2化学纤维 3组合纤维
        yarnId: params.id, // 纱线的id
        id: params.id,
        ratio: '', // 比例
        edit: true,
        ingredientsValue: str,
        ingredientsArr: arr,
        holeNumber: 100, // 坑数（在纱长设置页面）
        holeType: 'G', // 坑的类型  G：G坑  R：R坑
        resilience: params.resilience, // 是否弹力 1是 0否
        length: [] // 纱长表
      }
      // console.log(obj, this.order['combination'])
      var result = this.order['combination'].some(item => {
        if (item.yarnId === obj.yarnId) {
          return true
        }
      })
      if (result) {
        return false
      } else {
        this.order['combination'].push(obj)
      }
      // this.order['combination'].push(obj)
    },
    // 色号拼接
    jacquardColorCode() {
      for (let i = 0; i < this.jacquardData.length; i++) {
        var obj = this.jacquardDataList.find((items) => {
          return items.code === this.jacquardData[i]['jacquardCode']
        })
        this.jacquardData[i].showUrl = obj.showUrl
      }
    },
    stripeColorCode() {
      for (let i = 0; i < this.stripeData.length; i++) {
        var obj = this.colorDataList.find((items, j) => {
          return items.code === this.stripeData[i]['colorYarnColorCode']
        })
        this.stripeData[i].colorName = obj.customerColor
      }
    },
    intersection(arr, arrs, id) {
      return arr.filter(t => (id ? arrs.map(i => i[id]).includes(t[id]) : arrs.includes(t)))
    },
    // 布类查询
    async getBdCloth() {
      if (!this.order.bdFabricationsUuid || !this.order.bdFabricationProduceModeDyedUuid ||
        !this.order.bdFabricationProduceModeKnitUuid || this.order.resilience === ''
      ) {
        return
      } else {
        const res = await clothList({
          'knit_uuid': this.order.bdFabricationProduceModeKnitUuid,
          'dye_uuid': this.order.bdFabricationProduceModeDyedUuid,
          'fabrication_uuid': this.order.bdFabricationsUuid,
          'resilience': this.order.resilience === 0 ? 'N' : 'Y'
        })
        // console.log(res, '--------------布类')
        if (!res.data) {
          this.$set(this.order, 'bdClothName', null)
          this.$set(this.order, 'bdClothUuid', null)
        } else {
          this.$set(this.order, 'bdClothName', res.data.name)
          this.$set(this.order, 'bdClothUuid', res.data.uuid)
        }
        this.$refs['formTwoPart'].resetData({
          bdClothName: this.order.bdClothName,
          bdClothUuid: this.order.bdClothUuid
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail-content {
  .product-item-content {
    .titleitem {
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      // border: 0;
      .title {
        ::before {
          content: "";
          border-left: 4px solid #001528;
        }
        font-size: 16px;
        color: #151222;
        padding-right: 12px;
        line-height: 52px;
      }
    }
    /deep/ .custom-form, .table {
      width: 100%;
    }
    .product-content-info {
      .title {
        width: 100%;
        display: flex;
        line-height: 52px;
        justify-content: space-between;
      }
    }
  }
  .jacquard {
    padding-bottom: 15px;
    .product-content-info {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}
/deep/.table tr:nth-child(even) {
  background-color: #ffffff;
}
</style>
