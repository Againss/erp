/**
 * @Description: 附加信息页签数据
 * @author Roman
 * @date 2021-05-06 15:19:12
 * @edit 2021-05-06 15:19:12
*/
<template>
  <div class="qualityrequ">
    <!-- 成衣信息 -->
    <div class="table-item basic-data">
      <div class="header-top basic-top">
        <span>成衣信息</span>
      </div>
      <cs-custom-form
        ref="readyToWear"
        :class="getEditClass"
        :data-source="readyToWear"
        :options="formOptions"
        :form-datas="formDatasready"
      />
    </div>
    <!--附件1 formFileData-->
    <div
      v-if="isEdit && orderData.baseInfo && !orderData.baseInfo.demandSource && !orderData.baseInfo.demandCode"
      class="table-item basic-data"
    >
      <div class="header-top basic-top">
        <span>附件<span class="attachmentTips">(只能上传JPG/JPEG/PNG/BMP/PDF/EXCEL/WORD文件，且单个文件不超过10Mb)</span></span>
      </div>
      <cs-custom-form
        ref="enclosure"
        :class="getEditClass"
        :data-source="enclosure"
        :options="formOptions"
        :form-datas="formDatasenclosure"
      />
    </div>
    <!--附件2-->

    <div
      v-if="
        !isEdit || (isEdit && orderData.baseInfo && orderData.baseInfo.demandSource && orderData.baseInfo.demandCode)
      "
      class="table-item basic-data"
    >
      <div class="header-top basic-top">
        <span>附件</span>
      </div>
      <cs-custom-form
        ref="enclosure"
        :class="getEditClass"
        :data-source="enclosure2"
        :options="formOptions"
        :form-datas="formDatasenclosure"
      />
    </div>

    <!--注意事项-->
    <div class="table-item basic-data table-padding">
      <div class="header-top basic-top">
        <span>注意事项</span>
      </div>
      <div class="table-textarea">
        <el-input
          v-model="textTim"
          type="textarea"
          placeholder="请输入内容"
          :title="textTim"
          :disabled="!isEdit"
          maxlength="500"
          trueshow-word-limit
        />
      </div>
    </div>
  </div>
