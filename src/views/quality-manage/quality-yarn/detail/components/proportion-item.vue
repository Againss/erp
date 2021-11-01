<template>
  <div class="ratio-form">
    <div style="width: 150px;padding-right: 12px;">
      <div class="ratio-label" :style="{color:isEdit==='edit'?'#606266':'#888'}"><span v-if="isEdit==='edit'">*</span>{{ options.label || '比例' }}</div>
    </div>
    <div v-if="isEdit==='edit'" style="flex: 1;display: flex;">
      <el-form-item :rules="ruleRequire" :prop="prop" style="flex: 1;margin-right: 0;">
        <div class="input-group">
          <div v-for="i in elementLength" :key="i" style="display: flex;flex: 1;">
            <span v-if="i!==1">/</span>
            <el-input :disabled="isEdit==='detail'?true:false" :value="dataGroup[i-1]" @input="inputChange(i-1, $event)" />
          </div>
        </div>
      </el-form-item>
    </div>
    <span v-else style="font-size: 14px;line-height: 36px;">{{ formDatas[prop] }}</span>
  </div>
</template>
<script>
export default {
  name: 'PopProportion',
  inheritAttrs: false,
  props: {
    formDatas: {
      type: Object
    },
    componentsOptions: {
      type: Object
    },
    form: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    options: Object
  },
  data() {
    const validate = (rule, value, callback) => {
      const reg = /^\d+\.?\d{0,2}$/
      let newV = value ? value.split('/') : []
      newV = newV.filter(v => { if (v) { return true } })
      const testArr = newV.filter(v => { if (reg.test(v)) { return true } }) || []
      let num = 0
      const arr = this.dataGroup
      let ifNull = true
      arr.forEach(v => {
        v !== '' && (ifNull = false)
        num += v * 1
        num = this.$utils.getFloat(num, 2)
      })
      if (!ifNull && num !== 100) {
        callback(new Error('计算总和100'))
      } else if (testArr.length !== newV.length) {
        callback(new Error('存在超过两位小数'))
      } else {
        // debugger
        // console.log(this.form)
        this.form.clearValidate()
        // this.$set(this.commonContent[3], 'error', '')
        callback()
      }
    }
    const ruleRequire = [{ validator: validate, trigger: 'blur' }]
    return {
      defaultRatio: '100',
      ruleRequire,
      elementLength: 1,
      dataGroup: [],
      flag: true
    }
  },
  computed: {
    isEdit() {
      return /* this.$route.query.show || */'edit'
    },
    propValue() {
      return this.formDatas[this.options.propLabel]
    },
    prop() {
      return this.options.prop
    }
  },
  watch: {
    propValue: {
      handler(data) {
        if (data) {
          if (data.label) {
            this.elementLength = data.label.split('/').length
          } else {
            this.elementLength = data.split('/').length
          }
        } else {
          this.elementLength = 1
        }
        if (this.formDatas[this.options.prop]) {
          const tempData = this.formDatas[this.options.prop].split('/')
          for (let i = 0; i < this.elementLength; i++) {
          // this.dataGroup[i] = tempData.length > i ? tempData[i] : ''
            this.$set(this.dataGroup, i, tempData.length > i ? tempData[i] : '')
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    inputChange(v, e) {
      this.$set(this.dataGroup, v, e)
      this.$set(this.formDatas, this.prop, this.dataGroup.join('/'))
    }
  }
}
</script>

<style lang="scss" scoped>
.ratio-form {
  width: 30%;
  padding-left: 20px;
  display: flex;
	// height: 36px;
  .ratio-label {
    width: 100%;
    line-height: 36px;
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    color: #606266;
    span {
      margin-right: 4px;
      color: #ff4949;
    }
  }
}
</style>
<style lang="scss">
.ratio-form {
  .input-group {
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    .el-input__inner {
      border: none;
      padding: 0 10px;
    }
  }
  .is-error .input-group{
    border-color: #ff4949;
  }
}
</style>
