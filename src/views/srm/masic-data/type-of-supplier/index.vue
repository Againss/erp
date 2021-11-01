<template>
  <div class="srm-main">
    <div class="button">
      <el-button
        v-if="active === 'buyer'"
        v-permission="['srm:basicData:supplierType:add']"
        type="primary"
        size="small"
        @click="showTypeOfSupplierDialog({ type: 'add' })"
      >新建</el-button>
    </div>
    <div class="srm-content">
      <!-- 列表 -->
      <el-tabs v-model="active" @tab-click="tabClick">
        <el-tab-pane name="buyer">
          <span slot="label" class="label" tabindex="0">采购供应商</span>
        </el-tab-pane>
        <el-tab-pane name="service">
          <span slot="label" class="label" tabindex="1">服务供应商</span>
        </el-tab-pane>
      </el-tabs>
      <div v-if="dataSource" class="page-table">
        <cs-custom-table
          tooltip-effect="dark"
          :table-scrollx="true"
          :columns="columns"
          :autoresize="false"
          :data-source="dataSource"
          :pagination="pagination"
          :operates="popOperates"
          highlight-current-indexrow
          :form-otions="formOtions"
        />
      </div>
    </div>
    <!-- 新增编辑框 -->
    <div class="pop">
      <cs-custom-pop ref="popForm" :options="dialogTypeOfSupplierVisable" />
    </div>
  </div>
</template>
<script>
import { TypeOfSupplier } from './components/index'
import { PublicSrm } from '@/views/srm/public/index'
import { fetchLog } from '@/views/srm/public/fetchLog'
import switchStatus from '../../public/components/switch-status'
export default {
  name: 'Index',
  mixins: [TypeOfSupplier, PublicSrm, fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })

    /* 表头参数信息配置 */
    const columns = [
      {
        prop: 'index',
        label: '序号',
        align: 'left',
        minWidth: 60,
        formater: (row, column) => {
          //  return row.$index + (this.pagination.currentPage - 1) * this.pagination.pageSize + 1
          return this.getPageIndex({
            pageSize: this.pagination.pageSize,
            currentPage: this.pagination.currentPage,
            index: row.$index
          })
        }
      },
      {
        prop: 'typeName',
        label: '供应商类型',
        align: 'left',
        minWidth: 150
      },
      {
        prop: 'creatorName',
        label: '创建人',
        align: 'left',
        // width: '150'
        minWidth: 150
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        align: 'left',
        showOverflowTooltip: true,
        width: 180,
        minWidth: 150
      },
      {
        prop: 'status',
        label: '状态',
        align: 'left',
        minWidth: 160,
        width: 160,
        components: {
          switchStatus
        },
        componentsOptions: {
          formatter: (scope) => {
            if (scope.row.status === 1) {
              return '1'
            }
            return '0'
          },
          changeHandel: (scope) => {
            const row = scope.row
            this.disableTypeSupplier({
              id: row.id,
              status: row.status
            })
          },
          permission: 'srm:basicData:supplierType:enable' // 供应商类别启/禁用
        }
      }
    ]
    // 表格操作栏的配置信息
    let newDataSource = [
      {
        label: '编辑',
        isShow: () => this.active === 'buyer',
        permitTag: ['srm:basicData:supplierType:modify'],
        handle: (params) => {
          this.showTypeOfSupplierDialog({
            ids: params.row.id,
            type: 'update'
          })
        }
      },
      {
        label: '删除',
        style: {
          color: '#FE4949'
        },
        permitTag: ['srm:basicData:supplierType:delete'],
        isShow: () => this.active === 'buyer',
        handle: (params) => {
          this.$pub.confirmation({
            callback: () => {
              this.deleteTypeSupplier({
                id: params.row.id
              })
            }
          })
        }
      }
    ]
    newDataSource = this.$filterPermission(newDataSource)
    const popOperates = {
      label: '操作',
      align: 'left',
      fixed: 'right',
      width: 120,
      dataSource: newDataSource
    }

    /*  分页配置信息 */
    const pagination = {
      currentChange: (val) => {
        this.getTypeSupplierList({
          supplierCategory: this.supplierCategory,
          pageSize: this.pagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getTypeSupplierList({
          supplierCategory: this.supplierCategory,
          pageNum: this.pagination.currentPage || 1,
          pageSize: val
        })
      }
    }
    /* 弹框 */
    const dialogTypeOfSupplierVisable = {
      itemType: 'drawer',
      visible: false,
      title: '新增',
      okText: '确定',
      ok: (params) => {
        this.saveTypeSupplierOfType(params)
      },
      cancel: (params) => {
        this.$set(this.dialogTypeOfSupplierVisable, 'formDatas', {})
        this.$set(this.dialogTypeOfSupplierVisable, 'visible', false)
      },
      content: [
        {
          prop: 'typeName',
          itemType: 'input',
          label: '供应商类型:',
          rules: [
            { ...commonBlurReg, message: '供应商类型不能为空！' },
            { max: 50, message: '长度在 50 个字符以内', trigger: ['blur'] }
          ],
          placeholder: '请输入供应商类型'
        }
      ]
    }
    return {
      loading: false,
      popOperates,
      columns,
      pagination,
      supplierCategory: 0,
      dataSource: [],
      active: 'buyer',
      dialogTypeOfSupplierVisable,
      dialogType: 'add',
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      rowCopy: null
    }
  }
}
</script>
