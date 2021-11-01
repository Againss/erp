/**
 * @Description: 布类
 * @author ll
 * @date 2020/10/21
*/
<template>
  <div class="singleDouble">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <div class="button">
      <el-button v-permission="['basic:cloths:store']" size="small" icon="el-icon-plus" type="primary" @click="addCloth">新增</el-button>
    </div>
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
import { sysDataGroupPage, sysDataGroupAdd, sysDataGroupModify, sysDataGroupApprove, sysDataGroupDelete, sysDataGroupEnabled, sysDataGroupDetail, weaveDyeOption, dyeOption } from './api/index.js'
export default {
  data() {
    // 查询
    const searchData = [
      {
        prop: 'name',
        itemType: 'input',
        label: '名称:',
        clearable: true,
        placeholder: '中文名/英文名'
      },
      {
        prop: 'knitDye',
        itemType: 'input',
        label: '织染方式:',
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        prop: 'spandex',
        itemType: 'select',
        label: '是否弹力:',
        clearable: true,
        dataSource: [{ value: '', label: '全部' }, { value: 'Y', label: '是' }, { value: 'N', label: '否' }]
      },
      {
        prop: 'fabrication',
        itemType: 'input',
        label: '布种:',
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        prop: 'enabled',
        itemType: 'select',
        label: '启用/禁用:',
        clearable: true,
        dataSource: [{ value: '', label: '全部' }, { value: 'Y', label: '启用' }, { value: 'N', label: '禁用' }]
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
        prop: 'number',
        itemType: 'input',
        label: '序号',
        disabled: true
      },
      {
        prop: 'code',
        itemType: 'input',
        label: '编号',
        disabled: true
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '中文名',
        disabled: true,
        rules: [commonBlurReg]
      },
      {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名',
        disabled: true,
        rules: [commonBlurReg]
      },
      {
        prop: 'abbr',
        itemType: 'input',
        label: '简称',
        clearable: true,
        placeholder: '请输入两位大写字母',
        maxlength: 2,
        trim: ruleTrim,
        rules: [commonBlurReg, { validator: checkFrequency, trigger: 'change' }]
      },
      {
        prop: 'knitDyeId',
        itemType: 'select',
        label: '织染方式',
        filterable: true,
        clearable: true,
        rules: [commonChangeReg],
        change: (value) => {
          this.knitDyeChange(value)
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getKnitDye()
          }
        },
        dataSource: []
      },
      {
        prop: 'spandex',
        itemType: 'radio-group',
        label: '是否弹力',
        rules: [commonChangeReg],
        change: (value) => {
          this.spandexChange(value)
        },
        dataSource: [{ value: 'Y', label: '是' }, { value: 'N', label: '否' }]
      },
      {
        prop: 'fabricationId',
        itemType: 'select',
        label: '布种',
        filterable: true,
        clearable: true,
        rules: [commonChangeReg],
        change: (value) => {
          this.fabricationChange(value)
        },
        visibleChange: (value) => {
          if (value) {
            this.getFabrication()
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
        trim: (value) => {
          return value
        },
        rules: [{ min: 0, max: 100, message: '长度在0 到100 个字符', trigger: 'blur' }]
      }
    ]
    const columns = [
      {
        prop: 'number',
        label: '序号',
        width: '70'
      },
      {
        prop: 'code',
        label: '编号',
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
        prop: 'knitDye.describe',
        label: '织染方式',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.knitDye.name
        }
      },
      {
        prop: 'spandex.describe',
        label: '是否弹力',
        formater: scope => {
          return scope.row.spandex.describe
        }
      },
      {
        prop: 'fabrication.name',
        label: '布种',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.fabrication.name
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
          permitTag: 'basic:cloths:enabled',
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
        permitTag: ['basic:cloths:approve'],
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
              this.clothApprove(scope.row.id)
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
        permitTag: ['basic:cloths:update'],
        isShow: true,
        handle: scope => {
          this.knitId = '' + scope.row.knitDye.id
          this.clothId = '' + scope.row.fabrication.id
          this.$set(this.popOptions, 'content', content)
          if (scope.row.status.code === 'P') {
            this.$set(this.content[4], 'disabled', true)
            this.$set(this.content[5], 'disabled', true)
            this.$set(this.content[6], 'disabled', true)
            this.$set(this.content[7], 'disabled', true)
          } else {
            this.$set(this.content[4], 'disabled', false)
            this.$set(this.content[5], 'disabled', false)
            this.$set(this.content[6], 'disabled', false)
            this.$set(this.content[7], 'disabled', false)
          }
          this.type = 'edit'
          this.PopDialogHandle('编辑布种')
          this.getKnitDye()
          this.getFabrication()
          this.$set(this.popOptions, 'formDatas', {})
          this.getGroupInfo({ id: scope.row.id }, scope.row.number)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:cloths:destroy'],
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
              this.clothDelete(scope.row.id)
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
        this.clothOption(params)
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
      knitId: '',
      clothId: '',
      knitDyeCode: '',
      knitDyeName: '',
      knitDyeNameEn: '',
      spandexCode: 'N',
      spandexName: '',
      spandexNameEn: '',
      fabricationCode: '',
      fabricationName: '',
      fabricationNameEn: '',
      formOtions: {
        size: 'small',
        inline: true
      },
      searchData,
      searchFormDatas: {},
      formDatas: {
        spandex: '',
        enabled: ''
      },
      columns,
      pagination,
      popOperates,
      popOptions,
      content,
      dataSource: [],
      weaveDyeOption: [],
      dyeOption: [],
      dyeInput: false,
      clothInput: false,
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
      const res = await sysDataGroupPage({ ...this.searchFormDatas, ...data })
      res.data && res.data.list && res.data.list.map((item, index) => { item.number = res.data.total - ((res.data.page - 1) * res.data.pageSize + index) })
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
    // 单双染启用、禁用
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
    addCloth() {
      this.type = 'add'
      this.$set(this.popOptions, 'content', this.content)
      this.resetData()
      this.$set(this.content[4], 'disabled', false)
      this.$set(this.content[5], 'disabled', false)
      this.$set(this.content[6], 'disabled', false)
      this.$set(this.content[7], 'disabled', false)
      this.PopDialogHandle('新增布类')
      this.setFormDatas({ spandex: 'N' })
      this.setFormDatas({ code: ' N' })
      this.oldForm = this.content.formDatas || {}
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增、编辑布类
    clothOption(params) {
      if (this.type === 'add') {
        const obj = {}
        const pamraskey = ['code', 'name', 'nameEn', 'abbr', 'knitDyeId', 'spandex', 'fabricationId', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.clothAdd(obj)
      } else if (this.type === 'edit') {
        const obj = {}
        const pamraskey = ['id', 'code', 'name', 'nameEn', 'abbr', 'knitDyeId', 'spandex', 'fabricationId', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.clothEdit(obj)
      }
    },
    // 布类新增
    async clothAdd(data = {}) {
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
    // 布类编辑
    async clothEdit(data = {}) {
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
    // 布类审核
    async clothApprove(id) {
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
    // 布类删除
    async clothDelete(id) {
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
    // 布类详情
    async getGroupInfo(data = {}, number) {
      const res = await sysDataGroupDetail(data)
      if (res.code !== 200) {
        return false
      }
      res.data.knitDye = res.data.knitDye.id || ''
      res.data.spandex = res.data.spandex.code || ''
      res.data.fabrication = res.data.fabrication.id || ''
      const dataList = res.data || {}
      this.oldForm = { ...dataList, number: number }
      this.knitDyeChange(res.data.knitDye)
      this.spandexChange(res.data.spandex)
      this.fabricationChange(res.data.fabrication)
      this.setFormDatas({ ...dataList, number: number })
    },
    // 织染方式下拉
    async getKnitDye() {
      const res = await weaveDyeOption({ status: 'P' })
      if (res.code !== 200) {
        return false
      }
      res.data.forEach((item) => {
        item.enabled = item.enabled.code
      })
      this.weaveDyeOption = filterOptions(this.knitId, res.data, this.type)
      this.weaveDyeOption.map((item, index) => {
        item.label = item.name
        item.value = item.id
        item.disabled = item.enabled !== 'Y'
      })
      this.$set(this.content[5], 'dataSource', this.weaveDyeOption)
    },
    // 织染方式更换
    knitDyeChange(data) {
      this.weaveDyeOption.forEach((item) => {
        if (data === item.id) {
          this.knitDyeCode = item.dyeModel.abbr + item.knitModel.abbr
          this.knitDyeName = item.name
          this.knitDyeNameEn = item.nameEn
          this.setFormDatas({ code: this.knitDyeCode + this.fabricationCode + this.spandexCode })
          this.setFormDatas({ name: this.knitDyeName + this.spandexName + this.fabricationName })
          if (this.spandexNameEn === '') {
            this.setFormDatas({ nameEn: this.knitDyeNameEn + ' ' + this.fabricationNameEn })
          } else {
            this.setFormDatas({ nameEn: this.knitDyeNameEn + ' ' + this.spandexNameEn + ' ' + this.fabricationNameEn })
          }
        }
      })
    },
    // 是否弹力切换
    spandexChange(data) {
      if (data === 'Y') {
        this.spandexCode = 'E'
        this.spandexName = '弹力'
        this.spandexNameEn = 'Stretch'
      } else {
        this.spandexCode = 'N'
        this.spandexName = ''
        this.spandexNameEn = ''
      }
      this.setFormDatas({ code: this.knitDyeCode + this.fabricationCode + this.spandexCode })
      this.setFormDatas({ name: this.knitDyeName + this.spandexName + this.fabricationName })
      if (this.spandexNameEn === '') {
        this.setFormDatas({ nameEn: this.knitDyeNameEn + ' ' + this.fabricationNameEn })
      } else {
        this.setFormDatas({ nameEn: this.knitDyeNameEn + ' ' + this.spandexNameEn + ' ' + this.fabricationNameEn })
      }
    },
    // 布种下拉
    async getFabrication(data = {}) {
      const res = await dyeOption(data)
      if (res.code !== 200) {
        return false
      }
      this.dyeOption = filterOptions(this.clothId, res.data, this.type)
      this.dyeOption.map((item, index) => {
        item.label = item.name
        item.value = item.id
        item.disabled = item.enabled !== 'Y'
      })
      this.$set(this.content[7], 'dataSource', this.dyeOption)
    },
    // 布种切换
    fabricationChange(data) {
      this.dyeOption.forEach((item) => {
        if (data === item.id) {
          this.fabricationCode = item.abbr
          this.fabricationName = item.name
          this.fabricationNameEn = item.nameEn
          this.setFormDatas({ code: this.knitDyeCode + this.fabricationCode + this.spandexCode })
          this.setFormDatas({ name: this.knitDyeName + this.spandexName + this.fabricationName })
          if (this.spandexNameEn === '') {
            this.setFormDatas({ nameEn: this.knitDyeNameEn + ' ' + this.fabricationNameEn })
          } else {
            this.setFormDatas({ nameEn: this.knitDyeNameEn + ' ' + this.spandexNameEn + ' ' + this.fabricationNameEn })
          }
        }
      })
    },
    // 重置数据
    resetData() {
      this.knitDyeCode = ''
      this.knitDyeName = ''
      this.knitDyeNameEn = ''
      this.spandexCode = 'N'
      this.spandexName = ''
      this.spandexNameEn = ''
      this.fabricationCode = ''
      this.fabricationName = ''
      this.fabricationNameEn = ''
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
.singleDouble {
  padding: 20px;
  padding-bottom: 0;
}
</style>
<style lang="scss">
.singleDouble {
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>
