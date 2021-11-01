/**
 * @Description: 成品布面效果
 * @author ll
 * @date 2020/10/21
*/
<template>
  <div class="clothEffect">
    <!-- tab切换 -->
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="毛羽" name="MY" />
        <el-tab-pane label="毛圈" name="MQ" />
        <el-tab-pane label="手感" name="SG" />
        <el-tab-pane label="毛效" name="MX" />
        <el-tab-pane label="吸水性" name="XSX" />
        <el-tab-pane label="弹性" name="TX" />
      </el-tabs>
      <!-- 新增 -->
      <div class="button">
        <el-button
          v-permission="['basic:finishedFabric:store']"
          size="small"
          icon="el-icon-plus"
          type="primary"
          @click="addClick"
        >新增</el-button>
      </div>
    </div>

    <!-- 布种表格 -->
    <div v-if="activeName === 'SG' || activeName === 'MX'" class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="superiorColumns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        table-scrollx
      />
    </div>
    <div v-else class="page-table">
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
    <!-- 导入布种pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="conmmonPopOptions" />
    </div>
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import enableSwitch from '@/views/basic-data/components/enableSwitch'
import { dataComparision } from '@/views/basic-data/common/index'
import { filterOptions } from '@/views/basic-data/common/index'
import { sysDataGroupPage, sysDataGroupAdd, sysDataGroupUpdate, sysDataGroupDelete, sysDataGroupApprove, sysDataGroupEnabled, sysDataGroupDetail, sysDataGroupOption } from './api/index.js'
export default {
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 弹出框单选change事件
    const radioChange = value => {
      if (value === 1) {
        this.$set(this.conmmonPopOptions, 'content', firstName)
      } else if (value === 2) {
        this.$set(this.conmmonPopOptions, 'content', secondName)
      }
    }
    // 验证大写
    const checkData = (rule, value, callback) => {
      if (value && value.length !== 1) {
        callback(new Error('简称必须为一位字母'))
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
    // 列表 - 毛羽、毛圈、吸水性、弹性
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
        prop: 'abbr',
        label: '简称'
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      },
      {
        prop: 'enabled',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:finishedFabric:enabled',
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
          return scope.row.status
            ? scope.row.status.describe === '已审核'
              ? `<span style="color:#00BCC5;">${scope.row.status && scope.row.status.describe
              }</span>`
              : `<span style="color:#FF9B02">${scope.row.status && scope.row.status.describe
              }</span>`
            : ''
        }
      }
    ]
    // 列表 - 手感、毛效
    const superiorColumns = [
      {
        prop: 'code',
        label: '序号',
        width: '70'
      },
      {
        prop: 'parentName',
        label: '所属上级',
        showOverflowTooltip: true
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
        prop: 'abbr',
        label: '简称'
      },
      {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true
      },
      {
        prop: 'enabled',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'basic:finishedFabric:enabled',
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
          return scope.row.status
            ? scope.row.status.describe === '已审核'
              ? `<span style="color:#00BCC5;">${scope.row.status && scope.row.status.describe
              }</span>`
              : `<span style="color:#FF9B02">${scope.row.status && scope.row.status.describe
              }</span>`
            : ''
        }
      }
    ]
    // 公共弹出框内容
    const commonContent = [
      {
        prop: 'level',
        itemType: 'radio-group',
        label: '',
        change: radioChange,
        dataSource: [
          {
            label: '一级名称',
            value: 1
          },
          {
            label: '二级名称',
            value: 2
          }
        ]
      },
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true
      }
    ]
    const commonContent1 = [
      {
        prop: 'name',
        itemType: 'input',
        label: '中文名',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg]
      },
      {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名',
        clearable: true,
        maxlength: 200,
        rules: [commonBlurReg]
      },
      {
        prop: 'abbr',
        itemType: 'input',
        label: '简称',
        clearable: true,
        trim: ruleTrim,
        maxlength: 1,
        placeholder: '请输入一位大写字母',
        rules: [commonBlurReg, { validator: checkData, message: '简称必须为一位大写字母', trigger: ['change'] }]
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        maxlength: 100,
        label: '备注',
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    // 一级名称弹框内容
    const firstName = [
      ...commonContent,
      ...commonContent1
    ]
    // 二级名称弹框内容
    const secondName = [
      ...commonContent,
      {
        prop: 'parentId',
        itemType: 'select',
        filterable: true,
        label: '所属上级',
        clearable: true,
        rules: [commonBlurReg],
        visibleChange: (value) => {
          if (value && this.activeName === 'SG') {
            this.getFeelParent()
          }
          if (value && this.activeName === 'MX') {
            this.getEffectParent()
          }
        },
        dataSource: []
      },
      ...commonContent1
    ]
    // 新增--毛效，毛圈，吸水性，弹性
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
        label: '中文名',
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg]
      },
      {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名',
        clearable: true,
        maxlength: 200,
        rules: [commonBlurReg]
      },
      {
        prop: 'abbr',
        itemType: 'input',
        label: '简称',
        clearable: true,
        trim: ruleTrim,
        maxlength: 1,
        placeholder: '请输入一位大写字母',
        rules: [commonBlurReg, { validator: checkData, message: '简称必须为一位大写字母', trigger: ['change'] }]
      },
      {
        prop: 'remark',
        itemType: 'input',
        type: 'textarea',
        maxlength: 100,
        label: '备注',
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    const copyContent = [
      ...content
    ]
    let popOperatesDataSource = [
      {
        label: '审核',
        permitTag: ['basic:finishedFabric:approve'],
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
              this.clothEffectApprove(scope.row.id)
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
        permitTag: ['basic:finishedFabric:update'],
        isShow: true,
        handle: scope => {
          if (this.activeName === 'SG' || this.activeName === 'MX') {
            this.$set(this.commonContent[0], 'disabled', true)
            if (scope.row.status.code === 'P') {
              this.$set(this.firstName[2], 'disabled', true)
              this.$set(this.firstName[3], 'disabled', true)
              this.$set(this.firstName[4], 'disabled', true)
              this.$set(this.secondName[3], 'disabled', true)
              this.$set(this.secondName[4], 'disabled', true)
              this.$set(this.secondName[5], 'disabled', true)
            } else {
              this.$set(this.firstName[2], 'disabled', false)
              this.$set(this.firstName[3], 'disabled', false)
              this.$set(this.firstName[4], 'disabled', false)
              this.$set(this.secondName[3], 'disabled', false)
              this.$set(this.secondName[4], 'disabled', false)
              this.$set(this.secondName[5], 'disabled', false)
            }
            if (scope.row.level === 1) {
              this.id = ''
              this.$set(this.conmmonPopOptions, 'content', firstName)
            } else if (scope.row.level === 2) {
              this.id = '' + scope.row.parent.id
              this.$set(this.conmmonPopOptions, 'content', secondName)
            }
            if (this.activeName === 'SG') {
              this.getFeelParent()
            }
            if (this.activeName === 'MX') {
              this.getEffectParent()
            }
            this.type = 'edit'
            this.conmmonPopDialogHandle(`编辑${this.tabName}`)
            this.$set(this.conmmonPopOptions, 'formDatas', {})
            this.getGroupInfo({ id: scope.row.id }, scope.row.code)
          } else {
            if (scope.row.status.code === 'P') {
              this.$set(this.copyContent[1], 'disabled', true)
              this.$set(this.copyContent[2], 'disabled', true)
              this.$set(this.copyContent[3], 'disabled', true)
            } else {
              this.$set(this.copyContent[1], 'disabled', false)
              this.$set(this.copyContent[2], 'disabled', false)
              this.$set(this.copyContent[3], 'disabled', false)
            }
            this.$set(this.popOptions, 'content', copyContent)
            this.type = 'edit'
            this.PopDialogHandle(`编辑${this.tabName}`)
            this.getGroupInfo({ id: scope.row.id }, scope.row.code)
          }
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:finishedFabric:destroy'],
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
              this.clothEffectDelete(scope.row.id)
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
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      titile: '新增',
      okText: '保存',
      ok: params => {
        this.clothEffectOption(params)
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
    const conmmonPopOptions = {
      itemType: 'drawer',
      visible: false,
      titile: '新增',
      okText: '保存',
      ok: params => {
        this.clothEffectOption(params)
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
      content: firstName
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
    return {
      id: '',
      activeName: 'MY',
      tabName: '毛羽',
      columns,
      firstName,
      secondName,
      commonContent,
      copyContent,
      superiorColumns,
      pagination,
      popOperates,
      popOptions,
      conmmonPopOptions,
      dataSource: [],
      feelParentOption: [],
      effectParentOption: [],
      pamraskey: [],
      parentInput: false,
      oldForm: {} // 旧详情数据
    }
  },
  computed: {
    getAddPermiTag() {
      let permiTag = ''
      switch (this.activeName) {
        case 'MY':
          permiTag = ''
          break
        case 'MQ':
          permiTag = ''
          break
        case 'SG':
          permiTag = ''
          break
        case 'MX':
          permiTag = ''
          break
        case 'XSX':
          permiTag = ''
          break
        case 'TX':
          permiTag = ''
          break
        default:
          permiTag = ''
          break
      }
      return permiTag
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
    conmmonPopDialogHandle(val) {
      this.$set(this.conmmonPopOptions, 'visible', !this.conmmonPopOptions.visible)
      if (val) {
        this.$set(this.conmmonPopOptions, 'title', val)
      }
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      setTimeout(() => {
        if (this.activeName === 'SG' || this.activeName === 'MX') {
          this.$set(this.conmmonPopOptions, 'formDatas', params)
        } else {
          this.$set(this.popOptions, 'formDatas', params)
        }
      }, 0)
    },
    // tab切换
    handleClick(e) {
      this.tabName = e.label
      this.getListData()
    },
    // 获取成品布面效果列表
    async getListData(data = {}) {
      const res = await sysDataGroupPage({ ...data, typical: this.activeName })
      res.data && res.data.list && res.data.list.map((item, index) => {
        item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index)
        if (item.parent && item.parent.name) {
          item.parentName = item.parent.name
        } else {
          item.parentName = ''
        }
      })
      const dataList = res.data ? res.data.list : []
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
    // 成品布面效果启用、禁用
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
    addClick() {
      this.type = 'add'
      this.pamraskey = []
      this.oldForm = {}
      if (this.activeName === 'SG' || this.activeName === 'MX') {
        this.oldForm = this.firstName.formDatas || {}
        this.setFormDatas({ level: 1 })
        this.$set(this.commonContent[0], 'disabled', false)
        this.$set(this.firstName[2], 'disabled', false)
        this.$set(this.firstName[3], 'disabled', false)
        this.$set(this.firstName[4], 'disabled', false)
        this.$set(this.secondName[3], 'disabled', false)
        this.$set(this.secondName[4], 'disabled', false)
        this.$set(this.secondName[5], 'disabled', false)
        this.conmmonPopDialogHandle(`新增${this.tabName}`)
        this.$set(this.conmmonPopOptions, 'content', this.firstName)
        this.$set(this.conmmonPopOptions, 'formDatas', {})
      } else {
        this.oldForm = this.copyContent.formDatas || {}
        this.PopDialogHandle(`新增${this.tabName}`)
        this.$set(this.popOptions, 'content', this.copyContent)
        this.$set(this.popOptions, 'formDatas', {})
      }
      this.$set(this.copyContent[1], 'disabled', false)
      this.$set(this.copyContent[2], 'disabled', false)
      this.$set(this.copyContent[3], 'disabled', false)
    },
    // 新增、编辑成品布面效果
    clothEffectOption(params) {
      if (this.type === 'add') {
        const obj = {}
        if (this.activeName === 'SG' || this.activeName === 'MX') {
          if (params.level === 1) {
            this.pamraskey = ['level', 'name', 'nameEn', 'abbr', 'remark']
          } else {
            this.pamraskey = ['level', 'parentId', 'name', 'nameEn', 'abbr', 'remark']
          }
        } else {
          this.pamraskey = ['name', 'nameEn', 'abbr', 'remark']
        }
        this.pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.clothEffectAdd(obj)
      } else if (this.type === 'edit') {
        const obj = {}
        if (this.activeName === 'SG' || this.activeName === 'MX') {
          if (params.level === 1) {
            this.pamraskey = ['id', 'level', 'name', 'nameEn', 'abbr', 'remark']
          } else {
            this.pamraskey = ['id', 'level', 'parentId', 'name', 'nameEn', 'abbr', 'remark']
          }
        } else {
          this.pamraskey = ['id', 'name', 'nameEn', 'abbr', 'remark']
        }
        this.pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.clothEffectEdit(obj)
        this.parentInput = false
      }
    },
    // 新增成品布面效果
    async clothEffectAdd(data = {}) {
      const res = await sysDataGroupAdd({ ...data, typical: this.activeName })
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.$set(this.conmmonPopOptions, 'visible', false)
      this.getListData()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    // 编辑成品布面效果
    async clothEffectEdit(data = {}) {
      const res = await sysDataGroupUpdate({ ...data, typical: this.activeName })
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.$set(this.conmmonPopOptions, 'visible', false)
      this.getListData({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 审核成品布面效果
    async clothEffectApprove(id) {
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
    // 删除成品布面效果
    async clothEffectDelete(id) {
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
    // 成品布面效果详情
    async getGroupInfo(data = {}, code) {
      const res = await sysDataGroupDetail(data)
      if (res.code !== 200) {
        return false
      }
      res.data.parentId = res.data && res.data.parent ? res.data.parent.id : ''
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
            if (this.activeName === 'SG' || this.activeName === 'MX') {
              this.$set(this.conmmonPopOptions, 'visible', false)
            } else {
              this.$set(this.popOptions, 'visible', false)
            }
          })
          .catch(_ => {
            if (this.activeName === 'SG' || this.activeName === 'MX') {
              this.$set(this.conmmonPopOptions, 'visible', true)
            } else {
              this.$set(this.popOptions, 'visible', true)
            }
          })
      } else {
        if (this.activeName === 'SG' || this.activeName === 'MX') {
          this.$set(this.conmmonPopOptions, 'visible', false)
        } else {
          this.$set(this.popOptions, 'visible', false)
        }
      }
    },
    // 手感所属上级下拉
    async getFeelParent() {
      const res = await sysDataGroupOption({ typical: 'SG', level: 1 })
      if (res.code !== 200) {
        return false
      }
      this.feelParentOption = filterOptions(this.id, res.data, this.type)
      this.feelParentOption.map((item, index) => {
        item.label = item.name
        item.value = item.id
        item.disabled = item.enabled !== 'Y'
      })
      this.$set(this.secondName[2], 'dataSource', this.feelParentOption)
    },
    // 毛效所属上级下拉
    async getEffectParent() {
      const res = await sysDataGroupOption({ typical: 'MX', level: 1 })
      if (res.code !== 200) {
        return false
      }
      this.effectParentOption = filterOptions(this.id, res.data, this.type)
      this.effectParentOption.map((item, index) => {
        item.label = item.name
        item.value = item.id
        item.disabled = item.enabled !== 'Y'
      })
      this.$set(this.secondName[2], 'dataSource', this.effectParentOption)
    }

  }
}

</script>

<style lang='scss' scoped>
.clothEffect {
  padding: 20px;
  padding-bottom: 0;
  .tabs {
    position: relative;
    background: #fff;
    /deep/.el-tabs__nav .el-tabs__item {
      padding: 0 20px;
      height: 60px;
      line-height: 60px;
    }
  }
  .button {
    position: absolute;
    right: 20px;
    top: 15px;
  }
}
</style>
