/**
 * @Description: 织染方式
 * @author ll
 * @date 2020/10/21
*/
<template>
  <div class="weaveDye">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增单双染 -->
    <div class="button">
      <el-button v-permission="['basic:knitDyes:store']" size="small" icon="el-icon-plus" type="primary" @click="addWeaveDye">新增</el-button>
    </div>
    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        table-scrollx
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import enableSwitch from '@/views/basic-data/components/enableSwitch'
import { dataComparision } from '@/views/basic-data/common/index'
import { filterOptions } from '@/views/basic-data/common/index'
import { sysDataGroupPage, sysDataGroupAdd, sysDataGroupModify, sysDataGroupApprove, sysDataGroupEnabled, sysDataGroupDelete, sysDataGroupDetail, sysDataGroupOption } from './api/index.js'
export default {
  data() {
    // 查询
    const searchData = [
      {
        prop: 'name',
        itemType: 'input',
        label: '名称:',
        clearable: true,
        placeholder: '中文组合/英文组合'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.getListData(params)
          this.searchFormDatas = params
        },
        resetHandle: params => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const content = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '中文组合名称',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { min: 1, max: 20, message: '长度在1 到20 个字符', trigger: 'blur' }]
      },
      {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文组合名称',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { min: 1, max: 20, message: '长度在1 到20 个字符', trigger: 'blur' }]
      },
      {
        prop: 'knitModel',
        itemType: 'select',
        label: '织造花型',
        filterable: true,
        clearable: true,
        rules: [commonChangeReg],
        visibleChange: (value) => {
          if (value) {
            this.getKnitModel()
          }
        },
        dataSource: []
      },
      {
        prop: 'dyeModel',
        itemType: 'select',
        label: '染方式',
        filterable: true,
        clearable: true,
        rules: [commonChangeReg],
        visibleChange: (value) => {
          if (value) {
            this.getDyeModel()
          }
        },
        dataSource: []
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 100,
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    const columns = [
      {
        prop: 'code',
        label: '序号',
        width: '70'
      },
      {
        prop: 'name',
        label: '中文名',
        showOverflowTooltip: true
      },
      {
        prop: 'nameEn',
        label: '英文名',
        showOverflowTooltip: true
      },
      {
        prop: 'knitModel.name',
        label: '织造花型',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.knitModel.name
        }
      },
      {
        prop: 'dyeModel.name',
        label: '染方式',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.dyeModel.name
        }
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      },
      {
        prop: 'status.code',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:knitDyes:enabled',
          changeStatus: (scope) => {
            this.enableStatus({ id: scope.row.id }, scope)
          }
        }
      },
      {
        prop: 'status.describe',
        label: '状态',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.status.describe
        }
      }
    ]
    let popOperatesDataSource = [
      {
        label: '审核',
        permitTag: ['basic:knitDyes:approve'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: scope => {
          this.$confirm('确认审核当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          })
            .then(() => {
              this.approveWeaveDye(scope.row.id)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消审核'
              })
            })
        }
      },
      {
        label: '编辑',
        permitTag: ['basic:knitDyes:update'],
        isShow: true,
        handle: scope => {
          this.kintId = '' + scope.row.knitModel.id
          this.dyeId = '' + scope.row.dyeModel.id
          if (scope.row.status.code === 'P') {
            this.$set(this.content[1], 'disabled', true)
            this.$set(this.content[2], 'disabled', true)
            this.$set(this.content[3], 'disabled', true)
            this.$set(this.content[4], 'disabled', true)
          } else {
            this.$set(this.content[1], 'disabled', false)
            this.$set(this.content[2], 'disabled', false)
            this.$set(this.content[3], 'disabled', false)
            this.$set(this.content[4], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', content)
          this.type = 'edit'
          this.PopDialogHandle('编辑织染方式')
          this.getKnitModel()
          this.getDyeModel()
          this.getGroupInfo({ id: scope.row.id }, scope.row.code)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:knitDyes:destroy'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          })
            .then(() => {
              this.deleteWeaveDye(scope.row.id)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '240',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getListData({ pageSize: this.pagination.pageSize || 20, page: val })
      },
      sizeChange: val => {
        this.getListData({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      titile: '新增',
      okText: '保存',
      ok: params => {
        this.weaveDyeOption(params)
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
      content: content
    }
    return {
      type: 'add',
      dyeId: '',
      kintId: '',
      formOtions: {
        size: 'small',
        inline: true
      },
      searchData,
      searchFormDatas: {},
      formDatas: {},
      columns,
      pagination,
      popOperates,
      popOptions,
      content,
      dataSource: [],
      knitModelOption: [],
      dyeModelOption: [],
      knitInput: false,
      dyeInput: false,
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 获取织染方式列表
    async getListData(data = {}) {
      const res = await sysDataGroupPage({ ...this.searchFormDatas, ...data })
      res.data.list && res.data.list.map((item, index) => { item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index) })
      const dataList = res.data.list || []
      this.dataSource = dataList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.page,
        pageSize: res.data.pageSize,
        page: res.data.page
      }
    },
    // 织染方式启用、禁用
    async enableStatus(data = {}, scope) {
      const res = await sysDataGroupEnabled(data).catch(() => {
        scope.row.enabled.code = scope.row.enabled.code === 'Y' ? 'N' : 'Y'
      })
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
    },
    // 点击新增
    addWeaveDye() {
      this.type = 'add'
      this.oldForm = this.content.formDatas || {}
      this.$set(this.content[1], 'disabled', false)
      this.$set(this.content[2], 'disabled', false)
      this.$set(this.content[3], 'disabled', false)
      this.$set(this.content[4], 'disabled', false)
      this.PopDialogHandle('新增织染方式')
      this.$set(this.popOptions, 'content', this.content)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增、编辑织染方式
    weaveDyeOption(params) {
      if (this.type === 'add') {
        const obj = {}
        const pamraskey = ['name', 'nameEn', 'knitModel', 'dyeModel', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.weaveDyeAdd(obj)
      } else if (this.type === 'edit') {
        const obj = {}
        const pamraskey = ['id', 'name', 'nameEn', 'knitModel', 'dyeModel', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.weaveDyeEdit(obj)
        this.knitInput = false
        this.dyeInput = false
      }
    },
    // 织染方式新增
    async weaveDyeAdd(data = {}) {
      const res = await sysDataGroupAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getListData()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    // 织染方式编辑
    async weaveDyeEdit(data = {}) {
      const res = await sysDataGroupModify(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getListData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 审核织染方式
    async approveWeaveDye(id) {
      const res = await sysDataGroupApprove({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.getListData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 删除织染方式
    async deleteWeaveDye(id) {
      const res = await sysDataGroupDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getListData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 织染方式详情
    async getGroupInfo(data = {}, code) {
      const res = await sysDataGroupDetail(data)
      if (res.code !== 200) {
        return false
      }
      res.data.knitModel = res.data.knitModel.id
      res.data.dyeModel = res.data.dyeModel.id
      const dataList = res.data || {}
      this.oldForm = { ...dataList, code: code }
      this.setFormDatas({ ...dataList, code: code })
    },
    // 织造花型式下拉
    async getKnitModel() {
      const res = await sysDataGroupOption({ mode: 'K' })
      if (res.code !== 200) {
        return false
      }
      this.knitModelOption = filterOptions(this.kintId, res.data, this.type)
      this.knitModelOption.map((item, index) => {
        item.label = item.name
        item.value = item.id
        item.disabled = item.enabled !== 'Y'
      })
      this.$set(this.content[3], 'dataSource', this.knitModelOption)
    },
    // 染方式下拉
    async getDyeModel() {
      const res = await sysDataGroupOption({ mode: 'D' })
      if (res.code !== 200) {
        return false
      }
      this.dyeModelOption = filterOptions(this.dyeId, res.data, this.type)
      this.dyeModelOption.map((item, index) => {
        item.label = item.name
        item.value = item.id
        item.disabled = item.enabled !== 'Y'
      })
      this.$set(this.content[4], 'dataSource', this.dyeModelOption)
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
.weaveDye {
  padding: 20px;
  padding-bottom: 0;
}
</style>
