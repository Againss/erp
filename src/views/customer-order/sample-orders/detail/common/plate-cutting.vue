<!--
 * @Author: xj
 * @Description: 剪版要求弹窗
 * @Date: 2021-06-26 09:35:01
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-13 13:43:34
 * @FilePath: d:\yangban\src\views\customer-order\sample-orders\detail\common\plate-cutting.vue
-->
<template>
  <div class="pop">
    <cs-custom-pop ref="shearingRequirementsPop" :options="shearingRequirementsPopOptions" edit-type="pop" />
  </div>
</template>

<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
import { inputFilter } from '@/views/customer-order/public/api/inputFilter'
import { detailFun } from '@/views/customer-order/sample-orders/detail/api/detailFun'
export default {
  components: {},
  mixins: [PublicCustomer, detailFun],
  props: {
    rule: {
      type: Object,
      default: () => ({})
    },
    plateData: {
      type: Object
    },
    plateIndexFrom: {
      type: Object
    },
    popDataFun: {
      type: Function
    },
    unitOptions: { // 单位
      type: [Array]
    },
    rules: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 最大999.99正则
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '0~999.99', trigger: ['blur'] })
    // 剪版要求弹窗内容
    const shearingRequirementsContent = {
      _code: {
        prop: 'code',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '4%' },
        label: '序号',
        disabled: true,
        clearable: true
      },
      _type: {
        prop: 'type',
        itemType: 'select',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '0%' },
        label: '类型',
        clearable: true,
        valueType: 'object',
        itemProp: 'type',
        rules: [commonChangeReg],
        visibleChange: value => {
          this.getOptionConfigSelect({ pageName: '', fieldName: '剪板要求类型' }, 'type')
        },
        dataSource: []
      },
      _quantity: {
        prop: 'quantity',
        itemType: 'input',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '4%' },
        label: '数量',
        trim: (val) => { return inputFilter(val) },
        itemProp: 'quantity',
        placeholder: '请输入0~999.99',
        rules: [commonBlurReg, max999Reg],
        clearable: true
      },
      _unit: {
        prop: 'unit',
        itemType: 'select',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '0%' },
        label: '单位',
        itemProp: 'unit',
        clearable: true,
        valueType: 'object',
        rules: [commonChangeReg],
        visibleChange: () => {
          this.$set(this.shearingRequirementsContent._unit, 'dataSource', this.unitOptions)
        },
        dataSource: []
      }
    }
    const quantityAdd = (params, form) => {
      this.$refs.shearingRequirementsPop.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          this.AddFromData(params, 2)
          this.$message({ type: 'success', message: '添加成功，请继续添加' })
          this.$nextTick(() => {
            this.popForm.resetFields()
            this.$set(this.shearingRequirementsPopOptions, 'formDatas', {})
          })
        }
      })
    }

    // 剪版要求弹窗配置
    const shearingRequirementsPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新增剪版要求',
      okText: '确定',
      ok: params => {
        this.AddFromData(params, 1)
        this.popHandle('', 'shearingRequirements')
      },
      saveAndaddText: '继续添加',
      saveAndadd: quantityAdd,
      cancel: params => {
        this.popHandle('', 'shearingRequirements')
      },
      formDatas: {},
      formOptions: {
        getForm: (form) => {
          this.popForm = form
        }
      },
      content: shearingRequirementsContent
    }
    return {
      shearingRequirementsPopOptions,
      shearingRequirementsContent,
      quantityAdd
    }
  },
  watch: {
    plateData: {
      handler(val, oldVal) {
        // this.setshearingRequirementsData(val)
      },
      deep: true,
      immediate: true
    },
    plateIndexFrom: {
      handler(val, oldVal) {
        this.IndexFrom(val)
      },
      deep: true,
      immediate: true
    },
    rules: {
      handler(v) {},
      deep: true
    }
  },
  mounted() {
    this.$set(this.shearingRequirementsContent._unit, 'dataSource', this.unitOptions)
  },
  methods: {
    // 编辑数据设置
    IndexFrom(data) {
      const Tim = this.shearingRequirementsPopOptions.content
      this.$set(Tim._type, 'dataSource', data.type && data.type.value ? [data.type] : '')
      this.$set(Tim._unit, 'dataSource', data.unit && data.unit.value ? [data.unit] : '')
      this.$nextTick(() => { this.$set(this.shearingRequirementsPopOptions, 'formDatas', data) })
    },
    AddFromData(params) {
      if (this.shearingRequirementsPopOptions.title === '新增剪版要求') {
        const obj = { ...params, IndexEdt: 'add' }
        this.popDataFun('plateCutting', obj,)
      } else {
        const obj = { ...params, IndexEdt: 'edt' }
        this.popDataFun('plateCutting', obj)
      }
    },
    // 剪板要求、条纹间距、数量交期弹窗显隐
    popHandle(val, type) {
      this.$set(this[`${type}PopOptions`], 'visible', !this[`${type}PopOptions`].visible)
      if (val) {
        this.$set(this[`${type}PopOptions`], 'title', val)
        if (val === '编辑剪版要求') {
          this.encryptFn(this.shearingRequirementsContent, this.rules, 'edit')
          this.$set(this.shearingRequirementsPopOptions, 'saveAndadd', null)
        }
      }
      if (this[`${type}PopOptions`].visible) {
        this.encryptFn(this[`${type}Content`], this.rules, val && val.startsWith('新增') && 'add' || 'edit')
      }
      this.$set(this[`${type}PopOptions`], 'content', this[`${type}Content`])
      this.$set(this[`${type}PopOptions`], 'formDatas', {})
    },

    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'type') { // 剪板要求类型
          this.$set(this.shearingRequirementsContent._type, 'dataSource', res)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
