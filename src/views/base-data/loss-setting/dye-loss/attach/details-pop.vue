<template>
  <div class="pop">
    <cs-custom-pop :options="options" />
  </div>
</template>
<script>
import { add, detail, modify, sysSelectlevel } from './api/index.js'
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
          dyeTechInfo: { itemType: 'select', prop: 'dyeTechInfo', label: label.dyeTechInfo, valueType: 'object', filterable: true, disabled: false, clearable: true, rules: [commonBlurReg],
            dataSource: [], visibleChange: (value) => {
              if (value) {
                this.getDyeTechInfo()
              }
            }
          },
          wastage: { itemType: 'input', prop: 'wastage', label: label.wastage, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max99Reg], suffix: '%', placeholder: '只能输入小于100的数字' }
        }
      }
    }
  },
  methods: {
    // 获取印染类型 下拉
    async getDyeTechInfo() {
      const { code = 0, data = [] } = await sysSelectlevel({ enabled: 'Y' })
      if (code === 200) { // 表示成功
        this.options.content['dyeTechInfo'].dataSource = data.filter(n => !['漂白', '半漂', '洗水', '染色'].includes(n.name)).map(n => ({ label: n.name, value: n.uuid }))
      }
    },
    // 通过id获取信息
    async getInfoById(id = '') {
      const { code = 0, data = { status: '' }} = await detail({ id: id })
      if (code === 200) { // 表示成功
        this.options.formDatas = { ...data, wastage: this.$filters.numberToPercentage(data.wastage) }
      }
    },
    // 更新数据
    async modify(row) {
      const { code = 0, message = '', data = {}} = await modify({ ...row, wastage: this.$filters.percentageToNumber(Number(row.wastage)) })
      if (code === 200) { // 表示成功
        this.$emit('modify', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    // 新增数据
    async add(row) {
      const { code = 0, message = '', data = {}} = await add({ ...row, wastage: this.$filters.percentageToNumber(Number(row.wastage)) })
      if (code === 200) { // 表示成功
        this.$emit('add', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    init(row = { dyeTechInfo: {}}) {
      this.options.visible = true // 显示弹框
      this.$nextTick(() => { // 在下一次事件循环中处理
        this.options.content['dyeTechInfo'].dataSource = []
        this.options.formDatas = {}
        if (row.id) { // 存在id表示编辑
          this.options.content['dyeTechInfo'].dataSource.push(row.dyeTechInfo)
          this.options.title = '编辑'
          this.getInfoById(row.id)
        } else { // 不存在id表示新增
          this.options.title = '新增'
        }
      })
    }
  }
}
</script>
