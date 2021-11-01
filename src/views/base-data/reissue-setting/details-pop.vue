<template>
  <div class="pop">
    <cs-custom-pop :options="options" />
  </div>
</template>
<script>
import { modify, detail } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import label from './label'

export default {
  name: 'DetailsPop',
  components: {},
  mixins: [logMethods],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const validateDaysSet = (rule, value, callback) => {
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
          if (params.id) { // 存在id 更新一条记录
            this.modify(params)
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
          daysSet: { itemType: 'input', prop: 'daysSet', label: label.daysSet, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, { validator: validateDaysSet, trigger: 'blur' }] }
        }
      }
    }
  },
  methods: {
    // 通过id获取信息
    async getInfoById(id = '') {
      const { code = 0, data = {}} = await detail({ id: id })
      if (code === 200) { // 表示成功
        this.options.formDatas = data
      }
    },
    // 更新数据
    async modify(row) {
      const { code = 0, message = '', data = {}} = await modify({ ...row, daysSet: Number(row.daysSet) })
      if (code === 200) { // 表示成功
        this.$emit('modify', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    init(row = {}) {
      this.options.visible = true // 显示弹框
      this.$nextTick(() => { // 在下一次事件循环中处理
        if (row.id) { // 存在id表示编辑
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
