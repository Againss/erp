<template>
  <div class="srm-main">
    <div class="button" style="text-align: right">
      <el-button
        type="primary"
        size="small"
        @click="updateSpecificGravity()"
      >保存</el-button>
    </div>
    <div class="srm-content">
      <!-- 考核比重列表 -->
      <div class="page-table m-top-15">
        <cs-custom-form
          ref="inlineTable"
          class="table-form"
          :table-scrollx="true"
          :data-source="searchData"
          :options="formOtions"
          :form-datas="formDatas"
          :pagination="pagination"
        />
        <!-- <cs-custom-table
          ref="inlineTable"
          tooltip-effect="dark"
          :columns="columns"
          :autoresize="false"
          :data-source="specificsList"
          :pagination="pagination"
          :form-datas="formDatas"
          :operates="popOperates"
          edit-type="inline"
          highlight-current-indexrow
        /> -->
      </div>
    </div>
    <!-- 编辑弹框 -->
    <div class="pop-wrap">
      <cs-custom-pop :options="dialogSpecificGravityVisable" />
    </div>
  </div>
</template>
<script>
import { SpecificGravity } from './components/index'
import { PublicSrm } from '@/views/srm/public/index'
import { fetchLog } from '@/views/srm/public/fetchLog'
import SwitchStatus from '../../public/components/switch-status'
export default {
  name: 'Index',
  mixins: [SpecificGravity, PublicSrm, fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    var checkSpecifics = (rule, value, callback) => {
      setTimeout(() => {
        if (!value) {
          return callback(new Error('比重不能为空！'))
        } else if (!Number.isInteger(Number(value))) {
          return callback(new Error('请输入正整数！'))
        } else if ((value < 1 || value > 100)) {
          return callback(new Error('请输入1-100以内的数字！'))
        } else {
          return callback()
        }
      }, 1000)
    }
    /* 表头参数信息配置 */
    const columns = [
      {
        prop: 'index',
        label: '序号',
        align: 'left',
        minWidth: 60,
        formater: (row, column) => {
          return this.getPageIndex({
            pageSize: this.pagination.pageSize || 20,
            currentPage: this.pagination.currentPage || 1,
            index: row.$index || 0
          })
        }
      },
      {
        prop: 'assessDimension',
        align: 'left',
        label: '考核维度',
        showOverflowTooltip: true,
        minWidth: 160
      },
      {
        prop: 'specifics',
        align: 'right',
        label: '比重%',
        className: 'specifics-td',
        editOptions: {
          className: 'specifics-input',
          labelWidth: '0',
          itemType: 'input',
          rules: [{ validator: checkSpecifics, trigger: ['change'] }]
        },
        minWidth: 160
      },
      {
        prop: 'status',
        align: 'left',
        label: '状态',
        minWidth: 160,
        width: 200,
        components: {
          SwitchStatus
        },
        componentsOptions: {
          formatter: (scope) => {
            if (scope.row.status === 1) {
              return '1'
            }
            return '0'
          },
          changeHandel: (params) => {
            const row = params.row
            if (row) {
              this.disableSpecificGravity({
                id: row.id,
                status: row.status ^ 1
              })
            }
          },
          permission: 'srm:basicData:assessSpecific:enable' // 考核比重商启/禁用
        }
      }
    ]

    // 表格操作栏的配置信息
    let newDataSource = [
      {
        label: '确定',
        isShow: (scope) => {
          return scope.row.edit
        },
        permitTag: ['srm:basicData:assessSpecific:modify'],
        handle: (params) => {
          this.$refs.inlineTable.form.validate(valid => {
            if (valid) {
              const formRowDatas = this.$refs.inlineTable
                .dynamicValidateFormRuleForm.tableForm
              for (const i in formRowDatas[params.$index]) {
                if (i !== 'edit') {
                  params.row[i] = formRowDatas[params.$index][i]
                }
              }
              params.row.edit = !params.row.edit
            }
          })
        }
      },
      {
        isShow: scope => {
          return scope.row.edit
        },
        label: '取消',
        handle: params => {
          params.row.edit = !params.row.edit
        }
      },
      {
        label: '编辑',
        isShow: (scope) => {
          return !scope.row.edit
        },
        permitTag: ['srm:basicData:assessSpecific:modify'],
        handle: (params) => {
          params.row.edit = !params.row.edit
          this.setinlineFormDatas({
            key: params.$index,
            value: { ...params.row }
          })
        }
      }
    ]
    newDataSource = this.$filterPermission(newDataSource)
    const popOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 120,
      dataSource: newDataSource
    }

    /*  分页配置信息 */
    const pagination = {
      currentChange: (val) => {
        this.getSpecificGravityList({
          pageSize: this.pagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getSpecificGravityList({
          pageNum: this.pagination.currentPage || 1,
          pageSize: val
        })
      }
    }
    /* 编辑弹框 */
    const dialogSpecificGravityVisable = {
      itemType: 'dialog',
      visible: false,
      title: '编辑',
      okText: '确定',
      ok: (params) => {
        this.updateSpecificGravity(params)
      },
      cancel: params => {
        this.$set(this.dialogSpecificGravityVisable, 'formDatas', {})
        this.$set(this.dialogSpecificGravityVisable, 'visible', false)
      },
      content: [{
        prop: 'specifics',
        itemType: 'input',
        label: '配合度考核',
        rules: commonBlurReg
      }]
    }
    const searchData = [
      {
        prop: 'tableForm',
        itemType: 'table-form',
        dataSource: [],
        columns: columns,
        operates: {
          label: '操作',
          width: '100px',
          dataSource: newDataSource
        }
      }
    ]
    return ({
      loading: false,
      popOperates,
      columns,
      pagination,
      searchData,
      formDatas: {},
      dataSource: [],
      dialogSpecificGravityVisable,
      specificsList: [],
      formOtions: {
        showMessage: true
      },
      rowCopy: null
    })
  }
}
</script>
<style lang="scss">
.table-form {
  .specifics-input > input[type='text'] {
    text-align: right;
    height: 28px;
    width: 120px;
  }
  .el-form-item {
    margin-bottom: 0 !important;
  }
  .cell {
    margin: 2px 0;
  }
  .specifics-td {
    position: relative;
    .el-form-item__content {
      position: static !important;
    }
    .el-form-item__error {
      text-align: right;
      height: 22px;
      width: 100%;
      line-height: 22px;
      position: absolute;
      top: auto !important;
      bottom: 4px;
      left: 0;
      padding-right: 10px;
    }
    .el-form-item,
    .cell {
      overflow: visible;
    }
  }
}
</style>
