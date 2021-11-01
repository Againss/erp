<template>
  <div class="pop">
    <cs-custom-pop :options="options" />
  </div>
</template>
<script>
import { add, detail, modify, sysDataGroupSelect, sysSelectlevel } from './api/index.js'
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
    const max999Regtype = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,4})?$/, message: '0~9999999999.9', trigger: ['blur'] })
    return {
      options: {
        itemType: 'drawer',
        visible: false,
        title: '新增',
        okText: '保存',
        ok: params => {
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
        formDatas: {
          printDyeTypeInfo: {},
          techInfo: {},
          isBlack: '0' // 默认给选中否
        },
        formOptions: {},
        content: {
          printDyeTypeInfo: { itemType: 'select', prop: 'printDyeTypeInfo', label: label.printDyeTypeInfo, valueType: 'object', filterable: true, disabled: false, clearable: true, rules: [commonBlurReg],
            dataSource: [], visibleChange: (value) => {
              if (value) {
                this.getPrintDyeTypeInfo()
              }
            }
          },
          techInfo: { itemType: 'select', prop: 'techInfo', label: label.techInfo, valueType: 'object', filterable: true, disabled: false, clearable: true, rules: [commonBlurReg],
            dataSource: [], visibleChange: (value) => {
              if (value) {
                this.getTechInfo()
              }
            } },
          color: { itemType: 'select', prop: 'color', label: label.color, rules: [commonBlurReg], change: (value, form, formDatas, setFormDatas, scope) => {
            if (value === '深') { // 选择的是深，显示 是否黑色选项 否则隐藏
              this.options.content['isBlack'].isShow = true
              setFormDatas({ isBlack: '0' })
            } else {
              setFormDatas({ isBlack: '0' })
              this.options.content['isBlack'].isShow = false
            }
          },
          dataSource: label.dict.COLORS
          },
          isBlack: { itemType: 'radio-group', prop: 'isBlack', label: label.isBlack, isShow: false, maxlength: 30, disabled: false, dataSource: label.dict.IS_BLACKS },
          tc: { itemType: 'input', prop: 'tc', label: label.tc, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max99Reg], suffix: '%', placeholder: '只能输入小于100的数字' },
          cvc: { itemType: 'input', prop: 'cvc', label: label.cvc, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max99Reg], suffix: '%', placeholder: '只能输入小于100的数字' },
          cotton: { itemType: 'input', prop: 'cotton', label: label.cotton, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max99Reg], suffix: '%', placeholder: '只能输入小于100的数字' },
          cottonViscose: { itemType: 'input', prop: 'cottonViscose', label: label.cottonViscose, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max99Reg], suffix: '%', placeholder: '只能输入小于100的数字' },
          pureChemical: { itemType: 'input', prop: 'pureChemical', label: label.pureChemical, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max99Reg], suffix: '%', placeholder: '只能输入小于100的数字' },
          subWastage: { itemType: 'input', prop: 'subWastage', label: label.subWastage, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max999Regtype], suffix: 'kg', placeholder: '最多输入10位数字' }
        }
      }
    }
  },
  methods: {
    // 获取印染类型 下拉
    async getPrintDyeTypeInfo() {
      const { code = 0, data = {}} = await sysDataGroupSelect({ enabled: 'Y' })
      if (code === 200) { // 表示成功
        this.options.content['printDyeTypeInfo'].dataSource = data.map(n => ({ label: n.name, value: n.uuid }))
      }
    },
    async getTechInfo() {
      const { code = 0, data = {}} = await sysSelectlevel({ enabled: 'Y' })
      if (code === 200) { // 表示成功
        this.options.content['techInfo'].dataSource = data.filter(n => ['漂白', '半漂', '洗水', '染色'].includes(n.name)).map(n => ({ label: n.name, value: n.uuid }))
      }
    },
    // 通过id获取信息
    async getInfoById(id = '') {
      const { code = 0, data = {}} = await detail({ id: id })
      if (code === 200) { // 表示成功
        this.options.formDatas = { ...data, tc: this.$filters.numberToPercentage(data.tc), cvc: this.$filters.numberToPercentage(data.cvc), cotton: this.$filters.numberToPercentage(data.cotton),
          cottonViscose: this.$filters.numberToPercentage(data.cottonViscose), pureChemical: this.$filters.numberToPercentage(data.pureChemical) }
      }
    },
    // 更新数据
    async modify(row) {
      const { code = 0, message = '', data = {}} = await modify({ ...row, tc: this.$filters.percentageToNumber(Number(row.tc)), cvc: this.$filters.percentageToNumber(Number(row.cvc)), cotton: this.$filters.percentageToNumber(Number(row.cotton)),
        cottonViscose: this.$filters.percentageToNumber(Number(row.cottonViscose)), pureChemical: this.$filters.percentageToNumber(Number(row.pureChemical)), subWastage: Number(row.subWastage) })
      if (code === 200) { // 表示成功
        this.$emit('modify', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    // 新增数据
    async add(row) {
      const { code = 0, message = '', data = {}} = await add({ ...row, tc: this.$filters.percentageToNumber(Number(row.tc)), cvc: this.$filters.percentageToNumber(Number(row.cvc)), cotton: this.$filters.percentageToNumber(Number(row.cotton)),
        cottonViscose: this.$filters.percentageToNumber(Number(row.cottonViscose)), pureChemical: this.$filters.percentageToNumber(Number(row.pureChemical)), subWastage: Number(row.subWastage) })
      if (code === 200) { // 表示成功
        this.$emit('add', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    init(row = { printDyeTypeInfo: {}, techInfo: {}, color: {}}) {
      this.options.visible = true // 显示弹框
      this.$nextTick(() => { // 在下一次事件循环中处理
        this.options.content['printDyeTypeInfo'].dataSource = []
        this.options.content['techInfo'].dataSource = []
        this.options.formDatas = {}
        this.options.content['isBlack'].isShow = false
        if (row.id) { // 存在id表示编辑
          this.options.title = '编辑'
          this.options.content['printDyeTypeInfo'].dataSource.push(row.printDyeTypeInfo)
          this.options.content['techInfo'].dataSource.push(row.techInfo)
          this.getInfoById(row.id).then(() => {
            // 如果颜色是深 显示 是否黑色选项
            if (this.options.formDatas.color === '深') {
              this.options.content['isBlack'].isShow = true
            }
          })
        } else { // 不存在id表示新增
          this.options.title = '新增'
        }
      })
    }
  }
}
</script>
