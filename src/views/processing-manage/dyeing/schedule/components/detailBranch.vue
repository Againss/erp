<template>
  <div id="dyeScheduleDetailBranch" class="dyeScheduleDetailBranch">
    <div class="title clearfix">
      进度更新(单号：{{ orderId }})
      <el-button
        v-if="dataStatus === 'N' && $permission(['pd:pdDyeProductionSchedule:detail:add'])"
        class="button_title sub-main"
        size="mini"
        @click="addhandle"
      >新增缸号</el-button>
    </div>
    <div class="detail warptable">
      <cs-custom-table
        :key="dataStatus"
        :highlight-current-row="true"
        :table-scrollx="true"
        :row-style="{ cursor: 'pointer' }"
        :columns="columns"
        :data-source="dataSource"
        :operates="dataStatus === 'N' ? popOperates : null"
        @row-click="rowClick"
      />
    </div>
    <!-- 弹框 -->
    <cs-custom-pop v-if="updateOptions.visible" :options="updateOptions" />
  </div>
</template>

<script>
import * as api from '../api/index.js'
import {
  integerFilter,
  inputFilter
} from '@/views/processing-manage/public/index.js'
import { produceStates } from '@/views/processing-manage/public/api/index.js'
export default {
  name: 'DetailBranch',
  components: {},
  props: {
    detailData: {
      type: Array
    },
    productionScheduleId: {
      type: String
    },
    dataStatus: {
      type: String
    },
    orderId: {
      // 单号
      type: String
    }
  },
  data() {
    const errMsg = (res) => {
      this.$message({
        message: res.message,
        type: 'error'
      })
    }
    const columns = {
      _index: {
        label: '序号',
        width: '60',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _headVat: {
        prop: 'headVat',
        label: '头缸',
        minWidth: 60,
        showOverflowTooltip: true
      },
      _batchNo: {
        prop: 'batchNo',
        label: '缸号',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _castVatPkg: {
        prop: 'castVatPkg',
        label: '投缸卷数',
        align: 'right',
        minWidth: 100,
        showOverflowTooltip: true
      },
      _castVatQty: {
        prop: 'castVatQty',
        align: 'right',
        label: '投缸数量(KG)',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _finishedPkg: {
        prop: 'finishedPkg',
        label: '成品卷数',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _finishedQty: {
        prop: 'finishedQty',
        label: '成品数量(KG)',
        align: 'right',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _status: {
        prop: 'status',
        label: '当前状态',
        minWidth: 120,
        showOverflowTooltip: true
      },
      _updatedTime: {
        prop: 'updatedTime',
        label: '更新日期',
        minWidth: 120,
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$utils.parseTime(scope.row.updatedTime, '{y}-{m}-{d}')
        }
      },
      _updatedBy: {
        prop: 'updatedBy',
        label: '更新人员',
        minWidth: 120,
        showOverflowTooltip: true
      }
    }
    const updateOptions = {
      itemType: 'drawer',
      visible: false,
      title: '进度更新',
      size: '468px',
      okText: '保 存',
      formDatas: {},
      formOptions: {
        syncDataHandle: (c) => {
          this.formResult = this.$utils.deepClone(c)
        }
      },
      ok: () => {
        if (this.type === 'new') {
          this.add()
        } else {
          this.edit()
        }
      },
      cancel: () => {
        this.updateOptions.visible = false
      },
      close: () => {
        this.updateOptions.visible = false
      },
      content: {
        _headVat: {
          prop: 'headVat',
          itemType: 'select',
          label: '头缸',
          placeholder: '请选择头缸',
          valueKey: 'value',
          valueType: 'object',
          disabled: false,
          dataSource: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0,
              default: true
            }
          ],
          clearable: true

        },
        _batchNo: {
          prop: 'batchNo',
          itemType: 'input',
          label: '缸号',
          placeholder: '请输入缸号',
          clearable: true,
          disabled: false,
          // 字符串，允许最大字符为20，必填项。
          rules: [
            {
              required: true,
              message: '请输入小于20字符的缸号',
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error(''))
                } else if (!new RegExp(/^.{1,20}$/).test(value)) {
                  callback(new Error(''))
                }
                callback()
              }
            }
          ]
        },
        _castVatPkg: {
          prop: 'castVatPkg',
          itemType: 'input',
          label: '投缸卷数',
          disabled: false,
          placeholder: '请输入投缸件数',
          clearable: true,
          // 大于0的正整数，非必填项，可编辑。
          trim: (val) => {
            var i = integerFilter(val)
            if (i === 0) {
              return ''
            }
            return i
          },
          rules: [
            {
              required: false,
              validator: (rule, value, callback) => {
                if (value && value >= 100) {
                  callback(new Error('投缸卷数最大为两位数的正整数'))
                }
                callback()
              }
            }
          ]
        },
        _castVatQty: {
          prop: 'castVatQty',
          itemType: 'input',
          label: '投缸数量(KG)',
          placeholder: '请输入投缸数量',
          disabled: false,
          clearable: true,
          // 允许输入0或大于0的浮点数，最大允许4位数，保留两位小数，可编辑
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value || isNaN(value)) {
                  callback(new Error('请输入投缸数量'))
                } else if ((value && value >= 10000) || value < 0.01) {
                  callback(new Error('请输入大于0且小于10000的投缸数量'))
                }
                callback()
              }
            }
          ],
          // rules: [
          //   {
          //     required: true,
          //     message: '请正确输入投缸数量',
          //     validator: (rule, value, callback) => {
          //       if (value && value >= 10000) {
          //         callback(new Error('请输入小于10000的投缸数量'))
          //       }
          //       callback()
          //     }
          //   }
          // ],
          trim: (val) => {
            return inputFilter(val, 2)
          }
        },
        _status: {
          prop: 'status',
          itemType: 'select',
          label: '当前状态',
          placeholder: '请选择当前状态',
          disabled: false,
          dataSource: [],
          clearable: true,
          valueKey: 'value',
          valueType: 'object'
        }
      }
    }
    const popOperates = {
      label: '操作',
      width: '140',
      fixed: 'right',
      dataSource: [
        {
          label: '编辑',
          // permitTag: [''],
          isShow: (scope) => {
            return this.dataStatus === 'N' && this.$permission(['pd:pdDyeProductionSchedule:detail:modify'])
          },
          handle: (scope) => {
            console.log(scope, 'scope')
            // （1）若缸号记录对应的成品数量大于0，则不能修改投缸数量及卷数，只能修改【当前状态】字段；且不能删除对应的缸号记录；
            // （2）若缸号对应的当前状态变更为【已完成】，提交后且不可以再修改任何信息（除了当前状态字段）；同时【当前状态】字段下拉列表值只显示已完成、重磅；
            const arr = ['_headVat', '_batchNo', '_castVatPkg', '_castVatQty']
            arr.map((o) => {
              this.updateOptions.content[o].disabled =
                (scope.row.finishedQty && scope.row.finishedQty > 0) ||
                scope.row.status === '已完成'
            })
            this.type = 'edit'
            this.updateOptions.formDatas = this.$utils.deepClone(scope.row)
            this.updateOptions.visible = true
            this.getStatus()
          }
        },
        {
          label: '删除',
          // permitTag: [''],
          isShow: (scope) => {
            return !(scope.row.finishedQty && scope.row.finishedQty > 0) && this.$permission(['pd:pdDyeProductionSchedule:detail:delete'])
          },
          style: {
            color: '#FF4444 '
          },
          handle: (scope) => {
            this.$confirm('确认删除当前数据吗？', '提示', {
              type: 'warning',
              cancelButtonClass: 'btn-cancel'
            })
              .then(() => {
                this.del(scope.row.uuid, scope.row.batchNo)
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
    }
    return {
      formResult: {},
      type: undefined,
      errMsg,
      popOperates,
      updateOptions,
      columns,
      dataSource: []
    }
  },
  watch: {
    detailData: {
      handler(res) {
        this.dataSource = this.$utils.deepClone(res) || []
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  methods: {
    // 获取当前状态
    async getStatus() {
      console.log(this.updateOptions.formDatas, 'this.updateOptions.formDatas')
      const res = await produceStates({ typical: 'DC' })
      res.data &&
        res.data.length &&
        res.data.map((i) => {
          i.value = i.nameEn
          i.label = i.name
        })
      let arr = this.$utils.deepClone(res.data)
      if (this.updateOptions.formDatas.status === '已完成') {
        // 当状态是已完成时，当前状态只有重磅和已完成选项
        arr = arr.filter(function(item) {
          return item.name === '重磅' || item.name === '已完成'
        })
      } else {
        // 删除重磅选项
        arr = arr.filter(function(item) {
          return item.name !== '重磅'
        })
      }
      this.updateOptions.content._status.dataSource = arr
    },
    addhandle() {
      this.type = 'new'
      this.updateOptions.formDatas = {}
      var obj = {}
      obj.label = '否'
      obj.value = 0
      this.updateOptions.formDatas.headVat = obj
      const arr = ['_headVat', '_batchNo', '_castVatPkg', '_castVatQty']
      arr.map((o) => {
        this.updateOptions.content[o].disabled = false
      })
      this.getStatus()
      this.updateOptions.visible = true
    },
    async add() {
      const f = {
        dyeProductionScheduleId: this.productionScheduleId,
        batchNo: this.formResult.batchNo, // 缸号
        headVat: this.formResult.headVat ? this.formResult.headVat.label : '', // 头缸
        castVatPkg: this.formResult.castVatPkg, // 投缸卷数
        castVatQty: this.formResult.castVatQty, // 投缸数量
        status: this.formResult.status && this.formResult.status.label || ''
      }
      const res = await api.add(f)
      if (res.code === 200) {
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.updateOptions.visible = false
        this.$emit('update')
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'INSERT',
          api: '/processingMgr/pdDyeProductionScheduleDetail/add',
          description: {
            beforeText: `在'加工管理-染整-染整生产进度-染整进度单号${this.productionScheduleId}中'新增一条缸号信息`,
            beforeCode: f
          },
          appId: 'processingMgr'
        })
      } else {
        this.errMsg(res)
      }
    },
    async edit() {
      console.log(this.formResult, 'this.formResultthis.formResult')
      const f = {
        uuid: this.formResult.uuid,
        dyeProductionScheduleId: this.productionScheduleId,
        batchNo: this.formResult.batchNo, // 缸号
        headVat: this.formResult.headVat && this.formResult.headVat.label ? this.formResult.headVat.label : this.formResult.headVat,
        castVatPkg: this.formResult.castVatPkg, // 投缸卷数
        castVatQty: this.formResult.castVatQty, // 投缸数量
        status: this.formResult.status && this.formResult.status.label ? this.formResult.status.label : this.formResult.status
      }
      console.log(f, 'fffffffffff')
      const res = await api.edit(f)
      if (res.code === 200) {
        this.updateOptions.visible = false
        this.$emit('update')
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdDyeProductionScheduleDetail/submit',
          description: {
            beforeText: `在'加工管理-染整-染整生产进度-染整进度单号${this.productionScheduleId}中'编辑缸号${this.formResult.batchNo}信息`,
            beforeCode: { f }
          },
          appId: 'processingMgr'
        })
        // const { beforeCode, afterCode } = this.$utils.compareData(
        //   this.formOrigin,
        //   f,
        //   'id'
        // )
        // this.$store.dispatch('app/fetchParamsLog', {
        //   opratorType: 'UPDATE',
        //   api: '/processingMgr/pdDyeProductionScheduleDetail/submit',
        //   description: {
        //     beforeText: `在'加工管理-染整-染整生产进度-染整进度单号${this.productionScheduleId}中'
        //     编辑缸号${this.formResult.batchNo}信息`,
        //     afterText: afterCode,
        //     beforeCode,
        //     afterCode
        //   },
        //   appId: 'processingMgr'
        // })
      } else {
        this.errMsg(res)
      }
    },
    async del(uuid, batchNo) {
      const res = await api.del({
        uuid: uuid
      })
      if (res.code === 200) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.$emit('update')
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'DEL',
          api: '/processingMgr/pdDyeProductionScheduleDetail/delete',
          description: {
            beforeText: `在'加工管理-染整-染整生产进度-染整进度单号${uuid}中'
           删除一条缸号`,
            beforeCode: { batchNo: batchNo }
          },
          appId: 'processingMgr'
        })
      } else {
        this.errMsg(res)
      }
    },
    rowClick() {}
  }
}
</script>

<style  lang="scss" scoped>
.dyeScheduleDetailBranch {
  .warptable {
    padding: 10px;
    padding-top: 0;
    background: #fff;
  }
  .title {
    // border-bottom: 1px solid #e9eff2;
    background: #fff;
    font-size: 18px;
    color: #15112b;
    height: 65px;
    line-height: 65px;
    padding-left: 20px;
    .button_title {
      float: right;
      margin-top: 15px;
      margin-right: 20px;
    }
  }
}
// /deep/.el-table__header-wrapper {
//   position: relative !important;
//   width: 100% !important;
//   top: 0 !important;
//   left: 0 !important;
// }
/deep/.el-table__fixed-right {
  height: auto !important;
}
/deep/.el-table__fixed-right {
  bottom: 0;
}
/deep/.el-table__body tr.current-row > td {
  background-color: #fff !important;
  height: 50px;
}
/deep/.el-form-item__label-wrap .el-form-item__label {
  color: #474747;
}
</style>
