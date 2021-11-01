<!--
 * @Descripttion: 选项配置
 * @Author: admin
 * @Date: 2021-06-03 11:00
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-06-25 13:49:26
-->
<template>
  <div class="config-list">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
      <el-button
        v-permission="['basic:optionConfig:store']"
        size="small"
        icon="el-icon-plus"
        type="primary"
        @click="addList"
      >新增</el-button>
    </div>
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
      <cs-custom-pop ref="hscodePop" :options="popOptions" />
    </div>
  </div>
</template>
<script>
import {
  sysOptionConfigList,
  sysOptionConfigInfo,
  sysOptionConfigModify,
  sysOptionConfigAdd,
  sysOptionConfigExam,
  sysOptionConfigDelete
} from './api/index.js'
import enableSwitch from './components/configEnabled'
import moreShow from './components/moreShow'
import { dataComparision } from '@/views/basic-data/common/index'
export default {
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 查询表单配置信息
    const searchData = {
      _name: {
        prop: 'fieldName',
        itemType: 'input',
        label: '字段名'
      },
      _operate: {
        itemType: 'operate',
        submitHandle: params => {
          this.searchFormDatas = params
          this.getGroupPage(params)
        },
        submitText: '查询',
        resetHandle: () => {
          this.searchFormDatas = {}
        }
      }
    }
    // 表格表头信息
    const columns = {
      _code: {
        prop: 'code',
        label: '序号',
        width: '100'
      },
      _name: {
        prop: 'fieldName',
        label: '字段名',
        minWidth: '100',
        showOverflowTooltip: true
      },
      _fieldValue: {
        prop: 'fieldValue',
        label: '字段取值',
        minWidth: '150',
        components: {
          moreShow
        },
        componentsOptions: {
          type: 'fieldValue'
        }
      },
      _statu: {
        prop: 'statu',
        label: '状态',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.status
            ? scope.row.status.describe === '已审核'
              ? `<span style="color:#00BCC5;">${scope.row.status && scope.row.status.describe}</span>`
              : `<span style="color:#FF9B02">${scope.row.status && scope.row.status.describe}</span>`
            : ''
        }
      }
    }
    // 表格操作事件
    let popOperatesList = [
      {
        label: '审核',
        permitTag: ['basic:optionConfig:approve'],
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
          }).then(() => {
            this.examGroup({ id: scope.row.id })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消审核'
            })
          })
        }
      },
      {
        label: '编辑',
        permitTag: ['basic:hsCode:update'],
        isShow: true,
        handle: async scope => {
          if (scope.row.status.code === 'P') {
            this.$set(this.ownDepartment[1], 'disabled', true)
          } else {
            this.$set(this.ownDepartment[1], 'disabled', false)
          }
          this.PopDialogHandle('编辑选项配置')
          await this.getGroupInfo({ id: scope.row.id }, scope)
          this.type = 'edit'
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:optionConfig:destroy'],
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
          }).then(() => {
            this.deleteGroup({ id: scope.row.id })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }
    ]
    popOperatesList = this.$filterPermission(popOperatesList)
    // 表格操作信息
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
    // form表格clums数据
    const popTableColumns = [
      {
        prop: 'fieldValue',
        label: '字段取值',
        className: 'ruleTip',
        editOptions: {
          labelWidth: '0',
          itemType: 'input',
          maxlength: 20,
          rules: [
            {
              required: true,
              message: '字段取值不能为空',
              trigger: ['blur']
            }
          ]
        }
      },
      {
        prop: 'status',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          changeStatus: (scope, formDatas, setFormDatas, status) => {
            const data = [...formDatas.tableForm]
            data[scope.$index].status = status
            this.$set(this.popOptions.formDatas, 'tableForm', data)
          }
        }
      }
    ]
    // 弹出框表格操作信息
    const configPopOperates = [
      {
        label: '增加',
        isShow: true,
        // isShow: (scope) => {
        //   return scope.row.disabled
        // },
        handle: (params, form, formDatas, setformdatas) => {
          const popTableParams = {
            status: 1,
            // enabled: 'Y',
            disabled: true,
            edit: true
          }
          const data = [...formDatas['tableForm']]
          data.push(popTableParams)
          // data.unshift(popTableParams)
          if (this.popOptions.visible) {
            this.$set(this.popOptions.content[2], 'dataSource', data)
          }
          this.scollBody()
        }
      },
      {
        label: '删除',
        isShow: (scope) => {
          return scope.row.disabled
        },
        style: { 'color': '#FE4949' },
        handle: (params, form, formDatas, setformdatas) => {
          this.$confirm('确认删除该条字段取值？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          }).then(() => {
            const data = [...formDatas['tableForm']]
            if (data.length > 1) {
              data.splice(params.$index, 1)
              if (params.row.id) {
                this.deletedIds.push(params.row.id)
              }
            }
            // console.log(data, 'popTabel数据', this.deletedIds)
            if (this.popOptions.visible) {
              this.$set(this.popOptions.content[2], 'dataSource', data)
            }
          }).catch(() => {
            this.$message({ type: 'info', message: '已取消删除' })
          })
        }
      }
    ]
    // 弹出框form配置信息
    const ownDepartment = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'fieldName',
        itemType: 'input',
        label: '字段名',
        rules: [commonBlurReg]
      },
      {
        prop: 'tableForm',
        itemType: 'table-form',
        className: 'OptionTableForm',
        props: { edit: 'edit' },
        maxHeight: '600',
        border: true,
        dataSource: [],
        columns: popTableColumns,
        operates: {
          label: '操作',
          dataSource: configPopOperates
        }
      }
    ]
    // 弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '',
      size: '540px',
      okText: '保存',
      ok: (params) => {
        // console.log(params, '保存数据')
        if (!this.checkValue(params.tableForm)) {
          this.$message({
            message: '同一个字段名的字段取值不能重复！',
            type: 'warning'
          })
        } else {
          params.fieldValueArr = params.tableForm
          params.deletedIds = this.deletedIds
          delete params.tableForm
          this.editGroup(params)
        }
      },
      cancel: (params) => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: ownDepartment
    }
    return {
      searchData,
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {},
      columns,
      dataSource: [],
      popOperates,
      pagination,
      popOptions,
      ownDepartment,
      type: 'add',
      searchFormDatas: {},
      dataList: {}, // 编辑详情数据
      oldForm: {}, // 旧详情数据
      popTableData: [], // 弹窗tabel数据
      deletedIds: [], // 删除字段值ID集
      popTableColumns,
      fullHeight: document.documentElement.clientHeight
    }
  },
  watch: {
    fullHeight(val) {
      this.$set(this.popOptions.content[2], 'maxHeight', val - 290)
    }
  },
  created() {
    this.getGroupPage()
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight
        this.fullHeight = window.fullHeight
      })()
    }
  },
  methods: {
    // 新增
    addList() {
      this.type = 'add'
      this.PopDialogHandle('新增选项配置')
      this.$set(this.ownDepartment[1], 'disabled', false)
      this.popTableData = [
        {
          fieldValue: '',
          status: 1,
          edit: true
        }
      ]
      this.$set(this.popOptions.content[2], 'dataSource', this.popTableData)
      this.$set(this.popOptions, 'formDatas', {})
      console.log(this.$refs.hscodePop)
    },
    // 展示弹窗
    PopDialogHandle(val) {
      this.tebHeight()
      this.deletedIds = []
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      this.$set(this.popOptions, 'content', this.ownDepartment)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 弹框取消数据比较回调
    CompaCallback(hadInput) {
      if (hadInput) {
        this.$set(this.popOptions, 'visible', false)
      } else {
        this.$set(this.popOptions, 'visible', false)
      }
    },
    // 获取列表数据
    async getGroupPage(data = {}) {
      const res = await sysOptionConfigList({ ...this.searchFormDatas, ...data })
      if (res.data && res.data.list) {
        res.data.list &&
          res.data.list.map((item, index) => {
            item.code = (res.data.page - 1) * res.data.pageSize + index + 1
            item.statu = item.status.describe
          })
      }
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
    },
    // 根据id获取详情
    async getGroupInfo(data = {}, scope) {
      const res = await sysOptionConfigInfo(data)
      if (res.code !== 200) {
        return false
      }
      this.dataList = res.data || {}
      this.popTableData = res.data.fieldValueArr || []
      this.popTableData && this.popTableData.map((item) => {
        if (this.dataList.status && this.dataList.status.code === 'P') {
          item.disabled = false
          item.edit = false
        } else {
          item.edit = true
          item.disabled = true
        }
        item.status = item.status.code
      })
      // if (this.popTableData.length === 0) {
      //   this.popTableData = [
      //     {
      //       namevalue: '',
      //       status: 1,
      //       enabled: 'Y',
      //       disabled: false,
      //       edit: true
      //     }
      //   ]
      // }
      this.$set(this.popOptions.content[2], 'dataSource', this.popTableData)
      this.dataList.code = scope.row.code
      this.oldForm = this.dataList
      this.setFormDatas({ ...this.dataList })
    },
    // 修改按钮
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 审核
    async examGroup(data = {}) {
      const res = await sysOptionConfigExam(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('审核成功')
      this.getGroupPage()
    },
    // 删除
    async deleteGroup(data = {}) {
      const res = await sysOptionConfigDelete(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      this.getGroupPage()
    },
    // 保存
    async editGroup(data = {}) {
      // console.log(this.type)
      if (this.type === 'add') {
        this.Add(data)
      }
      if (this.type === 'edit') {
        this.Edit(data)
      }
    },
    // 新增
    async Add(data) {
      const res = await sysOptionConfigAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('添加成功')
      this.getGroupPage()
    },
    // 编辑
    async Edit(data) {
      const res = await sysOptionConfigModify(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('编辑成功')
      this.getGroupPage()
    },
    // 同一个字段名的字段取值唯一性验证
    checkValue(data) {
      const obj = {}
      const flag = data.every(item => {
        const isRepeat = obj[item.fieldValue] ? false : obj[item.fieldValue] = true
        return isRepeat
      })
      return flag
    },
    // 设置tabel高度
    tebHeight() {
      this.$set(this.popOptions.content[2], 'maxHeight', document.documentElement.clientHeight - 290)
    },
    // 滚动条置底
    scollBody() {
      const container = this.$el.querySelector('.OptionTableForm').childNodes[2]
      this.$nextTick(() => {
        container.scrollTop = container.scrollHeight
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.config-list {
  position: relative;
  padding: 20px;
  padding-bottom: 0;
  .search{
    .el-button{
      position: absolute;
      top: 40px;
      right: 40px;
    }
  }
}
</style>
<style lang='scss'>
.config-list{
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
  .OptionTableForm {
    .el-table--medium td {
      padding: 10px 0 0;
    }
    .el-table__body-wrapper .cell {
      padding-bottom: 16px;
    }
    .el-table__header .ruleTip .cell::before {
      display: block;
      content: '*';
      position: absolute;
      left: 4px;
      color: #FE4949;
    }
    table {
      tr {
        background-color: #fff;
      }
    }
  }
  .OptionTableForm th.is-leaf {
    border-bottom: 1px solid #dfe6ec!important;
  }
}
</style>
