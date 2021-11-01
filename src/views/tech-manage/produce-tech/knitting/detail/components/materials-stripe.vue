<template>
  <div class="table-item">
    <div class="header-top">
      <span>用料实测</span>
      <!-- <el-button v-if="isEdit === 'edit'" type="primary" size="mini" @click="addClick">新增</el-button> -->
    </div>
    <div class="page-table">
      <cs-custom-table
        ref="meterialsTable"
        tooltip-effect="dark"
        :header-cell-style="headerCellStyle"
        :columns="columns"
        :data-source="dataSource"
        :operates="operates"
        edit-type="pop"
      />
    </div>
    <!-- 用料实测侧边抽屉 -->
    <div class="pop">
      <cs-custom-pop ref="pop" :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { getIngredient, getIngredientZh } from '../api/index.js'
export default {
  name: 'MaterialsStripe',
  props: {
    isEdit: {
      type: String
    },
    dataSources: {
      type: Array
    }
  },
  data() {
    const headerCellStyle = {
      'background': '#F5F7FA'
    }
    const checkNum = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      if (value && (!reg.test(value) || parseFloat(value) > 100 || parseFloat(value) === 0)) {
        return callback(new Error('0.01~100.00'))
      } else {
        callback()
      }
    }
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const columns = [
      {
        prop: 'yarn',
        label: '纱支/细度',
        showOverflowTooltip: true
      },
      {
        prop: 'element',
        label: '成份',
        showOverflowTooltip: true,
        formater: scope => scope.row[scope.column.property] && scope.row[scope.column.property].label || ''
      },
      {
        prop: 'materiaYarnRate',
        label: '实测纱比%',
        showOverflowTooltip: true
      },
      {
        prop: 'theoryYarnRate',
        label: '理论纱比%',
        showOverflowTooltip: true
      },
      {
        prop: 'stripeSpacing',
        label: '条纹间距',
        showOverflowTooltip: true
      },
      {
        prop: 'color',
        label: '颜色',
        showOverflowTooltip: true
      }
    ]
    const operatesData = [
      {
        label: '编辑',
        isShow: true,
        handle: scope => {
          this.getIngredient()
          this.index = scope.$index
          this.optionStatus = 'edit'
          this.popHandle('编辑用料实测')
          this.setFormDatas(scope.row)
        }
      },
      {
        label: '删除',
        isShow: true,
        style: { 'color': '#FE4949' },
        handle: scope => {
          this.$confirm('确认删除该条用料实测数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'customClass'
          })
            .then(() => {
              this.dataSource.splice(scope.$index, 1)
            })
            .catch(() => {
              this.$message({ type: 'info', message: '已取消删除' })
            })
        }
      }
    ]
    const operates = {
      label: '操作',
      width: '120',
      fixed: 'right',
      dataSource: operatesData
    }
    const content = [
      {
        prop: 'yarn',
        itemType: 'input',
        labelWidth: '100px',
        label: '纱支/细度',
        clearable: true,
        maxlength: 50,
        // rules: [commonBlurReg],
        dataSource: []
      },
      {
        prop: 'element',
        itemType: 'select',
        labelWidth: '100px',
        label: '成份',
        valueType: 'object',
        clearable: true,
        filterable: true,
        className: 'commonRemoteSearch',
        visibleChange: (value) => {
          if (value) {
            this.getIngredient()
          }
        },
        dataSource: []
      },
      {
        prop: 'materiaYarnRate',
        itemType: 'input',
        labelWidth: '100px',
        label: '实测纱比%',
        clearable: true,
        rules: [{ validator: checkNum, trigger: 'blur' }],
        dataSource: []
      },
      {
        prop: 'theoryYarnRate',
        itemType: 'input',
        labelWidth: '100px',
        label: '理论纱比%',
        clearable: true,
        rules: [{ validator: checkNum, trigger: 'blur' }],
        dataSource: []
      },
      {
        prop: 'stripeSpacing',
        itemType: 'input',
        labelWidth: '100px',
        label: '条纹间距',
        clearable: true,
        maxlength: 50,
        dataSource: []
      },
      {
        prop: 'color',
        itemType: 'input',
        labelWidth: '100px',
        label: '颜色',
        clearable: true,
        maxlength: 100,
        dataSource: []
      }
    ]
    const popOptions = {
      itemType: 'drawer',
      visible: false,
      title: '新增用料实测',
      okText: '保存',
      ok: params => {
        const addData = {
          yarn: params.yarn,
          element: params.element,
          materiaYarnRate: params.materiaYarnRate,
          theoryYarnRate: params.theoryYarnRate,
          stripeSpacing: params.stripeSpacing,
          color: params.color
        }
        if (this.optionStatus === 'add') {
          this.dataSource.push(addData)
        } else {
          this.dataSource.splice(this.index, 1, addData)
        }
        this.popHandle()
      },
      cancel: params => {
        this.$set(this.popOptions, 'formDatas', {})
        this.popHandle()
      },
      formDatas: {},
      formOptions: {},
      content: content
    }
    return {
      index: 0,
      optionStatus: '',
      headerCellStyle,
      columns,
      operates,
      operatesData,
      content,
      popOptions,
      dataSource: null
    }
  },
  watch: {
    isEdit(n, o) {
      this.setOption(n)
    },
    dataSources: {
      handler(v) {
        if (v) {
          this.dataSource = v
        } else {
          this.dataSource = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.setOption(this.isEdit)
  },
  methods: {
    // 设置操作项
    setOption(status) {
      if (status === 'detail') {
        this.operates = null
      } else if (status === 'edit') {
        this.operates = {
          label: '操作',
          width: '120',
          fixed: 'right',
          dataSource: this.operatesData
        }
      }
    },
    // 点击编辑时处理数据
    setFormDatas(params) {
      this.$nextTick(() => {
        this.$set(this.popOptions, 'formDatas', params)
      })
      // setTimeout(() => {
      //   this.$set(this.popOptions, 'formDatas', params)
      // }, 0)
    },
    // 库存弹窗显隐
    popHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    addClick() {
      this.optionStatus = 'add'
      this.popHandle('新增用料实测')
      this.$set(this.popOptions, 'content', this.content)
      this.$set(this.popOptions, 'formDatas', {})
    },
    // 获取成份下拉
    async getIngredient(val) {
      const data1 = await getIngredient({ enabled: 'Y', name: val })
      const data2 = await getIngredientZh({ enabled: 'Y', name: val })
      const res = [...data1.data, ...data2.data].map(e => ({
        value: e.uuid,
        label: e.name
        // disabled: e.enabled === 'N'
      }))
      this.$set(this.content[1], 'dataSource', res)
    }
  }
}
</script>

<style lang="scss">
.table-item {
  background: #ffffff;
  .header-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 15px 20px;
    font-weight: 600;
    span {
      font-size: 16px;
      display: flex;
    }
    .el-button {
      display: flex;
      span {
        font-size: 14px;
      }
    }
  }
  .page-table {
    padding: 0 20px;
  }
  .page-table tbody .el-table__row td {
    border-bottom: 1px solid #dfe6ec;
  }
  .el-table th.is-leaf {
    border-bottom: 0;
  }
}
</style>

