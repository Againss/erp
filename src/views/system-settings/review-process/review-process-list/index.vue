<template>
  <div class="wrap-flow-list">
    <!-- 搜索页面 -->
    <!-- <div class="search">
      <cs-custom-form ref="searchForm" :data-source="searchData" :options="formOtions" :form-datas="formDatas" />
    </div> -->
    <!-- 新增按钮 -->
    <div class="wrap-btns">
      <div class="button">
        <el-button
          v-permission="['sysSettings:workflowGroup:add']"
          type="primary"
          size="small"
          @click="addFn"
        >新建分组</el-button>
      </div>
      <div class="button">
        <el-button
          :disabled="!$permission(['sysSettings:billCheckSetting:workflow:add'])"
          size="small"
          @click="handleAdd"
        >新建流程</el-button>
      </div>
    </div>

    <div class="wrap-tabs">
      <!-- <el-scrollbar
        ref="tabsScrollContainer"
        class="scroll-container"
        @wheel.native.prevent="handleScroll"
      > -->
      <div class="tabs">
        <!-- @tab-click="" -->
        <el-tabs
          v-model="activeIdx"
          @tab-click="handleClick"
        >
          <el-tab-pane
            v-for="(v, i) in groupList"
            :key="v.groupName"
            :label="v.groupName.replace(/ /g, '&nbsp;') + ` (${countList[v.groupId] || 0})`"
            :name="i + ''"
          >
            <span slot="label">{{ v.groupName.replace(/ /g, '&nbsp;') + ` (${countList[v.groupId] || 0})` }}</span>
          </el-tab-pane>
          <el-tab-pane
            :label="`已停用${stopped >= 0 ? ' (' + stopped + ')' : ''}`"
            name="stopped"
          />
        </el-tabs>
      </div>
      <!-- </el-scrollbar> -->
      <div class="dropdown-operate">
        <el-dropdown
          trigger="click"
          @command="handleCommand"
        >
          <el-button
            type="primary"
            plain
            size="small"
          >
            编辑分组<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-permission="['sysSettings:workflowGroup:modify']"
              command="rename"
              style="color: #0986ff"
              :disabled="groupEdit"
            >重命名</el-dropdown-item>
            <el-dropdown-item
              v-permission="['sysSettings:workflowGroup:delete']"
              command="delete"
              style="color: #fe4949"
              :disabled="groupEdit"
            >删除分组</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- groupList[activeIdx].groupName !== '已停用' && groupList[activeIdx].groupName !== '其他' ? '#fe4949' : '' -->
      </div>
    </div>
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
    <!-- 分组编辑pop弹出层 -->
    <div class="pop">
      <cs-custom-pop
        ref="popForm"
        :options="popOptions"
        :edit-data="editData"
      />
    </div>
    <!-- list 移动到 pop弹出层 -->
    <edit-pop
      :pop-options="movePopOptions"
      :group-list="groupList"
      :edit-data="editData"
      @updateList="getGroupList"
    />
  </div>
</template>

