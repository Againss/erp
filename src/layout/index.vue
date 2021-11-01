/**
 * @Description: 布局入口
 * @author Roman
 * @date 2020/6/18
*/
<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar
          @PopDialogHandle="PopDialogHandle"
          @servePopDialogHandle="servePopDialogHandle"
        />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
    </div>
    <!-- 导入pop弹出层 -->
    <cs-favico :number="favicoNum" />
    <div class="pop">
      <cs-custom-pop ref="pop" :options="popOptions" />
    </div>
    <!-- 导入选择服务器pop弹出层 -->
    <div class="pop">
      <cs-custom-pop ref="servePop" :options="servePopOptions" />
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import { userPasswordModify } from './api/index.js'
import frontServe from './config/frontServe.js'
import { getJavaGrayService } from '@/layout/api'
import { getStorageToken, getToken, removeStorageToken, setCookie, setStorageToken } from '@/utils/auth'
// import serveButtonGroup from './components/serveButtonGroup.vue'
export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    // 公用验证正则
    // const commonChangeReg = this.$getRules({})
    // 公用验证正则
    const commonBlurReg = this.$getRules({ trigger: ['blur'] })
    // 新密码验证
    const newPasswordReg = this.$getRules({
      type: 'password',
      trigger: ['blur']
    })
    const popOptions = {
      itemType: 'dialog',
      visible: false,
      title: '修改密码',
      okText: '保存',
      ok: (params) => {
        // console.log(params)
        this.changePassword(params)
      },
      cancel: (params) => {
        // console.log(params)
        // this.PopDialogHandle()
        this.$set(this.popOptions, 'visible', false)
      },
      formDatas: {},
      formOptions: {
        labelWidth: '100px'
      },
      content: [
        {
          prop: 'oldPassword',
          itemType: 'input',
          label: '旧密码:',
          type: 'password',
          rules: [commonBlurReg],
          placeholder: '请输入旧密码'
        },
        {
          prop: 'newPassword',
          itemType: 'input',
          label: '新密码',
          type: 'password',
          rules: [commonBlurReg, newPasswordReg],
          placeholder: '请输入新密码'
        },
        {
          prop: 'confirmNewPassword',
          itemType: 'input',
          label: '确认新密码',
          type: 'password',
          rules: [
            {
              validator: this.validatePasswordConfirm,
              trigger: 'blur',
              required: true
            }
          ],
          placeholder: '请确认新密码'
        }
      ],
      popDialogHandle: () => {
        this.PopDialogHandle()
      }
      // component: PopDialog
    }
    const itemStyle = { width: '50%', display: 'inline-block', marginBottom: '0px' }
    const servePopOptions = {
      itemType: 'dialog',
      visible: false,
      title: '选择灰度服务',
      width: '620px',
      formDatas: {
        fontEnv: getToken('s_id') || '66',
        javaEnv: getStorageToken('serveChange') || ''
      },
      formOptions: {
        labelWidth: '90px'
      },
      ok: (params) => {
        setCookie('s_id', params.fontEnv, 7)
        setStorageToken({ name: 'serveChange', value: params.javaEnv })
        removeStorageToken('userInfo')
        removeStorageToken('permitList')
        removeStorageToken('systemList')
        removeStorageToken('authLists')
        location.href = '/'
      },
      cancel: () => {
        this.servePopDialogHandle()
      },
      content: {
        _fontEnv: {
          prop: 'fontEnv',
          label: '前端环境:',
          isShow: () => {
            return process.env.NODE_ENV !== 'development'
          },
          itemType: 'select',
          filterable: true,
          itemStyle: itemStyle,
          dataSource: frontServe
        },
        _javaEnv: {
          prop: 'javaEnv',
          label: 'JAVA环境:',
          itemStyle: itemStyle,
          filterable: true,
          itemType: 'select',
          dataSource: []
        }
      },
      popDialogHandle: () => {
        this.servePopDialogHandle()
      }
      // component: PopDialog
    }
    return {
      isHiddenEnv: ['production', 'demo'],
      popOptions,
      servePopOptions
    }
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
      favicoNum: (state) => state.app.favicoNum
    }),
    isShow() {
      return !this.isHiddenEnv.includes(process.env.VUE_APP_ENV)
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    // console.log('userId', this.$store.getters.userId)
    this.isShow && this.getjavaService()
  },
  methods: {
    async getjavaService() {
      const data = await getJavaGrayService()
      const list = data.data.list || []
      this.servePopOptions.content._javaEnv.dataSource = list
      this.$store.commit('app/SET_JAVASERVICECONFIG', list)
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    // 修改弹出层的判断
    PopDialogHandle(val) {
      this.$set(this.popOptions, 'visible', !this.popOptions.visible)
      if (val) {
        this.$set(this.popOptions, 'title', val)
      }
    },
    // 修改选择服务器弹出层的判断
    servePopDialogHandle() {
      this.$set(this.servePopOptions, 'visible', !this.servePopOptions.visible)
    },
    // 登出
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 确认密码校验
    validatePasswordConfirm(rule, value, callback) {
      const passwordParams = this.$refs.pop.$refs.popComponents.$refs.customform
        .dynamicValidateFormRuleForm // 获取form字段数据
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== passwordParams.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    // 修改密码
    async changePassword(data = {}) {
      const res = await userPasswordModify(data)
      if (res.code !== 200) {
        return false
      }
      const logModifyMessages = this.getLogMessages(
        'UPDATE',
        '/userCenter/sysUser/password/modify'
      )
      const flag = data.oldPassword !== data.newPassword
      flag &&
        this.fetchLog(
          logModifyMessages,
          data,
          JSON.stringify({
            afterText: `在'用户中心'修改密码成功`,
            beforeCode: { userName: logModifyMessages.userName }
          })
        )
      this.$set(this.popOptions, 'visible', false)
      this.$message.success('修改成功')
    },
    // 传日志信息到卡夫卡
    fetchLog(messages, data, description) {
      this.$store.dispatch('app/fetchLog', {
        ...messages,
        params: JSON.stringify(data),
        description
      })
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

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
