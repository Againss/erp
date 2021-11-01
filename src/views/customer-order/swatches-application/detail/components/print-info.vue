<!--
 * @Author: ll
 * @Date: 2021-01-12 11:09:38
 * @LastEditTime: 2021-07-27 17:21:05
 * @LastEditors: OBKoro1
 * @Description: 色板申请列表
-->
<template>
  <div
    class="table-item basic-data"
    :class="isEdits ? 'product-box' : 'product'"
  >
    <div class="header-top basic-top">
      <span>基本信息</span>
    </div>
    <cs-custom-form
      ref="basicData"
      :class="getEditClass"
      :data-source="basicData"
      :options="formOptions"
      :form-datas="formDatas"
    />
  </div>
</template>
<script>
import uploadFile from '../components/upload-file'
import uploadSlotTrigger from '../components/upload-slot-trigger'
import techRquire from '../../../public/components/tech-require'
import { PublicCustomer } from '@/views/customer-order/public/index'
import { firstLightSelect, yearSelet, colorType, saleDepartmentPost, salerListPost } from '../api/index.js'
export default {
  name: 'PrintInfos',
  mixins: [PublicCustomer],
  props: {
    isEdits: {
      type: Boolean
    },
    detailData: {
      type: Object
    },
    setedittypes: {
      type: String
    }
  },
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 工艺要求数组长度校验
    const checkLeng = (rule, value, callback) => {
      if (!value || !value.length) {
        return callback(new Error('工艺要求不能为空'))
      } else {
        callback()
      }
    }
    const checkProductWeight = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,1}$/
      if (!value) {
        // return callback(new Error('成品克重不能为空'))
      } else if (value && (!reg.test(value))) {
        return callback(new Error('数字类型，输入时最大允许录入一位小数'))
      } else if (parseFloat(value) >= 1000 || parseFloat(value) <= 0) {
        return callback(new Error('请输入0~1000之间的数字'))
      } else {
        callback()
      }
    }

    // 基础信息数据
    const baseData = [
      {
        prop: 'id',
        itemType: 'input',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '色板单号:',
        placeholder: '自动生成',
        readonly: true,
        disabled: true,
        title: true,
        dataSource: []
      },
      {
        prop: 'seller',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        showOverflowTooltip: true,
        label: '销售员:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        filterable: true,
        change: (value) => {
          this.setsellerTeamArray(value)
        },
        rules: [{ required: true, message: '销售员不能为空', trigger: 'change' }],
        visibleChange: (value, val) => {
          if (value) {
            this.salerListPut()
          }
        },
        dataSource: []
      },
      {
        prop: 'sellerTeam',
        itemType: 'select',
        className: 'inputWidth',
        showOverflowTooltip: true,
        itemStyle: { 'width': '25%' },
        label: '销售团队:',
        valueType: 'object',
        clearable: true,
        filterable: true,
        disabled: true,
        rules: [{ required: true, message: '销售团队不能为空', trigger: 'change' }],
        change: (value) => {
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getOrg()
          }
        },
        dataSource: []
      },
      {
        prop: 'customer',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '客户:',
        valueType: 'object',
        showOverflowTooltip: true,
        clearable: true,
        disabled: true,
        filterable: true,
        rules: [{ required: true, message: '客户不能为空', trigger: 'change' }],
        change: (value) => {
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getCustomers() // 客户下拉
          }
        },
        dataSource: []
      },
      {
        prop: 'delivery',
        itemType: 'date',
        type: 'datetime',
        className: 'inputWidth',
        style: { 'width': '60%' },
        itemStyle: { 'width': '25%' },
        label: '交期:',
        format: 'yyyy-MM-dd',
        placeholder: '请选择日期时间',
        rules: [{ required: true, message: '交期不能为空', trigger: 'change' }],
        clearable: true,
        disabled: true,
        title: true,
        valueFormat: 'yyyy-MM-dd'
      },
      {
        prop: 'colorModelType',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '色板类型:',
        showOverflowTooltip: true,
        filterable: true,
        valueType: 'object',
        rules: [{ required: true, message: '色板类型不能为空', trigger: 'change' }],
        clearable: true,
        disabled: true,
        visibleChange: (value, val) => {
          if (value) {
            this.colorClickType()
          }
        },
        dataSource: []
      },

      {
        prop: 'cloth',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '布类:',
        valueType: 'object',
        showOverflowTooltip: true,
        filterable: true,
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '布类不能为空', trigger: 'change' }],
        change: (value) => {

        },
        visibleChange: (value, val) => {
          if (value) {
            this.getCloths()
          }
        },
        dataSource: []
      },
      {
        prop: 'endProductWeight',
        itemType: 'input',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '成品克重:',
        showOverflowTooltip: true,
        placeholder: '',
        clearable: true,
        disabled: true,
        title: true,
        dataSource: [],
        rules: [{ validator: checkProductWeight, trigger: 'blur' }]
      },
      {
        prop: 'garmentPart',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '成衣部位:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        dataSource: [
          { label: '衫身', value: '衫身' },
          { label: '下栏', value: '下栏' }
        ]
      },
      {
        prop: 'lstLightSource',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: 'lst对色光源:',
        filterable: true,
        valueType: 'object',
        clearable: true,
        rules: [{ required: true, message: 'lst对色光源不能为空', trigger: 'change' }],
        disabled: true,
        visibleChange: (value, val) => {
          if (value) {
            this.getFirstLight()
          }
        },
        dataSource: []
      },
      {
        prop: 'twondLightSource',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '2nd对色光源:',
        valueType: 'object',
        filterable: true,
        clearable: true,
        disabled: true,
        visibleChange: (value, val) => {
          if (value) {
            this.getFirstLight()
          }
        },
        dataSource: []
      },
      {
        prop: 'threerdLightSource',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '3nd对色光源:',
        filterable: true,
        valueType: 'object',
        clearable: true,
        disabled: true,
        visibleChange: (value, val) => {
          if (value) {
            this.getFirstLight()
          }
        },
        dataSource: []
      },
      {
        prop: 'sellYear',
        className: 'inputWidth',
        itemType: 'select',
        itemStyle: { 'width': '25%' },
        label: '销售年度:',
        disabled: true,
        clearable: true,
        visibleChange: (value) => {
          if (value) {
            this.yeardown()
          }
        },
        dataSource: []
      },
      {
        prop: 'sellQuarterly',
        className: 'inputWidth',
        itemType: 'select',
        itemStyle: { 'width': '25%' },
        label: '销售季度:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: 'Spr',
            value: 'Spr'
          },
          {
            label: 'Sum',
            value: 'Sum'
          },
          {
            label: ' Fall',
            value: 'Fall'
          },
          {
            label: 'Winter',
            value: 'Winter'
          }
        ]
      },
      {
        prop: 'craftRequirementList',
        label: '工艺要求',
        rules: [commonChangeReg, { validator: checkLeng, trigger: 'blur' }],
        className: 'inputWidth',
        itemType: 'input',
        itemStyle: { 'width': '25%' },
        style: { 'width': '60%' },
        disabled: true,
        title: true,
        components: { techRquire },
        componentsOptions: {
          checkValList: [],
          ok: (checkValList) => {
            this.$set(this.basicData[14].componentsOptions, 'checkValList', checkValList)
            this.formDatas = { craftRequirementList: checkValList }
          }
        }
      },
      {
        prop: 'bindBillNo',
        itemType: 'input',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '关联单号:',
        placeholder: '',
        showMessage: false,
        disabled: true,
        title: true,
        dataSource: []
      }
    ]

    // 表头编辑数据
    const baseEdit = [
      {
        prop: 'attachmentList',
        itemType: 'upload',
        drag: true,
        disabled: true,
        itemStyle: { 'width': '48%' },
        className: 'uploadfile',
        label: '上传附件:',
        action: '/customerOrder/upload/type/4', // 最新的链接
        limit: 5,
        beforeRemove: (file, fileList) => {
          const editformObj = this.$refs.basicData.dynamicValidateFormRuleForm || {}
          this.formDatas = editformObj
          this.formDatas.attachmentList && this.formDatas.attachmentList.forEach((item, indexs) => {
            if (item.uid === file.uid) {
              this.formDatas.attachmentList.splice(indexs, 1)
            }
          })
        },
        onPreview: (file) => {},
        beforeUpload: (file) => {
          const isLt1M = file.size / 1024 / 1024 <= 50
          if (!isLt1M) {
            this.$message.error('上传文件大小不能超过 50MB!')
          }
          return isLt1M
        },
        onExceed: (files) => {
          this.$message.error('上传文件个数不能超过5个!')
        },
        accept: '',
        content: [
          {
            slot: 'trigger',
            component: uploadSlotTrigger
          }
        ]
      },
      {
        prop: 'precautions',
        itemType: 'input',
        type: 'textarea',
        disabled: true,
        maxlength: 500,
        className: 'precautionscolor',
        itemStyle: { 'width': '44%', 'margin-left': '34px;' },
        label: '注意事项:',
        trim: (value) => {
          return value
        },
        dataSource: []
      }
    ]
    // 表头查看数据
    const baseLookOver = [
      {
        prop: 'attachmentList',
        itemType: 'input',
        itemStyle: { 'width': '48%' },
        label: '附件上传',
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'attachmentList',
          url: 'attachmentList'
        }
      },
      {
        prop: 'precautions',
        itemType: 'input',
        type: 'textarea',
        disabled: true,
        maxlength: 500,
        readonly: true,
        className: 'textareacolor',
        itemStyle: { 'width': '44%', 'color': '#000;', 'margin-left': '34px;' },
        label: '注意事项:',
        dataSource: []
      }
    ]
    return {
      baseData,
      basicData: [], // 基本信息 数据源
      formOptions: { size: 'small', inline: true },
      formDatas: {},
      lstLightSource: [], // lst对色光源
      twondLightSource: [], // 2nd对色光源
      threerdLightSource: [], // 3rn对色光源
      clothData: [], // 布类下拉
      colorPlateType: [], // 色板类型
      baseEdit,
      baseLookOver,
      customerData: [], // 客户下拉
      accept: '.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG,.bmp'
    }
  },
  computed: {
    getEditClass() {
      if (this.isEdits) {
        return 'editClass'
      } else {
        return 'detailClass'
      }
    }
  },
  watch: {
    detailData: {
      handler(v, o) {
        if (v && Object.keys(v).length) {
          this.setformIndex(v)
        }
      },
      deep: true,
      immediate: true
    },
    setedittypes: {
      handler(v, o) {
        if (v) {
          this.setClickType(v)
        }
      },
      deep: true,
      immediate: true
    },
    isEdits: {
      handler(v, o) {
        if (v && this.formDatas.endProductWeight) {
          this.formDatas.endProductWeight = this.formDatas.endProductWeight.includes('g/㎡') && this.formDatas.endProductWeight.replace(/ g\/㎡/g, '')
        }
        if (!v) {
          this.setClickType('cancel')
        } else {
          this.setClickType('edit')
        }
      },
      deep: true,
      immediate: true
    }

  },
  created() {
    // 初始化数据
    this.init()
    this.getOrg() // 销售团队下拉
    this.salerListPut() // 销售员下拉
    this.getCustomers() // 客户下拉
    this.getFirstLight() // lst对色光源下拉
    this.yeardown() // 销售年度:
    this.getCloths() // 布类下拉:
    this.colorClickType() // 色板类型
    this.editClick() // 送客批色板要求的各种状态编辑
  },
  methods: {
    //
    setformIndex(data) {
      this.formDatas = {
        id: data.id, // 色板单号
        seller: data.seller, // 销售员
        sellerTeam: data.sellerTeam, // 销售团队
        customer: data.customer, // 客户
        delivery: data.delivery ? this.$filters.parseTime(data.delivery) : '', // 交  期
        cloth: data.cloth, // 布类
        colorModelType: data.colorModelType, // 色板类型
        endProductWeight: data.endProductWeight ? (data.endProductWeight.includes('g/㎡') ? data.endProductWeight : data.endProductWeight + ' g/㎡') : '', // 成品克重
        garmentPart: data.garmentPart, // 成衣部位
        lstLightSource: data.lstLightSource, // lst对色光源
        twondLightSource: data.twondLightSource, // 2nd对色光源
        threerdLightSource: data.threerdLightSource, // 3rn对色光源
        sellYear: data.sellYear, // 销售年度
        sellQuarterly: data.sellQuarterly, // 销售季度
        craftRequirementList: data.craftRequirementList, // 工艺要求
        bindBillNo: data.bindBillNo, // 关联单号
        checkRequirementList: data.checkRequirementList, // 送客批色板要求
        attachmentList: data.attachmentList, // 上传附件
        precautions: data.precautions,
        typeEn: this.isEdits
      }
      // 客户的特殊处理
      const customerId = this.formDatas.customer.value || 0
      if (this.basicData[3] && this.customerData) {
        const customerFlag = customerId && this.customerData.some((item, ik) => {
          return item.value === customerId
        })
        if (!customerFlag && customerId) {
          this.customerData.push(this.formDatas.customer)
          this.$set(this.basicData[3], 'dataSource', this.customerData)
        }
      }
      if (this.basicData && this.basicData[14]) {
        this.$set(this.basicData[14].componentsOptions, 'checkValList', this.formDatas.craftRequirementList)
      }
    },
    // 销售团队下拉
    async getOrg() {
      const res = await saleDepartmentPost({})
      if (res.code !== 200) {
        return false
      }
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.orgId, label: item.name }))
        }
      }
      this.$set(this.basicData[2], 'dataSource', formaterList)
    },
    // 销售员
    async salerListPut() {
      const res = await salerListPost({})
      if (res.code !== 200) {
        return false
      }
      let formaterList = []
      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formaterList = list.map(item => ({ value: item.id, label: item.realName }))
        }
      }
      this.$set(this.basicData[1], 'dataSource', formaterList)
    },
    // 客户下拉
    async getCustomers() {
      this.getCustomer().then(res => {
        this.customerData = res
        this.$set(this.basicData[3], 'dataSource', res)
      })
    },
    // 色板类型下拉
    async colorClickType() {
      const res = await colorType({ 'enabled': 'Y' })
      if (res.code !== 200) {
        return false
      }
      this.colorPlateType = res.data || []
      this.colorPlateType.forEach((item, index) => {
        item.label = item.name
        item.value = item.uuid
      })
      this.$set(this.basicData[5], 'dataSource', this.colorPlateType)
    },
    // 布类下拉
    async getCloths() {
      this.getCloth({ enabled: 'Y' }).then(res => {
        this.$set(this.basicData[6], 'dataSource', res)
      })
    },
    // lst对色光源下拉
    async getFirstLight() {
      const res = await firstLightSelect({ enabled: 'Y' })
      if (res.code !== 200) {
        return false
      }
      this.firstLightData = res.data || []
      this.firstLightData.forEach((item, index) => {
        item.label = item.name
        item.value = item.uuid
      })
      this.$set(this.basicData[9], 'dataSource', this.firstLightData)
      this.$set(this.basicData[10], 'dataSource', this.firstLightData)
      this.$set(this.basicData[11], 'dataSource', this.firstLightData)
    },
    // 销售员改变销售团队
    setsellerTeamArray(data) {
      console.log('销售员改变销售团队')
    },
    // 销售年度下拉
    async yeardown() {
      const res = await yearSelet({})
      if (res.code !== 200) {
        return false
      }
      this.yearData = res.data || []
      this.$set(this.basicData[12], 'dataSource', this.yearData)
    },
    // 获取编辑事件
    setClickType(v) {
      if (v === 'edit') {
        this.isEdits = true
        this.basicData = [...this.baseData, ...this.baseEdit]
        this.basicData.forEach(item => { item.disabled = false })
        this.basicData[0].disabled = true
      } else if (v === 'cancel') {
        this.basicData = [...this.baseData, ...this.baseLookOver]
        this.basicData.forEach((item) => { item.disabled = true })
      }
    },
    // 送客批色板要求的各种状态编辑
    editClick() {
      if (this.$route.params.id) {
        if (this.$route.path.includes('show')) { // 查看
          this.basicData = [...this.baseData, ...this.baseLookOver]
          this.basicData.forEach(item => { item.disabled = true })
        } else { // 编辑
          this.isEdits = true
          this.basicData = [...this.baseData, ...this.baseEdit]
          this.basicData.forEach(item => { item.disabled = false })
          this.basicData[0].disabled = true
        }
      } else { // 新建
        this.basicData = [...this.baseData, ...this.baseEdit]
        this.basicData.forEach(item => { item.disabled = false })
        this.basicData[0].disabled = true
        this.formDatas.delivery = this.filterDate()
      }
    },
    setProDatBilIselect(object, num, type) { // 回显数据
      if (type === 'object') {
        this.$set(this.basicData[num], 'dataSource', object ? [object] : [])
      } else if (type === 'Array') {
        this.$set(this.basicData[num], 'dataSource', object || [])
      }
      // else if (type === 'string') {
      //   this.$set(this.basicData[num], 'dataSource', object || '')
      // }
    },
    /* 获取当前日期 */
    filterDate() {
      const date = new Date()
      return (date.getFullYear() + '-' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`) + '-' + (date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`))
    },
    // 初始化数据
    init() {
      this.formDatas = {
        id: '', // 色板单号
        seller: '', // 销售员
        sellerTeam: '', // 销售团队
        customer: '', // 客户
        delivery: '', // 交  期
        cloth: '', // 布类
        colorModelType: '', // 色板类型
        endProductWeight: '', // 成品克重
        garmentPart: '', // 成衣部位
        lstLightSource: '', // lst对色光源
        twondLightSource: '', // 2nd对色光源
        threerdLightSource: '', // 3rn对色光源
        sellYear: '', // 销售年度
        sellQuarterly: '', // 销售季度
        craftRequirementList: '', // 工艺要求
        bindBillNo: '', // 关联单号
        cmColorInfo: [], //	颜色信息 ,CmColorInfoAddRequest
        cmYarnUsed: [], // 用纱信息
        typeEn: this.isEdits// 是否可以
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-form {
  margin: 0 20px;
}
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
      font-weight: 500;
    }
    .el-button {
      display: flex;
      span {
        font-size: 14px;
      }
    }
  }
  .basic-top {
    border-bottom: 1px solid #eeeff0;
    margin-bottom: 20px;
  }
}
.basic-data {
  padding-bottom: 20px;
  .el-input.is-disabled .el-input__suffix {
    display: none;
  }
}
//默认表格宽度间距
.el-input.is-disabled .el-input__inner {
  color: #666666;
}
/deep/ .el-form--inline .el-form-item {
  margin-right: 0;
}

