<template>
  <div class="speacial-LT-container">
    <!-- tab切换 -->
    <div class="list-tabs">
      <el-tabs v-model="activeIdx" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, i) in taskTypeArr"
          :key="i"
          :label="`${item.label}`"
          :name="item.value"
        />
      </el-tabs>
      <el-button
        v-permission="['bmpAps:ltset:apsSpecialHandlerLtSet:add']"
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
  specialSetList,
  specialSetDetail,
  specialSetAdd,
  specialSetUpdate,
  specialSetDelete,
  specialSetEnabled,
  requirementsPrinting,
  requirementsDye
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
        prop: 'craft',
        label: '染整工艺',
        minWidth: '120',
        isShow: scope => {
          return this.activeIdx === '1'
        }
      },
      {
        prop: 'craft',
        label: '印花工艺',
        minWidth: '80',
        isShow: scope => {
          return this.activeIdx === '2'
        }
      },
      {
        prop: 'leadTime',
        label: 'LT',
        minWidth: '80'
      },
      {
        prop: 'status',
        label: '状态',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'bmpAps:ltset:apsSpecialHandlerLtSet:updateStatus',
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
        prop: 'craft',
        itemType: 'select',
        type: 'radio',
        label: '染整工艺',
        rules: [{ required: true, message: '染整工艺不能为空' }],
        isShow: scope => {
          return this.activeIdx === '1'
        },
        dataSource: [],
        visibleChange: (value, val) => {
          if (value) {
            this.requirementsDye()
          }
        }
      },
      {
        prop: 'craft',
        itemType: 'select',
        type: 'radio',
        label: '印花工艺',
        rules: [{ required: true, message: '印花工艺不能为空' }],
        isShow: scope => {
          return this.activeIdx === '2'
        },
        dataSource: [],
        visibleChange: (value, val) => {
          if (value) {
            this.requirementsPrinting()
          }
        }
      },
      {
        prop: 'leadTime',
        itemType: 'input',
        label: 'LT',
        clearable: true,
        placeholder: '请输入天数',
        maxlength: 3,
        rules: [commonBlurReg, max999Reg]
      }
    ]
    const copyContent = [...commonContent]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['bmpAps:ltset:apsSpecialHandlerLtSet:modify'],
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
        permitTag: ['bmpAps:ltset:apsSpecialHandlerLtSet:delete'],
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
      title: '新建',
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
      popOptions,
      copyContent,
      type: 'add',
      oldForm: {}, // 旧详情数据
      outworker: [],
      //  0：染整，1：印花
      taskType: {
        '1': {
          value: '1',
          label: '染整',
          count: 0
        },
        '2': {
          value: '2',
          label: '印花',
          color: '#00BCC5',
          count: 0
        }
      },
      activeIdx: '1'
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
      this.formDatas.type = e.name
      this.formDatas.pageSize = 20
      this.formDatas.pageNum = 1
      this.initData(this.formDatas)
    },
    // 列表查询
    async initData(data = {}) {
      data.type = parseInt(this.activeIdx)
      const res = await specialSetList({ ...data })
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

    // 获取染整下拉框
    async requirementsDye() {
      const res = await requirementsDye({ enabled: 'Y' })
      const data = (res.data.list || []).map(item => {
        return { value: item.name, label: item.name }
      })
      // this.$set(this.searchData._taskAreaId, 'dataSource', data)
      this.$set(this.copyContent[0], 'dataSource', data)
    },
    // 获取印花下拉框
    async requirementsPrinting() {
      const res = await requirementsPrinting({ enabled: 'Y' })
      const data = (res.data.list || []).map(item => {
        return { value: item.name, label: item.name }
      })
      this.$set(this.copyContent[1], 'dataSource', data)
    },

    // 开启/禁用
    async changeEnable(data = {}, scope) {
      data.status = scope.row.status === 'Y' ? 1 : 0
      const res = await specialSetEnabled(data).catch(() => {
        scope.row.status = scope.row.status === 'N' ? 0 : 1
      })
      if (res.code === 200) {
        const message = scope.row.status === 'N' ? '数据禁用成功' : '数据启用成功'
        this.$message.success(message)
      } else {
        this.$message.error('更新状态失败')
      }
    },
    // 点击编辑获取详情
    async editList(id, code) {
      const res = await specialSetDetail({ id: id })
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
        this.addData(params)
      } else if (this.type === 'edit') {
        // 走编辑接口
        this.addUpdate(params)
      }
    },

    // 新增的确定事件
    async addData(data = {}) {
      data.type = this.activeIdx
      const res = await specialSetAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.initData()
      this.$message.success('添加成功')
    },
    // 更新
    async addUpdate(data = {}) {
      const res = await specialSetUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.initData()
      this.$message.success('修改成功')
    },
    // 删除
    async deleteData(id) {
      const res = await specialSetDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.initData()
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
.speacial-LT-container {
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
