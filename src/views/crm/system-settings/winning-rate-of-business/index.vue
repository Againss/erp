<template>
  <div class="winning-rate">
    <!-- <div class="button"> -->
    <!-- <el-button v-permission="['userCenter:sysUser:add']" type="primary" @click="createWinningRate">新建</el-button> -->
    <!-- </div> -->
    <!-- table表格 -->
    <div class="page-table">
      <cs-custom-table
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
import { WinningRate } from './components/index'
import { PublicCrm } from '@/views/crm/public/index'
export default {
  mixins: [WinningRate, PublicCrm],
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 1~99为数字正则
    const numberReg = this.$getRules({ type: 'number', pattern: /^[1-9][0-9]{0,1}$/, message: '请输入1~99的整数', trigger: ['blur'] })
    const style = {
      'fontSize': '22px',
      'marginLeft': '5px',
      'lineHeight': '36px'
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
        prop: 'businessStage',
        label: '商机阶段赢率名称',
        minWidth: '60'
      },
      {
        prop: 'rate',
        label: '赢率',
        minWidth: '60',
        formater: scope => {
          return scope.row[scope.column.property] + '%'
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
        this.getWinningRatePage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        // console.log('sizeChange', this.pagination)
        this.getWinningRatePage({ pageNum: this.pagination.pageNum || 1, pageSize: val })
      }
    }
    let handleConf = [
      {
        label: '编辑',
        // permitTag: ['userCenter:sysDataMaskingRule:modify'],
        isShow: scope => {
          console.log(scope)
          return scope.row.rate !== '0' && scope.row.rate !== '100'
        },
        handle: params => {
          this.type = 'edit'
          console.log('编辑', params)
          this.PopDialogHandle(this.popOptions, `编辑商机阶段赢率-${params.row.businessStage}`)
          this.getWinningRateInfo({ id: params.row.id })
        }
      }
    ]
    handleConf = this.$filterPermission(handleConf)
    // 表格操作栏里面的配置信息
    const popOperates = {
      label: '操作',
      width: '80',
      dataSource: handleConf
    }
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      // width: '720px',
      // okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        console.log('确认', params)
        delete params.follower
        this.addOrEditWinningRate(params)
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
          prop: 'rate',
          itemType: 'input',
          label: '商机阶段名称',
          itemStyle: { 'width': '50%', 'marginRight': 0, 'marginLeft': '22%' },
          rules: [commonBlurReg, numberReg],
          maxlength: 20,
          placeholder: '请输入商机阶段名称'
        },
        {
          itemType: 'view',
          itemStyle: { 'width': '50%', 'marginRight': 0 },
          text: '%',
          style
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
    this.getWinningRatePage()
  },
  methods: {
    // createWinningRate() {

    // }
  }
}
</script>

<style lang='scss' scoped>
.winning-rate {
  padding: 20px;
  padding-bottom: 0;
}
</style>

