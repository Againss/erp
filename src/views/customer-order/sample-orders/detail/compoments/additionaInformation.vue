<!--
 * @Author: xj
 * @Description: 样板开发==》附加信息
 * @Date: 2021-03-12 10:35:29
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-05-28 14:27:08
 * @FilePath: e:\备份\com\src\views\customer-order\sample-orders\detail\compoments\additionaInformation.vue
-->
<template>
  <div class="qualityrequ">
    <!-- 出货要求 -->
    <div class="table-item basic-data">
      <div class="header-top basic-top">
        <span>出货要求</span>
      </div>
      <cs-custom-form
        ref="shipment"
        :class="getEditClass"
        :data-source="shipment"
        :options="formOptions"
        :form-datas="formDatasshipment"
      />
      <!-- 制衣厂 -->
      <cs-custom-form
        ref="garmentFactory"
        :class="getEditClass"
        :data-source="garmentFactory"
        :options="garmentFactoryFormOptions"
        :form-datas="formDatasgarmentFactory"
      />
    </div>
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
      v-if="isEdit && !orderData.demandSource && !orderData.demandCode"
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

    <div v-if="!isEdit||(isEdit&&orderData.demandSource&&orderData.demandCode)" class="table-item basic-data">
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
        <div v-if="!isEdit" :title="textTim" class="yarn-style">{{ textTim||'' }}</div>
        <el-input
          v-else
          v-model="textTim"
          type="textarea"
          placeholder="请输入内容"
          :title="textTim"
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
    marketType: {
      type: Object
    },
    orderData: {
      type: Object
    },
    syncDataHandle: {
      type: Function
    }
  },
  data() {
    const shipment = {
      _transportMode: {
        prop: 'transportMode',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '运输方式:',
        // labelWidth: '90px',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.openShipMethodSelect({ 'enabled': 'Y' })
            // this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '运输方式' }, 'transportMode')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}' class="render-content-item">${value.label}</div>` : ''
        }
      },
      _departurePort: {
        prop: 'departurePort',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '出发地:',
        // labelWidth: '81px',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.DestinationPortSelect({ 'enabled': 'Y' })
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}' class="render-content-item">${value.label}</div>` : ''
        }
      },
      _destinationPort: {
        prop: 'destinationPort',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '目的地:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.DestinationPortSelect({ 'enabled': 'Y' })
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}' class="render-content-item">${value.label}</div>` : ''
        }
      },
      _isMatching: {
        prop: 'isMatching',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        // labelWidth: '90px',
        label: '是否配套出:',
        clearable: true,
        disabled: true,
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
          return value ? `<div title='${obj[value]}' class="render-content-item">${obj[value]}</div>` : ''
        }
      },
      _isDirectFlight: {
        prop: 'isDirectFlight',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '是否直航:',
        clearable: true,
        disabled: true,
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
      _exportAgent: {
        prop: 'exportAgent',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '出口代理:',
        valueType: 'object',
        // labelWidth: '90px',
        clearable: true,
        disabled: true,
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '出口代理' }, 'exportAgent')
          }
        },
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}' class="render-content-item">${value.label}</div>` : ''
        }
      },
      _netOrGrossWeight: {
        prop: 'netOrGrossWeight',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '净重/毛重:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '净重',
            value: '1'
          },
          {
            label: '毛重',
            value: '2'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const obj = { '1': '净重', '2': '毛重' }
          return value ? `<div title='${obj[value]}'>${obj[value]}</div>` : ''
        }
      },
      _plasticBagType: {
        prop: 'plasticBagType',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '胶袋类型:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '胶袋类型' }, 'plasticBagType')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}' class="render-content-item">${value.label}</div>` : ''
        }
      },
      _plasticBagThickness: {
        prop: 'plasticBagThickness',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '胶袋厚度:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => { },
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '胶袋厚度' }, 'plasticBagThickness')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}' class="render-content-item">${value.label}</div>` : ''
        }
      },
      _stickersPosition: {
        prop: 'stickersPosition',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '贴纸位置:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '胶袋任一边',
            value: '1'
          },
          {
            label: '胶袋两边',
            value: '2'
          },
          {
            label: '胶袋两边各一,中间一',
            value: '3'
          }],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const obj = { '1': '胶袋任一边', '2': '胶袋两边', '3': '胶袋两边各一,中间一' }
          return value ? `<div title='${obj[value]}' class="render-content-item">${obj[value]}</div>` : ''
        }
      },
      _stickersQuantity: {
        prop: 'stickersQuantity',
        itemType: this.selectTypeChange,
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '贴纸数量:',
        clearable: true,
        disabled: true,
        dataSource: [
          {
            label: '',
            value: ''
          },
          {
            label: '1',
            value: '1'
          },
          {
            label: '2',
            value: '2'
          },
          {
            label: '3',
            value: '3'
          }
        ],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          const obj = { '1': '2', '2': '2', '3': '3' }
          return value ? `<div title='${obj[value]}' class="render-content-item">${obj[value]}</div>` : ''
        }
      }
    }
    const garmentFactory = {
      _garmentFactoryList: {
        prop: 'garmentFactoryList',
        itemType: this.selectTypeChange,
        className: 'commonRemoteSearch',
        itemStyle: { 'width': '50%' },
        style: { 'width': '92%' },
        placeholder: '输入文字模糊查询',
        label: '制衣厂:',
        valueType: 'object',
        clearable: true,
        disabled: false,
        filterable: true,
        multiple: true,
        change: (value) => {
          // this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getCustomerSelect()
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          console.log(value)
          let str = ''
          if (value && value.length && Array.isArray(value)) {
            const list = value
            for (let i = 0; i < list.length; i++) {
              str += list[i].label + '，'
            }
            str = str.substring(0, str.length - 1)
          }
          return `<div title="${str}" class='yarn-style'>${str}</div>`
        }
      }
    }
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
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '成衣类型' }, 'clothingType')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}' class="render-content-item">${value.label}</div>` : ''
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
            this.getOptionConfigSelect({ pageName: '样板开发单', fieldName: '成衣款式' }, 'clothingStyle')
          }
        },
        dataSource: [],
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return value ? `<div title='${value.label}' class="render-content-item">${value.label}</div>` : ''
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
          return value ? `<div title='${obj[value]}' class="render-content-item">${obj[value]}</div>` : ''
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
          return value ? `<div title='${value.label}' class="render-content-item">${value.label}</div>` : ''
        }
      }
    }
    const enclosure = {
      _customerOrderFile: {
        prop: 'customerOrderFile',
        itemType: 'upload',
        // labelWidth: '80px',
        drag: true,
        itemStyle: { 'width': '33%' },
        data: {
          'bizType': 'ORDER',
          bizId: this.routeId()
        },
        className: 'uploadfile',
        label: '客户订单:',
        action: '/common/file/upload', // 最新的链接
        limit: 6,
        beforeRemove: (file, fileList) => {
          const editformObj = this.$refs.enclosure.dynamicValidateFormRuleForm || {}
          this.formDatasenclosure = editformObj
          const arr = []
          this.formDatasenclosure.customerOrderFile && this.formDatasenclosure.customerOrderFile.forEach((item, indexs) => {
            console.log(item, file)
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
          const editformObj = this.$refs.enclosure.dynamicValidateFormRuleForm || {}
          this.formDatasenclosure = editformObj
          const arr = []
          this.formDatasenclosure.clothingStyleFile && this.formDatasenclosure.clothingStyleFile.forEach((item, indexs) => {
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
        // labelWidth: '80px',
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
        // labelWidth: '80px',
        itemStyle: { 'width': '48%' },
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
        itemStyle: { 'width': '48%' },
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
        // labelWidth: '80px',
        itemStyle: { 'width': '48%' },
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
      labelWidth: '110px',
      syncDataHandle: (formDatas) => {
        this.syncDataHandle('additionalnformation', formDatas)
      }
    }
    const garmentFactoryFormOptions = {
      size: 'small',
      inline: true,
      labelWidth: '110px',
      syncDataHandle: (formDatas) => {
        let garmentFactoryList = []
        if (formDatas.garmentFactoryList && formDatas.garmentFactoryList.length) {
          garmentFactoryList = formDatas.garmentFactoryList.map(item => {
            return {
              garmentFactoryInfo: item
            }
          })
        }
        console.log(garmentFactoryList)
        this.syncDataHandle('garmentFactory', garmentFactoryList)
      }
    }
    return {
      formOptions,
      garmentFactoryFormOptions,
      textTim: '',
      shipment, // 出货要求
      garmentFactory, // 制衣厂
      readyToWear, // 成衣信息
      enclosure, // 附件 编辑
      enclosure2, // 附件 查看
      accept: '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX',
      formDatasshipment: {}, // 出货要求
      formDatasgarmentFactory: {}, // 制衣厂
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
    marketType: {
      handler(val, oldVal) {
        if (val !== null && val && Object.keys(val).length) {
          if (val.label === '国内') {
            this.$set(this.shipment._isDirectFlight, 'isShow', false)
            this.$set(this.shipment._exportAgent, 'isShow', false)
          } else {
            this.$set(this.shipment._isDirectFlight, 'isShow', true)
            this.$set(this.shipment._exportAgent, 'isShow', true)
          }
        }
      },
      deep: true,
      immediate: true
    },
    orderData: {
      handler(val, oldVal) {
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
    inputTypeChange() {
      return this.isEdit ? 'input' : 'itemview'
    },
    selectTypeChange() {
      return this.isEdit ? 'select' : 'itemview'
    },
    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        res.unshift({ value: '', label: '' })
        if (type === 'exportAgent') { // 出口代理
          this.$set(this.shipment._exportAgent, 'dataSource', res)
        } else if (type === 'plasticBagType') { // 胶袋类型
          this.$set(this.shipment._plasticBagType, 'dataSource', res)
        } else if (type === 'plasticBagThickness') { // 胶袋厚度
          this.$set(this.shipment._plasticBagThickness, 'dataSource', res)
        } else if (type === 'clothingType') { // 成衣类型
          this.$set(this.readyToWear._clothingType, 'dataSource', res)
        } else if (type === 'clothingStyle') { // 成衣款式
          this.$set(this.readyToWear._clothingStyle, 'dataSource', res)
        }
      })
    },
    // 获取制衣厂下拉
    getCustomerSelect() {
      this.getCustomer().then(res => {
        this.$set(this.garmentFactory._garmentFactoryList, 'dataSource', res)
      })
    },
    DestinationPortSelect(data = {}) { // 出发港口 目的港口
      this.DestinationPort(data).then(res => {
        res.unshift({ value: '', label: '' })
        this.$set(this.shipment._departurePort, 'dataSource', res)
        this.$set(this.shipment._destinationPort, 'dataSource', res)
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
        this.$set(this.shipment._transportMode, 'dataSource', res)
      })
    },
    // 编辑状态
    editChange(type = false) {
      for (const key in this.shipment) { // 出货要求
        this.shipment[key].disabled = type
      }
      for (const key in this.garmentFactory) { // 出货要求
        this.garmentFactory[key].disabled = type
      }
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
      // 处理后端返回的制衣厂数据返显
      const garmentFactoryList = []
      if (data.garmentFactoryList && data.garmentFactoryList.length) {
        data.garmentFactoryList.forEach(item => {
          garmentFactoryList.push(item.garmentFactoryInfo)
        })
      }
      that.formDatasgarmentFactory = {
        garmentFactoryList: garmentFactoryList
      }
      console.log(garmentFactoryList)
      this.$set(this.garmentFactory._garmentFactoryList, 'dataSource', garmentFactoryList)
      that.formDatasshipment = {// 出货要求
        exportAgent: that.setValue(daTm.exportAgent), // 出口代理
        departurePort: that.setValue(daTm.departurePort), // 出发港口
        destinationPort: that.setValue(daTm.destinationPort), // 目的港口
        isDirectFlight: daTm.isDirectFlight, // 是否直航{1=是，2=否}
        transportMode: that.setValue(daTm.transportMode), // 运输方式
        netOrGrossWeight: daTm.netOrGrossWeight, // 净重毛重{0=空白，1=净重，2=毛重}
        plasticBagType: that.setValue(daTm.plasticBagType), // 胶袋类型
        plasticBagThickness: that.setValue(daTm.plasticBagThickness), // 胶袋厚度ID
        isMatching: daTm.isMatching, // 衫身和下栏是否配套出{1=是，2=否}
        stickersQuantity: daTm.stickersQuantity, // 贴纸数量
        stickersPosition: daTm.stickersPosition, // 贴纸位置{1=胶袋任一边，2=胶袋两边，3=胶袋两边各一，4=中间一}
        extraId: daTm.extraId || ''
      }

      this.$set(this.shipment._exportAgent, 'dataSource', that.formDatasshipment.exportAgent ? [that.formDatasshipment.exportAgent] : [])
      this.$set(this.shipment._departurePort, 'dataSource', that.formDatasshipment.departurePort ? [that.formDatasshipment.departurePort] : [])
      this.$set(this.shipment._destinationPort, 'dataSource', that.formDatasshipment.destinationPort ? [that.formDatasshipment.destinationPort] : [])
      this.$set(this.shipment._transportMode, 'dataSource', that.formDatasshipment.transportMode ? [that.formDatasshipment.transportMode] : [])
      this.$set(this.shipment._plasticBagType, 'dataSource', that.formDatasshipment.plasticBagType ? [that.formDatasshipment.plasticBagType] : [])
      this.$set(this.shipment._plasticBagThickness, 'dataSource', that.formDatasshipment.plasticBagThickness ? [that.formDatasshipment.plasticBagThickness] : [])

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
        otherFile: daTm.otherFile && that.getTypes(daTm.otherFile) ? daTm.otherFile : ''// 成衣款式
      }
      this.$set(this.enclosure._customerOrderFile, 'dataSource', that.formDatasenclosure.customerOrderFile ? [that.formDatasenclosure.customerOrderFile] : [])
      this.$set(this.enclosure._clothingStyleFile, 'dataSource', that.formDatasenclosure.clothingStyleFile ? [that.formDatasenclosure.clothingStyleFile] : [])
      this.$set(this.enclosure._otherFile, 'dataSource', that.formDatasenclosure.otherFile ? [that.formDatasenclosure.otherFile] : [])
      // 注意事项

      // 注意事项
      this.textTim = daTm.precautions || ''
    },
    getTypes(instence) { // 获取数据类型
      return Object.prototype.toString.call(instence).slice(8, -1) === 'Array'
    },
    // 判断文件上传格式
    DocumentGudgment(file) {
      if (!file.name) { return false }
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
      const that = this
      that.formDatasshipment = {// 出货要求
        exportAgent: '', // 出口代理
        departurePort: '', // 出发港口
        destinationPort: '', // 目的港口
        isDirectFlight: '', // 是否直航{1=是，2=否}
        transportMode: '', // 运输方式
        netOrGrossWeight: '', // 净重毛重{0=空白，1=净重，2=毛重}
        plasticBagType: '', // 胶袋类型
        plasticBagThickness: '', // 胶袋厚度ID
        isMatching: '', // 衫身和下栏是否配套出{1=是，2=否}
        stickersQuantity: '', // 贴纸数量
        stickersPosition: '' // 贴纸位置{1=胶袋任一边，2=胶袋两边，3=胶袋两边各一，4=中间一}
      }
      this.formDatasgarmentFactory = {
        garmentFactoryList: [] // 制衣厂
      }
      that.formDatasready = {// 成衣信息
        clothingType: '', // 成衣类型
        clothingStyle: '', // 成衣款式
        isClothingWashWater: '', // 是否成衣洗水{1=是，2=否}
        clothingExport: '' // 成衣出口
      } // 成衣信息
      that.formDatasenclosure = {// 附件
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
        font-weight: 400;
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
  /deep/ .yarn-style{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/ .el-form-item__label {
    min-width: 100px;
  }
}
</style>
