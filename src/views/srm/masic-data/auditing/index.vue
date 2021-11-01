<template>
  <div class="srm-main">
    <div class="button" style="text-align: left">
      <el-button
        v-if="tabActive === 'pgbm'"
        v-permission="['srm:basicData:judgmentAndReview:judgment:add']"
        type="primary"
        size="small"
        @click="add({ type: 'insertJudgment' })"
      >新建</el-button><el-button
        v-if="tabActive === 'shbm'"
        v-permission="['srm:basicData:judgmentAndReview:review:add']"
        type="primary"
        size="small"
        @click="add({ type: 'insertReview' })"
      >新建</el-button>
    </div>
    <div class="srm-content">
      <el-tabs v-model="tabActive" @tab-click="tabClickHandle">
        <!-- 准入供应商评估部门列表 -->
        <el-tab-pane
          v-if="permissiontype('srm:basicData:judgmentAndReview:judgment:list')"
          name="pgbm"
        >
          <span slot="label" class="label" index="1">准入供应商评估部门</span>
          <div class="page-table">
            <cs-custom-table
              v-if="tabActive === 'pgbm'"
              :autoresize="false"
              tooltip-effect="dark"
              :table-scrollx="true"
              :columns="departmentColumns"
              :data-source="departmentDataSource"
              :pagination="departmentPagination"
              :operates="departmentPopOperates"
              highlight-current-indexrow
            />
          </div>
        </el-tab-pane>
        <!-- 合格供应商审核部门 -->
        <el-tab-pane
          v-if="permissiontype('srm:basicData:judgmentAndReview:review:list')"
          name="shbm"
        >
          <span slot="label" class="label" index="2">合格供应商审核部门</span>
          <div class="page-table">
            <cs-custom-table
              v-if="tabActive === 'shbm'"
              tooltip-effect="dark"
              :autoresize="false"
              :columns="reviewColumns"
              :data-source="reviewDataSource"
              :pagination="reviewPagination"
              :operates="reviewPopOperates"
              highlight-current-indexrow
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 新增OR编辑弹框 -->
    <div class="pop">
      <cs-custom-pop ref="popForm" :options="popOptions" />
    </div>
  </div>
