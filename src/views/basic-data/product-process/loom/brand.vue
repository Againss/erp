<!--
 * @Descripttion: 品牌
 * @version:
 * @Author: shujing
 * @Date: 2020-09-24 15:25:11
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-01-04 10:38:27
-->

<template>
  <div class="brand">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增角色按钮 -->
    <!-- <div class="button">
      <el-button
        v-permission="['basic:loomBrands:store']"
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="addRange"
      >新增</el-button>
    </div> -->
    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        :data-total="dataSource.length"
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
import {
  sysDataGroupIndex,
  sysDataGroupEnable,
  sysDataGroupAdd,
  sysDataGroupModify,
  sysDataGroupDelete,
  sysDataGroupExam,
  sysDataGroupInfo
} from './api/index.js'
import enableSwitch from '@/views/basic-data/components/enableSwitch'
import { dataComparision } from '@/views/basic-data/common/index'

export default {
  name: 'Brand',
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 公共弹出框内容
    const commonContent = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '中文名',
        maxlength: 20,
        clearable: true,
        rules: [commonBlurReg, { min: 1, max: 20, message: '长度在1 到20 个字符', trigger: 'blur' }]
      },
      {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名',
        maxlength: 30,
        clearable: true,
        rules: [{ min: 1, max: 30, message: '长度在1 到30 个字符', trigger: 'blur' }]
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        label: '备注',
        maxlength: 100,
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    // 查看弹出框内容
    const ownDepartment = [
      ...commonContent
    ]

    // 查询表单配置信息
    const searchData = [
      {
        prop: 'name',
        itemType: 'input',
        label: '名称:',
        clearable: true,
        placeholder: '中文名/英文名'
      },
      {
        prop: 'enabled',
        itemType: 'select',
        label: '启用/禁用:',
        clearable: true,
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '启用',
            value: 'Y'
          },
          {
            label: '禁用',
            value: 'N'
          }
        ]
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getGroupPage(params)
          this.searchFormDatas = params
        },
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    ]
    // 表格表头配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        width: '60'

      },
      {
        prop: 'name',
        label: '中文名',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'nameEn',
        label: '英文名',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'enabled',
        label: '禁用/启用',
        minWidth: '120',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:loomBrands:enabled',
          changeStatus: (scope) => {
            this.EnableStatus({ id: scope.row.id }, scope)
          }
        }
      },
      {
        prop: 'statu',
        label: '状态',
        minWidth: '120',
        showOverflowTooltip: true
      }

    ]

    let popOperatesList = [
      {
        label: '审核',
        permitTag: ['basic:loomBrands:approve'],
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
              this.examGroup({ id: scope.row.id })
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
        permitTag: ['basic:loomBrands:update'],
        isShow: true,
        handle: scope => {
          if (scope.row.status.code === 'P') {
            this.$set(this.ownDepartment[1], 'disabled', true)
            this.$set(this.ownDepartment[2], 'disabled', true)
          } else {
            this.$set(this.ownDepartment[1], 'disabled', false)
            this.$set(this.ownDepartment[2], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', ownDepartment)
          this.PopDialogHandle('编辑品牌')
          this.getGroupInfo({ id: scope.row.id }, scope)
          // console.log(dataObj)
          this.type = 'edit'
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:loomBrands:destroy'],
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
              this.deleteGroup({ id: scope.row.id })
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
    popOperatesList = this.$filterPermission(popOperatesList)
    const popOperates = {
      label: '操作',
      width: '240',
      dataSource: popOperatesList
    }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getGroupPage({
          pageSize: this.pagination.pageSize || 20,
          page: val
        })
      },
      sizeChange: (val) => {
        this.getGroupPage({
          page: this.pagination.page || 1,
          pageSize: val
        })
      }
    }
    // 弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      size: '540px',
      okText: '保存',
      ok: (params) => {
        this.addOrModifyGroup(params)
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
      formOptions: {
        // labelWidth: '140px'
      },
      content: ownDepartment
      // component: PopDialog
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
      numId: 1,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      ownDepartment,
      searchFormDatas: {},
      type: 'add',
      dataFormList: [],
      rowInfoMessages: {},
      oldForm: {} // 旧详情数据
    }
  },
  computed: {

  },
  created() {
    this.getGroupPage()
  },
  methods: {
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 修改按钮
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 新增角色
    addRange() {
      this.type = 'add'
      this.$set(this.ownDepartment[1], 'disabled', false)
      this.$set(this.ownDepartment[2], 'disabled', false)
      this.PopDialogHandle('新增品牌')
      this.$set(this.popOptions, 'content', this.ownDepartment)
      this.$set(this.popOptions, 'formDatas', {})
      this.oldForm = this.ownDepartment.formDatas || {}
    },

    // 获取数据
    async getGroupPage(data = {}) {
      const res = await sysDataGroupIndex({ ...this.searchFormDatas, ...data })
      if (res.data && res.data.list) {
        res.data.list &&
          res.data.list.map((item, index) => {
            item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index)
            item.statu = item.status.describe
          })
        const dataList = res.data.list || []
        this.dataSource = dataList
        this.pagination = {
          ...this.pagination,
          dataTotal: res.data ? res.data.total : 0,
          ...data,
          currentPage: res.data.page,
          pageSize: res.data.pageSize,
          page: res.data.page
        }
      }
    },

    // 启用/禁用
    async EnableStatus(data = {}, scope) {
      const res = await sysDataGroupEnable(data)
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
    // 新增或者编辑
    addOrModifyGroup(params) {
      if (this.type === 'add') {
        const obj = {}
        const pamraskey = ['name', 'nameEn', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addGroup(obj)
      } else if (this.type === 'edit') {
        const obj = {}
        const pamraskey = ['id', 'name', 'nameEn', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.editGroup(obj)
      }
    },
    // 新增保存
    async addGroup(data = {}) {
      const res = await sysDataGroupAdd(data)
      if (res.code !== 200) {
        return false
      }

      this.$set(this.popOptions, 'visible', false)
      this.$message.success('添加成功')
      this.getGroupPage()
    },
    // 编辑保存
    async editGroup(data = {}) {
      const res = await sysDataGroupModify(data)
      if (res.code !== 200) {
        return false
      }

      this.$set(this.popOptions, 'visible', false)
      this.$message.success('编辑成功')
      this.getGroupPage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 删除
    async deleteGroup(data = {}) {
      const res = await sysDataGroupDelete(data)
      if (res.code !== 200) {
        return false
      }

      this.$message.success('删除成功')
      this.getGroupPage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 审核
    async examGroup(data = {}) {
      const res = await sysDataGroupExam(data)
      if (res.code !== 200) {
        return false
      }

      this.$message.success('审核成功')
      this.getGroupPage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },

    // 根据id获取详情
    async getGroupInfo(data = {}, scope) {
      const res = await sysDataGroupInfo(data)
      if (res.code !== 200) {
        return false
      }
      const dataList = res.data || {}
      dataList.code = scope.row.code
      this.oldForm = dataList
      this.setFormDatas({ ...dataList })
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

<style lang='scss'>
.brand {
  padding-bottom: 0;
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}

</style>

