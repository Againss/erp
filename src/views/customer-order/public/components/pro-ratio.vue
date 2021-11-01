<!--
 * @Author: ll
 * @Date: 2021-01-06 11:22:13
 * @LastEditTime: 2021-06-25 11:22:50
-->

<template>
  <div class="ratio-form">
    <div v-if="elementRatioArr.length > 1" class="ratio-inputs">
      <div v-for="(item, i) in elementRatioArr" :key="i">
        <el-form-item
          :rules="ruleRequire"
          :prop="prop(i)"
        >
          <el-input
            class="inputs "
            :value="getValue(i)"
            @input="inputChange(i,$event)"
          />
        </el-form-item>
      </div>
    </div>
    <div v-else class="ratio-inputs">
      <el-form-item>
        <el-input
          :value="val"
          disabled
          class="inputs"
        />
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopProportion',
  inheritAttrs: false,
  props: {
    scope: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    form: {
      type: Object
    },
    setFormDatas: {
      type: Function
    }
  },
  data() {
    const validate = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      let newV = value ? value.split('/') : []
      newV = newV.filter(v => { if (v) { return true } })
      const testArr = newV.filter(v => { if (reg.test(v)) { return true } }) || []
      let num = 0
      const arr = this.formDatas.ratio ? this.formDatas.ratio.split('/') : []
      arr.forEach(v => {
        num += v * 1
        num = this.$utils.getFloat(num, 2)
      })

      if (value === '' || newV.length !== this.elementRatioArr.length || num !== 100) {
        callback(new Error('计算总和100'))
      } else if (testArr.length !== newV.length) {
        callback(new Error('存在超过两位小数项'))
      } else {
        this.form.clearValidate()
        callback()
      }
    }
    // const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    const ruleRequire = [{ validator: validate, trigger: 'blur' }]
    return {
      defaultRatio: '100',
      ruleRequire,
      elementRatioArr: []
    }
  },
  computed: {
    val() {
      return this.elementRatioArr.length ? (this.formDatas.ratio ? this.formDatas.ratio : this.defaultRatio) : ''
    }
  },
  watch: {
    'formDatas.ingredient': {
      handler(data) {
        if (data) {
          let ratioArr = []
          if (data.label) {
            if (this.formDatas.ratio && this.formDatas.ieEdit && this.flag) {
              ratioArr = ('' + this.formDatas.ratio).split('/')
            } else if (this.formDatas.ingredient.names) {
              ratioArr = this.formDatas.ingredient.names.split('/')
            } else if (this.formDatas.ratio) {
              ratioArr = ('' + this.formDatas.ratio).split('/')
            } else {
              ratioArr = this.formDatas.ingredient.label.split('/')
            }
          } else {
            ratioArr = []
          }
          this.elementRatioArr = ratioArr
        } else {
          this.elementRatioArr = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    prop(key) {
      return 'ratio'
    },
    getValue(index) {
      const ratio = this.formDatas['ratio']
      const data = ratio ? this.formDatas['ratio'].split('/') : []
      return data[index]
    },
    inputChange(i, $event) {
      const ratio = this.formDatas['ratio']
      const data = ratio ? this.formDatas['ratio'].split('/') : []
      data[i] = $event
      // console.log(data)
      this.setFormDatas({ 'ratio': data.join('/') })
    }
  }
}
</script>

<style lang="scss" scoped>
.ratio-form {
  display: flex;
  flex-direction: row;
  .ratio-label {
    min-width: 80px;
    line-height: 36px;
    display: flex;
    font-size: 14px;
    color: #606266;
    span {
      margin-right: 4px;
      color: #ff4949;
    }
  }
  .inputs {
    width: 60px;
    margin-left: 10px;
  }
  .ratio-inputs {
    display: flex;
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__content {
        margin-left: 0!important;
      }
    }
  }
}
</style>