</template>
<script>
import { Auditing } from './components/index'
import { PublicSrm } from '@/views/srm/public/index'
import InsertEvaluationDepartment from './components/insert-evaluation-department'
import UpdateEvaluationDepartment from './components/update-evaluation-department'
import UpdateReviewDepartment from './components/update-review-department'
import InsertReviewDepartment from './components/insert-review-department'
import { fetchLog } from '@/views/srm/public/fetchLog'
export default {
  name: 'Index',
  mixins: [Auditing, PublicSrm, fetchLog],
  data() {
    // 公用验证正则
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })

    /* 准入供应商评估表头参数信息配置 */
    const departmentColumns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: 60,
        formater: (row, column) => {
          return this.getPageIndex({
            pageSize: this.departmentPagination.pageSize,
            currentPage: this.departmentPagination.currentPage,
            index: row.$index
          })
        }
      },
      {
        prop: 'supplierCategory',
        label: '供应商类别',
        minWidth: 120,
        formater: (scope) => {
          return scope.row[scope.column.property] === 1 ? '服务' : '采购'
        }
      },
      {
        prop: 'typeName',
        label: '供应商类型',
        minWidth: 120
      },
      {
        prop: 'creatorName',
        label: '创建人',
        minWidth: 110
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        showOverflowTooltip: true,
        width: 150,
        minWidth: 110
      },
      {
        prop: 'dataList',
        label: '评估部门及负责人',
        minWidth: 260,
        showOverflowTooltip: true,
        formater: (scope) => {
          const row = scope.row.dataList
          if (row && row.length > 0) {
            let span = '<div>'
            row.map((item) => {
              span +=
                '<span style="padding-right:8px;">' +
                item.departmentName +
                '(' +
                item.userName +
                ')' +
                '</span>'
            })
            /*  for (let i = 0; i <div row.length; i++) {
               const item = row[i]
               _span += item.departmentName + '(' + item.userName + ')&nbsp;&nbsp;'
             } */
            span += '</div>'
            return span
          }
        }
      }
    ]

    /*  准入供应商评估分页配置信息 */
    const departmentPagination = {
      currentChange: (val) => {
        this.getEvaluationDepartment({
          pageSize: this.departmentPagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getEvaluationDepartment({
          pageNum: this.departmentPagination.currentPage || 1,
          pageSize: val
        })
      }
    }

    /*  获取合格供应商审核部门分页 */
    const reviewPagination = {
      currentChange: (val) => {
        this.getReviewDepartment({
          pageSize: this.reviewPagination.pageSize || 20,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getReviewDepartment({
          pageNum: this.reviewPagination.currentPage || 1,
          pageSize: val
        })
      }
    }

    let newDataSource = [
      {
        label: '编辑',
        isShow: true,
        permitTag: ['srm:basicData:judgmentAndReview:judgment:modify'],
        handle: (params) => {
          this.showDialogVisble({
            type: 'updateJudgment',
            data: {
              id: params.row.id
            }
          })
        }
      },
      {
        label: '删除',
        style: {
          color: '#FE4949'
        },
        permitTag: ['srm:basicData:judgmentAndReview:judgment:delete'],
        isShow: true,
        handle: (params) => {
          this.$pub.confirmation({
            callback: () =>
              this.deleteJudgmentDepartment({
                id: params.row.id
              })
          })
        }
      }
    ]
    newDataSource = this.$filterPermission(newDataSource)
    /* 准入供应商评估表格操作栏的配置信息 */
    const departmentPopOperates = {
      label: '操作',
      align: 'left',
      fixed: 'right',
      width: 120,
      dataSource: newDataSource
    }

    /* 获取合格供应商审核部门表头参数信息配置 */
    const reviewColumns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: 60,
        align: 'left',
        formater: (row, column) => {
          return this.getPageIndex({
            pageSize: this.reviewPagination.pageSize,
            currentPage: this.reviewPagination.currentPage,
            index: row.$index
          })
        }
      },
      {
        prop: 'reviewDepartmentName',
        align: 'left',
        label: '审核部门',
        minWidth: 120
      },
      {
        prop: 'reviewerName',
        label: '审核人',
        align: 'left',
        minWidth: 105
      },
      {
        prop: 'creatorName',
        label: '创建人',
        align: 'left',
        minWidth: 105
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        align: 'left',
        showOverflowTooltip: true,
        width: 180,
        minWidth: 120
      }
    ]

    /* 获取合格供应商审核部门表格操作栏 */

    const newDataTwo = [
      {
        label: '编辑',
        isShow: true,
        permitTag: ['srm:basicData:judgmentAndReview:review:modify'],
        handle: (params) => {
          this.showDialogVisble({ type: 'updateReview', data: params.row })
        }
      },
      {
        label: '删除',
        isShow: true,
        style: {
          color: '#FE4949'
        },
        permitTag: ['srm:basicData:judgmentAndReview:review:delete'],
        handle: (params) => {
          this.$pub.confirmation({
            callback: () =>
              this.deleteReviewDepartment({
                id: params.row.id
              })
          })
        }
      }
    ]

    const reviewPopOperates = {
      label: '操作',
      align: 'left',
      fixed: 'right',
      width: 120,
      dataSource: newDataTwo
    }

    /* 编辑弹框自定义组件评估部门 */
    const updateEvaluationControls = [
      {
        components: {
          UpdateEvaluationDepartment
        },
        componentsOptions: {
          evaluationFlag: ''
        }
      }
    ]
    /* 编辑准入供应商评估部门弹框 */
    const dialogUpdateJudgmentDepartmentVisble = {
      itemType: 'drawer',
      visible: false,
      title: '编辑',
      okText: '确定',
      size: '580px',
      ok: (params) => {
        const dataList = []
        if (params.dataList.length > 0) {
          params.dataList.forEach((item, index) => {
            dataList.push({
              departmentId: item.departmentId,
              user: item.user
            })
          })
        }
        this.updateJudgmentDepartment({
          id: params.id,
          supplierCategory: params.supplierCategory,
          supplierType: params.supplierType,
          dataList
        })
      },
      close: (params) => {
        this.closeDialogPopBox(this.dialogUpdateJudgmentDepartmentVisble)
      },
      cancel: (params) => {
        this.closeDialogPopBox(this.dialogUpdateJudgmentDepartmentVisble)
      },
      content: []
    }

    /* 新增弹框自定义组件评估部门 */
    const insertEvaluationControls = [
      {
        components: {
          InsertEvaluationDepartment
        },
        componentsOptions: {
          evaluationFlag: ''
        }
      }
    ]
    /* 新增弹框 */
    const dialogInsertJudgmentDepartmentVisble = {
      itemType: 'drawer',
      visible: false,
      title: '新增',
      okText: '确定',
      size: '580px',
      ok: (params) => {
        const newParams = {
          supplierCategory: params.supplierCategory,
          supplierType: params.supplierType,
          dataList: [
            ...(params.addDepartment || []),
            {
              key: Date.now(),
              departmentId: params.departmentId,
              user: params.user
            }
          ]
        }
        this.insertJudgmentDepartment(newParams)
      },
      close: (params) => {
        this.closeDialogPopBox(this.dialogInsertJudgmentDepartmentVisble)
      },
      cancel: (params) => {
        this.closeDialogPopBox(this.dialogInsertJudgmentDepartmentVisble)
      },
      content: []
    }

    /* 编辑弹框自定义组件准入供应商评估部门 */
    const updateReviewDepartmentControls = [
      {
        components: {
          UpdateReviewDepartment
        },
        componentsOptions: {
          evaluationFlag: ''
        }
      }
    ]

    /* 编辑合格供应商评估部门弹框 */
    const dialogUpdateReviewDepartmentVisble = {
      itemType: 'drawer',
      visible: false,
      title: '编辑',
      okText: '确定',
      size: '580px',
      ok: (params) => {
        this.updateReviewDepartment({
          id: params.id,
          reviewDepartmentId: params.reviewDepartmentId,
          reviewer: params.reviewer
        })
      },
      close: (params) => {
        this.closeDialogPopBox(this.dialogUpdateReviewDepartmentVisble)
      },
      cancel: (params) => {
        this.closeDialogPopBox(this.dialogUpdateReviewDepartmentVisble)
      },
      content: []
    }

    /* 新增弹框自定义组件评估部门 */
    const insertReviewDepartmentControls = [
      {
        components: {
          InsertReviewDepartment
        },
        componentsOptions: {
          evaluationFlag: ''
        }
      }
    ]
    /* 新增弹框 */
    const dialogInsertReviewDepartmentVisble = {
      itemType: 'drawer',
      visible: false,
      title: '新增',
      size: '580px',
      okText: '确定',
      ok: (params) => {
        const newParams = {
          listData: [
            ...params.addDepartment,
            {
              key: Date.now(),
              reviewDepartmentId: params.reviewDepartmentId,
              reviewer: params.reviewer
            }
          ]
        }
        this.insertReviewDepartment(newParams)
      },
      close: () => {
        this.closeDialogPopBox(this.dialogInsertReviewDepartmentVisble)
      },
      cancel: (params) => {
        this.closeDialogPopBox(this.dialogInsertReviewDepartmentVisble)
      },
      content: []
    }

    return {
      loading: false,
      tabActive: 'pgbm',
      departmentPopOperates,
      departmentColumns,
      departmentPagination,
      departmentDataSource: [],
      reviewColumns,
      reviewPopOperates,
      reviewPagination,
      reviewDataSource: [],
      dialogInsertJudgmentDepartmentVisble,
      dialogUpdateJudgmentDepartmentVisble,
      dialogUpdateReviewDepartmentVisble,
      updateReviewDepartmentControls,
      insertReviewDepartmentControls,
      insertEvaluationControls,
      updateEvaluationControls,
      dialogInsertReviewDepartmentVisble,
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      rowCopy: null,
      popOptions: {}
    }
  },
  methods: {
    permissiontype(type) {
      return this.$permission([type])
    },
    add(obj) {
      this.showDialogVisble(obj)
    }
  }
}
</script>
