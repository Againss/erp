<template>
  <div class="srm-main">
    <div class="button">
      <el-button
        v-permission="['srm:basicData:rankAssess:add']"
        type="primary"
        size="small"
        @click="add"
      >新建</el-button>
    </div>
    <div class="srm-content">
      <!-- 列表 -->
      <div class="page-table">
        <cs-custom-table
          tooltip-effect="dark"
          :columns="columns"
          :autoresize="false"
          :table-scrollx="true"
          :data-source="dataSource"
          :pagination="pagination"
          :operates="popOperates"
          edit-type="pop"
          highlight-current-indexrow
        />
      </div>
    </div>
    <div class="pop">
      <cs-custom-pop ref="popForm" :options="dialogTypeOfSupplierVisable" />
    </div>
  </div>
</template>
<script>
import { PublicSrm } from '@/views/srm/public/index'
import { Rating } from './components/index'
import { fetchLog } from '@/views/srm/public/fetchLog'
import SwitchStatus from '../../public/components/switch-status'
// import DisabledControls from '@/views/srm/public/components/disabled-controls.vue'
export default {
  name: 'Index',
  mixins: [Rating, PublicSrm, fetchLog],
  data() {
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const isNumber = this.$getRules({ type: 'number', trigger: ['blur'] })
    /* 表头参数信息配置 */
    const columns = [
      {
        prop: 'index',
        label: '序号',
        align: 'left',
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
        prop: 'rank',
        align: 'left',
        minWidth: 110,
        width: 110,
        label: '等级'
      },
      {
        prop: 'fractionFrom',
        label: '分数范围起',
        align: 'right',
        minWidth: 110
      },
      {
        prop: 'fractionTo',
        label: '分数范围始',
        align: 'right',
        minWidth: 110
      },
      {
        prop: 'isNotPass',
        label: '不合格判定',
        align: 'left',
        minWidth: 110,
        width: 110,
        formater: (scope) => {
          return scope.row[scope.column.property] === 1 ? '是' : '否'
        }
      },
      {
        prop: 'creatorName',
        label: '创建人',
        align: 'left',
        minWidth: 120
      },
      {
        prop: 'createdTime',
        label: '创建时间',
        align: 'left',
        width: 180,
        minWidth: 120
      },
      {
        prop: 'status',
        label: '状态',
        align: 'left',
        width: 110,
        minWidth: 110,
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
            this.disableRating({
              id: row.id,
              status: row.status
            })
          },
          permission: 'srm:basicData:rankAssess:enable' // 等级评定启/禁用
        }
        /*  formater: (scope) => {
           return scope.row[scope.column.property] === 1
             ? '启用' : '禁用'
         } */
      }
    ]

    // 表格操作栏的配置信息

    let newDataSource = [
      {
        label: '编辑',
        isShow: true,
        permitTag: ['srm:basicData:rankAssess:modify'],
        handle: (scope) => {
          this.showRatingDialog({
            data: scope.row,
            type: 'update'
          })
          this.dialogTypeOfSupplierVisable = this.editRatingPopBox
        }
      },
      {
        label: '删除',
        style: {
          color: '#FE4949'
        },
        permitTag: ['srm:basicData:rankAssess:delete'],
        isShow: true,
        handle: (params) => {
          this.$pub.confirmation({
            callback: () =>
              this.deleteRatingListById({
                id: params.row.id
              })
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
        this.getRatingList({
          pageSize: this.pagination.pageSize,
          pageNum: val
        })
      },
      sizeChange: (val) => {
        this.getRatingList({
          pageNum: this.pagination.currentPage || 1,
          pageSize: val
        })
      }
    }

    /* 编辑弹框 */
    const editRatingPopBox = {
      itemType: 'drawer',
      visible: false,
      title: '编辑',
      okText: '确定',
      ok: (params) => {
        this.updateRating(params)
      },
      cancel: (params) => {
        this.$set(this.editRatingPopBox, 'formDatas', {})
        this.$set(this.editRatingPopBox, 'visible', false)
      },
      content: [
        {
          prop: 'fractionFrom',
          itemType: 'input',
          label: '分数范围起',
          rules: [commonBlurReg, { ...isNumber, message: '只能输入正整数！' }]
        },
        {
          prop: 'fractionTo',
          itemType: 'input',
          label: '分数范围始',
          rules: [commonBlurReg, { ...isNumber, message: '只能输入正整数！' }]
        },
        {
          prop: 'rank',
          itemType: 'select',
          label: '等级',
          dataSource: [
            {
              value: 'A',
              label: 'A'
            },
            {
              value: 'B',
              label: 'B'
            },
            {
              value: 'C',
              label: 'C'
            },
            {
              value: 'D',
              label: 'D'
            },
            {
              value: 'E',
              label: 'E'
            },
            {
              value: 'F',
              label: 'F'
            },
            {
              value: 'G',
              label: 'G'
            },
            {
              value: 'H',
              label: 'H'
            },
            {
              value: 'I',
              label: 'I'
            },
            {
              value: 'J',
              label: 'J'
            },
            {
              value: 'K',
              label: 'K'
            },
            {
              value: 'L',
              label: 'L'
            },
            {
              value: 'M',
              label: 'M'
            },
            {
              value: 'N',
              label: 'N'
            },
            {
              value: 'O',
              label: 'O'
            },
            {
              value: 'P',
              label: 'P'
            },
            {
              value: 'Q',
              label: 'Q'
            },
            {
              value: 'R',
              label: 'R'
            },
            {
              value: 'S',
              label: 'S'
            },
            {
              value: 'T',
              label: 'T'
            },
            {
              value: 'U',
              label: 'U'
            },
            {
              value: 'V',
              label: 'V'
            },
            {
              value: 'W',
              label: 'W'
            },
            {
              value: 'X',
              label: 'X'
            },
            {
              value: 'y',
              label: 'y'
            },
            {
              value: 'Z',
              label: 'Z'
            }
          ],
          rules: [{ ...commonBlurReg, trigger: ['blur', 'change'] }]
        },
        {
          prop: 'isNotPass',
          itemType: 'switch',
          activeValue: 1,
          inactiveValue: 0,
          label: '不合格判定:'
        }
      ]
    }

    /* 新增弹框 */
    const addRatingVisible = {
      itemType: 'drawer',
      visible: false,
      title: '新增',
      okText: '确定',
      ok: (params) => {
        this.insertRating(params)
      },
      cancel: (params) => {
        this.$set(this.addRatingVisible, 'visible', false)
      },
      content: [
        {
          prop: 'fractionFrom',
          itemType: 'input',
          label: '分数范围起',
          rules: [commonBlurReg, { ...isNumber, message: '只能输入正整数！' }]
        },
        {
          prop: 'fractionTo',
          itemType: 'input',
          label: '分数范围始',
          rules: [commonBlurReg, { ...isNumber, message: '只能输入正整数！' }]
        },
        {
          prop: 'rank',
          itemType: 'select',
          label: '等级',
          dataSource: [
            {
              value: 'A',
              label: 'A'
            },
            {
              value: 'B',
              label: 'B'
            },
            {
              value: 'C',
              label: 'C'
            },
            {
              value: 'D',
              label: 'D'
            },
            {
              value: 'E',
              label: 'E'
            },
            {
              value: 'F',
              label: 'F'
            },
            {
              value: 'G',
              label: 'G'
            },
            {
              value: 'H',
              label: 'H'
            },
            {
              value: 'I',
              label: 'I'
            },
            {
              value: 'J',
              label: 'J'
            },
            {
              value: 'K',
              label: 'K'
            },
            {
              value: 'L',
              label: 'L'
            },
            {
              value: 'M',
              label: 'M'
            },
            {
              value: 'N',
              label: 'N'
            },
            {
              value: 'O',
              label: 'O'
            },
            {
              value: 'P',
              label: 'P'
            },
            {
              value: 'Q',
              label: 'Q'
            },
            {
              value: 'R',
              label: 'R'
            },
            {
              value: 'S',
              label: 'S'
            },
            {
              value: 'T',
              label: 'T'
            },
            {
              value: 'U',
              label: 'U'
            },
            {
              value: 'V',
              label: 'V'
            },
            {
              value: 'W',
              label: 'W'
            },
            {
              value: 'X',
              label: 'X'
            },
            {
              value: 'Y',
              label: 'Y'
            },
            {
              value: 'Z',
              label: 'Z'
            }
          ],
          rules: [{ ...commonBlurReg, trigger: ['blur', 'change'] }]
        },
        {
          prop: 'isNotPass',
          itemType: 'switch',
          activeValue: 1,
          inactiveValue: 0,
          label: '不合格判定:'
        }
      ]
    }

    return {
      loading: false,
      dialogType: 'insert',
      columns,
      popOperates,
      pagination,
      dataSource: [],
      editRatingPopBox,
      addRatingVisible,
      formOtions: {
        layout: true,
        inline: true,
        size: 'small'
      },
      rowCopy: null,
      dialogTypeOfSupplierVisable: {}
    }
  },
  methods: {
    add() {
      this.showRatingDialog({ type: 'insert' })
      this.dialogTypeOfSupplierVisable = this.addRatingVisible
    }
  }
}
</script>
