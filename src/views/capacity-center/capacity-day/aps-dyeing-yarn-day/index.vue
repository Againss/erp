<template>
  <div class="wrap-data-list">
    <!-- 搜索页面 -->
    <!-- <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div> -->
    <!-- 新增按钮 -->
    <!-- <div class="wrap-btns">
      <div class="button">
        <el-button
          size="small"
          @click="handleAdd"
        >新建</el-button>
      </div>
    </div> -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
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
  apsDyeingYarnDayList,
  changeApsDyeingYarnDay,
  // addApsDyeingYarnDay,
  modifyApsDyeingYarnDay
  // deleteApsDyeingYarnDay
} from './api/index'
export default {
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })

    // 表格表头的配置信息
    const columns = [
      {
        prop: 'paramName',
        label: '染纱工艺',
        minWidth: '120',
        showOverflowTooltip: true
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
          permitTag: 'bmpAps:apsDyeingYarnDay:status',
          changeStatus: (scope) => {
            this.enableStatus({ id: scope.row.id, status: scope.row.status })
          }
        }
      }
    ]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['bmpAps:apsDyeingYarnDay:modify'],
        isShow: true,
        handle: (scope) => {
          this.editFn(scope.row)
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
      // _paramName: {
      //   prop: 'paramName',
      //   itemType: 'select',
      //   label: '染纱工艺',
      //   clearable: true,
      //   maxlength: 50,
      //   rules: [commonBlurReg],
      //   placeholder: '请选择染纱工艺',
      //   dataSource: [
      //     {
      //       label: 'A',
      //       value: 'A'
      //     }
      //   ]
      // },
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
      this.PopDialogHandle('编辑')
    },
    async enableStatus(data) {
      const res = await changeApsDyeingYarnDay(data)
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
      this.fetchLog(this.getLogMessages('UPDATE', '/baseData/apsDyeingYarnDay/status'), data, JSON.stringify({ beforeText: `在'产能中心-生产天数设置-染纱'${data.status === 0 ? '启用' : '停用'}一条数据`, beforeCode: data }))
      this.getRulePage({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      })
    },
    addOrEdit(params = {}, go) {
      this.$refs.popForm.$refs.popComponents.form.validate(async(valid) => {
        if (valid) {
          if (this.type === 'edit') {
            await modifyApsDyeingYarnDay(params)
            const { beforeCode, afterCode } = this.compareData(
              this.oldForm,
              params,
              'id'
            )
            const flag =
              JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
            flag &&
              this.fetchLog(
                this.getLogMessages('UPDATE', '/baseData/apsDyeingYarnDay/modify'),
                params,
                JSON.stringify({
                  beforeText: `在'产能中心-生产天数设置-染纱,将${JSON.stringify(
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
            // await addApsDyeingYarnDay(params)
            // this.fetchLog(
            //   this.getLogMessages('INSERT', '/baseData/apsDyeingYarnDay/add'),
            //   params,
            //   JSON.stringify({
            //     beforeText: `在'产能中心-生产天数设置-染纱,新增一条记录`,
            //     beforeCode: params
            //   })
            // )
          }
          this.$set(this.popOptions, 'formDatas', {})
          this.$set(this.popOptions, 'visible', false)
          this.$message.success('保存成功')
          // this.getRulePage()
        }
      })
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
      const res = await apsDyeingYarnDayList({
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
