<template>
  <div class="top-nav-bar">
    <div v-if="backIcon" class="to-back" @click="toBack"><i class="el-icon-arrow-left" /></div>
    <div v-else />
    <div class="title">智布成品验布录入系统</div>
    <div class="info-text">
      <div>登录人：{{ realName }}</div>
      <!-- <div class="exit-all" @click="exitAll">退出全屏</div> -->
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      tyep: String
    },
    backIcon: {
      tyep: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    realName() {
      return this.$store.state.user.userInfo.realName || ''
    }
  },
  mounted() {

  },
  methods: {
    exitAll() {
      this.$emit('exitAll')
      this.$router.push(`/quality-manage/finished-product-testing/finished-fabric-inspection`)
    },
    toBack() {
      if (this.$route.path === '/quality-manage/finished-product-testing/finished-ipad-list') {
        this.$router.push(`/quality-manage/finished-product-testing/finished-fabric-inspection`)
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.top-nav-bar {
  box-sizing: border-box;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-image: linear-gradient(-1deg, #2b8fef 0%, #4aa6ff 100%, #4aa7ff 100%);
  color: #ffffff;
  .to-back {
    font-weight: 500;
    color: #ffffff;
    cursor: pointer;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon-arrow-left{
      font-size: 20px;
    }
  }
  .info-text {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 20px;
    margin-left: auto;
  }
  .exit-all{
    margin-left: 15px;
    cursor: pointer;
  }
}
</style>
