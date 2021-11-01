<!--
 * @Author: xj
 * @Description: 条纹间距
 * @Date: 2021-06-26 09:35:01
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-07-10 16:49:54
 * @FilePath: d:\yangban\src\views\customer-order\goods-orders\detail\common\stripe.vue
-->
<template>
  <div class="">
    <!-- 选择弹窗 -->
    <div class="pop">
      <cs-custom-pop ref="stripeSpacingPop" :options="stripeSpacingPopOptions" />
      <choose-pop :title="chooseTitle" type-vs="2" :search-data="chooseSearch" :pagination="choosePagination" :columns="chooseColumns" :is-visible.sync="isshowCloth" :table-data="tableData" @closePop="closePop" @savePop="savePop" />
    </div>
  </div>
</template>

<script>
import { PublicCustomer } from '@/views/customer-order/public/index'
import { detailFun } from '@/views/customer-order/sample-orders/detail/api/detailFun'
import choosePop from '@/views/customer-order/public/components/choosePop'
// import { queryColorNoPage } from '../api/index'
import { inputFilter } from '@/views/customer-order/public/api/inputFilter'
export default {
  components: { choosePop },
  mixins: [PublicCustomer, detailFun],
  props: {
    rules: {
      type: Object,
      default: () => ({})
    },
    plateIndexFrom: {
      type: Object
    },
    popDataFun: {
      type: Function
    }
  },
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 最大99.99正则
    const max99Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,1})|(0{1}))(\.\d{1,2})?$/, message: '0~99.99', trigger: ['blur'] })
    // 最大999.99正则
    // 剪版要求弹窗内容
    const stripeSpacingContent = {
      _height: {
        prop: 'height',
        itemType: 'input',
        minWidth: '88',
        itemStyle: { width: '48%', display: 'inline-block', 'margin-right': '2%' },
        label: '高度(cm)',
        trim: (val) => { return inputFilter(val) },
        clearable: true,
        rules: [commonBlurReg, max99Reg]
      },
      _stripeSpacing5: { // 空白格
        itemType: 'view',
        text: '',
        style: { width: '32%', 'font-size': '16px', display: 'inline-block' }
      },
      _fabricColorNo: {
        prop: 'fabricColorNo',
        itemType: 'input',
        minWidth: '88',
        className: 'cursorHandel',
        itemStyle: { width: '48%', display: 'inline-block' },
        label: '智布色号',
        placeholder: '点击选择智布色号',
        clearable: true,
        rules: [commonBlurReg],
        // readonly: true,
        clear: (form, formDatas, setFormDatas, scope) => {

        },
        focus: (event, params) => {
          this.getFabricColorNoCom()
          event.target.blur()
        }
      }
    }
    const quantityAdd = (params, form) => {
      this.$refs.stripeSpacingPop.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          this.AddFromData(params, 2)
          this.$message({ type: 'success', message: '添加成功，请继续添加' })
          this.$nextTick(() => {
            this.popForm.resetFields()
            this.$set(this.stripeSpacingPopOptions, 'formDatas', {})
          })
        }
      })
    }
    const stripeSpacingPopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新增条纹间距',
      okText: '保存',
      ok: params => {
        this.AddFromData(params, 1)
        this.popHandle('', 'stripeSpacing')
      },
      saveAndaddText: '确定，继续添加',
      saveAndadd: quantityAdd,
      cancel: params => {
        this.popHandle('', 'stripeSpacing')
      },
      formDatas: {},
      formOptions: {
        getForm: (form) => {
          this.popForm = form
        }
      },
      content: stripeSpacingContent
    }
    return {
      chooseTitle: '', // 选择弹窗标题
      chooseType: '', // 选择弹窗类型 1:智布色号 2:智布花号 3:条纹间距智布色号
      chooseSearch: {}, // 搜索条件
      chooseColumns: {},
      quantityAdd,
      tableData: [],
      isshowCloth: false,
      choosePagination: {}, // 色号、花号的弹窗页码
      stripeSpacingContent,
      stripeSpacingPopOptions
    }
  },
  watch: {
    plateIndexFrom: {
      handler(val, oldVal) {
        this.IndexFrom(val)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    // 关闭选择弹窗
    closePop() {
      this.isshowCloth = false
    },
    // 保存色号、花号pop弹窗
    savePop(params) {
      console.log('som保存色号、花号pop弹窗333', params)
      this.stripeSpacingPopOptions.formDatas = { ...params, colorName: params.customerColorName, fabricColorNo: params.fabricColorNo, colorValue: params.rgb ? 'rgb(' + params.rgb + ')' : '' }
      this.isshowCloth = false
      this.chooseType = ''
    },
    // 编辑数据设置
    IndexFrom(data) {
      this.$nextTick(() => { this.$set(this.stripeSpacingPopOptions, 'formDatas', data) })
    },
    AddFromData(params) {
      if (this.stripeSpacingPopOptions.title === '新增条纹间距') {
        const obj = { ...params, IndexEdt: 'add' }
        this.popDataFun('stripe', obj,)
      } else {
        const obj = { ...params, IndexEdt: 'edt' }
        this.popDataFun('stripe', obj)
      }
    },
    // 条纹间距
    popHandle(val, type) {
      this.$set(this[`${type}PopOptions`], 'visible', !this[`${type}PopOptions`].visible)
      if (val) {
        this.$set(this[`${type}PopOptions`], 'title', val)
        if (val === '编辑条纹间距') { this.$set(this.stripeSpacingPopOptions, 'saveAndadd', null) }
      }
      if (this[`${type}PopOptions`].visible) {
        this.encryptFn(this[`${type}Content`], this.rules, val && val.startsWith('新增') && 'add' || 'edit')
      }
      this.$set(this[`${type}PopOptions`], 'content', this[`${type}Content`])
      this.$set(this[`${type}PopOptions`], 'formDatas', {})
    },

    // 获取客户下拉
    getCustomerSelect(type) {
      this.getCustomer().then(res => {
        if (type === 'stripeSpacing' || type === 'allContent') {
          this.$set(this.chooseSearch._customerId, 'dataSource', res)
        }
      })
    },
    // 获取销售团队下拉
    getSellTeamSelect(type) {
      this.getSellTeam({ functionTag: 'SAL' }).then(res => {
        if (type === 'stripeSpacing') {
          this.$set(this.chooseSearch._sellerTeamId, 'dataSource', res)
        }
      })
    },

    // 选项配置下拉
    getOptionConfigSelect(data, type) {
      this.getOptionConfig(data).then(res => {
        if (type === 'chooseSearch') { // 销售季度
          this.$set(this.chooseSearch._sellQuarter, 'dataSource', res)
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
