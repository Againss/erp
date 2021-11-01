<template>
  <div>
    <div class="flex">
      <div class="title">
        <span style="color: red;">*</span>
        针/筒数
      </div>
      <div class="form">
        <cs-custom-form
          ref="table"
          :data-source="tableDataSource"
          :form-datas="{}"
          :options="{ popError: true }"
          edit-type="pop"
        />
        <div class="btn">
          <el-button
            icon="el-icon-circle-plus-outline"
            plain
            @click.stop="add"
          >新增</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object
    }
  },
  data() {
    const integerReg = this.$getRules({
      type: 'number',
      pattern: /^[1-9]\d*$/,
      message: '请输入正整数',
      trigger: ['blur']
    })
    const maxNumberReg = this.$getRules({
      type: 'number',
      pattern: /(^(([1-9]\d{0,7})(\.[1-9])?)$|(^0\.[1-9])$)/,
      message: '8位整数，或最多可保留1位小数',
      trigger: ['change', 'blur']
    })
    const validateNeedles = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入针数'))
      } else {
        const result = value.split(',')
        const reg = /^(([1-9]{1}\d{0,1})|(0{1}))(\.\d{1})?$/
        for (var i = 0; i < result.length; i++) {
          if (!reg.test(result[i])) {
            callback(new Error('请输入最多2位整数或保留1位小数,多个针数请用,隔开'))
            return
          }
        }
        callback()
      }
    }
    const tableDataSource = {
      _supplierKnitNums: {
        className: 'pop-table border-frame',
        prop: 'supplierKnitNums',
        headerCellStyle: { 'background-color': '#F5F7FA' },
        itemType: 'table-form',
        maxHeight: '180',
        dataSource: [{ edit: true }],
        selectionChange: (val) => {
          this.listDel = val
        },
        columns: {
          _needles: {
            prop: 'needles',
            label: '针数',
            labelClassName: 'product-is-request',
            className: 'product-no-request',
            editOptions: {
              labelWidth: '0',
              itemType: 'input',
              maxlength: '20',
              rules: [{ trigger: 'blur', validator: validateNeedles, required: true }]
            }
          },
          _syringes: {
            prop: 'syringes',
            itemType: 'input',
            label: '针筒数',
            labelClassName: 'product-is-request',
            className: 'product-no-request',
            editOptions: {
              labelWidth: '0',
              itemType: 'input',
              maxlength: '20',
              rules: [{ trigger: 'blur', required: true, message: '请输入' }, maxNumberReg]
            }
          },
          _sumNeedles: {
            prop: 'sumNeedles',
            itemType: 'input',
            label: '总针数',
            labelClassName: 'product-is-request',
            className: 'product-no-request',
            editOptions: {
              labelWidth: '0',
              itemType: 'input',
              maxlength: '20',
              rules: [{ trigger: 'blur', required: true, message: '请输入' }, integerReg]
            }
          }
        },
        operates: {
          label: '操作',
          width: '60',
          dataSource: [
            {
              label: '删除',
              style: { 'color': '#FE4949' },
              isShow: true,
              handle: (params, form, formDatas, setFormDatas) => {
                const arr = [...formDatas.supplierKnitNums]
                if (arr.length < 2) {
                  this.$message.warning('至少一行')
                  return
                }
                arr.splice(params.$index, 1)
                this.tableDataSource._supplierKnitNums.dataSource = arr
              }
            }
          ]
        }
      }
    }
    return {
      tableDataSource
    }
  },
  methods: {
    setData(val = []) {
      const arr = Array.isArray(val) && val.map(e => ({ ...e, edit: true }))
      if (arr) {
        this.tableDataSource._supplierKnitNums.dataSource = arr
      }
    },
    add() {
      const data = [{ edit: true }, ...this.$refs.table.dynamicValidateFormRuleForm.supplierKnitNums]
      this.tableDataSource._supplierKnitNums.dataSource = data
      this.$nextTick(() => {
        this.$refs.table.form.clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
    margin-bottom: 20px;
    .title {
      min-width: 96px;
      padding: 6px 12px 0 0;
      text-align: right;
      font-size: 14px;
      color: #606266;
    }
    .form {
      width: 337px;
      .btn {
        text-align: center;
        margin-top: -20px;
      }
      button {
        border: 0;
        color: #0986FF;
      }
    }
  }
  /deep/ .el-table--medium td {
    padding: 5px 0;
  }
</style>
