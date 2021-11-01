<template>
  <div class="instrument">
    <div class="button">
      <el-button v-permission="['userCenter:sysUser:add']" size="small" type="primary" @click="createInstrument">新建</el-button>
    </div>
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :autoresize="true"
        :data-source="dataSource"
        :operates="popOperates"
        :pagination="pagination"
        edit-type="pop"
        highlight-current-row
      />
    </div>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { Instrument } from './components/index'
import { PublicCrm } from '@/views/crm/public/index'
export default {
  mixins: [Instrument, PublicCrm],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 为数字正则
    // const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })

    // 客户搜索
    // 用户搜索
    const userSearch = value => {
      if (value === '') {
        this.$set(this.popOptions.content[0], 'dataSource', [])
      } else {
        if (!this.getData3) {
          this.getData3 = this.$utils.debounce(this.remoteUserList, 300)
        }
        this.getData3({ realName: value, name: value }, 0, this.popOptions)
      }
    }
    // 表格表头配置信息/以下五个都是table的配置信息
    const columns = [
      {
        prop: 'id',
        label: '序号',
        width: '80',
        formater: scope => {
          // console.log('scope', scope, this.pagination)
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        // return scope.$index + 1
        }
      },
      {
        prop: 'userName',
        label: '用户',
        showOverflowTooltip: true,
        minWidth: '60'
      },
      {
        prop: 'type',
        label: '仪表盘类型',
        minWidth: '60',
        formater: scope => {
          return scope.row[scope.column.property] === 1 ? '普通' : '管理'
        }
      },
      {
        prop: 'createdTime',
        label: '创建日期',
        width: '160',
        formater: scope => {
          return scope.row[scope.column.property] ? this.$filters.parseTime(scope.row[scope.column.property] + '', '{y}-{m}-{d} {h}:{i}:{s}') : ''
        }
      }
    ]
    // 分页配置信息
    const pagination = {
      // currentPage: 1,
      // pageSize: 20,
      // dataTotal: dataSource.length,
      currentChange: val => {
        // console.log('currentChange', this.pagination)
        this.getInstrumentPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getInstrumentPage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    let handleConf = [
      {
        label: '编辑',
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.type = 'edit'
          console.log('编辑', params)
          this.PopDialogHandle(this.popOptions, '编辑仪表盘用户')
          this.getInstrumentInfo({ id: params.row.id })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: true,
        handle: params => {
          this.$confirm(' 你确认要删除该仪表盘用户吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.deleteInstrument({ id: params.row.id })
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
    handleConf = this.$filterPermission(handleConf)
    // 表格操作栏里面的配置信息
    const popOperates = {
      label: '操作',
      width: '100',
      dataSource: handleConf
    }
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        this.addOrEditInstrument(params)
      },
      cancel: params => {
        this.closePopDialogHandle(this.popOptions)
        // console.log(params)
      },
      formDatas: {
      },
      formOptions: {
        inline: true
        // labelWidth: '111px'
      },
      content: [
        {
          prop: 'userId',
          itemType: 'select',
          filterable: true,
          className: 'commonRemoteSearch',
          remote: true,
          remoteMethod: userSearch,
          itemStyle: { 'width': '47%', 'marginRight': '0px' },
          label: '用户',
          rules: [commonChangeReg],
          dataSource: [],
          placeholder: '查找用户'
        },
        {
          prop: 'type',
          itemType: 'select',
          label: '仪表盘类型',
          labelWidth: '121px',
          itemStyle: { 'width': '53%', 'marginRight': '0px' },
          rules: [commonChangeReg],
          dataSource: [
            {
              value: 1,
              label: '普通'
            },
            {
              value: 2,
              label: '管理'
            }
          ]
        }
      ]
    }
    return {
      formOtions: {
        inline: true
      },
      formDatas: {},
      columns,
      pagination,
      dataSource: [],
      popOperates,
      popOptions
    }
  },
  created() {
    this.getInstrumentPage()
  },
  methods: {
    // createInstrument() {

    // }
  }
}
</script>

<style lang='scss' scoped>
.instrument {
  padding: 20px;
  padding-bottom: 0;
  .button {
    // margin-bottom: 22px;
  }
}
</style>
