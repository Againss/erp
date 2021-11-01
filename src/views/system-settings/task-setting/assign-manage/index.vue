<template>
  <div class="assign-manage-container">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
    </div>
    <!-- tab切换 -->
    <div class="list-tabs">
      <el-tabs v-model="activeIdx" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, i) in taskTypeArr"
          :key="i"
          :label="`${item.label}(${item.count})`"
          :name="item.value"
        />
      </el-tabs>
      <el-button
        v-permission="['sysSettings:task:outworker:add']"
        type="primary"
        size="small"
        style="margin-left: auto;"
        @click="addList"
      >新增</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        lazy
        :pagination="pagination"
        :data-total="dataSource.length"
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
  assignPage,
  assignEnabled,
  assignUpdate,
  assignPageCount,
  assignAdd,
  areaList,
  assignDelete,
  outworkerList,
  searchOutworkerList,
  outworkerDetail
} from './api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import enableSwitch from './component/enableSwitch'
export default {
  data() {
    const searchData = {
      _sysUserUuid: {
        prop: 'sysUserUuid',
        itemType: 'select',
        label: '外勤人员:',

        dataSource: [],
        visibleChange: value => {
          if (value) {
            this.getSearchOutworker({})
          }
        }
      },
      _taskAreaId: {
        prop: 'taskAreaId',
        itemType: 'select',
        label: '区域',
        placeholder: '请选择',
        dataSource: [],
        visibleChange: (value, val) => {
          if (value) {
            this.getAreaList()
          }
        }
      },
      _operate: {
        itemType: 'operate',
        submitText: '查询',
        submitHandle: params => {
          this.initData(params)
          this.searchFormDatas = params
        },
        resetHandle: params => {
          this.searchFormDatas = {}
        }
      }
    }
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'realName',
        label: '外勤人员',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'mobile',
        label: '联系电话',
        minWidth: '80',
        showOverflowTooltip: true
      },

      {
        prop: 'isSmsEnabled',
        label: '短信提醒',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'sysSettings:task:outworker:enableSms',
          changeStatus: scope => {
            this.changeEnable({ id: scope.row.id }, scope)
          }
        }
      },
      {
        prop: 'areaName',
        label: '负责区域',
        minWidth: '80',
        showOverflowTooltip: true
      }
    ]
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        console.log(val)
        this.initData({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: val => {
        console.log(val)
        this.initData({ pageNum: 1, pageSize: val })
      }
    }
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'realName',
        itemType: 'select',
        // type: 'radio',

        valueType: 'object',
        placeholder: '请选择',
        clearable: true,
        filterable: true,

        label: '外勤人员',
        rules: [{ required: true, message: '外勤人员不能为空' }],
        dataSource: [],

        change: (value, form, formDatas) => {
          if (value) {
            console.log(this.outworker)
            const obj = this.outworker.filter(
              item => value.value === item.userId
            )[0]
            this.popOptions.formDatas.name = obj.name
            this.popOptions.formDatas.realName = obj.realName
            this.popOptions.formDatas.mobile = obj.mobile
            this.popOptions.formDatas.sysUserUuid = value.value
            // this.formDatas = formDatas
            // this.search()
          }
        },
        visibleChange: value => {
          if (value) {
            this.getOutworker({})
          }
        }
      },

      {
        prop: 'taskAreaId',
        itemType: 'select',
        type: 'radio',
        label: '区域',
        rules: [{ required: true, message: '区域不能为空' }],
        dataSource: [],
        change: (value, form, formDatas) => {
          if (value) {
            this.popOptions.formDatas.taskAreaId = value
          }
        },
        visibleChange: (value, val) => {
          if (value) {
            this.getAreaList()
          }
        }
      }
    ]
    const copyContent = [...commonContent]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['sysSettings:task:outworker:modify'],
        isShow: true,
        handle: scope => {
          this.$set(this.popOptions, 'content', copyContent)
          this.type = 'edit'
          this.PopDialogHandle('自动指派编辑')
          this.getAreaList()
          this.editList(scope.row.id, scope.row.code)
        }
      },
      {
        label: '删除',
        style: { color: '#FE4949' },
        permitTag: ['sysSettings:task:outworker:delete'],
        isShow: scope => {
          // return scope.row.status.code === 'B'
          return true
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
              this.deleteData(scope.row.id)
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
      width: '120',
      fixed: 'right',
      dataSource: popOperatesDataSource
    }
    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '自动指派创建',
      okText: '保存',
      ok: params => {
        this.addOrEdit(params)
      },
      beforeClose: (form, formDatas) => {
        const params = formDatas()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      cancel: params => {
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: copyContent
    }
    return {
      searchData,
      dataSource: [],
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        enabled: ''
      },
      columns,
      pagination,
      popOperates,
      popOptions,
      copyContent,
      type: 'add',
      oldForm: {}, // 旧详情数据
      outworker: [],
      // 坯布确版 0：坯布验布，1：成品验布
      taskType: {
        '0': {
          value: '0',
          label: '坯布确版',
          count: 0
        },
        '1': {
          value: '1',
          label: '坯布验布',
          color: '#00BCC5',
          count: 0
        },
        '2': {
          value: '2',
          label: '成品验布',
          color: '#FF9B02',
          count: 0
        },
        '3': {
          value: '3',
          label: '成品批色',
          color: '#FF9B02',
          count: 0
        }
      },
      activeIdx: '0'
    }
  },
  computed: {
    taskTypeArr() {
      const res = []
      for (const key in this.taskType) {
        res.push(this.taskType[key])
      }
      return res.sort((a, b) => {
        return a.value - b.value
      })
    }
  },
  created() {
    this.getAreaList()
    this.initData()
    this.getSearchOutworker()
    this.getOutworker()
  },
  mounted() {},
  methods: {
    addList() {
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('自动指派创建')
      this.$set(this.popOptions, 'content', this.content)
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 标签切换
    handleClick(e) {
      this.formDatas.taskType = e.name
      this.formDatas.pageSize = 20
      this.formDatas.pageNum = 1
      this.initData(this.formDatas)
    },
    // 列表查询
    async initData(data = {}) {
      data.pageNum = data.pageNum || 1
      data.taskType = this.activeIdx
      const res = await assignPage({ ...this.searchFormDatas, ...data })
      res.data.list &&
        res.data.list.map((item, index) => {
          item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1
        })

      const listData = res.data.list ? res.data.list : []
      for (let i = 0; i < listData.length; i++) {
        listData[i].isSmsEnabled = listData[i].isSmsEnabled === 1 ? 'Y' : 'N'
      }
      this.dataSource = listData || []

      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageNum: res.data.pageNum
      }
      this.getPageCount()
    },
    // 分页查询数量统计
    async getPageCount(data = {}) {
      const res = await assignPageCount({
        // taskType: this.activeIdx,
        sysUserUuid: this.searchFormDatas
          ? this.searchFormDatas.sysUserUuid
          : '',
        taskAreaId: this.searchFormDatas ? this.searchFormDatas.taskAreaId : '',
        pageNum: 1,
        pageSize: 1
        // ...data
      })
      const countInfo = res.data || {}
      this.taskType[0].count = countInfo['greySwatchesCount'] || 0
      this.taskType[1].count = countInfo['greyFabricCount'] || 0
      this.taskType[2].count = countInfo['productFabricCount'] || 0
      this.taskType[3].count = countInfo['finishBatchColorCount'] || 0
    },
    // 短信提醒开启/禁用
    async changeEnable(data = {}, scope) {
      data.isEnabled = scope.row.isSmsEnabled
      const res = await assignEnabled(data).catch(() => {
        scope.row.isSmsEnabled = scope.row.isSmsEnabled === 'N' ? 0 : 1
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
    // 点击编辑获取详情
    async editList(id, code) {
      const res = await outworkerDetail({ id: id })
      if (!res || res.code !== 200) {
        return false
      }
      const editData = res.data || {}
      this.oldForm = { ...editData, code: code }
      this.setFormDatas({ ...editData, code: code })
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 新增或修改弹出框点击确认按钮的接口事件
    addOrEdit(params) {
      // 走新增接口
      if (this.type === 'add') {
        const obj = {}
        const pamraskey = [
          'taskAreaId',
          'sysUserUuid',
          'name',
          'realName',
          'mobile'
        ]
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        params = Object.assign(obj, this.popOptions.formDatas)
        this.addData(params)
      } else if (this.type === 'edit') {
        // 走编辑接口
        const obj = {}
        const pamraskey = [
          'id',
          'taskAreaId',
          'sysUserUuid',
          'name',
          'realName',
          'mobile'
        ]
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
      }
    },
    // 获取外勤人员
    async getSearchOutworker() {
      const res = await searchOutworkerList({ taskType: this.activeIdx })

      const outworkerData = (res.data || []).map(item => {
        return { value: item.sysUserUuid, label: item.realName }
      })
      const outwork = this.deWeightFour(outworkerData)
      console.log(outwork)
      this.$set(this.searchData._sysUserUuid, 'dataSource', outwork)
    },
    deWeightFour(arr) {
      const obj = {}
      arr = arr.reduce(function(a, b) {
        obj[b.label] ? '' : (obj[b.label] = true && a.push(b))
        return a
      }, [])
      return arr
    },
    // 获取用户中心有效用户（弹框）
    async getOutworker() {
      const res = await outworkerList({ isEnabled: 1 })
      const datas = res.data.list || []
      this.outworker = [...datas]
      const outworkerData = (res.data.list || []).map(item => {
        return { value: item.userId, label: item.realName }
      })
      // this.$set(this.searchData._sysUserUuid, 'dataSource', outworkerData)
      this.$set(this.copyContent[0], 'dataSource', outworkerData)
    },
    // 获取区域列表
    async getAreaList() {
      const res = await areaList({ factoryName: '', taskType: this.activeIdx })
      const areaData = (res.data || []).map(item => {
        return { value: item.id, label: item.name }
      })
      this.$set(this.searchData._taskAreaId, 'dataSource', areaData)
      this.$set(this.copyContent[1], 'dataSource', areaData)
    },

    // 新增的确定事件
    async addData(data = {}) {
      const res = await assignAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.initData()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      const api = `/sysSettings/task/outworker/add`
      const opratorType = `INSET`
      const description = {
        beforeText: `在'系统设置-任务配置-指派管理'新增一条记录`,
        beforeCode: data
      }
      const appId = 'sysSettings'
      this.$store.dispatch('app/fetchParamsLog', {
        data,
        opratorType,
        api,
        description,
        appId
      })
    },
    // 更新
    async addUpdate(data = {}) {
      const res = await assignUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.initData({
        page: this.pagination.page || 1,
        pageSize: this.pagination.pageSize || 20
      })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      const api = `/sysSettings/task/outworker/modify`
      const opratorType = `UPDATE`
      const description = {
        beforeText: `在'系统设置-任务配置-指派管理'新增一条记录`,
        beforeCode: data
      }
      const appId = 'sysSettings'
      this.$store.dispatch('app/fetchParamsLog', {
        data,
        opratorType,
        api,
        description,
        appId
      })
    },
    // 删除
    async deleteData(id) {
      const res = await assignDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.initData({
        pageNum: this.pagination.pageNum || 1,
        pageSize: this.pagination.pageSize || 20
      })
      const params = { id: id }
      const api = `/sysSettings/task/area/delete`
      const opratorType = `DEL`
      const description = {
        beforeText: `在'系统设置-任务配置-区域配置'删除一条记录`,
        beforeCode: params
      }
      const appId = 'sysSettings'
      this.$store.dispatch('app/fetchParamsLog', {
        params,
        opratorType,
        api,
        description,
        appId
      })
    },
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.assign-manage-container {
  position: relative;
  padding: 20px;
  padding-bottom: 0px;
  .list-tabs {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d0d6da;
    padding-right: 20px;
    background: #fff;
    /deep/.el-tabs__nav .el-tabs__item {
      padding: 0 26px;
      height: 60px;
      line-height: 60px;
    }
  }
  /deep/ .el-tabs__header {
    margin: 0;
    .el-tabs__item {
      font-weight: 500;
    }
  }
  /deep/ .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #d0d6da;
  }
}
</style>
