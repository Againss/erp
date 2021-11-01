<template>
  <div class="paymentPage">
    <!-- 新增菜单按钮 -->
    <!-- <div class="button">
      <el-button v-permission="['basic:paymentTerms:store']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
    </div> -->
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        table-scrollx
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import {
  exchangeRatePage,
  exchangeRateAdd,
  exchangeRateDetail,
  exchangeRateModify,
  exchangeRateDelete,
  exchangeRateEnabled
} from './api/index.js'
import { dataComparision } from '../../common/index'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'Notarization',
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,1})|(0{1}))(\.\d{1,4})?$/, message: '请输入最大2位整数或保留1到4位小数', trigger: ['blur'] })
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '50',
        formater: scope => {
          return scope.$index + 1
        }
      },
      {
        prop: 'sourceCurrencyEname',
        label: '源货币英文名',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'targetCurrencyEname',
        label: '目标货币英文名',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'exchangeRate',
        label: '汇率',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        showOverflowTooltip: true,
        formater: scope => {
          if (scope.row.createdTime) {
            return this.$filters.parseTime(scope.row.createdTime, '{y}-{m}-{d} {h}:{i}')
          }
        }
      },
      {
        prop: 'createdBy',
        label: '创建人',
        minWidth: '80',
        showOverflowTooltip: true
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        itemType: 'input',
        prop: 'exchangeRate',
        label: '汇率',
        maxlength: 9,
        clearable: true,
        rules: [commonBlurReg, max999Reg]
      }
    ]
    const copyContent = [
      ...commonContent
    ]
    const modifyIsShow = scope => {
      return scope.row.status !== 1
    }
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['price:exchangeRate:modify'],
        isShow: true,
        handle: scope => {
          this.type = 'edit'
          this.PopDialogHandle('编辑汇率')
          this.editList({ id: scope.row.id })
        }
      },
      {
        label: '删除',
        isShow: modifyIsShow,
        style: { 'color': '#FE4949' },
        permitTag: ['price:exchangeRate:delete'],
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.deleteData(scope.row.id)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '100',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getRulePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.getRulePage({ page: this.pagination.pageNum || 1, pageSize: val })
      }
    }

    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增汇率',
      okText: '保存',
      // saveAndaddText: '保存并继续',
      // saveAndadd,
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
      formDatas: {
        status: ''
      },
      columns,
      copyContent,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      type: 'add',
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
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新增汇率')
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增的确定事件
    async addData(data = {}) {
      const res = await exchangeRateAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getRulePage()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
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
      if (this.type === 'add') {
        this.addData(params)
      } else if (this.type === 'edit') { // 走编辑接口
        const obj = {}
        const pamraskey = ['id', 'exchangeRate']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
      }
    },
    // 列表查询
    async getRulePage(data = {}) {
      const res = await exchangeRatePage({ ...this.searchFormDatas, ...data })
      res.data.list && res.data.list.map((item, index) => { item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        page: res.data.pageNum
      }
    },
    // 点击编辑获取详情
    async editList(data = {}, code) {
      const res = await exchangeRateDetail(data)
      // if (!res || res.code !== 200) {
      //   return false
      // }
      const editData = res.data || {}
      this.oldForm = { ...editData }
      this.setFormDatas({ ...editData })
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
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
    },
    // 更新
    async addUpdate(data = {}) {
      const res = await exchangeRateModify(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      const item = this.dataSource.find(ele => ele.id === data.id)
      const { beforeCode, afterCode } = this.compareData(item, data, 'id')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/exchangeRate/modify'), data, JSON.stringify({ beforeText: `在'价格中心-汇率配置,将${JSON.stringify({ 'id': data.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
    },
    // 删除
    async deleteData(id) {
      const res = await exchangeRateDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 页面启用禁用
    async changeEnable(data = {}, scope) {
      const res = await exchangeRateEnabled(data)
      if (res.code === 200) {
        this.$message({
          message: res.message ? res.message : '更新状态成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message ? res.message : '更新状态失败',
          type: 'error'
        })
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
