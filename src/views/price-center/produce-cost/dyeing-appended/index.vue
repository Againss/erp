<template>
  <div class="paymentPage">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button v-permission="['price:dyeingAdditionalInfo:add']" type="primary" size="small" icon="el-icon-plus" @click="addList">新增</el-button>
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
  dyeingAdditionalInfoPage,
  dyeingAdditionalInfoAdd,
  dyeingAdditionalInfoModify,
  dyeingAdditionalInfoDelete,
  dyeingAdditionalInfoEnabled,
  dyeingAdditionalInfoDetail
} from './api/index.js'
import enableSwitch from '../../components/enableSwitch'
import { fetchLog } from '@/views/price-center/common/fetchLog'
export default {
  name: 'Notarization',
  components: {},
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    // 最大999.99正则
    const max999Reg = this.$getRules({
      type: 'number',
      pattern: /^(([1-9]{1}\d{0,2})|(0{1}))(\.\d{1,2})?$/,
      message: '输入3位整数或保留1到2位小数',
      trigger: ['blur']
    })
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
          this.searchFormDatas = { ...params }
          this.getRulePage(params)
        },
        resetHandle: params => {
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
        formater: scope => (this.pagination.currentPage - 1) * this.pagination.pageSize + scope.$index + 1
      },
      {
        prop: 'dyeingProcess',
        label: '染色工艺',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          const dyeingType = {
            'W': '洗水',
            'B': '漂白',
            'H': '半漂',
            'D': '染色'
          }
          return scope.row[scope.column.property] && dyeingType[scope.row[scope.column.property]] || ''
        }
      },
      {
        prop: 'additionalContent',
        label: '附加内容',
        minWidth: '200',
        showOverflowTooltip: true
      },
      {
        prop: 'additionalContentPrice',
        label: '附加内容价格',
        minWidth: '200',
        showOverflowTooltip: true,
        formater: scope => '¥' + scope.row[scope.column.property]
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        showOverflowTooltip: true,
        minWidth: '200',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      {
        prop: 'createdBy',
        label: '创建人',
        minWidth: '150',
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
          permitTag: 'price:dyeingAdditionalInfo:status',
          changeStatus: scope => {
            this.changeEnable({ id: scope.row.id, status: scope.row.status * 1 }, scope)
          }
        }
      }
    ]
    const commont = [
      {
        prop: 'dyeingProcess',
        itemType: 'select',
        label: '染色工艺',
        dataSource: [
          {
            label: '洗水',
            value: 'W'
          },
          {
            label: '漂白',
            value: 'B'
          },
          {
            label: '半漂',
            value: 'H'
          },
          {
            label: '染色',
            value: 'D'
          }
        ],
        clearable: true,
        labelWidth: '125px',
        rules: [commonBlurReg]
      },
      {
        itemType: 'input',
        prop: 'additionalContent',
        label: '附加内容',
        maxlength: 9,
        labelWidth: '125px',
        rules: [commonBlurReg],
        placeholder: '请输入(最多9个字符)'
      },
      {
        itemType: 'input',
        prop: 'additionalContentPrice',
        label: '附加内容价格',
        maxlength: 9,
        labelWidth: '125px',
        rules: [commonBlurReg, max999Reg],
        placeholder: '请输入附加内容价格'
      }
    ]
    const modifyIsShow = scope => {
      return scope.row.status !== 1
    }
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['price:dyeingAdditionalInfo:modify'],
        isShow: true,
        handle: scope => {
          this.type = 'edit'
          this.editFn(scope.row.id)
        }
      },
      {
        label: '删除',
        isShow: modifyIsShow,
        style: { 'color': '#FE4949' },
        permitTag: ['price:dyeingAdditionalInfo:delete'],
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => this.deleteFn({ id: scope.row.id }))
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
      title: '新增染色附加',
      okText: '保存',
      saveAndaddText: '保存并继续',
      ok: params => {
        this.addOrEdit(params, true)
      },
      cancel: params => {
        this.PopDialogHandle()
      },
      formDatas: {},
      formOptions: {},
      content: commont
    }

    return {
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        status: ''
      },
      searchData,
      columns,
      commont,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      type: 'add',
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getRulePage()
  },
  methods: {
    async editFn(id) {
      const data = (await dyeingAdditionalInfoDetail({ id })).data || {}
      this.oldForm = data
      data.updatedBy ? delete data.updatedBy : ''
      data.updatedTime ? delete data.updatedTime : ''
      this.$set(this.popOptions, 'formDatas', data)
      this.$set(this.popOptions, 'saveAndadd', undefined)
      this.PopDialogHandle('编辑染色附加')
    },
    addList() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.popOptions, 'saveAndadd', params => this.addOrEdit(params))
      this.PopDialogHandle('新增染色附加 ')
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
            await dyeingAdditionalInfoAdd(params)
            this.fetchLog(this.getLogMessages('INSERT', '/priceCenter/dyeingAdditionalInfo/add'), params, JSON.stringify({ beforeText: `在'价格中心-生产成本-染色附加,新增一条记录`, beforeCode: params }))
          } else if (this.type === 'edit') {
            await dyeingAdditionalInfoModify(params)
            const { beforeCode, afterCode } = this.compareData(this.oldForm, params, 'id')
            const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag && this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/dyeingAdditionalInfo/modify'), params, JSON.stringify({ beforeText: `在'价格中心-生产成本-染色附加,将${JSON.stringify({ 'id': params.id })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
          }
          this.$set(this.popOptions, 'formDatas', {})
          this.$message.success('保存成功')
          this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
          if (go) {
            this.PopDialogHandle()
          }
        }
      })
    },
    // 列表查询
    async getRulePage(data = {}) {
      const res = await dyeingAdditionalInfoPage({ ...this.searchFormDatas, ...data })
      this.dataSource = res.data && res.data.list || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data && res.data.total || 0,
        ...data,
        currentPage: res.data && res.data.pageNum || 1,
        pageSize: res.data && res.data.pageSize || 20
      }
    },
    // 删除
    async deleteFn(id = {}) {
      await dyeingAdditionalInfoDelete(id)
      this.$message.success('删除成功')
      this.getRulePage({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
      this.fetchLog(this.getLogMessages('DEL', '/priceCenter/dyeingAdditionalInfo/delete'), { id }, JSON.stringify({ beforeText: `在'价格中心-生产成本-染色附加'删除一条记录`, beforeCode: { id }}))
    },
    // 启用/禁用
    async changeEnable(data, scope) {
      await dyeingAdditionalInfoEnabled(data).then(e => this.$message.success('更新状态成功')).catch(() => {
        scope.row.status = data.status === 0 ? 1 : 0
      })
      this.fetchLog(this.getLogMessages('UPDATE', '/priceCenter/dyeingAdditionalInfo/status'), data, JSON.stringify({ beforeText: `在'价格中心-生产成本-染色附加'${data.status ? '启用' : '禁用'}一条数据`, beforeCode: data }))
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
