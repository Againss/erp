/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <el-row>
    <el-col :span="12">
      <el-form-item :rules="[ruleRequire]" prop="areaCode" label="手机:">
        <el-select :value="areaNumValue" @change="areaNumChange">
          <el-option v-for="item in dataSource" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="1">
      <div class="solidStyle">-</div>
    </el-col>
    <el-col :span="11">
      <el-form-item :rules="[commonBlurReg,numberReg,baseRule]" prop="mobile" label="" label-width="0">
        <el-input :value="telValue" @input="telChange" />
      </el-form-item>
    </el-col>
  </el-row>

</template>

<script>
import countryCode from '../config/country-code.js'
export default {
  components: {},
  props: {
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    }
  },
  data() {
    // 正则
    const ruleRequire = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 手机验证正则
    const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 数字验证正则
    const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    return {
      baseRule: '',
      ruleRequire,
      commonBlurReg,
      phoneReg,
      numberReg,
      dataSource: []
    }
  },
  computed: {
    telValue() {
      return this.formDatas.mobile
    },
    areaNumValue() {
      return this.formDatas.areaCode
    }
  },
  watch: {
    areaNumValue: {
      handler(v) {
        v === '86' ? this.baseRule = this.phoneReg : this.baseRule = ''
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.configureCountryCode()
  },
  mounted() {
  },
  methods: {
    areaNumChange(value) {
      this.setFormDatas({ areaCode: value })
      //   console.log(value)
      value === '86' ? this.baseRule = this.phoneReg : this.baseRule = ''
    },
    telChange(value) {
      this.setFormDatas({ mobile: value })
    },
    // 配置国家码
    configureCountryCode() {
      // console.log('国家码')
      this.dataSource = countryCode
    }
  }
}
</script>

<style lang="scss" scoped>
    .solidStyle{
        display: flex;justify-content: center;align-items: center; height: 100%;padding-top: 7px
    }
</style>