// 文字显示
/deep/ .detailClass .el-input__inner {
  padding: 0;
  border: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #fff;
  font-size: 14px;
  color: #606266;
}
/deep/ .detailClass .el-form-item {
  margin-bottom: 14px;
}
/deep/ .detailClass .el-input__icon {
  display: none;
}
.basic-data .el-input.is-disabled .el-input__suffix {
  display: none;
}

//附件信息样式
/deep/ .requestinput .el-input__inner {
  height: 120px;
  margin-top: 16px;
}
/deep/ .uploadfile .el-upload-dragger {
  width: 100%;
  height: 139px;
}
/deep/ .uploadfile .el-icon-upload {
  font-size: 36px;
  margin: 10px 0 0 0;
}
/deep/ .uploadfile .el-upload {
  width: 100% !important;
}

// 表格宽度 top input
/deep/ .inputWidth {
  width: 60% !important;
}
//清除表格的小红点
.product {
  /deep/.is-required .el-form-item__label::before {
    content: '' !important;
  }
  /deep/.techRequire::before {
    content: '' !important;
  }
}
// 注意事项:
/deep/ .textareacolor {
  textarea {
    color: #000 !important;
  }
}
/deep/ .precautionscolor {
  textarea {
    color: #000 !important;
    min-height: 139px !important;
  }
}

/deep/ .el-upload-list__item-name {
  max-width: 500px !important;
}

@media screen and (max-width: 1440px) {
  /deep/.custom-form {
    .el-form {
      .inputWidth {
        width: 90% !important;
      }
      .el-form-item:nth-child(5) {
        //交期:
        .el-form-item__content .el-date-editor {
          width: 90% !important;
        }
      }
      .el-form-item:nth-child(15) {
        //工艺要求:
        .el-form-item__content span .el-input {
          width: 90% !important;
        }
      }
    }
  }
}
</style>
