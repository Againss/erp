<template>
  <div class="operation-dictionary-table">
    <div class="tab-group">
      <el-tabs v-model="activeName" class="commonTabs" @tab-click="handleClick">
        <!-- <el-tab-pane v-if="$permission(['baseData:qa:yarnGradeConfig:page'])" label="大货" name="B" />
        <el-tab-pane v-if="$permission(['baseData:qa:pysicalSurveyConfig:page'])" label="样板" name="S" />
        <el-tab-pane v-if="$permission(['baseData:qa:executivsStandardConfig:page'])" label="补布" name="C" /> -->
        <el-tab-pane v-if="$permission(['bmpAps:ltset:apsProcessDic:b:page'])" label="大货" name="B" />
        <el-tab-pane v-if="$permission(['bmpAps:ltset:apsProcessDic:s:page'])" label="样板" name="S" />
        <el-tab-pane v-if="$permission(['bmpAps:ltset:apsProcessDic:c:page'])" label="补布" name="C" />
      </el-tabs>
      <div class="addButton">
        <el-button v-if="addButtonPermission" class="process-button" size="small" type="primary" @click="addHandle">新建</el-button>
      </div>
    </div>
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
import enableSwitch from '../../common/enableSwitch.vue'
import { OperationDictionaryTable } from './components/index'
export default {
  mixins: [OperationDictionaryTable],
  data() {
    // 公用验证正则
    const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 正则0~999整数
    const max999Reg = this.$getRules({ type: 'number', pattern: /^(0|\+?[1-9][0-9]{0,2})$/, message: '0~999的整数', trigger: ['blur'] })
    const columns = {
      '_id': {
        prop: 'id',
        label: '序号',
        minWidth: '60',
        formater: (scope) => {
          return this.pagination.currentPage && (this.pagination.currentPage - 1) * 20 + scope.$index + 1
        }
      },
      '_produceProcess': {
        prop: 'produceProcess',
        label: '生产流程',
        minWidth: '160',
        showOverflowTooltip: true
      },
      '_normalLt': {
        prop: 'normalLt',
        label: '正常LT',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_dyeDayNum': {
        prop: 'dyeDayNum',
        label: '染纱天数',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_knitDayNum': {
        prop: 'knitDayNum',
        label: '织天数',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_dyeComplatedDayNum': {
        prop: 'dyeComplatedDayNum',
        label: '染整天数',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_printDayNum': {
        prop: 'printDayNum',
        label: '印花天数',
        minWidth: '80',
        showOverflowTooltip: true
      },
      '_status': {
        prop: 'status',
        // label: '启用/禁用',
        label: '状态',
        minWidth: '90',
        components: { enableSwitch },
        componentsOptions: {
          permitTag: ['bmpAps:ltset:apsProcessDic:b:updateStatus'],
          changeStatus: (scope) => {
            console.log(scope)
            this.apsProcessDicUpdateStatus({ id: scope.row.id, status: scope.row.status })
          }
        }
        // showOverflowTooltip: true
      }
    }
    // 设置分页
    const pagination = {
      currentChange: val => {
        console.log('current', val)
        this.apsProcessDicPage({ pageSize: this.pagination.pageSize || 20, pageNum: val })
      },
      sizeChange: val => {
        console.log('size', val)
        this.$set(this.pagination, 'currentPage', 1)
        this.apsProcessDicPage({ pageNum: 1, pageSize: val })
      }
    }
    const popOperatesDataSource = [
      {
        label: '修改',
        permitTag: ['bmpAps:ltset:apsProcessDic:b:modify'],
        isShow: (scope) => {
          return true
        },
        handle: params => {
          this.type = 'edit'
          this.popOptions.visible = true
          this.popOptions.title = '修改工序字典表'
          this.apsProcessDicInfo({ id: params.row.id })
        }
      },
      {
        label: '删除',
        style: { 'color': '#FE4949' },
        permitTag: ['bmpAps:ltset:apsProcessDic:b:delete'],
        isShow: (scope) => {
          return true
        },
        handle: async scope => {
          const res = await this.$uiUtils.confirmMsg()
          if (res) {
            console.log('确认删除')
            this.apsProcessDicDelete({ id: scope.row.id })
          } else {
            console.log('取消删除')
          }
        }
      }
    ]
    // popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
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
      title: '修改',
      okText: '保存',
      customClass: 'popOptionsClass',
      ok: params => {
        const tempArr = []
        const processArr = this.$utils.deepClone(this.popOptions.content._produceProcess.dataSource)
        for (let i = 0; i < processArr.length; i++) {
          for (let j = 0; j < params.produceProcess.length; j++) {
            if (params.produceProcess[j] === processArr[i].value) {
              tempArr.push(processArr[i].value)
            }
          }
        }
        const produceProcess = tempArr ? tempArr.join(',') : ''
        this.apsProcessDicAddOrEdit({ ...params, produceProcess })
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
        _produceProcess: {
          prop: 'produceProcess',
          itemType: 'checkbox-group',
          label: '生产流程',
          rules: [commonChangeReg],
          dataSource: [
            {
              value: '染纱',
              label: '染纱'
            },
            {
              value: '织布',
              label: '织布'
            },
            {
              value: '染整',
              label: '染整'
            },
            {
              value: '印花',
              label: '印花'
            }
          ]
        },
        _normalLt: {
          prop: 'normalLt',
          itemType: 'input',
          rules: [commonBlurReg, max999Reg],
          label: '正常LT',
          placeholder: '请输入天数'
        },
        _dyeDayNum: {
          prop: 'dyeDayNum',
          itemType: 'input',
          rules: [commonBlurReg, max999Reg],
          label: '染纱天数',
          placeholder: '请输入天数'
        },
        _knitDayNum: {
          prop: 'knitDayNum',
          itemType: 'input',
          rules: [commonBlurReg, max999Reg],
          label: '织天数',
          placeholder: '请输入天数'
        },
        _dyeComplatedDayNum: {
          prop: 'dyeComplatedDayNum',
          itemType: 'input',
          rules: [commonBlurReg, max999Reg],
          label: '染整天数',
          placeholder: '请输入天数'
        },
        _printDayNum: {
          prop: 'printDayNum',
          itemType: 'input',
          rules: [commonBlurReg, max999Reg],
          label: '印花天数',
          placeholder: '请输入天数'
        }
      }
    }
    return {
      activeName: this.$permission(['bmpAps:ltset:apsProcessDic:b:page']) ? 'B' : this.$permission(['bmpAps:ltset:apsProcessDic:s:page']) ? 'S' : 'C',

      columns,
      dataSource: [],
      pagination,
      operates,
      popOperatesDataSource,

      popOptions,

      type: 'add'
    }
  },
  computed: {
    addButtonPermission({ activeName }) {
      return activeName === 'B' && this.$permission(['bmpAps:ltset:apsProcessDic:b:add']) || activeName === 'S' && this.$permission(['bmpAps:ltset:apsProcessDic:s:add']) || activeName === 'C' && this.$permission(['bmpAps:ltset:apsProcessDic:c:add'])
    }
  },
  watch: {
    activeName: {
      handler(v) {
        const obj = {
          B: { edit: 'bmpAps:ltset:apsProcessDic:b:modify', delete: 'bmpAps:ltset:apsProcessDic:b:delete', status: 'bmpAps:ltset:apsProcessDic:b:updateStatus' },
          S: { edit: 'bmpAps:ltset:apsProcessDic:s:modify', delete: 'bmpAps:ltset:apsProcessDic:s:delete', status: 'bmpAps:ltset:apsProcessDic:s:updateStatus' },
          C: { edit: 'bmpAps:ltset:apsProcessDic:c:modify', delete: 'bmpAps:ltset:apsProcessDic:c:delete', status: 'bmpAps:ltset:apsProcessDic:c:updateStatus' }
        }
        let popOperatesDataSource = this.popOperatesDataSource
        console.log(popOperatesDataSource)
        // console.log([obj[v].edit], [obj[v].delete])
        // this.$set(this.popOperatesDataSource[0], 'permitTag', v ? [obj[v].edit] : [])
        // this.$set(this.popOperatesDataSource[1], 'permitTag', v ? [obj[v].delete] : [])
        // console.log(this.popOperatesDataSource)
        popOperatesDataSource[0].permitTag = [obj[v].edit]
        popOperatesDataSource[1].permitTag = [obj[v].delete]
        this.columns._status.componentsOptions.permitTag = [obj[v].status]
        popOperatesDataSource = this.$filterPermission(popOperatesDataSource)
        this.operates.dataSource = popOperatesDataSource
      },
      immediate: true
    }

  },
  created() {
    this.apsProcessDicPage()
  },
  methods: {
    // tab栏点击
    handleClick() {
      console.log(this.activeName)
      this.apsProcessDicPage()
    }
  }
}
</script>

<style lang="scss">
  .operation-dictionary-table {
    padding: 20px;

    .commonTabs {
      background-color: #fff;
      padding: 20px 0 1px;
      .el-tabs__nav-scroll {
        padding: 0 20px;
      }
      .el-tabs__item {
        line-height: 20px;
        font-size: 14px;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__header {
        margin-bottom: 0;
      }
    }

    .tab-group {
      position: relative;
    }
    .addButton {
      position: absolute;
      right: 20px;
      top: 13px;
    }
  }
</style>
