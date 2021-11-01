<template>
  <div class="wraving-technology">
    <!-- 新增按钮 -->
    <!-- <div class="button">
      <el-button v-permission="['techManage:tmWeavingTech:add']" size="small" type="primary" @click="addHandle">新增操作</el-button>
    </div> -->
    <div class="process-top">
      <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
        <el-tab-pane label="类型" name="C" />
        <el-tab-pane label="打包方式" name="P" />
        <el-tab-pane label="织机种类" name="K" />
        <el-tab-pane label="织机转向" name="R" />
      </el-tabs>
      <el-button v-permission="['baseData:tmWeavingTech:add']" class="process-button" size="small" type="primary" @click="addHandle">新增</el-button>
    </div>
    <!-- 列表 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="light"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
      />
    </div>
    <!-- pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import enableSwitch from '../weaving-technology/components/enableSwitch.vue'
import { tmWeavingTechPage, tmWeavingTechAdd, tmWeavingTechModify, tmWeavingTechDelete, tmWeavingTechInfo, tmWeavingTechStatus, tmWeavingTechEnable } from './api/index'
export default {
  props: {},
  data() {
    // {forEachColumns columns} back
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = {
      '_id': {
        prop: 'id',
        label: '序号',
        minWidth: '60',
        formater: (scope) => {
          return scope.$index + 1
        }
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
          permitTag: 'baseData:tmWeavingTech:enable',
          changeStatus: (scope) => {
            console.log(scope)
            this.statusChange({ techId: scope.row.id, enabled: scope.row.enabled })
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
          permitTag: ['baseData:tmWeavingTech:modify'],
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
            this.$set(this.popOptions.content._nameEn, 'disabled', statusFlag)
            this.$set(this.popOptions.content._name, 'disabled', statusFlag)
            this.editHandle(params)
          }
        },
        {
          label: '删除',
          permitTag: ['baseData:tmWeavingTech:delete'],
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
          permitTag: ['baseData:tmWeavingTech:status'],
          isShow: scope => {
            if (scope.row.status === 'Y') {
              return false
            } else {
              return true
            }
          },
          handle: params => {
            console.log(params)
            this.$confirm('审核后中英文不允许修改，确定审核？', '提示', {
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
          maxlength: 100,
          rules: [commonBlurReg],
          placeholder: '请输入中文名称'
        },
        '_nameEn': {
          prop: 'nameEn',
          itemType: 'input',
          label: '英文名:',
          maxlength: 100,
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
        console.log('current', val)
        // this.list({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        // this.list({ pageNum: 1, pageSize: val })
      }
    }

    return {
      dataSource: [],
      columns,
      row: {},
      popOptions,
      popOperates,
      pagination,
      type: 'add',
      activeName: 'C'
    }
  },
  created() {
    this.getTmWeavingTechList({ type: 'C' })
  },
  mounted() {},
  methods: {
    // 获取织造工艺详情
    async getTmWeavingTechInfo(data = {}) {
      const res = await tmWeavingTechInfo(data)
      // console.log(res)
      if (res.code !== 200) {
        return false
      }
      this.row = res.data
      this.setFormDatas({ ...res.data })
    },
    // 获取织造工艺列表
    async getTmWeavingTechList(data = {}) {
      const res = await tmWeavingTechPage(data)
      const listData = res.data || []
      this.dataSource = listData
    },
    // 织造工艺删除操作
    async tmWeavingTechDelete(data) {
      const res = await tmWeavingTechDelete({ 'techId': data.id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(this.getLog('DEL', '/techManage/tmWeavingTech/delete'), { 'techId': data.id }, JSON.stringify({ beforeText: `在'工艺管理-织造工艺'删除一条记录`, beforeCode: { 'techId': data.id }}))
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
      this.fetchLog(this.getLog('INSERT', '/techManage/tmWeavingTech/add'), params, JSON.stringify({ beforeText: `在'工艺管理-织造工艺'新增一条记录`, beforeCode: params }))
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
      const { beforeCode, afterCode } = this.compareData(this.row, params, 'techId')
      const flag = JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
      flag && this.fetchLog(this.getLog('UPDATE', '/techManage/tmWeavingTech/modify'), params, JSON.stringify({ beforeText: `在'某系統-某頁面'將${JSON.stringify({ 'techId': params['techId'] })}`, afterText: '修改为', ...{ beforeCode, afterCode }}))
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('修改成功')
      this.getTmWeavingTechList({ type: this.activeName })
    },

    // 启用/禁用事件
    async statusChange(data = {}) {
      await tmWeavingTechEnable(data)
      this.$message.success(`织造工艺${data.enabled === 'Y' ? '启用' : '禁用'}成功`)
    },

    // 审核织造工艺事件
    async examineWeavingTech(data = {}) {
      const res = await tmWeavingTechStatus({ techId: data.id })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('该织造工艺审核成功')
      this.getTmWeavingTechList({ type: this.activeName })
    },

    // 编辑按钮事件
    editHandle(params) {
      console.log(params)
      this.PopDialogHandle('修改操作')
      this.type = 'edit'
      this.getTmWeavingTechInfo({ 'techId': params.row.id })
    },
    // 新增按钮事件
    addHandle() {
      this.PopDialogHandle('新增操作')
      this.setFormDatas({})
      this.type = 'add'
      this.$set(this.popOptions.content._nameEn, 'disabled', false)
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
      console.log(this.activeName)
      this.getTmWeavingTechList({ type: this.activeName })
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

      .process-button {
        margin-right: 20px;
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
