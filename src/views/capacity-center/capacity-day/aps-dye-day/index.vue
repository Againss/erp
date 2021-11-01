<template>
  <div class="wrap-data-list">
    <!-- 搜索页面 -->
    <!-- <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div> -->
    <!-- 新增按钮 -->
    <div class="wrap-btns">
      <div class="button">
        <el-button
          v-permission="['bmpAps:apsDyeDay:add']"
          type="primary"
          size="small"
          @click="handleAdd"
        >新建</el-button>
      </div>
    </div>
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :table-scrollx="true"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- 分组编辑pop弹出层 -->
    <div class="pop">
      <cs-custom-pop
        ref="popForm"
        :options="popOptions"
        :edit-data="editData"
      />
    </div>
  </div>
</template>

<script>
import { fetchLog } from '@/views/capacity-center/common/fetchLog'
import { checkNum } from '@/views/capacity-center/common/index'
import enableSwitch from '../components/enableSwitch'
import {
  apsDyeDayList,
  changeApsDyeDay,
  addApsDyeDay,
  modifyApsDyeDay,
  deleteApsDyeDay
} from './api/index'
import {
  requirementsDyeList
} from '../api/selectData'
export default {
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'param',
        label: '染整工艺',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: scope => { return scope.row.param.label }
      },
      {
        prop: 'orderDays',
        label: '大货天数',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'sampleDays',
        label: '样板天数',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '100',
        showOverflowTooltip: true,
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'bmpAps:apsDyeDay:status',
          changeStatus: (scope) => {
            this.enableStatus({ id: scope.row.id, status: scope.row.status })
          }
        }
      }
    ]
    let popOperatesDataSource = [
      {
        label: '编辑',
        isShow: true,
        permitTag: ['bmpAps:apsDyeDay:modify'],
        handle: (scope) => {
          this.editFn(scope.row)
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        isShow: true,
        permitTag: ['bmpAps:apsDyeDay:delete'],
        handle: (scope) => {
          this.deleteFn(scope.row)
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '200',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 分页配置信息
    const pagination = {
      currentChange: (val) => {
        this.getRulePage({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getRulePage({ page: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    // 这是pop弹出层用的配置信息
    const commont = {
      _param: {
        prop: 'param',
        itemType: 'select',
        valueType: 'object',
        valueKey: 'value',
        label: '工序',
        clearable: true,
        filterable: true,
        maxlength: 50,
        rules: [commonBlurReg],
        placeholder: '工序',
        dataSource: [],
        visibleChange: () => { this.selectDatasource() }
      },
      _orderDays: {
        prop: 'orderDays',
        itemType: 'input',
        label: '大货天数',
        clearable: true,
        maxlength: 4,
        rules: [commonBlurReg, { validator: checkNum, trigger: 'blur' }],
        placeholder: '请输入大货天数'
      },
      _sampleDays: {
        prop: 'sampleDays',
        itemType: 'input',
        label: '样板天数',
        clearable: true,
        maxlength: 4,
        rules: [commonBlurReg, { validator: checkNum, trigger: 'blur' }],
        placeholder: '请输入样板天数'
      }
    }
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新建',
      okText: '保存',
      cancelText: '取消',
      size: '580px',
      // saveAndaddText: "保存并继续",
      ok: (params) => {
        this.addOrEdit(params)
      },
      cancel: (params) => {
        this.$set(this.popOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {},
      content: commont
    }
    return {
      formOtions: {
        size: 'small',
        inline: true,
        layout: true
      },
      formDatas: {},
      columns,
      commont,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      editData: {}
    }
  },
  computed: {
    // scrollWrapper() {
    //   return this.$refs.tabsScrollContainer.$refs.wrap
    // }
  },
  mounted() { },
  created() {
    this.getRulePage()
    this.selectDatasource()
  },
  methods: {
    // 修改
    editFn(row) {
      this.type = 'edit'
      const data = this.$utils.deepClone(row)
      this.oldForm = row
      data.updatedBy ? delete data.updatedBy : ''
      data.updatedTime ? delete data.updatedTime : ''
      this.$set(this.popOptions, 'formDatas', data)
      console.log('this.popOptions', this.popOptions)
      this.PopDialogHandle('编辑')
    },
    async enableStatus(data) {
      const res = await changeApsDyeDay(data)
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
      this.fetchLog(this.getLogMessages('UPDATE', '/baseData/apsDyeDay/status'), data, JSON.stringify({ beforeText: `在'产能中心-生产天数设置-染整'${data.status === 0 ? '启用' : '停用'}一条数据`, beforeCode: data }))
      this.getRulePage({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      })
    },
    addOrEdit(params = {}, go) {
      this.$refs.popForm.$refs.popComponents.form.validate(async(valid) => {
        if (valid) {
          // for (let i = 0; i < this.popOptions.content._paramId.dataSource.length; i++) {
          //   if (this.popOptions.content._paramId.dataSource[i].value === params.paramId) {
          //     params.paramName = this.popOptions.content._paramId.dataSource[i].label
          //     break
          //   }
          // }
          if (this.type === 'edit') {
            await modifyApsDyeDay(params)
            const { beforeCode, afterCode } = this.compareData(
              this.oldForm,
              params,
              'id'
            )
            const flag =
              JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag &&
              this.fetchLog(
                this.getLogMessages('UPDATE', '/baseData/apsDyeDay/modify'),
                params,
                JSON.stringify({
                  beforeText: `在'产能中心-生产天数设置-染整'将${JSON.stringify(
                    { id: params.id }
                  )}`,
                  afterText: '修改为',
                  ...{ beforeCode, afterCode }
                })
              )
            this.getRulePage({
              pageNum: this.pagination.currentPage,
              pageSize: this.pagination.pageSize
            })
          } else {
            await addApsDyeDay(params)
            this.fetchLog(
              this.getLogMessages('INSERT', '/baseData/apsDyeDay/add'),
              params,
              JSON.stringify({
                beforeText: `在'产能中心-生产天数设置-染整'新增一条记录`,
                beforeCode: params
              })
            )
            this.getRulePage()
          }
          this.$set(this.popOptions, 'formDatas', {})
          this.$set(this.popOptions, 'visible', false)
          this.$message.success('保存成功')
          // this.getRulePage()
        }
      })
    },
    deleteFn(params) {
      this.$confirm(
        `确认删除当前数据吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.deleteList(params)
      }
      ).catch((_) => { })
    },
    async deleteList(data) {
      const res = await deleteApsDyeDay(data)
      if (res.code === 200) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message ? res.message : '删除失败',
          type: 'error'
        })
      }
      this.fetchLog(this.getLogMessages('DELETE', '/baseData/apsDyeDay/delete'), data, JSON.stringify({ beforeText: `在'产能中心-生产天数设置-染整'删除一条数据`, beforeCode: data }))
      this.getRulePage()
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (this.popOptions.visible) {
        // this.setSelectData();
      }
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 列表查询
    async getRulePage(data = {}, isSearch) {
      const res = await apsDyeDayList({
        ...data
      })
      this.dataSource = (res.data && res.data.list) || []
      this.pagination = {
        ...this.pagination,
        dataTotal: (res.data && res.data.total) || 0,
        ...data,
        currentPage: (res.data && res.data.pageNum) || 1,
        pageSize: (res.data && res.data.pageSize) || 20
      }
      if (!isSearch) {
        // this.setSearchSelect();
      }
    },
    // 新建
    handleAdd() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.PopDialogHandle('新建')
    },
    handleClick() {
      this.getRulePage()
    },
    async selectDatasource() {
      const res = await requirementsDyeList()
      const resultList = (res.data && res.data.list) || []
      this.popOptions.content._param.dataSource = resultList.map(item => {
        return {
          label: item.name,
          value: item.uuid
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrap-data-list {
  padding: 20px;
  padding-bottom: 0px;
}
</style>

<style lang="scss">
</style>
