<!--
 * @Author: Sanmao
 * @Date: 2021-01-04 15:39:15
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-01-07 14:34:20
 * @Descripttion: 基础数据-生成工艺-幅宽列表
-->
<template>
  <div class="categoriesPage product-list-content">
    <div class="button">
      <el-button
        v-permission="['basic:fabricWidthType:store']"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addList"
      >新增</el-button>
    </div>
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        lazy
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
import {
  pageList,
  fabricWidthTypeAdd,
  fabricWidthTypeEdit,
  fabricWidthTypeUpdate,
  fabricWidthTypeDelete,
  fabricWidthTypeApprove,
  fabricWidthTypeEnabled
} from './api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import enableSwitch from '@/views/basic-data/components/enableSwitch'
import { debounce } from '@/utils'
export default {
  name: 'FabricWidthTypeList',
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 验证大写
    const checkData = (rule, value, callback) => {
      if (value.length !== 2) {
        callback(new Error('简称必须为两个字母'))
      } else {
        callback()
      }
    }
    const ruleTrim = (data) => {
      data = data.replace(/[^a-zA-Z]/g, '')
      data = data.toUpperCase()
      data = data.replace('_', '')
      return data
    }
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'id',
        label: '序号',
        minWidth: '50',
        showOverflowTooltip: true,
        formater: (scope) => {
          return (
            this.pagination.currentPage &&
            (this.pagination.currentPage - 1) * 20 + scope.$index + 1
          )
        }
      },
      {
        prop: 'name',
        label: '中文名',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'nameEn',
        label: '英文名',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'abbr',
        label: '简称',
        minWidth: '60'
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'id',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:fabricWidthType:enabled',
          changeStatus: (scope) => {
            this.changeEnable(
              {
                id: scope.row.id,
                enabled: scope.row.enabled.code
              },
              scope
            )
          }
        }
      },
      {
        prop: 'status.describe',
        label: '状态',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.status
            ? scope.row.status.describe === '已审核'
              ? `<span style="color:#00BCC5;">${
                scope.row.status && scope.row.status.describe
              }</span>`
              : `<span style="color:#FF9B02">${
                scope.row.status && scope.row.status.describe
              }</span>`
            : ''
        }
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      // {
      //   prop: "id",
      //   itemType: "input",
      //   label: "序号",
      //   disabled: true,
      // },
      {
        itemType: 'input',
        prop: 'name',
        label: '中文名',
        maxlength: 20,
        clearable: true,
        rules: [
          commonBlurReg,
          { message: '长度在 20 个字符以内', trigger: ['blur'] }
        ]
      },
      {
        itemType: 'input',
        prop: 'nameEn',
        label: '英文名',
        maxlength: 30,
        clearable: true,
        rules: [
          commonBlurReg,
          { message: '长度在 30 个字符以内', trigger: ['blur'] }
        ]
      },
      {
        itemType: 'input',
        prop: 'abbr',
        label: '简称',
        trim: ruleTrim,
        maxlength: 2,
        clearable: true,
        rules: [
          commonBlurReg,
          {
            validator: checkData,
            message: '简称必须为两个大写字母',
            trigger: ['change']
          }
        ],
        placeholder: '请输入两位大写字母'
      },
      {
        itemType: 'input',
        type: 'textarea',
        prop: 'remark',
        label: '备注',
        trim: (value) => {
          return value
        },
        maxlength: 100
      }
    ]
    const copyContent = [...commonContent]
    let popOperatesDataSource = [
      {
        label: '审核',
        permitTag: ['basic:fabricWidthType:approve'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: (scope) => {
          this.$confirm('确认审核当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.approveData(scope)
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
        permitTag: ['basic:fabricWidthType:update'],
        isShow: true,
        handle: (scope) => {
          // if (scope.row.status.code === 'P') {
          //   for (let i = 0; i < 3; i++) {
          //     this.$set(this.copyContent[i], 'disabled', true)
          //   }
          // } else {
          //   for (let i = 0; i < 3; i++) {
          //     this.$set(this.copyContent[i], 'disabled', false)
          //   }
          // }
          for (let i = 0; i < 3; i++) {
            scope.row.status.code === 'P' ? this.$set(this.copyContent[i], 'disabled', true) : this.$set(this.copyContent[i], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', copyContent)
          this.type = 'edit'
          this.PopDialogHandle('编辑幅宽类型')
          this.editList({ id: scope.row.id }, scope.row.code)
        }
      },
      {
        label: '删除',
        permitTag: ['basic:fabricWidthType:destroy'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: (scope) => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(() => {
              this.deleteData(scope)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        },
        style: {
          color: '#FE4949'
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '150',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentPage: 1,
      currentChange: (val) => {
        this.getRulePage({
          pageSize: this.pagination.pageSize || 20,
          page: val
        })
      },
      sizeChange: (val) => {
        this.getRulePage({ page: this.pagination.page || 1, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增幅宽类型',
      okText: '保存',
      ok: (params) => {
        this.$confirm('确定保存当前数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.addOrEdit(params)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            })
          })
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
      copyContent,
      columns,
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
  methods: {
    addList() {
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新增幅宽类型')
      this.$set(this.popOptions, 'content', this.copyContent)
      for (let i = 0; i < 3; i++) {
        this.$set(this.copyContent[i], 'disabled', false)
      }
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增的确定事件
    async addData(data = {}) {
      const res = await fabricWidthTypeAdd(data)
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
        const obj = {}
        const pamraskey = ['name', 'nameEn', 'abbr', 'remark']
        pamraskey.forEach((v) => {
          obj[v] = params[v]
        })
        this.addData(obj)
      } else if (this.type === 'edit') {
        // 走编辑接口
        const obj = {}
        const pamraskey = ['id', 'name', 'nameEn', 'abbr', 'remark']
        pamraskey.forEach((v) => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
      }
    },
    // 成分列表查询
    async getRulePage(data = {}) {
      const res = await pageList({ ...this.searchFormDatas, ...data })
      const listData = res.data ? res.data.list : []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.page,
        pageSize: data.pageSize
      }
    },
    // 点击编辑
    async editList(data = {}, code) {
      const res = await fabricWidthTypeEdit(data)
      if (!res || res.code !== 200) {
        return false
      }
      const editData = res.data || {}
      this.oldForm = { ...editData, code: code }
      this.setFormDatas({ ...editData, code: code })
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
          .then((_) => {
            this.$set(this.popOptions, 'visible', false)
          })
          .catch((_) => {
            this.$set(this.popOptions, 'visible', true)
          })
      } else {
        this.$set(this.popOptions, 'visible', false)
      }
    },
    // 更新
    async addUpdate(data = {}) {
      const res = await fabricWidthTypeUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.getRulePage({
        page: this.pagination.page || 1,
        pageSize: this.pagination.pageSize || 20
      })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 审核
    async approveData(scope) {
      const res = await fabricWidthTypeApprove({ id: scope.row.id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.getRulePage({
        page: this.pagination.page || 1,
        pageSize: this.pagination.pageSize || 20
      })
    },
    // 删除
    async deleteData(params) {
      const res = await fabricWidthTypeDelete({ id: params.row.id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getRulePage({
        page: this.pagination.page || 1,
        pageSize: this.pagination.pageSize || 20
      })
    },
    // 页面启用禁用
    changeEnable: debounce(
      function(data = {}, scope) {
        fabricWidthTypeEnabled(data)
          .then((res) => {
            this.$message({
              message: res.message ? res.message : '更新状态成功',
              type: 'success'
            })
            this.getRulePage({
              page: this.pagination.page || 1,
              pageSize: this.pagination.pageSize || 20
            })
          })
          .catch(() => {
            scope.row.enabled.code = scope.row.enabled.code === 'Y' ? 'N' : 'Y'
          })
      },
      300,
      true
    )
  }
}
</script>
<style lang="scss" scoped>
  .product-list-content /deep/.el-drawer__header {
    padding: 15px 20px;
    border: 1px solid #e9eff2;
    font-size: 18px;
    color: #151222;
  }
  .product-list-content /deep/ .el-drawer.customDrawerclass .content {
    height: calc(100% - 150px);
  }
  .product-list-content /deep/.el-table__fixed-right::before {
    height: 0;
  }
</style>
