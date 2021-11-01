<!--
 * @Date: 2021-04-22 09:18:15
 * @Author: Againss
 * @LastEditTime: 2021-05-08 11:27:58
 * @LastEditors: anthony
 * @Descripttion:幅宽区间
-->
<template>
  <div class="paymentPage">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增菜单按钮 -->
    <!-- v-permission="['userCenter:sysRole:add']" -->
    <div class="button">
      <el-button v-permission="['catalog:Api:Range:fabricWidth:store']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        lazy
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="popOptionsTable" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { paymentPage, paymentAdd } from './api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  name: 'Payment',
  components: {},
  mixins: [logMethods],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const checkData = (rule, value, callback) => {
      // var reg = /^[1-9]\d*$/
      // if ((!reg.test(value) && value) || value > 10000) {
      //   callback(new Error('只能输入小于10000的正整数'))
      // } else {
      //   callback()
      // }
      const reg = /^[1-9]\d*$/
      const formDatas = this.$refs.popOptionsTable.$children && this.$refs.popOptionsTable.$children.length && this.$refs.popOptionsTable.$children[0].formDatas
      if ((!reg.test(value) && value) || value > 9999) {
        callback(new Error('只能输入小于10000的正整数'))
      } else if ((rule.field === 'minVal' || rule.field === 'maxVal') && formDatas.minVal && formDatas.maxVal) {
        if (formDatas.minVal - formDatas.maxVal >= 0) {
          callback(new Error('"小于"的值必须大于"大于等于"的值'))
        } else {
          callback()
        }
      } else if (rule.field === 'midVal' && formDatas.midVal && formDatas.minVal && formDatas.maxVal) {
        if (formDatas.minVal - formDatas.midVal > 0 || formDatas.midVal - formDatas.maxVal >= 0) {
          callback(new Error('归类值不能小于"大于等于"的值，且不能大于等于"小于"的值'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const ruleTrim = (data) => {
      data = data.replace(/[^0-9\.]/g, '')
      data = data.replace('_', '')
      return data
    }
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'minVal',
        itemType: 'input',
        label: '数值区间:',
        itemStyle: { width: '170px', 'margin-right': '15px !important' }
      },
      {
        prop: 'maxVal',
        itemType: 'input',
        label: '-',
        itemStyle: { width: '115px' }
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const enabled = params.enabled && params.enabled === '' ? null : params.enabled
          this.searchFormDatas = { ...params, enabled }

          this.getRulePage({ ...params, enabled })
        },
        resetHandle: (params) => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '50',
        showOverflowTooltip: true
      },
      {
        prop: 'minVal',
        label: '大于等于',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'maxVal',
        label: '小于',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'midVal',
        label: '归类',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'creator',
        label: '更新人',
        minWidth: '80',
        formater: (scope) => {
          return scope.row.updator
            ? scope.row.updator.name
              ? scope.row.updator.name + '/' + scope.row.updator.realName
              : scope.row.updator.realName
            : scope.row.creator
              ? scope.row.creator.name
                ? scope.row.creator.name + '/' + scope.row.creator.realName
                : scope.row.creator.realName
              : ''
        },
        showOverflowTooltip: true
      },
      {
        prop: 'createdTime',
        label: '更新时间',
        minWidth: '80',
        formater: (scope) => {
          return scope.row.createdTime && this.$filters.parseTime(
            scope.row.updatedTime || scope.row.createdTime,
            '{y}-{m}-{d} {h}:{i}'
          ) || ''
        },
        showOverflowTooltip: true
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'id',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        itemType: 'input',
        prop: 'minVal',
        label: '大于等于',
        maxlength: 100,
        clearable: true,
        trim: ruleTrim,
        rules: [
          commonBlurReg,
          {
            validator: checkData,
            trigger: ['change']
          }
        ]
      },
      {
        itemType: 'input',
        prop: 'maxVal',
        label: '小于',
        maxlength: 100,
        clearable: true,
        trim: ruleTrim,
        rules: [
          commonBlurReg,
          {
            validator: checkData,
            trigger: ['change']
          }
        ]
      },
      {
        itemType: 'input',
        prop: 'midVal',
        label: '归类',
        maxlength: 100,
        clearable: true,
        trim: ruleTrim,
        rules: [commonBlurReg, {
          validator: checkData,
          trigger: ['change']
        }]
      }
    ]
    const copyContent = [
      ...commonContent
    ]
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getRulePage({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增区间',
      okText: '保存',
      ok: params => {
        this.addOrEdit(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: copyContent
    }
    return {
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        enabled: ''
      },
      searchData,
      columns,
      copyContent,
      dataSource: [],
      pagination,
      popOptions,
      visible: false,
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getRulePage()
  },
  mounted() {},
  methods: {
    addList() {
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新增区间')
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.copyContent[1], 'disabled', false)
      this.$set(this.copyContent[2], 'disabled', false)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增的确定事件
    async addData(data = {}) {
      const res = await paymentAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getRulePage()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      // 日志功能
      this.fetchLog(
        this.getLogMessages(
          'INSERT',
          `product/api/range/fabricWidth/store`
        ),
        data,
        JSON.stringify({
          beforeText: `在'产品目录库-数据配置-幅宽区间'新增一条记录`,
          beforeCode: data
        })
      )
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 新增或修改弹出框点击确认按钮的接口事件
    addOrEdit(params) {
      // 走新增接口
      const obj = {}
      const pamraskey = ['minVal', 'maxVal', 'midVal']
      pamraskey.forEach(v => {
        obj[v] = params[v]
      })
      this.addData(obj)
    },
    // 列表查询
    async getRulePage(data = {}) {
      const res = await paymentPage({ ...this.searchFormDatas, ...data })
      res.data.list && res.data.list.map((item, index) => { item.code = ((res.data.page - 1) * res.data.pageSize + index + 1) })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.page,
        pageSize: data.pageSize,
        page: res.data.page
      }
    },
    // 弹框取消数据比较回调
    CompaCallback(hadInput) {
      if (hadInput) {
        this.$confirm('您已经输入内容，确认退出吗？', '提示', {
          type: 'warning',
          cancelButtonClass: 'btn-cancel'
        })
          .then(_ => {
            this.$set(this.popOptions, 'visible', false)
          })
          .catch(_ => {
            this.$set(this.popOptions, 'visible', true)
          })
      } else {
        this.$set(this.popOptions, 'visible', false)
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.paymentPage {
  padding: 20px;
  padding-bottom: 0px;
}
</style>
<style lang="scss">
.paymentPage {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important
  }
}
</style>
