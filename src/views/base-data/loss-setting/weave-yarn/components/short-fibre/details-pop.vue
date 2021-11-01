<template>
  <div class="pop">
    <cs-custom-pop :options="options" />
  </div>
</template>
<script>
import { add, modify, detail, combinedSelect, assemblyIngredientSelect } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import label from './label'
// import { combinedSelect } from '@/views/basic-data/products-data/combined-components/api/index'
// import { assemblyIngredientSelect } from '@/views/capacity-center/capacity-day/api/selectData'

export default {
  name: 'DetailsPop',
  components: {},
  mixins: [logMethods],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const validateNumber = (rule, value, callback) => {
      if (/^[0-9]*$/.test(value)) {
        callback()
      } else {
        callback(new Error('只能输入数字'))
      }
    }
    const max100Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,1})|(0{1}))(\.\d{1})?$/, message: '0~99.9', trigger: ['blur'] })
    return {
      type: '',
      isPreciseFlow: '',
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
          elementInfo: { itemType: 'select', prop: 'elementInfo', label: label.elementInfo, valueType: 'object', filterable: true, disabled: false, clearable: true, rules: [commonBlurReg],
            dataSource: [],
            visibleChange: (value) => {
              if (value) {
                this.getClassifyInfo()
              }
            }
          },
          weightRange: { itemType: 'input', prop: 'weightIni', label: label.weightRange, itemStyle: { width: '50%', display: 'inline-block' }, maxlength: 20, disabled: false, clearable: true,
            rules: [commonBlurReg, { validator: validateNumber, trigger: 'blur' }], suffix: 'kg', placeholder: '请输入正整数' },
          text: {
            itemType: 'view',
            style: { width: '5%', display: 'inline-block', height: '32px', 'line-height': '32px', color: '#666666', padding: '0 0 0 3px' },
            text: '〜'
          },
          weightEnd: { itemType: 'input', prop: 'weightEnd', label: '', labelWidth: '0', itemStyle: { width: '45%', display: 'inline-block' }, maxlength: 20, disabled: false, clearable: true,
            rules: [commonBlurReg, { validator: validateNumber, trigger: 'blur' }], suffix: 'kg', placeholder: '请输入正整数'
          },
          wastage: { itemType: 'input', prop: 'wastage', label: label.wastage, max: 100, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max100Reg], suffix: '%', placeholder: '请输入小于100的数字' }
        }
      }
    }
  },
  methods: {
    async getClassifyInfo() {
      // 长丝 长纤：取通用基础数据》产品》成份 》成份》【纤细类型】为长纤且启用状态的【成份分类】（去重）
      if (this.type === '1') { // 长丝
        const { code = 0, data = [] } = await combinedSelect({ enabled: 'Y', typical: 'L' })
        if (code === 200) {
          const arr = []
          for (const element of data) {
            // push之前查看在arr中是否存在相同的value值（uuid），存在就略过，不存在就push(去重)
            const values = arr.map(n => n.value) // value 存的是uuid
            if (element.classifications && (element.classifications.uuid || element.classifications.id) && !values.includes(element.classifications ? element.classifications.uuid : element.classifications.id)) {
              arr.push({ label: element.classifications ? element.classifications.name : element.name, value: element.classifications ? element.classifications.uuid : element.classifications.id })
            }
          }
          this.options.content['elementInfo'].dataSource = arr
        }
      } else { // 短纤 取通用基础数据》产品》成份 》成份》【纤细类型】为短纤且启用状态的【损耗分类】+ 取通用基础数据》产品》组合成份》【纤细类型】为短纤且启用状态的【损耗分类】（去重）
        // 并发请求
        Promise.allSettled([combinedSelect({ enabled: 'Y', typical: 'S' }), assemblyIngredientSelect({ enabled: 'Y', typical: 'S' })]).then((res = []) => {
          const arr = []
          if (res.length === 2) {
            const [first = { value: { code: 0, data: [] }}, second = { value: { code: 0, data: [] }}] = res
            if (first.value && first.value.code === 200) { // 第一个请求响应的成功
              for (const element of first.value.data) {
                // push之前查看在arr中是否存在相同的value值（uuid），存在就略过，不存在就push(去重)
                const values = arr.map(n => n.value) // value 存的是uuid
                if (element.wastageCategory && element.wastageCategory.uuid && !values.includes(element.wastageCategory ? element.wastageCategory.uuid : element.id)) {
                  arr.push({ label: element.wastageCategory ? element.wastageCategory.name : element.name, value: element.wastageCategory ? element.wastageCategory.uuid : element.id })
                }
              }
            }
            if (second.value && second.value.code === 200) { // 第二个请求响应的成功
              for (const element of second.value.data) {
                // push之前查看在arr中是否存在相同的value值（uuid），存在就略过，不存在就push(去重)
                const values = arr.map(n => n.value) // value 存的是uuid
                if (element.wastageCategory && element.wastageCategory.uuid && !values.includes(element.wastageCategory ? element.wastageCategory.uuid : element.id)) {
                  arr.push({ label: element.wastageCategory ? element.wastageCategory.name : element.name, value: element.wastageCategory ? element.wastageCategory.uuid : element.id })
                }
              }
            }
          }
          this.options.content['elementInfo'].dataSource = arr
        })
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
      const { code = 0, message = '', data = {}} = await modify({ ...row, wastage: this.$filters.percentageToNumber(Number(row.wastage)), weightEnd: Number(row.weightEnd), weightIni: Number(row.weightIni), type: row.type ? row.type : this.type, isPreciseFlow: row.isPreciseFlow ? row.isPreciseFlow : this.isPreciseFlow })
      if (code === 200) { // 表示成功
        this.$emit('modify', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    // 新增数据
    async add(row) {
      const { code = 0, message = '', data = {}} = await add({ ...row, wastage: this.$filters.percentageToNumber(Number(row.wastage)), weightEnd: Number(row.weightEnd), weightIni: Number(row.weightIni), type: row.type ? row.type : this.type, isPreciseFlow: row.isPreciseFlow ? row.isPreciseFlow : this.isPreciseFlow })
      if (code === 200) { // 表示成功
        this.$emit('add', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    init(row = {}) {
      this.options.visible = true // 显示弹框
      this.$nextTick(() => { // 在下一次事件循环中处理
        this.type = row.type
        this.isPreciseFlow = row.isPreciseFlow
        this.options.content['elementInfo'].dataSource = []
        // 重置表单数据
        this.options.formDatas = {}
        if (row.id) { // 存在id表示编辑
          this.options.title = '编辑'
          this.getInfoById(row.id)
          this.options.content['elementInfo'].dataSource.push(row.elementInfo)
        } else { // 不存在id表示新增
          this.options.title = '新增'
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
