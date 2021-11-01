<template>
  <div class="pop">
    <!-- 新增剪样 -->
    <cs-custom-pop :options="options" />
    <!-- 选择产品编码的弹框 -->
    <productCodePop ref="productCodePop" @save="submitForm" />
  </div>
</template>
<script>
import { unitSelect } from '../api/index.js'
import productCodePop from './productCode-pop'
import LABEL from './label'

export default {
  name: 'CutSampleRequirementsPop',
  components: { productCodePop },
  mixins: [],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const commonChangeReg = this.$getRules({ trigger: ['input'] })
    const max100Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/, message: '0~99999999.99', trigger: ['blur'] })
    const saveAndadd = (params, form) => {
      if (!params.productCode) {
        this.$message({ message: '产品编码不能为空', type: 'warning' })
        return
      }
      if (!params.cutClothQuantity) {
        this.$message({ message: '剪布数量不能为空', type: 'warning' })
        return
      }
      const pattern = /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/
      if (!pattern.test(params.cutClothQuantity)) {
        this.$message({ message: '剪布数量范围0~99999999.99', type: 'warning' })
        return
      }
      // const flag = this.validUniqueness(params) // true:表示验证不通过
      // if (flag) return
      this.$emit('save', params)
      this.options.formDatas = {} // 清空数据
      this.getUnitSelect(true)
    }
    return {
      saveAndadd,
      cutSampleRequirements: [],
      options: {
        itemType: 'drawer',
        visible: false,
        title: '新增',
        okText: '保存',
        // size: '40%',
        ok: params => {
          // const flag = this.validUniqueness(params) // true:表示验证不通过
          // if (flag) return
          this.$emit('save', params)
          this.options.formDatas = {} // 清空数据
          this.options.visible = false // 关闭弹框
        },
        saveAndaddText: '确定，继续添加',
        saveAndadd: saveAndadd,
        beforeClose: (form, formDatas) => {
          this.options.formDatas = {} // 清空数据
          this.options.visible = false // 关闭弹框
        },
        cancel: (params) => {
          this.options.formDatas = {} // 清空数据
          this.options.visible = false // 关闭弹框
        },
        formDatas: {},
        formOptions: {},
        content: {
          _productCode: { prop: 'productCode', itemType: 'input', className: 'cursorHandel', showOverflowTooltip: true, label: LABEL.productCode, width: '140px',
            placeholder: '点击弹框', rules: [commonChangeReg],
            clear: (form, formDatas, setFormDatas, scope) => {
              this.$nextTick(() => {
              })
            },
            focus: (event, form, formDatas, setFormDatas, scope) => {
              // 显示弹框
              event.target.blur()
              this.$nextTick(() => {
                this.$refs['productCodePop'].init()
              })
            }
          },
          _yarnInfo: { itemType: 'input', prop: 'yarnInfo', label: LABEL.yarnInfo, disabled: true, clearable: true, placeholder: LABEL.validator.yarnInfo },
          _productInfo: { itemType: 'input', prop: 'productInfo', label: LABEL.productInfo, disabled: true, clearable: true, placeholder: LABEL.validator.productInfo },
          _sourceNumber: { itemType: 'input', prop: 'sourceNumber', label: LABEL.sourceNumber, itemStyle: { width: '100%', display: 'inline-block' }, disabled: true, clearable: true, placeholder: LABEL.validator.sourceNumber },
          _cylinderNumber: { itemType: 'input', prop: 'cylinderNumber', label: LABEL.cylinderNumber, itemStyle: { width: '100%', display: 'inline-block' }, disabled: true, clearable: true, placeholder: LABEL.validator.cylinderNumber },
          _barcode: { itemType: 'input', prop: 'barcode', label: LABEL.barcode, itemStyle: { width: '100%', display: 'inline-block' }, disabled: true, clearable: true, placeholder: LABEL.validator.barcode },
          _storageLocation: { itemType: 'input', prop: 'storageLocation', label: LABEL.storageLocation, itemStyle: { width: '100%', display: 'inline-block' }, disabled: true, clearable: true, placeholder: LABEL.validator.storageLocation },
          _availableQuantity: { itemType: 'input', prop: 'availableQuantity', label: LABEL.availableQuantity, itemStyle: { width: '100%', display: 'inline-block' }, disabled: true, clearable: true, placeholder: LABEL.validator.availableQuantity },
          _sellerTeam: { itemType: 'select', prop: 'sellerTeam', valueType: 'object', label: LABEL.sellerTeam, itemStyle: { width: '100%', display: 'inline-block' }, disabled: true, clearable: true, dataSource: [], placeholder: LABEL.validator.sellerTeam },
          _cutClothQuantity: { itemType: 'input', prop: 'cutClothQuantity', rules: [commonBlurReg, max100Reg], label: LABEL.cutClothQuantity, itemStyle: { width: '70%', display: 'inline-block' }, clearable: true, placeholder: LABEL.validator.cutClothQuantity,
            change: (value, form, formDatas, setFormDatas) => {
              // this.computeAuxiliaryQuantity(value, formDatas, setFormDatas)
              this.computeAuxiliaryQuantity(value, '1')
            }
          },
          _unit: { itemType: 'select', prop: 'unit', label: '', valueType: 'object', labelWidth: '5px', itemStyle: { width: '30%', display: 'inline-block' }, placeholder: LABEL.validator.unit, dataSource: [],
            visibleChange: (value, unit, form, formDatas, setFormDatas) => {
              if (value) {
                if (!formDatas.cutClothQuantity) {
                  this.$message({ message: '请填写剪布数量', type: 'warning' })
                }
                this.getUnitSelect()
              }
            },
            change: (value, form, formDatas, setFormDatas) => {
              // this.computeAuxiliaryQuantity(value, formDatas, setFormDatas)
              this.computeAuxiliaryQuantity(value, '0')
            }
          },
          _auxiliaryQuantity: { itemType: 'input', prop: 'auxiliaryQuantity', label: LABEL.auxiliaryQuantity, itemStyle: { width: '100%', display: 'inline-block' }, disabled: true, placeholder: LABEL.validator.auxiliaryQuantity },
          _cutSampleRequirements: { itemType: 'input', type: 'textarea', maxlength: 300, prop: 'cutSampleRequirements', label: LABEL.cutSampleRequirements, clearable: true, placeholder: LABEL.validator.cutSampleRequirements,
            change: (value, form, formDatas, setFormDatas) => {
              this.options.formDatas = { cutSampleRequirements: value }
            }
          }
        }
      }
    }
  },
  methods: {
    // 验证: 来源单号+缸号+条码号作为唯一条件限制不可重复添加
    validUniqueness(params) {
      // 1. 申请单增加分录时，按照来源单号+缸号+条码号作为唯一条件限制不可重复添加
      // 1. 新增的时候 params不存在index的 直接判断 来源单号+缸号+条码号是否相同
      // 2. 编辑的时候 params存在index的 分以下两种情况判断
      // 2.1 编辑是当前条记录的时候  index是相同的 不需要判断 来源单号+缸号+条码号是否相同
      // 2.2 编辑是其它条记录的时候 index是不相同的 需要判断 来源单号+缸号+条码号是否相同
      const rows = this.cutSampleRequirements.filter(n => {
        if (params.id || params.index) { // 存在id或index 表示编辑  id：后端生成 index：前端生成
          if (params.id) {
            if (params.id === n.id) { // 2.1 编辑是当前条记录的时候  index是相同的 不需要判断 来源单号+缸号+条码号是否相同
            }
            if (params.id !== n.id) { // 2.2 编辑是其它条记录的时候 index是不相同的 需要判断 来源单号+缸号+条码号是否相同
              if (n.sourceNumber === params.sourceNumber && n.cylinderNumber === params.cylinderNumber && n.barcode === params.barcode) {
                return true
              }
            }
          }
          if (params.index) {
            if (params.index === n.index) { // 2.1 编辑是当前条记录的时候  index是相同的 不需要判断 来源单号+缸号+条码号是否相同
            }
            if (params.index !== n.index) { // 2.2 编辑是其它条记录的时候 index是不相同的 需要判断 来源单号+缸号+条码号是否相同
              if (n.sourceNumber === params.sourceNumber && n.cylinderNumber === params.cylinderNumber && n.barcode === params.barcode) {
                return true
              }
            }
          }
        } else { // 表示新增
          if (n.sourceNumber === params.sourceNumber && n.cylinderNumber === params.cylinderNumber && n.barcode === params.barcode) {
            return true
          }
        }
      })
      if (rows.length) {
        this.$message({ message: '来源单号,缸号,条码号已存在不能重复添加', type: 'warning' })
        return true
      }
    },
    // 计算辅助数量 依赖于 单位 剪布数量 成品幅宽 成品克重 只要这四个其中一个有变化，都需要重新计算辅助数量
    computeAuxiliaryQuantity(value = {}, type = '') { // type 0：单位的改变 1：剪布数量的改变 2：成品幅宽的改变 3：成品克重的改变
      if (!value) {
        // setFormDatas({ auxiliaryQuantity: '' })
        this.options.formDatas = Object.assign({}, this.options.formDatas, { auxiliaryQuantity: '' })
      }
      const units = ['磅', '码', '米', '千克'] // toFixed(2)：保留两位小数 四舍五入
      if (typeof value === 'object' && type === '0') { // 单位的改变
        if (value && value.label === units[0]) { // 磅 辅助数量=数量/2.2046
          // setFormDatas({ unit: value, auxiliaryQuantity: (Number(formDatas.cutClothQuantity || 0) / 2.2046).toFixed(2) })
          this.options.formDatas = Object.assign({}, this.options.formDatas, { unit: value, auxiliaryQuantity: (Number(this.options.formDatas.cutClothQuantity || 0) / 2.2046).toFixed(2) })
        }
        if (value && value.label === units[1]) { // 码 辅助数量=数量*成品幅宽*成品克重*0.00081925/16/2.2046
          // setFormDatas({ unit: value, auxiliaryQuantity: (Number(formDatas.cutClothQuantity || 0) * Number(formDatas.suggestWidth || 0) * Number(formDatas.suggestWeight || 0) * 0.00081925 / 16 / 2.2046).toFixed(2) })
          this.options.formDatas = Object.assign({}, this.options.formDatas, { unit: value, auxiliaryQuantity: (Number(this.options.formDatas.cutClothQuantity || 0) * Number(this.options.formDatas.suggestWidth || 0) * Number(this.options.formDatas.suggestWeight || 0) * 0.00081925 / 16 / 2.2046).toFixed(2) })
        }
        if (value && value.label === units[2]) { // 米 辅助数量=数量/0.9144*成品幅宽*成品克重*0.00081925/16/2.2046
          // setFormDatas({ unit: value, auxiliaryQuantity: (Number(formDatas.cutClothQuantity || 0) * 10000 / 0.9144 / 10000 * Number(formDatas.suggestWidth || 0) * Number(formDatas.suggestWeight || 0) * 100000000 * 0.00081925 / 100000000 / 16 / 2.2046).toFixed(2) })
          this.options.formDatas = Object.assign({}, this.options.formDatas, { unit: value, auxiliaryQuantity: (Number(this.options.formDatas.cutClothQuantity || 0) * 10000 / 0.9144 / 10000 * Number(this.options.formDatas.suggestWidth || 0) * Number(this.options.formDatas.suggestWeight || 0) * 100000000 * 0.00081925 / 100000000 / 16 / 2.2046).toFixed(2) })
        }
        if (value && value.label === units[3]) { // 千克 辅助数量=数量
          this.options.formDatas = Object.assign({}, this.options.formDatas, { unit: value, auxiliaryQuantity: Number(this.options.formDatas.cutClothQuantity || 0).toFixed(2) })
        }
        if (value && !units.includes(value.label)) { // 如果单位不是磅，码和米时，辅助数量空白
          // setFormDatas({ unit: value, auxiliaryQuantity: '' })
          this.options.formDatas = Object.assign({}, this.options.formDatas, { unit: value, auxiliaryQuantity: '' })
        }
      }
      if (typeof value !== 'object' && type === '1') { // 剪样数量输入框的改变
        if (this.options.formDatas.unit && this.options.formDatas.unit.label === units[0]) { // 磅 辅助数量=数量/2.2046
          // setFormDatas({ auxiliaryQuantity: (Number(formDatas.cutClothQuantity || 0) / 2.2046).toFixed(2) })
          this.options.formDatas = Object.assign({}, this.options.formDatas, { cutClothQuantity: value, auxiliaryQuantity: (Number(value || 0) / 2.2046).toFixed(2) })
        }
        if (this.options.formDatas.unit && this.options.formDatas.unit.label === units[1]) { // 码 辅助数量=数量*成品幅宽*成品克重*0.00081925/16/2.2046
          // setFormDatas({ auxiliaryQuantity: (Number(formDatas.cutClothQuantity || 0) * Number(formDatas.suggestWidth || 0) * Number(formDatas.suggestWeight || 0) * 0.00081925 / 16 / 2.2046).toFixed(2) })
          this.options.formDatas = Object.assign({}, this.options.formDatas, { cutClothQuantity: value, auxiliaryQuantity: (Number(value || 0) * Number(this.options.formDatas.suggestWidth || 0) * Number(this.options.formDatas.suggestWeight || 0) * 0.00081925 / 16 / 2.2046).toFixed(2) })
        }
        if (this.options.formDatas.unit && this.options.formDatas.unit.label === units[2]) { // 米 辅助数量=数量/0.9144*成品幅宽*成品克重*0.00081925/16/2.2046
          // setFormDatas({ auxiliaryQuantity: (Number(formDatas.cutClothQuantity || 0) * 10000 / 0.9144 / 10000 * Number(formDatas.suggestWidth || 0) * Number(formDatas.suggestWeight || 0) * 100000000 * 0.00081925 / 100000000 / 16 / 2.2046).toFixed(2) })
          this.options.formDatas = Object.assign({}, this.options.formDatas, { cutClothQuantity: value, auxiliaryQuantity: (Number(value || 0) * 10000 / 0.9144 / 10000 * Number(this.options.formDatas.suggestWidth || 0) * Number(this.options.formDatas.suggestWeight || 0) * 100000000 * 0.00081925 / 100000000 / 16 / 2.2046).toFixed(2) })
        }
        if (this.options.formDatas.unit && this.options.formDatas.unit.label === units[3]) { // 千克 辅助数量=数量
          this.options.formDatas = Object.assign({}, this.options.formDatas, { cutClothQuantity: value, auxiliaryQuantity: Number(value || 0).toFixed(2) })
        }
        if (this.options.formDatas.unit && !units.includes(this.options.formDatas.unit.label)) { // 如果单位不是磅，码和米时，辅助数量空白
          // setFormDatas({ auxiliaryQuantity: '' })
          this.options.formDatas = Object.assign({}, this.options.formDatas, { cutClothQuantity: value, auxiliaryQuantity: '' })
        }
      }
      if (typeof value !== 'object' && type === '2') { // 成品幅宽的改变
        if (this.options.formDatas.unit && this.options.formDatas.unit.label === units[0]) { // 磅 辅助数量=数量/2.2046
          this.options.formDatas = Object.assign({}, this.options.formDatas, { suggestWidth: value, auxiliaryQuantity: (Number(this.options.formDatas.cutClothQuantity || 0) / 2.2046).toFixed(2) })
        }
        if (this.options.formDatas.unit && this.options.formDatas.unit.label === units[1]) { // 码 辅助数量=数量*成品幅宽*成品克重*0.00081925/16/2.2046
          this.options.formDatas = Object.assign({}, this.options.formDatas, { suggestWidth: value, auxiliaryQuantity: (Number(this.options.formDatas.cutClothQuantity || 0) * Number(value || 0) * Number(this.options.formDatas.suggestWeight || 0) * 0.00081925 / 16 / 2.2046).toFixed(2) })
        }
        if (this.options.formDatas.unit && this.options.formDatas.unit.label === units[2]) { // 米 辅助数量=数量/0.9144*成品幅宽*成品克重*0.00081925/16/2.2046
          this.options.formDatas = Object.assign({}, this.options.formDatas, { suggestWidth: value, auxiliaryQuantity: (Number(this.options.formDatas.cutClothQuantity || 0) * 10000 / 0.9144 / 10000 * Number(value || 0) * Number(this.options.formDatas.suggestWeight || 0) * 100000000 * 0.00081925 / 100000000 / 16 / 2.2046).toFixed(2) })
        }
        if (this.options.formDatas.unit && this.options.formDatas.unit.label === units[3]) { // 千克 辅助数量=数量
          this.options.formDatas = Object.assign({}, this.options.formDatas, { cutClothQuantity: value, auxiliaryQuantity: Number(value || 0).toFixed(2) })
        }
        if (this.options.formDatas.unit && !units.includes(this.options.formDatas.unit.label)) { // 如果单位不是磅，码和米时，辅助数量空白
          this.options.formDatas = Object.assign({}, this.options.formDatas, { suggestWidth: value, auxiliaryQuantity: '' })
        }
      }
      if (typeof value !== 'object' && type === '3') { // 成品克重的改变
        if (this.options.formDatas.unit && this.options.formDatas.unit.label === units[0]) { // 磅 辅助数量=数量/2.2046
          this.options.formDatas = Object.assign({}, this.options.formDatas, { suggestWeight: value, auxiliaryQuantity: (Number(this.options.formDatas.cutClothQuantity || 0) / 2.2046).toFixed(2) })
        }
        if (this.options.formDatas.unit && this.options.formDatas.unit.label === units[1]) { // 码 辅助数量=数量*成品幅宽*成品克重*0.00081925/16/2.2046
          this.options.formDatas = Object.assign({}, this.options.formDatas, { suggestWeight: value, auxiliaryQuantity: (Number(this.options.formDatas.cutClothQuantity || 0) * Number(this.options.formDatas.suggestWidth || 0) * Number(value || 0) * 0.00081925 / 16 / 2.2046).toFixed(2) })
        }
        if (this.options.formDatas.unit && this.options.formDatas.unit.label === units[2]) { // 米 辅助数量=数量/0.9144*成品幅宽*成品克重*0.00081925/16/2.2046
          this.options.formDatas = Object.assign({}, this.options.formDatas, { suggestWeight: value, auxiliaryQuantity: (Number(this.options.formDatas.cutClothQuantity || 0) * 10000 / 0.9144 / 10000 * Number(this.options.formDatas.suggestWidth || 0) * Number(value || 0) * 100000000 * 0.00081925 / 100000000 / 16 / 2.2046).toFixed(2) })
        }
        if (this.options.formDatas.unit && this.options.formDatas.unit.label === units[3]) { // 千克 辅助数量=数量
          this.options.formDatas = Object.assign({}, this.options.formDatas, { cutClothQuantity: value, auxiliaryQuantity: Number(value || 0).toFixed(2) })
        }
        if (this.options.formDatas.unit && !units.includes(this.options.formDatas.unit.label)) { // 如果单位不是磅，码和米时，辅助数量空白
          this.options.formDatas = Object.assign({}, this.options.formDatas, { suggestWeight: value, auxiliaryQuantity: '' })
        }
      }
    },
    // 获取单位数据
    async getUnitSelect(flag = false) { // flag   false:表示不设置下拉框的默认值  true：表示设置下拉框的默认值，新增的时候需要设置默认值
      const { code = 0, data = [] } = await unitSelect()
      if (code === 200) {
        const units = ['磅', '码', '米', '千克'] // 只显示这四个单位
        this.options.content['_unit'].dataSource = data.map(n => ({ label: n.name, value: n.uuid })).filter(n => units.includes(n.label))
        if (flag && this.options.content['_unit'].dataSource.length) {
          this.options.formDatas = { unit: this.options.content['_unit'].dataSource[0] }
        }
      }
    },
    // 选择产品弹框确定按钮
    submitForm(data) {
      this.options.content['_sellerTeam'].dataSource = []
      this.options.content['_sellerTeam'].dataSource.push(data.sellerTeam)
      this.options.formDatas = Object.assign({}, this.options.formDatas, data)
      // 重新计算辅助数量的值
      if (data.suggestWidth) { // 存在成品幅宽
        if (Number(data.suggestWidth) !== Number(this.options.formDatas.suggestWidth)) { // 新旧数据不相等才重新计算
          this.computeAuxiliaryQuantity(data.suggestWidth, '2')
        }
      }
      if (data.suggestWeight) { // 存在成品克重
        if (Number(data.suggestWeight) !== Number(this.options.formDatas.suggestWeight)) { // 新旧数据不相等才重新计算
          this.computeAuxiliaryQuantity(data.suggestWeight, '3')
        }
      }
    },
    init(row = {}, cutSampleRequirements = []) {
      this.options.visible = true // 显示弹框
      this.cutSampleRequirements = cutSampleRequirements
      this.$nextTick(() => { // 在下一次事件循环中处理
        this.options.formDatas = {}
        if (row.orderId || row.index) { // 存在id表示编辑
          this.options.formDatas = Object.assign({}, row, { auxiliaryQuantity: row.auxiliaryQuantity || '' })
          this.options.content['_sellerTeam'].dataSource = row.sellerTeam && [row.sellerTeam]
          this.options.content['_unit'].dataSource = row.unit && [row.unit]
          this.options.title = '编辑剪样'
          this.options.saveAndadd = null
        } else { // 不存在id表示新增
          this.options.title = '新增剪样'
          // 默认显示第一个单位的值
          this.options.saveAndadd = this.saveAndadd
          this.getUnitSelect(true)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
