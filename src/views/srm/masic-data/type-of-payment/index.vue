<template>
  <div class="srm-main">
    <div class="button">
      <el-button
        v-permission="['srm:basicData:payMode:add']"
        type="primary"
        size="small"
        @click="showDialogPopbox({ type: 'insert' })"
      >新建</el-button>
    </div>
    <div class="srm-content">
      <!-- 列表 -->
      <div class="page-table" :style="styles">
        <cs-custom-table
          tooltip-effect="dark"
          :table-scrollx="true"
          :columns="columns"
          :autoresize="false"
          :data-source="dataSource"
          :pagination="pagination"
          :operates="popOperates"
          edit-type="pop"
          highlight-current-indexrow
        />
      </div>
    </div>
    <!-- 新建弹框 -->
    <div class="pop-wrap">
      <cs-custom-pop :options="dialogPaymentVisible" />
    </div>
    <!-- 编辑弹框 -->
    <!--  <div class="pop-wrap">
      <cs-custom-pop :options="editPaymentPopBox" />
    </div>-->
  </div>
</template>
<script>
import { TypeOfPayTment } from './components/index'
import { PublicSrm } from '@/views/srm/public/index'
import { fetchLog } from '@/views/srm/public/fetchLog'
import SwitchStatus from '../../public/components/switch-status'
export default {
  name: 'Index',
  mixins: [TypeOfPayTment, PublicSrm, fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    /* 表头参数 */
    const columns = [
      {
        prop: 'index',
        align: 'left',
        label: '序号',
        minWidth: 60,
        formater: (row, column) => {
          return this.getPageIndex({
            pageSize: this.pagination.pageSize,
            currentPage: this.pagination.currentPage,
            index: row.$index
          })
        }
      },
      {
        prop: 'payWay',
        align: 'left',
        label: '付款方式',
        minWidth: 160
      },
      {
        prop: 'creatorName',
        align: 'left',
        label: '创建人',
        minWidth: 160
      },
      {
        prop: 'createdTime',
        align: 'left',
        label: '创建时间',
        showOverflowTooltip: true,
        minWidth: 160
      },
      {
        prop: 'status',
        align: 'left',
        label: '状态',
        width: 150,
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
              this.disableTypeOfPayment({ id: row.id, status: row.status ^ 1 })
            }
          },
          permission: 'srm:basicData:payMode:enable' // 付款方式启/禁用
        }
        /*  formater: (scope) => {
           return scope.row[scope.column.property] === 1
             ? '启用' : '禁用'
         } */
      }
    ]

    // 表格操作栏
    let newDataSource = [
      {
        label: '编辑',
        isShow: true,
        permitTag: ['srm:basicData:payMode:modify'],
        handle: (scope) => {
          this.showDialogPopbox({ type: 'update', ids: scope.row.id })
        }
      },
      {
        label: '删除',
        style: {
          color: '#FE4949'
        },
        isShow: true,
        permitTag: ['srm:basicData:payMode:delete'],
        handle: (params) => {
          this.$pub.confirmation({
            callback: () => this.deleteTypeOfPaymentById({
              id: params.row.id
            })
          })
        }
      }
    ]
    newDataSource = this.$filterPermission(newDataSource)
    const popOperates = {
      label: '操作',
      align: 'left',
      width: 120,
      fixed: 'right',
      dataSource: newDataSource
    }

    /*  分页信息 */
    const pagination = {
      currentChange: (val) => {
        this.getTypeOfPayment({
          pageSize: this.pagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getTypeOfPayment({
          pageNum: this.pagination.currentPage || 1,
          pageSize: val
        })
      }
    }

    /* 弹框 */
    const dialogPaymentVisible = {
      itemType: 'drawer',
      visible: false,
      title: '新增',
      okText: '确定',
      ok: params => {
        this.saveTypeOfPayment(params)
      },
      cancel: params => {
        //  this.$set(this.dialogPaymentVisible, 'formDatas', {})
        this.$set(this.dialogPaymentVisible, 'visible', false)
      },
      content: [{
        prop: 'payWay',
        itemType: 'input',
        label: '付款方式',
        maxlength: 20,
        rules: commonBlurReg
      }
      ]
    }
    return ({
      loading: false,
      columns,
      popOperates,
      pagination,
      dataSource: [],
      dialogPaymentVisible,
      dialogType: 'insert',
      styles: {},
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      rowCopy: null
    })
  }
}
</script>
