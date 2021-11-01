<template>
  <div class="color-list">
    <!-- 新增规则按钮 -->
    <div class="button">
      <el-button
        v-permission="['color:Api:ColorBd:ColorPlateType:store']"
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="addHandler"
      >新增</el-button>
    </div>
    <!-- 表格 -->
    <div class="page-table">
      <cs-custom-table
        ref="singleTable"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
        tooltip-effect="dark"
        table-scrollx
      />
    </div>
    <!-- pop弹框 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { pageList, destroy, enabled, update, store, approve } from './api/index.js'
import logMethods from '@/views/product-center/mixin/log-methods'
import enableSwitch from '@/views/basic-data/components/enableSwitch'

export default {
  mixins: [logMethods],
  data() {
    // 表格表头的配置信息
    const columns = [
      {
        prop: 'code',
        label: '序号',
        minWidth: '80'
      },
      {
        prop: 'name',
        label: '中文名',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'nameEn',
        label: '英文名',
        minWidth: '100',
        showOverflowTooltip: true
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: '120',
        showOverflowTooltip: true
      },
      {
        prop: 'abbr',
        label: '简称',
        minWidth: '80',
        showOverflowTooltip: true
      },
      {
        prop: 'enabled.code',
        label: '启用/禁用',
        minWidth: '80',
        components: {
          enableSwitch
        },
        componentsOptions: {
          permitTag: 'color:Api:ColorBd:ColorPlateType:enable',
          changeStatus: (scope) => {
            this.changeEnable({ id: scope.row.id, enabled: scope.row.enabled.code }, scope)
          }
        }
      },
      {
        prop: 'status.code',
        label: '状态',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          return scope.row.status.code === 'B' ? `<span style="color: #FF9B02;">未审核</span>` : `<span style="color: #00BCC5;">已审核</span>`
        }
      },
      {
        prop: 'status',
        label: '操作人',
        minWidth: '100',
        showOverflowTooltip: true,
        formater: scope => {
          return (
            (scope.row.updator &&
              `${scope.row.updator.name}/${scope.row.updator.realName}`) ||
            (scope.row.creator &&
              `${scope.row.creator.name}/${scope.row.creator.realName}`)
          )
        }
      },
      {
        prop: 'updatedTime',
        label: '操作时间',
        minWidth: '140',
        showOverflowTooltip: true,
        formater: scope => {
          return this.$filters.parseTime(scope.row.updatedTime || scope.row.createdTime, '{y}-{m}-{d} {h}:{i}')
        }
      }
    ]
    let dataList = [
      {
        label: '审核',
        permitTag: ['color:Api:ColorBd:ColorPlateType:approve'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: (scope) => {
          this.$confirm('确认审核当前数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.approveData(scope.row.id, scope)
            })
        }
      },
      {
        label: '编辑',
        permitTag: ['color:Api:ColorBd:ColorPlateType:update'],
        isShow: true,
        handle: params => {
          this.type = 'edit'
          this.$set(this.popOptions, 'formDatas', {
            id: params.row.id || 0,
            name: params.row.name,
            nameEn: params.row.nameEn,
            abbr: params.row.abbr,
            remark: params.row.remark
          })
          let cont
          if (params.row.status.code === 'P') {
            cont = this.popOptions.content.map((item, index) => {
              if (index < 3) {
                item.disabled = true
              }
              return item
            })
          } else {
            cont = this.popOptions.content.map((item, index) => {
              if (index < 3) {
                item.disabled = false
              }
              return item
            })
          }
          this.$set(this.popOptions, 'content', cont)
          this.PopDialogHandle('编辑色板类型')
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['color:Api:ColorBd:ColorPlateType:destroy'],
        isShow: (scope) => {
          return scope.row.status.code === 'B'
        },
        handle: params => {
          this.$confirm(' 你确认要删除该规则吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async() => {
              const res = await destroy({ id: params.row.id })
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.fetchLog(
                  this.getLogMessages('DEL', '/color/api/colorBd/colorPlateType/destroy', 'color'),
                  { name: params.row.name },
                  JSON.stringify({
                    beforeText: `在'色号花号库-基础数据管理-色板类型'删除一条记录`,
                    beforeCode: { name: params.row.name }
                  })
                )
                this.getList()
              }
            })
        }
      }
    ]
    dataList = this.$filterPermission(dataList)
    // 表头操作栏的配置信息
    const popOperates = {
      label: '操作',
      width: '200',
      dataSource: dataList
    }
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 验证大写
    const checkData = (rule, value, callback) => {
      if (value && value.length > 2) {
        callback(new Error('简称不能超过两个字母'))
      } else {
        callback()
      }
    }
    const ruleTrim = (data) => {
      data = data.replace(/[^a-zA-Z]/g, '')
      data = data.toUpperCase()
      data = data.replace('_', '')
      return data
    }
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '编辑',
      okText: '保存',
      ok: params => {
        this.save(params)
      },
      cancel: params => {
        this.$confirm(' 你确认要取消吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            this.PopDialogHandle()
          })
      },
      formDatas: {
      },
      content: [
        {
          itemType: 'input',
          prop: 'name',
          label: '中文名',
          maxlength: 20,
          clearable: true,
          disabled: false,
          rules: [
            commonBlurReg,
            { message: '长度在 20 个字符以内', trigger: ['change'] }
          ]
        },
        {
          itemType: 'input',
          prop: 'nameEn',
          label: '英文名',
          maxlength: 30,
          clearable: true,
          disabled: false,
          rules: [
            commonBlurReg,
            { message: '长度在 30 个字符以内', trigger: ['change'] }
          ]
        },
        {
          itemType: 'input',
          prop: 'abbr',
          label: '简称',
          trim: ruleTrim,
          maxlength: 2,
          clearable: true,
          disabled: false,
          rules: [
            commonBlurReg,
            {
              validator: checkData,
              message: '简称不能超过两个大写字母',
              trigger: ['change']
            }
          ],
          placeholder: '请输入两位(最多)大写字母'
        },
        {
          itemType: 'input',
          type: 'textarea',
          prop: 'remark',
          label: '备注',
          disabled: false,
          trim: (value) => {
            return value
          },
          maxlength: 100
        }
      ]
    }
    return {
      popOptions,
      columns,
      dataSource: [],
      popOperates,
      type: 'store'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 新增
    addHandler() {
      this.PopDialogHandle('新增色板类型')
      this.type = 'add'
      this.$set(this.popOptions, 'formDatas', {
        name: '',
        nameEn: '',
        abbr: '',
        remark: ''
      })
      const cont = this.popOptions.content.map((item, index) => {
        if (index < 3) {
          item.disabled = false
        }
        return item
      })
      this.$set(this.popOptions, 'content', cont)
    },
    async getList(id) {
      const res = await pageList()
      this.dataSource = res.data.list && res.data.list.map((item, index) => {
        item.code = index + 1
        return item
      }) || []
    },
    // 页面启用禁用
    async changeEnable(data = {}, scope) {
      const res = await enabled(data)
      if (res.code === 200) {
        this.fetchLog(
          this.getLogMessages('UPDATE', '/color/api/colorBd/colorPlateType/enabled', 'color'),
          { name: scope.row.name },
          JSON.stringify({
            beforeText: `在"色号花号库-基础数据管理-色板类型"${data.enabled === 'Y' ? '启用' : '禁用'}一条记录`,
            beforeCode: { name: scope.row.name }
          })
        )
        this.$message({
          message: res.message ? res.message : '状态更新成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.message ? res.message : '状态更新失败',
          type: 'error'
        })
      }
      this.getList()
    },
    // 保存
    async save(data) {
      console.log(data)
      if (this.type === 'edit') {
        const res = await update({ id: data.id, name: data.name, nameEn: data.nameEn, abbr: data.abbr, remark: data.remark })
        if (res.code !== 200) {
          return false
        }
        this.fetchLog(
          this.getLogMessages('UPDATE', '/color/api/colorBd/colorPlateType/update', 'color'),
          { name: data.name },
          JSON.stringify({
            beforeText: `在'色号花号库-基础数据管理-色板类型'编辑一条记录`,
            beforeCode: { name: data.name }
          })
        )
      } else {
        const res = await store({ name: data.name, nameEn: data.nameEn, abbr: data.abbr, remark: data.remark })
        if (res.code !== 200) {
          return false
        }
        this.fetchLog(
          this.getLogMessages('INSERT', '/color/api/colorBd/colorPlateType/store', 'color'),
          { name: data.name },
          JSON.stringify({
            beforeText: `在'色号花号库-基础数据管理-色板类型'新增一条记录`,
            beforeCode: { name: data.name }
          })
        )
      }
      this.PopDialogHandle()
      this.$message({
        type: 'success',
        message: '更新成功!'
      })
      this.getList()
    },
    // 审核
    async approveData(id, scope) {
      const res = await approve({ id })
      if (res.code !== 200) {
        return false
      }
      this.fetchLog(
        this.getLogMessages('UPDATE', '/color/api/colorBd/colorPlateType/approve', 'color'),
        { name: scope.row.name },
        JSON.stringify({
          beforeText: `在'色号花号库-基础数据管理-色板类型'审核一条记录`,
          beforeCode: { name: scope.row.name }
        })
      )
      this.$message({
        type: 'success',
        message: '审核成功!'
      })
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.color-list {
  padding: 20px;
}
.color-list .pop /deep/ .el-drawer__header {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 15px;
  padding-top: 15px;
  font-size: 18px;
  color: #151222;
}
</style>

