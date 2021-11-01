<template>
  <div class="srm-main">
    <div class="srm-content">
      <!-- 考核周期列表 -->
      <div class="page-table m-top-15">
        <cs-custom-table
          tooltip-effect="dark"
          :table-scrollx="true"
          :columns="columns"
          :autoresize="false"
          :data-source="dataSource"
          :pagination="pagination"
          edit-type="pop"
          highlight-current-indexrow
        />
      </div>
    </div>
  </div>
</template>
<script>
// import { render } from 'nprogress'
import { fetchLog } from '@/views/srm/public/fetchLog'
import { PublicSrm } from '@/views/srm/public/index'
import { EvaluationCycle } from './components/index'
import DisabledControls from './components/disabled-controls.vue'
import SwitchStatus from '../../public/components/switch-status'
export default {
  name: 'Index',
  mixins: [EvaluationCycle, PublicSrm, fetchLog],
  data() {
    /* 表头参数信息配置 */
    const columns = [
      {
        prop: 'index',
        label: '序号',
        minWidth: 60,
        align: 'left',
        formater: (row, column) => {
          return this.getPageIndex({
            pageSize: this.pagination.pageSize || 20,
            currentPage: this.pagination.currentPage || 1,
            index: row.$index || 0
          })
        }
      },
      {
        prop: 'assessmentPeriodType',
        label: '考核周期',
        minWidth: 120,
        align: 'left'
      },
      {
        prop: 'status',
        label: '状态',
        align: 'left',
        width: 120,
        minWidth: 120,
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
          changeHandel: (scope) => {
            const row = scope.row
            this.disableEvaluationCycle({
              id: row.id,
              status: row.status
            })
          },
          permission: 'srm:basicData:assessmentPeriod:enable' // 考核周期启/禁用
        }
        /* formater: (scope) => {
          return scope.row[scope.column.property] === 1
            ? '启用' : '禁用'
        } */
      }
    ]

    // 表格操作栏的配置信息
    const popOperates = {
      label: '操作',
      fixed: 'right',
      align: 'left',
      width: 120,
      components: {
        DisabledControls
      },
      componentsOptions: {
        callback: (row) => {
          this.disableEvaluationCycle({
            id: row.id,
            status: row.status
          })
        }
      }
      /*   dataSource: [
          {
            label: '禁用',
            isShow: true,
            handle: (params) => {
              console.log(params)
              this.disableEvaluationCycle({
                id: params.row.id,
                status: params.row.status
              })
            }
          }
        ] */
    }

    /*  分页配置信息 */
    const pagination = {
      currentChange: (val) => {
        this.getEvaluationCycleList({
          pageSize: this.pagination.pageSize || 5,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getEvaluationCycleList({
          pageNum: this.pagination.currentPage || 1,
          pageSize: val
        })
      }
    }

    return ({
      loading: false,
      popOperates,
      columns,
      pagination,
      dataSource: [],
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      }
    })
  }

}
</script>
