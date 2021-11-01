<template>
  <div id="ProductionScheduleWarning" class="list">
    <div class="button clearfix">
      <el-button
        v-if="$permission(['baseData:pdProductionScheduleWarn:add'])"
        size="small"
        type="primary"
        class="fr"
        @click="addhandle"
      >新增</el-button>
    </div>
    <div class="page-table">
      <cs-custom-table
        :table-scrollx="true"
        :columns="columns"
        :data-source="dataSource"
        :operates="popOperates"
      />
    </div>
    <!-- 弹框 -->
    <cs-custom-pop :options="editOptions" />
  </div>
</template>

<script>
import * as api from './api/index.js'
export default {
  data() {
    const inputFilter = (val) => {
      val = val.replace(/[^\d]/g, '') // 清除“数字”和“.”以外的字符
      if (val.indexOf('.') < 0 && val !== '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        val = parseFloat(val)
      }
      return val
    }
    const validateNumber = (rule, value, callback) => {
      var msg = ''
      const fun = (goFun) => {
        if (!value) {
          callback(new Error(`请输入${msg}`))
          // ^[1-9]*$
        } else if (!/^[1-9]\d{0,9}?$/.test(value)) {
          callback(new Error('请输入正整数'))
        } else {
          goFun()
        }
      }
      if (rule.field === 'distanceDeliveryDay') {
        // 距离交付天数
        msg = '距离交付天数'
        var go = () => {
          if (value >= 100) {
            callback(new Error('请输入2位以下正整数'))
          }
        }
        fun(go)
      } else {
        // 进度下限(%)
        msg = '进度下限(%)'
        var go1 = () => {
          if (value >= 1000) {
            callback(new Error('请输入3位以下正整数'))
          }
        }
        fun(go1)
      }

      callback()
    }
    const flowconfig = [
      { label: '染纱', value: 'Y' },
      { label: '织布', value: 'K' },
      { label: '染整', value: 'D' },
      { label: '印花', value: 'P' },
      { label: '采购', value: 'B' }
    ]
    const columns = {
      _index: {
        label: '序号',
        fixed: 'left',
        formater: (scope) => {
          return scope.$index + 1
        }
      },
      _processFlow: {
        prop: 'processFlow',
        label: '工序流程',
        minWidth: 140,
        showOverflowTooltip: true,
        formater: (scope) => {
          const i = flowconfig.findIndex(
            (n) => n.value === scope.row.processFlow
          )
          if (i !== -1) {
            return flowconfig[i].label
          }
          return '-'
        }
      },
      _distanceDeliveryDay: {
        prop: 'distanceDeliveryDay',
        label: '距离交付天数',
        minWidth: 140,
        align: 'right',
        showOverflowTooltip: true
      },
      _rateLimit: {
        prop: 'rateLimit',
        label: '进度下限(%)',
        minWidth: 140,
        align: 'right',
        showOverflowTooltip: true
      },
      _createdTime: {
        prop: 'createdTime',
        label: '创建时间',
        minWidth: 200,
        align: 'center',
        showOverflowTooltip: true,
        formater: (scope) => {
          return this.$utils.parseTime(scope.row.createdTime)
        }
      },
      _createdByName: {
        prop: 'createdByName',
        label: '创建人员',
        minWidth: 200,
        showOverflowTooltip: true
      }
    }
    const editOptions = {
      itemType: 'drawer',
      visible: false,
      title: '编辑生产进度预警配置',
      okText: '保 存',
      size: '470px',
      formDatas: {},
      formOptions: {
        syncDataHandle: (c) => {
          this.formResult = this.$utils.deepClone(c)
        }
      },
      ok: () => {
        // 同一生产工序有且只能有一条记录；
        // 若新增的生产工序已存在，那么给出系统提示“已存在相同的工序流程，不能重复添加”，且不能保存成功；
        if (this.type === 'new') {
          this.add()
        } else {
          this.edit()
        }
      },
      cancel: () => {
        this.editOptions.visible = false
      },
      close: () => {
        this.editOptions.visible = false
      },
      content: {
        _index: {
          prop: 'index',
          // itemType: 'itemview',
          itemType: 'input',
          label: '序号',
          disabled: true,
          isShow: () => {
            return this.type === 'edit'
          }
        },
        _processFlow: {
          prop: 'processFlow',
          itemType: 'select',
          dataSource: flowconfig,
          label: '工序流程',
          placeholder: '请选择工序流程',
          rules: [
            { required: true, message: '请选择工序流程', trigger: 'change' }
          ],
          clearable: true
        },
        _distanceDeliveryDay: {
          prop: 'distanceDeliveryDay',
          itemType: 'input',
          label: '距离交付天数',
          placeholder: '请输入距离交付天数',
          // 正整数，允许输入最大位数为2
          rules: [
            {
              required: true,
              validator: validateNumber,
              trigger: 'change'
            }
          ],
          clearable: true,
          trim: (val) => {
            return inputFilter(val)
          }
        },
        _rateLimit: {
          prop: 'rateLimit',
          itemType: 'input',
          label: '进度下限(%)',
          placeholder: '请输入进度下限',
          // 正整数，允许输入最大位数为3，必填项，
          rules: [
            {
              required: true,
              trigger: 'change',
              validator: validateNumber
            }
          ],
          clearable: true,
          trim: (val) => {
            return inputFilter(val)
          }
        }
      }
    }
    const popOperates = {
      label: '操作',
      width: 140,
      fixed: 'right',
      dataSource: [
        {
          label: '编辑',
          // permitTag: ,
          isShow: (scope) => {
            return true && this.$permission(['baseData:pdProductionScheduleWarn:modify'])
          },
          handle: (scope) => {
            this.type = 'edit'
            this.editOptions.title = '编辑生产进度预警配置'
            scope.row.index = scope.$index + 1
            this.formOrigin = scope.row
            this.editOptions.formDatas = this.$utils.deepClone(scope.row)
            this.editOptions.visible = true
          }
        }
      ]
    }
    return {
      formResult: {},
      type: undefined,
      columns,
      popOperates,
      dataSource: [],
      editOptions,
      flowconfig,
      formOrigin: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await api.list({})
      if (res.code === 200) {
        this.dataSource = res.data && res.data.list ? res.data.list : []
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    addhandle() {
      this.type = 'new'
      this.editOptions.title = '新增生产进度预警配置'
      this.editOptions.formDatas = {}
      this.editOptions.visible = true
    },
    async add() {
      const res = await api.add(this.formResult)
      this.$message({
        message: res.code === 200 ? '新增成功' : res.message,
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.editOptions.visible = false
        this.getList()
        this.$store.dispatch('app/fetchParamsLog', {
          opratorType: 'INSERT',
          api: '/processingMgr/pdProductionScheduleWarn/add',
          description: {
            beforeText: `在'基础数据-生产进度预警配置中'新增一条配置信息`,
            beforeCode: this.formResult
          },
          appId: 'basis'
        })
      }
    },
    async edit() {
      const c = {
        processFlow: this.formResult.processFlow,
        distanceDeliveryDay: this.formResult.distanceDeliveryDay,
        rateLimit: this.formResult.rateLimit,
        id: this.formResult.id
      }
      const res = await api.edit(c)
      this.$message({
        message: res.code === 200 ? '编辑成功' : res.message,
        type: res.code === 200 ? 'success' : 'error'
      })
      if (res.code === 200) {
        this.editOptions.visible = false
        this.getList()
        const { beforeCode, afterCode } = this.$utils.compareData(
          this.formOrigin,
          c,
          'id'
        )
        this.$store.dispatch('app/fetchParamsLog', {
          c,
          opratorType: 'UPDATE',
          api: '/processingMgr/pdProductionScheduleWarn/modify',
          description: {
            beforeText: `在基础数据-生产进度预警配置中'将${JSON.stringify({
              id: c.id
            })}`,
            afterText: afterCode,
            beforeCode,
            afterCode
          },
          appId: 'basis'
        })
      }
    }
  }
}
</script>

<style  lang='scss'>
@import "@/styles/base.scss";
#ProductionScheduleWarning {
  .el-table th.is-leaf {
    z-index: 4;
  }
}
</style>
