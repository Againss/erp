/**
 * @Description: DEMO
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div class="phoneOrEmail">
    <el-row v-if="componentsOptions.phoneOrEmailFlag ==='phone'" class="marginBottom">
      <el-col :span="12">
        <el-form-item :rules="[ruleRequire]" prop="areaCode" label="新手机号:">
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
    <el-row v-if="componentsOptions.phoneOrEmailFlag ==='email'" class="marginBottom">
      <el-form-item :rules="[emailReg, emailReg2, commonBlurReg, emailNumReg]" prop="email" label="邮箱地址:">
        <el-input :value="emailValue" @input="emailChange" />
      </el-form-item>
    </el-row>
    <el-row v-if="componentsOptions.phoneOrEmailFlag ==='phone'" index="1">
      <el-form-item :rules="[codeReg]" prop="identify" label="验证码:" class="form-item">
        <el-input class="code" :value="identifyValue" @input="identifyChange" />
        <el-button class="getCode" :disabled="codeText1!=='获取验证码' || formDatas.areaCode && formDatas.areaCode !== '86'" @click="codeCountDown1">{{ codeText1 }}</el-button>
      </el-form-item>
    </el-row>
    <el-row v-if="componentsOptions.phoneOrEmailFlag ==='email'" index="2">
      <el-form-item :rules="[commonBlurReg]" prop="identify" label="验证码:">
        <el-input class="code" :value="identifyValue" @input="identifyChange" />
        <el-button class="getCode" :disabled="codeText2!=='获取验证码'" @click="codeCountDown2">{{ codeText2 }}</el-button>
      </el-form-item>
    </el-row>
  </div>
</template>

<script>
import countryCode from '../../employee-management/config/country-code.js'
import { sendEmail, sendSMS } from '../api/index.js'
import { mailBoxManagerList } from '../../available-mailbox/api/index.js'
export default {
  components: {},
  props: {
    form: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    componentsOptions: {
      type: Object
    },
    flag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 正则
    const ruleRequire = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 手机验证正则
    const phoneReg = this.$getRules({ type: 'phone', trigger: ['blur'] })
    // 手机号只能输入数字
    const numberReg = this.$getRules({ type: 'number', trigger: ['blur'] })
    // 邮箱验证正则
    const emailReg = this.$getRules({ type: 'email', trigger: ['blur'] })
    // const emailReg2 = this.$getRules({ type: 'email2', trigger: ['blur'] })
    const emailNumReg = this.$getRules({ type: 'department', trigger: ['blur'] })
    return {
      baseRule: '',
      ruleRequire,
      commonBlurReg,
      emailReg,
      emailReg2: '',
      emailNumReg,
      phoneReg,
      numberReg,
      codeReg: '',
      dataSource: [],
      codeText1: '获取验证码',
      codeText2: '获取验证码',
      timer: null,
      timer2: null,
      phoneBtnFlag: true,
      emailBtnFlag: true
    }
  },
  computed: {
    telValue() {
      return this.formDatas.mobile
    },
    areaNumValue() {
      return this.formDatas.areaCode
    },
    emailValue() {
      return this.formDatas.email
    },
    identifyValue() {
      return this.formDatas.identify
    }
  },
  watch: {
    areaNumValue: {
      handler(v) {
        if (v === '86') {
          this.codeReg = this.commonBlurReg
          this.baseRule = this.phoneReg
        } else {
          this.baseRule = ''
          this.codeReg = ''
        }
      }
    },
    deep: true,
    immediate: true
  },
  created() {
    // console.log('form', this.visible)
    // console.log('componentsOptions', this.componentsOptions)
    this.configureCountryCode()
    this.areaNumChange(this.formDatas.areaCode)
    this.getAvailableMailboxList()
  },
  mounted() {
  },
  methods: {
    areaNumChange(value) {
      this.setFormDatas({ areaCode: value })
    },
    telChange(value) {
      this.setFormDatas({ mobile: value })
    },
    emailChange(value) {
      this.setFormDatas({ email: value })
    },
    identifyChange(value) {
      this.setFormDatas({ identify: value })
    },
    // 配置国家码
    configureCountryCode() {
      // console.log('国家码')
      this.dataSource = countryCode
    },
    // 手机号验证码倒计时
    codeCountDown1() {
      // let timer = null
      // if (this.phoneBtnFlag) {
      if (!this.timer) {
        let number = 0
        const validArray = ['areaCode', 'mobile']
        this.form.validateField(validArray, (validateField) => {
          // console.log(validateField)
          if (!validateField) {
            number++
            if (number === validArray.length) {
              // this.phoneBtnFlag = false
              this.getPhoneCode({ areaCode: this.areaNumValue, mobile: this.telValue })
            }
          }
        })
        // }
      }
    },
    // 邮箱验证码倒计时
    codeCountDown2() {
      // let timer = null
      // if (this.emailBtnFlag) {
      if (!this.timer2) {
        this.form.validateField('email', (validateField) => {
          if (!validateField) {
            // this.emailBtnFlag = false
            this.getEmailCode({ email: this.emailValue })
          }
        })
        // }
      }
    },
    // 获取可用邮箱的列表
    async getAvailableMailboxList(data = {}) {
      const res = await mailBoxManagerList(data)
      if (res.code !== 200) {
        return false
      }
      const dataList = res.data || []
      const emailName = dataList.map(item => item.mailBoxSuffix).join('|')
      const pattern = new RegExp('(' + emailName + ')$')
      this.emailReg2 = this.$getRules({ type: 'email2', pattern, message: '请输入正确的公司可用email', trigger: ['blur'] })
    },
    // 获取手机号证码验证码
    async getPhoneCode(data = {}) {
      const res = await sendSMS(data)
      // this.phoneBtnFlag = true
      if (res.code !== 200) {
        return false
      }
      this.$message.success('获取验证码成功,请前往手机查看')
      this.phoneCountDown()
    },
    // 手机号倒计时
    phoneCountDown() {
      let num = 120
      this.codeText1 = `重新获取(${num}s)`
      this.timer = setInterval(() => {
        this.codeText1 = `重新获取(${--num}s)`
        if (num === 0) {
          this.codeText1 = '获取验证码'
          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    },
    // 获取邮箱验证码
    async getEmailCode(data = {}) {
      const res = await sendEmail(data)
      // this.emailBtnFlag = true
      if (res.code !== 200) {
        return false
      }
      this.$message.success('获取验证码成功,请前往邮箱查看')
      this.emaileCountDown()
    },
    // 邮箱倒计时
    emaileCountDown() {
      let num = 120
      this.codeText2 = `重新获取(${num}s)`
      this.timer2 = setInterval(() => {
        this.codeText2 = `重新获取(${--num}s)`
        if (num === 0) {
          this.codeText2 = '获取验证码'
          clearInterval(this.timer2)
          this.timer2 = null
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.phoneOrEmail {
    .solidStyle{
        display: flex;justify-content: center;align-items: center; height: 100%;padding-top: 7px
    }
    .form-item{
      position: relative;
    }
    .getCode {
        width: 150px;
        text-align: right;
        padding-left: 14px;
        position: absolute;
        right: 5px;
        top: 3px;
        padding: 8px 0;
        border: none;
        color: #0986FF;
        &:hover{
          background: #fff;
          color: #0986FF;
        }
        &:focus{
          background: #fff;
        }
    }
    .email {
        width: 312px;
    }
    .code {
        // width: 194px;
    }
}
</style>
<style lang="scss">
  .phoneOrEmail {
    .marginBottom {
    margin-bottom: 30px;
    }
  }
</style>
