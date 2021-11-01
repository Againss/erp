<template>
  <div class="pop">
    <cs-custom-pop :options="options" />
  </div>
</template>
<script>
import { add, detail, modify, optionConfigSelect } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import label from './label'

export default {
  name: 'DetailsPop',
  components: {},
  mixins: [logMethods],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const max99Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,1})|(0{1}))(\.\d{1})?$/, message: '0~99.9', trigger: ['blur'] })
    const validateNumber = (rule, value, callback) => {
      if (/^[0-9]*$/.test(value)) {
        callback()
      } else {
        callback(new Error('只能输入数字'))
      }
    }
    return {
      options: {
        itemType: 'drawer',
        visible: false,
        title: '新增',
        okText: '保存',
        ok: params => {
          if (Number(params.weightEnd) <= Number(params.weightIni)) {
            this.$message.error('结束数量必须大于开始数量')
            return
          }
          if (params.id) { // 存在id 更新一条记录
            this.modify(params)
          } else { // 不存在id 新增一条记录
            this.add(params)
          }
        },
        beforeClose: (form, formDatas) => {
          this.options.visible = false // 关闭弹框
        },
        cancel: (params) => {
          this.options.visible = false // 关闭弹框
        },
        formDatas: {},
        formOptions: {},
        content: {
          publicErrorInfo: { itemType: 'select', prop: 'publicErrorInfo', label: label.publicErrorInfo, valueType: 'object', filterable: true, disabled: false, rules: [commonBlurReg],
            dataSource: [], visibleChange: (value) => {
              if (value) {
                this.getPublicErrorInfo()
              }
            }
          },
          weightRange: { itemType: 'input', prop: 'weightIni', valueType: 'number', label: label.weightRange, itemStyle: { width: '50%', display: 'inline-block' }, maxlength: 20, disabled: false, clearable: true,
            rules: [commonBlurReg, { validator: validateNumber, trigger: 'blur' }], placeholder: '请输入正整数' },
          text: {
            itemType: 'view',
            style: { width: '5%', display: 'inline-block', height: '32px', 'line-height': '32px', color: '#666666', padding: '0 0 0 3px' },
            text: '〜'
          },
          weightEnd: { itemType: 'input', prop: 'weightEnd', label: '', labelWidth: '0', itemStyle: { width: '45%', display: 'inline-block' }, maxlength: 20, disabled: false, clearable: true,
            rules: [commonBlurReg, { validator: validateNumber, trigger: 'blur' }], suffix: 'kg', placeholder: '请输入正整数'
          },
          wastage: { itemType: 'input', prop: 'wastage', label: label.wastage, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max99Reg], suffix: '%', placeholder: '只能输入小于100的数字' }
        }
      }
    }
  },
  methods: {
    // 获取印染类型 下拉
    async getPublicErrorInfo() {
      const { code = 0, data = [] } = await optionConfigSelect({ fieldName: '走货公差', pageName: '大货订单', enabled: 'Y' })
      if (code === 200) { // 表示成功
        console.log(String(12))
        console.log(typeof String(12))
        this.options.content['publicErrorInfo'].dataSource = data.map(n => ({ label: n.fieldValue, value: String(n.fieldValueId) }))
      }
    },
    // 通过id获取信息
    async getInfoById(id = '') {
      const { code = 0, data = {}} = await detail({ id: id })
      if (code === 200) { // 表示成功
        this.options.formDatas = { ...data, wastage: this.$filters.numberToPercentage(data.wastage) }
      }
    },
    // 更新数据
    async modify(row) {
      const { code = 0, message = '', data = {}} = await modify({ ...row, wastage: this.$filters.percentageToNumber(Number(row.wastage)), weightEnd: Number(row.weightEnd), weightIni: Number(row.weightIni) })
      if (code === 200) { // 表示成功
        this.$emit('modify', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    // 新增数据
    async add(row) {
      const { code = 0, message = '', data = {}} = await add({ ...row, wastage: this.$filters.percentageToNumber(Number(row.wastage)), weightEnd: Number(row.weightEnd), weightIni: Number(row.weightIni) })
      if (code === 200) { // 表示成功
        this.$emit('add', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    init(row = { publicErrorInfo: {}}) {
      this.options.visible = true // 显示弹框
      this.$nextTick(() => { // 在下一次事件循环中处理
        this.options.content['publicErrorInfo'].dataSource = []
        this.options.formDatas = {}
        if (row.id) { // 存在id表示编辑
          this.options.title = '编辑'
          this.options.content['publicErrorInfo'].dataSource.push(row.publicErrorInfo)
          this.getInfoById(row.id)
        } else { // 不存在id表示新增
          this.options.title = '新增'
        }
      })
    }
  }
}
</script>