<script>
import { fetchLog } from '@/views/system-settings/common/fetchLog'
// import enableSwitch from "./components/enableSwitch";
// import tableHeader from "./components/table-header";
import editPop from './components/edit-pop'
import {
  workflowList,
  changeWorkflow,
  getWorkflowGroup,
  // moveGroup,
  addGroup,
  modifyGroup,
  deleteGroup,
  flowAllCounts
} from './api/index'
export default {
  components: { editPop },
  mixins: [fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur', 'change'] })
    const checkGroup = (rule, value, callback) => {
      for (let i = 0; i < this.groupList.length; i++) {
        if ((this.type === 'add' || i !== parseInt(this.activeIdx)) && value === this.groupList[i].groupName || value === '已停用') {
          return callback(new Error('分组名称重复'))
        }
      }
      callback()
    }
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'workflowId',
        label: '流程ID',
        minWidth: '100',
        showOverflowTooltip: true,
        style: {
          color: '#0986FF',
          cursor: 'pointer'
        },
        handle: (scope) => {
          this.$router.push(
            `./review-processr-detail/${scope.row.workflowId}`
          )
        }
      },
      {
        prop: 'workflowName',
        label: '审批流程名称',
        minWidth: '120',
        showOverflowTooltip: true,
        style: {
          color: '#0986FF',
          cursor: 'pointer'
        },
        handle: (scope) => {
          this.$router.push(
            `./review-processr-detail/${scope.row.workflowId}`
          )
        }
      },
      {
        prop: 'businessName',
        label: '关联业务表单',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'remark',
        label: '流程说明',
        minWidth: '180',
        showOverflowTooltip: true
      },
      {
        prop: 'updatedTime',
        label: '最后更新时间',
        minWidth: '120',
        showOverflowTooltip: true,
        formater: (scope) => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(
            scope.row[scope.column.property], '{y}-{m}-{d} {h}:{i}') : ''
        }
      }
    ]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['sysSettings:workflow:modify'],
        isShow: true,
        handle: (scope) => {
          this.$router.push(
            `./review-processr-edit/${scope.row.workflowId}`
          )
        }
      },
      {
        label: '详情',
        // permitTag: ['price:dyeingInfo:modify'],
        isShow: false,
        handle: (scope) => {
          this.$router.push(
            `./review-processr-detail/${scope.row.workflowId}`
          )
        }
      },
      {
        label: '停用',
        permitTag: ['sysSettings:workflow:change'],
        isShow: (scope) => {
          return scope.row.status === 0 || scope.row.status === '0'
        },
        handle: (scope) => {
          this.$confirm(
            `停用表单会被放到“停用”分组中。`,
            '确定要停用表单吗？',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() =>
              this.editList({
                workflowId: scope.row.workflowId,
                status: 1
              })
            )
            .catch((_) => { })
        }
      },
      {
        label: '启用',
        permitTag: ['sysSettings:workflow:change'],
        isShow: (scope) => {
          return scope.row.status === 1 || scope.row.status === '1'
        },
        handle: (scope) => {
          this.$confirm(
            `确认${scope.row.status === 0 ? '停用' : '启用'}当前数据吗？`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() =>
              this.editList({
                workflowId: scope.row.workflowId,
                status: 0
              })
            )
            .catch((_) => { })
        }
      },
      {
        label: '移动',
        permitTag: ['sysSettings:workflow:moveGroup'],
        isShow: (scope) => {
          return scope.status !== 1
        },
        handle: (scope) => {
          this.type = 'move'
          this.moveList(scope.row)
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
    const commont = [
      {
        prop: 'groupName',
        itemType: 'input',
        // label: "分组名称",
        clearable: true,
        maxlength: 20,
        rules: [commonBlurReg, { validator: checkGroup, trigger: 'blur' }, { max: 20, message: '分组名称不能超过20个字符', trigger: 'blur' }],
        placeholder: '请输入分组名称'
      }
    ]
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '新建分组',
      okText: '保存',
      cancelText: '取消',
      // saveAndaddText: "保存并继续",
      ok: (params) => {
        this.addOrEdit(params, true)
      },
      cancel: (params) => {
        this.$set(this.popOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {},
      content: commont
    }
    // 移动 编辑列表弹出层
    const movePopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '移动',
      ifAdd: false // 是否增加分组
      // rules: {
      //   name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
      // }
    }
    return {
      stopped: 0, // 已停用数据
      activeIdx: '0',
      formOtions: {
        size: 'small',
        inline: true,
        layout: true
      },
      formDatas: {
        status: ''
      },
      columns,
      commont,
      dataSource: [],
      pagination,
      popOperates,
      popOptions,
      movePopOptions,
      editData: {},
      type: 'add',
      oldForm: {}, // 旧分组数据
      countList: {}, // 分组数据总数
      groupList: [] // 分组列表
    }
  },
  computed: {
    // scrollWrapper() {
    //   return this.$refs.tabsScrollContainer.$refs.wrap
    // }
    groupEdit() {
      // return false
      return this.activeIdx === 'stopped' || this.groupList.length <= this.activeIdx || this.groupList[this.activeIdx].groupName === '已停用' || this.groupList[this.activeIdx].groupName === '其他'
    }
  },
  mounted() { },
  created() {
    // 获取分组数据
    this.getGroupList()
    // this.getRulePage()
  },
  methods: {
    // 修改分组
    editFn() {
      this.type = 'edit'
      const data = this.$utils.deepClone(this.groupList[this.activeIdx])
      this.oldForm = this.groupList[this.activeIdx]
      data.updatedBy ? delete data.updatedBy : ''
      data.updatedTime ? delete data.updatedTime : ''
      this.$set(this.popOptions, 'formDatas', data)
      this.PopDialogHandle('编辑分组')
    },
    // 新增分组
    addFn() {
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {})
      this.PopDialogHandle('新增分组')
    },
    // 修改数据/移动到
    moveList(row) {
      // this.type = "add";
      this.$set(this.movePopOptions, 'visible', !this.movePopOptions.visible)
      if (this.movePopOptions.visible) {
        this.$set(this.movePopOptions, 'ifAdd', false)
        this.editData = { ...row }
        this.$set(this.editData, 'groupId', row.groupId)
        this.$set(
          this.movePopOptions,
          'title',
          `移动${row.workflowName || ''}到`
        )
      }
    },
    async editList(data) {
      await changeWorkflow({
        ...data
      })
      // if (res.code === 200) {
      //   this.$message({
      //     message: res.message ? res.message : '更新状态成功',
      //     type: 'success'
      //   })
      // } else {
      //   this.$message({
      //     message: res.message ? res.message : '更新状态失败',
      //     type: 'error'
      //   })
      // }
      this.fetchLog(this.getLogMessages('UPDATE', '/workflow/change'), data, JSON.stringify({ beforeText: `在'系统设置-审核流程'${data.status === 0 ? '启用' : '停用'}一条数据`, beforeCode: data }))
      this.getRulePage()
      this.getFlowAllCounts()
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
    // 新增或修改分组弹出框点击确认按钮的接口事件
    // async
    addOrEdit(params = {}, go) {
      this.$refs.popForm.$refs.popComponents.form.validate(async(valid) => {
        if (valid) {
          if (this.type === 'edit') {
            if (params.groupName === this.groupList[this.activeIdx].groupName) {
              // 没有改变
              console.log('nochange')
              go = false
            } else {
              await modifyGroup(params)
              const { beforeCode, afterCode } = this.compareData(
                this.oldForm,
                params,
                'groupId'
              )
              const flag =
                JSON.stringify(beforeCode) !== JSON.stringify(afterCode)
              flag &&
                this.fetchLog(
                  this.getLogMessages('UPDATE', '/workflowGroup/modify'),
                  params,
                  JSON.stringify({
                    beforeText: `在'系统设置-审核流程-流程分组,将${JSON.stringify(
                      { groupId: params.groupId }
                    )}`,
                    afterText: '修改为',
                    ...{ beforeCode, afterCode }
                  })
                )
            }
          } else {
            await addGroup(params)
            this.fetchLog(
              this.getLogMessages('INSERT', '/workflowGroup/add'),
              params,
              JSON.stringify({
                beforeText: `在'系统设置-审核流程-流程分组,新增一条记录`,
                beforeCode: params
              })
            )
          }
          this.$set(this.popOptions, 'formDatas', {})
          this.$set(this.popOptions, 'visible', false)
          this.$message.success('保存成功')
          if (go) {
            // 新增分组成功后修改相应数据
            this.getGroupList()
          }
        }
      })
    },
    // 列表查询
    async getRulePage(data = {}, isSearch) {
      let params = {
        groupId: this.groupList[this.activeIdx] && this.groupList[this.activeIdx].groupId,
        status: 0
      }
      if (this.activeIdx === 'stopped') {
        params = {
          groupId: '',
          status: 1
        }
      }
      const res = await workflowList({
        ...data,
        ...params
      })
      if (this.activeIdx === 'stopped') this.stopped = res.data.total || 0
      // else this.groupList[this.activeIdx].total = res.data.total || 0
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
    // 列表查询
    async getStopped() {
      const params = {
        groupId: '',
        status: 1
      }
      const res = await workflowList({
        ...params
      })
      this.stopped = res.data.total || 0
    },
    // 获取分组数据
    async getGroupList() {
      const res = await getWorkflowGroup()
      // this.groupList = (res.data && res.data.list) || []
      // this.groupList.reverse()
      const tempList = (res.data && res.data.list) || []
      tempList.reverse()
      this.$set(this, 'groupList', tempList)
      this.getRulePage()
      this.getFlowAllCounts()
    },
    // 每个分组对应的流程数量
    async getFlowAllCounts() {
      const res = await flowAllCounts()
      const countList = res.data || []
      const temp = {}
      for (let i = 0; i < countList.length; i++) {
        this.$set(temp, countList[i].groupId, countList[i].num)
      }
      this.$set(this, 'countList', temp)
      if (this.activeIdx !== 'stopped') this.getStopped()
    },
    // 新建流程
    handleAdd() {
      this.$router.push(`./review-processr-add`)
    },
    async deleteGroup(idx) {
      await deleteGroup({ groupId: this.groupList[idx].groupId })
      this.fetchLog(
        this.getLogMessages('DEL', '/workflowGroup/delete'),
        this.groupList[idx],
        JSON.stringify({
          beforeText: `在'系统设置-审核流程-流程分组'删除一条记录`,
          beforeCode: this.groupList[idx]
        })
      )
      this.activeIdx = '0'
      this.getGroupList()
    },
    // handleCommand
    handleCommand(key) {
      if (key === 'rename') {
        this.editFn(this.activeIdx)
      } else if (key === 'delete') {
        this.$confirm('删除后分组内的表单不会被删除，将会进入到“其它”分组。', '确认删除当前分组吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => this.deleteGroup(this.activeIdx))
          .catch(() => { })
      }
    },
    handleClick() {
      this.getRulePage()
    }
    // handleScroll(e) {
    //   const eventDelta = e.wheelDelta || -e.deltaY * 40
    //   const $scrollWrapper = this.scrollWrapper
    //   $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    // }
  }
}
</script>

<style lang='scss' scoped>
.wrap-flow-list {
  padding: 20px;
  padding-bottom: 0px;
  .wrap-btns {
    display: flex;
    .button {
      margin-right: 12px;
    }
  }
  .page-table {
    margin-bottom: 18px;
    overflow: hidden;
    // transition: height 200ms;
    // &.inactive {
    //   height: 47px;
    // }
  }

  .wrap-tabs {
    display: flex;
    align-items: center;
    position: relative;
    padding-bottom: 0;
    min-height: 60px;
    background-color: #fff;
    border-bottom: 1px solid #dfe6ec;
    .tabs {
      padding-bottom: 1px;
      display: flex;
      // width: 100%;
      flex: 2;
      overflow-x: auto;
      overflow-y: hidden;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #3c4043;
      text-align: center;
      /deep/ .el-tabs__header {
        margin-bottom: 0px;
      }
      /deep/ .el-tabs__nav-wrap::after {
        height: 0px !important;
      }
      /deep/ .el-tabs__item {
        height: 60px;
        line-height: 60px;
        padding: 0 20px;
      }
    }
    .dropdown-operate {
      padding-right: 20px;
    }
  }
}
</style>

<style lang="scss">
.el-dropdown-menu__item.is-disabled {
  color: #bbb !important;
}
</style>
