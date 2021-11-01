<template>
  <div class="normal-LT-container">
    <!-- tab切换 -->
    <div class="list-tabs">
      <el-tabs v-model="activeIdx" @tab-click="handleClick">
        <!-- <el-tab-pane
          v-for="(item, i) in taskTypeArr"
          :key="i"
          :label="`${item.label}`"
          :name="item.value"
        /> -->
        <el-tab-pane v-if="$permission(['bmpAps:ltset:apsNormalLtSetShirtbody:page'])" label="衫身" name="0" />
        <el-tab-pane v-if="$permission(['bmpAps:ltset:apsNormalLtSetLowbar:page'])" label="下栏" name="1" />
      </el-tabs>
      <el-button
        v-if="addButtonPermission"
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
  shirtbodyList,
  setShirtDetail,
  setShirtAdd,
  setShirtUpdate,
  setShirtDelete,
  setShirtEnabled,
  setLowList,
  setLowDetail,
  setLowAdd,
  setLowUpdate,
  setLowDelete,
  setLowEnabled,
  fabricationProduceModes
} from './api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import enableSwitch from './components/enableSwitch'
export default {
  data() {
    const max999Reg = this.$getRules({
      type: 'number',
      pattern: /^(([1-9]{1}\d{0,2})|(1{1}))?$/,
      message: '请输入最大3位正整数',
      trigger: ['blur']
    })
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'partDyeWayShirtbody',
        label: '部位染方式（衫身-下栏）',
        minWidth: '120',
        formater: scope => {
          if (scope.row.partDyeWayShirtbody && (!scope.row.partDyeWayLowbar || scope.row.partDyeWayLowbar === null)) {
            return `${scope.row.partDyeWayShirtbody}`
          } else if ((!scope.row.partDyeWayShirtbody || scope.row.partDyeWayShirtbody === null) && scope.row.partDyeWayLowbar) {
            return `${scope.row.partDyeWayLowbar}`
          } else {
            return `${scope.row.partDyeWayShirtbody}-${scope.row.partDyeWayLowbar}`
          }
        }
      },
      {
        prop: 'normalLt',
        label: '正常单LT',
        minWidth: '80',
        isShow: scope => {
          return this.activeIdx === '0'
        }
      },
      {
        prop: 'abnormalLt',
        label: '补单LT',
        minWidth: '80',
        isShow: scope => {
          return this.activeIdx === '0'
        }
      },
      {
        prop: 'unContrasColorLt',
        label: '不撞色LT',
        minWidth: '80',
        isShow: scope => {
          return this.activeIdx === '1'
        }
      },
      {
        prop: 'contrasColorLt',
        label: '撞色LT',
        minWidth: '80',
        isShow: scope => {
          return this.activeIdx === '1'
        }
      },
      {
        prop: 'shortDeliveryReduceLt',
        label: '短交期扣减LT',
        minWidth: '80'
      },

      {
        prop: 'abnormalUnContrasColorLt',
        label: '补单_不撞色LT',
        minWidth: '80',
        isShow: scope => {
          return this.activeIdx === '1'
        }
      },
      {
        prop: 'abnormalContrasColorLt',
        label: '补单_撞色LT',
        minWidth: '80',
        isShow: scope => {
          return this.activeIdx === '1'
        }
      },
      {
        prop: 'abnormalShortDeliveryReduceLt',
        label: '补单_短交期扣减LT',
        minWidth: '80',
        isShow: scope => {
          return this.activeIdx === '1'
        }
      },
      {
        prop: 'status',
        label: '状态',
        isShow: scope => {
          return this.activeIdx === '0'
        },
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'bmpAps:ltset:apsNormalLtSetShirtbody:updateStatus',
          changeStatus: scope => {
            this.changeEnable({ id: scope.row.id }, scope)
          }
        }
      },
      {
        prop: 'status',
        label: '状态',
        isShow: scope => {
          return this.activeIdx === '1'
        },
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'bmpAps:ltset:apsNormalLtSetLowbar:updateStatus',
          changeStatus: scope => {
            this.changeEnable({ id: scope.row.id }, scope)
          }
        }
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
        prop: 'partDyeWayShirtbody',
        itemType: 'select',
        type: 'radio',
        label: '部位染方式-衫身',
        rules: [{ required: true, message: '部位染方式-衫身不能为空' }],
        dataSource: [],
        isShow: scope => {
          return this.activeIdx === '0'
        },
        visibleChange: (value, val) => {
          if (value) {
            this.fabricationProduceModes()
          }
        }
      },
      {
        prop: 'partDyeWayShirtbody',
        itemType: 'select',
        type: 'radio',
        label: '部位染方式-衫身',
        isShow: scope => {
          return this.activeIdx === '1'
        },
        dataSource: [],
        visibleChange: (value, val) => {
          if (value) {
            this.fabricationProduceModes()
          }
        }
      },
      {
        prop: 'partDyeWayLowbar',
        itemType: 'select',
        type: 'radio',
        label: '部位染方式-下栏',
        rules: [{ required: true, message: '部位染方式-下栏不能为空' }],
        dataSource: [],
        isShow: scope => {
          return this.activeIdx === '1'
        },
        visibleChange: (value, val) => {
          if (value) {
            this.fabricationProduceModes()
          }
        }
      },
      {
        prop: 'partDyeWayLowbar',
        itemType: 'select',
        type: 'radio',
        label: '部位染方式-下栏',
        dataSource: [
        ],
        isShow: scope => {
          return this.activeIdx === '0'
        },
        visibleChange: (value, val) => {
          if (value) {
            this.fabricationProduceModes()
          }
        }
      },
      {
        prop: 'normalLt',
        itemType: 'input',
        label: '正常单LT',
        clearable: true,
        placeholder: '请输入天数',
        maxlength: 3,
        isShow: scope => {
          return this.activeIdx === '0'
        },
        rules: [commonBlurReg, max999Reg]
      },
      {
        prop: 'abnormalLt',
        itemType: 'input',
        label: '补单LT',
        clearable: true,
        placeholder: '请输入天数',
        maxlength: 3,
        isShow: scope => {
          return this.activeIdx === '0'
        },
        rules: [commonBlurReg, max999Reg]
      },
      {
        prop: 'unContrasColorLt',
        itemType: 'input',
        label: '不撞色LT',
        clearable: true,
        placeholder: '请输入天数',
        maxlength: 3,
        isShow: scope => {
          return this.activeIdx === '1'
        },
        rules: [commonBlurReg, max999Reg]
      },
      {
        prop: 'contrasColorLt',
        itemType: 'input',
        label: '撞色LT',
        clearable: true,
        placeholder: '请输入天数',
        maxlength: 3,
        isShow: scope => {
          return this.activeIdx === '1'
        },
        rules: [commonBlurReg, max999Reg]
      },
      {
        prop: 'shortDeliveryReduceLt',
        itemType: 'input',
        label: '短交期的扣减LT',
        clearable: true,
        placeholder: '请输入天数',
        maxlength: 3,
        rules: [commonBlurReg, max999Reg]
      },
      {
        prop: 'abnormalUnContrasColorLt',
        itemType: 'input',
        label: '补单_不撞色LT',
        clearable: true,
        placeholder: '请输入天数',
        maxlength: 3,
        isShow: scope => {
          return this.activeIdx === '1'
        },
        rules: [commonBlurReg, max999Reg]
      },
      {
        prop: 'abnormalContrasColorLt',
        itemType: 'input',
        label: '补单_撞色LT',
        clearable: true,
        placeholder: '请输入天数',
        maxlength: 3,
        isShow: scope => {
          return this.activeIdx === '1'
        },
        rules: [commonBlurReg, max999Reg]
      },
      {
        prop: 'abnormalShortDeliveryReduceLt',
        itemType: 'input',
        label: '补单_短交期扣减LT',
        clearable: true,
        placeholder: '请输入天数',
        maxlength: 3,
        isShow: scope => {
          return this.activeIdx === '1'
        },
        rules: [commonBlurReg, max999Reg]
      }
    ]
    const copyContent = [...commonContent]
    const popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: [],
        isShow: true,
        handle: scope => {
          this.$set(this.popOptions, 'content', copyContent)
          this.type = 'edit'
          this.PopDialogHandle('编辑')
          this.editList(scope.row.id, scope.row.code)
        }
      },
      {
        label: '删除',
        style: { color: '#FE4949' },
        permitTag: [],
        isShow: scope => {
          // return scope.row.status.code === 'B'
          return true
        },
        handle: async scope => {
          const res = await this.$uiUtils.confirmMsg()
          if (res) {
            console.log('确认删除')
            this.deleteData(scope.row.id)
          } else {
            console.log('取消删除')
          }
        }
      }
    ]
    // popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
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
      formDatas: {},
      dataSource: [],
      columns,
      pagination,
      popOperates,
      popOperatesDataSource,
      popOptions,
      copyContent,
      type: 'add',
      oldForm: {}, // 旧详情数据
      outworker: [],
      //  0：衫身，1：下栏
      taskType: {
        '0': {
          value: '0',
          label: '衫身',
          count: 0
        },
        '1': {
          value: '1',
          label: '下栏',
          color: '#00BCC5',
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
    },
    addButtonPermission({ activeIdx }) {
      return activeIdx === '0' && this.$permission(['bmpAps:ltset:apsNormalLtSetShirtbody:add']) || activeIdx === '1' && this.$permission(['bmpAps:ltset:apsNormalLtSetLowbar:add'])
    }
  },
  watch: {
    activeIdx: {
      handler(val) {
        const obj = {
          0: { edit: 'bmpAps:ltset:apsNormalLtSetShirtbody:modify', delete: 'bmpAps:ltset:apsNormalLtSetShirtbody:delete' },
          1: { edit: 'bmpAps:ltset:apsNormalLtSetLowbar:modify', delete: 'bmpAps:ltset:apsNormalLtSetLowbar:delete' }
        }
        let popOperatesDataSource = this.popOperatesDataSource
        popOperatesDataSource[0].permitTag = [obj[this.activeIdx].edit]
        popOperatesDataSource[1].permitTag = [obj[this.activeIdx].delete]
        popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
        this.popOperates.dataSource = popOperatesDataSource
      },
      immediate: true
    }
  },
  created() {
    this.initData()
  },
  mounted() {},
  methods: {
    addList() {
      this.type = 'add'
      this.oldForm = this.copyContent.formDatas || {}
      this.PopDialogHandle('新建')
      this.$set(this.popOptions, 'content', this.content)
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 标签切换
    handleClick(e) {
      this.formDatas.pageSize = 20
      this.formDatas.pageNum = 1
      this.initData(this.formDatas)
    },
    // 列表查询
    async initData(data = {}) {
      data.pageNum = data.pageNum || 1
      // data.taskType = this.activeIdx
      let res = []
      if (this.activeIdx === '0') {
        res = await shirtbodyList({ ...data })
      } else {
        res = await setLowList({ ...data })
      }
      res.data.list &&
        res.data.list.map((item, index) => {
          item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1
        })

      const listData = res.data.list ? res.data.list : []
      for (let i = 0; i < listData.length; i++) {
        listData[i].status = listData[i].status === 1 ? 'Y' : 'N'
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
    },

    // 状态开启/禁用
    async changeEnable(data = {}, scope) {
      let res = {}
      data.status = scope.row.status === 'Y' ? 1 : 0
      if (this.activeIdx === '0') {
        res = await setShirtEnabled(data).catch(() => {
          scope.row.status = scope.row.status === 'N' ? 0 : 1
        })
      } else {
        res = await setLowEnabled(data).catch(() => {
          scope.row.status = scope.row.status === 'N' ? 0 : 1
        })
      }
      if (res.code === 200) {
        const message = scope.row.status === 'N' ? '数据禁用成功' : '数据启用成功'
        this.$message.success(message)
      } else {
        this.$message.error('更新状态失败')
      }
    },
    // 获取印花下拉框
    async fabricationProduceModes() {
      const res = await fabricationProduceModes({ enabled: 'Y', mode: 'D' })
      const data = (res.data.list || []).map(item => {
        return { value: item.abbr, label: item.abbr }
      })
      this.$set(this.copyContent[0], 'dataSource', data)
      this.$set(this.copyContent[1], 'dataSource', data)
      this.$set(this.copyContent[2], 'dataSource', data)
      this.$set(this.copyContent[3], 'dataSource', data)
    },
    // 点击编辑获取详情
    async editList(id, code) {
      let res = {}
      if (this.activeIdx === '0') {
        res = await setShirtDetail({ id: id })
      } else {
        res = await setLowDetail({ id: id })
      }
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
        console.log(params)
        this.addData(params)
      } else if (this.type === 'edit') {
        // 走编辑接口
        this.addUpdate(params)
      }
    },

    // 新增的确定事件
    async addData(data = {}) {
      let res = {}
      if (this.activeIdx === '0') {
        res = await setShirtAdd(data)
      } else {
        res = await setLowAdd(data)
      }

      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.initData()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    // 更新
    async addUpdate(data = {}) {
      let res = {}
      if (this.activeIdx === '0') {
        res = await setShirtUpdate(data)
      } else {
        res = await setLowUpdate(data)
      }
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.initData()
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    },
    // 删除
    async deleteData(id) {
      let res = {}
      if (this.activeIdx === '0') {
        res = await setShirtDelete({ id: id })
      } else {
        res = await setLowDelete({ id: id })
      }
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
.normal-LT-container {
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

