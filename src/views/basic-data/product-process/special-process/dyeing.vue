<!--
  @Description 染整
-->
<template>
  <div class="requestdye">
    <!-- 搜索表单 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 新增角色按钮 -->
    <!-- <div class="button button-position">
      <el-button
        v-permission="['basic:requirementsDye:store']"
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
        :table-scrollx="true"
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
import {
  sysDataGroupIndexdye,
  sysDataGroupAdddye,
  sysDataGroupModifydye,
  sysDataGroupDeletedye,
  sysDataGroupEnabledye,
  sysDataGroupInfodye,
  sysDataGroupExamdye,
  sysSelectdye,
  sysSelectlevel
} from './api/index.js'
import enableSwitch from '@/views/basic-data/components/enableSwitch'
import { dataComparision } from '@/views/basic-data/common/index'
import { filterOptions } from '@/views/basic-data/common/index'
export default {
  name: 'DyeingFinish',
  props: {
    componentsType: {
      type: String,
      value: ''
    }
  },
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 弹出框单选change事件
    const radioChange = value => {
      if (value === 1) {
        this.$set(this.popOptions, 'content', firstProcess)
      } else if (value === 2) {
        this.$set(this.popOptions, 'content', secondProcess)
      }
    }

    // 公共弹出框内容
    const commonContent = [
      {
        prop: 'level',
        itemType: 'radio-group',
        label: '',
        change: radioChange,
        dataSource: [
          {
            label: '一级工艺',
            value: 1
          },
          {
            label: '二级工艺',
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

    // 一级工艺弹框内容
    const firstProcess = [
      ...commonContent,
      {
        prop: 'name',
        itemType: 'input',
        label: '中文名',
        maxlength: 100,
        clearable: true,
        rules: [commonBlurReg, { min: 1, max: 100, message: '长度在1 到100 个字符', trigger: 'blur' }]
      },
      {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名',
        maxlength: 200,
        clearable: true,
        rules: [commonBlurReg, { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }]
      },
      {
        prop: 'classificationId',
        itemType: 'select',
        filterable: true,
        label: '工艺要求分类',
        clearable: true,
        rules: [{ required: true, message: '请选择工艺要求分类' }],
        visibleChange: (value) => {
          if (value) {
            this.getdown()
          }
        },
        dataSource: []

      },
      {
        prop: 'sortClassify',
        itemType: 'radio-group',
        label: '整理分类',
        rules: [{ required: true, message: '请选择整理分类' }],
        dataSource: [
          {
            label: '普通',
            value: 1
          },
          {
            label: '功能',
            value: 2
          },
          {
            label: '风格',
            value: 3
          },
          {
            label: '手感',
            value: 4
          }

        ]
      },
      {
        prop: 'special',
        itemType: 'radio-group',
        label: '特殊整理',
        rules: [{ required: true, message: '请选择特殊整理' }],
        dataSource: [
          {
            label: '是',
            value: 'Y'
          },
          {
            label: '否',
            value: 'N'
          }
        ]
      },
      {
        prop: 'affectColor',
        itemType: 'radio-group',
        label: '影响颜色',
        rules: [{ required: true, message: '请选择影响颜色' }],
        dataSource: [
          {
            label: '是',
            value: 'Y'
          },
          {
            label: '否',
            value: 'N'
          }
        ]
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

    // 二级工艺弹框内容
    const secondProcess = [
      ...commonContent,
      {
        prop: 'parentId',
        itemType: 'select',
        filterable: true,
        label: '所属上级',
        clearable: true,
        rules: [{ required: true, message: '请选择所属上级' }],
        visibleChange: (value) => {
          if (value) {
            this.getparentdown({ level: 1 })
          }
        },
        dataSource: []
      },
      {
        prop: 'name',
        itemType: 'input',
        label: '中文名',
        maxlength: 100,
        clearable: true,
        rules: [commonBlurReg, { min: 1, max: 100, message: '长度在1 到100 个字符', trigger: 'blur' }]
      },
      {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名',
        maxlength: 200,
        clearable: true,
        rules: [commonBlurReg, { min: 1, max: 200, message: '长度在1 到200 个字符', trigger: 'blur' }]
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
        prop: 'level',
        itemType: 'select',
        label: '工艺级别:',
        clearable: true,
        dataSource: [

          {
            label: '一级工艺',
            value: '1'
          },
          {
            label: '二级工艺',
            value: '2'
          }
        ]
      },
      {
        prop: 'isSpecial',
        itemType: 'select',
        label: '特殊整理:',
        clearable: true,
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '是',
            value: 'Y'
          },
          {
            label: '否',
            value: 'N'
          }
        ]
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
        prop: 'parents',
        label: '所属上级',
        minWidth: '120',
        showOverflowTooltip: true
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
        prop: 'abbr',
        label: '简称',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'specials',
        label: '特殊整理',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'sortClassifys',
        label: '整理分类',
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
        prop: 'affectColors',
        label: '影响颜色',
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
          permitTag: 'basic:requirementsDye:enabled',
          changeStatus: (scope) => {
            this.EnableStatus({ id: scope.row.id }, scope)
          }
        }
      },
      {
        prop: 'status.describe',
        label: '状态',
        minWidth: '120',
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

    let popOperatesList = [
      {
        label: '审核',
        permitTag: ['basic:requirementsDye:approve'],
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
        permitTag: ['basic:requirementsDye:update'],
        isShow: true,
        handle: scope => {
          this.$set(this.firstProcess[0], 'disabled', true)
          if (scope.row.status.code === 'P') {
            this.$set(this.firstProcess[2], 'disabled', true)
            this.$set(this.firstProcess[3], 'disabled', true)
            this.$set(this.firstProcess[4], 'disabled', true)
            this.$set(this.secondProcess[3], 'disabled', true)
            this.$set(this.secondProcess[4], 'disabled', true)
          } else {
            this.$set(this.firstProcess[2], 'disabled', false)
            this.$set(this.firstProcess[3], 'disabled', false)
            this.$set(this.firstProcess[4], 'disabled', false)
            this.$set(this.secondProcess[3], 'disabled', false)
            this.$set(this.secondProcess[4], 'disabled', false)
          }
          if (scope.row.level === 1) {
            this.id = '' + scope.row.classification.id
            this.ids = ''
            this.$set(this.popOptions, 'content', firstProcess)
          } else if (scope.row.level === 2) {
            this.id = ''
            this.ids = '' + scope.row.parent.id
            this.$set(this.popOptions, 'content', secondProcess)
          }
          this.PopDialogHandle('编辑染整')
          this.setFormDatas({ level: scope.row.level })
          this.getdown()
          this.getparentdown({ level: 1 })
          this.getGroupInfo({ id: scope.row.id }, scope)
          this.type = 'edit'
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:requirementsDye:destroy'],
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
      content: firstProcess
      // component: PopDialog
    }
    return {
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        isSpecial: '',
        enabled: ''
      },
      searchData,
      columns,
      numId: 1,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      firstProcess,
      secondProcess,
      searchFormDatas: {},
      type: 'add',
      dataFormList: [],
      sortData: [],
      rowInfoMessages: {},
      oldForm: {}, // 旧详情数据
      id: '',
      ids: ''
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
      this.oldForm = this.firstProcess.formDatas || {}
      this.setFormDatas({ special: 'N' })
      this.setFormDatas({ affectColor: 'N' })
      this.$set(this.firstProcess[0], 'disabled', false)
      this.$set(this.firstProcess[2], 'disabled', false)
      this.$set(this.firstProcess[3], 'disabled', false)
      this.$set(this.firstProcess[4], 'disabled', false)
      this.$set(this.secondProcess[3], 'disabled', false)
      this.$set(this.secondProcess[4], 'disabled', false)
      this.PopDialogHandle('新增染整')
      this.setFormDatas({ level: 1 })
      this.$set(this.popOptions, 'content', this.firstProcess)
      this.$set(this.popOptions, 'formDatas', {})
    },

    // 获取数据
    async getGroupPage(data = {}) {
      const res = await sysDataGroupIndexdye({ ...this.searchFormDatas, ...data })
      if (res.data && res.data.list) {
        res.data.list &&
            res.data.list.map((item, index) => {
              item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index)
              item.statu = item.status.describe
              item.specials = item.special.describe
              item.sortClassifys = item.sortClassify.describe
              item.affectColors = item.affectColor.describe
              item.parents = item.parent.name
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
      const res = await sysDataGroupEnabledye(data).catch(() => {
        scope.row.enabled.code = scope.row.enabled.code === 'Y' ? 'N' : 'Y'
      })
      if (res.code === 200) {
        this.$message({
          message: '更新状态成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message ? res.message : '更新状态失败',
          type: 'error'
        })
      }
    },
    // 新增或者修改数据范围
    addOrModifyGroup(params) {
      if (this.type === 'add') {
        const obj = {}
        if (params.level === 1) {
          const pamraskeyf = ['level', 'name', 'nameEn', 'classificationId', 'sortClassify', 'special', 'affectColor', 'remark']
          pamraskeyf.forEach(v => {
            obj[v] = params[v]
          })
        } else if (params.level === 2) {
          const pamraskeys = ['level', 'parentId', 'name', 'nameEn', 'remark']
          pamraskeys.forEach(v => {
            obj[v] = params[v]
          })
        }
        this.addGroup(params)
      } else if (this.type === 'edit') {
        delete params.enabled
        delete params.parent
        delete params.status
        const obj = {}
        if (params.level === 1) {
          const pamraskeyf = ['level', 'id', 'name', 'nameEn', 'classificationId', 'sortClassify', 'special', 'affectColor', 'remark']
          pamraskeyf.forEach(v => {
            obj[v] = params[v]
          })
        } else if (params.level === 2) {
          const pamraskeys = ['level', 'id', 'parentId', 'name', 'nameEn', 'remark']
          pamraskeys.forEach(v => {
            obj[v] = params[v]
          })
        }
        this.editGroup(params)
      }
    },
    // 新增染整
    async addGroup(data = {}) {
      const res = await sysDataGroupAdddye(data)
      if (res.code !== 200) {
        return false
      }

      this.$set(this.popOptions, 'visible', false)
      this.$message.success('添加成功')
      this.getGroupPage()
    },

    // 编辑染整
    async editGroup(data = {}) {
      const res = await sysDataGroupModifydye(data)
      if (res.code !== 200) {
        return false
      }

      this.$set(this.popOptions, 'visible', false)
      this.$message.success('编辑成功')
      this.getGroupPage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 删除
    async deleteGroup(data = {}) {
      const res = await sysDataGroupDeletedye(data)
      if (res.code !== 200) {
        return false
      }

      this.$message.success('删除成功')
      this.getGroupPage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 审核
    async examGroup(data = {}) {
      const res = await sysDataGroupExamdye(data)
      if (res.code !== 200) {
        return false
      }

      this.$message.success('审核成功')
      this.getGroupPage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },

    // 根据id获取详情
    async getGroupInfo(data = {}, scope) {
      const res = await sysDataGroupInfodye(data)
      // console.log('详情', res)
      if (res.code !== 200) {
        return false
      }
      res.data.parentId = res.data.parent.id
      res.data.sortClassify = res.data.sortClassify.code
      res.data.special = res.data.special.code
      res.data.affectColor = res.data.affectColor.code

      const dataList = res.data || {}
      dataList.code = scope.row.code
      this.oldForm = dataList
      this.rowInfoMessages = dataList
      this.setFormDatas({ ...dataList })
    },

    // 工艺要求分类下拉数据
    async getdown() {
      const res = await sysSelectdye({})
      if (res.code !== 200) {
        return false
      }
      this.sortData = filterOptions(this.id, res.data, this.type)
      this.sortData.map((item, index) => {
        item.label = item.name + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + item.abbr
        item.value = item.id
        item.disabled = item.enabled !== 'Y'
      })
      this.$set(this.firstProcess[4], 'dataSource', this.sortData)
    },

    // 所属上级下拉数据
    async getparentdown(data = {}) {
      const res = await sysSelectlevel(data)
      if (res.code !== 200) {
        return false
      }
      const obj = filterOptions(this.ids, res.data, this.type)
      obj.map((item, index) => {
        item.label = item.name
        item.value = item.id
        item.disabled = item.enabled !== 'Y'
      })
      this.$set(this.secondProcess[2], 'dataSource', obj)
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
.requestdye {
  padding-bottom: 0;
  .el-form.el-form--inline .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
}
</style>

