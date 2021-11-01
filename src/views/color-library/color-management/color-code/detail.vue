<!--
 * @Date: 2020-11-03 14:50:48
 * @Author: Againss
 * @LastEditTime: 2021-07-10 10:41:31
 * @LastEditors: zhengjin
 * @Descripttion: 色号管理列表
-->
<template>
  <div class="product-detail-content">
    <div class="product-item-top">
      <div class="product-item-codeinfo">
        <div class="code-item">
          智布色号：{{ order.code }}
          <span v-show="!order.code" class="code-der">保存后自动生成</span>
        </div>
      </div>
      <div v-if="order.id" class="description">
        操作人：{{
          (order.updator && order.updator.realName) ||
            (order.creator && order.creator.realName)
        }}
        &nbsp; 操作时间：{{
          $filters.parseTime(order.operatedTime || 0, "{y}-{m}-{d} {h}:{i}")
        }}&nbsp; 状态：<span
          :class="{
            Audited: order.status === 4,
            Pending: order.status !== 4,
            disabled: order.enabled === 'N',
          }"
        >{{ getStatus() }}</span>
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">基本信息</div>
      <div class="product-content-info">
        <item
          ref="form"
          :is-edit="isEdit"
          :rules="rules"
          :form-data="formData"
          :order="order"
        />
      </div>
    </div>
    <div class="product-item-content">
      <div class="product-content-title">
        用纱信息
        <div>
          <el-button
            v-if="isEdit && order.dataSource === 1"
            type="primary"
            size="mini"
            @click="addHandler"
          >增加</el-button>
        </div>
      </div>
      <div class="yarn-table">
        <cs-custom-form
          ref="dataTable"
          :class="{ isEdit: isEdit && order.dataSource === 1 }"
          :data-source="yarnDataSource"
        />
      </div>
    </div>
    <div v-if="isShow" class="product-item-content">
      <div class="product-content-title">染色信息</div>
      <div class="product-content-info">
        <listForm
          ref="listForm"
          :is-edit="isEdit"
          :order="order"
          :data-source="order.dataSource"
          @change="listFormChange"
        />
      </div>
    </div>
    <div
      v-if="!order.enabled || order.enabled === 'Y'"
      class="product-btn-group"
    >
      <div class="btn-groups">
        <el-button v-if="isEdit" @click="cancel">取消</el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          @click="submitForm"
        >提交</el-button>
        <el-button
          v-show="
            !isEdit &&
              (order.status === 1 ||
              order.status === 5 ||
              (order.colorPlateTypeValue === '花灰纱' && order.status === 3))
          "
          v-permission="['color:Api:ColorManage:ColorManage:update']"
          type="primary"
          @click="setEdit"
        >编辑</el-button>
        <el-button
          v-show="!isEdit && order.status"
          v-permission="['color:Api:ColorManage:ColorManage:copy']"
          type="primary"
          @click="copyOrder"
        >复制</el-button>
        <el-button
          v-show="!isEdit && order.status === 3"
          v-permission="['color:Api:ColorManage:ColorManage:approve']"
          @click="approve"
        >审核</el-button>
        <el-button
          v-show="!isEdit && order.status === 1"
          v-permission="['color:Api:ColorManage:ColorManage:destroy']"
          @click="destroy"
        >删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { show, update, store, yarnCounList, ingredientsList, clothList, destroy } from './api/index.js'
