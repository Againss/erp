<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div class="evnInfo">
      {{ getEnvInfo }}
    </div>
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <nav-sys />
      <switch-lang v-if="/crm/.test(branch)" />
      <template v-if="device !== 'mobile'">
        <error-log v-if="isDev" class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <messageCenter v-if="isNotProd" class="right-menu-item hover-effect" />

        <!--        <el-tooltip content="Global Size" effect="dark" placement="bottom">-->
        <!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <div class="dividing-line" />
          <!--          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
          <img :src="newAvatar" class="user-avatar">
          <span class="username">{{ $store.getters.realName }}</span>
          <i class="el-icon-arrow-down" style="font-size: 14px" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/"> -->
          <el-dropdown-item
            @click.native="toPersonalData"
          >个人资料</el-dropdown-item>
          <el-dropdown-item
            @click.native="editPassword"
          >修改密码</el-dropdown-item>
          <el-dropdown-item
            v-if="/erp/.test(branch)"
            @click.native="toApproveList"
          >我的审批</el-dropdown-item>
          <el-dropdown-item v-if="isShow" @click.native="selectServe">选择灰度服务</el-dropdown-item>
          <template v-if="isDev">
            <el-dropdown-item><router-link
              to="/tform"
            >基础组件文档</router-link></el-dropdown-item>
            <el-dropdown-item><router-link
              to="/com-function"
            >权限方法及传参</router-link></el-dropdown-item>
            <el-dropdown-item><router-link
              to="/nginx-kafka"
            >操作日志接口传参</router-link></el-dropdown-item>
          </template>
          <!-- </router-link> -->
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import messageCenter from '@/components/message-center'
import navSys from './nav-sys'
import switchLang from './switch-lang'
import { getStorageToken } from '@/utils/auth'
import { getJavaGrayService } from '@/layout/api'
// import javaConfig from '../config/javaServe'
// import SizeSelect from '@/components/SizeSelect'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    messageCenter,
    navSys,
    switchLang
    // SizeSelect
  },
  data() {
    const { env, branch } = this.$utils.getEnvInfo()
    return {
      env: ['staging', 'sit'],
      isHiddenEnv: ['production', 'demo'],
      envInfo: env,
      branch
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device']),
    newAvatar() {
      console.log(this.avatar)
      if (this.avatar) {
        if (!/blob/.test(this.avatar)) {
          return this.avatar + '?' + new Date().getTime()
        } else {
          return this.avatar
        }
      } else {
        return '/static/other/image/default.png'
      }
    },
    isDev() {
      return process.env.NODE_ENV === 'development'
    },
    isNotProd() {
      return process.env.VUE_APP_ENV !== 'back'
    },
    isShowInfo() {
      const branchList = ['erp-dev', 'erp-sit', 'erp', 'erp-demo', 'trunk']
      return !branchList.includes(this.branch)
    },
    getEnvInfo() {
      const msgArr = []
      const javaServiceConfig = this.$store.state.app.javaServiceConfig
      const serveChange = getStorageToken('serveChange') || ''
      let javaMsg = ''
      if (serveChange) {
        javaServiceConfig.forEach(v => {
          if (v.value === serveChange) {
            javaMsg = `java版本：${v.label}`
          }
        })
      }
      const frontMsg = `当前环境: ${this.envInfo} , 前端分支: ${this.branch}`
      if (this.isShowInfo) {
        msgArr.push(frontMsg)
      }
      if (javaMsg) {
        msgArr.push(javaMsg)
      }
      return msgArr.length ? `(${msgArr.join(' , ')})` : ''
    },
    isShow() {
      return !this.isHiddenEnv.includes(process.env.VUE_APP_ENV)
    }
  },

  mounted() {
    // this.isShow && this.getjavaService()
  },
  methods: {
    async getjavaService() {
      const data = await getJavaGrayService()
      this.javaServiceConfig = data.data.list
      this.$store.commit('app/SET_JAVASERVICECONFIG', this.javaServiceConfig)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
    },
    // 修改密码
    editPassword() {
      this.$emit('PopDialogHandle')
    },
    // 选择服务器
    selectServe() {
      this.$emit('servePopDialogHandle')
    },
    // 跳转到个人资料
    toPersonalData() {
      this.$router.push({ path: '/personal-data' })
    },
    // 跳转到我的审批
    toApproveList() {
      this.$router.push({ path: '/approve-list' })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid #e9eff2;
  background: #fff;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .evnInfo{
        line-height: 50px;
        display: inline-block;
        position: absolute;
        right: 350px;
        top: 0px;
        pointer-events: none;
        color: #ff0000;
    }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
      position: relative;

    &:focus {
      outline: none;
    }
    .username {
      font-size: 14px;
      margin: 0 10px;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 10px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 5px;

      .dividing-line {
        width: 1px;
        height: 20px;
        background-color: #ddd;
        margin-right: 19px;
      }

      .avatar-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          /*          position: absolute;
          right: -15px;
          top: 28px;*/
          font-size: 12px;
        }
      }
    }
  }
}
</style>