</template>
<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
import uploadFile from './upload-file'
import uploadSlotTrigger from './upload-slot-trigger'
export default {
  name: 'Additional',
  components: {},
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    getClothingForm: {
      type: Function
    },
    orderData: {
      type: Object,
      default: () => ({ baseInfo: {}})
    },
    syncDataHandle: {
      type: Function
    }
  },
  data() {
    const readyToWear = {
      _clothingType: {
        prop: 'clothingType',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '成衣类型:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '备坯单', fieldName: '成衣类型' }, 'clothingType')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}'>${value.label}</div>` : ''
        }
      },
      _clothingStyle: {
        prop: 'clothingStyle',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '成衣款式:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '备坯单', fieldName: '成衣款式' }, 'clothingStyle')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}'>${value.label}</div>` : ''
        }
      },
      _isClothingWashWater: {
        prop: 'isClothingWashWater',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '是否成衣洗水:',
        clearable: true,
        disabled: true,
        change: (value) => { },
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '2'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const obj = { '1': '是', '2': '否' }
          return value ? `<div title='${obj[value]}'>${obj[value]}</div>` : ''
        }
      },
      _clothingExport: {
        prop: 'clothingExport',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '成衣出口:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.CountryPortSelect({ 'enabled': 'Y' })
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}'>${value.label}</div>` : ''
        }
      }
    }
    const enclosure = {
      _customerOrderFile: {
        prop: 'customerOrderFile',
        itemType: 'upload',
        labelWidth: '88px',
        drag: true,
        itemStyle: { 'width': '33%' },
        data: {
          'bizType': 'ORDER',
          bizId: this.routeId()
        },
        className: 'uploadfile',
        label: '客户订单:',
        rules: [{ required: true, message: '客户订单不能为空', trigger: 'change' }],
        action: '/common/file/upload', // 最新的链接
        limit: 6,
        beforeRemove: (file, fileList) => {
          const editformObj = this.$refs.enclosure.dynamicValidateFormRuleForm || {}
          this.formDatasenclosure = editformObj
          const arr = []
          this.formDatasenclosure.customerOrderFile && this.formDatasenclosure.customerOrderFile.forEach((item, indexs) => {
            // console.log(item, file)
            if (item.uid !== file.uid) {
              arr.push(item)
            }
          })
          this.$set(this.formDatasenclosure, 'customerOrderFile', arr)
        },
        onPreview: (file) => { },
        beforeUpload: (file) => {
          return this.DocumentGudgment(file)
        },
        onExceed: (files) => {
          this.$message.error('上传文件个数不能超过6个!')
        },
        accept: '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX',
        content: [
          {
            slot: 'trigger',
            component: uploadSlotTrigger
          }
        ]
      },
      _clothingStyleFile: {
        prop: 'clothingStyleFile',
        itemType: 'upload',
        drag: true,
        labelWidth: '88px',
        itemStyle: { 'width': '33%' },
        className: 'uploadfile',
        label: '成衣款式:',
        action: '/common/file/upload', // 最新的链接
        limit: 6,
        data: {
          'bizType': 'ORDER',
          bizId: this.routeId()
        },
        beforeRemove: (file, fileList) => {
          // console.log(fileList)
          debugger
          // const editformObj = this.$refs.enclosure.dynamicValidateFormRuleForm || {}
          // this.formDatasenclosure = editformObj
          const arr = []
          fileList.forEach((item, indexs) => {
            if (item.uid !== file.uid) {
              arr.push(item)
            }
          })
          this.$set(this.formDatasenclosure, 'clothingStyleFile', arr)
        },
        onPreview: (file) => { },
        beforeUpload: (file) => {
          return this.DocumentGudgment(file)
        },
        onExceed: (files) => {
          this.$message.error('上传文件个数不能超过6个!')
        },
        accept: '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX',
        content: [
          {
            slot: 'trigger',
            component: uploadSlotTrigger
          }
        ]
      },
      _otherFile: {
        prop: 'otherFile',
        itemType: 'upload',
        drag: true,
        labelWidth: '80px',
        itemStyle: { 'width': '33%' },
        className: 'uploadfile',
        label: '其他:',
        action: '/common/file/upload', // 最新的链接
        limit: 7,
        data: {
          'bizType': 'ORDER',
          bizId: this.routeId()
        },
        beforeRemove: (file, fileList) => {
          const editformObj = this.$refs.enclosure.dynamicValidateFormRuleForm || {}
          this.formDatasenclosure = editformObj
          const arr = []
          this.formDatasenclosure.otherFile && this.formDatasenclosure.otherFile.forEach((item, indexs) => {
            if (item.uid !== file.uid) {
              arr.push(item)
            }
            this.$set(this.formDatasenclosure, 'otherFile', arr)
          })
        },
        onPreview: (file) => { },
        beforeUpload: (file) => {
          return this.DocumentGudgment(file)
        },
        onExceed: (files) => {
          this.$message.error('上传文件个数不能超过7个!')
        },
        accept: '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX',
        content: [
          {
            slot: 'trigger',
            component: uploadSlotTrigger
          }
        ]
      }
    }
    const enclosure2 = {
      _customerOrderFile: {
        prop: 'customerOrderFile',
        itemType: 'input',
        labelWidth: '80px',
        itemStyle: { 'width': '33%' },
        label: '客户订单',
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'customerOrderFile',
          url: 'customerOrderFile',
          text: '客户订单'
        }
      },
      _clothingStyleFile: {
        prop: 'clothingStyleFile',
        itemType: 'input',
        itemStyle: { 'width': '33%' },
        label: '成衣款式',
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'clothingStyleFile',
          url: 'clothingStyleFile',
          text: '成衣款式'
        }
      },
      _otherFile: {
        prop: 'otherFile',
        itemType: 'input',
        labelWidth: '80px',
        itemStyle: { 'width': '33%' },
        label: '其他',
        components: {
          uploadFile
        },
        componentsOptions: {
          prop: 'otherFile',
          url: 'otherFile',
          text: '其他'
        }
      }
    }
    const formOptions = {
      size: 'small',
      inline: true,
      labelWidth: '105px',
      getForm: (form) => {
        this.getClothingForm(form)
      },
      syncDataHandle: (formDatas) => {
        // console.log(formDatas)
        this.syncDataHandle('additionalnformation', formDatas)
      }
    }
    return {
      formOptions,
      textTim: '',
      readyToWear, // 成衣信息
      enclosure, // 附件 编辑
      enclosure2, // 附件 查看
      accept: '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX',
      formDatasready: {}, // 成衣信息
      formDatasenclosure: {} // 附件
    }
  },
  computed: {
    getEditClass() {
      if (this.isEdit) {
        return 'editClass'
      } else {
        return 'detailClass'
      }
    }
  },
  watch: {
    orderData: {
      handler(val, oldVal) {
        console.log('--val--')
        console.log(val)
        if (val !== null && val && Object.keys(val).length) {
          this.initializationCom(val)
        }
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler(val, oldVal) {
        if (val) {
          this.editChange()
        } else {
          this.editChange(true)
        }
      },
      deep: true,
      immediate: true
    },
    textTim: {
      handler(val, oldVal) {
        this.syncDataHandle('additionalnformation', { precautions: val })
      },
      immediate: true
    }
  },
  created() {
    this.init()// 初始化数据
  },
  mounted() {

  },
  methods: {
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        res.unshift({ value: '', label: '' })
        if (type === 'exportAgent') { // 出口代理
        } else if (type === 'clothingType') { // 成衣类型
          this.$set(this.readyToWear._clothingType, 'dataSource', res)
        } else if (type === 'clothingStyle') { // 成衣款式
          this.$set(this.readyToWear._clothingStyle, 'dataSource', res)
        }
      })
    },
    DestinationPortSelect(data = {}) { // 出发港口 目的港口
      this.DestinationPort(data).then(res => {
        res.unshift({ value: '', label: '' })
      })
    },
    CountryPortSelect(data = {}) { // 成衣出口
      this.CountryPort(data).then(res => {
        res.unshift({ value: '', label: '' })
        this.$set(this.readyToWear._clothingExport, 'dataSource', res)
      })
    },
    openShipMethodSelect(data = {}) { // 运输方式
      this.openShipMethodPort(data).then(res => {
        res.unshift({ value: '', label: '' })
      })
    },
    // 编辑状态
    editChange(type = false) {
      for (const key in this.readyToWear) { // 成衣信息
        this.readyToWear[key].disabled = type
      }
    },
    // 页面初始化
    initializationCom(data) {
      const that = this
      const daTm = data.extraInfo || ''
      if (this.$route.query.requireId) {
        that.formDatasenclosure = {// 附件
          isEdit: this.isEdit,
          customerOrderFile: daTm.customerOrderFile && that.getTypes(daTm.customerOrderFile) ? daTm.customerOrderFile : '', // 客户订单
          clothingStyleFile: daTm.clothingStyleFile && that.getTypes(daTm.clothingStyleFile) ? daTm.clothingStyleFile : '', // 成衣款式
          otherFile: daTm.otherFile && that.getTypes(daTm.otherFile) ? daTm.otherFile : ''// 成衣款式
        }
        this.$set(this.enclosure._customerOrderFile, 'dataSource', that.formDatasenclosure.customerOrderFile ? [that.formDatasenclosure.customerOrderFile] : [])
        this.$set(this.enclosure._clothingStyleFile, 'dataSource', that.formDatasenclosure.clothingStyleFile ? [that.formDatasenclosure.clothingStyleFile] : [])
        this.$set(this.enclosure._otherFile, 'dataSource', that.formDatasenclosure.otherFile ? [that.formDatasenclosure.otherFile] : [])
        return false
      }

      that.formDatasready = {// 成衣信息
        clothingType: that.setValue(daTm.clothingType), // 成衣类型
        clothingStyle: that.setValue(daTm.clothingStyle), // 成衣款式
        isClothingWashWater: daTm.isClothingWashWater, // 是否成衣洗水{1=是，2=否}
        clothingExport: that.setValue(daTm.clothingExport) // 成衣出口
      } // 成衣信息
      this.$set(this.readyToWear._clothingType, 'dataSource', that.formDatasready.clothingType ? [that.formDatasready.clothingType] : [])
      this.$set(this.readyToWear._clothingStyle, 'dataSource', that.formDatasready.clothingStyle ? [that.formDatasready.clothingStyle] : [])
      this.$set(this.readyToWear._clothingExport, 'dataSource', that.formDatasready.clothingExport ? [that.formDatasready.clothingExport] : [])
      that.formDatasenclosure = {// 附件
        isEdit: this.isEdit,
        customerOrderFile: daTm.customerOrderFile && that.getTypes(daTm.customerOrderFile) ? daTm.customerOrderFile : '', // 客户订单
        clothingStyleFile: daTm.clothingStyleFile && that.getTypes(daTm.clothingStyleFile) ? daTm.clothingStyleFile : '', // 成衣款式
        otherFile: daTm.otherFile && that.getTypes(daTm.otherFile) ? daTm.otherFile : '', // 成衣款式
        extraId: daTm.extraId || ''
      }
      // console.log(that.formDatasenclosure.clothingStyleFile)
      this.$set(this.enclosure._customerOrderFile, 'dataSource', that.formDatasenclosure.customerOrderFile ? [that.formDatasenclosure.customerOrderFile] : [])
      this.$set(this.enclosure._clothingStyleFile, 'dataSource', that.formDatasenclosure.clothingStyleFile ? [that.formDatasenclosure.clothingStyleFile] : [])
      this.$set(this.enclosure._otherFile, 'dataSource', that.formDatasenclosure.otherFile ? [that.formDatasenclosure.otherFile] : [])
      // 注意事项
      this.textTim = daTm.precautions || ''
    },
    getTypes(instence) { // 获取数据类型
      return Object.prototype.toString.call(instence).slice(8, -1) === 'Array'
    },
    // 判断文件上传格式
    DocumentGudgment(file) {
      const flieText = file.name.length <= 50
      let isLt1M = false
      let isXls = false
      if (flieText) {
        const fileName = file.name.split('.')
        const fileType = fileName[fileName.length - 1]
        const regexp = new RegExp(fileType)
        isXls = regexp.test(this.accept)
        isLt1M = file.size / 1024 / 1024 <= 10
      }
      if (!flieText) {
        this.$message.error('上传文件名不能超过50个字符')
      } else if (!isXls) {
        this.$message.error('上传文件只能是 JPG/JPEG/PNG/BMP/PDF/EXCEL/WORD 格式!')
      } else if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isXls && isLt1M && flieText
    },
    // 获取id
    routeId() {
      const sp = (this.$route.params && this.$route.params.id) ? this.$route.params.id : ''
      return sp
    },
    // 初始化数据
    init() {
      this.formDatasready = {// 成衣信息
        clothingType: '', // 成衣类型
        clothingStyle: '', // 成衣款式
        isClothingWashWater: '', // 是否成衣洗水{1=是，2=否}
        clothingExport: '' // 成衣出口
      } // 成衣信息
      this.formDatasenclosure = {// 附件
        isEdit: false,
        customerOrderFile: '', // 客户订单
        clothingStyleFile: '', // 成衣款式
        otherFile: ''// 成衣款式
      }
    },
    // 纯数据展示
    setValue(it) {
      if (it && it.value) {
        it.value = it.value !== null ? it.value : ''
      } else {
        it = ''
      }
      return it
    },
    inputTypeChange() {
      return this.isEdit ? 'input' : 'itemview'
    },
    selectTypeChange() {
      return this.isEdit ? 'select' : 'itemview'
    }
  }
}
</script>
<style lang="scss" scoped>
.qualityrequ {
  padding-bottom: 60px;
  // margin-top: 20px;
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
        // font-weight: 500;
      }
      .el-button {
        display: flex;
        span {
          font-size: 14px;
        }
      }
      .attachmentTips {
        color: rgb(136, 142, 158);
        font-size: 14px;
        margin-left: 5px;
      }
    }
    .basic-top {
      border-bottom: 1px solid #eeeff0;
      margin-bottom: 20px;
    }
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    color: #666666;
  }
  /deep/ .el-form--inline .el-form-item {
    margin-right: 0;
  }
  .detailClass /deep/.el-input__inner {
    padding: 0;
    border: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #fff;
    font-size: 14px;
  }
  .detailClass /deep/ .el-form-item {
    margin-bottom: 14px;
  }
  .editClass /deep/ .el-form-item {
    margin-bottom: 20px;
  }
  .detailClass /deep/ .el-input__icon {
    display: none;
  }
  .basic-data .el-input.is-disabled .el-input__suffix {
    display: none;
  }
  .basic-data {
    margin-top: 0;
    padding-bottom: 10px;
    .custom-form {
      margin: 0 20px;
    }
  }
  .table-padding {
    padding-bottom: 20px!important;
  }
  .table-shipment {
    /deep/ .custom-form {
      .el-form-item:nth-child(9) {
        .el-form-item__label {
          text-align: left;
          line-height: 18px;
        }
      }
    }
  }
  //附件信息样式
  /deep/ .uploadfile .el-upload-dragger {
    width: 100%;
    height: 100px;
  }
  /deep/ .uploadfile .el-icon-upload {
    font-size: 36px;
    margin-top: 4px!important;
  }
  /deep/ .uploadfile .el-upload {
    width: 100% !important;
  }
  // 注意事项:
  .table-textarea {
    padding: 0 20px;
    /deep/ textarea {
      color: #000 !important;
      min-height: 60px !important;
    }
  }
  /deep/ .el-form-item__label {
    min-width: 100px;
  }
}
</style>
