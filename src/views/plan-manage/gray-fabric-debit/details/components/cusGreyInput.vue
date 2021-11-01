<template>
  <div>
    <div v-if="scope.row.checked">
      <el-input
        v-model="scope.row.loanNum"
        class="cus-convent-input"
        :class="{ valateF: isShow }"
        placeholder="请输入"
        maxlength="9"
        @input="changeValue(scope.row.loanNum)"
        @blur="update(scope)"
      />
    </div>
    <div v-else>{{ scope.row.loanNum?(scope.row.loanNum).toFixed(2):'-' }}</div>
  </div>
</template>

<script>
export default {
  name: 'CusGreyInput',
  props: {
    scope: {
      type: Object
    },
    componentsOptions: {
      type: Object
    }
  },
  data() {
    return {
      isShow: false,
      oldValue: this.scope.row.loanNum
    }
  },
  methods: {
    changeValue(val) {
      val = val.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      val = val
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      if (val.indexOf('.') < 0 && val !== '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        val = parseFloat(val)
      }
      console.log('a: ' + this.oldValue)
      this.scope.row.loanNum = val
    },
    update(scope) {
      console.log(scope)
      const reg = /^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{1,2})?$/

      if (!reg.test(scope.row.loanNum)) {
        this.isShow = true
        // if (scope.row.loanNum) {
        //   this.$message.warning('请输入9位正数，最多两位小数')
        // }
        // scope.row.loanNum = 0
        return
      } else {
        this.isShow = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.cus-convent-input{
  /deep/.el-input__inner{
    height: 28px;
    line-height: 28px;
  }
}
.valateF {
  /deep/.el-input__inner {
    border-color: #ff4949;
  }
}
</style>
