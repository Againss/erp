<template>
  <div>
    <div class="cus-convent-input">
      <el-input
        v-model="scope.row.purchaseAmount"
        :class="{ valateF: isShow }"
        placeholder="请输入"
        :maxlength="8"
        @input="changeValue(scope.row.purchaseAmount)"
        @blur="update(scope)"
      />
    </div>
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
      oldValue: this.scope.row.purchaseAmount
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
      this.scope.row.purchaseAmount = val
    },
    update(scope) {
      console.log(scope)
      const reg = /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/

      if (!reg.test(scope.row.purchaseAmount)) {
        this.isShow = true
        if (scope.row.purchaseAmount) {
          this.$message.warning('正数最大为8位，小数点后两位')
        }
        // scope.row.purchaseAmount = this.oldValue
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
