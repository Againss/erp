<!--
 * @Author: xj
 * @Description: 基础数据》印花进度
 * @Date: 2020-12-10 10:30:55
 * @LastEditors: OBKoro1
 * @LastEditTime: 2021-01-11 15:17:28
-->
<template>
  <div class="countryArea">
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button
        v-permission="['soPrint:printProcessConf:add']"
        icon="el-icon-plus"
        size="small"
        type="primary"
        @click="addList"
      >新增</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        lazy
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
import enableSwitchOne from '@/views/customer-order/basic-data/component/enableSwitchOne'
import { dataComparision } from '@/views/basic-data/common/index'
import { sysDataGroupPage, countryAdd, countryUpdate, countryDetail, sysDataGroupApprove, sysDataGroupEnabled, sysDataGroupDelete } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  name: 'PrintingProgress',
  components: {},
  mixins: [logMethods],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const checkFrequency = (rule, value, callback) => {
      if (value.length !== 2) {
        callback(new Error('简称必须为2个字母'))
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
        prop: 'code',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'name',
        label: '中文名',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'enName',
        label: '英文名',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'shortName',
        label: '简称',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'type',
        label: '类型',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'enable.code',
        label: '启用/禁用',
        components: {
          enableSwitchOne
        },
        componentsOptions: {
          permitTag: 'soPrint:printProcessConf:isEnable',
          changeStatus: (scope) => {
            this.changeEnable({ id: scope.row.id, isEnable: scope.row.enable.code }, scope)
          }
        }
      },
      {
        prop: 'statu.describle',
        label: '状态',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.statu.describle
        }
      },
      {
        prop: 'createdBy',
        label: '操作人',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '150',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.updatedTime ? this.$filters.parseTime(scope.row.updatedTime + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      }
    ]
    // 操作栏 和权限配置
    let popOperatesDataSource = [
      {
        label: '审核',
        isShow: (scope) => {
          return scope.row.statu.code === 'N'
        },
        permitTag: ['soPrint:printProcessConf:opare'],
        handle: scope => {
          this.$confirm('确认审核当前数据吗？', '提示', {
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              this.approveFabricTypes(scope.row.id)
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
        permitTag: ['soPrint:printProcessConf:modify'],
        isShow: true,
        handle: scope => {
          if (scope.row.statu.code === 'Y') {
            this.$set(this.copyContent[0], 'disabled', true)
            this.$set(this.copyContent[1], 'disabled', false)
            this.$set(this.copyContent[2], 'disabled', true)
            this.$set(this.copyContent[3], 'disabled', false)
            this.$set(this.copyContent[4], 'disabled', false)
          } else {
            this.$set(this.copyContent[0], 'disabled', false)
            this.$set(this.copyContent[1], 'disabled', false)
            this.$set(this.copyContent[2], 'disabled', false)
            this.$set(this.copyContent[3], 'disabled', false)
            this.$set(this.copyContent[4], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', copyContent)
          this.type = 'edit'
          this.PopDialogHandle('编辑')
          this.editList({ id: scope.row.id }, scope.row.code)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['soPrint:printProcessConf:delete'],
        isShow: (scope) => {
          return scope.row.statu.code === 'N'
        },
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              this.deleteData(scope.row.id)
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '160',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.getListData({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.getListData({ pageNum: this.pagination.page || 1, pageSize: val })
      }
    }
    // 新增弹窗中的字段
    const commonContent = [
      {
        itemType: 'input',
        prop: 'name',
        label: '中文名',
        maxlength: 20,
        clearable: true,
        rules: [commonBlurReg, { message: '长度在 20 个字符以内', trigger: ['blur'] }]
      },
      {
        itemType: 'input',
        prop: 'enName',
        label: '英文名',
        maxlength: 30,
        clearable: true
      },
      {
        itemType: 'input',
        prop: 'shortName',
        label: '简称',
        maxlength: 2,
        clearable: true,
        trim: ruleTrim,
        rules: [commonBlurReg, { validator: checkFrequency, trigger: ['blur'] }]
      },
      {
        prop: 'type',
        itemType: 'select',
        type: 'radio',
        label: '类型',
        clearable: true,
        dataSource: [
          {
            label: '印花',
            value: '印花'
          },
          {
            label: '底布',
            value: '底布'
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
    const copyContent = [
      ...commonContent
    ]
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增',
      okText: '保存',
      ok: params => {
        // const originData = JSON.parse(JSON.stringify(params))
        // if (originData.type) {
        //   originData.type = params.type === 1 ? '印花' : '底布'
        // }
        // this.addOrEdit(originData)
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
      type: 'add',
      columns,
      pagination,
      popOperates,
      copyContent,
      popOptions,
      dataSource: [],
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.getListData()
  },
  mounted() { },
  methods: {
    // 新增
    addList() {
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.$set(this.copyContent[0], 'disabled', false)
      this.$set(this.copyContent[1], 'disabled', false)
      this.$set(this.copyContent[2], 'disabled', false)
      this.$set(this.copyContent[3], 'disabled', false)
      this.$set(this.copyContent[4], 'disabled', false)
      this.PopDialogHandle('新增')
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增、编辑印花进度
    addOrEdit(params) {
      if (this.type === 'add') {
        const obj = {}
        const pamraskey = ['name', 'enName', 'shortName', 'type', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addData(obj)
      } else if (this.type === 'edit') {
        const obj = {}
        const pamraskey = ['id', 'name', 'enName', 'shortName', 'type', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
      }
    },
    // 新增的确定事件印花进度
    async addData(data = {}) {
      const res = await countryAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      this.fetchLog(
        this.getLogMessages('INSERT', '/customerOrder/soPrint/printProcessConf/add', 'customerOrder'),
        data,
        JSON.stringify({
          beforeText: `在'客户订单-基础数据-印花SO基础数据'新增一条记录`,
          beforeCode: data
        })
      )
      this.getListData()
    },
    // 编辑印花进度
    async addUpdate(data = {}) {
      const res = await countryUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      const { beforeCode, afterCode } = this.compareData(this.oldForm, data, 'id')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(
        this.getLogMessages('UPDATE', '/customerOrder/soPrint/printProcessConf/modify', 'customerOrder'),
        data,
        JSON.stringify({
          beforeText: `在'客户订单-基础数据-印花SO基础数据'将${JSON.stringify({ 'id': data.id })}`,
          afterText: '修改为',
          ...{ beforeCode, afterCode }
        })
      )
      this.getListData({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 页面启用禁用
    async changeEnable(data = {}, scope) {
      const res = await sysDataGroupEnabled(data).catch(() => {
        scope.row.enable.code = scope.row.enable.code === 'Y' ? 'N' : 'Y'
      })
      if (res.code === 200) {
        this.$message({
          message: '更新状态成功',
          type: 'success'
        })
        this.fetchLog(
          this.getLogMessages('UPDATE', '/customerOrder/soPrint/printProcessConf/isEnable', 'customerOrder'),
          { id: scope.row.id },
          JSON.stringify({
            beforeText: `在"客户订单-基础数据-印花SO基础数据"${scope.row.enable.code === 'Y' ? '启用' : '禁用'}一条记录`,
            beforeCode: { id: scope.row.id }
          })
        )
      } else {
        this.$message({
          message: res.message ? res.message : '更新状态失败',
          type: 'error'
        })
      }
    },
    // 获取列表数据
    async getListData(data = {}) {
      const res = await sysDataGroupPage(data)
      res.data.list && res.data.list.map((item, index) => { item.code = res.data.total - ((res.data.pageNum - 1) * res.data.pageSize + index) })
      const listData = res.data && res.data.list && res.data.list.length ? res.data.list : []
      this.dataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data ? res.data.total : 0,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: data.pageSize,
        page: res.data.pageNum
      }
    },
    // 点击列表编辑获取详情
    async editList(data = {}, code) {
      const res = await countryDetail(data)
      if (!res || res.code !== 200) {
        return false
      }
      const editData = res.data || {}
      this.oldForm = { ...editData, code: code }
      this.setFormDatas({ ...editData, code: code })
    },
    // 列表印花审核
    async approveFabricTypes(id) {
      const res = await sysDataGroupApprove({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.fetchLog(
        this.getLogMessages('UPDATE', '/customerOrder/soPrint/printProcessConf/opare', 'customerOrder'),
        { id: id },
        JSON.stringify({
          beforeText: `在'客户订单-基础数据-印花SO基础数据'审核一条记录`,
          beforeCode: { id: id }
        })
      )
      this.getListData({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 删除列表印花
    async deleteData(id) {
      const res = await sysDataGroupDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.fetchLog(
        this.getLogMessages('DEL', '/customerOrder/soPrint/printProcessConf/delete', 'customerOrder'),
        { id: id },
        JSON.stringify({
          beforeText: `在'客户订单-基础数据-印花SO基础数据'删除一条记录`,
          beforeCode: { id: id }
        })
      )
      this.getListData({ pageNum: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
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
    // 点击编辑时处理数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    }
  }
}
</script>

<style lang="scss">
.countryArea {
  padding: 20px;
  padding-bottom: 0px;
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>
