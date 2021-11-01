<template>
  <div class="paymentPage tab-wrap">
    <div class="t-tab-container tab-wrap">
      <el-tabs v-model="printingAdditionalType" @tab-click="tabHandleClick">
        <el-tab-pane label="闪粉" name="G" />
        <el-tab-pane label="荧光" name="F" />
        <el-tab-pane label="凸桨" name="C" />
        <el-tab-pane label="夜光桨" name="L" />
      </el-tabs>
    </div>
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button v-permission="['price:printingAdditionalInfo:add']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
    </div>

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
      <cs-custom-pop ref="popForm" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import {
  printingAdditionalInfoPage,
  printingAdditionalInfoAdd,
  printingAdditionalInfoDetail,
  printingAdditionalInfoModify,
  printingAdditionalInfoDelete,
  printingAdditionalInfoEnabled
} from './api/index.js'
import enableSwitch from '../../components/enableSwitch'
import { compareValues } from '@/views/price-center/common/index'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'Notarization',
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 最大999.99正则
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/, message: '请输入最大3位整数或保留1到2位小数', trigger: ['blur'] })
    const checkFn = (rule, value, callback) => {
      const datas = this.$refs.popForm.$refs.popComponents.formDatas
      const maxWeight = datas.maxAreaPct || 0
      const minWeight = datas.minAreaPct || 0
      const res = compareValues(value, { maxWeight, minWeight })
      if (res) return callback(new Error(res))
      this.$refs.popForm.$refs.popComponents.form.clearValidate()
      callback()
    }
    const printingType = { G: '闪粉', F: '荧光', C: '凸浆', L: '夜光浆' }
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'status',
        itemType: 'select',
        label: '启用/禁用:',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '启用',
            value: 1
          },
          {
            label: '禁用',
            value: 0
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const enabled = params.enabled && params.enabled === '' ? null : params.enabled
          this.formDatas = { ...params, enabled }

          this.getRulePage({ ...params, enabled })
        },
        resetHandle: (params) => {
          this.formDatas = {}
        }
      }
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'minAreaPct',
        label: '闪粉面积区间',
        minWidth: '180',
        showOverflowTooltip: true,
        formater: scope => {
          return `<span>${scope.row.minAreaPct || 0}%~${scope.row.maxAreaPct || 0}%</span>`
        }
      },
      {
        prop: 'additionalPrice',
        label: '闪粉价格',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => '¥' + scope.row[scope.column.property]
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: scope => {
          return this.$filters.parseTime(scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}')
        }
      },
      {
        prop: 'createdBy',
        label: '创建人',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '启用/禁用',
        width: '100',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'price:printingAdditionalInfo:status',
          changeStatus: (scope) => {
            this.changeEnable({ id: scope.row.id, status: scope.row.status })
          }
        }
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        itemType: 'input',
        prop: 'minAreaPct',
        label: '闪粉面积区间',
        maxlength: 9,
        clearable: true,
        itemStyle: { width: '60%', display: 'inline-block' },
        labelWidth: '125px',
        placeholder: '输入面积',
        rules: [commonBlurReg, { validator: checkFn, trigger: 'blur' }]
      },
      {
        itemType: 'input',
        prop: 'maxAreaPct',
        label: '至',
        maxlength: 9,
        clearable: true,
        itemStyle: { width: '40%', display: 'inline-block' },
        labelWidth: '40px',
        placeholder: '输入面积',
        rules: [commonBlurReg, { validator: checkFn, trigger: 'blur' }]
      },
      {
        itemType: 'input',
        prop: 'additionalPrice',
        label: '闪粉价格',
        maxlength: 25,
        labelWidth: '125px',
        clearable: true,
        rules: [commonBlurReg, max999Reg],
        placeholder: '请输入价格'
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
        permitTag: ['price:printingAdditionalInfo:modify'],
        isShow: true,
        handle: scope => {
          this.type = 'edit'
          this.PopDialogHandle('编辑印花附加')
          this.$set(this.popOptions, 'saveAndadd', undefined)
          this.editList({ id: scope.row.id })
        }
      },
      {
        label: '删除',
        isShow: modifyIsShow,
        style: { 'color': '#FE4949' },
        permitTag: ['price:printingAdditionalInfo:delete'],
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
      size: '560px',
      itemType: 'drawer',
      visible: false,
      title: '新增印花附加',
      okText: '保存',
      saveAndaddText: '保存并继续',
      ok: params => {
        this.addOrEdit(params, true)
      },
      cancel: (params) => {
        this.$set(this.popOptions, 'visible', false)
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
        status: ''
      },
      printingAdditionalType: 'G',
      printingType,
      searchData,
      commonContent,
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
  mounted() {
  },
  methods: {
    addList() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.popOptions, 'saveAndadd', params => this.addOrEdit(params))
      this.PopDialogHandle('新增印花附加')
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 新增或修改弹出框点击确认按钮的接口事件
    addOrEdit(params = {}, go) {
      this.$refs.popForm.$refs.popComponents.form.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            // 新增
            await printingAdditionalInfoAdd({ ...params, printingAdditionalType: this.printingAdditionalType })
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/printingAdditionalInfo/add'), { ...params, printingAdditionalType: this.printingAdditionalType }, JSON.stringify({ beforeText: `在'价格中心-生产成本-印花附加,新增一条记录`, beforeCode: { ...params, printingAdditionalType: this.printingAdditionalType }}))
          } else if (this.type === 'edit') {
            // 修改
            const obj = {}
            const pamraskey = ['id', 'printingAdditionalType', 'minAreaPct', 'maxAreaPct', 'additionalPrice']
            pamraskey.forEach(v => {
              obj[v] = params[v]
            })
            await printingAdditionalInfoModify(obj)
            const { beforeCode, afterCode } = this.compareData(this.oldForm, obj, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/printingAdditionalInfo/modify'), obj, JSON.stringify({ beforeText: `在'价格中心-生产成本-印花附加,将${JSON.stringify({ 'id': obj.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
          }
          this.$set(this.popOptions, 'formDatas', {})
          this.$message.success('保存成功')
          this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
          if (go) {
            this.PopDialogHandle()
          }
        }
      })
    },
    // 列表查询
    async getRulePage(data = {}) {
      const res = await printingAdditionalInfoPage({ ...this.formDatas, ...data, printingAdditionalType: this.printingAdditionalType })
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
      const res = await printingAdditionalInfoDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
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
    // 删除
    async deleteData(id) {
      const res = await printingAdditionalInfoDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/printingAdditionalInfo/delete'), { id }, JSON.stringify({ beforeText: `在'价格中心-生产成本-印花附加'删除一条记录`, beforeCode: { id }}))
    },
    // 启用/禁用
    async changeEnable(data, scope) {
      await printingAdditionalInfoEnabled(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/printingAdditionalInfo/status'), data, JSON.stringify({ beforeText: `在'价格中心-生产成本-印花附加'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
    },
    // 切换tab事件
    tabHandleClick(e) {
      this.formDatas = {
        status: ''
      }
      this.$set(this.columns[1], 'label', `${this.printingType[e.name]}面积区间`)
      this.$set(this.columns[2], 'label', `${this.printingType[e.name]}价格`)
      this.$set(this.commonContent[0], 'label', `${this.printingType[e.name]}面积区间`)
      this.$set(this.commonContent[2], 'label', `${this.printingType[e.name]}价格`)

      this.getRulePage({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    }
  }
}
</script>
<style lang='scss' scoped>
  .paymentPage {
    padding: 20px;
    padding-bottom: 0px;
  }
  .tab-wrap {
    position: relative;
    /deep/.el-tabs__nav-wrap {
      padding-left: 20px;
      background: #fff;
      &::after {
        height: 1px;
      }
    }
    /deep/ .el-tabs__header {
      margin-bottom: 1px;
    }
    /deep/ .el-tabs__item {
      height: 60px;
      line-height: 60px;
    }
  }
.tab-wrap {
  position: relative;
  /deep/.el-tabs__nav-wrap {
    padding-left: 20px;
    background: #fff;
    &::after {
      height: 1px;
    }
  }
  /deep/ .el-tabs__header {
    margin-bottom: 1px;
  }
  /deep/ .el-tabs__item {
    height: 60px;
    line-height: 60px;
  }
}
</style>

<style lang="scss">
  .paymentPage {
    .el-form.el-form--inline .el-form-item__label-wrap {
      margin-left: 0px !important
    }
  }
</style>
