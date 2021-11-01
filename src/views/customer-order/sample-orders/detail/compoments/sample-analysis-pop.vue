<!--
 * @name: 客样分析编号弹框
 * @description: 客样分析编号弹框
 * @author: panmr
 * @time: 2021-06-11 14:29:41
-->
<template>
  <div class="pop">
    <cs-custom-pop :options="options" />
  </div>
</template>
<script>
import { PublicCustomer } from '@/views/customer-order/public/index'

export default {
  name: 'SampleAnalysisPop',
  components: {},
  mixins: [PublicCustomer],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    return {
      options: {
        itemType: 'drawer',
        visible: false,
        title: '客样分析编号',
        okText: '确定',
        ok: params => {
          this.$emit('ok', params.sampleAnalysisResultId)
          this.options.visible = false // 关闭弹框
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
          sampleAnalysisResultId: { itemType: 'select', prop: 'sampleAnalysisResultId', label: '客样分析编号', filterable: true, clearable: true, rules: [commonBlurReg],
            dataSource: [], visibleChange: (value) => {
              if (value) {
                this.getSampleAnalysisNoSelect()
              }
            }
          }
        }
      }
    }
  },
  methods: {
    // 客样分析编号下拉
    getSampleAnalysisNoSelect() {
      this.getSampleAnalysisNo({ status: '4' }).then(res => {
        this.options.content['sampleAnalysisResultId'].dataSource = res
      })
    },
    init(row = {}) {
      this.options.visible = true // 显示弹框
      this.$nextTick(() => { // 在下一次事件循环中处理
        if (row.id) { // 存在id表示编辑
        } else { // 不存在id表示新增
          this.options.title = '客样分析编号'
        }
      })
    }
  }
}
</script>
