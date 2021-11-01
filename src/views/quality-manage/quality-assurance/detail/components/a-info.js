import * as api from '@/views/quality-manage/common/basisApi.js'
import uploadSlotTrigger from '../common/upload-slot-trigger.vue'
import formCustom from '@/views/quality-manage/public/components/form-custom.vue'
import { attachmentDelete } from '@/views/quality-manage/common/basisApi'
// import proportionItme from '../common/proportion-itme.vue'
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
      _yarnUuid: {
        prop: 'yarnUuid',
        itemType: this.inputTypeChange,
        label: '试纱编号:',
        readonly: true,
        disabled: true,
        itemStyle
      },
      _isPurchased: {
        prop: 'isPurchased',
        itemType: this.selectTypeChange,
        label: '检测类型:',
        itemStyle,
        rules: [commonChangeReg],
        readonly: true,
        disabled: true,
        dataSource: [
          { label: '已采购', value: 1 },
          { label: '未采购', value: 0 }
        ],
        change: (value, form, formDatas, setFormDatas) => {
          this.initData(value)
          console.log(formDatas)
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
            isPurchased: value
          }
          console.log(this.infoData)
          // this.$set(this.infoData, 'isPurchased', value)
        },
        renderContent: (value) => {
          return value === 0 ? '未采购' : '已采购'
        }
      },
      _skuName: {
        prop: 'skuName',
        itemType: this.inputTypeChange,
        label: '产品编号:',
        itemStyle,
        placeholder: '请选择检测产品',
        filterable: true,
        readonly: true,
        disabled: true,
        rules: [commonChangeReg],
        itemClassName: 'choose-product',
        focus: params => {
          this.$set(this.productPopOptions, 'visible', true)
          this.getInOutData()
        },
        // renderContent: (value) => {
        //   return value && value.label
        // },
        isShow: true
      },
      _yarnCount: {
        prop: 'yarnCount',
        itemType: this.selectTypeChange,
        valueType: 'object',
        label: '纱支:',
        readonly: true,
        disabled: true,
        filterable: true,
        clearable: true,
        className: 'commonRemoteSearch',
        itemStyle,
        rules: [],
        dataSource: [],
        placeholder: '',
        select: [api.getSelectData, { enabled: 'Y', categoryId: 9 }],
        visibleChange: (flag) => {
          flag && this.getSelectData({ enabled: 'Y', categoryId: 9 }, '_yarnCount')
        },
        renderContent: (value) => {
          return value && value.label
        }
      },

      _ingredients: {
        prop: 'ingredients',
        itemType: this.selectTypeChange,
        valueType: 'object',
        label: '成份:',
        readonly: true,
        disabled: true,
        filterable: true,
        clearable: true,
        className: 'commonRemoteSearch',
        itemStyle,
        rules: [],
        placeholder: '',
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
          // this.changeProportion(tempValue)
        },
        renderContent: (value) => {
          return value && value.label
        }

      },
      // _proportion: {
      //   components: {
      //     proportionItme
      //   },
      //   disabled: true,
      //   readonly: true,
      //   itemType: this.inputTypeChange
      // },
      _proportion: {
        prop: 'proportion',
        popoverOptions: {
          // placement: 'bottom'
        },
        // showMessage: false,
        itemType: this.inputTypeChange,
        itemStyle,
        label: '比例:',
        readonly: true,
        disabled: true,
        placeholder: '',
        rules: [commonChangeReg],
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
        readonly: true,
        disabled: true,
        filterable: true,
        clearable: true,
        className: 'commonRemoteSearch',
        itemStyle,
        rules: [],
        placeholder: '',
        dataSource: [],
        select: [api.getSelectData, { enabled: 'Y', categoryId: 2 }],
        visibleChange: (flag) => {
          flag && this.getSelectData({ enabled: 'Y', categoryId: 2 }, '_spinningMethod')
        },
        renderContent: (value) => {
          return value && value.label
        }
      },
      _cardingMethod: {
        prop: 'cardingMethod',
        itemType: this.selectTypeChange,
        valueType: 'object',
        label: '梳棉方法:',
        readonly: true,
        disabled: true,
        filterable: true,
        clearable: true,
        className: 'commonRemoteSearch',
        itemStyle,
        rules: [],
        placeholder: '',
        dataSource: [],
        select: [api.getSelectData, { enabled: 'Y', categoryId: 3 }],
        visibleChange: (flag) => {
          flag && this.getSelectData({ enabled: 'Y', categoryId: 3 }, '_cardingMethod')
        },
        renderContent: (value) => {
          return value && value.label
        }
      },
      _yarnType: {
        prop: 'yarnType',
        itemType: this.selectTypeChange,
        valueType: 'object',
        label: '纱类:',
        readonly: false,
        disabled: false,
        filterable: true,
        clearable: true,
        className: 'commonRemoteSearch',
        itemStyle,
        rules: [],
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
        rules: [],
        readonly: true,
        disabled: true,
        filterable: true,
        clearable: true,
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
        itemStyle,
        itemClassName: '',
        placeholder: '',
        maxlength: 50
      },
      _batchNo: {
        prop: 'batchNo',
        itemType: this.inputTypeChange,
        label: '批次号:',
        readonly: true,
        disabled: true,
        itemStyle,
        isShow: true,
        placeholder: ''
      },
      _stockInNo: {
        prop: 'stockInNo',
        itemType: this.inputTypeChange,
        label: '入库单号:',
        readonly: true,
        disabled: true,
        itemStyle,
        isShow: true,
        placeholder: ''
      },
      _stockOutNo: {
        prop: 'stockOutNo',
        itemType: this.inputTypeChange,
        label: '出库单号:',
        readonly: true,
        disabled: true,
        itemStyle,
        isShow: true,
        placeholder: ''
      },
      _relationNo: {
        prop: 'relationNo',
        itemType: this.inputTypeChange,
        label: '关联单号:',
        readonly: true,
        disabled: true,
        itemStyle,
        isShow: true,
        placeholder: ''
      },
      _actualStorageWeight: {
        prop: 'actualStorageWeight',
        itemType: this.inputTypeChange,
        label: '实际入库重量(KG):',
        readonly: true,
        disabled: true,
        itemStyle,
        isShow: true,
        placeholder: ''
      },
      _address: {
        prop: 'address',
        itemType: this.inputTypeChange,
        label: '地址:',
        readonly: true,
        disabled: true,
        itemStyle,
        isShow: true,
        placeholder: ''
      },
      _dyeingFactory: {
        prop: 'dyeingFactory',
        itemType: this.selectTypeChange,
        valueType: 'object',
        filterable: true,
        label: '染厂:',
        itemStyle,
        className: 'commonRemoteSearch',
        clearable: true,
        readonly: true,
        disabled: true,
        rules: [commonChangeReg],
        dataSource: [],
        placeholder: '请选择',
        select: [api.getSupplier, {
          supplierType: '10001'
        }],
        visibleChange: (flag) => {
          flag && api.getSupplier({
            supplierType: '10001'
          }).then(res => {
            this.$set(this.infoCommon._dyeingFactory, 'dataSource', res)
          })
        },
        renderContent: (value) => {
          return value && value.label
        }
      },
      _commissioner: {
        prop: 'commissioner',
        itemType: this.selectTypeChange,
        valueType: 'object',
        valueKey: 'value',
        filterable: true,
        label: '试纱专员:',
        itemStyle,
        placeholder: '请选择',
        className: 'commonRemoteSearch',
        clearable: true,
        readonly: true,
        disabled: true,
        rules: [commonChangeReg],
        dataSource: [],
        select: [api.getUserData, { requireDataGroupFlag: 1, requireOrgFlag: 1 }],
        visibleChange: (flag) => {
          flag && api.getUserData({ requireDataGroupFlag: 1, requireOrgFlag: 1 }).then(res => {
            this.$set(this.infoCommon._commissioner, 'dataSource', res)
          })
        },
        renderContent: (value) => {
          return value && value.label
        }
      },
      _colorName: {
        prop: 'colorName',
        itemType: this.selectTypeChange,
        valueType: 'object',
        valueKey: 'value',
        label: '试染颜色:',
        placeholder: '请选择',
        itemStyle,
        className: 'commonRemoteSearch',
        filterable: true,
        clearable: true,
        multiple: true,
        disabled: true,
        readonly: true,
        rules: [commonChangeReg],
        dataSource: [],
        select: [api.dyeColorTestConfig],
        visibleChange: (flag) => {
          flag && api.dyeColorTestConfig().then(res => {
            console.log(res)
            this.$set(this.infoCommon._colorName, 'dataSource', res)
          })
        },
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
      _attachment: {
        prop: 'attachment',
        itemType: 'upload',
        label: '附件:',
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
          this.infoCommon._attachment.className = 'upload-a-info hideButton'
        },
        onError: (res, file) => {
          // console.log(res, file)
        },
        onExceed: (files, fileList) => {
          this.$message.warning(`当前限制选择 1 个文件`)
        },
        beforeRemove: (file, fileList) => {
          console.log('beforeRemove', file, fileList)
          return this.accept.indexOf(file.name.split('.')[file.name.split('.').length - 1]) !== -1 ? this.$confirm(`确定移除 ${file.name}？`).then(() => {
            this.infoCommon._attachment.className = 'upload-a-info'
            this.infoData = {
              attachment: [],
              attachmentName: '',
              attachmentPath: ''
            }
          }) : true
        },
        beforeUpload: (file) => {

        },
        action: `/common/file/upload`,
        data: {
          bizId: this.id || '',
          bizType: 'QA'
        },

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
        ]
      },
      _attachmentName: {
        prop: 'attachmentName',
        itemType: 'itemview',
        label: '附件:',
        itemStyle,
        isShow: false,
        renderContent: (value, options, form, formDatas, setFormDatas, scope) => {
          return formDatas.attachmentName ? `<span style="color: #0f89f3;cursor: pointer;"><i class="el-icon-paperclip"></i> ${formDatas.attachmentName}</span>` : ''
        },
        handle: () => {
          this.showFile()
        }

      },
      _remarks: {
        prop: 'remarks',
        itemType: this.inputTypeChange,
        label: '备注:',
        itemClassName: 'yarn-batch',
        placeholder: '',
        title: true,
        maxlength: 500,
        itemStyle: { ...itemStyle, 'width': '60%' }
      }

    }

    return {
      commonChangeReg,
      commonBlurReg,
      infoCommon,
      fileList: [],
      valueOptions: {},
      ifEdit: false
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    async getSelectData(data, prop) {
      const res = await api.getSelectData(data)
      this.$set(this.infoCommon[prop], 'dataSource', res)
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
    }
  }

}