import { approve } from '../api'
import technological from '@/components/tech-require'
import item from '@/views/product-center/components/detaiItem'
import listForm from './components/list-form'
import multInput from './components/mult-input'
import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  components: { item, listForm },
  mixins: [logMethods],
  data() {
    const validatePass = (rule, value, callback) => {
      const res = /^(\d|([1-9]\d))(\.\d{1,2})?$/g
      if (!res.test(value) && value - 100 !== 0) {
        callback(new Error('请输入至多两位小数的数字'))
      } else {
        callback()
      }
    }
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '60',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      {
        prop: 'yarnTypeValue',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        label: '纱支',
        minWidth: '120',
        formDatas: {},
        valueKey: 'uuid',
        labelWidth: '0',
        editOptions: {
          itemType: 'select',
          filterable: true,
          labelWidth: '0',
          rules: [
            { required: true, message: '纱支不能为空', trigger: ['change'] }
          ],
          dataSource: [],
          visibleChange: (flag) => {
            if (flag) {
              this.setSelectData('纱支', 1)
            }
          },
          change: (value, v1, v2, v3, scope) => {
            this.$set(this.yarnDataSource[0].dataSource[scope.$index], 'bdYarnUuid', value)
            const flag = this.yarnDataSource[0].columns[1].editOptions.dataSource.find(item => {
              return item.value === value
            })
            if (flag) {
              this.$set(this.yarnDataSource[0].dataSource[scope.$index], 'yarnTypeValue', flag.name)
            }
          }
        }
      },
      {
        prop: 'ingredientValue',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        label: '成份',
        minWidth: '120',
        formDatas: {},
        valueKey: 'uuid',
        labelWidth: '0',
        editOptions: {
          itemType: 'select',
          filterable: true,
          labelWidth: '0',
          rules: [
            { required: true, message: '成份不能为空', trigger: ['change'] }
          ],
          dataSource: [],
          visibleChange: (flag) => {
            if (flag) {
              this.setSelectData('成份', 2)
            }
          },
          change: (value, v1, v2, v3, scope) => {
            const a = value.split('-')
            this.$set(this.yarnDataSource[0].dataSource[scope.$index], 'ingredientUuid', a[1])
            const flag = this.yarnDataSource[0].columns[2].editOptions.dataSource.find(item => {
              return item.value === value
            })
            if (flag) {
              this.$set(this.yarnDataSource[0].dataSource[scope.$index], 'ingredientType', flag.ingredientType)
              this.$set(this.yarnDataSource[0].dataSource[scope.$index], 'ingredientValue', flag.name)
              if (flag.ingredientType === 2) {
                flag.ingredientRatio = 100
                flag.ingredientUuid = flag.uuid
                delete flag.id
              } else {
                flag.ingredient.forEach(item => {
                  item.ingredientUuid = item.uuid
                  delete item.id
                })
              }
              this.$set(this.yarnDataSource[0].dataSource[scope.$index], 'yarnElement', flag.ingredient || [flag])
            }
          }
        }
      },
      {
        prop: 'yarnElement',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        label: '成份比例%',
        minWidth: '280',
        components: {
          multInput
        },
        componentsOptions: {
          Handler: (list, scope) => {
            this.$set(this.yarnDataSource[0].dataSource[scope.$index], 'yarnElement', list)
          }
        }
      },
      {
        prop: 'yarnRatio',
        labelClassName: 'product-is-request',
        className: 'product-no-request',
        label: '纱比%',
        minWidth: '150',
        editOptions: {
          itemType: 'input',
          labelWidth: '0',
          rules: [
            { required: true, message: '纱比不能为空', trigger: ['change'] },
            { validator: validatePass, trigger: 'change' }
          ],
          change: (value, v1, v2, v3, scope) => {
            // isNaN(value) ? '' : ((value - 0) || '')
            this.$set(this.yarnDataSource[0].dataSource[scope.$index], 'yarnRatio', value)
            this.$refs.dataTable.setDynamicValidateFormRuleForm({ tableForm: this.yarnDataSource[0].dataSource })
          }
        }
      }
    ]
    const formData = [
      {
        name: 'colorPlateTypeValue',
        type: 'select-search',
        searchValue: 'name',
        valueKey: 'name',
        label: '色板类型',
        notEdit: false,
        placeholder: '请选择色板类型',
        apiUrl: 'color/api/colorBd/colorPlateType/all',
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.colorPlateTypeValue = e.data.name
          this.order.colorPlateTypeUuid = e.data.uuid
          this.$refs['form'].resetData({
            colorPlateTypeValue: e.data.name
          })
          if (this.order.colorPlateTypeValue !== '色布') {
            this.rules.clothValue = null
            this.$refs.form.$refs.form.clearValidate()
          } else {
            this.rules.clothValue = [
              { required: true, message: '请选择布类', trigger: ['change'] }
            ]
          }
          if (this.order.colorPlateTypeValue && this.order.colorPlateTypeValue !== '花灰纱') {
            this.isShow = true
            if (this.formData.length > 11) {
              this.formData.splice(11, 2)
            }
          } else {
            this.order.isComputerColorMatch = 0
            this.order.isComputerColorMatchValue = '否'
            this.formData = [...this.formData, ...added]
            this.formData = [...new Set(this.formData)]
            // console.log(this.formData, '花灰纱')
            this.order.colorManageDye && this.order.colorManageDye.forEach(item => {
              if (item.id) {
                this.order.delDyeArr.push(item.id)
              }
            })
            this.order.bdDyeTypeUuid = ''
            this.order.colorManageDye = []
            this.isShow = false
          }
        }
      },
      {
        name: 'colorPlateOrderCode',
        type: 'input',
        label: '色板单号',
        notEdit: false,
        maxlength: 20,
        showValue: 'colorPlateOrderCode',
        placeholder: '色板单号',
        changeHandler: (e) => {
          const val = e.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
          this.$refs['form'].resetData({
            colorPlateOrderCode: val
          })
          this.order.colorPlateOrderCode = val
        }
      },
      {
        name: 'customerColor',
        type: 'input',
        label: '客户颜色',
        notEdit: false,
        maxlength: 100,
        showValue: 'customerColor',
        placeholder: '客户颜色',
        changeHandler: (e) => {
          this.order.customerColor = e
        }
      },
      {
        name: 'clothValue',
        type: 'select-search',
        searchValue: 'name',
        valueKey: 'name',
        notEdit: false,
        label: '布类',
        placeholder: '请选择布类',
        apiUrl: 'basis/api/cloths/option',
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.clothValue = e.data.name
          this.order.bdClothUuid = e.data.uuid || ''
          this.$refs['form'].resetData({
            clothValue: e.data.name
          })
        }
      },
      {
        name: 'ingredientRatio',
        type: 'input',
        label: '成份比例',
        notEdit: false,
        showValue: 'ingredientRatio',
        placeholder: '成份比例',
        disabled: true
      },
      {
        name: 'requirement',
        prop: 'requirement',
        label: '工艺要求:',
        notEdit: false,
        placeholder: '请选择工艺要求',
        showValue: 'requirmentValue',
        components: { technological },
        componentsOptions: {
          checkValList: [],
          ok: (checkValList) => {
            this.$set(this.formData[5].componentsOptions, 'checkValList', checkValList)
            this.order.requirmentValue = checkValList.reduce((str, item) => {
              if (str) {
                // 普通已经拼好
                str += ',' + (item && (item.parent ? (item.parent.name + '-' + item.name) : item.name))
              } else {
                str = (item && (item.parent ? (item.parent.name + '-' + item.name) : item.name))
              }
              return str
            }, '')
            this.$refs['form'].resetData({ requirmentData: checkValList })
            this.$refs['form'].resetData({ requirmentValue: this.order.requirmentValue })
            this.order.requirement = checkValList
          },
          url: 'basis/api/requirement/option'
        }
      },
      {
        name: 'firstLightValue',
        type: 'select-search',
        notEdit: false,
        searchValue: 'name',
        valueKey: 'name',
        label: '1st对色光源',
        filterable: false,
        placeholder: '请选择1st对色光源',
        apiUrl: 'basis/api/lightSources/option',
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.firstLightValue = e.data.name
          this.order.bdFirstLightUuid = e.data.uuid || 0
          this.$refs['form'].resetData({
            firstLightValue: e.data.name
          })
        }
      },
      {
        name: 'secondLightValue',
        type: 'select-search',
        notEdit: false,
        searchValue: 'name',
        valueKey: 'name',
        label: '2nd对色光源',
        filterable: false,
        clearable: true,
        placeholder: '请选择2nd对色光源',
        apiUrl: 'basis/api/lightSources/option',
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.secondLightValue = e.data.name
          this.order.bdSecondLightUuid = e.data.uuid || ''
          this.$refs['form'].resetData({
            secondLightValue: e.data.name
          })
        }
      },
      {
        name: 'thirdLightValue',
        type: 'select-search',
        notEdit: false,
        searchValue: 'name',
        valueKey: 'name',
        label: '3rd对色光源',
        filterable: false,
        clearable: true,
        placeholder: '请选择3rd对色光源',
        apiUrl: 'basis/api/lightSources/option',
        optionsLabel: 'name',
        optionsValue: 'uuid',
        requestFormat: 'list',
        requestMode: 'post',
        changeSelectVal: (e) => {
          this.order.thirdLightValue = e.data.name
          this.order.bdThirdLightUuid = e.data.uuid || ''
          this.$refs['form'].resetData({
            thirdLightValue: e.data.name
          })
        }
      },
      {
        name: 'purpose',
        type: 'select',
        notEdit: false,
        label: '用途',
        clearable: true,
        showValue: 'purposeValue',
        placeholder: '请选择用途',
        options: [
          {
            id: 1,
            name: '衫身'
          },
          {
            id: 2,
            name: '下栏'
          }
        ],
        optionsValue: 'id',
        changeHandler: (e) => {
          this.order.purpose = e
          this.order.purposeValue = e ? (e === 1 ? '衫身' : '下栏') : ''
          this.$refs['form'].resetData({
            purpose: e
          })
        }
      },
      {
        name: 'isComputerColorMatch',
        type: 'select',
        notEdit: false,
        label: '是否电脑对色',
        clearable: true,
        showValue: 'isComputerColorMatchValue',
        placeholder: '请选择是否电脑对色',
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
        optionsValue: 'id',
        changeHandler: (e) => {
          this.order.isComputerColorMatch = e
          this.order.isComputerColorMatchValue = e ? '是' : '否'
          this.$refs['form'].resetData({
            isComputerColorMatch: e
          })
        }
      }
    ]
    // 色板类型为花灰纱所需
    const added = [
      {
        name: 'yarnSupplier',
        type: 'input',
        show: false,
        label: '纱供应商',
        notEdit: false,
        showValue: 'yarnSupplier',
        placeholder: '纱供应商',
        changeHandler: (e) => {
          this.order.yarnSupplier = e
        }
      },
      {
        name: 'factoryColor',
        type: 'input',
        label: '工厂色号',
        notEdit: false,
        maxlength: 20,
        showValue: 'factoryColor',
        placeholder: '工厂色号',
        changeHandler: (e) => {
          this.order.factoryColor = e
        }
      }
    ]
    const dataList = [
      {
        label: '删除',
        permitTag: ['userCenter:sysDataMaskingRule:delete'],
        isShow: true,
        style: { color: '#FE4949' },
        handle: params => {
          this.$confirm(' 你确认要删除该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async() => {
              if (this.yarnDataSource[0].dataSource[params.$index].id) {
                this.order.delYarnArr.push(this.yarnDataSource[0].dataSource[params.$index].id)
              }
              this.yarnDataSource[0].dataSource.splice(params.$index, 1)
            })
        }
      }
    ]
    // dataList = this.$filterPermission(dataList)
    // 表头操作栏的配置信息
    const operates = {
      label: '操作',
      width: '100',
      dataSource: dataList
    }
    const yarnDataSource = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        headerCellStyle: {
          background: '#F5F7FA!important'
        },
        size: 'mini',
        columns: columns,
        operates: operates
      }
    ]
    return {
      dataSource: [],
      yarnDataSource,
      operates,
      formOtions: {
        inline: true
      },
      isShow: false,
      formData,
      added,
      rules: {
        colorPlateTypeValue: [
          { required: true, message: '请选择色板类型', trigger: ['change'] }
        ],
        clothValue: [
          { required: true, message: '请选择布类', trigger: ['change'] }
        ],
        firstLightValue: [
          { required: true, message: '请选择1st对色光源', trigger: ['change'] }
        ],
        yarnSupplier: [
          { required: true, message: '纱供应商不能为空', trigger: ['change'] }
        ],
        factoryColor: [
          { required: true, message: '工厂色号不能为空', trigger: ['change'] }
        ]
      },
      isEdit: true,
      order: {}
    }
  },
  watch: {
    'yarnDataSource': {
      handler() {
        let str = ''
        if (this.yarnDataSource[0].dataSource.length) {
          const arr = this.yarnDataSource[0].dataSource.map(item => {
            if (item.ingredientType === 2) {
              return { id: item.ingredientUuid, ratio: item.yarnRatio || 0, name: item.ingredientValue }
            } else {
              return item.yarnElement.map(itemA => {
                return { id: itemA.ingredientUuid, ratio: (item.yarnRatio * 100 || 0) * (itemA.ingredientRatio * 100 || 0) / 1000000, name: itemA.name || itemA.ingredient && itemA.ingredient.name }
              })
            }
          })
          const a = arr && arr.flat().sort(function(a, b) {
            return b.ratio - a.ratio
          })
          const ars = (a && a.reduce((prev, item, index) => {
            const sameNameItem = prev.find(v => v.id === item.id)
            if (sameNameItem) {
              sameNameItem.ratio = (sameNameItem.ratio * 1000000 + item.ratio * 1000000) / 1000000
            } else {
              prev.push(item)
            }
            return prev
          }, []))
          str = ars.reduce((prev, item) => {
            if (prev) {
              prev += `/${item.name}:${Number(item.ratio).toFixed(2)}%`
            } else {
              prev = `${item.name}:${Number(item.ratio).toFixed(2)}%`
            }
            return prev
          }, '')
        }
        this.order.ingredientRatio = str
        this.$refs['form'] && this.$refs['form'].resetData({
          ingredientRatio: str
        })
      },
      deep: true
    }
  },
  mounted() {
    if (this.order.colorPlateTypeValue !== '色布') {
      this.rules.clothValue = null
      this.$refs.form.$refs.form.clearValidate()
    } else {
      this.rules.clothValue = [
        { required: true, message: '请选择布类', trigger: ['change'] }
      ]
    }
  },
  async created() {
    this.initOrder()
    if (this.$route.params.id && this.$route.path.includes('show')) {
      this.isEdit = false
      this.yarnDataSource[0].operates = null
    }
    if (this.$route.params.id) {
      await this.getOrder(this.$route.params.id)
      if (this.$route.path.includes('edit')) {
        this.setEdit()
      }
    }
    if (this.$route.path.includes('copy')) {
      this.setEdit()
    }
  },
  methods: {
    // 初始化
    initOrder() {
      this.order = {
        id: '',
        code: '',
        colorPlateTypeUuid: 0, // 色板类型
        colorPlateTypeValue: '',
        bdClothUuid: '', // 布类
        clothValue: '',
        canEdit: true,
        dataSource: 1, // 1本系统生成 2 推来的数据
        requirement: [], // 工艺要求
        requirmentValue: '',
        purpose: '', // 用途
        colorPlateOrderCode: '', // 色板单号
        customerColor: '', // 客户颜色
        isComputerColorMatch: 1, // 是否电脑对色
        isComputerColorMatchValue: '是', // 是否电脑对色
        purposeValue: '', // 用途
        bdFirstLightUuid: 0, // 1st对色光源
        firstLightValue: '', // 1st对色光源
        bdSecondLightUuid: '', // 2nd对色光源
        secondLightValue: '', // 2nd对色光源
        bdThirdLightUuid: '', // 3rd对色光源
        thirdLightValue: '', // 3rd对色光源
        ingredientRatio: '', // 成分比例
        bdDyeTypeUuid: '', // 染色类型
        factoryColor: '', // 工厂色号
        yarnSupplier: '', // 纱供应商
        colorManageYarn: [], // 比例表
        colorManageDye: [], // 色系表
        delYarnArr: [],
        delDyeArr: []
      }
    },
    getStatus() {
      if (this.order.enabled === 'N') {
        return '已禁用'
      }
      let str = ''
      switch (this.order.status) {
        case 1:
          str = '待对色'
          break
        case 2:
          str = '待录入配方'
          break
        case 3:
          str = '待审核'
          break
        case 4:
          str = '已审核'
          break
        case 5:
          str = '待提交'
          break
        default:
          break
      }
      return str
    },
    // 删除
    destroy() {
      this.$confirm(' 你确认要删除该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await destroy({ id: this.order.id })
          if (res.code !== 200) {
            return
          }
          this.fetchLog(
            this.getLogMessages('DEL', '/color/api/color/colorManage/destroy', 'color'),
            { code: this.order.code },
            JSON.stringify({
              beforeText: `在'色号花号库-色号管理'删除一条记录`,
              beforeCode: { code: this.order.code }
            })
          )
          this.$router.push(`/color-library/color-management/list`)
        })
    },
    // 审核
    approve() {
      this.$confirm(' 你确认要审核该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await approve({ id: this.order.id })
          if (res.code === 200) {
            this.getOrder(this.order.id)
            this.$message({
              message: '审核成功',
              type: 'success'
            })
            this.fetchLog(
              this.getLogMessages('UPDATE', '/color/api/color/colorManage/approve', 'color'),
              { code: this.order.code },
              JSON.stringify({
                beforeText: `在'色号花号库-色号管理'审核一条记录`,
                beforeCode: { code: this.order.code }
              })
            )
          } else {
            this.$message({
              message: '审核失败',
              type: 'error'
            })
          }
        })
    },
    // 复制
    copyOrder() {
      this.order.oldId = this.order.id
      this.order.code = ''
      this.order.id = 0
      this.order.dataSource = 1
      this.order.canEdit = true
      this.order.colorManageDye.forEach(item => {
        delete item.id
      })
      this.order.colorManageYarn.forEach(item => {
        delete item.id
        item.yarnElement.forEach(i => {
          delete i.id
        })
      })
      this.setEdit()
    },
    // 编辑
    setEdit() {
      if (!this.order.canEdit) {
        this.$message({
          type: 'warning',
          message: '对应色板申请单已完结或对应色板生产进度已产生客批结果，不能编辑！'
        })
        this.isEdit = false
        if (this.order.colorManageYarn) {
          this.yarnDataSource[0].dataSource = this.order.colorManageYarn.map((item) => {
            item.edit = false
            return item
          })
        }
        this.yarnDataSource[0].operates = null
        this.formData.forEach((item, index) => {
          item.notEdit = true
        })
        return
      }
      this.isEdit = true
      // console.log(this.order, '------------------1111111')
      if (this.order.dataSource === 1) {
        if (this.order.colorManageYarn) {
          this.yarnDataSource[0].dataSource = this.order.colorManageYarn.map((item) => {
            item.edit = this.isEdit
            return item
          })
        }
        this.yarnDataSource[0].operates = this.operates
        this.formData.forEach((item, index) => {
          item.notEdit = false
        })
      }
      if (this.order.dataSource === 2) {
        if (this.order.colorManageYarn) {
          this.yarnDataSource[0].dataSource = this.order.colorManageYarn.map((item) => {
            item.edit = false
            return item
          })
        }
        this.yarnDataSource[0].operates = null
        this.formData.forEach((item, index) => {
          if ([9, 10].includes(index)) {
            return true
          }
          item.notEdit = true
          // if (index < this.formData.length - 2) {
          //   item.notEdit = true
          // }
        })
      }
    },
    // 详情
    async getOrder(id) {
      const res = await show({ id })
      this.order = Object.assign({}, res.data)
      this.setOrder(this.order)
    },
    setOrder(order) {
      this.order.delYarnArr = []
      this.order.delDyeArr = []
      this.order.colorPlateTypeValue = (order.colorPlateType && order.colorPlateType.name) || ''
      if (this.order.colorPlateTypeValue && this.order.colorPlateTypeValue !== '花灰纱') {
        this.isShow = true
      } else {
        this.isShow = false
        this.formData = [...this.formData, ...this.added]
        this.formData = [...new Set(this.formData)]
      }
      this.order.clothValue = (order.cloth && order.cloth.name) || ''
      for (const key in order.requirement) {
        order.requirement[key].forEach(item => {
          item.parentUuid = item.parent && item.parent.uuid || 0
          switch (key) {
            case 'normal':
              item.type = 1
              break
            case 'styleFeel':
              item.type = 2
              break
            case 'function':
              item.type = 3
              break
            case 'print':
              item.type = 4
              break
            default:
              break
          }
        })
      }
      const requirement = [...order.requirement.function, ...order.requirement.normal, ...order.requirement.print, ...order.requirement.styleFeel]
      this.$set(this.formData[5].componentsOptions, 'checkValList', requirement)
      this.order.requirmentValue = requirement.reduce((str, item) => {
        if (str) {
          // 普通已经拼好
          str += ',' + (item && (item.parent ? (item.parent.name + '-' + item.name) : item.name))
        } else {
          str = (item && (item.parent ? (item.parent.name + '-' + item.name) : item.name))
        }
        return str
      }, '') || ''
      this.order.requirement = requirement || []
      this.order.purpose = order.purpose || ''
      this.order.purposeValue = order.purpose ? (order.purpose === 1 ? '衫身' : '下栏') : ''
      this.order.isComputerColorMatchValue = order.isComputerColorMatch ? '是' : '否'
      this.order.firstLightValue = (order.firstLight && order.firstLight.name) || ''
      this.order.secondLightValue = (order.secondLight && order.secondLight.name) || ''
      this.order.thirdLightValue = (order.thirdLight && order.thirdLight.name) || ''
      this.order.bdDyeTypeUuid = order.bdDyeTypeUuid || ''
      if (order.colorManageYarn) {
        this.yarnDataSource[0].dataSource = order.colorManageYarn.map((item) => {
          item.edit = this.isEdit
          item.ingredientValue = item.element && item.element.name
          item.yarnTypeValue = item.yarnType && item.yarnType.name
          return item
        })
      } else {
        this.yarnDataSource[0].dataSource = []
      }
      if (this.$route.path.includes('copy')) {
        this.order.oldId = order.id
        this.order.code = ''
        this.order.id = 0
        this.order.colorManageDye.forEach(item => {
          delete item.id
        })
        this.order.colorManageYarn.forEach(item => {
          delete item.id
          item.yarnElement.forEach(i => {
            delete i.id
          })
        })
      }
    },
    // 染色类型
    listFormChange(form) {
      if (this.order.bdDyeTypeUuid !== form.bdDyeTypeUuid) {
        this.order.colorManageDye.forEach(item => {
          if (item.id) {
            this.order.delDyeArr.push(item.id)
          }
        })
      }
      this.order.bdDyeTypeUuid = form.bdDyeTypeUuid
      this.order.colorManageDye = form.list
    },
    // 新增
    addHandler() {
      this.yarnDataSource[0].dataSource.push({
        yarnElement: [],
        ingredientType: '',
        edit: true,
        yarnRatio: ''
      })
    },
    // 数据源
    async setSelectData(typeName, index, init = false) {
      let res = null
      switch (typeName) {
        case '纱支':
          res = await yarnCounList()
          break
        case '成份':
          res = await ingredientsList()
          break
        case '布类':
          res = await clothList()
          break
      }
      let data = []

      if (res.data && res.data.list.length) {
        if (typeName !== '成份') {
          data = res.data.list.map((item) => {
            item.label = item.name
            item.value = item.uuid
            return item
          })
        } else {
          data = res.data.list.map((item) => {
            item.label = item.name
            item.value = item.ingredientType + '-' + item.uuid
            return item
          })
        }
      }
      this.colorYarnColorList = data
      this.$set(
        this.yarnDataSource[0].columns[index].editOptions,
        'dataSource',
        data
      )
      this.$set(
        this.yarnDataSource[0].columns[index].editOptions,
        'loading',
        false
      )
    },
    // 提交
    submitForm() {
      let pass = false
      this.$refs.listForm && this.$refs.listForm.$refs.form.validate(async(valid) => {
        if (valid) {
          pass = true
        } else {
          pass = false
        }
      })
      pass = this.$refs.listForm ? pass : true
      this.$refs.dataTable.$refs.dynamicValidateForm.validate(async(valid) => {
        if (valid && pass) {
          pass = true
        } else {
          pass = false
        }
      })
      this.$refs.form.$refs.form.validate(async(valid) => {
        if (valid && pass) {
          if (!this.yarnDataSource[0].dataSource.length) {
            this.$message({
              type: 'warning',
              message: '请添加用纱信息'
            })
            return
          }
          this.order.colorManageYarn = this.yarnDataSource[0].dataSource
          if (
            this.order.colorManageYarn.reduce((sum, cru) => {
              return sum + (cru.yarnRatio - 0)
            }, 0) -
            100 !==
            0
          ) {
            this.$message({
              message: '用纱信息纱比总值必须等于100!请重新输入',
              type: 'warning'
            })
            return
          }
          // 编辑
          if (this.order.id) {
            this.$confirm(' 请确认提交该数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async() => {
              const res = await update(this.order)
              if (res.code !== 200) {
                return
              }
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              this.yarnDataSource[0].dataSource.forEach(item => {
                item.edit = false
              })
              this.isEdit = false
              this.yarnDataSource[0].operates = null
              this.$nextTick(function() {
                if (this.$route.path.includes('show')) {
                  this.getOrder(this.order.id)
                } else {
                  this.$store.dispatch('tagsView/delView', this.$route)
                  this.$router.push(`/color-library/color-management/color-code/${this.order.id}/show`)
                }
              })
              this.fetchLog(
                this.getLogMessages('UPDATE', '/color/api/color/colorManage/update', 'color'),
                { code: this.order.code },
                JSON.stringify({
                  beforeText: `在'色号花号库-色号管理-色号详情'编辑一条记录`,
                  beforeCode: { code: this.order.code }
                })
              )
            })
            return
          }
          // 新增
          this.$confirm(' 请确认提交该数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            // console.log(this.order, '表单数据')
            const res = await store(this.order)
            if (res.code !== 200) {
              return
            }
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push(`/color-library/color-management/color-code/${res.data.id}/show`)
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            this.fetchLog(
              this.getLogMessages('INSERT', '/color/api/color/colorManage/store', 'color'),
              { code: res.data.code },
              JSON.stringify({
                beforeText: `在'色号花号库-色号管理'新增一条记录`,
                beforeCode: { code: res.data.code || '' }
              })
            )
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.$confirm(' 你确认要取消吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          if (!this.order.id) {
            this.$router.push(`/color-library/color-management/list`)
            return
          }
          this.$refs.form.$refs.form.clearValidate()
          this.$refs.listForm && this.$refs.listForm.$refs.form.clearValidate()
          this.isEdit = false
          this.yarnDataSource[0].operates = null
          this.getOrder(this.order.id)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.color-list {
  padding: 20px;
}
.btn {
  margin-bottom: 16px;
}
.product-btn-group {
  bottom: 0;
  z-index: 2000;
  padding: 10px;
  width: 100%;
  background: #fff;
  border-top: 1px solid #ecf0f3;
  position: fixed;
  .btn-groups {
    position: relative;
    left: 40%;
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
.yarn-table {
  padding: 10px 20px 20px;
  .isEdit /deep/ .el-table__row .cell {
    margin-bottom: 20px;
  }
  .isEdit /deep/ .el-table__row .product-no-request {
    .cell {
      margin-bottom: 0px;
    }
    .el-form-item__content {
      margin-bottom: 20px;
    }
  }
}
/deep/.table tr:nth-child(even) {
  background-color: #ffffff;
}
</style>
