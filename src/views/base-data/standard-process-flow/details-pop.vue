<template>
  <div class="pop">
    <cs-custom-pop :options="options" />
  </div>
</template>
<script>
import { add, edit, detail } from './api/index.js'
import techRquire from './components/tech-require'
import label from './label'

export default {
  name: 'StrandardProgressDetailsPop',
  components: {},
  data() {
    // 正则验证
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const commonChangeReg = this.$getRules({})

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
        content: {}
      },
      // 流程分类弹出框内容
      itemContent: {
        categoryCode: { prop: 'categoryCode', itemType: 'input', label: `${label.categoryCode}:`, rules: [commonBlurReg], placeholder: label.placeholder.flowCode },
        categoryFlow: { prop: 'categoryFlow', itemType: 'input', label: `${label.categoryFlow}:`, rules: [commonBlurReg, { max: 100, message: '长度在 100 个字符以内', trigger: ['blur'] }], placeholder: label.placeholder.categoryFlow },
        mode: { prop: 'mode', itemType: 'select', label: `${label.mode}:`, rules: [commonChangeReg], dataSource: [{ value: 1, label: '1' }, { value: 2, label: '2' }] },
        remark: { prop: 'remark', itemType: 'input', maxlength: 200, type: 'textarea',
          trim: value => value, autosize: { minRows: 2, maxRows: 4 }, label: `${label.remark}:`, placeholder: label.placeholder.remark
        }
      },
      // 标准工序流程弹出框内容
      standardContent: {
        flowCode: { prop: 'flowCode', itemType: 'input', label: `${label.flowCode}:`, disabled: true, rules: [commonBlurReg], placeholder: label.placeholder.flowCode },
        categoryFlow: { prop: 'categoryFlow', itemType: 'select', label: `${label.categoryFlow}:`, rules: [commonChangeReg, { max: 100, message: '长度在 100 个字符以内', trigger: ['blur'] }], dataSource: [{ value: 1, label: '1' }, { value: 2, label: '2' }], placeholder: label.placeholder.categoryFlow },
        craftRequire: { prop: 'craftRequire', itemType: 'select', label: `${label.craftRequire}:`, rules: [commonChangeReg], title: true, components: { techRquire },
          componentsOptions: {
            checkValList: [],
            ok: (checkValList) => {
              this.$set(this.standardContent.craftRequire.componentsOptions, 'checkValList', checkValList)
              this.options.formDatas = { craftRequire: checkValList }
            }
          }
        },
        processFlow: { prop: 'processFlow', itemType: 'select', label: `${label.processFlow}:`, multiple: true, rules: [commonChangeReg], dataSource: [{ value: 1, label: '1' }, { value: 2, label: '2' }] },
        remark: { prop: 'remark', itemType: 'input', maxlength: 200, type: 'textarea', trim: value => value, autosize: { minRows: 2, maxRows: 4 }, label: `${label.remark}:`, placeholder: label.placeholder.remark }
      }
    }
  },
  methods: {
    // 通过id获取信息
    async getInfoById(id = '') {
      const { code = 0, data = { status: '' }} = await detail({ id: id })
      if (code === 200) { // 表示成功
        this.options.formDatas = data
      }
    },
    // 更新数据
    async modify(row) {
      const { code = 0, message = '', data = {}} = await edit(row)
      if (code === 200) { // 表示成功
        this.$emit('modify', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    // 新增数据
    async add(row) {
      const { code = 0, message = '', data = {}} = await add(row)
      if (code === 200) { // 表示成功
        this.$emit('add', { code, message, data })
        this.options.visible = false // 关闭弹框
      }
    },
    init(row = { statu: { code: '' }}, type = '1') {
      this.options.visible = true // 显示弹框
      this.$nextTick(() => { // 在下一次事件循环中处理
        if (type === '1') {
          this.options.content = this.itemContent
        } else {
          this.options.content = this.standardContent
        }
        this.$set(this.standardContent.craftRequire.componentsOptions, 'checkValList', []) // 清空 工艺要求 的缓存
        if (row.id) { // 存在id表示编辑
          this.options.title = type === '1' ? '编辑流程分类' : '编辑标准工序流程'
          this.getInfoById(row.id)
        } else { // 不存在id表示新增
          this.options.title = type === '1' ? '新增流程分类' : '新增标准工序流程'
        }
      })
    }
  }
}
</script>
