<!--
 * @Author: Sanmao
 * @Date: 2020-11-03 10:13:59
 * @LastEditors: anthony
 * @LastEditTime: 2020-11-19 11:27:45
 * @Descripttion: 色号库-基础数据-色系列表
-->
<template>
  <div class="categoriesPage product-list-content">

    <div class="button">
      <el-button
        v-permission="['color:Api:ColorBd:ColorGrade:store']"
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="addList"
      >新增</el-button>
    </div>
    <!-- table表格 -->
    <div class="table page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        tooltip-effect="dark"
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
  colorSystemAdd,
  colorSystemEdit,
  colorSystemUpdate,
  colorSystemDelete,
  colorSystemApprove,
  colorSystemEnabled
} from './api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import enableSwitch from '@/views/basic-data/components/enableSwitch'
import logMethods from '@/views/product-center/mixin/log-methods'
import { debounce } from '@/utils'

export default {
  name: 'ColorSystemList',
  mixins: [logMethods],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['change'] })
    // 验证大写
    const checkData = (rule, value, callback) => {
      if (value.length !== 1) {
        callback(new Error('简称必须为一个字母'))
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
    const checkupperLimit = (rule, value, callback) => {
      var reg = /^((([1-9]\d*)(\.\d)?)|(0(\.[1-9])?)|0.0)$/
      this.upperLimitNew = value
      if (!reg.test(value) || value - 0 < this.lowerLimitNew - 0) {
        callback(new Error('上限必须为大于等于0的正数,保留小数点后一位,且上限大于等于下限'))
      } else {
        callback()
      }
    }
    const checklowerLimit = (rule, value, callback) => {
      if (this.upperLimitNew === '') {
        callback()
        return
      }
      var reg = /^((([1-9]\d*)(\.\d)?)|(0(\.[1-9])?)|0.0)$/
      this.lowerLimitNew = value
      if (!reg.test(value) || value - 0 > this.upperLimitNew - 0) {
        callback(new Error('下限必须为大于等于0的正数,保留小数点后一位,且下限小于等于上限'))
      } else {
        callback()
      }
    }
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: '50',
        showOverflowTooltip: true
      },
      {
        prop: 'name',
        label: '色级',
        showOverflowTooltip: true,
        minWidth: '80'
      },
      {
        prop: 'abbr',
        label: '简称',
        minWidth: '80'
      },
      {
        prop: 'lowerLimit',
        label: '下限',
        minWidth: '80'
      },
      {
        prop: 'upperLimit',
        label: '上限',
        minWidth: '80'
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
          permitTag: 'color:Api:ColorBd:ColorGrade:enable',
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
      },
      {
        prop: 'updator',
        label: '操作人',
        minWidth: '180',
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
        prop: 'operatedTime',
        label: '操作时间',
        minWidth: '140',
        formater: (scope) => {
          return this.$filters.parseTime(
            scope.row.operatedTime,
            '{y}-{m}-{d} {h}:{i}'
          )
        },
        showOverflowTooltip: true
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        itemType: 'input',
        prop: 'name',
        label: '色级',
        maxlength: 2,
        clearable: true,
        rules: [
          commonBlurReg,
          { message: '长度在 2 个字符以内', trigger: ['blur'] }
        ]
      },
      {
        itemType: 'input',
        prop: 'abbr',
        label: '简称',
        trim: ruleTrim,
        maxlength: 1,
        clearable: true,
        rules: [
          commonBlurReg,
          {
            validator: checkData,
            message: '简称必须为一个大写字母',
            trigger: ['change']
          }
        ],
        placeholder: '请输入一位大写字母'
      },
      {
        itemType: 'input',
        prop: 'lowerLimit',
        label: '下限',
        maxlength: 5,
        clearable: true,
        rules: [
          {
            required: true,
            validator: checklowerLimit,
            message: '下限必须为大于等于0的正数,保留小数点后一位,且下限小于等于上限',
            trigger: ['change']
          }
        ]
      },
      {
        itemType: 'input',
        prop: 'upperLimit',
        label: '上限',
        maxlength: 5,
        clearable: true,
        rules: [
          {
            required: true,
            validator: checkupperLimit,
            message: '上限必须为大于等于0的正数,保留小数点后一位,且上限大于等于下限',
            trigger: ['change']
          }
        ]
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
        permitTag: ['color:Api:ColorBd:ColorGrade:approve'],
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
              this.approveData(scope.row.id, scope)
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
        permitTag: ['color:Api:ColorBd:ColorGrade:update'],
        isShow: true,
        handle: (scope) => {
          if (scope.row.status.code === 'P') {
            this.$set(this.copyContent[0], 'disabled', true)
            this.$set(this.copyContent[1], 'disabled', true)
          } else {
            this.$set(this.copyContent[0], 'disabled', false)
            this.$set(this.copyContent[1], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', copyContent)
          this.type = 'edit'
          this.PopDialogHandle('编辑色系')
          this.editList({ id: scope.row.id }, scope.row.code)
        }
      },
      {
        label: '删除',
        permitTag: ['color:Api:ColorBd:ColorGrade:destroy'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: params => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'customClass'
          })
            .then(async() => {
              const res = await colorSystemDelete({ id: params.row.id })
              if (res.code !== 200) {
                return false
              }
              this.fetchLog(
                this.getLogMessages('UPDATE', '/color/api/colorBd/colorGrade/destroy', 'color'),
                { id: params.row.id, name: params.row.name },
                JSON.stringify({
                  beforeText: `在'色号花号库-基础数据管理-色级'删除一条记录`,
                  beforeCode: { id: params.row.id, name: params.row.name }
                })
              )
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getRulePage({
                page: this.pagination.page || 1,
                pageSize: this.pagination.pageSize || 20
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
      width: '180',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getRulePage({
          pageSize: this.pagination.pageSize || 20,
          page: val
        })
      },
      sizeChange: (val) => {
        this.getRulePage({ page: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增色级',
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
      formOtions: {
        inline: true
      },
      formDatas: {
        enabled: ''
      },
      copyContent,
      columns,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      type: 'add',
      visible: false,
      oldForm: {}, // 旧详情数据
      upperLimitNew: '',
      lowerLimitNew: ''
    }
  },
  created() {
    this.getRulePage()
  },
  methods: {
    addList() {
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新增色级')
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.copyContent[1], 'disabled', false)
      this.$set(this.copyContent[2], 'disabled', false)
      this.$set(this.copyContent[3], 'disabled', false)
      this.$set(this.copyContent[4], 'disabled', false)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增的确定事件
    async addData(data = {}) {
      const res = await colorSystemAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(
        this.getLogMessages('INSERT', '/color/api/colorBd/colorGrade/store', 'color'),
        { id: data.id, name: data.name },
        JSON.stringify({
          beforeText: `在'色号花号库-基础数据管理-色级'新增一条记录`,
          beforeCode: { id: data.id, name: data.name }
        })
      )
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
        const pamraskey = ['name', 'nameEn', 'abbr', 'lowerLimit', 'upperLimit', 'remark']
        pamraskey.forEach((v) => {
          obj[v] = params[v]
        })
        this.addData(obj)
      } else if (this.type === 'edit') {
        // 走编辑接口
        const obj = {}
        const pamraskey = ['id', 'name', 'nameEn', 'abbr', 'lowerLimit', 'upperLimit', 'remark']
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
      res.data.list && res.data.list.map((item, index) => { item.index = (res.data.page - 1) * res.data.pageSize + index + 1 })
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.page,
        pageSize: data.pageSize
      }
    },
    // 点击编辑
    async editList(data = {}, code) {
      const res = await colorSystemEdit(data)
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
      const res = await colorSystemUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.fetchLog(
        this.getLogMessages('UPDATE', '/color/api/colorBd/colorGrade/update', 'color'),
        { id: data.id, name: data.name },
        JSON.stringify({
          beforeText: `在'色号花号库-基础数据管理-色级'编辑一条记录`,
          beforeCode: { id: data.id, name: data.name }
        })
      )
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
    async approveData(id, scope) {
      const res = await colorSystemApprove({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(
        this.getLogMessages('UPDATE', '/color/api/colorBd/colorGrade/approve', 'color'),
        { id: scope.row.id, code: scope.row.code },
        JSON.stringify({
          beforeText: `在'色号花号库-基础数据管理-色级'审核一条记录`,
          beforeCode: { id: scope.row.id, name: scope.row.name }
        })
      )
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.getRulePage({
        page: this.pagination.page || 1,
        pageSize: this.pagination.pageSize || 20
      })
    },
    // 页面启用禁用
    changeEnable: debounce(
      async function(data = {}, scope) {
        const res = await colorSystemEnabled(data)
        if (res.code === 200) {
          this.fetchLog(
            this.getLogMessages('UPDATE', '/color/api/colorBd/colorGrade/enable', 'color'),
            { id: scope.row.id, name: scope.row.name },
            JSON.stringify({
              beforeText: `在"色号花号库-基础数据管理-色级"${data.enabled === 'Y' ? '启用' : '禁用'}一条记录`,
              beforeCode: { id: scope.row.id, name: scope.row.name }
            })
          )
          this.$message({
            message: res.message ? res.message : '更新状态成功',
            type: 'success'
          })
          this.getRulePage({
            page: this.pagination.page || 1,
            pageSize: this.pagination.pageSize || 20
          })
        } else {
          this.$message({
            message: res.message ? res.message : '更新状态失败',
            type: 'error'
          })
        }
      },
      300,
      true
    )
  }
}
</script>

<style lang="scss" scoped>
.product-list-content /deep/.el-table th.is-leaf, .el-table td {
  border-bottom: 0;
}
.product-list-content /deep/.el-table__header-wrapper {
  border-bottom: 1px solid #e9eff2;
}
.product-list-content /deep/ .el-drawer.customDrawerclass .content {
  height: calc(100% - 150px);
}
.categoriesPage .pop /deep/.el-drawer__header {
  padding-bottom: 15px;
  padding-top: 15px;
  padding-left: 20px;
  padding-right: 20px;
  border: 1px solid #e9eff2;
  font-size: 18px;
  color: #151222;
}
.product-list-content /deep/ .el-table__fixed-right::before {
  height: 0;
}
</style>
