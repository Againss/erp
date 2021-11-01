<template>
  <div class="raw-fabrics">
    <!-- 搜索页面 -->
    <div class="search">
      <cs-custom-form
        ref="searchForm"
        :data-source="searchData"
        :options="formOtions"
        :form-datas="formDatas"
      />
    </div>
    <!-- 新增菜单按钮 -->
    <div class="button">
      <el-button
        v-permission="['baseData:qa:greigeConfig:add']"
        icon="el-icon-plus"
        size="small"
        type="primary"
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
        @sort-change="changeSort"
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
  fabricsPage,
  fabricsEnabled,
  fabricsCheck,
  fabricsDelete,
  fabricsUpdate,
  fabricsAdd,
  fabricsDetail,
  ordersMax
} from './api/index.js'
import { dataComparision } from '@/views/basic-data/common/index'
import enableSwitch from './component/fabricEnabled'
export default {
  name: 'RawFabrics',
  components: {},
  data() {
    const max999Reg = this.$getRules({
      type: 'number',
      pattern: /^(([1-9]{1}\d{0,2})|(0{1}))?$/,
      message: '请输入最大3位整数',
      trigger: ['blur']
    })
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const searchData = [
      {
        prop: 'nameQuery',
        itemType: 'input',
        label: '名称:',
        clearable: true,
        placeholder: '中文名/英文名'
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '状态:',
        dataSource: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '已审核',
            value: 'Y'
          },
          {
            label: '未审核',
            value: 'N'
          }
        ]
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
        prop: 'responsibleDept',
        label: '责任部门',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'name',
        label: '中文名',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'nameEn',
        label: '英文名',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'unit',
        label: '单位',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'orders',
        label: '顺序',
        sortable: 'custom',
        minWidth: '80'
      },
      {
        prop: 'remarks',
        label: '备注',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'operator',
        label: '操作人',
        minWidth: '80'
      },
      {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '80',
        formater: scope => {
          return this.$filters.parseTime(
            scope.row.updatedTime || 0,
            '{y}-{m}-{d} {h}:{i}'
          )
        }
      },
      {
        prop: 'isEnabled',
        label: '启用/禁用',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'baseData:qa:greigeConfig:isEnabled',
          changeStatus: scope => {
            this.changeEnable(
              {
                id: scope.row.id,
                isEnabled: scope.row.isEnabled
              },
              scope
            )
          }
        }
      },
      {
        prop: 'status',
        label: '状态',
        minWidth: '80',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.status === 'Y'
            ? `<span style="color: #00BCC5;">${'已审核'}</span>`
            : `<span style="color: #FF8900;">${'未审核'}</span>`
        }
      }
    ]
    // 新增弹窗中的字段
    const commonContent = [
      {
        prop: 'responsibleDept',
        itemType: 'input',
        label: '责任部门',
        clearable: true,
        maxlength: 50,
        rules: [
          commonBlurReg,
          { message: '长度在 50 个字符以内', trigger: ['blur'] }
        ]
      },
      {
        itemType: 'input',
        prop: 'name',
        label: '中文名',
        maxlength: 50,
        clearable: true,
        rules: [
          commonBlurReg,
          { message: '长度在 50 个字符以内', trigger: ['blur'] }
        ]
      },
      {
        itemType: 'input',
        prop: 'nameEn',
        label: '英文名',
        maxlength: 50,
        clearable: true
      },
      {
        prop: 'unit',
        itemType: 'select',
        type: 'radio',
        label: '单位',
        clearable: true,
        rules: [commonBlurReg, { message: '', trigger: ['blur'] }],
        dataSource: [
          {
            label: '轻微/明显/严重',
            value: '轻微/明显/严重'
          },
          {
            label: '次',
            value: '次'
          },
          {
            label: '个',
            value: '个'
          }
        ]
      },
      {
        itemType: 'input',
        prop: 'orders',
        label: '顺序',
        maxlength: 10,
        clearable: true,
        rules: [commonBlurReg, max999Reg]
      },
      {
        itemType: 'input',
        type: 'textarea',
        prop: 'remarks',
        label: '备注',
        trim: value => {
          return value
        },
        maxlength: 200
      }
    ]
    const copyContent = [...commonContent]
    let popOperatesDataSource = [
      {
        label: '编辑',
        permitTag: ['baseData:qa:greigeConfig:modify'],
        isShow: true,
        handle: scope => {
          if (scope.row.status === 'Y') {
            this.$set(this.copyContent[0], 'disabled', true)
            this.$set(this.copyContent[1], 'disabled', true)
            // this.$set(this.copyContent[2], 'disabled', true)
          } else {
            this.$set(this.copyContent[0], 'disabled', false)
            this.$set(this.copyContent[1], 'disabled', false)
            // this.$set(this.copyContent[2], 'disabled', false)
          }
          this.$set(this.popOptions, 'content', copyContent)
          this.type = 'edit'
          this.PopDialogHandle('编辑坯布项目')
          this.editList(scope.row.id, scope.row.code)
        }
      },
      {
        label: '删除',
        style: { color: '#FE4949' },
        permitTag: ['baseData:qa:greigeConfig:delete'],
        isShow: scope => {
          return scope.row.status === 'N'
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
      },
      {
        label: '审核',
        permitTag: ['baseData:qa:greigeConfig:check'],
        isShow: scope => scope.row.status === 'N',
        handle: scope => this.doAudited(scope.row)
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    const popOperates = {
      label: '操作',
      width: '200',
      dataSource: popOperatesDataSource
    }

    // 这是pop弹出层用的配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
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
        this.initData({ pageNum: 1, pageSize: val })
      }
    }
    return {
      searchData,
      formOtions: {
        size: 'small',
        inline: true
      },

      formDatas: {
        // ordersOrder: 0
      },
      dataSource: [],
      pagination,
      popOperates,
      copyContent,
      columns,
      popOptions,
      type: 'add',
      oldForm: {} // 旧详情数据
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
      this.PopDialogHandle('新增坯布项目')
      this.$set(this.popOptions, 'content', this.content)
      this.$set(this.popOptions, 'content', this.copyContent)
      this.$set(this.copyContent[0], 'disabled', false)
      this.$set(this.copyContent[1], 'disabled', false)
      // this.$set(this.copyContent[2], 'disabled', false)
      this.$set(this.popOptions, 'formDatas', {})
      this.getOrdersMax()
    },
    // 获取最大顺序
    async getOrdersMax() {
      const res = await ordersMax({})
      let orders = ''
      if (res.data < 999) {
        orders = res.data + 1
      }
      this.$set(this.popOptions.formDatas, 'orders', orders)
    },
    // 列表查询
    async initData(data = {}) {
      data.pageNum = data.pageNum || 1
      const res = await fabricsPage({
        ...this.searchFormDatas,
        ...this.formDatas,
        ...data
      })
      res.data.list &&
        res.data.list.map((item, index) => {
          item.code = (res.data.pageNum - 1) * res.data.pageSize + index + 1
        })
      const listData = res.data ? res.data.list : []

      this.dataSource = listData || []
      for (let i = 0; i < this.dataSource.length; i++) {
        this.dataSource[i].isEnabled =
          this.dataSource[i].isEnabled === 1 ? 'Y' : 'N'
      }
      this.pagination = {
        ...this.pagination,
        dataTotal: res.data.total,
        ...data,
        currentPage: res.data.pageNum,
        pageSize: res.data.pageSize,
        pageNum: res.data.pageNum
      }
    },
    // 点击编辑获取详情
    async editList(id, code) {
      const res = await fabricsDetail({ id: id })
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
          'responsibleDept',
          'name',
          'nameEn',
          'unit',
          'orders',
          'remarks'
        ]
        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addData(obj)
      } else if (this.type === 'edit') {
        // 走编辑接口
        const obj = {}
        let pamraskey = [
          'id',
          'responsibleDept',
          'name',
          'nameEn',
          'unit',
          'orders',
          'remarks'
        ]
        if (params.status === 'Y') {
          pamraskey = ['id', 'nameEn', 'unit', 'orders', 'remarks']
        }

        pamraskey.forEach(v => {
          obj[v] = params[v]
        })
        this.addUpdate(obj)
      }
    },
    // 新增的确定事件
    async addData(data = {}) {
      const res = await fabricsAdd(data)
      if (res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.initData()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      const api = `/baseData/qa/greigeConfig/add`
      const opratorType = `INSET`
      const description = {
        beforeText: `在'基础数据-质量基础资料-坯布'新增一条记录`,
        beforeCode: data
      }
      const appId = 'baseData'
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
      const res = await fabricsUpdate(data)
      if (!res || res.code !== 200) {
        return false
      }
      this.$set(this.popOptions, 'visible', false)
      this.initData({
        pageNum: this.pagination.pageNum || 1,
        pageSize: this.pagination.pageSize || 20
      })
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      const api = `/baseData/qa/greigeConfig/modify`
      const opratorType = `UPDATE`
      const description = {
        beforeText: `在'基础数据-质量基础资料-坯布'修改一条记录`,
        beforeCode: data
      }
      const appId = 'baseData'
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
      const res = await fabricsDelete({ id: id })
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
      const api = `/baseData/qa/greigeConfig/delete`
      const opratorType = `DEL`
      const description = {
        beforeText: `在'基础数据-质量基础资料-坯布'删除一条记录`,
        beforeCode: params
      }
      const appId = 'baseData'
      this.$store.dispatch('app/fetchParamsLog', {
        params,
        opratorType,
        api,
        description,
        appId
      })
    },
    // 审核
    async doAudited(row) {
      const data = {
        id: row.id,
        status: 'Y'
      }
      const res = await fabricsCheck(data).catch(() => {
        row.status = row.status === 'N' ? 'Y' : 'N'
      })
      if (res.code === 200) {
        this.$message({
          message: '审核成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '审核失败',
          type: 'error'
        })
      }
      this.initData()
    },

    /**
     * 排序点击事件
     */
    changeSort(e) {
      delete this.formDatas.orders
      // 申请时间
      if (e.prop === 'orders') {
        // 处理时间
        if (e.order === 'ascending') {
          this.formDatas.ordersOrder = 0
        } else {
          this.formDatas.ordersOrder = 1
        }
      }
      this.initData()
    },
    // 页面启用禁用
    async changeEnable(data = {}, scope) {
      // const isEnabled = data.isEnabled === 1 ? 'Y' : 'N'
      data.isEnabled = data.isEnabled === 'N' ? 0 : 1
      const res = await fabricsEnabled(data).catch(() => {
        scope.row.isEnabled = scope.row.isEnabled === 0 ? 1 : 0
      })
      if (res.code === 200) {
        this.$message({
          message: '更新状态成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '更新状态失败',
          type: 'error'
        })
      }
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
.raw-fabrics {
  position: relative;
  padding: 20px;
  padding-bottom: 0px;
}
</style>
