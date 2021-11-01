<!--
 * @Author: Sanmao
 * @Date: 2020-11-03 14:33:43
 * @LastEditors: zhengjin
 * @LastEditTime: 2021-06-22 16:20:44
 * @Descripttion: 色号花号库-基础数据-染料助剂列表-染料助剂页签
-->
<template>
  <div class="dyeadditives">
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="{ size: 'small', inline: true }"
      />
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :data-source="tableDataSource"
        :operates="popOperates"
        lazy
        :pagination="pagination"
        edit-type="pop"
        table-scrollx
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
  dyestuffAssistList,
  dyestuffAssistTypeEnabledList,
  dyestuffAssistAdd,
  dyestuffAssistEdit,
  dyestuffAssistUpdate,
  dyestuffAssistDelete,
  dyestuffAssistApprove,
  dyestuffAssistEnabled
} from '../api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import enableSwitch from '@/views/basic-data/components/enableSwitch'
import { debounce } from '@/utils'
import configData from '@/views/product-center/configDock/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
export default {
  name: 'DyeadditivesComponent',
  mixins: [logMethods],
  props: {
    componentsType: {
      type: String,
      value: ''
    }
  },
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'name',
        itemType: 'input',
        label: '染料助剂名称:',
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        prop: 'abbr',
        itemType: 'input',
        label: '简称:',
        clearable: true,
        placeholder: '请输入内容'
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: (params) => {
          this.getRulePage(params)
          this.searchFormDatas = params
        },
        resetHandle: (params) => {
          this.searchFormDatas = {}
        }
      }
    ]
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
        label: '染料助剂类型',
        showOverflowTooltip: true,
        minWidth: '112',
        formater: (scope) => {
          return (
            scope.row.dyestuffAssistType &&
            `${scope.row.dyestuffAssistType.name}     ${scope.row.dyestuffAssistType.abbr}`
          )
        }
      },
      {
        prop: 'name',
        label: '染料助剂名称',
        showOverflowTooltip: true,
        minWidth: '112'
      },
      {
        prop: 'abbr',
        label: '简称',
        minWidth: '60',
        showOverflowTooltip: true
      },
      {
        prop: 'dyeColor',
        label: '染料色光',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row.dyeColor && scope.row.dyeColor.describe
        }
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
          permitTag: 'color:Api:ColorBd:DyestuffAssist:enable',
          changeStatus: (scope) => {
            this.changeEnable(
              { id: scope.row.id, enabled: scope.row.enabled.code },
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
      // {
      //   prop: "id",
      //   itemType: "input",
      //   label: "序号",
      //   disabled: true,
      // },
      {
        itemType: 'select',
        prop: 'dyestuffAssistType',
        label: '染料助剂类型',
        placeholder: '请选择类型',
        rules: [
          { required: true, message: '请选择染料助剂类型', trigger: 'blur' }
        ],
        visibleChange: (value) => {
          if (value) {
            this.getDyeadditivesType()
          }
        },
        change: (uuid) => {
          this.$refs.customPop.$refs.popComponents.$refs.customform.setDynamicValidateFormRuleForm(
            { dyestuffAssistTypeUuid: uuid }
          )
        },
        dataSource: []
      },
      {
        itemType: 'input',
        prop: 'name',
        label: '染料助剂名称',
        maxlength: 50,
        clearable: true,
        placeholder: '输入名称',
        rules: [
          commonBlurReg,
          { message: '长度在 50 个字符以内', trigger: ['blur'] }
        ]
      },
      {
        prop: 'abbr',
        itemType: 'input',
        label: '简称',
        disabled: true,
        placeholder: '自动生成'
      },
      {
        prop: 'dyeColor',
        itemType: 'select',
        label: '染色光源',
        placeholder: '请选择染色光源',
        dataSource: [
          {
            label: '紫色',
            value: 1
          },
          {
            label: '玫红',
            value: 2
          },
          {
            label: '红色',
            value: 3
          },
          {
            label: '橙色',
            value: 4
          },
          {
            label: '红黄',
            value: 5
          },
          {
            label: '青黄',
            value: 6
          },
          {
            label: '湖绿',
            value: 7
          },
          {
            label: '蓝色',
            value: 8
          },
          {
            label: '艳兰',
            value: 9
          },
          {
            label: '黑色',
            value: 10
          },
          {
            label: '白色',
            value: 11
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
        maxlength: 100,
        placeholder: '请输入内容...'
      }
    ]
    const copyContent = [...commonContent]
    let popOperatesDataSource = [
      {
        label: '审核',
        permitTag: ['color:Api:ColorBd:DyestuffAssist:approve'],
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
        permitTag: ['color:Api:ColorBd:DyestuffAssist:update'],
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
          this.PopDialogHandle('编辑染料助剂')
          this.editList({ id: scope.row.id }, scope.row.code)
        }
      },
      {
        label: '删除',
        permitTag: ['color:Api:ColorBd:DyestuffAssist:destroy'],
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
      dataSource: popOperatesDataSource,
      fixed: 'right'
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
      title: '新增染料助剂',
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
      searchData,
      copyContent,
      columns,
      tableDataSource: [],
      pagination,
      popOperates,
      popOptions,
      type: 'add',
      visible: false,
      oldForm: {} // 旧详情数据
    }
  },
  created() {
    this.componentsType === 'dyeadditives' && this.getRulePage()
  },
  methods: {
    // 下拉染料助剂类型数据
    async getDyeadditivesType() {
      const res = await dyestuffAssistTypeEnabledList({ enabled: 'Y' })
      if (res.code !== 200) {
        return false
      }
      let data = []
      if (res.data && res.data.list.length) {
        data = res.data.list.map((item) => {
          item.label = `${item.name}     ${item.abbr}`
          item.value = item.uuid
          return item
        })
      }
      this.$set(this.copyContent[0], 'dataSource', data)
    },
    // 新增处理抽屉组件数据
    addList() {
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新增染料助剂')
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.copyContent[0], 'disabled', false)
      this.$set(this.copyContent[1], 'disabled', false)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 新增的确定事件
    async addData(data = {}) {
      const res = await dyestuffAssistAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(
        this.getLogMessages(
          'INSERT',
          `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssist/store`,
          'color'
        ),
        { ...data },
        JSON.stringify({
          beforeText: `在'色号花号库-基础数据管理-染料助剂'新增一条记录`,
          beforeCode: { ...data }
        })
      )
      this.$set(this.popOptions, 'visible', false)
      this.getRulePage()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    // 隐藏或显示抽屉组件
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
        const pamraskey = [
          'name',
          'dyestuffAssistTypeUuid',
          'dyestuffAssistType',
          'abbr',
          'remark',
          'dyeColor'
        ]
        pamraskey.forEach((v) => {
          obj[v] = params[v]
        })
        this.addData(obj)
      } else if (this.type === 'edit') {
        // 走编辑接口
        const obj = {}
        const pamraskey = [
          'id',
          'name',
          'dyestuffAssistTypeUuid',
          'dyestuffAssistType',
          'abbr',
          'remark',
          'dyeColor'
        ]
        pamraskey.forEach((v) => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
      }
    },
    // 染料助剂查询
    async getRulePage(data = { type: 1 }) {
      const res = await dyestuffAssistList({
        ...this.searchFormDatas,
        ...data
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
    setSearchDatas(data) {
      this.searchFormDatas = data
    },
    // 点击编辑
    async editList(data = {}, code) {
      const res = await dyestuffAssistEdit(data)
      if (!res || res.code !== 200) {
        return false
      }
      const editData = res.data || {}
      editData.dyeColor = res.data.dyeColor
        ? res.data.dyeColor.code > 11
          ? ''
          : res.data.dyeColor.code
        : ''
      this.oldForm = {
        ...editData
      }
      editData.dyestuffAssistType =
        res.data.dyestuffAssistType &&
        `${res.data.dyestuffAssistType.name}     ${res.data.dyestuffAssistType.abbr}`
      this.oldForm = { ...editData }
      this.setFormDatas({
        ...editData
      })
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
      const res = await dyestuffAssistUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.fetchLog(
        this.getLogMessages(
          'UPDATE',
          `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssist/update`,
          'color'
        ),
        { ...data },
        JSON.stringify({
          beforeText: `在'色号花号库-基础数据管理-染料助剂'编辑一条记录`,
          beforeCode: { ...data }
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
    async approveData(scope) {
      const res = await dyestuffAssistApprove({ id: scope.row.id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(
        this.getLogMessages(
          'UPDATE',
          `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssist/approve`,
          'color'
        ),
        { id: scope.row.id, name: scope.row.name },
        JSON.stringify({
          beforeText: `在'色号花号库-基础数据管理-染料助剂'审核一条记录`,
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
    // 删除
    async deleteData(params) {
      const res = await dyestuffAssistDelete({ id: params.row.id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(
        this.getLogMessages(
          'DEL',
          `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssist/destroy`,
          'color'
        ),
        { id: params.row.id, name: params.row.name },
        JSON.stringify({
          beforeText: `在'色号花号库-基础数据管理-染料助剂'删除一条记录`,
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
    },
    // 页面启用禁用
    changeEnable: debounce(
      function(data = {}, scope) {
        dyestuffAssistEnabled(data)
          .then((res) => {
            this.fetchLog(
              this.getLogMessages(
                'UPDATE',
                `${configData.colorRequestPrefix}/api/colorBd/dyestuffAssist/enable`,
                'color'
              ),
              { id: scope.row.id, name: scope.row.name },
              JSON.stringify({
                beforeText: `在"色号花号库-基础数据管理-染料助剂"${
                  data.enabled === 'Y' ? '启用' : '禁用'
                }一条记录`,
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
.dyeadditives /deep/.el-drawer__header {
  padding: 15px 20px;
  border: 1px solid #e9eff2;
  font-size: 18px;
  color: #151222;
}
.dyeadditives /deep/ .el-drawer.customDrawerclass .content {
  height: calc(100% - 150px);
}
.dyeadditives /deep/ span {
  white-space: pre;
}
.dyeadditives /deep/.el-table__fixed-right::before {
  height: 0;
}
/deep/ .el-select-dropdown__wrap span {
  white-space: pre;
}
.search {
  margin-bottom: 10px;
}
</style>

