<template>
  <div class="wraving-technology">
    <div class="process-top">
      <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
        <el-tab-pane label="布边要求" name="C" />
        <el-tab-pane label="款式要求" name="P" />
      </el-tabs>
      <el-button v-permission="['baseData:tmDyeFinishTech:add']" class="process-button" size="small" type="primary" @click="addHandle">新增</el-button>
    </div>
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div>
    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table
        table-scrollx
        tooltip-effect="dark"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        @sort-change="changeSort"
      />
    </div>
    <!-- pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import enableSwitch from './components/enableSwitch.vue'
import { tmWeavingTechPage, tmWeavingTechAdd, tmWeavingTechModify, tmWeavingTechDelete, tmWeavingTechInfo, tmWeavingTechStatus, tmWeavingTechEnable } from './api/index'
export default {
  props: {},
  data() {
    // {forEachColumns columns} back
    // 表格表头配置信息/以下五个都是table的配置信息
    // 查询/重置表单配置信息
    const searchData = [
      {
        prop: 'name',
        itemType: 'input',
        label: '名称:'
      },
      {
        prop: 'enabled',
        itemType: 'select',
        label: '启用/禁用:',
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
        ],
        change: (val) => {
          this.formDatas.enabled = val
          // this.getTmWeavingTechList()
        }
      },
      {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          const enabled = params.enabled && params.enabled === '' ? null : params.enabled
          this.formDatas = { ...params, enabled }
          this.getTmWeavingTechList({ ...params, enabled })
        },
        resetHandle: (params) => {
          this.formDatas = { type: this.formDatas.type, sorts: [] }
        }
      }
    ]
    const columns = {
      '_code': {
        prop: 'code',
        label: '序号',
        minWidth: '60'
      },
      '_name': {
        prop: 'name',
        label: '中文名',
        minWidth: '70',
        showOverflowTooltip: true
      },
      '_nameEn': {
        prop: 'nameEn',
        label: '英文名',
        minWidth: '70',
        showOverflowTooltip: true
      },
      '_remark': {
        prop: 'remark',
        label: '备注',
        minWidth: '200',
        showOverflowTooltip: true
      },
      '_updatedBy': {
        prop: 'updatedBy',
        label: '操作人',
        minWidth: '70',
        showOverflowTooltip: true
      },
      '_updatedTime': {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '80',
        showOverflowTooltip: true,
        sortable: true,
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}') : ''
        }
      },
      '_enabled': {
        prop: 'enabled',
        label: '启用/禁用',
        minWidth: '90',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'baseData:tmDyeFinishTech:submit',
          changeStatus: (scope) => {
            console.log(scope)
            this.statusChange({ id: scope.row.id, enabled: scope.row.enabled })
            // this.enableStatus({ id: scope.row.id }, scope)
          }
        }
      },
      '_status': {
        prop: 'status',
        label: '状态',
        minWidth: '60',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row[scope.column.property] === 'Y' ? `<span style="color: #00BCC5;">已审核</span>` : '<span style="color: #FF9B02;">未审核</span>'
        }
      }
    }
    // 正则验证
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })

    // 列表操作栏按钮
    const popOperates = {
      label: '操作',
      width: '200',
      fixed: 'right',
      // moreOptions: {
      //   maxLength: 2// 最大超过多少个显示more功能，默认为2
      // },
      dataSource: [
        {
          label: '编辑',
          permitTag: ['baseData:tmDyeFinishTech:modify'],
          isShow: (params) => {
            return true
          },
          handle: params => {
            // this.type = 'edit'
            let statusFlag = true
            if (params.row.status === 'Y') {
              statusFlag = true
            } else {
              statusFlag = false
            }
            this.$set(this.popOptions.content._name, 'disabled', statusFlag)
            this.editHandle(params)
          }
        },
        {
          label: '删除',
          permitTag: ['baseData:tmDyeFinishTech:delete'],
          style: { 'color': '#FE4949' },
          isShow: scope => {
            if (scope.row.status === 'Y') {
              return false
            } else {
              return true
            }
          },
          handle: params => {
            this.$confirm('确认删除当前数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.tmWeavingTechDelete(params.row)
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
          }
        },
        {
          label: '审核',
          permitTag: ['baseData:tmDyeFinishTech:change'],
          isShow: scope => {
            if (scope.row.status === 'Y') {
              return false
            } else {
              return true
            }
          },
          handle: params => {
            console.log(params)
            this.$confirm('确定审核？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.examineWeavingTech(params.row)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
          }
        }
      ]
    }

    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改',
      customClass: 'popOptionsClass',
      ok: params => {
        // console.log(params)
        this.addOrEditTmWeavingTech(params)
      },
      okText: '保存',
      cancel: params => {
        this.PopDialogHandle()
        // console.log(params)
      },
      formDatas: {},
      formOptions: {
      },
      content: {
        '_name': {
          prop: 'name',
          itemType: 'input',
          label: '中文名:',
          maxlength: 50,
          rules: [commonBlurReg],
          placeholder: '请输入中文名称'
        },
        '_nameEn': {
          prop: 'nameEn',
          itemType: 'input',
          label: '英文名:',
          maxlength: 50,
          // rules: [commonBlurReg],
          placeholder: '请输入英文名称'
        },
        '_remark': {
          prop: 'remark',
          itemType: 'input',
          label: '备注:',
          maxlength: 200,
          type: 'textarea',
          trim: (value) => {
            return value
          },
          autosize: { minRows: 2, maxRows: 4 },
          placeholder: '请输入'
        }
      }
    }

    // 表格分页
    const pagination = {
      currentChange: val => {
        this.getTmWeavingTechList({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        this.$set(this.pagination, 'currentPage', 1)
        this.getTmWeavingTechList({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }

    return {
      searchData,
      dataSource: [],
      formOtions: {
        size: 'small',
        inline: true
      },
      columns,
      row: {},
      popOptions,
      popOperates,
      pagination,
      type: 'add',
      activeName: 'C',
      formDatas: {
        sorts: [], // 正序
        type: 'C'
      }

    }
  },
  created() {
    this.getTmWeavingTechList()
  },
  mounted() {},
  methods: {
    // 排序点击事件
    changeSort(e) {
      this.formDatas.sorts = []
      if (e.order === 'ascending') {
        this.formDatas.sorts = ['updateTime']
      } else if (e.order === 'descending') {
        this.formDatas.sorts = ['-updateTime']
      } else {
        this.formDatas.sorts = []
      }
      this.getTmWeavingTechList()
    },
    // 获取织造工艺详情
    async getTmWeavingTechInfo(data = {}) {
      const res = await tmWeavingTechInfo(data)
      if (res.code !== 200) {
        return false
      }
      this.row = res.data
      this.setFormDatas({ ...res.data })
    },
    // 获取织造工艺列表
    async getTmWeavingTechList(data = {}) {
      const res = await tmWeavingTechPage({ ...this.formDatas, ...data })
      const listData = res.data ? res.data.list : []
      res.data.list && res.data.list.map((item, index) => { item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1 })

      this.dataSource = listData || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        page: res.data.pageNum
      }
    },
    // 织造工艺删除操作
    async tmWeavingTechDelete(data) {
      const res = await tmWeavingTechDelete({ 'id': data.id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLog('DEL', '/baseData/tmDyeFinishTech/delete'), { 'id': data.id }, JSON.stringify({ beforeText: `在'工艺管理-染整工艺'删除一条记录`, beforeCode: { 'id': data.id }}))
      this.$message.success('删除成功')
      this.getTmWeavingTechList({ type: this.activeName })
    },
    // 新增或者编辑织造工艺
    addOrEditTmWeavingTech(data) {
      if (this.type === 'add') {
        this.tmWeavingTechAdd(data)
      } else if (this.type === 'edit') {
        this.tmWeavingTechModify(data)
      }
    },
    // 织造工艺新增
    async tmWeavingTechAdd(params) {
      console.log(params)
      const res = await tmWeavingTechAdd({ type: this.activeName, ...params })
      console.log('新增微服务', res)
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLog('INSERT', '/baseData/tmDyeFinishTech/add'), params, JSON.stringify({ beforeText: `在'工艺管理-染整工艺'新增一条记录`, beforeCode: params }))
      // this.PopDialogHandle()
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('添加成功')
      this.getTmWeavingTechList({ type: this.activeName })
    },
    // 修改提交操作
    async tmWeavingTechModify(params) {
      console.log(params)
      const res = await tmWeavingTechModify(params)
      console.log(res)
      if (res.code !== 200) {
        return false
      }
      const { beforeCode, afterCode } = this.compareData(this.row, params, 'id')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLog('UPDATE', '/baseData/tmDyeFinishTech/modify'), params, JSON.stringify({ beforeText: `在'工艺管理-染整工艺'將${JSON.stringify({ 'id': params['id'] })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('修改成功')
      this.getTmWeavingTechList({ type: this.activeName })
    },

    // 启用/禁用事件
    async statusChange(data = {}) {
      await tmWeavingTechEnable(data)
      this.$message.success(`染整工艺${data.enabled === 'Y' ? '启用' : '禁用'}成功`)
    },

    // 审核染整工艺事件
    async examineWeavingTech(data = {}) {
      const res = await tmWeavingTechStatus({ id: data.id })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('该染整工艺审核成功')
      this.getTmWeavingTechList({ type: this.activeName })
    },

    // 编辑按钮事件
    editHandle(params) {
      console.log(params)
      this.PopDialogHandle('修改操作')
      this.type = 'edit'
      this.getTmWeavingTechInfo({ 'id': params.row.id })
    },
    // 新增按钮事件
    addHandle() {
      this.PopDialogHandle('新增操作')
      this.setFormDatas({})
      this.type = 'add'
      this.$set(this.popOptions.content._name, 'disabled', false)
    },
    // 设置表单数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 设置弹窗标题及显示隐藏
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 发送日志信息
    fetchLog(messages, data, description) {
      this.$store.dispatch('app/fetchLog', { ...messages, params: JSON.stringify(data), description })
    },
    // 获取日志信息
    getLog(opratorType, api) {
      const { userInfo, topic } = this.$store.state.user
      const baseURL = this.$store.state.app.baseURL
      const logcommonMessages = {
        type: 'OP', // 日誌類型
        appId: 'techManage', // 系統id
        handleResult: 'SUCCESS',
        userId: userInfo.userId,
        realName: userInfo.realName,
        userName: userInfo.name,
        topic: topic,
        description: '',
        createTime: new Date().getTime()
      }
      return {
        ...logcommonMessages,
        opratorType: opratorType,
        api: baseURL + api
      }
    },
    compareData(oldData, newData, id) {
      const comparedKeys = Object.keys(newData).filter(item => {
        if (Array.isArray(newData[item])) {
          return JSON.stringify(oldData[item] || []) !== JSON.stringify(newData[item])
        } else {
          return oldData[item] !== newData[item]
        }
      })
      const oldObj = {}
      const newObj = {}
      comparedKeys.forEach(item => {
        oldObj[item] = oldData[item]
        newObj[item] = newData[item]
      })
      return {
        beforeCode: { ...oldObj, [id]: newData[id] },
        afterCode: { ...newObj, [id]: newData[id] }
      }
    },

    // tab栏切换事件
    handleClick() {
      this.formDatas.name = ''
      this.formDatas.enabled = ''
      this.formDatas.sorts = []
      this.formDatas.type = this.activeName
      this.$set(this.pagination, 'currentPage', 1)
      this.getTmWeavingTechList()
    }
  }
}
</script>

<style lang="scss" scoped>
.wraving-technology {
    padding: 20px;

    .process-top {
      display: flex;
      align-items: center;
      margin-bottom: 1px;
      background-color: #fff;
      position: relative;
      .process-button {
        margin-right: 20px;
        position: absolute;
        right: 0;
        top: 14px;
      }
    }
}
.popOptionsClass {
    .el-textarea__inner{
        resize: none;
    }
}
</style>
<style lang="scss">
  .wraving-technology {
    .commonTabs {
      flex: 1;
      padding: 20px 20px 0;

      .el-tabs__item {
        line-height: 20px;
        font-size: 14px;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__header {
        margin-bottom: 0;
      }
      // .el-tabs__content {
      //   margin: 0 -40px;
      // }
    }
  }

  .popOptionsClass {
    .el-textarea__inner{
        resize: none;
    }
  }
</style>
