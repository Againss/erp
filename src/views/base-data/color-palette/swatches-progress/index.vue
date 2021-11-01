/**
 * @Description: 色板项目进度
 * @author ll
 * @date 2021/01/13
*/
<template>
  <div class="fabricTypes">
    <!-- 新增 -->
    <div class="button">
      <el-button
        v-permission="['customerOrder:colorModel:colorModelScheduleConf:add']"
        size="small"
        icon="el-icon-plus"
        type="primary"
        @click="addClick"
      >新增</el-button>
    </div>
    <!-- 布种表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 导入布种pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import enableSwitch from '@/views/customer-order/public/components/enableSwitch'
import { dataComparision } from '@/views/customer-order/common/index'
import { sysDataGroupPage, sysDataGroupAdd, sysDataGroupModify, sysDataGroupApprove, sysDataGroupEnabled, sysDataGroupDelete, sysDataGroupDetail } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  mixins: [logMethods],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const checkFrequency = (rule, value, callback) => {
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
    const content = [
      {
        prop: 'name',
        itemType: 'input',
        label: '中文名',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { min: 1, max: 20, message: '长度在1 到20 个字符', trigger: 'blur' }]
      },
      {
        prop: 'enName',
        itemType: 'input',
        label: '英文名',
        clearable: true,
        maxlength: 30
      },
      {
        prop: 'shortName',
        itemType: 'input',
        label: '简称',
        clearable: true,
        placeholder: '请输入两位大写字母',
        maxlength: 2,
        trim: ruleTrim,
        rules: [commonBlurReg, { validator: checkFrequency, trigger: 'change' }]
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
        prop: 'enName',
        label: '英文名',
        showOverflowTooltip: true
      },
      {
        prop: 'shortName',
        label: '简称'
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      },
      {
        prop: 'isEnable',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'customerOrder:colorModel:colorModelScheduleConf:isEnable',
          changeStatus: (scope) => {
            this.enableStatus({ id: scope.row.id, isEnable: scope.row.isEnable })
          }
        }
      },
      {
        prop: 'status',
        label: '状态',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.status === 'Y' ? '已审核' : '未审核'
        }
      },
      {
        prop: 'updatedBy',
        label: '操作人',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '150',
        showOverflowTooltip: true
      }
    ]
    let popOperatesDataSource = [
      {
        label: '审核',
        permitTag: ['customerOrder:colorModel:colorModelScheduleConf:approve'],
        isShow: (scope) => {
          return scope.row.status === 'N'
        },
        handle: scope => {
          this.$confirm('确认审核当前数据吗？', '提示', {
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              this.approveSwatchesProgress(scope.row.id)
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
        permitTag: ['customerOrder:colorModel:colorModelScheduleConf:modify'],
        isShow: true,
        handle: scope => {
          if (scope.row.status === 'Y') {
            this.$set(this.content[0], 'disabled', true)
            this.$set(this.content[2], 'disabled', true)
          } else {
            this.$set(this.content[0], 'disabled', false)
            this.$set(this.content[2], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', content)
          this.type = 'edit'
          this.PopDialogHandle('编辑色板项目进度')
          this.getGroupInfo({ id: scope.row.id }, scope.row.code)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['customerOrder:colorModel:colorModelScheduleConf:delete'],
        isShow: (scope) => {
          return scope.row.status === 'N'
        },
        handle: scope => {
          this.$confirm('确认删除当前数据吗？', '提示', {
            type: 'warning',
            cancelButtonClass: 'btn-cancel'
          })
            .then(() => {
              this.deleteSwatchesProgress(scope.row.id)
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
        this.getListData({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      titile: '新增',
      okText: '保存',
      ok: params => {
        this.swatchesProgressOption(params)
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
      columns,
      content,
      pagination,
      popOperates,
      popOptions,
      dataSource: [],
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
    async getListData(data = {}) {
      const res = await sysDataGroupPage(data)
      res.data && res.data.list && res.data.list.map((item, index) => { item.code = res.data.total - ((res.data.pageNum - 1) * res.data.pageSize + index) })
      const dataList = res.data ? res.data.list : []
      this.dataSource = dataList
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageNum: res.data.pageNum
      }
    },
    // 色板项目进度启用、禁用
    async enableStatus(data = {}) {
      const res = await sysDataGroupEnabled(data)
      if (res.code === 200) {
        this.$message({
          message: '更新状态成功',
          type: 'success'
        })
        this.fetchLog(
          this.getLogMessages('UPDATE', '/customerOrder/colorModel/colorModelScheduleConf/isEnable', 'customerOrder'),
          { id: data.id },
          JSON.stringify({
            beforeText: `在"客户订单-基础数据-色板项目进度"${data.isEnable === 'Y' ? '启用' : '禁用'}一条记录`,
            beforeCode: { id: data.id }
          })
        )
      } else {
        this.$message({
          message: res.message ? res.message : '更新状态失败',
          type: 'error'
        })
      }
    },
    // 点击新增
    addClick() {
      this.type = 'add'
      this.oldForm = this.content.formDatas || {}
      this.$set(this.content[0], 'disabled', false)
      this.$set(this.content[2], 'disabled', false)
      this.PopDialogHandle('新增色板项目进度')
      this.$set(this.popOptions, 'content', this.content)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增、编辑色板项目进度
    swatchesProgressOption(params) {
      if (this.type === 'add') {
        const obj = {}
        const pamraskey = ['name', 'enName', 'shortName', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.swatchesProgressAdd(obj)
      } else if (this.type === 'edit') {
        const obj = {}
        const pamraskey = ['id', 'name', 'enName', 'shortName', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.swatchesProgressEdit(obj)
      }
    },
    // 色板项目进度新增
    async swatchesProgressAdd(data = {}) {
      const res = await sysDataGroupAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.fetchLog(
        this.getLogMessages('INSERT', '/customerOrder/colorModel/colorModelScheduleConf/add', 'customerOrder'),
        data,
        JSON.stringify({
          beforeText: `在'客户订单-基础数据-色板项目进度'新增一条记录`,
          beforeCode: data
        })
      )
      this.getListData()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    // 色板项目进度编辑
    async swatchesProgressEdit(data = {}) {
      const res = await sysDataGroupModify(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      const { beforeCode, afterCode } = this.compareData(this.oldForm, data, 'id')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(
        this.getLogMessages('UPDATE', '/customerOrder/colorModel/colorModelScheduleConf/modify', 'customerOrder'),
        data,
        JSON.stringify({
          beforeText: `在'客户订单-基础数据-色板项目进度'将${JSON.stringify({ 'id': data.id })}`,
          afterText: '修改为',
          ...{ beforeCode, afterCode }
        })
      )
      this.getListData({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 审核色板项目进度
    async approveSwatchesProgress(id) {
      const res = await sysDataGroupApprove({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      // this.fetchLog(
      //   this.getLogMessages('UPDATE', '/customerOrder/colorModel/colorModelScheduleConf/approve', 'customerOrder'),
      //   { id: id },
      //   JSON.stringify({
      //     beforeText: `在'客户订单-基础数据-色板项目进度'审核一条记录`,
      //     beforeCode: { id: id }
      //   })
      // )
      this.getListData({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 删除色板项目进度
    async deleteSwatchesProgress(id) {
      const res = await sysDataGroupDelete(id)
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.fetchLog(
        this.getLogMessages('DEL', '/customerOrder/colorModel/colorModelScheduleConf/delete', 'customerOrder'),
        { id: id },
        JSON.stringify({
          beforeText: `在'客户订单-基础数据-色板项目进度'删除一条记录`,
          beforeCode: { id: id }
        })
      )
      this.getListData({ pageNum: this.pagination.pageNum || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 色板项目进度详情
    async getGroupInfo(data = {}, code) {
      const res = await sysDataGroupDetail(data)
      if (res.code !== 200) {
        return false
      }
      const dataList = res.data || {}
      this.oldForm = { ...dataList, code: code }
      this.setFormDatas({ ...dataList, code: code })
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

<style lang="scss" scoped>
.fabricTypes {
  padding: 20px;
  padding-bottom: 0;
}
</style>

