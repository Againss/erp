<!--
 * @Author: Sanmao
 * @Date: 2021-05-20 11:28:53
 * @LastEditors: Sanmao
 * @LastEditTime: 2021-05-28 16:02:28
 * @Descripttion: 染整工艺组合
-->
<template>
  <div class="requirements-combination">
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="tableDataSource"
        :operates="popOperates"
        :pagination="pagination"
        :data-total="tableDataSource.length"
        edit-type="pop"
        :table-scrollx="true"
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="customPop" :options="popOptions" />
    </div>
  </div>
</template>
<script>
import {
  sysDataGroupIndexDyeingFinishingProcesses,
  sysDataGroupExamDyeingFinishingProcesses,
  sysDataGroupDeleteDyeingFinishingProcesses,
  sysDataGroupDyeingFinishingProcesses,
  sysDataGroupAddDyeingFinishingProcesses,
  sysDataGroupModifyDyeingFinishingProcesses,
  sysDataGroupEnableDyeingFinishingProcesses,
  sysSelectlevel
} from './api/index.js'
import enableSwitch from '@/views/basic-data/components/enableSwitch'
import { dataComparision } from '@/views/basic-data/common/index'
export default {
  name: 'DyeFinishingProcesses',
  props: {
    componentsType: {
      type: String,
      value: ''
    }
  },
  data() {
    // 表格表头的配置信息
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
          permitTag: 'basic:requirementsCombination:enabled',
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
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'code',
        itemType: 'input',
        label: '序号',
        disabled: true,
        placeholder: '保存后自动生成'
      },
      {
        itemType: 'select',
        prop: 'details',
        label: '中文名',
        placeholder: '请选择中文名',
        multiple: true,
        drag: true,
        filterable: true,
        rules: [
          { required: true, message: '请选择中文名', trigger: 'blur' }
        ],
        valueKey: 'uuid',
        valueType: 'object',
        className: 'name-select',
        // visibleChange: (value) => {
        //   if (value) {
        //     this.getDyeadditivesType()
        //   }
        // },
        change: (value) => {
          // console.log(value)
          if (value && value.length) {
            // 修改英文名
            this.$refs.customPop.$refs.popComponents.$refs.customform.setDynamicValidateFormRuleForm(
              { nameEn: this.setNameEn(value) }
            )
          } else {
            // 清空英文名
            this.$refs.customPop.$refs.popComponents.$refs.customform.setDynamicValidateFormRuleForm(
              { nameEn: '' }
            )
          }
        },
        dataSource: []
      },
      {
        prop: 'nameEn',
        itemType: 'input',
        label: '英文名',
        disabled: true,
        title: true
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
    const ownDepartment = [...commonContent]
    let popOperatesList = [
      {
        label: '审核',
        permitTag: ['basic:requirementsCombination:approve'],
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
        permitTag: ['basic:requirementsCombination:update'],
        isShow: true,
        handle: scope => {
          this.$set(this.popOptions, 'formDatas', {})
          if (scope.row.status.code === 'P') {
            this.$set(this.ownDepartment[1], 'itemType', 'input')
            this.$set(this.ownDepartment[1], 'disabled', true)
            this.$set(this.ownDepartment[1], 'className', '')
            this.$set(this.ownDepartment[3], 'disabled', false)
          } else {
            this.$set(this.ownDepartment[1], 'itemType', 'select')
            this.$set(this.ownDepartment[1], 'disabled', false)
            this.$set(this.ownDepartment[1], 'className', 'name-select')
            this.$set(this.ownDepartment[3], 'disabled', false)
            this.getDyeadditivesType()
          }
          this.$set(this.popOptions, 'content', ownDepartment)
          this.PopDialogHandle('编辑染整工艺组合')

          this.getGroupInfo({ id: scope.row.id }, scope)
          this.type = 'edit'
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['basic:requirementsCombination:destroy'],
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
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增染整工艺组合',
      okText: '保存',

      ok: (params) => {
        this.$confirm('确定保存当前数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.addOrModifyGroup(params)
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
      formOptions: {
        // 数据发生改变触发此方法
        // syncDataHandle: (syncData) => {
        //   console.log(syncData)
        // },
      },
      content: ownDepartment
    }
    return {
      type: 'add',
      tableDataSource: [],
      oldForm: {}, // 旧详情数据
      columns,
      popOperates,
      pagination,
      popOptions,
      ownDepartment,
      detailsData: [] // 中文名数据
    }
  },
  created() {
    this.getGroupPage()
  },
  methods: {
    // 获取数据
    async getGroupPage(data = {}) {
      const res = await sysDataGroupIndexDyeingFinishingProcesses({ ...data })
      res.data.list.map((item, index) => {
        item.code = res.data.total - ((res.data.page - 1) * res.data.pageSize + index)
      })
      const listData = res.data ? res.data.list : []

      this.tableDataSource = listData
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.page,
        pageSize: data.pageSize
      }
    },
    // 审核
    async examGroup(data = {}) {
      const res = await sysDataGroupExamDyeingFinishingProcesses(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('审核成功')
      this.getGroupPage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 根据id获取详情
    async getGroupInfo(data = {}, scope) {
      const res = await sysDataGroupDyeingFinishingProcesses(data)
      if (res.code !== 200) {
        return false
      }
      const dataList = res.data || {}
      dataList.code = scope.row.code
      // 审核后的单据，中文名下拉框不能拖动
      if (scope.row.status.code === 'P') {
        dataList.details = scope.row.name
      }
      this.oldForm = dataList
      this.setFormDatas({ ...dataList })
    },
    // pop赋值
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 删除
    async deleteGroup(data = {}) {
      const res = await sysDataGroupDeleteDyeingFinishingProcesses(data)
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功')
      this.getGroupPage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 新增或者修改
    addOrModifyGroup(params) {
      if (this.type === 'add') {
        const obj = {}
        const pamraskey = ['details', 'nameEn', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addGroup(obj)
      } else if (this.type === 'edit') {
        const obj = {}
        const pamraskey = ['id', 'details', 'nameEn', 'remark']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.editGroup(obj)
      }
    },
    // 新增
    async addGroup(data = {}) {
      const res = await sysDataGroupAddDyeingFinishingProcesses(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('添加成功')
      this.getGroupPage()
    },
    // 编辑
    async editGroup(data = {}) {
      const res = await sysDataGroupModifyDyeingFinishingProcesses(data)
      if (res.code !== 200) {
        return false
      }

      this.$set(this.popOptions, 'visible', false)
      this.$message.success('编辑成功')
      this.getGroupPage({ page: this.pagination.page || 1, pageSize: this.pagination.pageSize || 20 })
    },
    // 启用/禁用
    async EnableStatus(data = {}, scope) {
      const res = await sysDataGroupEnableDyeingFinishingProcesses(data).catch(() => {
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
    // 中文名数据
    async getDyeadditivesType() {
      const res = await sysSelectlevel({ enabled: 'Y', level: 1 })
      if (res.code !== 200) {
        return false
      }
      let data = []
      if (res && res.data.length) {
        data = res.data.map((item) => {
          item.label = item.name
          item.value = item.uuid
          return item
        })
      }
      this.detailsData = res.data || []
      this.$set(this.ownDepartment[1], 'dataSource', data)
    },
    // 新增处理抽屉组件数据
    addRange() {
      this.type = 'add'
      this.$set(this.ownDepartment[1], 'itemType', 'select')
      this.$set(this.ownDepartment[1], 'disabled', false)
      this.$set(this.ownDepartment[1], 'className', 'name-select')
      this.$set(this.ownDepartment[3], 'disabled', false)
      this.oldForm = this.ownDepartment.formDatas || {}
      this.getDyeadditivesType()
      this.PopDialogHandle('新增染整工艺组合')
      this.$set(this.popOptions, 'content', this.ownDepartment)
      // this.$set(this.popOptions, 'formDatas', { details: [{ uuid: '93eddaa108a915e15a5e029bf40912d3', name: '远红外负离子整理1' }, { uuid: '75c79e9acbc4ff5d48d8c0ce9d4b8618', name: '亲水硅油1' }] })
      this.$set(this.popOptions, 'formDatas', {})
    },
    /**
     * @description 根据中文名处理英文名
     * @param (Array) nameDataArr 选中后/排序后 中文名
     * @returns (String) nameEn 根据中文名处理后的英文名
     */
    setNameEn(nameDataArr = []) {
      const nameEn = []
      if (nameDataArr && nameDataArr.length) {
        nameDataArr.forEach(uuidItem => {
          this.detailsData.forEach(item => {
            if (uuidItem.uuid === item.uuid) {
              nameEn.push(item.nameEn)
            }
          })
        })
      }
      return nameEn.join('，')
    }
  }
}
</script>
<style lang="scss" scoped>
  .requirements-combination {
    .pop /deep/ .name-select .el-select__tags span {
      cursor: pointer;
    }
  }
</style>
