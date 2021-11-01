<template>
  <div class="pop">
    <cs-custom-pop :options="options" />
  </div>
</template>
<script>
import { add, modify, detail } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import label from './label'

const defaultFormDatas = {
  id: '',
  subWastage: 0
}
export default {
  name: 'DetailsPop',
  components: {},
  mixins: [logMethods],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    const validateNumber = (rule, value, callback) => {
      if (/^[0-9]*$/.test(value)) {
        callback()
      } else {
        callback(new Error('只能输入数字'))
      }
    }
    const max100Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,1})|(0{1}))(\.\d{1})?$/, message: '0~99.9', trigger: ['blur'] })
    const max999Regtype = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1})?$/, message: '0~9999999999.9', trigger: ['blur'] })
    return {
      options: {
        itemType: 'drawer',
        visible: false,
        title: '新增',
        okText: '保存',
        ok: params => {
          if (Number(params.weightEnd) <= Number(params.weightIni)) {
            this.$message.error('结束重量必须大于开始重量')
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
        formDatas: defaultFormDatas,
        formOptions: {},
        content: {
          weightRange: { itemType: 'input', prop: 'weightIni', label: label.weightRange, itemStyle: { width: '50%', display: 'inline-block' }, maxlength: 20, disabled: false, clearable: true,
            rules: [commonBlurReg, { validator: validateNumber, trigger: 'blur' }], suffix: '%', placeholder: '请输入正整数' },
          text: {
            itemType: 'view',
            style: { width: '5%', display: 'inline-block', height: '32px', 'line-height': '32px', color: '#666666', padding: '0 0 0 3px' },
            text: '〜'
          },
          weightEnd: { itemType: 'input', prop: 'weightEnd', label: '', labelWidth: '0', itemStyle: { width: '45%', display: 'inline-block' }, maxlength: 20, disabled: false, clearable: true,
            rules: [commonBlurReg, { validator: validateNumber, trigger: 'blur' }], suffix: '%', placeholder: '请输入正整数'
          },
          part: { itemType: 'radio-group', prop: 'part', label: label.part, change: this.radioChange, rules: [commonChangeReg],
            dataSource: label.dict.PORTS
          },
          color: { itemType: 'radio-group', prop: 'color', label: label.color, change: this.radioChange, rules: [commonChangeReg],
            dataSource: label.dict.COLORS
          },
          fixWastage: { itemType: 'input', prop: 'fixWastage', label: label.fixWastage, max: 100, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max100Reg], suffix: '%', placeholder: '只能输入小于100的数字' },
          subWastage: { itemType: 'input', prop: 'subWastage', label: label.subWastage, maxlength: 30, disabled: false, clearable: true, rules: [commonBlurReg, max999Regtype], suffix: 'kg', placeholder: '最多输入10位数字' }
        }
      }
    }
  },
  methods: {
    radioChange() {},
    // 通过id获取信息
    async getInfoById(row = {}) {
      const { code = 0, data = {}} = await detail({ id: row.id })
      if (code === 200) { // 表示成功
        this.options.formDatas = { ...data, fixWastage: this.$filters.numberToPercentage(data.fixWastage) }
      }
    },
    // 更新数据
    async modify(row) {
      const { code = 0, message = '', data = {}} = await modify({ ...row, fixWastage: this.$filters.percentageToNumber(Number(row.fixWastage)), subWastage: Number(row.subWastage), weightEnd: Number(row.weightEnd), weightIni: Number(row.weightIni) })
      if (code === 200) { // 表示成功
        this.$emit('modify', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    // 新增数据
    async add(row) {
      const { code = 0, message = '', data = {}} = await add({ ...row, fixWastage: this.$filters.percentageToNumber(Number(row.fixWastage)), subWastage: Number(row.subWastage), weightEnd: Number(row.weightEnd), weightIni: Number(row.weightIni) })
      if (code === 200) { // 表示成功
        this.$emit('add', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    init(row = {}) {
      this.options.visible = true // 显示弹框
      this.$nextTick(() => { // 在下一次事件循环中处理
        this.options.formDatas = Object.assign({}, defaultFormDatas)
        if (row.id) { // 存在id表示编辑
          this.options.title = '编辑'
          this.getInfoById(row)
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
.suffixClass {
  font-style:normal;
  margin-right: 10px;
  padding-top: 50px
}
.el-input__suffix {
  margin-top: 10px;
}
</style>
