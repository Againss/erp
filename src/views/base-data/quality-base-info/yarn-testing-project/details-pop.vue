<template>
  <div class="pop">
    <cs-custom-pop :options="options" />
  </div>
</template>
<script>
import { add as addYarnTest, edit as editYarnTest, detail as detailYarnTest } from './api/index.js'
import { add as addDyeColor, edit as editDyeColor, detail as detailDyeColor } from './api/dyeColor'
import label from './label'

export default {
  name: 'YarnTestingProjectDetailsPop',
  components: {},
  data() {
    // 正则验证
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const commonChangeReg = this.$getRules({})
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))?$/, message: '0~999整数', trigger: ['blur'] })
    return {
      options: {
        itemType: 'drawer',
        visible: false,
        title: '新增',
        okText: '保存',
        ok: params => {
          if (params.id) { // 存在id 更新一条记录
            this.edit(params)
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
          orders: 0
        },
        formOptions: {},
        content: {}
      },
      // 试纱项目弹出框内容
      itemContent: {
        name: { prop: 'name', itemType: 'input', label: `${label.name}:`, maxlength: 50, clearable: true, disabled: false, rules: [commonBlurReg, { max: 50, message: '长度在 50 个字符以内', trigger: ['blur'] }], placeholder: '请输入' },
        nameEn: { prop: 'nameEn', itemType: 'input', label: `${label.nameEn}:`, maxlength: 50, clearable: true, placeholder: '请输入,最多50字' },
        unit: { prop: 'unit', itemType: 'select', label: `${label.unit}:`, rules: [commonChangeReg], dataSource: label.dict.UNITS },
        orders: { prop: 'orders', itemType: 'input', label: `${label.orders}:`, clearable: true, rules: [commonBlurReg, max999Reg], placeholder: '请输入0~999整数' },
        remarks: { prop: 'remarks', itemType: 'input', maxlength: 200, clearable: true, type: 'textarea',
          trim: value => value, autosize: { minRows: 2, maxRows: 4 }, label: `${label.remarks}:`, placeholder: '请输入'
        }
      },
      // 试染颜色流程弹出框内容
      standardContent: {
        name: { prop: 'name', itemType: 'input', label: `${label.name}:`, maxlength: 50, clearable: true, disabled: false, rules: [commonBlurReg, { max: 50, message: '长度在 50 个字符以内', trigger: ['blur'] }], placeholder: '请输入' },
        nameEn: { prop: 'nameEn', itemType: 'input', label: `${label.nameEn}:`, maxlength: 50, clearable: true, placeholder: '请输入,最多50字' },
        orders: { prop: 'orders', itemType: 'input', label: `${label.orders}:`, clearable: true, rules: [commonBlurReg, max999Reg], placeholder: '请输入0~999整数' },
        remarks: { prop: 'remarks', itemType: 'input', maxlength: 200, clearable: true, type: 'textarea',
          trim: value => value, autosize: { minRows: 2, maxRows: 4 }, label: `${label.remarks}:`, placeholder: '请输入'
        }
      },
      type: '1'
    }
  },
  methods: {
    // 通过id获取试纱项目信息
    async getYarnTestInfoById(uuid = '') {
      const { code = 0, data = {}} = await detailYarnTest({ uuid: uuid })
      if (code === 200) { // 表示成功
        this.options.formDatas = data
      }
    },
    // 通过id获取试染颜色信息
    async getDyeColorInfoById(uuid = '') {
      const { code = 0, data = {}} = await detailDyeColor({ uuid: uuid })
      if (code === 200) { // 表示成功
        this.options.formDatas = data
      }
    },
    // 通过id获取信息
    getInfoById(id = '') {
      if (this.type === '1') {
        this.getYarnTestInfoById(id)
      } else {
        this.getDyeColorInfoById(id)
      }
    },
    /**
     * 更新试纱项目数据
     * @param row
     * @returns {Promise<void>}
     */
    async editYarnTest(row) {
      const { code = 0, message = '', data = {}} = await editYarnTest({ ...row, orders: Number(row.orders) })
      if (code === 200) { // 表示成功
        this.$emit('edit', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    /**
     * 更新试染颜色数据
     * @param row
     * @returns {Promise<void>}
     */
    async editDyeColor(row) {
      const { code = 0, message = '', data = {}} = await editDyeColor({ ...row, orders: Number(row.orders) })
      if (code === 200) { // 表示成功
        this.$emit('edit', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    // 更新数据
    edit(row) {
      if (this.type === '1') {
        this.editYarnTest(row)
      } else {
        this.editDyeColor(row)
      }
    },
    // 新增数据
    async addYarnTest(row) {
      const { code = 0, message = '', data = {}} = await addYarnTest({ ...row, orders: Number(row.orders) })
      if (code === 200) { // 表示成功
        this.$emit('add', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    // 新增数据
    async addDyeColor(row) {
      const { code = 0, message = '', data = {}} = await addDyeColor({ ...row, orders: Number(row.orders) })
      if (code === 200) { // 表示成功
        this.$emit('add', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    // 新增数据
    add(row) {
      if (this.type === '1') {
        this.addYarnTest(row)
      } else {
        this.addDyeColor(row)
      }
    },
    /**
     * 初始化
     * @param row
     * @param type 1：试纱项目 2：试染颜色
     */
    init(row = {}, type = '1') {
      this.options.visible = true // 显示弹框
      this.$nextTick(() => { // 在下一次事件循环中处理
        this.type = type
        if (this.type === '1') {
          this.options.content = this.itemContent
        } else {
          this.options.content = this.standardContent
        }
        this.options.formDatas = {}
        if (row.uuid) { // 存在id表示编辑
          this.options.title = type === '1' ? '编辑试纱项目' : '编辑试染颜色'
          this.options.content['name'].disabled = row.status === 'Y' // 已审核名称不可编辑
          this.getInfoById(row.uuid)
        } else { // 不存在id表示新增
          this.options.content['name'].disabled = false
          this.options.title = type === '1' ? '新增试纱项目' : '新增试染颜色'
        }
      })
    }
  }
}
</script>
