<template>
  <div class="holiday-setting-container">
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button
        v-permission="['bmpAps:ltset:apsHolidaySet:add']"
        icon="el-icon-plus"
        size="small"
        type="primary"
        @click="addList"
      >新建</el-button>
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
  holidaySetList,
  holidaySetDetail,
  holidaySetAdd,
  holidaySetUpdate,
  holidaySetDelete,
  holidaySetEnabled,
  taskList
} from './api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import enableSwitch from './components/enableSwitch'
import cusRigionSelect from './components/region-select'
export default {
  data() {
    const commonChangeReg = this.$getRules({})
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '50'
      },
      {
        prop: 'holidayStart',
        label: '工厂节假日',
        minWidth: '120',
        formater: scope => {
          return this.$filters.parseTime(
            scope.row.holidayStart || 0,
            '{y}-{m}-{d}'
          ) + '~' + this.$filters.parseTime(
            scope.row.holidayEnd || 0,
            '{y}-{m}-{d}'
          )
        }
      },
      {
        prop: 'factoryName',
        label: '工厂',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'status',
        label: '状态',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'bmpAps:ltset:apsHolidaySet:updateStatus',
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
        prop: 'holidayStart',
        label: '节假日开始',
        itemType: 'date',
        type: 'date',
        format: 'yyyy-MM-dd',
        clearable: true,
        placeholder: '请选择日期',
        valueFormat: 'timestamp',
        // defaultTime: ['00:00:00', '23:59:59'],
        rules: [commonChangeReg],
        change: (val) => {
          console.log(val)
          // this.$set(this.popOptions.formDatas, 'holidayEnd', val)
          this.dateChange(val)
        }
      },
      {
        prop: 'holidayEnd',
        label: '节假日结束',
        itemType: 'date',
        type: 'date',
        format: 'yyyy-MM-dd',
        clearable: true,
        valueFormat: 'timestamp',
        // defaultTime: ['00:00:00', '23:59:59'],
        placeholder: '请选择日期',
        rules: [commonChangeReg]
      },
      {
        itemType: 'input',
        prop: 'factory',
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
          // hackReset: true,
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
          }
        }
      }
    ]
    const copyContent = [...commonContent]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['bmpAps:ltset:apsHolidaySet:modify'],
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
        permitTag: ['bmpAps:ltset:apsHolidaySet:delete'],
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
      commonChangeReg,
      columns,
      pagination,
      popOperates,
      popOptions,
      copyContent,
      type: 'add',
      oldForm: {}, // 旧详情数据
      outworker: [],
      factoryIds: '',
      factoryData: [],
      selectData: [],
      exitFactory: []
    }
  },
  computed: {
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
      this.$set(this.copyContent[2].componentsOptions, 'factoryIds', '')
      // this.$set(this.copyContent[2].componentsOptions, 'hackReset', true)
      this.$set(this.copyContent[2].componentsOptions, 'formDatas', {})
      this.search({}, 'init')
    },
    // 列表查询
    async initData(data = {}) {
      const res = await holidaySetList({ ...data })
      res.data.list &&
        res.data.list.map((item, index) => {
          item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1
        })

      const listData = res.data.list ? res.data.list : []
      const list = this.$utils.deepClone(listData)
      for (let i = 0; i < list.length; i++) {
        list[i].status = list[i].status === 1 ? 'Y' : 'N'
        list[i].factoryName = this.formatFactory(JSON.parse(list[i].factory))
      }
      this.dataSource = list || []
      console.log(this.dataSource)
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageNum: res.data.pageNum
      }
    },
    formatFactory(arr) {
      let str = ''
      for (let i = 0; i < arr.length; i++) {
        if (str === '') {
          str = arr[0].factoryName
        } else {
          str = str + '、' + arr[i].factoryName
        }
      }
      return str
    },
    // 状态开启/禁用
    async changeEnable(data = {}, scope) {
      console.log(data, scope)
      data.status = scope.row.status === 'Y' ? 1 : 0
      const res = await holidaySetEnabled(data).catch(() => {
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
      const res = await holidaySetDetail({ id: id })
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(
        this.copyContent[2].componentsOptions,
        'factoryIds',
        this.formatFac(JSON.parse(res.data.factory))
      )
      // const res = {}
      const editData = res.data || {}
      // this.factoryIds = res.data.factoryIds
      this.oldForm = { ...editData, code: code }
      this.setFormDatas({ ...editData, code: code })
      this.search({}, 'init')
      this.$set(this.copyContent[2].componentsOptions, 'formDatas', {})
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    dateChange(val) {
      console.log(this.popOptions.formDatas)
      if (!this.popOptions.formDatas.holidayEnd || this.popOptions.formDatas.holidayEnd === '') {
        console.log(this.copyContent[1])
        // this.setFormDatas({ ...{ holidayEnd: val }})
        // this.popOptions.formDatas.holidayEnd = val
        this.$set(this.popOptions.formDatas, 'holidayEnd', val)
      } else {
        return
      }
    },
    // 新增或修改弹出框点击确认按钮的接口事件
    addOrEdit(params) {
      // 走新增接口
      if (this.type === 'add') {
        this.addData(params)
      } else if (this.type === 'edit') {
        // 走编辑接口
        console.log(params)
        this.addUpdate(params)
      }
    },

    // 新增的确定事件
    async addData(data = {}) {
      if (!this.selectData || this.selectData.length === 0) {
        this.$message.error('工厂不能为空')
        return
      }
      if (data.holidayEnd < data.holidayStart) {
        this.$message.error('结束时间不能小于开始时间')
        return
      }
      data.factory = JSON.stringify(this.selectData)
      const res = await holidaySetAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.initData()
      this.$message.success('添加成功')
    },
    // 更新
    async addUpdate(data = {}) {
      if (!this.selectData || this.selectData.length === 0) {
        this.$message.error('工厂不能为空')
        return
      }
      if (data.holidayEnd < data.holidayStart) {
        this.$message.error('结束时间不能小于开始时间')
        return
      }
      console.log(data.factory)
      data.factory = JSON.stringify(this.selectData)
      const res = await holidaySetUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      // this.$set(this.copyContent[2].componentsOptions, 'hackReset', false)
      this.$set(this.copyContent[2].componentsOptions, 'factoryIds', '')
      this.$set(this.copyContent[2].componentsOptions, 'formDatas', {})
      this.initData()
      this.$message.success('修改成功')
    },
    // 删除
    async deleteData(id) {
      const res = await holidaySetDelete({ id: id })
      if (res.code !== 200) {
        return false
      }
      this.$message.success('删除成功!')
      this.initData()
    },

    // 搜索工厂
    async search(params, type) {
      // const supplierTypeList = [10003]
      // this.$set(this.copyContent[2].componentsOptions, 'selectData', [])
      params.supplierCategory = 1
      params.isEnabled = 1
      params.status = 5
      const res = await taskList({
        ...params
      })
      const factoryD = res.data || []
      factoryD.forEach(v => (v.checked = false))
      const factor = this.$utils.deepClone(factoryD)
      const selectData = []
      const tempArr = this.copyContent[2].componentsOptions.factoryIds
        .toString()
        .split(',')
      // const ids = this.exitFactory.filter(item => !tempArr.includes(item))
      // let facdata = []
      // facdata = factor.filter(item => !ids.includes(item.id.toString())) // 过滤已经分配区域的工厂
      const factoryData = factor
      for (let j = 0; j < factoryData.length; j++) {
        for (let i = 0; i < tempArr.length; i++) {
          if (parseInt(tempArr[i]) === factoryData[j].id) {
            factoryData[j].checked = true
            if (type === 'init') {
              selectData.push({
                factoryId: factoryData[j].id,
                factoryName: factoryData[j].supplierName
              })
            }
          }
        }
      }
      if (type === 'init') {
        this.$set(
          this.copyContent[2].componentsOptions,
          'selectData',
          selectData
        )
        this.selectData = selectData
      }
      // this.selectData = selectData
      this.$set(
        this.copyContent[2].componentsOptions,
        'factoryData',
        factoryData
      )
    },
    // 选择工厂
    factoryChange(params) {
      this.$set(
        this.copyContent[2].componentsOptions,
        'factoryIds',
        params.factoryIds
      )
      this.$set(
        this.copyContent[2].componentsOptions,
        'selectData',
        params.selectData
      )
    },
    //  选择工厂
    selectFactory(item) {
      this.selectData = this.copyContent[2].componentsOptions.selectData
      if (item.checked && !this.isSelect(item)) {
        this.selectData.push({
          factoryId: item.id,
          factoryName: item.supplierName
        })
      } else if (!item.checked) {
        const index = this.selectData.findIndex(e => e.factoryId === item.id)
        this.selectData.splice(index, 1)
      }
      this.factoryChange({
        factoryIds: this.formatFac(this.selectData),
        selectData: this.selectData
      })
      console.log(this.selectData,)
      // this.$set(
      //   this.popOptions.formDatas,
      //   'factory',
      //   this.selectData
      // )
    },
    // 删除选中工厂
    deleteS(index) {
      this.selectData[index].checked = false
      const thatId = this.selectData[index].factoryId
      this.selectData.splice(index, 1)
      this.factoryChange({
        factoryIds: this.formatFac(this.selectData),
        selectData: this.selectData
      })
      this.copyContent[2].componentsOptions.factoryData.forEach(v => {
        if (thatId === v.id) {
          v.checked = false
        }
      })
      // this.$set(
      //   this.popOptions.formDatas,
      //   'factory',
      //   this.selectData
      // )
    },
    // 清空
    // clearAll() {
    //   this.selectData = []
    //   this.copyContent[2].componentsOptions.factoryData.forEach(
    //     v => (v.checked = false)
    //   )

    //   this.$set(this.popOptions.formDatas, 'factory', '')
    //   this.factoryChange({
    //     factoryIds: '',
    //     selectData: []
    //   })
    // },
    isSelect(item) {
      let flag = false
      for (let i = 0; i < this.selectData.length; i++) {
        if (this.selectData[i].factoryId === item.id) {
          flag = true
        }
      }
      return flag
    },

    formatFac(arr) {
      let str = ''
      for (let i = 0; i < arr.length; i++) {
        if (str === '') {
          str = arr[0].factoryId
        } else {
          str = str + ',' + arr[i].factoryId
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
            // this.$set(this.copyContent[2].componentsOptions, 'hackReset', false)
            this.$set(this.copyContent[2].componentsOptions, 'factoryIds', '')
            this.$set(this.copyContent[2].componentsOptions, 'formDatas', {})
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
.holiday-setting-container {
  position: relative;
  padding: 20px;
  padding-bottom: 0px;
  /deep/ .customDrawerclass {
    width: 680px !important;
  }
}
</style>
