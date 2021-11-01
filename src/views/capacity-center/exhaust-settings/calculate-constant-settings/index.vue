<template>
  <div class="calculate-constant-settings">
    <div class="page-table">
      <cs-custom-table
        tooltip-effect="dark"
        :columns="columns"
        :table-scrollx="true"
        :data-source="dataSource"
        :pagination="pagination"
        :operates="operates"
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
import { CalculateConstantSettings } from './components/index'
export default {
  mixins: [CalculateConstantSettings],
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 正则0~99整数
    const max99Reg = this.$getRules({ type: 'number', pattern: /^(0|\+?[1-9][0-9]{0,1})$/, message: '0~99的整数', trigger: ['blur'] })
    const columns = {
      // '_id': {
      //   prop: 'id',
      //   label: '序号',
      //   minWidth: '60',
      //   formater: (scope) => {
      //     return scope.$index + 1
      //   }
      // },
      '_type': {
        prop: 'type',
        label: '常数类型',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_num': {
        prop: 'num',
        label: '天数',
        minWidth: '60',
        showOverflowTooltip: true
      }
    }
    // 设置分页
    const pagination = {
      currentChange: val => {
        console.log('current', val)
        this.apsConstantSetPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.apsConstantSetPage({ pageNum: 1, pageSize: val })
      }
    }
    let popOperatesDataSource = [
      {
        label: '修改',
        permitTag: ['bmpAps:ltset:apsConstantSet:modify'],
        isShow: (scope) => {
          return true
        },
        handle: params => {
          this.type = 'edit'
          this.popOptions.visible = true
          this.apsConstantSetInfo({ id: params.row.id })
        }
      }
    ]
    popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
    // 操作栏
    const operates = {
      label: '操作',
      width: '150',
      fixed: 'right',
      // moreOptions: {
      //   maxLength: 2// 最大超过多少个显示more功能，默认为2
      // },
      dataSource: popOperatesDataSource
    }
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '修改计算常数设置',
      okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        // const produceProcess = params.produceProcess ? params.produceProcess.join(',') : ''
        this.apsConstantSetModify(params)
      },
      cancel: params => {
        this.popOptions.visible = false
      },
      close: params => {
        this.popOptions.formDatas = { produceProcess: [] }
      },
      formDatas: {
      },
      formOptions: {
        // labelWidth: '111px'
      },
      content: {
        _num: {
          prop: 'num',
          itemType: 'input',
          rules: [commonBlurReg, max99Reg],
          label: '天数',
          placeholder: '请输入天数'
        }
      }
    }
    return {
      columns,
      dataSource: [],
      pagination,
      operates,

      popOptions
    }
  },
  created() {
    this.apsConstantSetPage()
  }
}
</script>

<style lang="scss">
  .calculate-constant-settings {
    padding: 20px;
  }
</style>
