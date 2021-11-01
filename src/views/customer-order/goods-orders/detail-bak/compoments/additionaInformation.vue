<!--
 * @Author: xj
 * @Description: 大货开发==》附加信息
 * @Date: 2021-03-12 10:35:29
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-05-28 14:24:52
 * @FilePath: e:\备份\com\src\views\customer-order\goods-orders\detail-bak\compoments\additionaInformation.vue
-->
<template>
  <div class="qualityrequ">
    <!-- 出货要求 -->
    <div class="table-item basic-data table-shipment">
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
    <!--附件-->
    <div v-if="isEdit&&!orderData.demandSource&&!orderData.demandCode" class="table-item basic-data">
      <div class="header-top basic-top">
        <span>附件</span>
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
    <div class="table-item basic-data">
      <div class="header-top basic-top">
        <span>注意事项</span>
      </div>
      <div class="table-textarea">
        <el-input
          v-model="textTim"
          type="textarea"
          :title="textTim"
          placeholder="请输入内容"
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
import { isArray } from '@/utils/validate'
export default {
  name: 'Additional',
  components: {},
  mixins: [PublicCustomer],
  props: {
    isEdit: {
      type: Boolean
    },
    orderData: {
      type: Object
    }
  },
  data() {
    const shipment = {
      _exportAgent: {
        prop: 'exportAgent',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '出口代理:',
        valueType: 'object',
        labelWidth: '90px',
        clearable: true,
        disabled: true,
        change: (value) => {},
        rules: [{ required: true, message: '出口代理不能为空', trigger: 'change' }],
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '出口代理' }, 'exportAgent')
          }
        }
      },
      _departurePort: {
        prop: 'departurePort',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '出发港口:',
        width: '88px',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.DestinationPortSelect({ 'enabled': 'Y' })
          }
        },
        dataSource: []
      },
      _destinationPort: {
        prop: 'destinationPort',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '目的港口:',
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.DestinationPortSelect({ 'enabled': 'Y' })
          }
        },
        dataSource: []
      },
      _isDirectFlight: {
        prop: 'isDirectFlight',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '是否直航:',
        rules: [{ required: true, message: '是否直航不能为空', trigger: 'change' }],
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
        ]
      },
      _transportMode: {
        prop: 'transportMode',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '运输方式:',
        labelWidth: '90px',
        valueType: 'object',
        clearable: true,
        disabled: true,
        rules: [{ required: true, message: '运输方式不能为空', trigger: 'change' }],
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.openShipMethodSelect({ 'enabled': 'Y' })
          }
        },
        dataSource: []
      },
      _netOrGrossWeight: {
        prop: 'netOrGrossWeight',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '净重/毛重:',
        width: '88px',
        rules: [{ required: true, message: '净重/毛重不能为空', trigger: 'change' }],
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
        ]
      },
      _plasticBagType: {
        prop: 'plasticBagType',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '胶袋类型:',
        valueType: 'object',
        rules: [{ required: true, message: '胶袋类型不能为空', trigger: 'change' }],
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '胶袋类型' }, 'plasticBagType')
          }
        },
        dataSource: []
      },
      _plasticBagThickness: {
        prop: 'plasticBagThickness',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '胶袋厚度:',
        rules: [{ required: true, message: '胶袋厚度不能为空', trigger: 'change' }],
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '胶袋厚度' }, 'plasticBagThickness')
          }
        },
        dataSource: []
      },
      _isMatching: {
        prop: 'isMatching',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        labelWidth: '90px',
        label: '衫身和下栏是否配套出:',
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
        ]
      },
      _stickersQuantity: {
        prop: 'stickersQuantity',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '贴纸数量:',
        width: '88px',
        rules: [{ required: true, message: '贴纸数量不能为空', trigger: 'change' }],
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
        ]
      },
      _stickersPosition: {
        prop: 'stickersPosition',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '贴纸位置:',
        rules: [{ required: true, message: '贴纸位置不能为空', trigger: 'change' }],
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
          }]
      },
      _deliveryTolerance: {
        prop: 'deliveryTolerance',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '走货公差:',
        rules: [{ required: true, message: '走货公差不能为空', trigger: 'change' }],
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '走货公差' }, 'deliveryTolerance')
          }
        },
        dataSource: []
      }
    }
    const readyToWear = {
      _clothingType: {
        prop: 'clothingType',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '成衣类型:',
        rules: [{ required: true, message: '成衣类型不能为空', trigger: 'change' }],
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '成衣类型' }, 'clothingType')
          }
        },
        dataSource: []
      },
      _clothingStyle: {
        prop: 'clothingStyle',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '成衣款式:',
        rules: [{ required: true, message: '成衣款式不能为空', trigger: 'change' }],
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.getOptionConfigSelect({ pageName: '大货订单', fieldName: '成衣款式' }, 'clothingStyle')
          }
        },
        dataSource: []
      },
      _isClothingWashWater: {
        prop: 'isClothingWashWater',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '是否成衣洗水:',
        rules: [{ required: true, message: '是否成衣洗水不能为空', trigger: 'change' }],
        clearable: true,
        disabled: true,
        change: (value) => {},
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
        ]
      },
      _clothingExport: {
        prop: 'clothingExport',
        itemType: 'select',
        className: 'inputWidth',
        itemStyle: { 'width': '25%' },
        label: '成衣出口:',
        rules: [{ required: true, message: '成衣出口不能为空', trigger: 'change' }],
        valueType: 'object',
        clearable: true,
        disabled: true,
        change: (value) => {},
        visibleChange: (value, val) => {
          if (value) {
            this.CountryPortSelect({ 'enabled': 'Y' })
          }
        },
        dataSource: []
      }
    }
    const enclosure = {
      _customerOrderFile: {
        prop: 'customerOrderFile',
        itemType: 'upload',
        labelWidth: '88px',
        drag: true,
        itemStyle: { 'width': '45%' },
        className: 'uploadfile',
        label: '客户订单:',
        action: '/common/file/upload', // 最新的链接
        limit: 6,
        rules: [{ required: true, message: '客户订单不能为空', trigger: 'change' }],
        data: {
          'bizType': 'ORDER',
          bizId: this.routeId()
        },
        beforeRemove: (file, fileList) => {
          const editformObj = this.$refs.enclosure.dynamicValidateFormRuleForm || {}
          this.formDatasenclosure = editformObj
          const arr = []
          this.formDatasenclosure.customerOrderFile && this.formDatasenclosure.customerOrderFile.forEach((item, indexs) => {
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
        itemStyle: { 'width': '45%', 'marginLeft': '40px' },
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
        labelWidth: '88px',
        itemStyle: { 'width': '45%' },
        className: 'uploadfile',
        label: '其他:',
        action: '/common/file/upload', // 最新的链接
        data: {
          'bizType': 'ORDER',
          bizId: this.routeId()
        },
        limit: 7,
        beforeRemove: (file, fileList) => {
          const editformObj = this.$refs.enclosure.dynamicValidateFormRuleForm || {}
          this.formDatasenclosure = editformObj
          const arr = []
          this.formDatasenclosure.otherFile && this.formDatasenclosure.otherFile.forEach((item, indexs) => {
            if (item.uid !== file.uid) {
              arr.push(item)
            }
          })
          this.$set(this.formDatasenclosure, 'otherFile', arr)
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
        labelWidth: '80px',
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
    return {
      textTim: '',
      shipment, // 出货要求
      readyToWear, // 成衣信息
      enclosure, // 附件 编辑
      enclosure2, // 附件 查看
      formOptions: {
        size: 'small',
        inline: true
      },
      accept: '.png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.bmp,.BMP,.xlsx,.xls,.XLSX,.XLS,.pdf,.PDF,.doc,.docx,.DOC,.DOCX',
      formDatasshipment: {}, // 出货要求
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
        if (val !== null && Object.keys(val).length) {
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
          this.$set(this.shipment._exportAgent, 'dataSource', res)
        } else if (type === 'plasticBagType') { // 胶袋类型
          this.$set(this.shipment._plasticBagType, 'dataSource', res)
        } else if (type === 'plasticBagThickness') { // 胶袋厚度
          this.$set(this.shipment._plasticBagThickness, 'dataSource', res)
        } else if (type === 'deliveryTolerance') { // 走货公差
          this.$set(this.shipment._deliveryTolerance, 'dataSource', res)
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
      for (const key in this.readyToWear) { // 成衣信息
        this.readyToWear[key].disabled = type
      }
    },
    // 像外返回数据汇总
    DataSummary() {
      const that = this
      const shipmentArray = that.$refs.shipment.dynamicValidateFormRuleForm || ''// 出货要求
      const readyToWearArray = that.$refs.readyToWear.dynamicValidateFormRuleForm || ''// 成衣信息
      const enclosurArraye = that.$refs.enclosure.dynamicValidateFormRuleForm || ''// 附件
      const precautionsArray = { // 注意事项
        precautions: that.textTim
      }
      let isdeparturePort = false
      const departurePort = shipmentArray.departurePort && shipmentArray.departurePort.value ? shipmentArray.departurePort.value : ''
      const destinationPort = shipmentArray.destinationPort && shipmentArray.destinationPort.value ? shipmentArray.destinationPort.value : ''
      if ((departurePort && destinationPort) && departurePort === destinationPort) {
        isdeparturePort = true
      }
      var obj = Object.assign(shipmentArray, readyToWearArray, enclosurArraye, precautionsArray, { isshow: isdeparturePort })
      if (this.orderData.demandSource && this.orderData.demandCode || this.orderData.isFromCrm) {
        const som = enclosurArraye.customerOrderFile
        const clo = enclosurArraye.clothingStyleFile
        const oth = enclosurArraye.otherFile
        obj.crmType = true
        obj.customerOrderFileUrl = som && som.length ? JSON.stringify(som) : null
        obj.clothingStyleFileUrl = clo && clo.length ? JSON.stringify(clo) : null
        obj.otherFileUrl = oth && oth.length ? JSON.stringify(oth) : null
        obj.customerOrderFile = null
        obj.clothingStyleFile = null
        obj.otherFile = null
      } else {
        obj.customerOrderFile = that.setUploadData(enclosurArraye, 'customerOrderFile')
        obj.clothingStyleFile = that.setUploadData(enclosurArraye, 'clothingStyleFile')
        obj.otherFile = that.setUploadData(enclosurArraye, 'otherFile')
      }
      console.log('pm', obj)
      return obj
    },
    // 页面初始化
    initializationCom(data) {
      const that = this
      const daTm = data.extraInfo
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

      that.formDatasshipment = {// 出货要求
        exportAgent: that.setValue(daTm.exportAgent), // 出口代理
        departurePort: that.setValue(daTm.departurePort), // 出发港口
        destinationPort: that.setValue(daTm.destinationPort), // 目的港口
        isDirectFlight: daTm.isDirectFlight, // 是否直航{1=是，2=否}
        transportMode: that.setValue(daTm.transportMode), // 运输方式
        netOrGrossWeight: daTm.netOrGrossWeight, // 净重毛重{0=空白，1=净重，2=毛重}
        plasticBagType: that.setValue(daTm.plasticBagType), // 胶袋类型
        plasticBagThickness: that.setValue(daTm.plasticBagThickness), // 胶袋厚度ID
        isMatching: daTm.netOrGrossWeight, // 衫身和下栏是否配套出{1=是，2=否}
        stickersQuantity: daTm.stickersQuantity, // 贴纸数量
        stickersPosition: daTm.stickersPosition, // 贴纸位置{1=胶袋任一边，2=胶袋两边，3=胶袋两边各一，4=中间一}
        deliveryTolerance: that.setValue(daTm.transportMode), // 走货公差
        extraId: daTm.extraId || ''
      }
      this.$set(this.shipment._exportAgent, 'dataSource', that.formDatasshipment.exportAgent ? [that.formDatasshipment.exportAgent] : [])
      this.$set(this.shipment._departurePort, 'dataSource', that.formDatasshipment.departurePort ? [that.formDatasshipment.departurePort] : [])
      this.$set(this.shipment._destinationPort, 'dataSource', that.formDatasshipment.destinationPort ? [that.formDatasshipment.destinationPort] : [])
      this.$set(this.shipment._transportMode, 'dataSource', that.formDatasshipment.transportMode ? [that.formDatasshipment.transportMode] : [])
      this.$set(this.shipment._plasticBagType, 'dataSource', that.formDatasshipment.plasticBagType ? [that.formDatasshipment.plasticBagType] : [])
      this.$set(this.shipment._plasticBagThickness, 'dataSource', that.formDatasshipment.plasticBagThickness ? [that.formDatasshipment.plasticBagThickness] : [])
      this.$set(this.shipment._deliveryTolerance, 'dataSource', that.formDatasshipment.deliveryTolerance ? [that.formDatasshipment.deliveryTolerance] : [])

      that.formDatasready = {// 成衣信息
        clothingType: that.setValue(daTm.clothingType), // 成衣类型
        clothingStyle: that.setValue(daTm.clothingStyle), // 成衣款式
        isClothingWashWater: daTm.isDirectFlight, // 是否成衣洗水{1=是，2=否}
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
      this.textTim = daTm.precautions || ''
    },
    getTypes(instence) { // 获取数据类型
      return Object.prototype.toString.call(instence).slice(8, -1) === 'Array'
    },
    // 判断文件上传格式
    DocumentGudgment(file) {
      if (!file.name) { return false }
      const fileName = file.name.split('.') || []
      const fileType = fileName[fileName.length - 1]
      const regexp = new RegExp(fileType)
      const isXls = regexp.test(this.accept)
      const isLt1M = file.size / 1024 / 1024 <= 10
      if (!isXls) {
        this.$message.error('上传文件只能是 JPG/JPEG/PNG/BMP/PDF/EXCEL/WORD 格式!')
      } else if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isXls && isLt1M
    },
    // 文件字符串化
    setUploadData(data, im) {
      if (data) {
        if (data[im] && isArray(data[im])) {
          let attachStr = ''
          data[im].forEach((item, index) => {
            if (item.response && item.response.data) {
              attachStr = attachStr + item.response.data.id + ','
            } else if (item.id) {
              attachStr = attachStr + item.id + ','
            }
          })
          return attachStr.substring(0, attachStr.lastIndexOf(','))
        }
      } else { return '' }
    },
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
        stickersPosition: '', // 贴纸位置{1=胶袋任一边，2=胶袋两边，3=胶袋两边各一，4=中间一}
        deliveryTolerance: '' // 走货公差
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
    padding-bottom: 20px;
    .custom-form {
      margin: 0 20px;
    }
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
    height: 139px;
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
  // 注意事项:
  .table-textarea {
    padding: 0 20px;
    /deep/ textarea {
      color: #000 !important;
      min-height: 60px !important;
    }
  }
}
</style>
