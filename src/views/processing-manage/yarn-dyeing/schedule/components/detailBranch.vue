<template>
  <div id="YarnScheduleDetailBranch" class="YarnScheduleDetailBranch">
    <div class="title clearfix">
      进度更新(单号：{{ orderId }})
      <el-button
        v-if="$permission(['pd:pdDyeingProductionSchedule:detail:add'])"
        v-show="status === 'N'"
        class="button_title sub-main"
        size="mini"
        @click="addhandle"
      >{{ `新增缸号` }}</el-button>
    </div>
    <div class="detail warptable">
      <cs-custom-table
        :key="status"
        :highlight-current-row="true"
        :table-scrollx="true"
        :row-style="{ cursor: 'pointer' }"
        :columns="columns"
        :data-source="dataSource"
        :operates="status === 'N' ? popOperates : null"
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
    orderId: {
      // 染纱单号
      type: String
    },
    status: {
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
        width: 50,
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _batchNo: {
        prop: 'batchNo',
        label: '缸号',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _castVatPkg: {
        prop: 'castVatPkg',
        label: '投缸件数',
        minWidth: 140,
        align: 'right',
        showOverflowTooltip: true
      },
      _castVatQty: {
        prop: 'castVatQty',
        label: '投缸数量(KG)',
        minWidth: 140,
        align: 'right',
        showOverflowTooltip: true
      },
      _yarnPkg: {
        prop: 'yarnPkg',
        label: '色纱件数',
        minWidth: 140,
        align: 'right',
        showOverflowTooltip: true
      },
      _yarnQty: {
        prop: 'yarnQty',
        label: '色纱数量(KG)',
        minWidth: 140,
        align: 'right',
        showOverflowTooltip: true
      },
      _status: {
        prop: 'status',
        label: '当前状态',
        minWidth: 140,
        showOverflowTooltip: true
      },
      _updatedTime: {
        prop: 'updatedTime',
        label: '更新日期',
        minWidth: 140,
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$utils.parseTime(scope.row.updatedTime, '{y}-{m}-{d}')
        }
      },
      _updatedByName: {
        prop: 'updatedByName',
        label: '更新人员',
        minWidth: 140,
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
        if (this.formResult.status === '已完成') {
          // 则色纱数量必须大于0，否则不能提交并界面弹出提示：“缸号未录入色纱数量，不能完成”
          if (!(this.formResult.yarnQty && this.formResult.yarnQty > 0)) {
            this.$message({
              message: '缸号未录入色纱数量，不能完成',
              type: 'error'
            })
            return
          }
          this.$confirm(
            '已完成的缸号进度将不允许再编辑，确定当前缸号生产已完成？',
            '提示',
            {
              type: 'warning',
              distinguishCancelAndClose: true,
              center: true
            }
          )
            .then(() => {
              this.type === 'new' ? this.add() : this.edit()
            })
            .catch((action) => {
              this.updateOptions.formDatas.status = undefined
              return
            })
        } else {
          this.type === 'new' ? this.add() : this.edit()
        }
      },
      cancel: () => {
        this.updateOptions.visible = false
      },
      close: () => {
        this.updateOptions.visible = false
      },
      content: {
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
          label: '投缸件数',
          placeholder: '请输入投缸件数',
          clearable: true,
          disabled: false,
          // 大于0的正整数，非必填项，可编辑。
          trim: (val) => {
            var i = integerFilter(val)
            if (i === 0) {
              return ''
            }
            return i
          }
        },
        _castVatQty: {
          prop: 'castVatQty',
          itemType: 'input',
          label: '投缸数量(KG)',
          placeholder: '请输入投缸数量',
          clearable: true,
          disabled: false,
          // 大于0的浮点数，最大允许4位数，保留两位小数，必填项，可编辑
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请输入大于0投缸数量'))
                } else if (value === 0 || value === '0') {
                  callback(new Error('请输入大于0的投缸数量'))
                } else if (value >= 10000) {
                  callback(new Error('请输入小于10000的投缸数量'))
                }
                callback()
              }
            }
          ],
          trim: (val) => {
            return inputFilter(val, 2)
          }
        },
        _yarnPkg: {
          prop: 'yarnPkg',
          itemType: 'input',
          label: '色纱件数',
          placeholder: '请输入色纱件数',
          clearable: true,
          disabled: false,
          // 允许输入0或大于0的正整数，非必填项，可编辑。
          trim: (val) => {
            return integerFilter(val)
          }
        },
        _yarnQty: {
          prop: 'yarnQty',
          itemType: 'input',
          label: '色纱数量(KG)',
          placeholder: '请输入色纱数量',
          clearable: true,
          disabled: false,
          // 允许输入0或大于0的浮点数，最大允许4位数，保留两位小数，可编辑
          rules: [
            {
              required: false,
              validator: (rule, value, callback) => {
                if (value && value >= 10000) {
                  callback(new Error('请输入小于10000的投缸数量'))
                }
                callback()
              }
            }
          ],
          trim: (val) => {
            return inputFilter(val, 2)
          }
        },
        _status: {
          prop: 'status',
          itemType: 'select',
          label: '当前状态',
          placeholder: '请选择当前状态',
          dataSource: [],
          clearable: true,
          disabled: false,
          filterable: true
          // 数据来源于基础数据-生产状态列表里，类型为染纱，状态为启用的所有生产状态中文名称，下拉列表支持输入模糊查询
        }
      }
    }
    const popOperates = {
      label: '操作',
      width: '160',
      fixed: 'right',
      dataSource: [
        {
          label: '编辑',
          // permitTag: [''],
          isShow: (scope) => {
            return (
              scope.row.status !== '已完成' &&
              this.$permission(['pd:pdDyeingProductionSchedule:detail:modify'])
            )
          },
          handle: (scope) => {
            // （1）若色纱数量>0，则不允许删除这条缸号进度记录，并且不允许修改缸号、投缸件数、投缸数量字段，允许修改当前进度、色纱件数、色纱数量字段；
            // （2）若色纱数量等于0或为空，则允许删除这条缸号进度记录，允许修改缸号、投缸件数、投缸数量以及其他可编辑的字段；
            // _batchNo  _castVatPkg _castVatQty
            // _yarnPkg  _yarnQty  _status
            const arr = ['_batchNo', '_castVatPkg', '_castVatQty']
            arr.map((o) => {
              this.updateOptions.content[o].disabled =
                (scope.row.yarnQty && scope.row.yarnQty > 0) ||
                scope.row.status === '已完成'
            })
            const arr1 = ['_yarnPkg', '_yarnQty', '_status']
            arr1.map((o) => {
              this.updateOptions.content[o].disabled =
                scope.row.status === '已完成'
            })
            this.type = 'edit'
            this.getStatus()
            this.formOrigin = scope.row
            this.updateOptions.formDatas = this.$utils.deepClone(scope.row)
            this.updateOptions.visible = true
          }
        },
        {
          label: '删除',
          // permitTag: [''],
          isShow: (scope) => {
            return (
              !(scope.row.yarnQty && scope.row.yarnQty > 0) &&
              this.$permission(['pd:pdDyeingProductionSchedule:detail:delete'])
            )
          },
          style: {
            color: '#FF4444 '
          },
          handle: (scope) => {
            this.$confirm('确定要删除该数据吗', '提示', {
              type: 'warning'
            })
              .then(() => {
                this.del(scope.row.productionScheduleDetailId, scope.row)
              })
              .catch(() => {})
          }
        }
      ]
    }
    return {
      formOrigin: null,
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
        console.log(res, 'res')
        this.dataSource = this.$utils.deepClone(res) || []
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    async getStatus() {
      const res = await produceStates({ typical: 'DY' })
      res.data &&
        res.data.length &&
        res.data.map((i) => {
          i.value = i.name
          i.label = i.name
        })
      this.updateOptions.content._status.dataSource = res.data || []
    },
    addhandle() {
      const arr = [
        '_batchNo',
        '_castVatPkg',
        '_castVatQty',
        '_yarnPkg',
        '_yarnQty',
        '_status'
      ]
      arr.map((o) => {
        this.updateOptions.content[o].disabled = false
      })
      this.type = 'new'
      this.updateOptions.formDatas = {}
      this.getStatus()
      this.updateOptions.visible = true
    },
    async add() {
      const f = {
        productionScheduleId: this.productionScheduleId,
        batchNo: this.formResult.batchNo,
        castVatPkg: this.formResult.castVatPkg,
        castVatQty: this.formResult.castVatQty,
        yarnPkg: this.formResult.yarnPkg,
        yarnQty: this.formResult.yarnQty,
        status: this.formResult.status
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
          api: '/processingMgr/pdDyeingProductionSchedule/detail/add',
          description: {
            beforeText: `在'加工管理-染纱-染纱生产进度-染纱进度单号${this.productionScheduleId}中'新增一条缸号信息`,
            beforeCode: f
          },
          appId: 'processingMgr'
        })
      } else {
        this.errMsg(res)
      }
    },
    async edit() {
      const f = {
        productionScheduleDetailId: this.formResult.productionScheduleDetailId,
        productionScheduleId: this.productionScheduleId,
        batchNo: this.formResult.batchNo,
        castVatPkg: this.formResult.castVatPkg,
        castVatQty: this.formResult.castVatQty,
        yarnPkg: this.formResult.yarnPkg,
        yarnQty: this.formResult.yarnQty,
        status: this.formResult.status
      }
      const res = await api.edit(f)
      if (res.code === 200) {
        this.updateOptions.visible = false
        this.$emit('update')
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        const { beforeCode, afterCode } = this.$utils.compareData(
          this.formOrigin,
          f,
          'id'
        )
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'UPDATE',
          api: '/processingMgr/pdDyeingProductionSchedule/detail/modify',
          description: {
            beforeText: `在'加工管理-染纱-染纱生产进度-染纱进度单号${this.productionScheduleId}中'
            编辑缸号${f.batchNo}信息`,
            afterText: afterCode,
            beforeCode,
            afterCode
          },
          appId: 'processingMgr'
        })
      } else {
        this.errMsg(res)
      }
    },
    async del(productionScheduleDetailId, o) {
      const res = await api.del({
        productionScheduleDetailId: productionScheduleDetailId,
        productionScheduleId: this.productionScheduleId
      })
      if (res.code === 200) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.$emit('update')
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'DEL',
          api: '/processingMgr/pdDyeingProductionSchedule/detail/delete',
          description: {
            beforeText: `在'加工管理-染纱-染纱生产进度-染纱进度单号${this.productionScheduleId}中'
           删除一条缸号`,
            beforeCode: { batchNo: o.batchNo }
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
.YarnScheduleDetailBranch {
  .warptable {
    padding: 0 10px 10px;
    background: #fff;
  }
  .title {
    // border-bottom: 1px solid #e9eff2;
    background: #fff;
    font-size: 18px;
    color: #15112b;
    font-weight: 400;
    height: 65px;
    line-height: 65px;
    padding-left: 20px;
    .button_title {
      font-size: 14px;
      float: right;
      margin-top: 15px;
      margin-right: 20px;
    }
  }
  /deep/.el-form-item__label-wrap .el-form-item__label {
    color: #474747;
  }
}
</style>
