<template>
  <div class="region-config-container">
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
        v-permission="['sysSettings:task:area:add']"
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
  regionPage,
  regionUpdate,
  regionAdd,
  regionDelete,
  regionPageCount,
  taskList,
  regionDetail,
  existFactory
} from './api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import cusRigionSelect from './component/region-select'
// import TooltipShow from './component/tooltipShow.vue'
export default {
  // components: { cusRigionSelect },
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const searchData = [
      {
        prop: 'factoryNames',
        itemType: 'input',
        label: '任务地点:',

        dataSource: []
      },
      {
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
    ]
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'name',
        label: '区域名称',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'factoryNames',
        label: '任务地点',
        minWidth: '80',
        //  components: {
        //     TooltipShow
        //   },
        //   componentsOptions: {

        //   }
        showOverflowTooltip: true
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'name',
        itemType: 'input',
        label: '区域名称',
        clearable: true,
        maxlength: 12,
        rules: [{ required: true, message: '区域不能为空' }]
      },
      {
        itemType: 'input',
        prop: 'factoryIds',
        label: '工厂选择',
        maxlength: 60,
        clearable: true,
        components: {
          cusRigionSelect
        },
        componentsOptions: {
          factoryIds: '',
          factoryData: [],
          selectData: [],
          formDatas: {},
          hackReset: true,
          changeSelect: params => {
            this.factoryChange(params)
          },
          searchFac: params => {
            this.search(params)
          },
          selectFactory: params => {
            this.selectFactory(params)
          },
          deleteS: params => {
            this.deleteS(params)
          },
          clearAll: params => {
            this.clearAll(params)
          }
        },
        rules: [
          commonBlurReg,
          { message: '长度在 50 个字符以内', trigger: ['blur'] }
        ]
      }
    ]
    const copyContent = [...commonContent]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['sysSettings:task:area:modify'],
        isShow: true,
        handle: scope => {
          this.$set(this.popOptions, 'content', copyContent)
          this.$set(this.copyContent[1].componentsOptions, 'hackReset', true)
          this.type = 'edit'
          this.PopDialogHandle('编辑区域配置')

          this.editList(scope.row.id, scope.row.code)
        }
      },
      {
        label: '删除',
        style: { color: '#FE4949' },
        permitTag: ['sysSettings:task:area:delete'],
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
      destroyOnClose: true,
      title: '新增坯布项目',
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
        // cusRigionSelect.methods.clearAll()
        const flag = dataComparision(this.oldForm, params, this.type)
        this.CompaCallback(flag)
      },
      formDatas: {},
      formOptions: {},
      content: copyContent
    }
    // 分页配置信息
    const pagination = {
      currentChange: val => {
        this.initData({
          pageSize: this.pagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: val => {
        this.initData({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    return {
      searchData,
      countInfo: {}, // 汇总数据
      formOtions: {
        size: 'small',
        inline: true
      },
      formDatas: {
        enabled: ''
      },
      dataSource: [],
      pagination,
      columns,
      popOperates,
      popOptions,
      copyContent,
      type: 'add',
      oldForm: {}, // 旧详情数据
      // 坯布确版 0：坯布验布，1：成品验布，3：成品批色
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
      activeIdx: '0',
      factoryIds: '',
      factoryData: [],
      selectData: [],
      exitFactory: []
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
    this.initData()
    this.getExistFactory()
  },
  mounted() {},
  methods: {
    // 新增
    addList() {
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新增区域配置')
      console.log(this.popOptions)
      this.$set(this.popOptions, 'content', this.content)
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.popOptions, 'formDatas', {})
      this.$set(this.copyContent[1].componentsOptions, 'factoryIds', '')
      this.$set(this.copyContent[1].componentsOptions, 'hackReset', true)
      this.$set(this.copyContent[1].componentsOptions, 'formDatas', {})
      this.search({}, 'init')
    },
    // 标签切换
    handleClick(e) {
      this.formDatas.taskType = e.name
      this.formDatas.pageSize = 20
      this.formDatas.pageNum = 1
      this.initData(this.formDatas)
      this.getExistFactory()
    },
    // 初始化列表
    async initData(data = {}) {
      data.pageNum = data.pageNum || 1
      data.taskType = this.activeIdx
      const res = await regionPage({ ...this.searchFormDatas, ...data })
      res.data.list &&
        res.data.list.map((item, index) => {
          item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1
        })
      const listData = res.data.list ? res.data.list : []
      this.dataSource = listData || []
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageNum: res.data.pageNum
      }
      this.getPageCount({ ...this.searchFormDatas })
    },
    async getPageCount(data = {}) {
      // 分页查询数量统计
      const params = {
        pageSize: 1,
        pageNum: 1,
        taskType: this.activeIdx
      }
      const res = await regionPageCount({ ...params, ...data })
      const countInfo = res.data || {}
      this.taskType[0].count = countInfo['greySwatchesCount'] || 0
      this.taskType[1].count = countInfo['greyFabricCount'] || 0
      this.taskType[2].count = countInfo['productFabricCount'] || 0
      this.taskType[3].count = countInfo['finishBatchColorCount'] || 0
    },
    // 点击编辑获取详情
    async editList(id, code) {
      const res = await regionDetail({ id: id })
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(
        this.copyContent[1].componentsOptions,
        'factoryIds',
        res.data.factoryIds
      )
      const editData = res.data || {}
      this.factoryIds = res.data.factoryIds
      this.oldForm = { ...editData, code: code }
      this.setFormDatas({ ...editData, code: code })
      this.search({}, 'init')
      this.$set(this.copyContent[1].componentsOptions, 'formDatas', {})
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
        const pamraskey = ['name', 'factoryIds', 'taskType']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        obj.taskType = this.activeIdx
        this.addData(obj)
      } else if (this.type === 'edit') {
        // 走编辑接口
        const obj = {}
        const pamraskey = ['id', 'name', 'factoryIds', 'taskType']
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        obj.taskType = this.activeIdx
        this.addUpdate(obj)
      }
    },
    // 新增的确定事件
    async addData(data = {}) {
      if (!data.factoryIds || data.factoryIds === '') {
        this.$message({
          message: '工厂不能为空',
          type: 'error'
        })
        return
      }
      const res = await regionAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)

      this.$set(this.copyContent[1].componentsOptions, 'hackReset', false)
      this.$set(this.copyContent[1].componentsOptions, 'factoryIds', '')
      this.$set(this.copyContent[1].componentsOptions, 'formDatas', {})
      this.initData()
      this.getExistFactory()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      const api = `/sysSettings/task/area/add`
      const opratorType = `INSET`
      const description = {
        beforeText: `在'系统设置-任务配置-区域配置'新增一条记录`,
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
    // 修改
    async addUpdate(data = {}) {
      if (!data.factoryIds || data.factoryIds === '') {
        this.$message({
          message: '工厂不能为空',
          type: 'error'
        })
        return
      }
      const res = await regionUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.$set(this.copyContent[1].componentsOptions, 'hackReset', false)
      this.$set(this.copyContent[1].componentsOptions, 'factoryIds', '')
      this.$set(this.copyContent[1].componentsOptions, 'formDatas', {})
      this.initData()

      const api = `/sysSettings/task/area/delete`
      const opratorType = `UPDATE`
      const description = {
        beforeText: `在'系统设置-任务配置-区域配置'删除一条记录`,
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
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      this.getExistFactory()
    },
    // 删除
    async deleteData(id) {
      const params = { id: id }
      const res = await regionDelete(params)
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
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
      this.initData({
        pageNum: this.pagination.pageNum || 1,
        pageSize: this.pagination.pageSize || 20
      })
      this.getExistFactory()
    },
    // 已存在工厂查询
    async getExistFactory() {
      const res = await existFactory({
        taskType: this.activeIdx
      })
      this.exitFactory = res.data
    },
    // 搜索工厂
    async search(params, type) {
      const supplierTypeList = (this.activeIdx === '2' || this.activeIdx === '3') ? [10004, 10001] : [10003]
      // this.$set(this.copyContent[1].componentsOptions, 'selectData', [])
      params.supplierTypeList = supplierTypeList
      params.isEnabled = 1
      const res = await taskList({
        ...params
      })
      const factoryD = res.data || []
      factoryD.forEach(v => (v.checked = false))
      const factor = this.$utils.deepClone(factoryD)
      const selectData = []
      const tempArr = this.copyContent[1].componentsOptions.factoryIds
        .toString()
        .split(',')
      const ids = this.exitFactory.filter(item => !tempArr.includes(item))
      let facdata = []
      facdata = factor.filter(item => !ids.includes(item.id.toString())) // 过滤已经分配区域的工厂
      const factoryData = facdata
      for (let j = 0; j < factoryData.length; j++) {
        for (let i = 0; i < tempArr.length; i++) {
          if (parseInt(tempArr[i]) === factoryData[j].id) {
            factoryData[j].checked = true
            if (type === 'init') {
              selectData.push(factoryData[j])
            }
          }
        }
      }
      if (type === 'init') {
        this.$set(
          this.copyContent[1].componentsOptions,
          'selectData',
          selectData
        )
      }
      this.selectData = selectData.length === 0 ? this.selectData : selectData
      this.$set(
        this.copyContent[1].componentsOptions,
        'factoryData',
        factoryData
      )
    },
    // 选择工厂
    factoryChange(params) {
      this.$set(
        this.copyContent[1].componentsOptions,
        'factoryIds',
        params.factoryIds
      )
      this.$set(
        this.copyContent[1].componentsOptions,
        'selectData',
        params.selectData
      )
    },
    //  选择工厂
    selectFactory(item) {
      this.selectData = this.copyContent[1].componentsOptions.selectData
      if (item.checked && !this.isSelect(item)) {
        this.selectData.push(item)
      } else if (!item.checked) {
        const index = this.selectData.findIndex(e => e.id === item.id)
        this.selectData.splice(index, 1)
      }
      this.factoryChange({
        factoryIds: this.formatFac(this.selectData),
        selectData: this.selectData
      })
      this.$set(
        this.popOptions.formDatas,
        'factoryIds',
        this.formatFac(this.selectData)
      )
    },
    // 删除选中工厂
    deleteS(index) {
      this.selectData[index].checked = false
      const thatId = this.selectData[index].id
      this.selectData.splice(index, 1)
      this.factoryChange({
        factoryIds: this.formatFac(this.selectData),
        selectData: this.selectData
      })
      this.copyContent[1].componentsOptions.factoryData.forEach(v => {
        if (thatId === v.id) {
          v.checked = false
        }
      })
      this.$set(
        this.popOptions.formDatas,
        'factoryIds',
        this.formatFac(this.selectData)
      )
    },
    // 清空
    clearAll() {
      this.selectData = []
      this.copyContent[1].componentsOptions.factoryData.forEach(
        v => (v.checked = false)
      )

      this.$set(this.popOptions.formDatas, 'factoryIds', '')
      this.factoryChange({
        factoryIds: '',
        selectData: []
      })
    },
    isSelect(item) {
      let flag = false
      for (let i = 0; i < this.selectData.length; i++) {
        if (this.selectData[i].id === item.id) {
          flag = true
        }
      }
      return flag
    },
    formatFac(arr) {
      let str = ''
      for (let i = 0; i < arr.length; i++) {
        if (str === '') {
          str = arr[0].id
        } else {
          str = str + ',' + arr[i].id
        }
      }
      return str
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
            this.$set(this.copyContent[1].componentsOptions, 'hackReset', false)
            this.$set(this.copyContent[1].componentsOptions, 'factoryIds', '')
            this.$set(this.copyContent[1].componentsOptions, 'formDatas', {})
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
.region-config-container {
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
  /deep/ .customDrawerclass {
    width: 680px !important;
  }
}
</style>
