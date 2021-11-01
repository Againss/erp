<template>
  <div class="pop">
    <cs-custom-pop :options="options" />
  </div>
</template>
<script>
import { add, modify, detail } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import { sysSelectHscode } from '@/views/basic-data/param-config/hs_code/api/index.js'
import label from './label'

export default {
  name: 'DetailsPop',
  components: {},
  mixins: [logMethods],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const max100Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,1})|(0{1}))(\.\d{1})?$/, message: '0~99.9', trigger: ['blur'] })
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
          clothPropertyInfo: { itemType: 'select', prop: 'clothPropertyInfo', label: label.clothPropertyInfo, filterable: true, disabled: false, valueType: 'object', clearable: true, rules: [commonBlurReg],
            dataSource: [],
            visibleChange: (value) => {
              if (value) {
                this.getClothPropertyInfo()
              }
            }
          },
          wastage: { itemType: 'input', prop: 'wastage', label: label.wastage, max: 100, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max100Reg], suffix: '%', placeholder: '请输入小于100的数字' }
        }
      }
    }
  },
  methods: {
    // 获取布属性 取通用基础数据》产品》织染方式》启用状态的【中文名】
    async getClothPropertyInfo() {
      const { code = 0, data = [] } = await sysSelectHscode({ enabled: 'Y' })
      if (code === 200) {
        this.options.content['clothPropertyInfo'].dataSource = data.map(n => ({ label: n.name, value: n.uuid }))
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
    init(row = {}) {
      this.options.visible = true // 显示弹框
      this.$nextTick(() => { // 在下一次事件循环中处理
        this.options.content['clothPropertyInfo'].dataSource = []
        if (row.id) { // 存在id表示编辑
          this.options.title = '编辑'
          this.getInfoById(row.id)
          this.options.content['clothPropertyInfo'].dataSource.push(row.clothPropertyInfo)
        } else { // 不存在id表示新增
          this.options.title = '新增'
          // 重置表单数据
          this.options.formDatas = {}
        }
      })
    }
  }
}
</script>
<style scoped>
.yarn-style{
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 300px;
  white-space: nowrap;
  color: #666666;
}
</style>
