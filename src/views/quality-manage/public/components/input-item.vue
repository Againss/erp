<template>
  <div class="input-item yarn-form-cont" :class="getIsEdit?'':'yarn-quality-detail'">
    <template v-if="getIsEdit">
      <div v-if="scope.row.greyDatasoure==='个'||scope.row.greyDatasoure==='次'" style="display: flex;position: relative;align-items: center;background-color: #fff;">
        <el-form-item style="position: relative;width: 100%;" label="" :rules="ruleRequire" :prop="prop('grey')">
          <el-input v-model="value" :disabled="!getIsEdit" :readonly="!getIsEdit" :placeholder="getIsEdit?'请输入':''" @input="componentsOptions.changeStatus($event,scope, formDatas, setFormDatas)" />
          <span v-if="getIsEdit" class="unit">/{{ scope.row.greyDatasoure }}</span>
        </el-form-item>

      </div>
      <el-form-item v-else label="" style="position: relative;">
        <el-select v-model="value" style="width: 100%;" :disabled="!getIsEdit" :placeholder="getIsEdit?'请选择':''" @change="componentsOptions.changeStatus($event,scope, formDatas, setFormDatas)">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </template>
    <div v-else>{{ value||'-' }}</div>
  </div>
</template>

<script>
export default {

  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    },
    column: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    form: {
      type: Object
    }
  },
  data() {
    // 公用验证正则
    const validate = (rule, value, callback) => {
      if (/^[0-9]{0,5}$/.test(this.value)) {
        callback()
      } else {
        callback(new Error('请输入0-99999整数'))
      }
    }
    const ruleRequire = [{ validator: validate, trigger: 'blur' }]

    return {
      options: [],
      value: this.scope.row[this.column.prop],
      isEdit: '',
      editData: {},
      ruleRequire,
      userId: this.$store.state.user.userInfo.userId
    }
  },
  computed: {
    // userInfo() {
    //   this.$store.state.user.userInfo
    // },
    tItemType() {
      if (!this.scope.row.greyDatasoure.includes('/')) {
        return 'input'
      } else return 'select'
    },
    getProp() {
      return this.column.prop
    },
    getIsEdit() {
      // console.log(this.scope.row, this.formDatas, this.$store.state.user.userInfo, '111')
      const formDatas = this.formDatas
      return this.userId === formDatas.reviewUserId && formDatas.status === 2 ? false : this.scope.row.edit
    }
  },
  created() {
    this.isEdit = this.scope.row.edit
    this.editData = this.scope.row
    this.editColumn = this.$utils.deepClone(this.column)
    if (this.tItemType === 'select') {
      if (this.scope.row.greyDatasoure) {
        const arr = this.scope.row.greyDatasoure.split('/')
        this.options = arr.map(v => {
          return {
            label: v,
            value: v
          }
        })
      } else {
        this.options = [
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B' },
          { label: 'C', value: 'C' }
        ]
      }
      this.editColumn.editOptions.rules = []
    } else {
      // const maxNumberReg = this.$getRules({
      //   type: 'number',
      //   pattern: /^[0-9]{0,4}$/,
      //   message: '请输入0-99999整数',
      //   trigger: ['blur']
      // })
      // this.editColumn.editOptions.rules = [maxNumberReg]
    }

    // this.editColumn.editOptions.dataSource = this.options
  },
  methods: {
    prop(key) {
      return 'grey'
    }
    // setFormDatas(v) {
    //   this.componentsOptions.changeStatus(v)
    // }
  }
}
</script>

<style lang="scss">
.input-item{
    .el-input--medium .el-input__inner {
      height: 28px;
    }

}
.yarn-form-cont{
  font-size: 14px;
  .el-form-item {
    margin-right: 0;
    &.is-error {
      border: 1px solid #ff4949;
      z-index: 2;
    }
  }
  .el-form-item__error{
    position: absolute;
    top: -36px;
    left: 0;
    z-index: 9;
  }
  .unit {
    font-size: 12px;
    color: #BBC2D0;
    right: 10px;
    position: absolute;
  }
  .el-form-item__content{
    position: relative;
  }
  .yarn-form-cont .el-form-item.is-error{
    z-index: 2;
  }
}
.yarn-quality-detail{
  .el-input__icon{
    display: none;
  }
}
</style>
