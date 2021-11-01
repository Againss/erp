import * as api from '../api/index.js'
import uploadSlotTrigger from '../components/upload-slot-trigger.vue'
import formCustom from '@/views/quality-manage/public/components/form-custom.vue'
import { attachmentDelete } from '@/views/quality-manage/common/basisApi'
// import proportionItem from '../components/proportion-item.vue'
// import btnItem from '../common/btn-item.vue'
export const info = {
  data() {
    const itemStyle = {
      'width': '30%', 'padding-left': '20px', 'margin-bottom': '20px', 'margin-right': '0'
    }
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const infoCommon = {
      _title: {
        prop: 'title',
        itemType: 'view',
        text: `申请信息`,
        style: {
          'width': '100%',
          'display': 'flex',
          'align-items': 'center',
          'font-size': '16px',
          'color': '#151222',
          'height': '57px',
          'padding-left': '20px',
          'padding-right': '20px',
          'border-bottom': '1px solid  #EEEFF0',
          'margin-bottom': '20px'
        }
      },
      _code: {
        prop: 'code',
        itemType: this.inputTypeChange,
        label: '检测编码:',
        placeholder: '保存后自动生成',
        // readonly: true,
        disabled: true,
        itemStyle
      },
      _isPurchased: {
        prop: 'isPurchased',
        itemType: this.selectTypeChange,
        label: '检测类型:',
        itemStyle,
        rules: [commonChangeReg],
        // readonly: true,
        disabled: true,
        dataSource: [
          {
            label: '未采购',
            value: 0
          },
          {
            label: '已采购',
            value: 1
          }
        ],
        change: this.handleSelectChange,
        renderContent: (value) => {
          return value === 0 ? '未采购' : '已采购'
        }
      },
      _skuName: {
        prop: 'skuName',
        itemType: this.inputTypeChange,
        label: '产品编号:',
        itemStyle,
        isShow: true,
        placeholder: '请选择检测产品',
        filterable: true,
        // readonly: true,
        disabled: true,
        rules: [commonChangeReg],
        itemClassName: 'choose-product',
        focus: params => {
          this.$set(this.productPopOptions, 'visible', true)
          this.getInOutData()
        }
      },
      _yarnCount: {
        prop: 'yarnCount',
        itemType: this.selectTypeChange,
        valueType: 'object',
        label: '纱支:',
        // readonly: true,
        disabled: true,
        filterable: true,
        // clearable: true,
        placeholder: '',
        className: 'commonRemoteSearch',
        itemStyle,
        rules: [commonChangeReg],
        dataSource: [],
        select: [api.getSelectData, { enabled: 'Y', categoryId: 9 }],
        visibleChange: (flag) => {
          flag && this.getSelectData({ enabled: 'Y', categoryId: 9 }, '_yarnCount')
        },
        renderContent: (value) => {
          return value && value.label
        },
        // change: this.checkIfCalculat,
        change: (value, form, formDatas, setFormDatas, scope) => {
          this.checkIfCalculat(value, form, formDatas, setFormDatas, scope)
        }
      },
      _ingredients: {
        prop: 'ingredients',
        itemType: this.selectTypeChange,
        valueType: 'object',
        label: '成份:',
        // readonly: true,
        placeholder: '',
        disabled: true,
        filterable: true,
        // clearable: true,
        className: 'commonRemoteSearch',
        itemStyle,
        rules: [commonChangeReg],
        dataSource: [],
        select: [api.getIngredientsData, { enabled: 'Y' }],
        visibleChange: (flag) => {
          flag && api.getIngredientsData({ enabled: 'Y' }).then(res => {
            this.$set(this.infoCommon._ingredients, 'dataSource', res)
          })
        },
        // 如果选择的是成份：成份比例100不可编辑
        // 选择的是组合成份：组合成份通过（中文组合）“/”拆分多个输入框，最后总和=100，保存后格式：60/40，例如组合成份CVC的中文组合（棉/涤纶短纤）
        change: (value, form, formDatas, setFormDatas) => {
          let tempValue = ['100']
          if (value.names) {
            if (value.names.split('/').length > 1) {
              tempValue = new Array(value.names.split('/').length).fill('')
            }
          } else {
            if (value.label.split('/').length > 1) {
              tempValue = new Array(value.label.split('/').length).fill('')
            }
          }
          setFormDatas({ proportion: tempValue })
          if (tempValue[0] === '100') {
            this.changeProportion([''])
          } else {
            this.changeProportion(tempValue)
          }

          this.checkIfCalculat()
          form.clearValidate()
          // this.yarnCalculationGrade(tempValue)
        },
        renderContent: (value) => {
          return value && value.label
        }
      },
      _proportion: {
        prop: 'proportion',
        popoverOptions: {
          // placement: 'bottom'
        },
        // showMessage: false,
        itemType: this.inputTypeChange,
        itemStyle,
        label: '比例:',
        // readonly: true,
        disabled: true,
        placeholder: '',
        rules: [commonChangeReg],
        // change: this.checkIfCalculat,
        change: (value, form, formDatas, setFormDatas, scope) => {
          this.checkIfCalculat(value, form, formDatas, setFormDatas, scope)
        },
        // renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
        //   return value.join('/')
        // },
        components: [formCustom]
      },
      _spinningMethod: {
        prop: 'spinningMethod',
        itemType: this.selectTypeChange,
        valueType: 'object',
        label: '纺纱方法:',
        // readonly: true,
        disabled: true,
        filterable: true,
        // clearable: true,
        placeholder: '',
        className: 'commonRemoteSearch',
        itemStyle,
        rules: [commonChangeReg],
        dataSource: [],
        select: [api.getSelectData, { enabled: 'Y', categoryId: 2 }],
        visibleChange: (flag) => {
          flag && this.getSelectData({ enabled: 'Y', categoryId: 2 }, '_spinningMethod')
        },
        renderContent: (value) => {
          return value && value.label
        },
        // change: this.checkIfCalculat
        change: (value, form, formDatas, setFormDatas, scope) => {
          this.checkIfCalculat(value, form, formDatas, setFormDatas, scope)
        }
      },
      _cardingMethod: {
        prop: 'cardingMethod',
        itemType: this.selectTypeChange,
        valueType: 'object',
        label: '梳棉方法:',
        // readonly: true,
        disabled: true,
        filterable: true,
        // clearable: true,
        className: 'commonRemoteSearch',
        itemStyle,
        placeholder: '',
        rules: [commonChangeReg],
        dataSource: [],
        select: [api.getSelectData, { enabled: 'Y', categoryId: 3 }],
        visibleChange: (flag) => {
          flag && this.getSelectData({ enabled: 'Y', categoryId: 3 }, '_cardingMethod')
        },
        renderContent: (value) => {
          return value && value.label
        },
        // change: this.checkIfCalculat
        change: (value, form, formDatas, setFormDatas, scope) => {
          this.checkIfCalculat(value, form, formDatas, setFormDatas, scope)
        }
      },
      _yarnType: {
        prop: 'yarnType',
        itemType: this.selectTypeChange,
        valueType: 'object',
        label: '纱类:',
        // readonly: true,
        disabled: true,
        filterable: true,
        // clearable: true,
        className: 'commonRemoteSearch',
        itemStyle,
        rules: [commonChangeReg],
        dataSource: [],
        placeholder: '',
        select: [api.getSelectData, { enabled: 'Y', categoryId: 1 }],
        visibleChange: (flag) => {
          flag && this.getSelectData({ enabled: 'Y', categoryId: 1 }, '_yarnType')
        },
        renderContent: (value) => {
          return value && value.label
        }
      },
      _supplier: {
        prop: 'supplier',
        itemType: this.selectTypeChange,
        valueType: 'object',
        label: '供应商:',
        itemStyle,
        rules: [commonChangeReg],
        // readonly: true,
        disabled: true,
        filterable: true,
        // clearable: true,
        className: 'commonRemoteSearch',
        dataSource: [],
        placeholder: '',
        select: [api.getSupplierData, {
          supplierType: '1',
          supplierCategory: '0',
          isEnabled: '1'
        }],
        visibleChange: (flag) => {
          flag && api.getSupplierData({
            supplierType: '1',
            supplierCategory: '0',
            isEnabled: '1'
          }).then(res => {
            this.$set(this.infoCommon._supplier, 'dataSource', res)
          })
        },
        renderContent: (value) => {
          return value && value.label
        }
      },
      _yarnBatch: {
        prop: 'yarnBatch',
        itemType: this.inputTypeChange,
        label: '纱牌/纱批:',
        placeholder: '',
        // readonly: true,
        disabled: true,
        itemClassName: 'yarn-batch',
        title: true,
        itemStyle,
        maxlength: 50
      },
      _batchNo: {
        prop: 'batchNo',
        itemType: this.inputTypeChange,
        label: '批次号:',
        placeholder: '',
        // readonly: true,
        disabled: true,
        itemStyle,
        isShow: true
      },
      _stockInNo: {
        prop: 'stockInNo',
        itemType: this.inputTypeChange,
        label: '入库单号:',
        placeholder: '',
        // readonly: true,
        disabled: true,
        itemStyle,
        isShow: true
      },
      _stockOutNo: {
        prop: 'stockOutNo',
        itemType: this.inputTypeChange,
        label: '出库单号:',
        placeholder: '',
        // readonly: true,
        disabled: true,
        itemStyle,
        isShow: true
      },
      _relationNo: {
        prop: 'relationNo',
        itemType: this.inputTypeChange,
        label: '关联单号:',
        placeholder: '',
        // readonly: true,
        disabled: true,
        itemStyle,
        isShow: true
      },
      _actualStorageWeight: {
        prop: 'actualStorageWeight',
        itemType: this.inputTypeChange,
        label: '实际入库重量(KG):',
        placeholder: '',
        // readonly: true,
        disabled: true,
        itemStyle,
        isShow: true
      },
      _address: {
        prop: 'address',
        itemType: this.inputTypeChange,
        label: '地址:',
        placeholder: '',
        // readonly: true,
        disabled: true,
        itemStyle,
        isShow: true
      },
      _executiveStandardName: {
        prop: 'executiveStandardName',
        itemType: this.selectTypeChange,
        valueType: 'object',
        valueKey: 'value',
        label: '执行标准:',
        itemStyle,
        className: 'commonRemoteSearch',
        itemClassName: 'yarn-batch',
        filterable: true,
        clearable: true,
        multiple: true,
        disabled: true,
        readonly: true,
        dataSource: [],
        select: [api.getExecutivsStandardConfig, {
          isEnabled: 1,
          status: 'Y'
        }],
        visibleChange: (flag) => {
          flag && api.getExecutivsStandardConfig({ isEnabled: 1, status: 'Y' }).then(res => {
            this.$set(this.infoCommon._executiveStandardName, 'dataSource', res)
          })
        },
        // renderContent: (value) => {
        //   return value && value.label
        // }
        renderContent: (value) => {
          let str = ''
          if (value) {
            for (let i = 0; i < value.length; i++) {
              str += value[i].label + '/'
            }
            str = str.substr(0, str.length - 1)
          }

          return `<span title="${str}">${str}</span>`
        }
      },
      _reportTypeId: {
        prop: 'reportTypeId',
        itemType: this.selectTypeChange,
        // valueType: 'object',
        label: '报告类型:',
        // readonly: true,
        disabled: true,
        itemStyle,
        placeholder: '',
        dataSource: [
          {
            label: '内部报告',
            value: '1'
          },
          {
            label: '供应商报告',
            value: '2'
          }
        ],
        renderContent: (value) => {
          let str = ''
          if (value && value === '1') {
            str = '内部报告'
          } else if (value && value === '2') {
            str = '供应商报告'
          } else {
            str = ''
          }
          return str
        }
      },
      _remarks: {
        prop: 'remarks',
        itemType: this.inputTypeChange,
        label: '备注:',
        placeholder: '请输入(0-500字符)',
        // readonly: true,
        disabled: true,
        itemClassName: 'yarn-batch',
        title: true,
        rules: [],
        maxlength: 500,
        itemStyle: { ...itemStyle, 'width': '60%' }
      },
      _attachment: {
        prop: 'attachment',
        itemType: 'upload',
        label: '附件',
        className: 'upload-a-info',
        itemStyle,
        isShow: false,
        onSuccess: (res, file) => {
          console.log(res, file)
          this.$message.success('导入成功')
          this.infoData = {
            attachment: [file],
            attachmentName: res.data.originalName,
            attachmentPath: res.data.viewUrl
          }
          // this.$set(this.infoData, 'attachment', [file])
          // this.$set(this.infoData, 'attachmentName', res.data.originalName)
          // this.$set(this.infoData, 'attachmentPath', res.data.viewUrl)
          this.infoCommon._attachment.className = 'upload-a-info hideButton'
          // this.fetchLog(this.getLogMessages('IMPORT', '/quality-manage/quality-assurance/quality-yarn-add'), file, JSON.stringify({ beforeText: `在'质量管理-纱线检测-纱线物测'上传文件成功` }))
        },
        onError: (res, file) => {
          // console.log(res, file)
        },
        onExceed: (files, fileList) => {
          this.$message.warning(`当前限制选择 1 个文件`)
        },
        beforeRemove: (file, fileList) => {
          // debugger
          console.log('beforeRemove', file, fileList)
          return this.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1]) !== -1 ? this.$confirm(`确定移除 ${file.name}？`).then(() => {
            // this.deleteAttachment({ bizType: 'QA', url: this.infoData.attachmentPath })
            this.infoCommon._attachment.className = 'upload-a-info'
            // this.$set(this.infoData, 'attachment', [])
            // this.$set(this.infoData, 'attachmentName', '')
            // this.$set(this.infoData, 'attachmentPath', '')
            this.infoData = {
              attachment: [],
              attachmentName: '',
              attachmentPath: ''
            }
          }) : true
        },
        beforeUpload: (file) => {
          // console.log(file.type.split('/')[1])
          // const fileName = file.name.split('.')
          // const fileType = fileName[fileName.length - 1]
          // const regexp = new RegExp(fileType)
          // const isXls = regexp.test(this.accept)
          // console.log(file, fileType, regexp, isXls)
          // const isLt1M = file.size / 1024 / 1024 <= 10
          // if (!isXls) {
          //   this.$message.error('上传文件只能是 pdf/word/excel/ppt/jpg/png 格式!')
          // } else if (!isLt1M) {
          //   this.$message.error('上传文件大小不能超过 10MB!')
          // }
          // return isXls && isLt1M
        },
        action: `/common/file/upload`,
        data: {
          bizId: this.$route.params.id || '',
          // follower: this.follower,
          bizType: 'QA'
        },

        // accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG',
        accept: '',
        showFileList: true,
        fileList: this.fileList,
        limit: 1,
        timeout: 30000,
        content: [
          {
            slot: 'trigger',
            component: uploadSlotTrigger
          }
          // {
          //   slot: 'tip',
          //   component: uploadSlotTip
          // }
        ]
      },
      _attachmentName: {
        prop: 'attachmentName',
        itemType: 'itemview',
        label: '附件',
        itemStyle,
        isShow: true,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          console.log('formDatasformDatasformDatas', formDatas)
          return formDatas.attachmentName ? `<span style="color: #0f89f3;cursor: pointer;"><i class="el-icon-paperclip"></i> ${formDatas.attachmentName}</span>` : ''
        },
        handle: () => {
          this.showFile()
        }
      }
    }

    return {
      commonChangeReg,
      commonBlurReg,
      infoCommon,
      fileList: [],
      ifEdit: false,
      accept: '.xlsx,.xls,.XLSX,.XLS,.ppt,.pptx,.PPT,.PPTX,.pdf,.PDF,.doc,.docx,.DOC,.DOCX,.png,.jpg,.PNG,.JPG'
      // valueOptions: {}
    }
  },
  computed: {

  },
  mounted() {
    // console.log('this.infoData.attachmentName', this.infoData.attachmentName)
    // if (this.infoData.attachmentName) {
    //   this.infoCommon._attachment.className = 'upload-a-info hideButton'
    // }
  },
  methods: {
    async getSelectData(data, prop) {
      const res = await api.getSelectData(data)
      this.$set(this.infoCommon[prop], 'dataSource', res)
    },
    handleSelectChange(v) {
      if (this.pageType !== 'add') this.getInfo(null, true)
      this.$refs.infoForm.form.resetFields()
      // this.infoData = {}
      this.infoData = {
        ...this.infoData,
        yarnUuid: this.infoData.yarnUuid || '',
        yarnCount: '', // 纱支
        ingredients: '', // 成份
        proportion: '100', // 比例
        spinningMethod: '', // 纺纱方法
        cardingMethod: '', // 梳棉方法
        yarnType: '', // 纱类
        supplier: '', // 供应商
        yarnBatch: '', // 纱牌/纱批
        batchNo: '', // 批次号
        stockInNo: '', // 入库单号
        stockOutNo: '', // 出库单号
        relationNo: '', // 关联单号
        actualStorageWeight: '', // 实际入库重量(KG)
        address: '', // 地址
        isPurchased: v,
        skuId: '',
        skuName: ''
      }
      const data2 = this.resContent._tableFormV.dataSource
      for (let i = 0; i < data2.length; i++) {
        data2[i].standardRangeReference = ''
        data2[i].supplierGrade = ''
        data2[i].internalGrade = ''
        data2[i].supplierDetectionResult = ''
        data2[i].internalDetectionResult = ''
      }
      this.initData(v)
    },
    inputTypeChange() {
      return this.ifEdit ? 'input' : 'itemview'
    },
    selectTypeChange() {
      return this.ifEdit ? 'select' : 'itemview'
    },
    showFile() {
      console.log(this.infoData.attachmentPath)
      window.open(this.infoData.attachmentPath)
    },
    // 附件删除
    async deleteAttachment(data = {}) {
      const res = await attachmentDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('附件删除成功')
    },
    // 检查，如果都输入了计算纱线等级的信息，就去计算
    checkIfCalculat(value, form, formDatas, setFormDatas, scope) {
      const tempData = this.$refs.infoForm.form.model
      if (!this.isSaving && tempData.cardingMethod && tempData.ingredients && tempData.proportion && tempData.spinningMethod && tempData.yarnCount) {
        this.yarnCalculationGrade(tempData)
      }
    }
  }

}
