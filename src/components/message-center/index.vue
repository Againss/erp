<!--
 * @Date: 2021-05-11 14:54:30
 * @Author: Againss
 * @LastEditTime: 2021-07-15 09:21:58
 * @LastEditors: Againss
 * @Descripttion:
-->
<template>
  <div class="message-center" @click="openMessageCenter">
    <!-- <div class="badge">2</div>
    <i class="el-icon-message" /> -->
    <el-badge :hidden="unreadCount===0" :value="unreadCount" :max="99" class="">
      <i class="el-icon-bell" />
    </el-badge>
  </div>
</template>

<script>
// import { userUnreadCount } from '@/views/user-center/message-center/api/index.js'
export default {
  data() {
    return {
      // unreadCount: 0
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.userInfo.userId
    },
    unreadCount() {
      return this.$store.state.user.unreadCount
    }
  },
  created() {
    // this.getUnreadCount({ userId: this.userId })
    this.$store.dispatch('user/getUnreadCount', { userId: this.userId })
  },
  mounted() {
    this.$store.state.app.ows.onmessage = (evt) => {
      const received_msg = evt.data
      console.log(evt, received_msg)
      if (received_msg && JSON.parse(received_msg).header.type === 0) {
        this.$store.commit('user/ADD_UNREADCOUNT')
      }
      if (received_msg && JSON.parse(received_msg).header.refresh) {
        this.$notify({
          title: '提示',
          message: '您的权限已经发生了改变，请重新登陆，如有问题，请联系售后部门的同事。',
          duration: 0
        })
      }
    }
  },
  methods: {
    // 打开消息中心
    openMessageCenter() {
      this.$router.push('/message-center')
    }
    // async getUnreadCount(data = {}) {
    //   const res = await userUnreadCount(data)
    //   console.log('未读消息', res)
    //   this.unreadCount = res.data
    // }
  }
}
</script>

<style lang="scss" scoped>
    .message-center {
        position: relative;
        i {
            font-size: 20px;
            margin-top: 15px;
        }
    }
</style>
<style lang="scss">
    .el-badge__content.is-fixed {
        top: 14px;
        right: 34px;
    }
</style>
