<!--
 * @Date: 2020-11-04 16:11:42
 * @Author: Againss
 * @LastEditTime: 2021-01-15 11:13:11
 * @LastEditors: Againss
 * @Descripttion:
-->
<template>
  <div>
    <div v-if="!scope.row.edit">{{ showValue }}</div>
    <el-form-item v-else ref="formItem" prop="ingredientRatio" :rules="rules">
      <div>
        <div v-if="scope && scope.row.ingredientType === 2">100</div>
        <div v-else class="item">
          <div v-for="(item, index) in list" :key="item.id" class="input">
            <span
              class="label"
            >{{
              (item.ingredient && item.ingredient.name) || item.name || ""
            }}：</span>
            <el-input
              :value="item.ingredientRatio"
              placeholder="请输入"
              @input="handleInput($event, index)"
            />
          </div>
        </div>
        <!-- <div class="tip">
        <span
          v-show="show && scope.row.ingredientType === 1"
        >成份比例不能为空总和必须为100</span>
      </div> -->
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    componentsOptions: {
      type: Object
    },
    scope: {
      type: [Object, Number]
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (this.show) {
        callback(new Error('成份比例大于0且最多为两位小数且总和必须为100'))
      } else {
        callback()
      }
    }
    return {
      list: [],
      rules: [
        { validator: validatePass, trigger: 'change' }
      ]
    }
  },
  computed: {
    show(val) {
      let flag = false
      // console.log(this.scope.row.yarnElement)
      const a = this.scope.row.yarnElement && this.scope.row.yarnElement.reduce((str, cru) => {
        // console.log(cru)
        if (!cru.ingredientRatio) {
          flag = true
        }
        const res = /^(\d|([1-9]\d))(\.\d{1,2})?$/g
        if (res.test(cru.ingredientRatio) || cru.ingredientRatio - 100 === 0) {
          flag = false
        } else {
          flag = true
        }
        str += (cru.ingredientRatio - 0)
        return str - 0
      }, 0)
      return (a !== 100) || flag
    },
    showValue() {
      return this.scope.row.yarnElement && this.scope.row.yarnElement.reduce((str, cru) => {
        if (str) {
          str += '/' + (cru.ingredient && cru.ingredient.name || cru.name) + ':' + cru.ingredientRatio
        } else {
          str = (cru.ingredient && cru.ingredient.name || cru.name) + ':' + cru.ingredientRatio
        }
        return str
      }, '')
    }
  },
  watch: {
    'scope.row.yarnElement': {
      handler() {
        const arr = this.scope.row.yarnElement && this.scope.row.yarnElement.map(item => {
          item.ingredientRatio = item.ingredientRatio || ''
          return item
        })
        this.$refs.formItem && this.$refs.formItem.clearValidate()
        this.list = arr
      },
      deep: true
    }
  },
  created() {
    if (!this.list.length) {
      const arr = this.scope.row.yarnElement && this.scope.row.yarnElement.map(item => {
        item.ingredientRatio = item.ingredientRatio || ''
        return item
      })
      this.list = arr
    }
  },
  methods: {
    handleInput(e, index) {
      const item = this.list[index]
      item.ingredientRatio = e
      this.list.splice(index, 1, item)
      this.componentsOptions.Handler(this.list, this.scope)
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  .input {
    display: flex;
    margin-right: 5px;
    .label {
      line-height: 36px;
      width: auto;
    }
    .el-input {
      flex: 1;
    }
  }
}
.tip {
  font-size: 12px;
  color: red;
  height: 20px;
}
</style>
