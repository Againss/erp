<template>
  <div class="edit-column">
    <span v-if="tItemType === 'select' && !editData[column.prop+'Edit']">{{ getLabel() }}</span>
    <default-column
      v-else-if="tItemType === 'select' || tItemType === 'input'"
      :scope="scope"
      :errors="errors"
      :item-type="tItemType"
      :form="form"
      :item-props="itemProps"
      :item-prop="itemProp"
      :value="editData[column.prop]"
      :column="editColumn"
      :edit-type="'inline'"
      :set-form-datas="editColumn.setFormDatas"
      :form-datas="formDatas"
    />
    <div v-else-if="editData.edit && tItemType === 'children' && editData[column.prop+'Edit']">
      <el-popover
        v-model="err.show"
        popper-class="defaultPopperErrClass"
        placement="top"
        trigger="manual"
      >
        <div style="color: #ff4949;">{{ err.msg[err.msgIdx] }}</div>
        <div slot="reference" class="input-group" :class="{'is-error': err.show}">
          <div v-for="(v, i) in editData[column.prop+'Group']" :key="i" class="input-item">
            <span v-if="i!==0">/</span><el-input v-model="editData[column.prop+'Group'][i]" @input="changeIpuqt" />
          </div>
        </div>
      </el-popover>
    </div>
    <span v-else>{{ editData[column.prop] }}</span>
  </div>
</template>

<script>
import defaultColumn from '@/components/cs-custom-table/columns/default-column'
export default {
  name: 'EditColumn',
  components: { defaultColumn },
  props: {
    componentsOptions: {
      type: Object
    },
    scope: {
      type: Object
    },
    column: {
      type: Object
    },
    itemType: {
      type: String
    },
    itemProp: {
      type: String
    },
    itemProps: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    form: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    errors: {
      type: Object
    },
    value: {
      type: [String, Number, Array]
    }
  },
  data() {
    return {
      watchers: {},
      editData: {},
      editColumn: {},
      err: { show: false, msgIdx: 0, msg: ['请输入实际含量', '实际含量相加必须等于100', '请输入正整数'] }
    }
  },
  computed: {
    tItemType() {
      return this.editData.itemType || 'input'
    },
    propError() {
      return this.editData[this.column.prop + 'Error']
    },
    propGroup() {
      return this.editData[this.column.prop + 'Group']
    }
  },
  watch: {
    // value: {
    //   handler(val, oldVal) {
    //     console.log('vavavav', val, oldVal)
    //   },
    //   deep: true
    // },
    // 'editData.p3Group': {
    propGroup: {
      handler(val, oldVal) {
        let sum = 0
        console.log(oldVal)
        if (!val || val.length === 0) return
        this.$set(this.editData, this.column.prop + 'Error', '')
        const reg = /^[1-9]\d{0,9}?$/
        for (let i = 0; i < val.length; i++) {
          if (val[i] === '') {
            return
          } else {
            if (!reg.test(val[i])) {
              this.err.msgIdx = 2
              this.err.show = true
              return
            }
            sum += parseFloat(val[i])
          }
        }
        if (sum !== 100) {
          this.err.msgIdx = 1
          this.err.show = true
        } else {
          this.err.show = false
          this.editData[this.column.prop] = val.join('/')
        }
      },
      deep: true
    },
    propError: {
      handler(val, oldVal) {
        if (val === 'error') {
          this.err.msgIdx = 0
          this.err.show = true
        }
      }
    }
  },
  beforeCreate() {

  },
  created() {
    // console.log('column', this.column)
    this.editData = this.scope.row
    this.editColumn = this.$utils.deepClone(this.column)
    this.editColumn.editOptions.itemType = this.tItemType // editData.itemType ? 'select' : 'input'
    if (this.editData.itemType === 'select') {
      this.editColumn.editOptions.rules.splice(-1)
    } else {
      this.editColumn.editOptions.rules.splice(0, 1)
    }
    if (this.editData.itemType === 'select') {
      this.editColumn.editOptions.placeholder = '请选择'
      this.editColumn.editOptions.dataSource = this.scope.row.dataSource
    } else if (this.editData.itemType === 'children') {
      this.inputGroup = this.editData[this.column.prop] && this.editData[this.column.prop].split('/') || []
    }
    // setTimeout(() => {
    //   this.err.show = true
    // }, 2000)
  },
  methods: {
    handleFormDatas() {
      const data = this.$utils.deepClone(this.formDatas.tableFormV)
      for (const k in data) {
        data[k].internalDetectionResult = data[k].internalDetectionResultGroup ? data[k].internalDetectionResultGroup.join('/') : ''
      }
      this.setFormDatas({ [this.itemProp]: data })
    },
    getLabel() {
      for (let i = 0; i < this.editColumn.editOptions.dataSource.length; i++) {
        if (this.editColumn.editOptions.dataSource[i].value === this.editData[this.column.prop]) return this.editColumn.editOptions.dataSource[i].label
      }
      return this.editData[this.column.prop]
    },
    changeIpuqt(e) {
      // console.log(e)
      this.componentsOptions.changeIpuqt(e, this.scope, this.formDatas)
      this.handleFormDatas()
    }
  }
}
</script>

<style lang="scss">
.edit-column {
  > span {
    padding: 0 12px;
  }
}
.input-group {
  display: flex;
  // border: 1px solid #DCDFE6;
  &.is-error {
    border-color: #ff4949;
  }
  .input-item{
    display: flex;
    align-items: center;
    .el-input__inner {
      background: transparent;
      border: none;
    }
  }
}
</style>
