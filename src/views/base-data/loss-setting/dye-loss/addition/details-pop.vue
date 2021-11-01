<template>
  <div class="pop">
    <cs-custom-pop :options="options" />
  </div>
</template>
<script>
import { add, detail, modify } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import { attributeCombiningPopOpData } from '@/views/basic-data/products-data/yarn-attribute/api/index'
import label from './label'

export default {
  name: 'DetailsPop',
  components: {},
  mixins: [logMethods],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const max99Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,1})|(0{1}))(\.\d{1})?$/, message: '0~99.9', trigger: ['blur'] })
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
        formDatas: {},
        formOptions: {},
        content: {
          cardingMethodInfo: { itemType: 'select', prop: 'cardingMethodInfo', label: label.cardingMethodInfo, valueType: 'object', filterable: true, disabled: false, clearable: true, rules: [commonBlurReg],
            dataSource: [], visibleChange: (value) => {
              if (value) {
                this.getCardingMethodInfo()
              }
            }
          },
          tc: { itemType: 'input', prop: 'tc', label: label.tc, itemStyle: { width: '100%', display: 'inline-block' }, maxlength: 20, disabled: false, clearable: true,
            rules: [commonBlurReg, max99Reg], suffix: '%', placeholder: '只能输入小于100的数字' },
          cvc: { itemType: 'input', prop: 'cvc', label: label.cvc, itemStyle: { width: '100%', display: 'inline-block' }, maxlength: 20, disabled: false, clearable: true,
            rules: [commonBlurReg, max99Reg], suffix: '%', placeholder: '只能输入小于100的数字'
          },
          cotton: { itemType: 'input', prop: 'cotton', label: label.cotton, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max99Reg], suffix: '%', placeholder: '只能输入小于100的数字' }
        }
      }
    }
  },
  methods: {
    // 获取梳棉方式 下拉
    async getCardingMethodInfo() {
      const { code = 0, data = [] } = await attributeCombiningPopOpData({ enabled: 'Y', categoryId: 3 })
      if (code === 200) { // 表示成功
        this.options.content['cardingMethodInfo'].dataSource = data.map(n => ({ label: n.name, value: n.uuid }))
      }
    },
    // 通过id获取信息
    async getInfoById(id = '') {
      const { code = 0, data = {}} = await detail({ id: id })
      if (code === 200) { // 表示成功
        this.options.formDatas = { ...data, tc: this.$filters.numberToPercentage(data.tc), cvc: this.$filters.numberToPercentage(data.cvc), cotton: this.$filters.numberToPercentage(data.cotton) }
      }
    },
    // 更新数据
    async modify(row) {
      const { code = 0, message = '', data = {}} = await modify({ ...row, tc: this.$filters.percentageToNumber(Number(row.tc)), cvc: this.$filters.percentageToNumber(Number(row.cvc)), cotton: this.$filters.percentageToNumber(Number(row.cotton)) })
      if (code === 200) { // 表示成功
        this.$emit('modify', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    // 新增数据
    async add(row) {
      const { code = 0, message = '', data = {}} = await add({ ...row, tc: this.$filters.percentageToNumber(Number(row.tc)), cvc: this.$filters.percentageToNumber(Number(row.cvc)), cotton: this.$filters.percentageToNumber(Number(row.cotton)) })
      if (code === 200) { // 表示成功
        this.$emit('add', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    init(row = { cardingMethodInfo: {}}) {
      this.options.visible = true // 显示弹框
      this.$nextTick(() => { // 在下一次事件循环中处理
        this.options.content['cardingMethodInfo'].dataSource = []
        this.options.formDatas = {}
        if (row.id) { // 存在id表示编辑
          this.options.title = '编辑'
          this.options.content['cardingMethodInfo'].dataSource.push(row.cardingMethodInfo)
          this.getInfoById(row.id)
        } else { // 不存在id表示新增
          this.options.title = '新增'
        }
      })
    }
  }
}
</script>
