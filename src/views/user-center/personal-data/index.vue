<template>
  <div class="personalData">
    <div class="title">个人资料</div>
    <el-row :gutter="20">
      <el-col class="right marginTop" :span="2">头像:</el-col>
      <el-col :span="16">
        <div class="avatar">
          <el-avatar :size="40" :src="avatar" />
          <cs-custom-form
            ref="searchForm"
            class="personalData-form"
            :data-source="searchData"
            :options="formOtions"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col class="right" :span="2">工号:</el-col>
      <el-col :span="16">{{ userInfo.jobNum }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col class="right" :span="2">姓名:</el-col>
      <el-col :span="16">{{ userInfo.realName }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col class="right" :span="2">手机号:</el-col>
      <el-col :span="3" style="width: 240px;">{{
        (userInfo.areaCode ? `+${userInfo.areaCode}-` : '') +
          (userInfo.mobile ? userInfo.mobile : '')
      }}</el-col>
      <el-col
        class="edit"
        :span="11"
      ><el-button size="small" @click="editPhone">修改</el-button></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col class="right" :span="2">邮箱:</el-col>
      <el-col :span="3" style="width: 240px;">{{ userInfo.email }}</el-col>
      <el-col
        class="edit"
        :span="11"
      ><el-button size="small" @click="editEmail">修改</el-button></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col class="right" :span="2">部门:</el-col>
      <el-col :span="16">{{
        userInfo.orgs && userInfo.orgs.map((item) => item.name).join(',')
      }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col class="right" :span="2">登录用户名:</el-col>
      <el-col :span="16">{{ userInfo.name }}</el-col>
    </el-row>
    <!-- 导入pop弹出层 -->
    <div class="pop">
      <cs-custom-pop :options="popOptions" />
    </div>
  </div>
</template>

<script>
import { currentUserInfo, mobileModify, emailModify } from './api/index.js'
import phoneOrEmail from './components/phoneOrEmail.vue'
import { getToken, /* getStorageToken */ setStorageToken } from '@/utils/auth'
import uploadSlotTrigger from './components/upload-slot-trigger.vue'
import uploadSlotTip from './components/upload-slot-tip.vue'
export default {
  components: {
    // phoneOrEmailDialog
  },
  data() {
    // 单个的配置信息
    const searchData = [
      {
        prop: 'upload',
        itemType: 'upload',
        label: '',
        className: 'roleUpload',
        labelWidth: '30px',
        // showFileList: false,
        onSuccess: async(res, file) => {
          console.log(res, file)
          this.userInfo.avatar = URL.createObjectURL(file.raw)
          this.$store.commit('user/SET_AVATAR', this.userInfo.avatar)
          await this.getUserInfo()
          // const userInfo = getStorageToken('userInfo')
          // console.log(userInfo)
          if (this.userInfo) {
          //   const newUserInfo = JSON.parse(userInfo)
          //   newUserInfo.avatar = this.userInfo.avatar
            setStorageToken({ name: 'userInfo', value: JSON.stringify(this.userInfo) })
          }
          this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysUser/avatar/upload'), { avatar: this.userInfo.avatar }, JSON.stringify({ beforeText: `在'用户中心-个人资料'中`, afterText: '头像修改成功', beforeCode: { userName: this.userInfo.name }}))
          this.$message.success('修改成功')
        },
        onError: (res, file) => {
          // console.log(res, file)
        },
        beforeUpload: (file) => {
          // console.log(file.type.split('/')[1])
          const fileType = file.type.split('/')[1]
          const regexp = new RegExp(fileType)
          const isImg = regexp.test(this.accept)
          const isLt1M = file.size / 1024 / 1024 < 1
          if (!isImg) {
            this.$message.error('上传头像图片只能是 .jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.PNG,.BMP 格式!')
          }
          if (!isLt1M) {
            this.$message.error('上传头像图片大小不能超过 1MB!')
          }
          return isImg && isLt1M
        },
        action: `/userCenter/sysUser/avatar/upload`,
        accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
        showFileList: false,
        timeout: 30000,
        content: [
          {
            slot: 'trigger',
            component: uploadSlotTrigger
          },
          {
            slot: 'tip',
            component: uploadSlotTip
          }
        ]
      }
    ]
    const phoneContent = [
      {
        components: {
          phoneOrEmail
        },
        componentsOptions: {
          phoneOrEmailFlag: 'phone'
        }
      }
    ]
    const emailContent = [
      {
        components: {
          phoneOrEmail
        },
        componentsOptions: {
          phoneOrEmailFlag: 'email'
        }
      }
    ]
    // pop弹出框配置信息
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改',
      okText: '保存',
      ok: params => {
        // console.log('点击修改', params)
        this.modifyMobileOrEmail(params)
      },
      cancel: (params, form) => {
        // console.log('form', form)
        this.$set(this.popOptions, 'visible', false)
        this.setFormDatas({ disabledFlag: false })
      },
      formDatas: {
        areaCode: ''
      },
      formOptions: {
        labelWidth: '140px'
      },
      content: []
    }
    return {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      accept: '.gif,.jpg,.jpeg,.png,.bmp,.GIF,.JPG,.JPEG,.PNG,.BMP',
      popOptions,
      // action,
      phoneContent,
      emailContent,
      userInfo: {},
      imageUrl: '',
      searchData,
      formOtions: {},
      type: null
    }
  },
  computed: {
    avatar() {
      if (this.userInfo.avatar) {
        if (!/blob/.test(this.userInfo.avatar)) {
          return this.userInfo.avatar + '?' + new Date().getTime()
        } else {
          return this.userInfo.avatar
        }
      } else {
        return '/static/other/image/default.png'
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 修改按钮
    setFormDatas(params) {
      // console.log(params)
      setTimeout(() => {
        this.$set(this.popOptions, 'formDatas', params)
      }, 0)
    },
    // 修改手机号
    editPhone() {
      this.$set(this.popOptions, 'content', this.phoneContent)
      this.$set(this.popOptions.formDatas, 'areaCode', this.userInfo.areaCode)
      this.PopDialogHandle()
      this.type = 'mobile'
    },
    // 修改邮箱
    editEmail() {
      this.$set(this.popOptions, 'content', this.emailContent)
      this.PopDialogHandle()
      this.type = 'email'
    },
    // 获取用户信息
    async getUserInfo(data = {}) {
      const res = await currentUserInfo(data)
      console.log('用户信息', res)
      this.userInfo = res.data
      // return res.data
    },
    // 修改手机号或者邮箱
    modifyMobileOrEmail(data = {}) {
      if (this.type === 'mobile') {
        this.modifyMobile(data)
      } else if (this.type === 'email') {
        this.modifyEmail(data)
      }
    },
    // 修改手机号码
    async modifyMobile(data = {}) {
      const res = await mobileModify(data)
      if (res.code !== 200) {
        return false
      }
      const userInfo = {
        areaCode: this.userInfo.areaCode,
        mobile: this.userInfo.mobile
      }
      this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysUser/mobile/modify'), data, JSON.stringify({ beforeText: `在'用户中心-个人资料'中${JSON.stringify({ userName: this.userInfo.name })}将'mobile'`, afterText: '修改为', ...this.compareData(userInfo, { areaCode: data.areaCode, mobile: data.mobile }) }))
      this.PopDialogHandle()
      this.userInfo.mobile = data.mobile
      this.userInfo.areaCode = data.areaCode
      this.$message.success('修改成功')
    },
    // 修改邮箱
    async modifyEmail(data = {}) {
      const res = await emailModify(data)
      if (res.code !== 200) {
        return false
      }
      const userInfo = {
        email: this.userInfo.email
      }
      this.fetchLog(this.getLogMessages('UPDATE', '/userCenter/sysUser/email/modify'), data, JSON.stringify({ beforeText: `在'用户中心-个人资料'中${JSON.stringify({ userName: this.userInfo.name })}将'email'`, afterText: '修改为', ...this.compareData({ email: userInfo.email }, { email: data.email }) }))
      this.PopDialogHandle()
      this.userInfo.email = data.email
      this.$message.success('修改成功')
    },
    // 传日志信息到卡夫卡
    fetchLog(messages, data, description) {
      this.$store.dispatch('app/fetchLog', { ...messages, params: JSON.stringify(data), description })
    },
    // 日志描述新老数据比对
    compareData(oldData, newData, id) {
      const comparedKeys = Object.keys(newData).filter(item => {
        if (Array.isArray(newData[item])) {
          return JSON.stringify(oldData[item] || []) !== JSON.stringify(newData[item])
        } else {
          return oldData[item] !== newData[item]
        }
      })
      const oldObj = {}
      const newObj = {}
      comparedKeys.forEach(item => {
        oldObj[item] = oldData[item]
        newObj[item] = newData[item]
      })
      console.log(oldObj, newObj)
      return {
        beforeCode: { ...oldObj, [id]: newData[id] },
        afterCode: { ...newObj, [id]: newData[id] }
      }
    },
    // 获取需要传过去的日志信息
    getLogMessages(opratorType, api) {
      const userInfo = this.$store.state.user.userInfo
      const baseURL = this.$store.state.app.baseURL
      const topic = this.$store.state.user.topic
      const logcommonMessages = {
        type: 'OP',
        appId: 'userCenter',
        handleResult: 'SUCCESS',
        userId: userInfo.userId,
        realName: userInfo.realName,
        userName: userInfo.name,
        topic: topic,
        description: '',
        createTime: new Date().getTime()
      }
      return {
        ...logcommonMessages,
        opratorType: opratorType,
        api: baseURL + api
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.personalData {
  font-size: 14px;
  margin: 20px;
  min-height: calc(100vh - 130px);

  padding: 20px;
  padding-top: 0;
  box-sizing: border-box;
  background: #fff;
  color: #666666;
  .title{
    font-size: 16px;
    color: #3C4043;
    height: 57px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #EEEFF0;
  }
  .avatar {
    display: flex;
    align-items: center;

    .upload {
      margin-left: 20px;
    }
  }

  .el-row {
    margin-top: 42px;
  }

  .right {
    width: 100px;
    // padding-right: 0;
    text-align: right;
    color: #888E9E;
  }

  .tip {
    color: #aaa;
  }

  .marginTop {
    margin-top: 16px;
  }

  .marginTop2 {
    margin-top: 14px;
    margin-left: -6px;
  }

  .edit {
    margin-top: -10px;
  }
}
</style>
<style lang="scss">
.personalData {
  .el-form {
    .el-form-item {
      margin-bottom: 0px;
    }
  }
  .el-dialog__body {
    padding-right: 100px;
  }
  .el-avatar {
    width: 150px;
    border-radius: 50%;
    background-color: #fff;
    img {
      width: 40px;
      height: 40px;
      object-fit: initial !important;
    }
  }
  .personalData-form.custom-form {
    margin-left: 170px;
  }
  .roleUpload {
    margin-top: 6px;
    margin-left: 0;
  }
}
</style>
